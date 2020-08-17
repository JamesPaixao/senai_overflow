const Comentario = require("../models/Comentario");
const { store } = require("./aluno");
const Postagem = require("../models/Postagem");

module.exports = { 
    async index (req, res){
        const { postId } = req.params;

        try {
            const postagem = await Postagem.findByPk(postId);
            
            if(!postagem){
                return res.status(404).send({erro: "Postagem não encontrada"});
            }
            const comentarios = await postagem.getComentarios({
                include: {
                    association: "Aluno",
                    attributes: ["id", "nome"],
                },
                attributes: ["id", "descricao"],
                order: [["created_at", "ASC"]],
            });

            res.send(comentarios);
        } 
        catch (error) {
            console.log(error);
        }
    },

    async store(req, res) {
        const token = req.headers.authorization;
        const [Bearer, alunoId] = token.split(" ");
        
        const {postId} = req.params;
        
        const { descricao } = req.body;

        const postagem = await Postagem.findByPk(postId);
        
        if(!postagem){
            return res.status(404).send({erro: "Postagem não encontrada"});
        }
        
        let comentario = await postagem.createComentario({
            descricao,
            aluno_id: alunoId,
        });

        comentario = comentario.dataValues;

        comentario.postagem_id = comentario.PostagemId;
        delete comentario.PostagemId;
        delete comentario.AlunoId;

        res.status(201).send(comentario);
      },
}