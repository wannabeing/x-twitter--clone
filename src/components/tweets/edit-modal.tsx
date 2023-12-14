import { motion } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import Loader from "../loader";
import { useForm } from "react-hook-form";
import CloseSvg from "/public/icons/close.svg";
import ImgSvg from "/public/icons/image.svg";
import { I_EDIT_MODAL_PROPS } from "../../type-config";
import { doc, updateDoc } from "firebase/firestore";
import { auth, fbDB, fbStorage } from "../../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export interface I_EDIT_FORM {
  textarea: string;
  error: string;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(91, 112, 131, 0.4);
  opacity: 0;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  width: 600px;
  height: 600px;
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

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  padding: 0 20px;
`;
const ModalSubmit = styled.input`
  justify-self: flex-end;
  align-self: flex-end;
  width: 100px;
  border-radius: 14px;
  border: none;
  padding: 10px;
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
const TextArea = styled.textarea`
  border: 2px solid rgba(255, 255, 255, 0.4);
  width: 100%;
  height: 150px;
  background-color: transparent;
  outline: none;
  resize: none;
  color: white;
  cursor: white;
  overflow-y: hidden;
  font-size: 24px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const ImgLabel = styled.label`
  cursor: pointer;
  width: min-content;
`;
const ImgIcon = styled.img`
  width: 20px;
  filter: invert(49%) sepia(68%) saturate(2512%) hue-rotate(178deg)
    brightness(98%) contrast(90%);
`;
const ImgInput = styled.input`
  /* display: none; */
`;

const PreviewWrapper = styled.div`
  position: relative;
  width: fit-content;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 10px;
`;
const PreviewImg = styled.img`
  max-width: 250px;
`;
const PreviewImgDelete = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background-color: black;
  border-radius: 50%;
  padding: 5px;

  &:hover {
    background-color: tomato;
  }
`;

const PreviewImgIcon = styled.img`
  width: 15px;
`;

export default function EditModal({
  tweetID,
  setCancelState,
  imgUrl,
  text,
}: I_EDIT_MODAL_PROPS) {
  // ✅ useHooks
  const [textareaVal, setTextareaVal] = useState(text);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState("");
  const [cImgUrl, setCImgUrl] = useState(imgUrl);
  const [modalLoading, setModalLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<I_EDIT_FORM>();

  const { currentUser } = auth;

  // 🚀 TEXTAREA 핸들 함수
  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaVal(e.target.value); // ✅ SET TEXTAREA VALUE
  };

  // 🚀 File Input 핸들 함수
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const maxSize = 1 * 1024 * 1024; // ✅ SET MAX_SIZE 1MB

    if (files && files.length === 1 && files[0].size <= maxSize) {
      const file = files[0];

      setUploadFile(file); // ✅ SET IMGFILE VALUE

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditPreview(result); // ✅ SET PREVIEW VALUE
      };
    }

    // ✅ 파일용량 초과시
    if (files && files[0].size >= maxSize) {
      console.log("❌ 1MB 이하의 파일을 업로드해주세요.");
    }
  };

  // 🚀 업로드이미지 삭제 함수
  const onPreviewExit = () => {
    setUploadFile(null);
    setEditPreview("");
    setCImgUrl("");
  };

  // 🚀 모달창 나가기 함수
  const onClickExitModal = () => {
    setCancelState(false);
  };

  // 🚀 폼 제출 함수
  const onSubmitForm = async () => {
    if (!currentUser) return;
    try {
      // ✅ SET LOADING
      setModalLoading(true);

      // ✅ UPADATE TEXT
      const tweetRef = doc(fbDB, "tweets", tweetID);
      await updateDoc(tweetRef, {
        text: textareaVal,
      });

      // ✅ 기존 업로드이미지 삭제
      if (imgUrl !== "" && cImgUrl === "") {
        const currentImgRef = ref(
          fbStorage,
          `tweets/uid-${currentUser.uid}/tid-${tweetID}`
        );
        // ✅ Storage에서 업로드이미지 삭제
        await deleteObject(currentImgRef);
        // ✅ UPDATE TWEET
        await updateDoc(tweetRef, {
          imgUrl: "",
        });
      }

      // ✅ UPADTE IMG
      if (uploadFile) {
        console.log(uploadFile);
        const imgRef = ref(
          fbStorage,
          `tweets/uid-${currentUser.uid}/tid-${tweetID}`
        );
        const uploadResult = await uploadBytes(imgRef, uploadFile);

        // ✅ UPDATE TWEET IMGURL
        const imgUrl = await getDownloadURL(uploadResult.ref);
        await updateDoc(tweetRef, {
          imgUrl,
        });
      }
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
    <>
      <Overlay
        onClick={onClickExitModal}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <Modal animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ModalExitBtn onClick={onClickExitModal}>
          <CloseIcon src={CloseSvg} />
        </ModalExitBtn>
        <ModalWrapper>
          <ModalForm onSubmit={handleSubmit(onSubmitForm)}>
            <TextArea
              {...register("textarea", {
                required: "텍스트를 입력해주세요.",
              })}
              value={textareaVal}
              onChange={handleTextArea}
              maxLength={180}
            />
            <ModalError>{errors.textarea?.message}</ModalError>
            <ImgLabel htmlFor="upload">
              <ImgIcon src={ImgSvg} />
            </ImgLabel>
            <ImgInput
              id="upload"
              onChange={handleInput}
              type="file"
              accept="image/*"
            />

            {/* 🔥 PREVIEW */}
            {uploadFile || cImgUrl != "" ? (
              <PreviewWrapper>
                <PreviewImg src={cImgUrl != "" ? cImgUrl : editPreview} />
                <PreviewImgDelete onClick={onPreviewExit}>
                  <PreviewImgIcon src={CloseSvg} />
                </PreviewImgDelete>
              </PreviewWrapper>
            ) : null}
            <ModalSubmit type="submit" value="저장" />
            <ModalError>{errors.error?.message}</ModalError>
          </ModalForm>
        </ModalWrapper>
        {/* 🔥 Modal Loading */}
        {modalLoading ? (
          <ModalLoaderWrapper>
            <Loader />
          </ModalLoaderWrapper>
        ) : null}
      </Modal>
    </>
  );
}
