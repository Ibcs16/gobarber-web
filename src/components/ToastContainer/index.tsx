import React from 'react';

import { FiAlertCircle, FiXCircle } from 'react-icons/fi';

import { useTransition} from 'react-spring';

import { Container } from './styles';

import Toast from './Toast';

import { ToastMessage, useToast } from '../../hooks/toast';


interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%' },
      enter: { right: '0%' },
      leave: { right: '-120%' }
    }
  );

  return (
    <Container>
      { messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} message={item} style={props}/>
      )) }
    </Container>
  )
}

export default ToastContainer;
