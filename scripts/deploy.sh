#!/bin/bash

# 🚀 Script de Deploy Automático - ProRevest V5
# Para HestiaCP com domínio prorevesttintas.com.br

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis de configuração
DOMAIN="prorevesttintas.com.br"
USER="prorevest"
REPO_URL="https://github.com/OARANHA/PROREVEST-V5.git"
DEPLOY_DIR="/home/$USER/web/$DOMAIN/private/deploy"
PUBLIC_DIR="/home/$USER/web/$DOMAIN/public_html"
BACKUP_DIR="/home/$USER/web/$DOMAIN/private/backups"
LOG_DIR="/home/$USER/web/$DOMAIN/private/logs"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/deploy_$DATE.log"

# Função de log
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# Função para verificar se comando executou com sucesso
check_success() {
    if [ $? -eq 0 ]; then
        log "✅ $1"
    else
        log_error "❌ $1"
        exit 1
    fi
}

# Início do deploy
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    🚀 DEPLOY PROREVEST V5                    ║${NC}"
echo -e "${BLUE}║                     Domínio: $DOMAIN                     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Criar diretórios necessários
log "📁 Criando estrutura de diretórios..."
mkdir -p "$DEPLOY_DIR" "$BACKUP_DIR" "$LOG_DIR"
check_success "Diretórios criados"

# Verificar se usuário existe
if ! id "$USER" &>/dev/null; then
    log_error "Usuário $USER não existe no sistema"
    exit 1
fi
log "✅ Usuário $USER verificado"

# Verificar conectividade com GitHub
log "🌐 Verificando conectividade com GitHub..."
if ! curl -s --head "$REPO_URL" | grep -q "200 OK"; then
    log_error "Não foi possível acessar o repositório GitHub"
    exit 1
fi
check_success "Conectividade GitHub OK"

# Criar backup do atual
log "📦 Criando backup do site atual..."
if [ -d "$PUBLIC_DIR" ] && [ "$(ls -A $PUBLIC_DIR)" ]; then
    BACKUP_FILE="$BACKUP_DIR/backup_$DATE.tar.gz"
    tar -czf "$BACKUP_FILE" -C "$PUBLIC_DIR" .
    check_success "Backup criado: $BACKUP_FILE"
    
    # Manter apenas últimos 5 backups
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f | sort -r | tail -n +6 | xargs -r rm
    log "🧹 Backups antigos removidos"
else
    log_warning "Diretório public_html vazio ou não existe, pulando backup"
fi

# Clonar repositório
log "📥 Clonando repositório do GitHub..."
rm -rf "$DEPLOY_DIR"
git clone "$REPO_URL" "$DEPLOY_DIR" --depth 1
check_success "Repositório clonado"

cd "$DEPLOY_DIR" || exit 1

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    log_error "Node.js não está instalado"
    exit 1
fi

log_info "Node.js version: $(node --version)"
log_info "NPM version: $(npm --version)"

# Instalar dependências
log "📦 Instalando dependências de produção..."
npm ci --only=production --silent
check_success "Dependências instaladas"

# Verificar variáveis de ambiente
log "🔧 Verificando variáveis de ambiente..."
if [ ! -f ".env.production" ]; then
    log_warning "Arquivo .env.production não encontrado"
    log_info "Criando .env.production com valores padrão..."
    
    cat > .env.production << EOF
VITE_SUPABASE_URL=\${VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=\${VITE_SUPABASE_ANON_KEY}
VITE_SITE_URL=https://$DOMAIN
VITE_APP_NAME=ProRevest Tintas
VITE_APP_DESCRIPTION=Tintas premium para transformar seus ambientes
VITE_NODE_ENV=production
EOF
    
    log_warning "⚠️  Configure as variáveis de ambiente no arquivo .env.production"
fi

# Build da aplicação
log "🔨 Buildando aplicação para produção..."
NODE_ENV=production npm run build
check_success "Build concluído com sucesso"

# Verificar se build foi gerado
if [ ! -d "build" ] || [ -z "$(ls -A build)" ]; then
    log_error "Build falhou - diretório build não encontrado ou vazio"
    exit 1
fi

# Verificar arquivos críticos
CRITICAL_FILES=("index.html")
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "build/$file" ]; then
        log_error "Arquivo crítico não encontrado no build: $file"
        exit 1
    fi
