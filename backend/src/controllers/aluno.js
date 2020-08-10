const { Op } = require("sequelize");
const Aluno = require("../models/Aluno");

module.exports = {
    async listar(req, res){
        const alunos = await Aluno.findAll();

        res.send(alunos);
    },

    //buscar um aluno pelo id
    async buscarPorId(req, res){
        const {id} = req.params;
        
        //busca o aluno pela chave
        const aluno = await Aluno.findByPk(id, {raw: true});

        //verifica se o aluno foi encontrado
        if(!aluno){
           return res.status(404).send({erro: "Aluno não encontrado"})
        }

        delete aluno.senha;

        //retorna o aluno encontrado
        res.send(aluno);
    },
    
    //inserções
    async store(req, res){
        const { ra, nome, email, senha } = req.body;

        let aluno = await Aluno.findOne({
            where: {
                [Op.or]: [
                    {ra: ra},
                    {email: email}
                ]
            },
        });

        if(aluno){
            return res.status(400).send({erro: "aluno já cadastrado"})
        }

        aluno = await Aluno.create({ ra, nome, email: email, senha });
        
        res.status(201).send(aluno);
    },

    update(){

    },
    delete(){

    }
}