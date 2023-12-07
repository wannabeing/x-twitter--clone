import styled from "styled-components";
import TweetForm from "../components/tweets/tweet-form";
import TweetTimeLine from "../components/tweets/tweet-timeline";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 40px;

  overflow-y: scroll;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-top: none;
  border-bottom: none;
`;

export default function Home() {
  return (
    <Wrapper>
      <TweetForm />
      <TweetTimeLine />
    </Wrapper>
  );
}
