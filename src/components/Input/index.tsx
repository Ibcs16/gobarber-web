import React, { InputHTMLAttributes, useEffect, useRef, useState, useCallback } from 'react';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';
import { FiAlertCircle } from 'react-icons/fi'

import Tooltip from '../Tooltip';

import { Container, ErrorContainer } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon: React.ComponentType<IconBaseProps>
}

const Input: React.FC <InputProps>= ({ name, icon: Icon, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const { fieldName, defaultValue, error, registerField} = useField(name);

  useEffect(() => {
    registerField(
      {
        name: fieldName,
        ref: inputRef.current,
        path: 'value'
      }
    )
  }, [fieldName, registerField])

  return (
    <Container
      hasError={!!error}
      isFocused={isFocused}
      isFilled ={isFilled}
      >
      { Icon && <Icon size={20} /> }

      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest} />
        {error &&
          <ErrorContainer title={error}>
            <FiAlertCircle color="#c53030" size={20}/>
          </ErrorContainer>}
    </Container>
  )
}

export default Input;
