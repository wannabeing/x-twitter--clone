import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { useMatch, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import Loader from "../loader";
import { auth } from "../../firebase";
import { useForm } from "react-hook-form";
import CloseSvg from "/public/icons/close.svg";

export interface ILoginForm {
  email: string;
  pw: string;
  error: string;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(91, 112, 131, 0.4);
  opacity: 0;
`;

const ModalLogin = styled(motion.div)`
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  width: 600px;
  height: 650px;
  padding: 10px;
  background-color: black;
  border-radius: 15px;
  opacity: 0;
`;
const ModalExitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
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
const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  height: 100%;
  padding: 20px;
`;
const ModalInput = styled.input<{ errorMsg?: string }>`
  width: 80%;
  border-radius: 10px;
  padding: 20px;
  background-color: black;
  border: none;
  outline: 2px solid gray;
  caret-color: white; /* cursor color */
  color: white;

  &:focus {
    outline: 2px solid #1876b6;
  }
`;

const ModalSubmit = styled.input`
  width: 80%;
  border-radius: 14px;
  border: none;
  padding: 20px;
  background-color: white;
  color: black;
  font-weight: bold;
  cursor: pointer;
`;
const ModalError = styled.span`
  font-size: 0.7em;
  color: red;
`;

const ModalLoaderWrapper = styled.div`
  position: fixed;
  top: -100px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const CloseIcon = styled.img`
  width: 30px;
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export default function LoginModal() {
  // ✅ useHooks
  const navigate = useNavigate();
  const isModalVisible = useMatch("/login");
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<ILoginForm>();
  const [modalLoading, setModalLoading] = useState(false);

  // 🚀 모달창 나가기 함수
  const onClickExitModal = () => {
    navigate("/logout");
  };

  // 🚀 폼 제출 함수
  const onSubmitForm = async (data: ILoginForm) => {
    try {
      // ✅ SET LOADING
      setModalLoading(true);

      // ✅ USER LOGIN
      await signInWithEmailAndPassword(auth, data.email, data.pw);
      navigate("/");
    } catch (e) {
      // ✅ SET ERROR MSG
      if (e instanceof FirebaseError) {
        console.log(e.code);
        switch (e.code) {
          case "auth/email-already-in-use":
            setError("error", {
              message: "이미 사용중인 이메일입니다.",
            });
            break;
          case "auth/weak-password":
            setError("error", {
              message: "비밀번호가 너무 쉽습니다.",
            });
            break;

          case "auth/too-many-requests":
            setError("error", {
              message: "조금 이따 다시 시도해주세요.",
            });
            break;

          default:
            setError("error", {
              message: e.code,
            });
            break;
        }
      }
    } finally {
      // ✅ SET LOADING
      setModalLoading(false);
    }
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
          <ModalLogin animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalExitBtn onClick={onClickExitModal}>
              <CloseIcon src={CloseSvg} />
            </ModalExitBtn>
            <ModalWrapper>
              <ModalTitle>AAAAAAAAA</ModalTitle>
              <ModalForm onSubmit={handleSubmit(onSubmitForm)}>
                <ModalInput
                  {...register("email", {
                    required: "ㅖㅖ를 입력해주세요.",
                    pattern: {
                      message: "올바른 이메일을 입력해주세요.",
                      value:
                        /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i,
                    },
                  })}
                  errorMsg={errors.email?.message}
                  placeholder="email"
                />
                <ModalError>{errors.email?.message}</ModalError>
                <ModalInput
                  {...register("pw", {
                    required: "pp를 입력해주세요.",
                    maxLength: 50,
                  })}
                  placeholder="pw"
                  type="password"
                  errorMsg={errors.pw?.message}
                />
                <ModalError>{errors.pw?.message}</ModalError>

                <ModalSubmit type="submit" value="다음" />
                <ModalError>{errors.error?.message}</ModalError>
              </ModalForm>
            </ModalWrapper>
            {/* 🔥 Modal Loading */}
            {modalLoading ? (
              <ModalLoaderWrapper>
                <Loader />
              </ModalLoaderWrapper>
            ) : null}
          </ModalLogin>
        </>
      ) : null}
    </AnimatePresence>
  );
}
