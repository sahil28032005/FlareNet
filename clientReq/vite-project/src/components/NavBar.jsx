import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NavBar = () => {
  return (
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
  );
};

export default NavBar;
