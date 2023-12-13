import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import GithubIcon from "/public/icons/github.svg";

const Btn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 300px;
  padding: 10px;
  background-color: white;
  color: black;
  border-radius: 15px;
  border: none;
  cursor: pointer;
`;
const SocialLogo = styled.img`
  height: 20px;
`;
const BtnText = styled.span`
  font-weight: bold;
`;

export default function GithubBtn() {
  // ✅ useHooks
  const nav = useNavigate();

  // 🚀 로그인 함수
  const onClick = async () => {
    try {
      // ✅ 깃헙 팝업 로그인창 띄우기
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);

      // ✅ 로그인 성공 시, 홈으로 리다이렉트
      nav("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Btn onClick={onClick}>
      <SocialLogo src={GithubIcon} />
      <BtnText>Github로 가입하기</BtnText>{" "}
    </Btn>
  );
}
