"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerJSON = lerJSON;
exports.salvarJSON = salvarJSON;
const fs_1 = __importDefault(require("fs"));
function lerJSON(caminho) {
    const dados = fs_1.default.readFileSync(caminho, "utf8");
    return JSON.parse(dados);
}
function salvarJSON(caminho, conteudo) {
    fs_1.default.writeFileSync(caminho, JSON.stringify(conteudo, null, 2), "utf8");
}
//# sourceMappingURL=fileUtils.js.map