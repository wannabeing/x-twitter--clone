import styled from "styled-components";
import { auth, fbDB, fbStorage } from "../firebase";
import { useEffect, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Loader from "../components/loader";
import { AnimatePresence } from "framer-motion";
import { I_MODAL_PROPS, I_TWEET, I_TWEET_BTN_ARGS } from "../type-config";
import GoBackSvg from "/public/icons/goback.svg";
import CameraPlusSvg from "/public/icons/camera-plus.svg";
import EditSvg from "/public/icons/edit.svg";
import DelSvg from "/public/icons/delete.svg";
import UserPlusSvg from "/public/icons/user-plus.svg";
import Modal from "../components/modal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  gap: 20px;
  padding: 10px 20px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  gap: 10px;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;
const GoBack = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
`;
const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const DisplayName = styled.h1`
  font-weight: bold;
`;
const HowmanyPosts = styled.span`
  font-size: 0.8em;
  opacity: 0.7;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;
const ContentTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const AvatarWrapper = styled.label`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 110px;
  height: 110px;
  border: 1px solid gray;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const EditBtn = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.8em;
`;
const ContentMyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const HashName = styled.span`
  opacity: 0.8;
`;
const JoinDate = styled.span`
  opacity: 0.8;
  margin: 10px 0;
`;
const FollowWrapper = styled.div`
  display: flex;
  gap: 10px;
`;
const Follow = styled.div`
  display: flex;
  gap: 5px;
`;
const HowmanyFollows = styled.span`
  font-weight: bold;
`;
const FollowText = styled.span`
  opacity: 0.8;
`;
const AvatarInput = styled.input`
  display: none;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 1px solid white;
  width: 100%;
  height: 100%;
`;
const Tweet = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  min-height: 70px;

  &:last-child {
    border-bottom: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Text = styled.span``;
const ImgWrapper = styled.div`
  margin-bottom: 10px;
`;
const TweetImg = styled.img`
  width: 100%;
  height: auto;
  max-width: 700px;
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

const IconImg = styled.img`
  &.plus {
    position: absolute;
    opacity: 0.7;
    width: 30px;
    top: 50%;
    left: 40%;
    padding: 5px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.8);
  }
  &.anony {
    width: 50px;
  }
`;

export default function Profile() {
  // ✅ currentUser
  const { currentUser: user } = auth;

  // ✅ useHooks
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<I_TWEET[]>([]);
  const [isFetch, setIsFetch] = useState(false);
  const [isClickDel, setIsClickDel] = useState(false);
  const [modalProps, setModalProps] = useState<I_MODAL_PROPS | null>(null);
  const navigate = useNavigate();

  // 🚀 DB에서 데이터 가져오는 함수
  useEffect(() => {
    // ✅ SET LOADING
    setIsFetch(true);

    // ✅ CREATE QUERY
    const myTweetQuery = query(
      collection(fbDB, "tweets"),
      where("uid", "==", user?.uid), // 로그인한 유저의 트윗만 가져오기
      orderBy("createdAt", "desc") // 생성 순으로 내림차순
    );

    // ✅ FETCH QUERY [REALTIME] onSnapshot
    const unsubscribe = onSnapshot(myTweetQuery, (snapshot) => {
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
  }, [user]);

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
    if (!user) return;

    try {
      // ✅ SET LOADING
      setIsClickDel(true);

      // ✅ DB에서 트윗 삭제
      await deleteDoc(doc(fbDB, "tweets", args.tweetID));

      // ✅ [IF] 업로드 이미지가 존재한다면
      if (args.imgUrl !== "") {
        const currentImgRef = ref(
          fbStorage,
          `tweets/uid-${user.uid}/tid-${args.tweetID}`
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

  // 🚀 프로필이미지 업로드 함수
  const onImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;

    const { files } = e.target; // ✅ 업로드한 이미지파일
    const maxSize = 1 * 1024 * 1024; // ✅ SET MAX_SIZE 1MB

    if (files && files.length === 1 && files[0].size <= maxSize) {
      // ✅ 업로드 파일
      const file = files[0];

      // ✅ 미리보기 세팅
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatar(result); // ✅ SET PREVIEW VALUE
      };

      // ✅ 업로드 이미지
      const imgRef = ref(fbStorage, `avatars/${user.uid}`);
      const uploadResult = await uploadBytes(imgRef, file);

      // ✅ 업데이트 이미지
      const imgUrl = await getDownloadURL(uploadResult.ref);
      await updateProfile(user, {
        photoURL: imgUrl,
      });
    }

    // ✅ 파일용량 초과시
    if (files && files[0].size >= maxSize) {
      console.log("❌ 1MB 이하의 파일을 업로드해주세요.");
    }
  };

  // 🚀 뒤로가기 함수
  const onGoback = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      <Header>
        <GoBack onClick={onGoback}>
          <IconImg src={GoBackSvg} />
        </GoBack>
        <HeaderTitle>
          <DisplayName>{user?.displayName}</DisplayName>
          <HowmanyPosts>1 post</HowmanyPosts>
        </HeaderTitle>
      </Header>

      <Contents>
        <ContentTop>
          <AvatarWrapper htmlFor="uploadInput">
            {/* 🔥 프사 존재여부에 따라서 다름 */}
            {avatar ? (
              <>
                <AvatarImg src={avatar} />
                <IconImg className="plus" src={CameraPlusSvg} />
              </>
            ) : (
              <IconImg className="anony" src={UserPlusSvg} />
            )}
          </AvatarWrapper>
          <AvatarInput
            onChange={onImgChange}
            id="uploadInput"
            type="file"
            accept="image/*"
          />
          <EditBtn>Edit profile</EditBtn>
        </ContentTop>

        <ContentMyInfo>
          <DisplayName>{user?.displayName}</DisplayName>
          <HashName>@{user?.email?.split("@")[0]}</HashName>
          <JoinDate>Joined April 2022</JoinDate>
          <FollowWrapper>
            <Follow>
              <HowmanyFollows>1</HowmanyFollows>
              <FollowText>Follwing</FollowText>
            </Follow>
            <Follow>
              <HowmanyFollows>1</HowmanyFollows>
              <FollowText>Follower</FollowText>
            </Follow>
          </FollowWrapper>
        </ContentMyInfo>
      </Contents>

      {!isFetch && tweets ? (
        <Tweets>
          {tweets.map((tweet) => (
            <Tweet key={tweet.id}>
              <ContentWrapper>
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
                  {user && user?.uid === tweet.uid ? (
                    <>
                      <MyBtn type="edit" onClick={() => {}}>
                        <IconImg src={EditSvg} />
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
                        <IconImg src={DelSvg} />
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
          ))}
        </Tweets>
      ) : (
        <Loader />
      )}
    </Wrapper>
  );
}
