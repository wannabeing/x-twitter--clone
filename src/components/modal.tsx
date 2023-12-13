import { motion } from "framer-motion";
import styled from "styled-components";
import { I_MODAL_PROPS, MODAL_BTN_TYPE } from "../type-config";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #242d35;
  opacity: 0;
`;
const ModalWrapper = styled(motion.div)`
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

const ModalInner = styled.div`
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

const ModalBtn = styled.button<{ btnType?: MODAL_BTN_TYPE }>`
  border-radius: 15px;
  padding: 15px;
  margin: 10px;
  border: none;
  outline: ${(props) =>
    props.btnType === "delete" ? "none" : "2px solid gray"};
  font-weight: bold;
  background-color: ${(props) =>
    props.btnType === "delete" ? "#f4222d" : "black"};
  color: white;
  cursor: pointer;
`;

export default function Modal({
  title,
  text,
  btnText,
  btnType,
  setCancelState,
  execFunction,
}: I_MODAL_PROPS) {
  return (
    <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalWrapper animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ModalInner>
          <ModalTitle>{title}</ModalTitle>
          <ModalText>{text}</ModalText>
          <ModalBtn btnType={btnType} onClick={() => execFunction()}>
            {btnText}
          </ModalBtn>
          <ModalBtn
            onClick={() => {
              setCancelState(false);
            }}
          >
            취소
          </ModalBtn>
        </ModalInner>
      </ModalWrapper>
    </Overlay>
  );
}
