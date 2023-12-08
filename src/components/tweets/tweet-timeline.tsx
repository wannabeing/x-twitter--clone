import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { fbDB } from "../../firebase";
import styled from "styled-components";
import Loader from "../loader";

export interface ITweet {
  id: string;
  text: string;
  uid: string;
  username: string;
  imgUrl: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Tweet = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 10px;
  padding: 10px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  min-height: 70px;

  &:last-child {
    border-bottom: none;
  }
`;
const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ProfileImg = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const UserWrapper = styled.div`
  display: flex;
  gap: 5px;
`;

const UserName = styled.span`
  font-size: 0.9em;
  font-weight: bold;
`;
const CreatedAt = styled.span`
  color: rgba(255, 255, 255, 0.4);
`;

const Text = styled.span``;

const ImgWrapper = styled.div``;
const TweetImg = styled.img`
  width: 100%;
  height: auto;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
`;

export default function TweetTimeLine() {
  // ✅ useHooks
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 DB에서 데이터 가져오는 함수
  const getTweets = async () => {
    // ✅ SET LOADING
    setIsLoading(true);
    // ✅ CREATE QUERY
    const tweetQuery = query(
      collection(fbDB, "tweets"),
      orderBy("createdAt", "desc") // 생성 순으로 내림차순
    );
    // ✅ FETCH QUERY
    const querySnapshot = await getDocs(tweetQuery);
    const result = querySnapshot.docs.map((doc) => {
      const { text, uid, username, imgUrl, createdAt } = doc.data();
      return {
        id: doc.id,
        text,
        uid,
        username,
        imgUrl,
        createdAt,
      };
    });
    // ✅ SET TWEETS
    setTweets(result);
    // ✅ RESET LOADING
    setIsLoading(false);
  };
  useEffect(() => {
    getTweets();
  }, []);
  return (
    <Wrapper>
      {!isLoading && tweets ? (
        tweets.map((tweet) => (
          <Tweet key={tweet.id}>
            <ProfileWrapper>
              <ProfileImg />
            </ProfileWrapper>
            <ContentWrapper>
              <UserWrapper>
                <UserName>{tweet.username}</UserName>
                <CreatedAt>{tweet.createdAt}</CreatedAt>
              </UserWrapper>
              <Text>{tweet.text}</Text>
              {tweet.imgUrl ? (
                <ImgWrapper>
                  <TweetImg src={tweet.imgUrl} />
                </ImgWrapper>
              ) : (
                ""
              )}
            </ContentWrapper>
          </Tweet>
        ))
      ) : (
        <Loader />
      )}
    </Wrapper>
  );
}
