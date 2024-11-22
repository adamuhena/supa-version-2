import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("userRole");

    localStorage.clear();


    navigate("/login");
    console.log("User logged out");
  };
};

export default useLogout;
