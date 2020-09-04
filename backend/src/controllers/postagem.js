const Postagem = require("../models/Postagem");
const { store, delete:id } = require("./aluno");
const Aluno = require("../models/Aluno");

module.exports = {

    async index(req, res) {

        const postagens = await Postagem.findAll({
            include: {
                association: "Aluno",
                attributes: ["id", "nome", "ra"],
            },
            order: [["created_at", "DESC"]],
        });

        res.send(postagens);

    },

    async store(req, res) {
        const created_aluno_id = req.alunoId;

        const {firebaseUrl} = req.file ? req.file : "";

        const { titulo, descricao, gists } = req.body;

        try {
            const aluno = await Aluno.findByPk(created_aluno_id);

            if(!aluno){
                res.status(404).send({erro: "Aluno não encontrado"});
            }

            let postagem = await aluno.createPostagem({
                titulo, descricao, imagem: firebaseUrl, gists,
            });

            res.status(201).send(postagem);
        } catch (error) {
            console.log(error);
            return res.status(500).send({erro: "Não foi possível adcionar a postagem, tente novamente"})
        }
    },

    async delete(req, res) {
        const token = req.headers.authorization;
        const [Bearer, created_aluno_id] = token.split(" ");

        const {id} = req.params;
        let postagem = await Postagem.findByPk(id);

        if(!postagem){
            return res.status(404).send({erro: "Postagem não encontrada"})
        }

        if(postagem.created_aluno_id != created_aluno_id){
            return res.status(401).send({erro: "Você não tem permissão de excluir essa postagem"})
        }
        
        await postagem.destroy();

        res.status(204).send();
    }
}