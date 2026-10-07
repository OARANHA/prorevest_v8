module.exports = {
  apps: [{
    name: 'prorevest-app',
    script: 'npm',
    args: 'start',
    cwd: '/home/ProRevest/web/prorevesttintas.com.br/nodeapp',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      SUPABASE_URL: 'https://gtfvhktgxqtdrnaxizch.supabase.co',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      VITE_SUPABASE_URL: 'https://gtfvhktgxqtdrnaxizch.supabase.co',
      VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      VITE_SITE_URL: 'https://prorevesttintas.com.br',
      VITE_NODE_ENV: 'production'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      SUPABASE_URL: 'https://gtfvhktgxqtdrnaxizch.supabase.co',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      VITE_SUPABASE_URL: 'https://gtfvhktgxqtdrnaxizch.supabase.co',
      VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      VITE_SITE_URL: 'https://prorevesttintas.com.br',
      VITE_NODE_ENV: 'production'
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'build'],
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    listen_timeout: 3000,
    autorestart: true
  }]
};
