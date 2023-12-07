import { useState } from "react";
import styled from "styled-components";
import Loader from "../loader";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 40px;
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
  margin: 10px 0;
`;
const ImgInput = styled.input`
  display: none;
`;
const ImgImg = styled.div`
  width: 25px;
  color: #1c9bef;
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
  width: fit-content;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 10px;
`;
const PreviewImg = styled.img`
  max-width: 250px;
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

export default function PostForm() {
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
    if (files && files.length === 1) {
      const file = files[0];
      setImageFile(file); // ✅ SET IMGFILE VALUE

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result); // ✅ SET PREVIEW VALUE
      };
    }
  };
  return (
    <Form>
      <TextArea
        id="textarea"
        onChange={handleTextArea}
        placeholder="What is happening?!"
        value={textareaVal}
      />
      <ImgLabel htmlFor="file">
        <ImgImg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </ImgImg>
      </ImgLabel>
      <ImgInput id="file" onChange={handleInput} type="file" accept="image/*" />
      {/* 🔥 PREVIEW */}
      {imgFile && (
        <PreviewWrapper>
          <PreviewImg src={preview} />
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
