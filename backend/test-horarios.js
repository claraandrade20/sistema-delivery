// Teste da API de horários
const http = require('http');

function testHorarios() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/horarios/1',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Resposta:', data);
      try {
        const parsed = JSON.parse(data);
        console.log('JSON Parsed:', JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('Erro ao fazer parse JSON:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Erro na requisição:', error);
  });

  req.end();
}

testHorarios();
