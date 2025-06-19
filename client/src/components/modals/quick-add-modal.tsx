import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, Zap, MessageSquare, Trophy, Building, User, ArrowLeft } from "lucide-react";
import GameForm from "@/components/forms/game-form";
import TrainingForm from "@/components/forms/training-form";
import FeedbackForm from "@/components/forms/feedback-form";
import TournamentForm from "@/components/forms/tournament-form";
import ClubForm from "@/components/forms/club-form";
import CoachForm from "@/components/forms/coach-form";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormType = "menu" | "game" | "training" | "feedback" | "tournament" | "club" | "coach";

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
      title: "Record Game",
      description: "Track match performance",
      icon: Target,
      color: "from-football-primary to-football-secondary",
      action: () => setCurrentForm("game")
    },
    {
      title: "Log Training",
      description: "Document training session",
      icon: Zap,
      color: "from-blue-500 to-blue-600",
      action: () => setCurrentForm("training")
    },
    {
      title: "Coach Feedback",
      description: "Record coach insights",
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      action: () => setCurrentForm("feedback")
    },
    {
      title: "Add Tournament",
      description: "Create tournament entry",
      icon: Trophy,
      color: "from-yellow-500 to-yellow-600",
      action: () => setCurrentForm("tournament")
    },
    {
      title: "Manage Club",
      description: "Club information",
      icon: Building,
      color: "from-purple-500 to-purple-600",
      action: () => setCurrentForm("club")
    },
    {
      title: "Add Coach",
      description: "Coach profile setup",
      icon: User,
      color: "from-teal-500 to-teal-600",
      action: () => setCurrentForm("coach")
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
      case "club":
        return (
          <ClubForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setCurrentForm("menu")}
          />
        );
      case "coach":
        return (
          <CoachForm 
            onSuccess={handleFormSuccess}
            onCancel={() => setCurrentForm("menu")}
          />
        );
      default:
        return (
          <motion.div 
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="mb-8 text-center">
              <DialogTitle className="text-3xl font-bold text-display text-gradient mb-2">
                Quick Actions
              </DialogTitle>
              <p className="text-muted-foreground">
                Choose an action to record your football journey
              </p>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className="p-6 cursor-pointer group hover:shadow-xl border border-gray-200 hover:border-blue-300 rounded-xl bg-white hover:bg-blue-50 transition-all duration-300"
                        onClick={action.action}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`
                            w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} 
                            flex items-center justify-center text-white shadow-lg
                            group-hover:scale-110 transition-transform duration-300
                          `}>
                            <Icon className="w-7 h-7" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={() => onClose()}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
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
