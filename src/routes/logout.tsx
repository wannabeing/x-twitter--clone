import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";

interface IBtnType {
  btntype: "account" | "social" | "login";
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
const Left = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 50px;
  padding: 20% 0;
`;
const Logo = styled.div`
  width: 50px;
  height: 50px;
  background-color: red;
`;
const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  padding-bottom: 10%;
`;
const SubTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  padding-bottom: 8%;
`;
const ThirdTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  padding-bottom: 20px;
`;
const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min-content;
  padding-bottom: 50px;
`;
const Btn = styled(motion.div)<IBtnType>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  padding: 10px;
  background-color: ${(props) =>
    props.btntype === "social"
      ? "white"
      : props.btntype === "account"
      ? "#1c9bef"
      : "black"};
  color: ${(props) => (props.btntype === "social" ? "black" : "white")};
  font-weight: bold;
  border-radius: 15px;
  border: ${(props) =>
    props.btntype === "login" ? "2px solid rgba(255,255,255,0.3)" : "none"};
  cursor: pointer;
`;

const BtnLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const LineText = styled.span`
  font-size: 12px;
  white-space: nowrap;
`;
const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: white;
`;
const LoginWrapper = styled.div``;

const ModalSignup = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 200px;
  background-color: white;
`;

export default function Logout() {
  // ✅ useHooks
  const navigate = useNavigate();
  const isModalVisible = useMatch("/signup");

  // 🚀 회원가입 버튼 함수
  const onCreateAccount = () => {
    navigate("/signup");
  };
  return (
    <>
      <Wrapper>
        <Left>
          <Logo />
        </Left>
        <Right>
          <Title>지금 일어나고 있는 일</Title>
          <SubTitle>지금 가입하세요.</SubTitle>
          <BtnWrapper>
            <Btn btntype="social">Google로 가입하기</Btn>
            <Btn btntype="social">Github로 가입하기</Btn>
            <BtnLine>
              <Line />
              <LineText>또는</LineText>
              <Line />
            </BtnLine>
            <Btn
              layoutId="createAccount"
              onClick={onCreateAccount}
              btntype="account"
            >
              계정 만들기
            </Btn>
          </BtnWrapper>
          <LoginWrapper>
            <ThirdTitle>이미 트위터에 가입하셨나요?</ThirdTitle>
            <Btn btntype="login">로그인</Btn>
          </LoginWrapper>
        </Right>
        <AnimatePresence>
          {isModalVisible ? <ModalSignup layoutId="createAccount" /> : null}
        </AnimatePresence>
      </Wrapper>
    </>
  );
}
