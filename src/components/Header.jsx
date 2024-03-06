import { userAuth } from "../utils/AuthContext";
import { LogOut } from "react-feather";

const Header = () => {
  const { user, hanldeUserLogout } = userAuth();
  return (
    <div id="header--wrapper">
      {user ? (
        <>
          Welcome {user.name}
          <LogOut className="header--link" onClick={hanldeUserLogout} />
        </>
      ) : (
        <>
          <button>Login</button>
        </>
      )}
    </div>
  );
};

export default Header;
