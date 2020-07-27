import React, { useRef, useCallback, useContext, useState } from 'react';
import { FiMail, FiChevronLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData): Promise<void> => {
      try {
        setLoading(true);
        formRef.current?.setErrors([]);

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('password/forgot', {
          email: data.email,
        });
        addToast({
          type: 'success',
          title: 'E-mail enviado',
          description:
            'E-mail de recuperação enviado. Cheque sua caixa de email',
        });

        // history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        addToast({
          type: 'error',
          description:
            'Ocorreu um erro ao tentar recuperar senha, tente novamente',
          title: 'Erro na recuperação de senha',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logoImg} alt="GoBarber" />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Recuperar senha</h1>

              <Input icon={FiMail} name="email" placeholder="E-mail" />

              <Button loading={loading} type="submit">
                Recuperar
              </Button>
            </Form>
            <Link to="/">
              <FiChevronLeft />
              Voltar à página de login
            </Link>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ForgotPassword;
