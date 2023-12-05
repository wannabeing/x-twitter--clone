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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(91, 112, 131, 0.4);
  opacity: 0;
`;

const ModalSignup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 60vw;
  height: 80vh;
  padding: 10px;
  background-color: black;
  border-radius: 15px;
  opacity: 0;
`;
const ModalExitBtn = styled.div`
  display: flex;
  justify-content: flex-end;

  svg {
    width: 27px;
    fill: white;
    cursor: pointer;
    border-radius: 50%;

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
`;
const ModalFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
`;
const ModalTitle = styled.h1`
  font-weight: bold;
  font-size: 1.5em;
`;
export default function Logout() {
  // ✅ useHooks
  const navigate = useNavigate();
  const isModalVisible = useMatch("/signup");

  // 🚀 회원가입 버튼 함수
  const onCreateAccount = () => {
    navigate("/signup");
  };

  // 🚀 모달창 나가기 함수
  const onClickExitModal = () => {
    navigate("/logout");
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
            <Btn btntype="social">Google </Btn>
            <Btn btntype="social">Github</Btn>
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
            <Btn btntype="login">login</Btn>
          </LoginWrapper>
        </Right>
        {/* 🔥 MODAL */}
        <AnimatePresence>
          {isModalVisible ? (
            <>
              <Overlay
                onClick={onClickExitModal}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <ModalSignup animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ModalExitBtn onClick={onClickExitModal}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <g>
                      <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
                    </g>
                  </svg>
                </ModalExitBtn>
                <ModalFormWrapper>
                  <ModalTitle>AAA</ModalTitle>
                </ModalFormWrapper>
              </ModalSignup>
            </>
          ) : null}
        </AnimatePresence>
      </Wrapper>
    </>
  );
}
