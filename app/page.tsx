import { Avatar, Button } from "@mui/material";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="container">
      <nav className="w-full flex justify-between items-center h-16 py-2">
        <div className="flex">
          <Avatar alt="d logo" src="/svg/dot/Dotcopy.svg" className="w-fit h-10" />
          <Avatar alt="d logo" src="/svg/dot/OT(name).svg" className="hidden md:block w-fit h-10" />
        </div>
        <div>
          <Button variant="contained">
            {isSupabaseConnected && <AuthButton />}
          </Button>
          {/* TODO: add trend movies and series to landing page */}
        </div>
      </nav>
    </div>
  );
}
