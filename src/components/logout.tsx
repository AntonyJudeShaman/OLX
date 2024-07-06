import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { Button } from "./ui/button";

export const signout = () => {
  const navigate = useNavigate();
  signOut(auth)
    .then(() => {
      navigate("/Login");
    })
    .catch((error) => {
      console.log(error);
    });
};
const Logout = () => {
  return (
    <div>
      <Button onClick={signout}>Logout</Button>
    </div>
  );
};

export default Logout;
