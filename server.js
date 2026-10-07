import express from 'express';
import path from 'path';
import { render } from './app/server.tsx';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Servir arquivos estáticos do build/client
app.use(express.static(path.join(__dirname, 'build/client')));

// Servir arquivos estáticos da pasta public também
app.use(express.static(path.join(__dirname, 'public')));

// Handler para todas as rotas SSR
app.get('*', async (req, res) => {
  try {
    const response = await render(req);
    res.status(200).send(response);
  } catch (error) {
    console.error('Erro no render:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Servindo arquivos estáticos de: ${path.join(__dirname, 'build/client')}`);
});
