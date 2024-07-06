import { useAuth } from "../lib/auth";
import UserDashboard from "./user";

function Settings() {
  const user = useAuth();
  return (
    user?.uid && (
      <div className="min-h-screen">
        <UserDashboard />
      </div>
    )
  );
}

export default Settings;
