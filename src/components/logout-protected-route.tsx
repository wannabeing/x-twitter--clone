import { auth } from "../firebase";
import Error404 from "./404";

export default function LogoutProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = auth.currentUser; // 로그인 여부 확인

  // 로그인 되어있으면 에러페이지 return
  if (isLoggedIn) {
    return <Error404 />;
  } else {
    return children;
  }
}
