import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, Zap, MessageSquare, Trophy } from "lucide-react";
import GameForm from "@/components/forms/game-form";
import TrainingForm from "@/components/forms/training-form";
import FeedbackForm from "@/components/forms/feedback-form";
import TournamentForm from "@/components/forms/tournament-form";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormType = "menu" | "game" | "training" | "feedback" | "tournament";

export default function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const [currentForm, setCurrentForm] = useState<FormType>("menu");

  const handleClose = () => {
    setCurrentForm("menu");
    onClose();
  };

  const handleFormSuccess = () => {
    setCurrentForm("menu");
    onClose();
  };

  const quickActions = [
    {
      title: "Add Game",
      icon: Target,
      color: "text-football-green",
      action: () => setCurrentForm("game")
    },
    {
      title: "Add Training",
      icon: Zap,
      color: "text-field-green",
      action: () => setCurrentForm("training")
    },
    {
      title: "Add Feedback",
      icon: MessageSquare,
      color: "text-trophy-gold",
      action: () => setCurrentForm("feedback")
    },
    {
      title: "Add Tournament",
      icon: Trophy,
      color: "text-yellow-600",
      action: () => setCurrentForm("tournament")
    }
  ];

  const renderContent = () => {
    switch (currentForm) {
      case "game":
        return (
          <GameForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setCurrentForm("menu")}
          />
        );
      case "training":
        return (
          <TrainingForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setCurrentForm("menu")}
          />
        );
      case "feedback":
        return (
          <FeedbackForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setCurrentForm("menu")}
          />
        );
      case "tournament":
        return (
          <TournamentForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setCurrentForm("menu")}
          />
        );
      default:
        return (
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-gray-900">Quick Add</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.action}
                  className="flex flex-col items-center p-6 h-auto border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <action.icon className={`${action.color} w-8 h-8 mb-2`} />
                  <span className="text-sm font-medium">{action.title}</span>
                </Button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={currentForm === "menu" ? "max-w-md" : "max-w-4xl max-h-[90vh] overflow-y-auto"}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
