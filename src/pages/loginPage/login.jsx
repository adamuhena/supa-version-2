import { Input } from "@/components/ui/input";
import "./login.css";
import { Link } from "react-router-dom";

export default function InputDemo() {
  return (
    <div className="mainDiv">
      <div className="firstChild">
        <img src="../../../public/loginPicture.jpeg" className="loginPicture" />
      </div>
      <div className="secondChild">
        <div className="loginCard">
          <img src="../../../public/supaLogo.png" className="loginSupaLogo" />
          <div className="inputDiv">
            <div>
              <p >Email</p>
              <Input type="email" placeholder="Email" />
            </div>
            <div>
              <p>password</p>
              <Input type="password" placeholder="password" />
            </div>
            <Link><p className="forgetPassword">forgot password? </p></Link>
          </div>
          <button className="h-[42px]  px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
            Login
          </button>
          <p className="sign_up">Do not have account yet? <Link to="/register"><span className="loginSpan">Create account</span></Link></p>
        </div>
      </div>
    </div>
  );
}
