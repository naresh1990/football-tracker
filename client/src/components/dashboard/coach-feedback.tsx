import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Star, Calendar } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface CoachFeedbackProps {
  playerId: number;
}

export default function CoachFeedback({ playerId }: CoachFeedbackProps) {
  const { data: feedback, isLoading } = useQuery({
    queryKey: ["/api/feedback", { playerId, limit: 2 }],
  });

  const getBorderColor = (index: number) => {
    const colors = ['border-field-green', 'border-trophy-gold'];
    return colors[index % colors.length];
  };

  const getTagColor = (tag: string) => {
    const colorMap: { [key: string]: string } = {
      'passing': 'bg-green-100 text-green-800',
      'positioning': 'bg-yellow-100 text-yellow-800',
      'defense': 'bg-blue-100 text-blue-800',
      'crossing': 'bg-purple-100 text-purple-800',
    };
    return colorMap[tag.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Coach Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Coach Feedback</CardTitle>
            </div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {feedback && feedback.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-gray-600 font-medium">No recent feedback</p>
              <p className="text-sm text-gray-500 mt-1">Coach feedback will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedback?.slice(0, 2).map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:bg-white/90 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.coach}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatShortDate(item.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-700">{item.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.feedback}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.slice(0, 3).map((tag: string, tagIndex: number) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
