import styled from 'styled-components';

import error from 'assets/error.svg';
import loading from 'assets/loading.svg';
import info from 'assets/info.svg';

const Header = styled.h1`
  text-align: center;
  margin: 0;
  width: 100%;
`;

export const HereBeDragons = (props: { text?: string }) => (
  <Header>{!!props.text ? props.text : 'here be dragons'}</Header>
);

const Wrap = styled.div`
  padding: 1rem;
  background: rgb(var(--white-rgb));
  border-radius: var(--border-radius);

  box-shadow: 0 0.25rem 0.25rem rgba(var(--main-color-rgb), 0.075);

  user-select: none;
`;

const LoadingImg = styled.img`
  animation: flip 2s infinite linear;

  @keyframes flip {
    from {
      transform: rotateX(0deg);
    }
    to {
      transform: rotateX(-180deg);
    }
  }
`;

export const Loading = () => (
  <Wrap>
    <LoadingImg src={loading} width="120" alt="loading" draggable={false} />
  </Wrap>
);

const Text = styled.p`
  margin: 0;
  text-align: center;
`;

export const Issue = (props: { text?: string | null }) => (
  <Wrap>
    <img src={error} width="120" alt="error" draggable={false} />
    {!!props.text && <Text>{props.text}</Text>}
  </Wrap>
);

export const Info = (props: { text?: string | null }) => (
  <Wrap>
    <img src={info} width="120" alt="info" draggable={false} />
    {!!props.text && <Text>{props.text}</Text>}
  </Wrap>
);
