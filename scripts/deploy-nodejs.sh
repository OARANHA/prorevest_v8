#!/bin/bash

# Script de Deploy para Node.js VPS
# Uso: ./scripts/deploy-nodejs.sh

set -e  # Parar em caso de erro

# Configurações
VPS_IP="194.163.167.131"
VPS_USER="root"
PROJECT_DIR="/home/ProRevest/web/prorevesttintas.com.br/private/repo"
APP_NAME="prorevest-app"
LOCAL_DIR="$(pwd)"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar configuração
check_config() {
    log_info "Verificando configuração..."
    
    if [ "$VPS_IP" = "SUA_VPS_IP" ]; then
        log_error "Por favor, configure VPS_IP no script"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        log_error "package.json não encontrado. Execute no diretório do projeto."
        exit 1
    fi
    
    log_success "Configuração verificada"
}

# Build local
build_local() {
    log_info "Fazendo build local..."
    
    # Limpar build anterior
    rm -rf build/
    
    # Instalar dependências
    npm ci --legacy-peer-deps
    
    # Fazer build
    npm run build
    
    if [ ! -d "build" ]; then
        log_error "Build falhou - diretório build não criado"
        exit 1
    fi
    
    log_success "Build local concluído"
}

# Testar conexão com VPS
test_connection() {
    log_info "Testando conexão com VPS..."
    
    if ssh -o ConnectTimeout=10 $VPS_USER@$VPS_IP "echo 'Conexão OK'" > /dev/null 2>&1; then
        log_success "Conexão com VPS estabelecida"
    else
        log_error "Não foi possível conectar à VPS $VPS_IP"
        exit 1
    fi
}

# Preparar ambiente na VPS
prepare_vps() {
    log_info "Preparando ambiente na VPS..."
    
    ssh $VPS_USER@$VPS_IP << 'EOF'
        # Criar diretórios necessários
        mkdir -p /var/www/prorevest
        mkdir -p /var/log/prorevest
        
        # Verificar Node.js
        if ! command -v node &> /dev/null; then
            echo "Node.js não encontrado. Instalando..."
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            apt-get install -y nodejs
        fi
        
        # Verificar PM2
        if ! command -v pm2 &> /dev/null; then
            echo "PM2 não encontrado. Instalando..."
            npm install -g pm2
        fi
        
        # Verificar Nginx
        if ! command -v nginx &> /dev/null; then
            echo "Nginx não encontrado. Instalando..."
            apt update
            apt install nginx -y
            systemctl start nginx
            systemctl enable nginx
        fi
        
        echo "Ambiente preparado"
EOF
    
    log_success "Ambiente na VPS preparado"
}

