import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Goal, Circle, BarChart3, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressChartProps {
  playerId: number;
}

export default function ProgressChart({ playerId }: ProgressChartProps) {
  const { data: games, isLoading } = useQuery({
    queryKey: ["/api/games", { playerId }],
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Performance Trends</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Performance Trends</h3>
        </div>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goals & Assists Chart */}
            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-800">Goals & Assists</h4>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Goal className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-medium text-gray-600">Goals</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle className="w-3 h-3 text-orange-500" />
                    <span className="text-xs font-medium text-gray-600">Assists</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="game" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goals" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Goals"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="assists" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      name="Assists"
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            {/* Position Analysis */}
            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Position Analysis</h4>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="h-48 w-full">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm font-medium">No data available</p>
                      </div>
                    </div>
                  )}
                </div>
                {pieData.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3">
                    {pieData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-xs font-medium text-gray-700">{entry.name}</span>
                        <span className="text-xs text-gray-500">
                          ({((entry.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
