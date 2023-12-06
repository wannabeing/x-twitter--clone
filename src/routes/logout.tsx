import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import SignupModal, { ISignupForm } from "../components/users/signup-modal";
import LoginModal from "../components/users/login-modal";
import GithubBtn from "../components/users/github-btn";

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
  gap: 5px;
  width: 300px;
  padding: 10px;
  background-color: ${(props) =>
    props.btntype === "social"
      ? "white"
      : props.btntype === "account"
      ? "#1c9bef"
      : "black"};
  color: ${(props) => (props.btntype === "social" ? "black" : "white")};

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

export default function Logout() {
  // ✅ useHooks
  const navigate = useNavigate();
  const { setFocus } = useForm<ISignupForm>();

  // 🚀 회원가입 버튼 함수
  const onCreateAccount = () => {
    navigate("/signup");
    setFocus("email");
  };
  // 🚀 로그인 버튼 함수
  const onLogin = () => {
    navigate("/login");
    setFocus("email");
  };

  return (
    <>
      <Wrapper>
        <Left>
          <Logo />
        </Left>
        <Right>
          <Title>aaaa</Title>
          <SubTitle>subsub</SubTitle>
          <BtnWrapper>
            <GithubBtn />
            <BtnLine>
              <Line />
              <LineText>or</LineText>
              <Line />
            </BtnLine>
            <Btn onClick={onCreateAccount} btntype="account">
              create
            </Btn>
          </BtnWrapper>
          <LoginWrapper>
            <ThirdTitle>?</ThirdTitle>
            <Btn onClick={onLogin} btntype="login">
              login
            </Btn>
          </LoginWrapper>
        </Right>
        {/* 🔥 MODAL */}
        <SignupModal />
        <LoginModal />
      </Wrapper>
    </>
  );
}
