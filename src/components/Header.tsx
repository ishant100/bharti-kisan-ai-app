import { useState } from "react";
import { Leaf, Bell, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-black">AgriGuide AI</h1>
            <p className="text-sm text-gray-600">Digital Agriculture Assistant</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-black hover:text-gray-700" href="/">Home</a>
          <a className="text-black hover:text-gray-700" href="/chat">Chat.AI</a>
          <a className="text-black hover:text-gray-700" href="/weather">Weather</a>
          <a className="text-black hover:text-gray-700" href="/contacts">Contacts</a>
          <a className="text-black hover:text-gray-700" href="/about">About</a>
        </nav>

        {/* Desktop icons */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-black hover:text-gray-700">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-black hover:text-gray-700">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-black"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-border bg-white/95 backdrop-blur">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
            <a onClick={() => setOpen(false)} href="/">Home</a>
            <a onClick={() => setOpen(false)} href="/chat">Chat.AI</a>
            <a onClick={() => setOpen(false)} href="/weather">Weather</a>
            <a onClick={() => setOpen(false)} href="/contacts">Contacts</a>
            <a onClick={() => setOpen(false)} href="/about">About</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
