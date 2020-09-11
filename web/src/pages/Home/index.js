import React, { useEffect, useState, useRef } from 'react';
import './styles.css'
import { FiGithub, FiLogOut } from "react-icons/fi"
import fotoPerfil from "../../assets/foto_perfil.png"
import imgPost from "../../assets/post-exemplo.jpg"
import { signOut, getAluno } from '../../services/security';
import { useHistory } from 'react-router-dom';
import { api } from '../../services/api';
import PopUp from '../../components/PopUp';
import moment from 'moment';

const CardPost = ({post}) => {

    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState([]);
    
    const carregarComentario = async () => {
        try {
            if(!mostrarComentarios){
                const retorno = await api.get(`postagens/${post.id}/comentarios`);
                setComentarios(retorno.data);
            }
            setMostrarComentarios(!mostrarComentarios);
        } catch (error) {
            console.log(error);
        }
    }

    const criarComentario = async (e) => {
        e.preventDefault();

        try {
            const retorno = await api.post(`/postagens/${post.id}/comentarios`, 
            {descricao: novoComentario});

            let comentario = retorno.data;

            comentario.Aluno = getAluno();

            setComentarios([...comentarios, comentario]);

            setNovoComentario("");
        } catch (error) {
            console.log(error);
        }
    }

    const alunoSessao = getAluno();

    return(
        <div className="card-post">
            <header>
                <img src={fotoPerfil} alt="Foto de Perfil"></img>
                <strong>Por {post.Aluno.id === alunoSessao.alunoId ? " você" : post.Aluno.nome}</strong>
                <p>{moment(post.createdAt).locale("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")}</p>
                {/* renderização condicional, só mostra o ícone se o gists for verdadeiro */}
                {post.gists && (<FiGithub className="icon" size="25" color="green"/>)}
            </header>
            <section>
                <strong>
                    {post.titulo}
                </strong>
                <p> {post.descricao} </p>
                {post.imagem && <img src={post.imagem} alt="Imagem do post"></img>}
            </section>
            <footer>
                <h1 onClick={carregarComentario}>Comentários</h1>
                {mostrarComentarios && (
                    <>
                        {comentarios.length === 0 && (<p>Seja o primeiro a comentar</p>)}
                        {comentarios.map((c) => (
                            <section key={c.id}>
                            <header>
                            <img src={fotoPerfil} alt="Foto de Perfil"></img>
                            <strong>{c.Aluno.nome}</strong>
                            <p>{c.created_at}</p>
                            </header>
                            <p>
                                {c.descricao}
                            </p>
                        </section>
                        ))} 
                        <form className="novo-comentario" onSubmit={criarComentario}>
                            <textarea value={novoComentario}
                            onChange={(e) => {
                                setNovoComentario(e.target.value);
                            }}
                            placeholder="Comente essa dúvida" required></textarea>
                            <button>Enviar</button>
                        </form>
                    </>
                )} 
            </footer>
        </div>
    )
};

const NovaPostagem = ({setMostrarNovaPostagem}, {carregarPostagens}) => {
    const [novaPostagem, setNovaPostagem] = useState({
        titulo: "",
        descricao: "",
        gists: "",
    });

    const imgRef = useRef();

    const [imagem, setImagem] = useState(null);


    const fechar = () => {
        const {titulo, descricao, gists} = novaPostagem;

        if((titulo || descricao || gists) && !window.confirm("Tem certeza que quer abandonar a dúvida?")){
            return;
        }
        setMostrarNovaPostagem(false);
    };

    const enviar = async (e) => {
        e.preventDefault();

        const dados = new FormData();

        dados.append("titulo", novaPostagem.titulo);
        dados.append("descricao", novaPostagem.descricao);
        dados.append("gists", novaPostagem.gists);
        dados.append("imagem", imagem);

        try {
            await api.post("/postagens", dados, {
                headers: {
                    "Content-type": `multipart/form-data`,
                },
            });

            carregarPostagens();

            setMostrarNovaPostagem(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handlerInput = (e) => {
        setNovaPostagem({...novaPostagem, [e.target.id]: e.target.value});
    };

    const handlerImagem = (e) => {
        if(e.target.files[0]){
            imgRef.current.src = URL.createObjectURL(e.target.files[0]);
            imgRef.current.style.display = "block";
        }
        else{
            imgRef.current.src = "";
            imgRef.current.style.display = "none";
        }
        setImagem(e.target.files[0]);
    };
    
    return (<PopUp>
        <form className="nova-postagem" onSubmit={enviar}>
            <span onClick={fechar}>&times;</span>
            <h1>Publique suas dúvidas</h1>
            <label>Titulo</label>
            <input type="text" placeholder="Sobre o que é sua dúvida" id="titulo" onChange={handlerInput}/>
            <label>Descrição</label>
            <textarea placeholder="Descreva em detalhe, o que te aflige?" id="descricao" onChange={handlerInput}/>
            <label>Gist <em>(Opcional)</em></label>
            <input type="text"  id="gists" placeholder="https://gist.github.com/robertkowalski/884f7855499ddd702e4c137081234a1c.js" onChange={handlerInput}/>
            <label htmlFor="inputImagem">Imagem <em>(Opcional)</em></label>
            <input id="inputImagem" type="file" onChange={handlerImagem}/>
            <img alt="preview" ref={imgRef}/>
            <button>Enviar</button>
        </form>
    </PopUp>
    )
};

function Home() {
    const history = useHistory();
    const [postagens, setPostagens] = useState([]);
    const [mostrarNovaPostagem, setMostrarNovaPostagem] = useState(false);

    useEffect(() => {
        carregarPostagens();
    }, []);

    const carregarPostagens = async() =>  {
        try {
            const retorno = await api.get("/postagens");

            setPostagens(retorno.data);
        } catch (error) {
            console.log(error);
        }
    };

    const alunoSessao = getAluno();

    return (
    <div className="container">
        {mostrarNovaPostagem && 
        (<NovaPostagem carregarPostagens={carregarPostagens} setMostrarNovaPostagem={setMostrarNovaPostagem}/>)}
        <header className="header">
            <div><p>SENAI OVERFLOW</p></div>
            <div><input type="search" placeholder="Pesquisar uma Dúvida..."></input></div>
            <button className="btnSair" onClick={() => {
                signOut();
                history.replace("/");
            }}>Sair <FiLogOut/> </button>
        </header>
        <div className="content">
            <section className="profile">
                <img src={fotoPerfil} alt="Foto de Perfil"></img>
                <label>Editar Foto</label>
                <strong>Nome:</strong>
                <p>{alunoSessao.nome}</p>
                {/* <strong>Email:</strong>
                <p>{alunoSessao.email}</p> */}
                <strong>RA:</strong>
                <p>{alunoSessao.ra}</p>
            </section>
            <section className="feed">
                {postagens.map((post) => (
                    <CardPost key={post.id} post={post}/>
                ))}
            </section>
            <section className="actions">
                    <button onClick={() => {
                        setMostrarNovaPostagem(true);
                    }}>Nova Postagem</button>
            </section>
        </div>
    </div>
  )
};

export default Home;