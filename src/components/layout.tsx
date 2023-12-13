import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import LogoutModal from "./users/logout-modal";
import HomeSvg from "/public/icons/home.svg";
import ExitSvg from "/public/icons/exit.svg";
import UserSvgComponent from "./user-svg-component";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 10px;
  width: 100%;
  max-width: 860px;
  height: 100%;
  margin: 0 auto;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px 0;
`;
const MenuItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  padding: 10px;
  border: 2px solid #abaeaf;
  border-radius: 50%;
  cursor: pointer;

  &.logout-menu {
    border-color: tomato;
  }
`;

const MenuIcon = styled.img``;

export default function Layout() {
  // ✅ useHooks
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    setLogoutModal(true);
    navigate("/logoutModal");
  };
  return (
    <>
      <Wrapper>
        <Menu>
          <Link to="/">
            <MenuItem>
              <MenuIcon src={HomeSvg} />
            </MenuItem>
          </Link>
          <Link to="/profile">
            <MenuItem>
              <UserSvgComponent colorProp="#abaeaf" />
            </MenuItem>
          </Link>

          <MenuItem onClick={onLogout} className="logout-menu">
            <MenuIcon src={ExitSvg} />
          </MenuItem>
        </Menu>
        <Outlet />
      </Wrapper>
      {logoutModal ? <LogoutModal /> : null}
    </>
  );
}