done
log "✅ Arquivos críticos verificados"

# Copiar arquivos para public_html
log "📁 Copiando arquivos para public_html..."
rm -rf "$PUBLIC_DIR"/*
cp -r build/* "$PUBLIC_DIR/"
check_success "Arquivos copiados para public_html"

# Copiar .htaccess se existir
if [ -f ".htaccess" ]; then
    cp .htaccess "$PUBLIC_DIR/"
    log "✅ .htaccess copiado"
fi

# Criar robots.txt se não existir
if [ ! -f "$PUBLIC_DIR/robots.txt" ]; then
    cat > "$PUBLIC_DIR/robots.txt" << EOF
User-agent: *
Allow: /
Sitemap: https://$DOMAIN/sitemap.xml
EOF
    log "✅ robots.txt criado"
fi

# Ajustar permissões
log "🔐 Ajustando permissões dos arquivos..."
chown -R $USER:$USER "$PUBLIC_DIR"
chmod -R 755 "$PUBLIC_DIR"
find "$PUBLIC_DIR" -type f -exec chmod 644 {} \;
check_success "Permissões ajustadas"

# Verificar tamanho dos arquivos
SITE_SIZE=$(du -sh "$PUBLIC_DIR" | cut -f1)
log_info "Tamanho total do site: $SITE_SIZE"

# Limpar cache e arquivos temporários
log "🧹 Limpando arquivos temporários..."
rm -rf "$DEPLOY_DIR"
rm -rf node_modules/.cache
check_success "Cache limpo"

# Testar se site está acessível
log "🌐 Testando acessibilidade do site..."
sleep 5  # Aguardar Nginx processar

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" --max-time 30)
if [ "$HTTP_CODE" = "200" ]; then
    log "✅ Site acessível (HTTP $HTTP_CODE)"
else
    log_warning "⚠️  Site retornou HTTP $HTTP_CODE"
    
    # Verificar se existe página de erro
    if [ "$HTTP_CODE" = "404" ] || [ "$HTTP_CODE" = "403" ]; then
        log_info "Verificando configuração do Nginx..."
        # Aqui poderia adicionar comandos para restartar Nginx se necessário
    fi
fi

# Testar health endpoint
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/health" --max-time 10)
if [ "$HEALTH_CODE" = "200" ]; then
    log "✅ Health check passando"
else
    log_info "Health endpoint não configurado (HTTP $HEALTH_CODE)"
fi

# Informações do deploy
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                      ✅ DEPLOY CONCLUÍDO                       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
log_info "🌐 Site disponível em: https://$DOMAIN"
log_info "📝 Log do deploy: $LOG_FILE"
log_info "📦 Backup: $BACKUP_DIR/backup_$DATE.tar.gz"
log_info "📊 Tamanho do site: $SITE_SIZE"
echo ""

# Resumo estatístico
FILE_COUNT=$(find "$PUBLIC_DIR" -type f | wc -l)
log_info "📁 Total de arquivos: $FILE_COUNT"

# Verificar arquivos principais
MAIN_FILES=("index.html" "assets/")
echo -e "${BLUE}📋 Arquivos principais:${NC}"
for item in "${MAIN_FILES[@]}"; do
    if [ -e "$PUBLIC_DIR/$item" ]; then
        echo -e "   ${GREEN}✅${NC} $item"
    else
        echo -e "   ${RED}❌${NC} $item"
    fi
done

echo ""
log_info "🚀 ProRevest V5 está no ar!"

# Comandos úteis para o usuário
echo ""
echo -e "${YELLOW}📋 Comandos úteis:${NC}"
echo -e "   Verificar logs:     tail -f $LOG_FILE"
echo -e "   Backup manual:      $BACKUP_DIR/backup_$DATE.tar.gz"
echo -e "   Restart Nginx:      systemctl restart nginx"
echo -e "   Testar site:        curl -I https://$DOMAIN"
echo ""

exit 0
