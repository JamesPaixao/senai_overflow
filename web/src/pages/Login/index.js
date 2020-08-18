import React from "react";

import { Container, ImageCropped, Form, Titulo, SubTitulo, InputGroup, Button } from "./style";
import foto from "../../assets/foto.jpg";

const Login = () => {
    return (
        <>
            <Container>
                <ImageCropped>
                    <img src={foto} alt="Imagem de capa"/>
                </ImageCropped>
                <Form>
                    <Titulo>SENAI OVERFLOW</Titulo>
                    <SubTitulo>Compartilhe suas dúvidas</SubTitulo>
                    <InputGroup>
                        <label>E-mail</label>
                        <input type="email" placeholder="Insira seu email"/>
                    </InputGroup>
                    <InputGroup>
                        <label>Senha</label>
                        <input type="password" placeholder="Insira sua senha"/>
                    </InputGroup>
                    <Button>Entrar</Button>
                    <Button>Registrar-se</Button>
                </Form>
            </Container>
        </>
    )
}

export default Login;