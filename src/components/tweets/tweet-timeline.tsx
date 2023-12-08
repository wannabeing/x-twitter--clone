import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, fbDB, fbStorage } from "../../firebase";
import styled from "styled-components";
import Loader from "../loader";
import { deleteObject, ref } from "firebase/storage";
import { AnimatePresence, motion } from "framer-motion";

export interface ITweet {
  id: string;
  text: string;
  uid: string;
  username: string;
  imgUrl: string;
  createdAt: number;
}

interface ITweetFnArgs {
  tweetID: string;
  imgUrl: string;
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
const ImgWrapper = styled.div`
  margin-bottom: 10px;
`;
const TweetImg = styled.img`
  width: 100%;
  height: auto;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
`;

const MyBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
const MyBtn = styled.div<{ type?: string }>`
  color: ${(props) => (props.type === "del" ? "tomato" : "white")};
  width: 20px;
  cursor: pointer;
`;

const TweetDelOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #242d35;
  opacity: 0;
`;
const TweetDelModal = styled(motion.div)`
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
  padding: 20px 0;
`;
const ModalText = styled.span`
  opacity: 0.5;
  margin-bottom: 20px;
`;

const ModalBtn = styled.button<{ type?: string }>`
  border-radius: 15px;
  padding: 15px;
  margin: 10px;
  border: none;
  outline: ${(props) => (props.type === "delete" ? "none" : "2px solid gray")};
  font-weight: bold;
  background-color: ${(props) =>
    props.type === "delete" ? "#f4222d" : "black"};
  color: white;
  cursor: pointer;
`;

export default function TweetTimeLine() {
  // ✅ useHooks
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isFetch, setIsFetch] = useState(false);
  const [isClickDel, setIsClickDel] = useState(false);
  const [delTweetID, setDelTweetID] = useState("");
  const [delTweetImg, setDelTweetImg] = useState("");

  // ✅ currentUser
  const { currentUser } = auth;

  // 🚀 DB에서 데이터 가져오는 함수
  useEffect(() => {
    // ✅ SET LOADING
    setIsFetch(true);

    // ✅ CREATE QUERY
    const tweetQuery = query(
      collection(fbDB, "tweets"),
      orderBy("createdAt", "desc") // 생성 순으로 내림차순
    );

    // ✅ FETCH QUERY [REALTIME] onSnapshot
    const unsubscribe = onSnapshot(tweetQuery, (snapshot) => {
      const result = snapshot.docs.map((doc) => {
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
      setIsFetch(false);
    });

    // ✅ onSnapshot UNMOUNT
    return () => {
      unsubscribe();
    };
  }, []);

  // 🚀 트윗 삭제 버튼 클릭 함수
  const onClickDelBtn = (args: ITweetFnArgs) => {
    setIsClickDel(true);
    setDelTweetID(args.tweetID);
    args.imgUrl === "" ? null : setDelTweetImg(args.imgUrl);
  };

  // 🚀 트윗 삭제하는 함수
  const onDelete = async (args: ITweetFnArgs) => {
    if (!currentUser) return;

    try {
      // ✅ SET LOADING
      setIsClickDel(true);

      // ✅ DB에서 트윗 삭제
      await deleteDoc(doc(fbDB, "tweets", args.tweetID));

      // ✅ [IF] 업로드 이미지가 존재한다면
      if (args.imgUrl !== "") {
        const currentImgRef = ref(
          fbStorage,
          `tweets/uid-${currentUser.uid}/tid-${args.tweetID}`
        );
        // ✅ Storage에서 업로드이미지 삭제
        await deleteObject(currentImgRef);
      }
    } catch (error) {
      console.log("❌ TWEET DELETE ERROR: ", error);
    } finally {
      // ✅ RESET LOADING
      setIsClickDel(false);
    }
  };
  return (
    <Wrapper>
      {!isFetch && tweets ? (
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
              {/* 🔥 이미지를 업로드 했으면 이미지가 보임 */}
              {tweet.imgUrl ? (
                <ImgWrapper>
                  <TweetImg src={tweet.imgUrl} />
                </ImgWrapper>
              ) : (
                ""
              )}
              <MyBtnWrapper>
                {/* 🔥 로그인유저와 작성유저가 같으면 수정 & 삭제버튼 보임 */}
                {currentUser && currentUser?.uid === tweet.uid ? (
                  <>
                    <MyBtn type="edit" onClick={() => {}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </MyBtn>
                    <MyBtn
                      type="del"
                      onClick={() => {
                        onClickDelBtn({
                          tweetID: tweet.id,
                          imgUrl: tweet.imgUrl,
                        });
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </MyBtn>
                    {/* 🔥 삭제버튼 클릭 시, 모달창 띄움 */}
                    <AnimatePresence>
                      {isClickDel ? (
                        <TweetDelOverlay
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <TweetDelModal
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <ModalWrapper>
                              <ModalTitle>Delete post?</ModalTitle>
                              <ModalText>
                                This can’t be undone and it will be removed from
                                your profile, the timeline of any accounts that
                                follow you, and from search results.
                              </ModalText>
                              <ModalBtn
                                type="delete"
                                onClick={() =>
                                  onDelete({
                                    tweetID: delTweetID,
                                    imgUrl: delTweetImg,
                                  })
                                }
                              >
                                삭제
                              </ModalBtn>
                              <ModalBtn onClick={() => setIsClickDel(false)}>
                                취소
                              </ModalBtn>
                            </ModalWrapper>
                          </TweetDelModal>
                        </TweetDelOverlay>
                      ) : null}
                    </AnimatePresence>
                  </>
                ) : null}
              </MyBtnWrapper>
            </ContentWrapper>
          </Tweet>
        ))
      ) : (
        <Loader />
      )}
    </Wrapper>
  );
}
