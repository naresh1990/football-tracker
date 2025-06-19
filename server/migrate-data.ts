import { db } from "./db";
import { MemStorage } from "./storage";
import { 
  players, games, tournaments, trainingSessions, coachFeedback, 
  squadMembers, clubs, coaches, coachingStaff 
} from "@shared/schema";

// Migration script to transfer data from memory storage to database
async function migrateData() {
  console.log("Starting data migration...");
  
  // Create a temporary instance of memory storage to get sample data
  const memStorage = new MemStorage();
  
  try {
    // Get all data from memory storage
    const playersData = await memStorage.getAllPlayers();
    const gamesData = await memStorage.getGamesByPlayer(1);
    const tournamentsData = await memStorage.getTournamentsByPlayer(1);
    const trainingData = await memStorage.getTrainingSessionsByPlayer(1);
    const feedbackData = await memStorage.getFeedbackByPlayer(1);
    const squadData = await memStorage.getSquadByPlayer(1);
    const clubsData = await memStorage.getClubsByPlayer(1);
    const coachesData = await memStorage.getCoachesByPlayer(1);
    const staffData = await memStorage.getCoachingStaffByPlayer(1);

    // Migrate players
    if (playersData.length > 0) {
      console.log("Migrating players...");
      for (const player of playersData) {
        const { id, ...insertData } = player;
        await db.insert(players).values(insertData).onConflictDoNothing();
      }
    }

    // Migrate clubs
    if (clubsData.length > 0) {
      console.log("Migrating clubs...");
      for (const club of clubsData) {
        const { id, ...insertData } = club;
        await db.insert(clubs).values(insertData).onConflictDoNothing();
      }
    }

    // Migrate games
    if (gamesData.length > 0) {
      console.log("Migrating games...");
      for (const game of gamesData) {
        const { id, ...insertData } = game;
        await db.insert(games).values(insertData).onConflictDoNothing();
      }
    }

    // Migrate tournaments
    if (tournamentsData.length > 0) {
      console.log("Migrating tournaments...");
      for (const tournament of tournamentsData) {
        const { id, ...insertData } = tournament;
        await db.insert(tournaments).values(insertData).onConflictDoNothing();
      }
    }

    // Migrate training sessions
    if (trainingData.length > 0) {
      console.log("Migrating training sessions...");
      for (const session of trainingData) {
        const { id, ...insertData } = session;
        await db.insert(trainingSessions).values(insertData).onConflictDoNothing();
      }
    }

    // Migrate feedback
    if (feedbackData.length > 0) {
      console.log("Migrating feedback...");
      for (const feedback of feedbackData) {
        const { id, ...insertData } = feedback;
        await db.insert(coachFeedback).values(insertData).onConflictDoNothing();
      }
    }

    // Migrate squad members
    if (squadData.length > 0) {
      console.log("Migrating squad members...");
      for (const member of squadData) {
        const { id, ...insertData } = member;
        await db.insert(squadMembers).values(insertData).onConflictDoNothing();
      }
    }

    // Migrate coaches
    if (coachesData.length > 0) {
      console.log("Migrating coaches...");
      for (const coach of coachesData) {
        const { id, ...insertData } = coach;
        await db.insert(coaches).values(insertData).onConflictDoNothing();
      }
    }

    // Migrate coaching staff
    if (staffData.length > 0) {
      console.log("Migrating coaching staff...");
      for (const staff of staffData) {
        const { id, ...insertData } = staff;
        await db.insert(coachingStaff).values(insertData).onConflictDoNothing();
      }
    }

    console.log("Data migration completed successfully!");
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log("Migration finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration error:", error);
      process.exit(1);
    });
}

export { migrateData };