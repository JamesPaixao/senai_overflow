import React from 'react';
import './styles.css'
import { FiGithub } from "react-icons/fi"
import fotoPerfil from "../../assets/foto_perfil.png"
import imgPost from "../../assets/post-exemplo.jpg"
function Home() {
  return (
    <div className="container">
        <header className="header">
            <div><p>SENAI OVERFLOW</p></div>
            <div><input type="search" placeholder="Pesquisar uma Dúvida..."></input></div>
            <div>Direita</div>
        </header>
        <div className="content">
            <section className="profile">
                <img src={fotoPerfil} alt="Foto de Perfil"></img>
                <a href="#">Editar Foto</a>
                <strong>Nome:</strong>
                <p>Fulano de tal</p>
                <strong>Email:</strong>
                <p>fulano@gmail.com</p>
                <strong>RA:</strong>
                <p>19266850</p>
            </section>
            <section className="feed">
                <div className="card-post">
                    <header>
                        <img src={fotoPerfil} alt="Foto de Perfil"></img>
                        <strong>Ciclanilson</strong>
                        <p>12/12/2012 às 12:00</p>
                        <FiGithub className="icon" size="25" color="green"/>
                    </header>
                    <body>
                        <strong>
                            Aqui é a minha pergunta
                        </strong>
                        <p> Aqui é a descrição da minha duvida </p>
                        <img src={imgPost} alt="Imagem do post"></img>
                    </body>
                    <footer>
                        <h1>Comentários</h1>
                        <section>
                            <header>
                            <img src={fotoPerfil} alt="Foto de Perfil"></img>
                            <strong>Ciclanilson</strong>
                            <p>12/12/2012 às 12:12</p>
                            </header>
                            <p>
                                Aqui é o texto do comentárioooooo !!!!
                            </p>
                        </section>
                        <section>
                            <header>
                            <img src={fotoPerfil} alt="Foto de Perfil"></img>
                            <strong>Ciclanilson</strong>
                            <p>12/12/2012 às 12:12</p>
                            </header>
                            <p>
                                Aqui é o texto do comentárioooooo !!!!
                            </p>
                        </section>
                    </footer>
                </div>
            </section>
        </div>
    </div>
  )
}

export default Home;