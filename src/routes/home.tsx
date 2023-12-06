import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Home() {
  // ✅ useHooks
  const navigate = useNavigate();

  return (
    <>
      <h1>Home</h1>
      <button
        onClick={() => {
          auth.signOut();
          navigate("/logout");
        }}
      >
        LGOUT
      </button>
    </>
  );
}
