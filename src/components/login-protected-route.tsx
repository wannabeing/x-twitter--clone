import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function LoginProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = auth.currentUser; // 로그인 여부 확인

  // 로그인 안되어있으면 로그아웃페이지 return
  if (isLoggedIn === null) {
    return <Navigate to="/logout" />;
  } else {
    return children;
  }
}
