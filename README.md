# 🛰️ Sentinela: API Health Monitor

O **Sentinela** é uma ferramenta leve e eficiente para monitoramento de integridade (uptime) e latência de serviços web. O projeto utiliza Node.js e TypeScript para realizar requisições assíncronas e fornecer um dashboard visual para acompanhamento em tempo real.

## 🚀 Funcionalidades
- **Monitoramento em Tempo Real:** Checagem automática de múltiplas URLs simultaneamente.
- **Histórico de Eventos:** Persistência dos últimos 20 estados em um arquivo `historico.json`.
- **Dashboard Web:** Interface servida via Express na porta 3000 com auto-refresh a cada 5 segundos.
- **Métricas de Latência:** Cálculo do tempo de resposta de cada serviço.

## 🛠️ Tecnologias Utilizadas
- [Node.js](https://nodejs.org/) - Ambiente de execução.
- [TypeScript](https://www.typescriptlang.org/) - Superset para tipagem estática e segurança do código.
- [Express](https://expressjs.com/) - Framework web para servir o dashboard.
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Para requisições HTTP.

## 📦 Como Instalar e Rodar

git clone https://github.com/Pedro-F7/API-health-sentinel-.git
cd API-health-sentinel-
npm install
