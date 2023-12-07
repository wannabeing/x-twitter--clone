import styled from "styled-components";
import PostForm from "../components/posts/post-form";

const Wrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-top: none;
  border-bottom: none;
  height: 100%;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostForm />
    </Wrapper>
  );
}
