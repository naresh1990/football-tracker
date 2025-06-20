import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Dashboard from "@/pages/dashboard";
import Games from "@/pages/games";
import Tournaments from "@/pages/tournaments";
import TournamentDetails from "@/pages/tournament-details";
import Training from "@/pages/training";
import Statistics from "@/pages/statistics";
import Clubs from "@/pages/clubs";
import Gallery from "@/pages/gallery";
import NotFound from "@/pages/not-found";
import CleanHeader from "@/components/modern/clean-header";
import MobileMenu from "@/components/layout/mobile-menu";
import QuickAddModal from "@/components/modals/quick-add-modal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/games" component={Games} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/tournament/:id" component={TournamentDetails} />
      <Route path="/training" component={Training} />
      <Route path="/statistics" component={Statistics} />
      <Route path="/clubs" component={Clubs} />
      <Route path="/gallery" component={Gallery} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <CleanHeader 
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onQuickAdd={() => setIsQuickAddModalOpen(true)}
          />
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          
          <main className="relative">
            <Router />
          </main>

          <QuickAddModal 
            isOpen={isQuickAddModalOpen}
            onClose={() => setIsQuickAddModalOpen(false)}
          />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
