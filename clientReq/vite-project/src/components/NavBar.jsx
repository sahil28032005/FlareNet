import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const NavBar = () => {
  const { user, removeUserData } = useUser();
  const navigate = useNavigate();

  // LogOut function
  const handleLogout = () => {
    localStorage.removeItem("authTokenLogin");
    removeUserData();
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-transparent backdrop-blur-md z-50">
      {/* Logo Section */}
      <div className="text-2xl font-bold text-yellow-400">FlareNet</div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-6">
        {!user?.email ? (
          <>
            <Button
              onClick={() => navigate("/login")}
              className="bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <FaSignInAlt />
              Login
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-yellow-400 text-black hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <FaUserPlus />
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <FaUserCircle className="text-yellow-400 text-2xl" />
              <span className="text-white text-lg font-medium">Welcome, {user?.email}</span>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              <FaSignOutAlt />
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
