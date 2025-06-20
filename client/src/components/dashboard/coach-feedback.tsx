import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment-timezone";
import { useState } from "react";

interface CoachFeedbackProps {
  playerId: number;
}

export default function CoachFeedback({ playerId }: CoachFeedbackProps) {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/training", { playerId }],
  });

  const { data: upcomingSessions } = useQuery({
    queryKey: ["/api/training/upcoming", { playerId }],
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter sessions that have coach feedback and sort by date (most recent first)
  const feedbackSessions = sessions?.filter((session: any) => session.coachFeedback) || [];
  const sortedFeedback = feedbackSessions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentFeedback = sortedFeedback.slice(0, 3); // Show last 3 feedback items
  
  const nextSlide = () => {
    if (upcomingSessions?.length) {
      setCurrentSlide((prev) => (prev + 1) % upcomingSessions.length);
    }
  };

  const prevSlide = () => {
    if (upcomingSessions?.length) {
      setCurrentSlide((prev) => (prev - 1 + upcomingSessions.length) % upcomingSessions.length);
    }
  };

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
          Coach Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Recent Feedback */}
        <div className="space-y-3">
          
          {recentFeedback.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-gray-600 font-medium text-sm">No recent feedback</p>
              <p className="text-xs text-gray-500 mt-1">Coach feedback will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentFeedback.map((session: any) => (
                <div
                  key={session.id}
                  className="border-l-4 border-blue-400 pl-3 py-2 bg-blue-50/50 rounded-r-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{session.type}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {moment.tz(session.date, 'Asia/Kolkata').format('MMM DD')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{session.coachFeedback}</p>
                  {session.coach && (
                    <p className="text-xs text-gray-500 mt-1">- {session.coach}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
}