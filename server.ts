import express from 'express';
import * as fs from 'fs';
import path from 'path';

const app = express();
const porta = 3000;

interface Resultado {
    nome: string;
    status: number | string;
    ok: boolean;
    tempo: number;
    data: string;
}

// Função principal de monitoramento e geração de dados
async function obterDashboard() {
    try {
        const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
        const template = fs.readFileSync('template.html', 'utf-8');

        // 1. Check das APIs
        const novosResultados: Resultado[] = await Promise.all(config.alvos.map(async (alvo: any) => {
            const inicio = Date.now();
            try {
                const res = await fetch(alvo.url);
                return { 
                    nome: alvo.nome, 
                    status: res.status, 
                    ok: res.ok, 
                    tempo: Date.now() - inicio,
                    data: new Date().toLocaleString()
                };
            } catch (e) {
                return { nome: alvo.nome, status: "OFFLINE", ok: false, tempo: 0, data: new Date().toLocaleString() };
            }
        }));

        // 2. Lógica de Histórico
        let historico: Resultado[] = [];
        if (fs.existsSync('historico.json')) {
            historico = JSON.parse(fs.readFileSync('historico.json', 'utf-8'));
        }

        historico = [...novosResultados, ...historico].slice(0, 20);
        fs.writeFileSync('historico.json', JSON.stringify(historico, null, 2));

        // 3. Montando o HTML
        let cardsHtml = "";
        novosResultados.forEach(res => {
            const cor = res.ok ? "#22c55e" : "#ef4444";
            cardsHtml += `
                <div style="border-left: 10px solid ${cor}; background: #1e293b; padding: 15px; margin: 10px; border-radius: 8px; color: white; font-family: sans-serif;">
                    <h3>${res.nome}</h3>
                    <p>Status: ${res.status} | Latência: ${res.tempo}ms</p>
                </div>`;
        });

        let tabelaHtml = `
            <div style="color: white; font-family: sans-serif; padding: 10px;">
                <h3>📜 Últimos Eventos</h3>
                <table style="width:100%; border-collapse: collapse; font-size: 0.9em;">
                    <tr style="background: #334155; text-align: left;">
                        <th style="padding: 8px;">Hora</th>
                        <th>Serviço</th>
                        <th>Status</th>
                        <th>Resposta</th>
                    </tr>`;
        
        historico.forEach(h => {
            tabelaHtml += `
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 8px;">${h.data}</td>
                    <td>${h.nome}</td>
                    <td style="color:${h.ok ? '#22c55e' : '#ef4444'}">${h.status}</td>
                    <td>${h.tempo}ms</td>
                </tr>`;
        });
        tabelaHtml += `</table></div>`;

        // Injeta os dados no template e adiciona um script de auto-refresh de 5 segundos
        return template
            .replace('', cardsHtml + tabelaHtml)
            .replace('', new Date().toLocaleTimeString())
            + `<script>setTimeout(() => location.reload(), 5000)</script>`;

    } catch (err) {
        return `<h1>Erro no Servidor</h1><p>${err}</p>`;
    }
}

// Rota para acessar pelo navegador
app.get('/', async (req, res) => {
    console.log("🛰️ Monitorando e atualizando dashboard...");
    const html = await obterDashboard();
    res.send(html);
});

app.listen(porta, () => {
    console.log(`
    🚀 Sentinela Online!
    📍 Acesse: http://localhost:${porta}
    📂 Histórico sendo salvo em: historico.json
    `);
});