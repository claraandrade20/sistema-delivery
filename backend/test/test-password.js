const bcrypt = require('bcryptjs');

const hash = '$2a$10$tzBGDjKirxR7cDBWgHDN7O3xivNrQgnxgeVI6hXGKgNRz7DmxaNX6';

const senhasTestar = ['123456', 'test', 'password', 'senha', '1234', '000000', 'admin'];

console.log('Testando senhas contra o hash de usuarios.json:\n');

senhasTestar.forEach(senha => {
  const resultado = bcrypt.compareSync(senha, hash);
  console.log(`Senha: "${senha}" -> ${resultado ? 'FUNCIONA' : 'NÃO FUNCIONA'}`);
});

// Se nenhuma funcionar, vamos gerar um novo hash para teste
console.log('\nGerando novo hash para senha "123456":');
const novoHash = bcrypt.hashSync('123456', 10);
console.log('Novo hash:', novoHash);
console.log('Testando novo hash com "123456":', bcrypt.compareSync('123456', novoHash));
