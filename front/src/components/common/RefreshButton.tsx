import React from "react";
import styled from "styled-components";
import { FiRefreshCw } from "react-icons/fi";

interface Props {
  onClick: () => void;
}

const RefreshButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <FiRefreshCw />
    </Button>
  );
};

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

export default RefreshButton;
