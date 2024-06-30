import AuthButton from "../components/AuthButton";
import TrendMovie from "../components/TrendMovie"
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";


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
          <Image 
            alt="d logo"
            src="/svg/dot/Dotcopy.svg"
            className="w-fit h-10" 
            width={100}
            height={50}
          />
          <Image 
            alt="ot logo" 
            src="/svg/dot/OT(name).svg" 
            className="hidden md:block" 
            width={100}
            height={50}  
          />
        </div>
        <div>
          <button>
            {isSupabaseConnected && <AuthButton />}
          </button>
        </div>
      </nav>
      <div>

        <TrendMovie />
      </div>
          {/* TODO: add trend movies and series to landing page */}
    </div>
  );
}
