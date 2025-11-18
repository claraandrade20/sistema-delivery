import fs from "fs";

export function lerJSON(caminho) {
  const dados = fs.readFileSync(caminho, "utf8");
  return JSON.parse(dados);
}

export function salvarJSON(caminho, conteudo) {
  fs.writeFileSync(caminho, JSON.stringify(conteudo, null, 2), "utf8");
}
