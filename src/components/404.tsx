import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2.5em;
  font-weight: bold;
`;
const Btn = styled.button`
  border: none;
  outline: none;
  background: white;
  color: black;
  border-radius: 15px;
  padding: 20px;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;

  &:hover {
    color: gray;
  }
`;

export default function Error404() {
  // ✅ useHooks
  const nav = useNavigate();

  // 🚀 버튼 클릭 함수
  const onClickHome = () => {
    nav("/");
  };

  return (
    <Wrapper>
      <Title>404 ERROR</Title>
      <Btn onClick={onClickHome}>홈으로 돌아가기</Btn>
    </Wrapper>
  );
}
