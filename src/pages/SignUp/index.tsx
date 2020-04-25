import React, { useCallback, useRef } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiUser, FiMail, FiArrowLeft, FiLock } from 'react-icons/fi'
import Input from '../../components/Input';
import Button  from '../../components/Button';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}


const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignUpFormData): Promise<void> => {
    try {
      formRef.current?.setErrors([]);

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Digite um email válido'),
        password: Yup.string().min(6, 'No mínimo 6 digitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      history.push('/');

      addToast({
        type: 'success',
        title: 'Cadastro realizado',
        description: 'Você já pode fazer seu logon GoBarber!'
      });

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err));
        return;
      }

      addToast({
        type: 'error',
        description: 'Ocorreu um erro ao fazer cadastro. Tente novamente',
        title: 'Erro no cadastro'
      });
    }
  }, [addToast, history]);

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logoImg} alt="GoBarber"/>

            <Form
              ref={formRef}
              initialData={{ }}
              onSubmit={handleSubmit}>
              <h1>Faça seu cadastro</h1>

              <Input icon={FiUser} name="name" placeholder="Nome"/>
              <Input icon={FiMail} name="email" type="email" placeholder="E-mail"/>
              <Input icon={FiLock} name="password" type="password" placeholder="Senha"/>
              <Button type="submit">Cadastrar</Button>
            </Form >
            <Link to="/">
              <FiArrowLeft/>
              Voltar para logon
            </Link>
          </AnimationContainer>
        </Content>
      <Background/>
      </Container>
    </>
  )
}

export default SignUp;
