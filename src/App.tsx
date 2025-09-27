import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Voice from "./pages/Voice";
import ImageAnalysis from "./pages/ImageAnalysis";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Weather from "./pages/Weather";
import Contacts from "./pages/Contacts";
import { Header } from "@/components/Header";


// import Header from "@/components/Header"; // <- uncomment if you added a global header

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
       <Header />
       <div className="h-16" />
        {/* <Header />  */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/contacts" element={<Contacts />} />

          <Route path="/voice" element={<Voice />} />               {/* NEW */}
          <Route path="/image" element={<ImageAnalysis />} />  

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
