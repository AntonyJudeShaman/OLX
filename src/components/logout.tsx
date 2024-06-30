import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { Button } from "./ui/button";

const Logout = () => {
  const navigate = useNavigate();
  const signout = () => {
    signOut(auth)
      .then(() => {
        navigate("/Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Button onClick={signout}>Logout</Button>
    </div>
  );
};

export default Logout;
