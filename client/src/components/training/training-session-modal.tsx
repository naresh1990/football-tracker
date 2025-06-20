import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building,
  Target,
  Activity,
  Trophy,
  Zap,
  Users,
  Dumbbell,
  X
} from "lucide-react";
import moment from "moment-timezone";

interface TrainingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
}

export default function TrainingSessionModal({ isOpen, onClose, session }: TrainingSessionModalProps) {
  if (!session) return null;

  const getTrainingIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'speed & agility':
        return <Zap className="w-5 h-5 text-white" />;
      case 'ball control':
        return <Target className="w-5 h-5 text-white" />;
      case 'team practice':
        return <Users className="w-5 h-5 text-white" />;
      case 'fitness training':
        return <Activity className="w-5 h-5 text-white" />;
      case 'shooting practice':
        return <Trophy className="w-5 h-5 text-white" />;
      default:
        return <Dumbbell className="w-5 h-5 text-white" />;
    }
  };

  const getTrainingColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'speed & agility':
        return 'from-yellow-400 to-orange-500';
      case 'ball control':
        return 'from-blue-400 to-blue-500';
      case 'team practice':
        return 'from-green-400 to-green-500';
      case 'fitness training':
        return 'from-red-400 to-red-500';
      case 'shooting practice':
        return 'from-purple-400 to-purple-500';
      default:
        return 'from-green-400 to-green-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'missed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-br ${getTrainingColor(session.type)} rounded-xl shadow-sm`}>
                {getTrainingIcon(session.type)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{session.type}</h2>
                <p className="text-sm text-gray-500">Training Session Details</p>
              </div>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Date & Time</span>
                </div>
                <p className="font-semibold">
                  {moment.tz(session.date, 'Asia/Kolkata').format('dddd, MMMM DD, YYYY')}
                </p>
                <p className="text-sm text-gray-600">
                  {moment.tz(session.date, 'Asia/Kolkata').format('h:mm A')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Duration</span>
                </div>
                <p className="font-semibold">{session.duration || '60'} minutes</p>
                <p className="text-sm text-gray-600">Standard session</p>
              </CardContent>
            </Card>
          </div>

          {/* Status and Coach */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Status</span>
                </div>
                <Badge className={getStatusColor(session.status)}>
                  {session.status || 'Scheduled'}
                </Badge>
              </CardContent>
            </Card>

            {session.coach && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Coach</span>
                  </div>
                  <p className="font-semibold">{session.coach}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Location */}
          {session.location && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Location</span>
                </div>
                <p className="font-semibold">{session.location}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {session.notes && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Notes</span>
                </div>
                <p className="text-gray-700">{session.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}