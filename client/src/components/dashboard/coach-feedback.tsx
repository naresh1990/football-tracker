import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-gray-900">Coach Feedback</CardTitle>
          <Button variant="ghost" size="sm" className="text-football-green hover:text-green-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No feedback available</p>
          ) : (
            feedback?.map((item: any, index: number) => (
              <div key={item.id} className={`border-l-4 ${getBorderColor(index)} pl-4`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900">{item.coach}</p>
                  <span className="text-sm text-gray-500">{formatShortDate(item.date)}</span>
                </div>
                <p className="text-gray-700 mb-2 text-sm">{item.comment}</p>
                <div className="flex flex-wrap gap-2">
                  {item.strengths?.map((strength: string, i: number) => (
                    <Badge key={i} className={getTagColor(strength)} variant="secondary">
                      {strength}
                    </Badge>
                  ))}
                  {item.improvements?.map((improvement: string, i: number) => (
                    <Badge key={i} className={getTagColor(improvement)} variant="secondary">
                      {improvement}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
