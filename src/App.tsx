
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Watch from "./pages/Watch";
import Channel from "./pages/Channel";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import Explore from "./pages/Explore";
import Navbar from "./components/layout/Navbar";
import History from "./pages/History";
import WatchLater from "./pages/WatchLater";
import LikedVideos from "./pages/LikedVideos";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/watch/:videoId" element={<Watch />} />
            <Route path="/channel/:channelId" element={<Channel />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/search" element={<Search />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/channel" element={<Channel />} />
            <Route path="/history" element={<History />} />
            <Route path="/watch-later" element={<WatchLater />} />
            <Route path="/liked-videos" element={<LikedVideos />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </TooltipProvider>
    </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
