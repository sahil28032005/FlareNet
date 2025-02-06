import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from "react-icons/fa";
import { FiHome, FiFolder, FiInfo, FiMail } from "react-icons/fi";

const NavBar = () => {
  const { user, removeUserData } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authTokenLogin");
    removeUserData();
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-sm border-b border-white/20 z-50 p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          FlareNet
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Tabs */}
        <div className={`md:flex items-center space-x-4 flex-grow max-w-2xl mx-8 ${menuOpen ? "block" : "hidden"} md:block`}>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            {[{ name: "Home", icon: FiHome, path: "/" },
              { name: "My Projects", icon: FiFolder, path: "/projects" },
              { name: "About Us", icon: FiInfo, path: "/about" },
              { name: "Contact Us", icon: FiMail, path: "/contact" }].map(({ name, icon: Icon, path }) => (
              <Button
                key={name}
                variant="ghost"
                onClick={() => { navigate(path); setMenuOpen(false); }}
                className="text-white/90 hover:text-yellow-400 transition-all duration-300 px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 shadow-sm hover:shadow-md"
              >
                <Icon className="text-xl" />
                {name}
              </Button>
            ))}
          </div>
        </div>

        {/* User Auth Buttons */}
        <div className={`md:flex items-center space-x-6 ${menuOpen ? "block" : "hidden"} md:block`}>
          {!user?.email ? (
            <>
              <Button
                variant="ghost"
                onClick={() => { navigate("/login"); setMenuOpen(false); }}
                className="border border-yellow-400 text-yellow-400 hover:bg-yellow-50 transition-colors duration-200 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaSignInAlt className="text-yellow-400" />
                Login
              </Button>
              <Button
                variant="primary"
                onClick={() => { navigate("/signup"); setMenuOpen(false); }}
                className="bg-yellow-400 text-black hover:bg-yellow-300 transition-colors duration-200 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaUserPlus className="text-white" />
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <FaUserCircle className="text-yellow-400 text-2xl" />
                <span className="text-white/90 text-lg font-medium">
                  Welcome, {user?.email}
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="border border-red-500 text-red-500 hover:bg-red-50 transition-colors duration-200 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaSignOutAlt className="text-red-500" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;