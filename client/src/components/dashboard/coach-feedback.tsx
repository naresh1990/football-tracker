import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment-timezone";

interface CoachFeedbackProps {
  playerId: number;
}

export default function CoachFeedback({ playerId }: CoachFeedbackProps) {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/training", { playerId }],
  });

  // Filter sessions that have coach feedback
  const feedbackSessions = sessions?.filter((session: any) => session.coachFeedback) || [];
  const recentFeedback = feedbackSessions.slice(0, 3); // Show last 3 feedback items

  if (isLoading) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-white/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Coach Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Recent Coach Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentFeedback.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-gray-600 font-medium">No feedback yet</p>
            <p className="text-sm text-gray-500 mt-1">Coach feedback will appear here after training sessions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentFeedback.map((session: any, index: number) => (
              <div
                key={session.id}
                className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50/50 rounded-r-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{session.type}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {moment.tz(session.date, 'Asia/Kolkata').format('MMM DD')}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{session.coachFeedback}</p>
                {session.coach && (
                  <p className="text-xs text-gray-500 mt-2">- {session.coach}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}