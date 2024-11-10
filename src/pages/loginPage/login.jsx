import { Input } from "@/components/ui/input";
import "./login.css";

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
    <p>Email</p>
    <Input type="email" placeholder="Email" />
    </div>
<div>
<p>password</p>
<Input type="password" placeholder="password" />
</div>

</div>
<button className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
              Login
            </button>
        </div>
      </div>
    </div>
  );
}
