import React from 'react';

import SignIn from '../../pages/SignIn';
import { render, fireEvent, wait } from '@testing-library/react';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', ()=> ({
  useHistory: () => ({
    push: mockedHistoryPush
  }),
  Link: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    signIn: mockedSignIn,
  })
}));


jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  })
}));


describe('SignIn Page', ()=> {
  beforeEach(()=> {
    mockedHistoryPush.mockClear();
  })

  it('should be able to sign in', async () => {
    const {getByPlaceholderText, getByText} = render(<SignIn/>);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'mail@mail.com'}});
    fireEvent.change(passwordField, { target: { value: '123456'}});

    fireEvent.click(buttonElement);

    await wait(() => expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard'));
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const {getByPlaceholderText, getByText} = render(<SignIn/>);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email'}});
    fireEvent.change(passwordField, { target: { value: '123456'}});

    fireEvent.click(buttonElement);

    await wait(() => expect(mockedHistoryPush).not.toHaveBeenCalledWith());
  });

  it('should display error if login fails', async () => {
    mockedSignIn.mockImplementation(()=> {throw new Error()})

    const {getByPlaceholderText, getByText} = render(<SignIn/>);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'john@email.com'}});
    fireEvent.change(passwordField, { target: { value: '123456'}});

    fireEvent.click(buttonElement);

    await wait(() => expect(mockedAddToast).toHaveBeenCalledWith(expect.objectContaining({
      type: 'error'
    })));
  });


})
