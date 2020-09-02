import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9;
  overflow-y: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #333d;

  animation: fadeIn 0.4s;

  > div {
    background-color: var(--primary);
    border-radius: 6px;

    padding: 10px;
    position: relative;
  }
`;
