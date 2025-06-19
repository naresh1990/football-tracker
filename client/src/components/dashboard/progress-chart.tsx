import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ProgressChartProps {
  playerId: number;
}

export default function ProgressChart({ playerId }: ProgressChartProps) {
  const { data: games, isLoading } = useQuery({
    queryKey: ["/api/games", { playerId }],
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for performance chart
  const performanceData = games?.slice(-10).map((game: any, index: number) => ({
    game: index + 1,
    goals: game.playerGoals || 0,
    assists: game.playerAssists || 0,
  })) || [];

  // Prepare data for position chart
  const positionData = games?.reduce((acc: any, game: any) => {
    const position = game.positionPlayed || 'Unknown';
    acc[position] = (acc[position] || 0) + 1;
    return acc;
  }, {}) || {};

  const pieData = Object.entries(positionData).map(([position, count]) => ({
    name: position,
    value: count,
  }));

  const COLORS = ['hsl(105, 66%, 13%)', 'hsl(142, 76%, 73%)', 'hsl(45, 93%, 58%)', '#8884d8'];

  return (
    <section>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-4">Goals & Assists (Last 10 Games)</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="game" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="goals" 
                      stroke="hsl(105, 66%, 13%)" 
                      strokeWidth={2}
                      name="Goals"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="assists" 
                      stroke="hsl(45, 93%, 58%)" 
                      strokeWidth={2}
                      name="Assists"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-4">Position Analysis</h4>
              <div className="h-64">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p>No position data available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
