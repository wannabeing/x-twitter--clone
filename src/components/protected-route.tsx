import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = auth.currentUser; // 로그인 여부 확인
  console.log("login??: ", isLoggedIn);

  // 로그인 여부에 따라 다른 컴포넌트 return
  if (isLoggedIn === null) {
    return <Navigate to="/logout" />;
  } else {
    return children;
  }
}
