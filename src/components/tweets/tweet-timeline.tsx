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
import { AnimatePresence } from "framer-motion";
import { I_MODAL_PROPS, I_TWEET, I_TWEET_BTN_ARGS } from "../../type-config";
import Modal from "../modal";
import EditSvg from "/public/icons/edit.svg";
import DelSvg from "/public/icons/delete.svg";
import UserSvgComponent from "../user-svg-component";

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

const ProfileWrapper = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.2);
  .anony {
    width: 20px;
  }
`;
const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  height: 20px;
  cursor: pointer;
`;

const SvgBtn = styled.img`
  width: 20px;
`;

export default function TweetTimeLine() {
  // ✅ useHooks
  const [tweets, setTweets] = useState<I_TWEET[]>([]);
  const [isFetch, setIsFetch] = useState(false);
  const [isClickDel, setIsClickDel] = useState(false);
  const [modalProps, setModalProps] = useState<I_MODAL_PROPS | null>(null);

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
  const onClickDelBtn = (args: I_TWEET_BTN_ARGS) => {
    setIsClickDel(true);

    // ✅ 모달에 전달할 Props 설정
    setModalProps({
      title: "Delete post?",
      text: `This can’t be undone and it will be removed from your profile, 
        the timeline of any accounts that follow you, and from search
        results.`,
      btnText: "삭제",
      btnType: "delete",
      setCancelState: setIsClickDel,
      execFunction: () =>
        onDelete({ tweetID: args.tweetID, imgUrl: args.imgUrl }),
    });
  };

  // 🚀 트윗 삭제하는 함수
  const onDelete = async (args: I_TWEET_BTN_ARGS) => {
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
              <ProfileWrapper>
                {/* 🔥 프사 존재여부에 따라서 다름 */}
                {currentUser?.photoURL ? (
                  <>
                    <ProfileImg src={currentUser.photoURL} />
                  </>
                ) : (
                  <UserSvgComponent colorProp="white" />
                )}
              </ProfileWrapper>
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
                      <SvgBtn src={EditSvg} />
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
                      <SvgBtn src={DelSvg} />
                    </MyBtn>
                    {/* 🔥 삭제버튼 클릭 시, 모달창 띄움 */}
                    <AnimatePresence>
                      {isClickDel && modalProps ? (
                        <Modal {...modalProps} />
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
