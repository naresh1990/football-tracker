import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import {
  insertPlayerSchema,
  insertGameSchema,
  insertTournamentSchema,
  insertTrainingSessionSchema,
  insertCoachFeedbackSchema,
  insertSquadMemberSchema,
  insertCoachingStaffSchema
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

  app.put("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPlayerSchema.partial().parse(req.body);
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
      const playerId = parseInt(req.query.playerId as string);
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }
      const games = await storage.getGamesByPlayer(playerId);
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch games" });
    }
  });

  app.get("/api/games/recent", async (req, res) => {
    try {
      const playerId = parseInt(req.query.playerId as string);
      const limit = parseInt(req.query.limit as string) || 5;
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }
      const games = await storage.getRecentGames(playerId, limit);
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent games" });
    }
  });

  app.post("/api/games", async (req, res) => {
    try {
      const validatedData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(validatedData);
      res.status(201).json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
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
      const playerId = parseInt(req.query.playerId as string);
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }
      const tournaments = await storage.getTournamentsByPlayer(playerId);
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournaments" });
    }
  });

  app.get("/api/tournaments/active", async (req, res) => {
    try {
      const playerId = parseInt(req.query.playerId as string);
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }
      const tournaments = await storage.getActiveTournaments(playerId);
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active tournaments" });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      const validatedData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(validatedData);
      res.status(201).json(tournament);
    } catch (error) {
      res.status(400).json({ error: "Invalid tournament data" });
    }
  });

  app.put("/api/tournaments/:id", async (req, res) => {
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
      const playerId = parseInt(req.query.playerId as string);
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }
      const sessions = await storage.getTrainingSessionsByPlayer(playerId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch training sessions" });
    }
  });

  app.get("/api/training/upcoming", async (req, res) => {
    try {
      const playerId = parseInt(req.query.playerId as string);
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }
      const sessions = await storage.getUpcomingTraining(playerId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming training" });
    }
  });

  app.post("/api/training", async (req, res) => {
    try {
      const validatedData = insertTrainingSessionSchema.parse(req.body);
      const session = await storage.createTrainingSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid training session data" });
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

  // Coach feedback routes
  app.get("/api/feedback", async (req, res) => {
    try {
      const playerId = parseInt(req.query.playerId as string);
      const limit = parseInt(req.query.limit as string);
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }
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
      const playerId = parseInt(req.query.playerId as string);
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }
      const squad = await storage.getSquadByPlayer(playerId);
      res.json(squad);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch squad" });
    }
  });

  app.post("/api/squad", async (req, res) => {
    try {
      const validatedData = insertSquadMemberSchema.parse(req.body);
      const member = await storage.createSquadMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid squad member data" });
    }
  });

  // Coaching staff routes
  app.get("/api/coaching-staff", async (req, res) => {
    try {
      const playerId = parseInt(req.query.playerId as string);
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }
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
      const playerId = parseInt(req.query.playerId as string);
      if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
      }

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

  const httpServer = createServer(app);
  return httpServer;
}
