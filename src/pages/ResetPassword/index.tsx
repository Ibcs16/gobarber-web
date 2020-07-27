import React, { useRef, useCallback, useContext, useMemo } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import useQuery from '../../hooks/urlQuery';

interface ResetFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const query = useQuery();

  const { addToast } = useToast();
  const history = useHistory();

  const token = useMemo(() => {
    const findToken = query.get('token');
    return findToken;
  }, [query]);

  const handleSubmit = useCallback(
    async (data: ResetFormData): Promise<void> => {
      try {
        formRef.current?.setErrors([]);

        if (!token) {
          throw Error('No reset password token provided');
        }

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação de senha incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('password/reset', {
          password: data.password,
          password_confirmation: data.password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        addToast({
          type: 'error',
          description: 'Ocorreu um erro ao resetar sua senha',
          title: 'Erro ao resetar senha',
        });
      }
    },
    [addToast, history, token],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logoImg} alt="GoBarber" />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Resetar senha</h1>

              <Input
                icon={FiLock}
                name="password"
                type="password"
                placeholder="Senha"
              />

              <Input
                icon={FiLock}
                name="password_confirmation"
                type="password"
                placeholder="Confirmação de Senha"
              />
              <Button type="submit">Resetar</Button>
            </Form>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ResetPassword;
