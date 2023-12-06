import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useMatch, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(91, 112, 131);
  opacity: 0;
`;

const ModalLogout = styled(motion.div)`
  position: fixed;
  top: 50px;
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
  padding: 20px;
`;

export default function LogoutModal() {
  // ✅ useHooks
  const navigate = useNavigate();
  const isModalVisible = useMatch("/logoutModal");

  // 🚀 모달창 나가기 함수
  const onClickExitModal = () => {
    navigate("/");
  };

  const onLogout = () => {
    auth.signOut();
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
              <ModalTitle>AAAAAAAAA</ModalTitle>
              <span>test</span>
              <button onClick={onLogout}>로그아웃</button>
              <button onClick={onCancel}>취소</button>
            </ModalWrapper>
          </ModalLogout>
        </>
      ) : null}
    </AnimatePresence>
  );
}
