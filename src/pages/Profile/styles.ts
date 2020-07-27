import styled from 'styled-components';

import { shade } from 'polished';

export const Container = styled.div`
  > header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    svg {
      color: #999591;
      width: 24px;
      height: 24px;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* padding: 40px 20px; */

  width: 100%;
  max-width: 700px;
  margin: -176px auto;

  form {
    margin: 80px 0 40px;
    width: 100%;
    max-width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      font-size: 20px;
      margin-bottom: 24px;
      text-align: left;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 36px;
  width: 186px;
  align-self: center;
  position: relative;

  label {
    position: absolute;
    right: 0;
    bottom: 0;

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 48px;
    height: 48px;
    /* color: #fff; */

    border: none;
    border-radius: 50%;

    background: #ff9000;

    transition: background-color 0.2s;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    &:hover {
      background-color: ${shade(0.2, '#ff9000')};
    }
  }

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }
`;
