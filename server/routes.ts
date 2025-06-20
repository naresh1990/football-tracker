import express, { type Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import moment from "moment-timezone";
import { storage } from "./storage";
import {
  insertPlayerSchema,
  insertGameSchema,
  insertTournamentSchema,
  insertTrainingSessionSchema,
  insertCoachFeedbackSchema,
  insertSquadMemberSchema,
  insertCoachingStaffSchema,
  insertClubSchema,
  insertCoachSchema,
  insertGalleryPhotoSchema
} from "@shared/schema";

// Configure multer for file uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: uploadStorage });

// Helper function to handle image uploads
const handleImageUpload = (file: Express.Multer.File | undefined): string | null => {
  if (!file) return null;
  // Return the path to the uploaded file
  return `/uploads/${file.filename}`;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Player routes
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayer(id);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error) {
      res.status(400).json({ error: "Invalid player data" });
    }
  });

  app.put("/api/players/:id", upload.single('profilePicture'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const profilePictureUrl = handleImageUpload(req.file);
      const validatedData = insertPlayerSchema.partial().parse({
        ...req.body,
        ...(profilePictureUrl && { profilePicture: profilePictureUrl })
      });
      const player = await storage.updatePlayer(id, validatedData);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(400).json({ error: "Invalid player data" });
    }
  });

  // Game routes
  app.get("/api/games", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const games = await storage.getGamesByPlayer(playerId);
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch games" });
    }
  });

  app.get("/api/games/recent", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const limit = parseInt(req.query.limit as string) || 5;
      const games = await storage.getRecentGames(playerId, limit);
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent games" });
    }
  });

  app.post("/api/games", async (req, res) => {
    try {
      console.log("Received game data:", req.body);
      const validatedData = insertGameSchema.parse(req.body);
      console.log("Validated game data:", validatedData);
      const game = await storage.createGame(validatedData);
      console.log("Created game:", game);
      res.status(201).json(game);
    } catch (error) {
      console.error("Game creation error:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      res.status(400).json({ error: "Invalid game data", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertGameSchema.partial().parse(req.body);
      const game = await storage.updateGame(id, validatedData);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  app.delete("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGame(id);
      if (!deleted) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete game" });
    }
  });

  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const tournaments = await storage.getTournamentsByPlayer(playerId);
      
      // Fetch game counts and stats for each tournament
      const tournamentsWithStats = await Promise.all(
        tournaments.map(async (tournament) => {
          const games = await storage.getGamesByTournament(tournament.id);
          const totalGames = games.length;
          const wins = games.filter(game => game.teamScore > game.opponentScore).length;
          const teamGoalsScored = games.reduce((sum, game) => sum + (game.teamScore || 0), 0);
          const playerGoalsScored = games.reduce((sum, game) => sum + (game.playerGoals || 0), 0);
          const goalsConceded = games.reduce((sum, game) => sum + (game.opponentScore || 0), 0);
          const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) + '%' : '0%';
          
          return {
            ...tournament,
            gamesPlayed: totalGames,
            totalGames: totalGames,
            teamGoalsScored,
            playerGoalsScored,
            goalsConceded,
            winRate
          };
        })
      );
      
      res.json(tournamentsWithStats);
    } catch (error) {
      console.error("Error fetching tournaments with stats:", error);
      res.status(500).json({ error: "Failed to fetch tournaments" });
    }
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tournament = await storage.getTournament(id);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournament" });
    }
  });

  app.get("/api/tournaments/active", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const tournaments = await storage.getActiveTournaments(playerId);
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active tournaments" });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      console.log("Tournament data received:", req.body);
      const validatedData = insertTournamentSchema.parse(req.body);
      console.log("Tournament data validated:", validatedData);
      const tournament = await storage.createTournament(validatedData);
      res.status(201).json(tournament);
    } catch (error) {
      console.error("Tournament validation error:", error);
      res.status(400).json({ error: "Invalid tournament data", details: error.message });
    }
  });

  app.put("/api/tournaments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Updating tournament", id, "with data:", req.body);
      
      const validatedData = insertTournamentSchema.partial().parse(req.body);
      console.log("Validated tournament data:", validatedData);
      
      const tournament = await storage.updateTournament(id, validatedData);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      console.error("Tournament update error:", error);
      res.status(400).json({ error: "Invalid tournament data", details: error.message });
    }
  });

  app.patch("/api/tournaments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTournamentSchema.partial().parse(req.body);
      const tournament = await storage.updateTournament(id, validatedData);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(400).json({ error: "Invalid tournament data" });
    }
  });

  app.post("/api/tournaments/:id/points-table", upload.single('pointsTable'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const tournament = await storage.updateTournament(id, {
        pointsTableImage: req.file.filename
      });
      
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload points table" });
    }
  });

  // Training routes
  app.get("/api/training", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const sessions = await storage.getTrainingSessionsByPlayer(playerId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch training sessions" });
    }
  });

  app.get("/api/training/upcoming", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const sessions = await storage.getUpcomingTraining(playerId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming training" });
    }
  });

  app.post("/api/training", async (req, res) => {
    try {
      console.log("Training session data received:", req.body);
      const validatedData = insertTrainingSessionSchema.parse(req.body);
      console.log("Training session data validated:", validatedData);
      const session = await storage.createTrainingSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Training session validation error:", error);
      res.status(400).json({ error: "Invalid training session data", details: error.message });
    }
  });

  app.post("/api/training/recurring", async (req, res) => {
    try {
      console.log("Recurring training data received:", req.body);
      const { playerId, type, startDate, time, duration, location, coach, notes, recurringDays, endDate } = req.body;
      
      if (!recurringDays || recurringDays.length === 0) {
        return res.status(400).json({ error: "No recurring days selected" });
      }

      const sessions = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Map day names to numbers (0 = Sunday, 1 = Monday, etc.)
      const dayMap: { [key: string]: number } = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
      };

      const targetDays = recurringDays.map((day: string) => dayMap[day]);
      console.log("Target days:", targetDays, "from", recurringDays);
      
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        if (targetDays.includes(date.getDay())) {
          // Create IST datetime and convert to UTC for storage
          const dateStr = date.toISOString().split('T')[0]; // Get YYYY-MM-DD
          const istDateTime = moment.tz(`${dateStr} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');
          const utcDateTime = istDateTime.utc().toDate();
          
          const sessionData = {
            playerId,
            type,
            date: utcDateTime,
            duration: parseInt(duration) || 60,
            location,
            coach,
            notes,
            attendance: 'pending'
          };
          
          console.log("Creating session for:", utcDateTime.toISOString(), "(IST:", istDateTime.format('YYYY-MM-DD HH:mm'), ")");
          const session = await storage.createTrainingSession(sessionData);
          sessions.push(session);
        }
      }
      
      console.log(`Created ${sessions.length} training sessions`);
      res.json({ message: `Created ${sessions.length} training sessions`, sessions });
    } catch (error) {
      console.error("Error creating recurring training sessions:", error);
      res.status(500).json({ error: "Failed to create recurring training sessions", details: error.message });
    }
  });

  app.put("/api/training/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTrainingSessionSchema.partial().parse(req.body);
      const session = await storage.updateTrainingSession(id, validatedData);
      if (!session) {
        return res.status(404).json({ error: "Training session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid training session data" });
    }
  });

  app.put("/api/training/:id/attendance", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { attendance } = req.body;
      
      if (!["completed", "missed", "cancelled"].includes(attendance)) {
        return res.status(400).json({ error: "Invalid attendance status" });
      }

      const session = await storage.updateTrainingSession(id, { 
        attendance,
        completed: attendance === "completed"
      });
      
      if (!session) {
        return res.status(404).json({ error: "Training session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Failed to update attendance" });
    }
  });

  app.delete("/api/training/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTrainingSession(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Training session not found" });
      }
      
      res.json({ message: "Training session deleted successfully" });
    } catch (error) {
      console.error("Error deleting training session:", error);
      res.status(500).json({ error: "Failed to delete training session" });
    }
  });

  // Coach feedback routes
  app.get("/api/feedback", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const limit = parseInt(req.query.limit as string);
      const feedback = limit 
        ? await storage.getRecentFeedback(playerId, limit)
        : await storage.getFeedbackByPlayer(playerId);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertCoachFeedbackSchema.parse(req.body);
      const feedback = await storage.createCoachFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  // Squad routes
  app.get("/api/squad", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const squad = await storage.getSquadByPlayer(playerId);
      res.json(squad);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch squad" });
    }
  });

  app.post("/api/squad", upload.single('profilePicture'), async (req, res) => {
    try {
      console.log("Squad member data received:", req.body);
      console.log("Profile picture file:", req.file);
      
      let profilePictureUrl = null;
      
      // Handle file upload if provided
      if (req.file) {
        profilePictureUrl = handleImageUpload(req.file);
      }
      
      // Transform and validate data
      const squadData: any = { ...req.body };
      
      // Convert numeric fields
      if (squadData.playerId) {
        squadData.playerId = parseInt(squadData.playerId);
      }
      if (squadData.clubId) {
        squadData.clubId = parseInt(squadData.clubId);
      }
      if (squadData.jerseyNumber) {
        squadData.jerseyNumber = parseInt(squadData.jerseyNumber);
      }
      if (squadData.age) {
        squadData.age = parseInt(squadData.age);
      }
      
      // Add profile picture URL
      if (profilePictureUrl) {
        squadData.profilePicture = profilePictureUrl;
      }
      
      console.log("Processing squad member data:", squadData);
      const validatedData = insertSquadMemberSchema.parse(squadData);
      const member = await storage.createSquadMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating squad member:", error);
      res.status(400).json({ error: "Invalid squad member data", details: error.message });
    }
  });

  app.put("/api/squad/:id", upload.single('profilePicture'), async (req, res) => {
    try {
      console.log("Updating squad member ID:", req.params.id);
      console.log("Update data received:", req.body);
      console.log("Profile picture file:", req.file);
      
      const id = parseInt(req.params.id);
      let profilePictureUrl = null;
      
      // Handle file upload if provided
      if (req.file) {
        profilePictureUrl = handleImageUpload(req.file);
      }
      
      // Transform and validate data
      const squadData: any = { ...req.body };
      
      // Convert numeric fields
      if (squadData.playerId) {
        squadData.playerId = parseInt(squadData.playerId);
      }
      if (squadData.clubId) {
        squadData.clubId = parseInt(squadData.clubId);
      }
      if (squadData.jerseyNumber) {
        squadData.jerseyNumber = parseInt(squadData.jerseyNumber);
      }
      if (squadData.age) {
        squadData.age = parseInt(squadData.age);
      }
      
      // Add profile picture URL if new file uploaded
      if (profilePictureUrl) {
        squadData.profilePicture = profilePictureUrl;
      }
      
      console.log("Processing squad member update data:", squadData);
      const member = await storage.updateSquadMember(id, squadData);
      if (!member) {
        return res.status(404).json({ error: "Squad member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error updating squad member:", error);
      res.status(400).json({ error: "Invalid squad member data", details: error.message });
    }
  });

  app.delete("/api/squad/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSquadMember(id);
      if (!success) {
        return res.status(404).json({ error: "Squad member not found" });
      }
      res.json({ message: "Squad member deleted successfully" });
    } catch (error) {
      console.error("Error deleting squad member:", error);
      res.status(500).json({ error: "Failed to delete squad member" });
    }
  });

  app.post("/api/squad", upload.single('profilePicture'), async (req, res) => {
    try {
      const profilePictureUrl = handleImageUpload(req.file);
      const validatedData = insertSquadMemberSchema.parse({
        ...req.body,
        profilePicture: profilePictureUrl
      });
      const member = await storage.createSquadMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid squad member data" });
    }
  });

  // Club routes
  app.get("/api/clubs", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const clubs = await storage.getClubsByPlayer(playerId);
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clubs" });
    }
  });

  app.get("/api/clubs/active", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const clubs = await storage.getActiveClubs(playerId);
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active clubs" });
    }
  });

  app.post("/api/clubs", upload.single('logo'), async (req, res) => {
    try {
      console.log("Raw club request body:", req.body);
      console.log("Club file upload:", req.file);
      
      let logoUrl = null;
      
      // Handle file upload if provided
      if (req.file) {
        logoUrl = handleImageUpload(req.file);
      }
      
      // Transform and validate data
      const clubData: any = { ...req.body };
      
      // Convert playerId to number if it's a string
      if (clubData.playerId) {
        clubData.playerId = parseInt(clubData.playerId);
      }
      
      // Convert date strings to Date objects if present
      if (clubData.seasonStart && clubData.seasonStart !== '') {
        clubData.seasonStart = new Date(clubData.seasonStart);
      } else {
        clubData.seasonStart = null;
      }
      
      if (clubData.seasonEnd && clubData.seasonEnd !== '') {
        clubData.seasonEnd = new Date(clubData.seasonEnd);
      } else {
        clubData.seasonEnd = null;
      }
      
      // Handle logo URL from file upload or existing URL
      if (logoUrl) {
        clubData.logo = logoUrl;
      } else if (!clubData.logo || clubData.logo.startsWith('blob:')) {
        clubData.logo = null; // Don't save blob URLs
      }
      
      console.log("Processing club data before validation:", clubData);
      const validatedData = insertClubSchema.parse(clubData);
      console.log("Validated club data:", validatedData);
      const club = await storage.createClub(validatedData);
      res.status(201).json(club);
    } catch (error) {
      console.error("Error creating club:", error);
      console.error("Error details:", error.message);
      res.status(400).json({ error: "Invalid club data", details: error.message });
    }
  });

  app.put("/api/clubs/:id", upload.single('logo'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const logoUrl = handleImageUpload(req.file);
      
      // Transform and validate data
      const updateData: any = { ...req.body };
      
      // Convert playerId to number if present
      if (updateData.playerId) {
        updateData.playerId = parseInt(updateData.playerId);
      }
      
      // Convert date strings to Date objects if present
      if (updateData.seasonStart && updateData.seasonStart !== '') {
        updateData.seasonStart = new Date(updateData.seasonStart);
      }
      if (updateData.seasonEnd && updateData.seasonEnd !== '') {
        updateData.seasonEnd = new Date(updateData.seasonEnd);
      }
      
      // Only include logo in update if a new file was uploaded
      // Don't pass undefined logo to preserve existing logo
      if (logoUrl) {
        updateData.logo = logoUrl;
      } else {
        // Remove logo from updateData to preserve existing logo
        delete updateData.logo;
      }
      
      const validatedData = insertClubSchema.partial().parse(updateData);
      const club = await storage.updateClub(id, validatedData);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.json(club);
    } catch (error) {
      console.error("Club update error:", error);
      res.status(400).json({ error: "Invalid club data" });
    }
  });

  // Get active club for a player
  app.get("/api/clubs/active", async (req, res) => {
    try {
      const playerId = parseInt(req.query.playerId as string) || 1;
      const activeClub = await storage.getActiveClub(playerId);
      res.json(activeClub);
    } catch (error) {
      console.error("Error fetching active club:", error);
      res.status(500).json({ error: "Failed to fetch active club" });
    }
  });

  app.post("/api/clubs/:id/logo", upload.single('logo'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!req.file) {
        return res.status(400).json({ error: "No logo file provided" });
      }
      
      const logoUrl = handleImageUpload(req.file);
      const club = await storage.updateClub(id, { logo: logoUrl });
      
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      
      res.json(club);
    } catch (error) {
      console.error("Logo upload error:", error);
      res.status(500).json({ error: "Failed to upload logo" });
    }
  });

  app.delete("/api/clubs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteClub(id);
      if (!deleted) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete club" });
    }
  });

  // Coach routes
  app.get("/api/coaches", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const coaches = await storage.getCoachesByPlayer(playerId);
      res.json(coaches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coaches" });
    }
  });

  app.get("/api/coaches/active", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const coaches = await storage.getActiveCoaches(playerId);
      res.json(coaches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active coaches" });
    }
  });

  app.post("/api/coaches", upload.single('profilePicture'), async (req, res) => {
    try {
      console.log("Coach data received:", req.body);
      console.log("Profile picture file:", req.file);
      
      let profilePictureUrl = null;
      
      // Handle file upload if provided
      if (req.file) {
        profilePictureUrl = handleImageUpload(req.file);
      }
      
      // Transform and validate data
      const coachData: any = { ...req.body };
      
      // Convert playerId and clubId to numbers
      if (coachData.playerId) {
        coachData.playerId = parseInt(coachData.playerId);
      }
      if (coachData.clubId) {
        coachData.clubId = parseInt(coachData.clubId);
      }
      
      // Convert isActive to boolean
      if (coachData.isActive) {
        coachData.isActive = coachData.isActive === 'true';
      }
      
      // Add profile picture URL
      if (profilePictureUrl) {
        coachData.profilePicture = profilePictureUrl;
      }
      
      console.log("Processing coach data:", coachData);
      const validatedData = insertCoachSchema.parse(coachData);
      console.log("Validated coach data:", validatedData);
      const coach = await storage.createCoach(validatedData);
      res.status(201).json(coach);
    } catch (error) {
      console.error("Error creating coach:", error);
      console.error("Error details:", error.message);
      res.status(400).json({ error: "Invalid coach data", details: error.message });
    }
  });

  app.put("/api/coaches/:id", upload.single('profilePicture'), async (req, res) => {
    try {
      console.log("Updating coach ID:", req.params.id);
      console.log("Update data received:", req.body);
      console.log("Profile picture file:", req.file);
      
      const id = parseInt(req.params.id);
      let profilePictureUrl = null;
      
      // Handle file upload if provided
      if (req.file) {
        profilePictureUrl = handleImageUpload(req.file);
      }
      
      // Transform and validate data
      const coachData: any = { ...req.body };
      
      // Convert playerId and clubId to numbers
      if (coachData.playerId) {
        coachData.playerId = parseInt(coachData.playerId);
      }
      if (coachData.clubId) {
        coachData.clubId = parseInt(coachData.clubId);
      }
      
      // Convert isActive to boolean
      if (coachData.isActive) {
        coachData.isActive = coachData.isActive === 'true';
      }
      
      // Add profile picture URL if new file uploaded
      if (profilePictureUrl) {
        coachData.profilePicture = profilePictureUrl;
      }
      
      console.log("Processing coach update data:", coachData);
      const coach = await storage.updateCoach(id, coachData);
      if (!coach) {
        return res.status(404).json({ error: "Coach not found" });
      }
      res.json(coach);
    } catch (error) {
      console.error("Error updating coach:", error);
      res.status(400).json({ error: "Invalid coach data", details: error.message });
    }
  });

  app.delete("/api/coaches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCoach(id);
      if (!deleted) {
        return res.status(404).json({ error: "Coach not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete coach" });
    }
  });

  // Coaching staff routes
  app.get("/api/coaching-staff", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID
      const staff = await storage.getCoachingStaffByPlayer(playerId);
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coaching staff" });
    }
  });

  app.post("/api/coaching-staff", async (req, res) => {
    try {
      const validatedData = insertCoachingStaffSchema.parse(req.body);
      const coach = await storage.createCoachingStaffMember(validatedData);
      res.status(201).json(coach);
    } catch (error) {
      res.status(400).json({ error: "Invalid coaching staff data" });
    }
  });

  // Statistics endpoints
  app.get("/api/stats/summary", async (req, res) => {
    try {
      const playerId = 1; // Default to Darshil's ID

      const games = await storage.getGamesByPlayer(playerId);
      const totalGoals = games.reduce((sum, game) => sum + (game.playerGoals || 0), 0);
      const totalAssists = games.reduce((sum, game) => sum + (game.playerAssists || 0), 0);
      const totalGames = games.length;
      const wins = games.filter(game => game.teamScore > game.opponentScore).length;
      const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

      // Current season stats (last 3 months)
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const recentGames = games.filter(game => new Date(game.date) >= threeMonthsAgo);
      const seasonGoals = recentGames.reduce((sum, game) => sum + (game.playerGoals || 0), 0);

      // This month stats
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const monthlyGames = games.filter(game => new Date(game.date) >= oneMonthAgo);
      const monthAssists = monthlyGames.reduce((sum, game) => sum + (game.playerAssists || 0), 0);

      res.json({
        totalGoals,
        totalAssists,
        totalGames,
        winRate,
        seasonGoals,
        monthAssists
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const photos = await storage.getAllGalleryPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Error fetching gallery photos:", error);
      res.status(500).json({ error: "Failed to fetch gallery photos" });
    }
  });

  app.post("/api/gallery", upload.single('photo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No photo uploaded" });
      }

      const { playerId, caption, trainingSessionId } = req.body;
      
      const photoData = {
        playerId: parseInt(playerId) || 1,
        filename: req.file.filename,
        originalName: req.file.originalname,
        caption: caption || null,
        trainingSessionId: trainingSessionId ? parseInt(trainingSessionId) : null,
      };

      const validatedData = insertGalleryPhotoSchema.parse(photoData);
      const photo = await storage.createGalleryPhoto(validatedData);
      
      res.json(photo);
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ error: "Failed to upload photo" });
    }
  });

  app.put("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { caption } = req.body;
      
      const photo = await storage.updateGalleryPhoto(id, { caption });
      
      if (photo) {
        res.json(photo);
      } else {
        res.status(404).json({ error: "Photo not found" });
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      res.status(500).json({ error: "Failed to update photo" });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`Attempting to delete photo with ID: ${id}`);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid photo ID" });
      }
      
      const success = await storage.deleteGalleryPhoto(id);
      console.log(`Delete result for photo ${id}:`, success);
      
      if (success) {
        res.json({ message: "Photo deleted successfully" });
      } else {
        res.status(404).json({ error: "Photo not found" });
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ error: "Failed to delete photo", details: error.message });
    }
  });

  // Training session gallery routes
  app.post("/api/training/gallery", upload.single('photo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No photo uploaded" });
      }

      const { playerId, caption, sessionId } = req.body;
      
      // Get training session details for context
      const session = await storage.getTrainingSession(parseInt(sessionId));
      
      // Upload to main gallery with training session reference
      const photoData = {
        playerId: parseInt(playerId) || 1,
        filename: req.file.filename,
        originalName: req.file.originalname,
        caption: caption ? `${caption}` : (session ? `${session.type} Training` : 'Training Session Photo'),
        trainingSessionId: parseInt(sessionId),
      };

      const validatedData = insertGalleryPhotoSchema.parse(photoData);
      const photo = await storage.createGalleryPhoto(validatedData);
      
      // Update training session gallery array
      if (session) {
        const currentGallery = session.gallery || [];
        const updatedGallery = [...currentGallery, `/uploads/${req.file.filename}`];
        await storage.updateTrainingSession(parseInt(sessionId), { gallery: updatedGallery });
      }
      
      res.json({ photo, session: session });
    } catch (error) {
      console.error("Error uploading training photo:", error);
      res.status(500).json({ error: "Failed to upload training photo" });
    }
  });

  // Tournament logo upload endpoint
  app.post("/api/upload/tournament-logo", upload.single("logo"), async (req, res) => {
    try {
      console.log("Tournament logo upload request received");
      console.log("File:", req.file);
      
      if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).json({ error: "No logo file uploaded" });
      }
      
      const filePath = handleImageUpload(req.file);
      console.log("Tournament logo uploaded successfully:", filePath);
      
      res.json({ 
        success: true, 
        filePath,
        message: "Tournament logo uploaded successfully" 
      });
    } catch (error) {
      console.error("Tournament logo upload error:", error);
      res.status(500).json({ error: "Failed to upload tournament logo" });
    }
  });

  // Serve static files from uploads directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}
