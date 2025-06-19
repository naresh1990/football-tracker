import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  X, 
  Dumbbell, 
  Target, 
  Zap, 
  Users, 
  Activity, 
  Trophy,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Camera,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import TrainingForm from "@/components/forms/training-form";
import { useToast } from "@/hooks/use-toast";
import EmptyState from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';
import { useState } from 'react';

// Configure moment for IST timezone
const localizer = momentLocalizer(moment);

export default function Training() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const playerId = 1;
  
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/training", { playerId }],
  });

  const { data: clubs } = useQuery({
    queryKey: ["/api/clubs"],
  });

  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ id, attendance }: { id: number; attendance: string }) => {
      const response = await fetch(`/api/training/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance }),
      });
      if (!response.ok) throw new Error('Failed to update attendance');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      toast({
        title: "Attendance Updated",
        description: "Training session attendance has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update attendance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: async ({ id, coachFeedback }: { id: number; coachFeedback: string }) => {
      const response = await fetch(`/api/training/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coachFeedback }),
      });
      if (!response.ok) throw new Error('Failed to update feedback');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      toast({
        title: "Feedback Added",
        description: "Coach feedback has been added successfully.",
      });
      setShowFeedbackForm(false);
      setFeedbackText('');
      setShowEventDetails(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/training/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      toast({
        title: "Session Deleted",
        description: "Training session has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateAttendance = (id: number, attendance: string) => {
    updateAttendanceMutation.mutate({ id, attendance });
  };

  const deleteSession = (id: number) => {
    deleteSessionMutation.mutate(id);
  };

  const formatDate = (date: string | Date) => {
    return moment(date).tz('Asia/Kolkata').format('MMMM Do, YYYY');
  };

  const formatShortDate = (date: string | Date) => {
    return moment(date).tz('Asia/Kolkata').format('MMM D, YYYY');
  };

  const formatTime = (date: string | Date) => {
    return moment(date).tz('Asia/Kolkata').format('h:mm A');
  };

  const getClubLogo = (coachName: string) => {
    if (!clubs) return null;
    
    const club = clubs.find((club: any) => 
      club.coaches?.some((coach: any) => coach.name === coachName)
    );
    
    return club?.logo || null;
  };

  const getAttendanceBadge = (attendance: string) => {
    switch (attendance) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'missed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Missed</Badge>;
      case 'cancelled':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Cancelled</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>;
    }
  };

  const getTrainingIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'speed & agility':
        return Zap;
      case 'ball control':
        return Target;
      case 'team practice':
        return Users;
      case 'fitness training':
        return Activity;
      case 'shooting practice':
        return Trophy;
      case 'tactical training':
        return Users;
      default:
        return Dumbbell;
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
      case 'tactical training':
        return 'from-indigo-400 to-indigo-500';
      default:
        return 'from-green-400 to-green-500';
    }
  };

  const getEventColor = (attendance: string) => {
    switch (attendance) {
      case 'completed':
        return '#10B981'; // green
      case 'pending':
        return '#3B82F6'; // blue
      case 'cancelled':
        return '#F59E0B'; // yellow
      case 'missed':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'speed & agility':
        return '#F59E0B';
      case 'ball control':
        return '#3B82F6';
      case 'team practice':
        return '#10B981';
      case 'fitness training':
        return '#EF4444';
      case 'shooting practice':
        return '#8B5CF6';
      case 'tactical training':
        return '#6366F1';
      default:
        return '#10B981';
    }
  };

  // Transform sessions into calendar events
  const events = sessions?.map((session: any) => {
    // Parse UTC date and convert to IST for display
    const startMoment = moment.utc(session.date).tz('Asia/Kolkata');
    const endMoment = startMoment.clone().add(session.duration || 90, 'minutes');
    
    return {
      id: session.id,
      title: session.type,
      start: startMoment.toDate(),
      end: endMoment.toDate(),
      resource: session,
      allDay: false,
    };
  }) || [];

  const eventStyleGetter = (event: any) => {
    const session = event.resource;
    const backgroundColor = getEventColor(session.attendance);
    const borderColor = getTypeColor(session.type);
    
    return {
      style: {
        backgroundColor,
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderLeftColor: borderColor,
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px',
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }
    };
  };

  const EventComponent = ({ event }: { event: any }) => {
    const session = event.resource;
    const TrainingIcon = getTrainingIcon(session.type);
    const iconColor = getTypeColor(session.type);
    
    return (
      <div className="flex items-center gap-1 text-xs">
        <TrainingIcon 
          className="w-3 h-3 flex-shrink-0" 
          style={{ color: iconColor }}
        />
        <span className="truncate">
          {event.title}
        </span>
      </div>
    );
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
    setShowEventDetails(true);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: any) => {
    setView(newView);
  };

  // Custom toolbar component for calendar
  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </Button>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900">{label}</h2>
      
      <div className="flex items-center gap-2">
        <Button
          variant={view === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('month')}
        >
          Month
        </Button>
        <Button
          variant={view === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('week')}
        >
          Week
        </Button>
        <Button
          variant={view === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('day')}
        >
          Day
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 text-lg font-medium">Loading training sessions...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Training Calendar</h1>
            <p className="text-lg text-gray-600">Track your football training progress and development</p>
          </div>
          
          <div className="flex gap-3">
            <TrainingForm />
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex justify-end items-center mb-6 gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-violet-500 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Missed</span>
            </div>
          </div>
        </motion.div>

        {/* Calendar */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-white/20 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            view={view}
            onView={handleViewChange}
            date={date}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            step={30}
            showMultiDayTimes
            culture="en-GB"
            components={{
              toolbar: CustomToolbar,
              event: EventComponent,
            }}
          />
        </motion.div>

        {/* Event Details Modal */}
        <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
          <DialogContent className="max-w-2xl bg-white" aria-describedby="training-event-details">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedEvent && (
                  <>
                    <div className={`w-12 h-12 bg-gradient-to-br ${getTrainingColor(selectedEvent.type)} rounded-xl flex items-center justify-center shadow-md`}>
                      {(() => {
                        const TrainingIcon = getTrainingIcon(selectedEvent.type);
                        return <TrainingIcon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedEvent.type}</h3>
                      <p className="text-sm text-gray-600">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-6" id="training-event-details">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  {getAttendanceBadge(selectedEvent.attendance || 'pending')}
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white shadow-lg border border-gray-200 rounded-md min-w-[160px] z-50">
                        <DropdownMenuItem 
                          onClick={() => {
                            updateAttendance(selectedEvent.id, 'completed');
                            setShowEventDetails(false);
                          }}
                          className="text-green-600 hover:bg-green-50 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            updateAttendance(selectedEvent.id, 'missed');
                            setShowEventDetails(false);
                          }}
                          className="text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Mark Missed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            updateAttendance(selectedEvent.id, 'cancelled');
                            setShowEventDetails(false);
                          }}
                          className="text-yellow-600 hover:bg-yellow-50 cursor-pointer"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Mark Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        deleteSession(selectedEvent.id);
                        setShowEventDetails(false);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-2">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-gray-900">{formatShortDate(selectedEvent.date)}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-2">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-gray-900">{formatTime(selectedEvent.date)}</div>
                    <div className="text-xs text-gray-500">{selectedEvent.duration} minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">{selectedEvent.location || 'TBD'}</div>
                  </div>
                </div>

                {/* Coach */}
                {selectedEvent.coach && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Coach</div>
                      <div className="text-sm text-gray-600">{selectedEvent.coach}</div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedEvent.notes && (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="font-medium text-gray-900 mb-2">Session Notes</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedEvent.notes}</p>
                  </div>
                )}

                {/* Coach Feedback Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Coach Feedback
                  </h4>
                  {selectedEvent.coachFeedback ? (
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-gray-700 text-sm">{selectedEvent.coachFeedback}</p>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm italic">No feedback provided yet</div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setFeedbackText(selectedEvent.coachFeedback || '');
                      setShowFeedbackForm(true);
                    }}
                  >
                    {selectedEvent.coachFeedback ? 'Edit Feedback' : 'Add Feedback'}
                  </Button>
                </div>

                {/* Gallery Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Session Gallery
                  </h4>
                  {selectedEvent.gallery && selectedEvent.gallery.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {selectedEvent.gallery.map((image: string, index: number) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Session photo ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm italic mb-3">No photos added yet</div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* TODO: Open gallery upload */}}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Photos
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Feedback Form Modal */}
        <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent?.coachFeedback ? 'Edit Coach Feedback' : 'Add Coach Feedback'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Enter coach feedback for this training session..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFeedbackForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedEvent && feedbackText.trim()) {
                      updateFeedbackMutation.mutate({
                        id: selectedEvent.id,
                        coachFeedback: feedbackText.trim()
                      });
                    }
                  }}
                  disabled={!feedbackText.trim() || updateFeedbackMutation.isPending}
                  className="flex-1"
                >
                  {updateFeedbackMutation.isPending ? 'Saving...' : 'Save Feedback'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {(!sessions || sessions.length === 0) && (
          <EmptyState
            icon={Dumbbell}
            title="No training sessions yet"
            description="Start tracking your football training journey to monitor progress and improve your skills systematically."
            actionLabel="Add Your First Session"
            action={<TrainingForm />}
          />
        )}
      </div>
    </div>
  );
}