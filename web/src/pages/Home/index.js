import React, { useEffect, useState } from 'react';
import './styles.css'
import { FiGithub, FiLogOut } from "react-icons/fi"
import fotoPerfil from "../../assets/foto_perfil.png"
import imgPost from "../../assets/post-exemplo.jpg"
import { signOut, getAluno } from '../../services/security';
import { useHistory } from 'react-router-dom';
import { api } from '../../services/api';
import PopUp from '../../components/PopUp';

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

    return(
        <div className="card-post">
            <header>
                <img src={fotoPerfil} alt="Foto de Perfil"></img>
                <strong>{post.Aluno.nome}</strong>
                <p>{post.createdAt}</p>
                {/* renderização condicional, só mostra o ícone se o gists for verdadeiro */}
                {post.gists && (<FiGithub className="icon" size="25" color="green"/>)}
            </header>
            <section>
                <strong>
                    {post.titulo}
                </strong>
                <p> {post.descricao} </p>
                <img src={imgPost} alt="Imagem do post"></img>
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

const NovaPostagem = ({setMostrarNovaPostagem}) => {
    const [novaPostagem, setNovaPostagem] = useState({
        titulo: "",
        descricao: "",
        gists: "",
    });


    const fechar = () => {
        const {titulo, descricao, gists} = novaPostagem;

        if((titulo || descricao || gists) && !window.confirm("Tem certeza que quer abandonar a dúvida?")){
            return;
        }
        setMostrarNovaPostagem(false);
    };

    const handlerInput = (e) => {
        setNovaPostagem({...novaPostagem, [e.target.id]: e.target.value});
    };
    
    return (<PopUp>
        <form className="nova-postagem">
            <span onClick={fechar}>&times;</span>
            <h1>Publique suas dúvidas</h1>
            <label>Titulo</label>
            <input type="text" placeholder="Sobre o que é sua dúvida" id="titulo" onChange={handlerInput}/>
            <label>Descrição</label>
            <textarea placeholder="Descreva em detalhe, o que te aflige?" id="descricao" onChange={handlerInput}/>
            <label>Gist <em>(Opcional)</em></label>
            <input type="text"  id="gists" placeholder="https://gist.github.com/robertkowalski/884f7855499ddd702e4c137081234a1c.js" onChange={handlerInput}/>
            <label>Imagem <em>(Opcional)</em></label>
            <input type="file"/>
            <img alt="preview"/>
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
        const carregarPostagens = async() =>  {
            try {
                const retorno = await api.get("/postagens");

                setPostagens(retorno.data);
            } catch (error) {
                console.log(error);
            }
        };
        carregarPostagens();
    }, []);

    const alunoSessao = getAluno();

    return (
    <div className="container">
        {mostrarNovaPostagem && <NovaPostagem setMostrarNovaPostagem={setMostrarNovaPostagem}/>}
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