import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const NavBar = ({ username, setUsername }) => {
  const navigate = useNavigate();

  //logOut function
  const handleLogout = () => {
    localStorage.removeItem("authTokenLogin");
    setUsername(null);
  }
  return (
   
    <>
     <nav className="fixed top-4 left-0 w-full flex justify-center z-50">
      <div className="w-fit rounded-full border border-white/30 shadow-md backdrop-blur-md px-6 py-3">
        <Tabs defaultValue="features">
          <TabsList className="flex gap-6 rounded-full bg-transparent">
            <TabsTrigger
              value="features"
              className="text-white glowing-shadcn transition-all"
            >
              Features
            </TabsTrigger>
            <TabsTrigger
              value="how-it-works"
              className="text-white glowing-shadcn transition-all"
            >
              How It Works
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className="text-white glowing-shadcn transition-all"
            >
              Testimonials
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="text-white glowing-shadcn transition-all"
            >
              FAQ
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </nav>
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-transparent z-20">
        <div className="text-2xl font-bold text-yellow-400">FlareNet</div>
        <div className="flex items-center space-x-4">
          {!username ? (
            <>
              <Button
                onClick={() => navigate("/login")}
                className="bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-lg transition-all duration-300"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="bg-yellow-400 text-black hover:bg-gray-200 px-4 py-2 rounded-lg transition-all duration-300"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <span className="text-gray-300">Welcome, {username}!</span>
              <Button
                onClick={handleLogout}
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-300"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

    </>
  );
};

export default NavBar;
