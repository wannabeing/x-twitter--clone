import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { fbDB } from "../../firebase";
import styled from "styled-components";

export interface ITweet {
  id: string;
  text: string;
  uid: string;
  username: string;
  imgUrl: string;
  createdAt: number;
}

const TweetWrapper = styled.div`
  background-color: red;
`;

export default function TweetTimeLine() {
  // ✅ useHooks
  const [tweets, setTweets] = useState<ITweet[]>([]);

  // 🚀 DB에서 데이터 가져오는 함수
  const getTweets = async () => {
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
  };
  useEffect(() => {
    getTweets();
  }, []);
  return <TweetWrapper></TweetWrapper>;
}
