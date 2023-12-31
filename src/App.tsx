import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import Loader from "./components/loader";
import { auth } from "./firebase";
import Logout from "./routes/logout";
import LoginProtectedRoute from "./components/login-protected-route";
import LogoutProtectedRoute from "./components/logout-protected-route";

// ✅ SET Router
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LoginProtectedRoute>
        <Layout />
      </LoginProtectedRoute>
    ),

    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "logoutModal",
        element: <Home />,
      },

      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },

  {
    path: "/",
    element: (
      <LogoutProtectedRoute>
        <Outlet />
      </LogoutProtectedRoute>
    ),
    children: [
      {
        path: "/login",
        element: <Logout />,
      },
      {
        path: "/signup",
        element: <Logout />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
]);

// ✅ SET Global Styles
const GlobalStyles = createGlobalStyle`
  ${reset};

  * {
    box-sizing: border-box;
  }

  body {
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
`;
function App() {
  // ✅ SET 파이어베이스 연결
  const [fbLoading, setFbLoading] = useState(true);
  const initFb = async () => {
    await auth.authStateReady();
    setFbLoading(false);
  };

  useEffect(() => {
    initFb();
  }, []);

  return (
    <>
      <GlobalStyles />

      {fbLoading ? (
        <Loader />
      ) : (
        <Wrapper>
          <RouterProvider router={router}></RouterProvider>
        </Wrapper>
      )}
    </>
  );
}

export default App;
