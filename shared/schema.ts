import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Player profile
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  position: text("position").notNull(),
  teamName: text("team_name").notNull(),
  jerseyNumber: text("jersey_number"),
  isCaptain: boolean("is_captain").default(false),
  division: text("division"),
});

// Games tracking
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  gameType: text("game_type").notNull(), // "practice", "friendly", "tournament"
  matchFormat: text("match_format").notNull(), // "2v2", "4v4", "5v5", "7v7"
  tournamentId: integer("tournament_id"), // linked to tournament if game_type is "tournament"
  opponent: text("opponent").notNull(),
  date: timestamp("date").notNull(),
  homeAway: text("home_away").notNull(), // 'home' or 'away'
  teamScore: integer("team_score").notNull(),
  opponentScore: integer("opponent_score").notNull(),
  playerGoals: integer("player_goals").default(0),
  playerAssists: integer("player_assists").default(0),
  positionPlayed: text("position_played").notNull(),
  minutesPlayed: integer("minutes_played").default(0),
  mistakes: integer("mistakes").default(0), // number of mistakes made
  rating: text("rating"), // coach rating
  coachFeedback: text("coach_feedback"), // immediate post-match feedback
  notes: text("notes"),
});

// Tournaments
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  clubId: integer("club_id"), // linked to club
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: text("status").notNull(), // 'upcoming', 'active', 'completed'
  format: text("format"), // 'league', 'knockout', 'group'
  totalTeams: integer("total_teams"),
  currentPosition: integer("current_position"), // extracted from points table
  points: integer("points").default(0), // extracted from points table
  pointsTableImage: text("points_table_image"),
});

// Training sessions
export const trainingSessions = pgTable("training_sessions", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  type: text("type").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  location: text("location"),
  coach: text("coach"),
  notes: text("notes"),
  completed: boolean("completed").default(false),
  attendance: text("attendance").default("pending"), // "pending", "completed", "missed"
  coachFeedback: text("coach_feedback"),
  gallery: text("gallery").array(),
});

// Coach feedback
export const coachFeedback = pgTable("coach_feedback", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  gameId: integer("game_id"),
  coach: text("coach").notNull(),
  date: timestamp("date").notNull(),
  comment: text("comment").notNull(),
  strengths: text("strengths").array(),
  improvements: text("improvements").array(),
  rating: decimal("rating"),
});

// Squad/team members
export const squadMembers = pgTable("squad_members", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  clubId: integer("club_id"), // linked to club
  name: text("name").notNull(),
  position: text("position").notNull(), // "Goalkeeper", "Defender", "Midfielder", "Forward"
  jerseyNumber: integer("jersey_number"),
  age: integer("age"),
  profilePicture: text("profile_picture"), // URL to player profile image
  notes: text("notes"),
});

// Club management
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "primary", "adhoc"
  squadLevel: text("squad_level"), // "U10 Elite Squad Training"
  seasonStart: timestamp("season_start"),
  seasonEnd: timestamp("season_end"),
  status: text("status").notNull().default("active"), // "active", "inactive"
  description: text("description"),
  logo: text("logo"), // URL to club logo image
});

export const coaches = pgTable("coaches", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  clubId: integer("club_id"), // linked to club
  name: text("name").notNull(),
  title: text("title").notNull(), // "Head Coach", "Assistant Coach", "Adhoc Coach"
  contact: text("contact"),
  isActive: boolean("is_active").default(true),
  profilePicture: text("profile_picture"), // URL to coach profile image
});

// Coaching staff
export const coachingStaff = pgTable("coaching_staff", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'head_coach', 'assistant_coach', 'goalkeeper_coach'
  contact: text("contact"),
});

// Create insert schemas
export const insertPlayerSchema = createInsertSchema(players).omit({ id: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true });
export const insertTournamentSchema = createInsertSchema(tournaments).omit({ id: true });
export const insertTrainingSessionSchema = createInsertSchema(trainingSessions).omit({ id: true }).extend({
  date: z.string().transform((str) => new Date(str))
});
export const insertCoachFeedbackSchema = createInsertSchema(coachFeedback).omit({ id: true });
export const insertSquadMemberSchema = createInsertSchema(squadMembers).omit({ id: true });
export const insertClubSchema = createInsertSchema(clubs).omit({ id: true });
export const insertCoachSchema = createInsertSchema(coaches).omit({ id: true });
export const insertCoachingStaffSchema = createInsertSchema(coachingStaff).omit({ id: true });

// Gallery photos
export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull().references(() => players.id), 
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  caption: text("caption"),
  trainingSessionId: integer("training_session_id").references(() => trainingSessions.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertGalleryPhotoSchema = createInsertSchema(galleryPhotos).omit({
  id: true,
  uploadedAt: true,
});

// Create types
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

export type InsertTrainingSession = z.infer<typeof insertTrainingSessionSchema>;
export type TrainingSession = typeof trainingSessions.$inferSelect;

export type InsertCoachFeedback = z.infer<typeof insertCoachFeedbackSchema>;
export type CoachFeedback = typeof coachFeedback.$inferSelect;

export type InsertSquadMember = z.infer<typeof insertSquadMemberSchema>;
export type SquadMember = typeof squadMembers.$inferSelect;

export type InsertClub = z.infer<typeof insertClubSchema>;
export type Club = typeof clubs.$inferSelect;

export type InsertCoach = z.infer<typeof insertCoachSchema>;
export type Coach = typeof coaches.$inferSelect;

export type InsertCoachingStaff = z.infer<typeof insertCoachingStaffSchema>;
export type CoachingStaff = typeof coachingStaff.$inferSelect;

export type InsertGalleryPhoto = z.infer<typeof insertGalleryPhotoSchema>;
export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
