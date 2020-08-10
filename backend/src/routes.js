//esse arquivo tem como responsabilidade cadastrar as rotas da aplicação

const express = require("express");
//criando o roteirizador
const routes = express.Router();

const alunoController = require("./controllers/aluno")

routes.get("/alunos", alunoController.listar);
routes.get("/alunos/:id", alunoController.buscarPorId);
routes.post("/alunos", alunoController.store);

module.exports = routes;