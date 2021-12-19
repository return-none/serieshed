import React from 'react';

import styled from 'styled-components';

const InputStyled = styled.input`
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  border: 1px solid transparent;
  box-shadow: 0 0.25rem 0.25rem rgba(var(--main-color-rgb), 0.075);
  border-radius: var(--border-radius);
  outline: none;
`;

type InputProps = {
  // [TODO] More types
  type: 'text';
  name: string;
  placeholder?: string;

  value: string;
  onChange: (value: string) => void;
};

const Input = (props: InputProps) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };

  return (
    <InputStyled
      autoComplete="off"
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      onChange={onChange}
    />
  );
};

export default Input;
