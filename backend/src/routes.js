//esse arquivo tem como responsabilidade cadastrar as rotas da aplicação

const express = require("express");

const multer = require("multer");

const Multer = multer({
    storage: multer.memoryStorage(),
    limits: 1024 * 1024,
});

const autorizacaoMid = require("../src/middlewares/autorizacao");
const uploadImage = require("./services/firebase");

//criando o roteirizador
const routes = express.Router();

const alunoController = require("./controllers/aluno");
const postagemController = require("./controllers/postagem");
const comentarioController = require("./controllers/comentario");
const sessaoController = require("./controllers/sessao");

//rotas públicas
routes.post("/sessao", sessaoController.store);
routes.post("/alunos", alunoController.store);

routes.use(autorizacaoMid);


//rotas privadas
//rotas de usuarios
routes.get("/alunos", alunoController.listar);
routes.get("/alunos/:id", alunoController.buscarPorId);

//rotas de postagem
routes.get("/postagens", postagemController.index);
routes.post("/postagens", Multer.single("imagem"), uploadImage, postagemController.store);
routes.delete("/postagens/:id", postagemController.delete);

//rotas de comentarios 
routes.post("/postagens/:postId/comentarios", comentarioController.store);
routes.get("/postagens/:postId/comentarios", comentarioController.index);

module.exports = routes;