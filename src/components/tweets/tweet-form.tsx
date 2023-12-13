import { useState } from "react";
import styled from "styled-components";
import Loader from "../loader";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, fbDB, fbStorage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ImgSvg from "/public/icons/image.svg";
import CloseSvg from "/public/icons/close.svg";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;
const TextArea = styled.textarea`
  background-color: transparent;
  outline: none;
  resize: none;
  border: none;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
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
  height: auto;
  margin: 10px 0;
`;
const ImgIcon = styled.img`
  width: 20px;
  filter: invert(49%) sepia(68%) saturate(2512%) hue-rotate(178deg)
    brightness(98%) contrast(90%);
`;
const ImgInput = styled.input`
  display: none;
`;

const UploadBtn = styled.button`
  align-self: flex-end;
  width: 100%;
  max-width: 80px;
  padding: 10px;
  border: none;
  border-radius: 15px;
  background-color: #1c9bef;
  color: white;
  font-weight: bold;
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

  svg {
    fill: white;
    width: 15px;
  }

  &:hover {
    background-color: tomato;
  }
`;

const PreviewImgIcon = styled.img`
  width: 15px;
`;

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
`;

export default function TweetForm() {
  // ✅ useHooks
  const [textareaVal, setTextareaVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imgFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // 🚀 TEXTAREA 핸들 함수
  const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaVal(e.target.value); // ✅ SET TEXTAREA VALUE

    // ✅ SET TEXTAREA AUTO HEIGHT
    const textarea = document.getElementById("textarea");
    if (textarea !== null) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // 🚀 File Input 핸들 함수
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const maxSize = 1 * 1024 * 1024; // ✅ SET MAX_SIZE 1MB

    if (files && files.length === 1 && files[0].size <= maxSize) {
      const file = files[0];
      setImageFile(file); // ✅ SET IMGFILE VALUE

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result); // ✅ SET PREVIEW VALUE
      };
    }

    // ✅ 파일용량 초과시
    if (files && files[0].size >= maxSize) {
      console.log("❌ 1MB 이하의 파일을 업로드해주세요.");
    }
  };

  // 🚀 Form 핸들 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const user = auth.currentUser;
    e.preventDefault();
    if (!user || isLoading || textareaVal === "" || textareaVal.length > 180)
      return;

    try {
      // ✅ SET LOADING
      setIsLoading(true);

      // ✅ UPLOAD TWEET
      const tweet = await addDoc(collection(fbDB, "tweets"), {
        text: textareaVal,
        imgUrl: "",
        uid: user.uid,
        username: user.displayName || "???",
        createdAt: Date.now(),
      });

      if (imgFile) {
        // ✅ UPLOAD IMG
        const imgRef = ref(fbStorage, `tweets/uid-${user.uid}/tid-${tweet.id}`);
        const uploadResult = await uploadBytes(imgRef, imgFile);

        // ✅ UPDATE TWEET IMGURL
        const imgUrl = await getDownloadURL(uploadResult.ref);
        await updateDoc(tweet, {
          imgUrl,
        });
      }
    } catch (error) {
      console.log("❌ TWEET FORM ERROR: ", error);
    } finally {
      // ✅ RESET LOADING & VALUE
      setTextareaVal("");
      setImageFile(null);

      setIsLoading(false);
    }
  };

  // 🚀 업로드이미지 삭제 함수
  const onPreviewExit = () => {
    setImageFile(null);
    setPreview("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextArea
        id="textarea"
        onChange={handleTextArea}
        placeholder="What is happening?!"
        value={textareaVal}
        maxLength={180}
        required
      />
      <ImgLabel htmlFor="file">
        <ImgIcon src={ImgSvg} />
      </ImgLabel>
      <ImgInput id="file" onChange={handleInput} type="file" accept="image/*" />
      {/* 🔥 PREVIEW */}
      {imgFile && (
        <PreviewWrapper>
          <PreviewImg src={preview} />
          <PreviewImgDelete onClick={onPreviewExit}>
            <PreviewImgIcon src={CloseSvg} />
          </PreviewImgDelete>
        </PreviewWrapper>
      )}

      <UploadBtn>Post</UploadBtn>

      {/* 🔥 LOADING */}
      {isLoading ? (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      ) : null}
    </Form>
  );
}

{
  /*  */
}
