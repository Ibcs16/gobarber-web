import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiUser, FiMail, FiArrowLeft, FiLock, FiCamera } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, AvatarInput } from './styles';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData): Promise<void> => {
      try {
        formRef.current?.setErrors([]);

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Senha obrigatória'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação de senha incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password && {
            old_password,
            password,
            password_confirmation,
          }),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description: 'Informações do perfil atualizadas com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        addToast({
          type: 'error',
          description: 'Ocorreu um erro ao atualizar perfil, tente novamente',
          title: 'Erro ao atualizar perfil!',
        });
      }
    },
    [addToast, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('users/avatar', data).then(res => {
          updateUser(res.data);
          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
            description: '',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <>
      <Container>
        <header>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </header>
        <Content>
          <Form
            ref={formRef}
            initialData={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}
          >
            <AvatarInput>
              <img src={user.avatar_url} alt={user.name} />
              <label htmlFor="avatar">
                <FiCamera />
                <input onChange={handleAvatarChange} id="avatar" type="file" />
              </label>
            </AvatarInput>
            <h1>Meu perfil</h1>

            <Input icon={FiUser} name="name" placeholder="Nome" />
            <Input
              icon={FiMail}
              name="email"
              type="email"
              placeholder="E-mail"
            />

            <Input
              icon={FiLock}
              containerStyle={{ marginTop: 24 }}
              name="old_password"
              type="password"
              placeholder="Senha atual"
            />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Nova Senha"
            />
            <Input
              icon={FiLock}
              name="password_confirmation"
              type="password"
              placeholder="Confirmação de Senha"
            />
            <Button type="submit">Confirmar mudança</Button>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Profile;
