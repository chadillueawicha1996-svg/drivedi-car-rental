import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./user/pages/Index";
import NotFound from "./user/pages/NotFound";
import SearchResults from "./user/pages/SearchResults";
import Login from "./user/pages/Login";
import Register from "./user/pages/Register";
import Profile from "./user/pages/Profile";
import Booking from "./user/pages/Booking";
import BookingConfirmation from "./user/pages/BookingConfirmation";
import BookingSuccess from "./user/pages/BookingSuccess";
import CarRegistration from "./user/pages/CarRegistration";
import Payment from "./user/pages/Payment";
import { AdminDashboard } from "./admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking/:carId" element={<Booking />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/car-registration" element={<CarRegistration />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
