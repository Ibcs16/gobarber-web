import styled, { css } from 'styled-components';
import { animated } from 'react-spring'
interface ContainerProps {
  type?: 'info' | 'error' | 'success';
  hasDescription: boolean;
  progressionBar?: boolean;
}

const toastTypeVariations = {
  info:  css`
    background: #e6fffa;
    color: #3172b7;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53036;
  `,
}

export const Container = styled(animated.div)<ContainerProps>`
  width: 360px;
  max-width: 100%;

  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0,0,0, .2);

  display: flex;

/*
  &::before {
    content: '';
    background: #fff;

    position: absolute;
    bottom: 0px;
    left: 0;

    border-radius: 10px;

    transition: width 2s;
    height: 10px;
    width: 100%;
  } */


  ${props => toastTypeVariations[props.type || 'info']}

  & + div {
    margin-top: 1rem;
  }

  > svg {
    margin: 4px 12px 0 0;
  }

  div {
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: .8;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    right: 16px;
    top: 24px;
    opacity: .6px;
    background: transparent;
    border: none;
    color: inherit;
  }

  ${props => !props.hasDescription && css`
    align-items: center;

    svg {
      margin-top: 0;
    }
  `}
`
