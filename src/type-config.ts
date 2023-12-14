import { Dispatch, SetStateAction } from "react";

// 트위터 글 인터페이스
export interface I_TWEET {
  id: string;
  text: string;
  uid: string;
  username: string;
  imgUrl: string;
  createdAt: number;
}
// 버튼 인자 타입
export interface I_TWEET_BTN_ARGS {
  tweetID: string;
  imgUrl: string;
}
// 모달 버튼 타입
const MODAL_BTN_TYPE = {
  DELETE: "delete",
  CONFIRM: "confirm",
} as const;
export type MODAL_BTN_TYPE =
  (typeof MODAL_BTN_TYPE)[keyof typeof MODAL_BTN_TYPE];

// 확인-취소 모달 Props
export interface I_MODAL_PROPS {
  title: string;
  text: string;
  btnText: string;
  btnType: MODAL_BTN_TYPE;
  setCancelState: Dispatch<SetStateAction<boolean>>;
  execFunction: () => Promise<void>;
}

// 수정폼 모달 Props
export interface I_EDIT_MODAL_PROPS {
  tweetID: string;
  imgUrl: string;
  setCancelState: Dispatch<SetStateAction<boolean>>;
  text: string;
}
export interface I_TWEET_EDIT_BTN_ARGS extends I_TWEET_BTN_ARGS {
  text: string;
}