# Upload de arquivos
upload_files() {
    log_info "Enviando arquivos para VPS..."
    
    # Verificar se rsync está disponível, senão usar scp
    if command -v rsync &> /dev/null; then
        log_info "Usando rsync para upload..."
        # Upload do build
        rsync -avz --delete build/ $VPS_USER@$VPS_IP:$PROJECT_DIR/
        
        # Upload de arquivos necessários
        rsync -avz package.json $VPS_USER@$VPS_IP:$PROJECT_DIR/
        rsync -avz package-lock.json $VPS_USER@$VPS_IP:$PROJECT_DIR/
        
        # Upload de variáveis de ambiente se existir
        if [ -f ".env.production" ]; then
            rsync -avz .env.production $VPS_USER@$VPS_IP:$PROJECT_DIR/.env
            log_info "Arquivo .env.production enviado"
        fi
        
        # Upload do ecosystem.config.js se existir
        if [ -f "ecosystem.config.js" ]; then
            rsync -avz ecosystem.config.js $VPS_USER@$VPS_IP:$PROJECT_DIR/
            log_info "Arquivo ecosystem.config.js enviado"
        fi
    else
        log_info "rsync não encontrado, usando SCP para upload..."
        # Criar diretório temporário na VPS
        ssh $VPS_USER@$VPS_IP "mkdir -p $PROJECT_DIR/temp_upload"
        
        # Upload do build usando scp
        scp -r build/* $VPS_USER@$VPS_IP:$PROJECT_DIR/temp_upload/
        
        # Mover arquivos do temp para o destino
        ssh $VPS_USER@$VPS_IP "cd $PROJECT_DIR && rm -rf client server 2>/dev/null || true && mv temp_upload/* . && rm -rf temp_upload"
        
        # Upload de arquivos necessários
        scp package.json $VPS_USER@$VPS_IP:$PROJECT_DIR/
        scp package-lock.json $VPS_USER@$VPS_IP:$PROJECT_DIR/
        
        # Upload de variáveis de ambiente se existir
        if [ -f ".env.production" ]; then
            scp .env.production $VPS_USER@$VPS_IP:$PROJECT_DIR/.env
            log_info "Arquivo .env.production enviado"
        fi
        
        # Upload do ecosystem.config.js se existir
        if [ -f "ecosystem.config.js" ]; then
            scp ecosystem.config.js $VPS_USER@$VPS_IP:$PROJECT_DIR/
            log_info "Arquivo ecosystem.config.js enviado"
        fi
    fi
    
    log_success "Arquivos enviados com sucesso"
}

# Instalar dependências na VPS
install_dependencies() {
    log_info "Instalando dependências na VPS..."
    
    ssh $VPS_USER@$VPS_IP "cd $PROJECT_DIR && npm ci --production"
    
    log_success "Dependências instaladas"
}

# Configurar PM2
configure_pm2() {
    log_info "Configurando PM2..."
    
    ssh $VPS_USER@$VPS_IP << EOF
        cd $PROJECT_DIR
        
        # Criar ecosystem.config.js se não existir
        if [ ! -f "ecosystem.config.js" ]; then
            cat > ecosystem.config.js << 'EOFF'
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$PROJECT_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/prorevest/error.log',
    out_file: '/var/log/prorevest/out.log',
    log_file: '/var/log/prorevest/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOFF
        fi
        
        # Iniciar ou reiniciar aplicação
        if pm2 list | grep -q "$APP_NAME"; then
            pm2 restart $APP_NAME
        else
            pm2 start ecosystem.config.js
        fi
        
        # Salvar configuração
        pm2 save
        pm2 startup
        
        echo "PM2 configurado"
EOF
    
    log_success "PM2 configurado"
}

# Configurar Nginx
configure_nginx() {
    log_info "Configurando Nginx..."
    
    # Perguntar domínio
    read -p "Digite o domínio (ex: seu-dominio.com): " DOMAIN
    
    if [ -z "$DOMAIN" ]; then
        log_warning "Domínio não fornecido. Pulando configuração do Nginx."
        return
    fi
    
    ssh $VPS_USER@$VPS_IP << EOF
        # Criar configuração do site
        cat > /etc/nginx/sites-available/prorevest << 'EOFF'
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOFF
        
        # Habilitar site
        ln -sf /etc/nginx/sites-available/prorevest /etc/nginx/sites-enabled/
        
        # Remover site default
        rm -f /etc/nginx/sites-enabled/default
        
        # Testar configuração
        nginx -t
        
        # Recarregar Nginx
        systemctl reload nginx
        
        echo "Nginx configurado para $DOMAIN"
EOF
    
    log_success "Nginx configurado para $DOMAIN"
    
    # Perguntar sobre SSL
    read -p "Deseja configurar SSL gratuito com Let's Encrypt? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        setup_ssl "$DOMAIN"
    fi
}

# Configurar SSL
setup_ssl() {
    local domain="$1"
    
    log_info "Configurando SSL para $domain..."
    
    ssh $VPS_USER@$VPS_IP << EOF
        # Instalar Certbot se não existir
        if ! command -v certbot &> /dev/null; then
            apt update
            apt install certbot python3-certbot-nginx -y
        fi
        
        # Obter certificado
        certbot --nginx -d $domain -d www.$domain --non-interactive --agree-tos --email admin@$domain
        
        # Configurar renovação automática
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
        
        echo "SSL configurado para $domain"
EOF
    
    log_success "SSL configurado para $domain"
}

# Verificar deploy
verify_deploy() {
    log_info "Verificando deploy..."
    
    # Verificar status PM2
    ssh $VPS_USER@$VPS_IP "pm2 status $APP_NAME"
    
    # Verificar se aplicação está respondendo
    if ssh $VPS_USER@$VPS_IP "curl -f http://localhost:3000 > /dev/null 2>&1"; then
        log_success "Aplicação está respondendo localmente"
    else
        log_error "Aplicação não está respondendo localmente"
        return 1
    fi
    
    log_success "Deploy verificado com sucesso"
}

# Mostrar informações finais
show_info() {
    log_info "Informações do deploy:"
    
    echo
    echo "📊 Status PM2:"
    ssh $VPS_USER@$VPS_IP "pm2 status $APP_NAME"
    
    echo
    echo "📝 Logs PM2:"
    echo "Para ver logs: ssh $VPS_USER@$VPS_IP 'pm2 logs $APP_NAME'"
    
    echo
    echo "🔧 Comandos úteis:"
    echo "Reiniciar: ssh $VPS_USER@$VPS_IP 'pm2 restart $APP_NAME'"
    echo "Status: ssh $VPS_USER@$VPS_IP 'pm2 status'"
    echo "Logs: ssh $VPS_USER@$VPS_IP 'pm2 logs $APP_NAME'"
    echo "Monitorar: ssh $VPS_USER@$VPS_IP 'pm2 monit'"
    
    echo
    echo "🌐 Acesso:"
    echo "Local: http://localhost:3000 (na VPS)"
    echo "Externo: http://$VPS_IP:3000"
    
    if [ -n "$DOMAIN" ]; then
        echo "Domínio: http://$DOMAIN"
        if ssh $VPS_USER@$VPS_IP "test -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem"; then
            echo "HTTPS: https://$DOMAIN ✅"
        fi
    fi
}

# Função principal
main() {
    echo "🚀 Script de Deploy para Node.js VPS"
    echo "=================================="
    echo
    
    check_config
    build_local
    test_connection
    prepare_vps
    upload_files
    install_dependencies
    configure_pm2
    configure_nginx
    verify_deploy
    show_info
    
    echo
    log_success "Deploy concluído com sucesso! 🎉"
}

# Executar main
main "$@"
