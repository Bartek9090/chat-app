import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();
    console.log("CREDS auth context:", credentials);
    try {
      const response = await account.createEmailSession(
        credentials.email,
        credentials.password
      );
      console.log("loggedin:", response);
      const accountDetails = await account.get();

      setUser(accountDetails);
      navigate("/");
      console.log("You are in");
    } catch (error) {
      console.log(error);
    }
  };

  const hanldeUserLogout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  const handleUserRegister = async (e, credentials) => {
    e.preventDefault();
    console.log("Handle Register triggered!", credentials);

    if (credentials.password1 !== credentials.password2) {
      alert("Passwords did not match!");
      return;
    }

    try {
      let response = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password1,
        credentials.name
      );
      console.log("User registered!", response);

      await account.createEmailSession(
        credentials.email,
        credentials.password1
      );
      let accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const contextData = {
    user,
    handleUserLogin,
    hanldeUserLogout,
    handleUserRegister,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading</p> : children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;
