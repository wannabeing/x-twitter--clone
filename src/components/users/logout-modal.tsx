import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useMatch, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #242d35;
  opacity: 0;
`;

const ModalLogout = styled(motion.div)`
  position: fixed;
  top: 200px;
  left: 0;
  right: 0;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  width: 300px;
  height: 350px;
  padding: 10px;
  background-color: black;
  border-radius: 15px;
  opacity: 0;
`;

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  padding: 10px 20px;
`;
const ModalTitle = styled.h1`
  font-weight: bold;
  font-size: 1.5em;
  padding: 20px 0;
`;
const ModalText = styled.span`
  opacity: 0.5;
  margin-bottom: 20px;
`;

const Btn = styled.button<{ type?: string }>`
  border-radius: 15px;
  padding: 15px;
  margin: 10px;
  border: none;
  outline: ${(props) => (props.type === "logout" ? "none" : "2px solid gray")};
  font-weight: bold;
  background-color: ${(props) => (props.type === "logout" ? "white" : "black")};
  color: ${(props) => (props.type === "logout" ? "black" : "white")};
  cursor: pointer;
`;

export default function LogoutModal() {
  // ✅ useHooks
  const navigate = useNavigate();
  const isModalVisible = useMatch("/logoutModal");

  // 🚀 모달창 나가기 함수
  const onClickExitModal = () => {
    navigate("/");
  };

  const onLogout = async () => {
    await auth.signOut();
    navigate("/logout");
  };

  const onCancel = () => {
    navigate("/");
  };

  return (
    <AnimatePresence>
      {isModalVisible ? (
        <>
          <Overlay
            onClick={onClickExitModal}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <ModalLogout animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalWrapper>
              <ModalTitle>out of X ?</ModalTitle>
              <ModalText>
                You can always log back in at any time. If you just want to
                switch accounts, you can do that by adding an existing account.
              </ModalText>
              <Btn type="logout" onClick={onLogout}>
                로그아웃
              </Btn>
              <Btn onClick={onCancel}>취소</Btn>
            </ModalWrapper>
          </ModalLogout>
        </>
      ) : null}
    </AnimatePresence>
  );
}
