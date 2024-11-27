import { useNavigate } from "react-router-dom";
import {toast} from "sonner"

const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("userRole");

    localStorage.clear();
    toast.success("Logged Out Successfully...");
    navigate("/login");
    console.log("User logged out");
  };
};

export default useLogout;
