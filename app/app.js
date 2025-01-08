const drachtio = require('drachtio-server');
const app = drachtio();
const Srf = require('drachtio-srf');
const srf = new Srf(app);

srf.connect({
    host: 'localhost', // Endereço do seu servidor drachtio (provavelmente 'drachtio' se usar docker-compose)
    port: 9022,       // Porta de administração do drachtio
    secret: 'cymru' // Senha configurada no drachtio.conf.xml
});

srf.on('connect', (err, hostport) => {
    if (err) {
        console.error('Erro ao conectar ao drachtio-server:', err);
    } else {
        console.log(`Conectado ao drachtio-server em: ${hostport}`);
    }
});

srf.on('error', (err) => {
    console.error('Erro de conexão com o drachtio-server:', err);
});

srf.invite((req, res) => {
    const dynamicId = req.uri.split('@')[0].split(':')[1];
    const newUri = `sip:${dynamicId}@5t4n6j0wnrl.sip.livekit.cloud`;

    console.log(`Redirecionando chamada de ${req.callingNumber} para ${newUri}`);

    srf.createB2BUA(req, res, newUri, {
        // Opções adicionais, se necessário
    })
    .then(({uas, uac}) => {
        console.log('Chamada redirecionada com sucesso.');
        uas.on('destroy', () => {
            console.log('Chamada original (UAS) finalizada.');
            uac.destroy();
        });
        uac.on('destroy', () => {
            console.log('Chamada redirecionada (UAC) finalizada.');
            uas.destroy();
        });
    })
    .catch((err) => {
        console.error('Erro ao redirecionar a chamada:', err);
        res.send(500);
    });
});

// Inicia um servidor HTTP simples para lidar com as requisições do drachtio-server
const express = require('express');
const httpServer = express();
const PORT = 3000;

httpServer.get('/', (req, res) => {
    console.log('Requisição HTTP recebida:', req.query);
    res.json({
        "route": {
          "uri": "localhost:9022" // Endereço e porta do seu app
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
});
