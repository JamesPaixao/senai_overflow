const express = require('express');
const cors = require("cors");
const rotas = require("./routes")
require("./database");

//iniciando a aplicação
const app = express();

app.use(cors());

//nas requisições pode ter corpos no formato JSON
app.use(express.json());

//cadastrando as rotas
app.use(rotas);

module.exports = app;