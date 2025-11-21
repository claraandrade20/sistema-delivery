const bcrypt = require('bcryptjs');

const hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const password = '123456';

const resultado = bcrypt.compareSync(password, hash);

console.log('Hash:', hash);
console.log('Senha:', password);
console.log('Resultado:', resultado);

// Testar gerando um novo hash
const novoHash = bcrypt.hashSync(password, 10);
console.log('Novo hash gerado:', novoHash);
console.log('Novo hash funciona:', bcrypt.compareSync(password, novoHash));
