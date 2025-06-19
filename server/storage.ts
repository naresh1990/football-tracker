import {
  Player, InsertPlayer,
  Game, InsertGame,
  Tournament, InsertTournament,
  TrainingSession, InsertTrainingSession,
  CoachFeedback, InsertCoachFeedback,
  SquadMember, InsertSquadMember,
  Club, InsertClub,
  Coach, InsertCoach,
  CoachingStaff, InsertCoachingStaff
} from "@shared/schema";

export interface IStorage {
  // Player methods
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  getAllPlayers(): Promise<Player[]>;

  // Game methods
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;
  getGamesByPlayer(playerId: number): Promise<Game[]>;
  getRecentGames(playerId: number, limit?: number): Promise<Game[]>;

  // Tournament methods
  getTournament(id: number): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: number, tournament: Partial<InsertTournament>): Promise<Tournament | undefined>;
  deleteTournament(id: number): Promise<boolean>;
  getTournamentsByPlayer(playerId: number): Promise<Tournament[]>;
  getActiveTournaments(playerId: number): Promise<Tournament[]>;

  // Training methods
  getTrainingSession(id: number): Promise<TrainingSession | undefined>;
  createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession>;
  updateTrainingSession(id: number, session: Partial<InsertTrainingSession>): Promise<TrainingSession | undefined>;
  deleteTrainingSession(id: number): Promise<boolean>;
  getTrainingSessionsByPlayer(playerId: number): Promise<TrainingSession[]>;
  getUpcomingTraining(playerId: number): Promise<TrainingSession[]>;

  // Coach feedback methods
  getCoachFeedback(id: number): Promise<CoachFeedback | undefined>;
  createCoachFeedback(feedback: InsertCoachFeedback): Promise<CoachFeedback>;
  updateCoachFeedback(id: number, feedback: Partial<InsertCoachFeedback>): Promise<CoachFeedback | undefined>;
  deleteCoachFeedback(id: number): Promise<boolean>;
  getFeedbackByPlayer(playerId: number): Promise<CoachFeedback[]>;
  getRecentFeedback(playerId: number, limit?: number): Promise<CoachFeedback[]>;

  // Squad methods
  getSquadMember(id: number): Promise<SquadMember | undefined>;
  createSquadMember(member: InsertSquadMember): Promise<SquadMember>;
  updateSquadMember(id: number, member: Partial<InsertSquadMember>): Promise<SquadMember | undefined>;
  deleteSquadMember(id: number): Promise<boolean>;
  getSquadByPlayer(playerId: number): Promise<SquadMember[]>;

  // Club methods
  getClub(id: number): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, club: Partial<InsertClub>): Promise<Club | undefined>;
  deleteClub(id: number): Promise<boolean>;
  getClubsByPlayer(playerId: number): Promise<Club[]>;
  getActiveClubs(playerId: number): Promise<Club[]>;

  // Coach methods
  getCoach(id: number): Promise<Coach | undefined>;
  createCoach(coach: InsertCoach): Promise<Coach>;
  updateCoach(id: number, coach: Partial<InsertCoach>): Promise<Coach | undefined>;
  deleteCoach(id: number): Promise<boolean>;
  getCoachesByPlayer(playerId: number): Promise<Coach[]>;
  getCoachesByClub(clubId: number): Promise<Coach[]>;
  getActiveCoaches(playerId: number): Promise<Coach[]>;

  // Coaching staff methods
  getCoachingStaffMember(id: number): Promise<CoachingStaff | undefined>;
  createCoachingStaffMember(coach: InsertCoachingStaff): Promise<CoachingStaff>;
  updateCoachingStaffMember(id: number, coach: Partial<InsertCoachingStaff>): Promise<CoachingStaff | undefined>;
  deleteCoachingStaffMember(id: number): Promise<boolean>;
  getCoachingStaffByPlayer(playerId: number): Promise<CoachingStaff[]>;
}

export class MemStorage implements IStorage {
  private players: Map<number, Player> = new Map();
  private games: Map<number, Game> = new Map();
  private tournaments: Map<number, Tournament> = new Map();
  private trainingSessions: Map<number, TrainingSession> = new Map();
  private coachFeedback: Map<number, CoachFeedback> = new Map();
  private squadMembers: Map<number, SquadMember> = new Map();
  private clubs: Map<number, Club> = new Map();
  private coaches: Map<number, Coach> = new Map();
  private coachingStaff: Map<number, CoachingStaff> = new Map();

  private playerId = 1;
  private gameId = 1;
  private tournamentId = 1;
  private trainingId = 1;
  private feedbackId = 1;
  private squadId = 1;
  private clubId = 1;
  private coachId = 1;
  private coachingStaffId = 1;

  constructor() {
    // Initialize with Darshil's profile and some sample data
    this.initializeData();
  }

  private async initializeData() {
    // Create Darshil's profile
    await this.createPlayer({
      name: "Darshil",
      age: 12,
      position: "Midfielder",
      teamName: "Lions FC",
      jerseyNumber: "#10",
      isCaptain: true,
      division: "U12 Premier"
    });

    // Add some sample games
    const sampleGames = [
      {
        playerId: 1,
        gameType: "tournament" as const,
        matchFormat: "7v7" as const,
        tournamentId: 1,
        opponent: "Panthers FC",
        date: new Date("2024-03-15T15:00:00"),
        homeAway: "home" as const,
        teamScore: 3,
        opponentScore: 2,
        playerGoals: 2,
        playerAssists: 1,
        positionPlayed: "Midfielder",
        minutesPlayed: 90,
        mistakes: 1,
        rating: "8/10",
        coachFeedback: "Great performance, scored winning goal. Work on first touch under pressure.",
        notes: "Great performance, scored winning goal"
      },
      {
        playerId: 1,
        gameType: "friendly" as const,
        matchFormat: "5v5" as const,
        tournamentId: null,
        opponent: "Wolves FC",
        date: new Date("2024-03-08T14:00:00"),
        homeAway: "away" as const,
        teamScore: 1,
        opponentScore: 2,
        playerGoals: 1,
        playerAssists: 0,
        positionPlayed: "Midfielder",
        minutesPlayed: 80,
        mistakes: 2,
        rating: "7/10",
        coachFeedback: "Tough game, good effort. Focus on defensive positioning and communication.",
        notes: "Tough game, good effort"
      },
      {
        playerId: 1,
        gameType: "practice" as const,
        matchFormat: "4v4" as const,
        tournamentId: null,
        opponent: "Bears FC",
        date: new Date("2024-03-01T16:00:00"),
        homeAway: "home" as const,
        teamScore: 4,
        opponentScore: 1,
        playerGoals: 1,
        playerAssists: 2,
        positionPlayed: "Midfielder",
        minutesPlayed: 90,
        mistakes: 0,
        rating: "9/10",
        coachFeedback: "Excellent passing and vision. Perfect game understanding. Keep it up!",
        notes: "Excellent passing and vision"
      }
    ];

    for (const game of sampleGames) {
      await this.createGame(game);
    }

    // Add sample tournaments
    const sampleTournaments = [
      {
        playerId: 1,
        name: "Spring Championship 2024",
        description: "Regional youth tournament - U12 division",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-04-30"),
        status: "active" as const,
        format: "league",
        totalTeams: 8,
        currentPosition: 2,
        points: 9,
        gamesPlayed: 4,
        totalGames: 6,
        pointsTableImage: null
      },
      {
        playerId: 1,
        name: "City Cup 2024",
        description: "Annual city-wide competition",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-05-15"),
        status: "upcoming" as const,
        format: "knockout",
        totalTeams: 16,
        currentPosition: null,
        points: 0,
        gamesPlayed: 0,
        totalGames: 4,
        pointsTableImage: null
      }
    ];

    for (const tournament of sampleTournaments) {
      await this.createTournament(tournament);
    }

    // Add sample training sessions
    const sampleTrainingSessions = [
      // Completed sessions (past dates)
      {
        playerId: 1,
        type: "Speed & Agility",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
        duration: 90,
        location: "Main Field",
        coach: "Coach Martinez",
        focus: "Sprint techniques and cone drills",
        notes: "Excellent improvement in sprint times. Reduced 40m sprint by 0.3 seconds.",
        completed: true
      },
      {
        playerId: 1,
        type: "Ball Control",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        duration: 75,
        location: "Training Ground A",
        coach: "Coach Thompson",
        focus: "First touch and dribbling skills",
        notes: "Great session with significant progress on first touch. Need to work on weak foot control.",
        completed: true
      },
      {
        playerId: 1,
        type: "Team Practice",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        duration: 120,
        location: "Main Field",
        coach: "Coach Martinez",
        focus: "Tactical formations and set pieces",
        notes: "Solid understanding of 4-3-3 formation. Positioned well in midfield during scrimmage.",
        completed: true
      },
      {
        playerId: 1,
        type: "Fitness Training",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        duration: 60,
        location: "Fitness Center",
        coach: "Coach Davis",
        focus: "Endurance and strength building",
        notes: "Completed all cardio circuits. Showed good stamina improvement from last session.",
        completed: true
      },
      {
        playerId: 1,
        type: "Shooting Practice",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: 90,
        location: "Practice Field B",
        coach: "Coach Thompson",
        focus: "Finishing and accuracy training",
        notes: "Scored 8/10 shots on target. Excellent improvement in accuracy from the penalty area.",
        completed: true
      },
      // Upcoming sessions (future dates)
      {
        playerId: 1,
        type: "Speed & Agility",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 90,
        location: "Main Field",
        coach: "Coach Martinez",
        focus: "Sprint techniques and cone drills",
        notes: "Focus on acceleration and quick direction changes",
        completed: false
      },
      {
        playerId: 1,
        type: "Ball Control",
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        duration: 75,
        location: "Training Ground A",
        coach: "Coach Thompson",
        focus: "First touch and dribbling skills",
        notes: "First touch and close control drills with both feet",
        completed: false
      },
      {
        playerId: 1,
        type: "Team Practice",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        duration: 120,
        location: "Main Field",
        coach: "Coach Martinez",
        focus: "Tactical formations and set pieces",
        notes: "Full team scrimmage and tactical work - 4-3-3 formation",
        completed: false
      },
      {
        playerId: 1,
        type: "Fitness Training",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        duration: 60,
        location: "Fitness Center",
        coach: "Coach Davis",
        focus: "Endurance and strength building",
        notes: "Cardio workout and core strengthening exercises",
        completed: false
      }
    ];

    for (const session of sampleTrainingSessions) {
      await this.createTrainingSession(session);
    }

    // Add sample coach feedback
    const sampleFeedback = [
      {
        playerId: 1,
        gameId: 1,
        coach: "Coach Martinez",
        date: new Date("2024-03-16"),
        comment: "Excellent passing accuracy in today's match. Work on first touch control and positioning during corner kicks.",
        strengths: ["Passing", "Vision"],
        improvements: ["Positioning", "First Touch"],
        rating: "8.5"
      },
      {
        playerId: 1,
        gameId: null,
        coach: "Coach Martinez",
        date: new Date("2024-03-05"),
        comment: "Great improvement in defensive positioning. Continue working on crossing technique from the wings.",
        strengths: ["Defense", "Work Rate"],
        improvements: ["Crossing", "Shooting"],
        rating: "7.5"
      }
    ];

    for (const feedback of sampleFeedback) {
      await this.createCoachFeedback(feedback);
    }

    // Add sample clubs
    const sampleClubs = [
      {
        playerId: 1,
        name: "Sporthood",
        type: "primary",
        squadLevel: "U10 Elite Squad Training",
        seasonStart: new Date("2025-06-01"),
        seasonEnd: new Date("2026-03-31"),
        status: "active",
        description: "Primary club for elite training and development",
        logo: null
      },
      {
        playerId: 1,
        name: "Consient Sports",
        type: "adhoc",
        squadLevel: null,
        seasonStart: null,
        seasonEnd: null,
        status: "active",
        description: "Adhoc tournaments and matches",
        logo: null
      },
      {
        playerId: 1,
        name: "Indian City Football Club",
        type: "adhoc",
        squadLevel: null,
        seasonStart: null,
        seasonEnd: null,
        status: "active",
        description: "Adhoc tournaments and special events",
        logo: null
      }
    ];

    for (const club of sampleClubs) {
      await this.createClub(club);
    }

    // Add sample coaches
    const sampleCoaches = [
      {
        playerId: 1,
        clubId: 1, // Sporthood
        name: "Coach Martinez",
        title: "Head Coach",
        contact: "coach.martinez@sporthood.com",
        isActive: true,
        profilePicture: null
      },
      {
        playerId: 1,
        clubId: 1, // Sporthood
        name: "Sarah Johnson",
        title: "Assistant Coach",
        contact: "sarah.johnson@sporthood.com",
        isActive: true,
        profilePicture: null
      },
      {
        playerId: 1,
        clubId: 2, // Consient Sports
        name: "David Kumar",
        title: "Adhoc Coach",
        contact: "david.kumar@consient.com",
        isActive: true,
        profilePicture: null
      },
      {
        playerId: 1,
        clubId: 3, // Indian City FC
        name: "Raj Patel",
        title: "Head Coach",
        contact: "raj.patel@indiancityfc.com",
        isActive: true,
        profilePicture: null
      }
    ];

    for (const coach of sampleCoaches) {
      await this.createCoach(coach);
    }

    // Add coaching staff
    const coachingStaffData = [
      {
        playerId: 1,
        name: "Mr. Anjith Kumar",
        role: "Head Coach",
        contact: "anjith.kumar@sporthood.com",
        picture: "/uploads/coach-anjith.jpg"
      },
      {
        playerId: 1,
        name: "Mr. Vaishnav",
        role: "Assistant Coach",
        contact: "vaishnav@sporthood.com"
      }
    ];

    for (const coach of coachingStaffData) {
      await this.createCoachingStaffMember(coach);
    }

    // Add squad members
    const squadMembersData = [
      {
        playerId: 1,
        memberName: "Darshil Podishetty",
        position: "Midfielder",
        jerseyNumber: "#9",
        picture: "/uploads/darshil-profile.jpg"
      },
      {
        playerId: 1,
        memberName: "Abir Pathak",
        position: "Forward",
        jerseyNumber: "#10"
      },
      {
        playerId: 1,
        memberName: "Abel Binoy Samuel",
        position: "Defender",
        jerseyNumber: "#5",
        picture: "/uploads/abel-binoy.jpg"
      },
      {
        playerId: 1,
        memberName: "Jash Mitul Shah",
        position: "Midfielder",
        jerseyNumber: "#8"
      },
      {
        playerId: 1,
        memberName: "Nihal Rajesh",
        position: "Forward",
        jerseyNumber: "#11",
        picture: "/uploads/nihal-rajesh.jpg"
      },
      {
        playerId: 1,
        memberName: "Prathyush P",
        position: "Defender",
        jerseyNumber: "#6"
      },
      {
        playerId: 1,
        memberName: "Madhav Nair",
        position: "Goalkeeper",
        jerseyNumber: "#1"
      }
    ];

    for (const member of squadMembersData) {
      await this.createSquadMember(member);
    }
  }

  // Player methods
  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = this.playerId++;
    const newPlayer: Player = { 
      ...player, 
      id,
      jerseyNumber: player.jerseyNumber ?? null,
      isCaptain: player.isCaptain ?? null,
      division: player.division ?? null
    };
    this.players.set(id, newPlayer);
    return newPlayer;
  }

  async updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined> {
    const existing = this.players.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...player };
    this.players.set(id, updated);
    return updated;
  }

  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  // Game methods
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(game: InsertGame): Promise<Game> {
    const id = this.gameId++;
    const newGame: Game = { 
      ...game, 
      id,
      playerGoals: game.playerGoals ?? null,
      playerAssists: game.playerAssists ?? null,
      minutesPlayed: game.minutesPlayed ?? null,
      mistakes: game.mistakes ?? null,
      rating: game.rating ?? null,
      coachFeedback: game.coachFeedback ?? null,
      notes: game.notes ?? null,
      tournamentId: game.tournamentId ?? null
    };
    this.games.set(id, newGame);
    return newGame;
  }

  async updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined> {
    const existing = this.games.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...game };
    this.games.set(id, updated);
    return updated;
  }

  async deleteGame(id: number): Promise<boolean> {
    return this.games.delete(id);
  }

  async getGamesByPlayer(playerId: number): Promise<Game[]> {
    return Array.from(this.games.values())
      .filter(game => game.playerId === playerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getRecentGames(playerId: number, limit = 5): Promise<Game[]> {
    const games = await this.getGamesByPlayer(playerId);
    return games.slice(0, limit);
  }

  // Tournament methods
  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const id = this.tournamentId++;
    const newTournament: Tournament = { 
      ...tournament, 
      id,
      description: tournament.description ?? null,
      startDate: tournament.startDate ?? null,
      endDate: tournament.endDate ?? null,
      format: tournament.format ?? null,
      totalTeams: tournament.totalTeams ?? null,
      currentPosition: tournament.currentPosition ?? null,
      points: tournament.points ?? null,
      gamesPlayed: tournament.gamesPlayed ?? null,
      totalGames: tournament.totalGames ?? null,
      pointsTableImage: tournament.pointsTableImage ?? null
    };
    this.tournaments.set(id, newTournament);
    return newTournament;
  }

  async updateTournament(id: number, tournament: Partial<InsertTournament>): Promise<Tournament | undefined> {
    const existing = this.tournaments.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...tournament };
    this.tournaments.set(id, updated);
    return updated;
  }

  async deleteTournament(id: number): Promise<boolean> {
    return this.tournaments.delete(id);
  }

  async getTournamentsByPlayer(playerId: number): Promise<Tournament[]> {
    return Array.from(this.tournaments.values())
      .filter(tournament => tournament.playerId === playerId);
  }

  async getActiveTournaments(playerId: number): Promise<Tournament[]> {
    return Array.from(this.tournaments.values())
      .filter(tournament => tournament.playerId === playerId && tournament.status === 'active');
  }

  // Training methods
  async getTrainingSession(id: number): Promise<TrainingSession | undefined> {
    return this.trainingSessions.get(id);
  }

  async createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession> {
    const id = this.trainingId++;
    const newSession: TrainingSession = { 
      ...session, 
      id,
      location: session.location ?? null,
      coach: session.coach ?? null,
      notes: session.notes ?? null,
      completed: session.completed ?? null
    };
    this.trainingSessions.set(id, newSession);
    return newSession;
  }

  async updateTrainingSession(id: number, session: Partial<InsertTrainingSession>): Promise<TrainingSession | undefined> {
    const existing = this.trainingSessions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...session };
    this.trainingSessions.set(id, updated);
    return updated;
  }

  async deleteTrainingSession(id: number): Promise<boolean> {
    return this.trainingSessions.delete(id);
  }

  async getTrainingSessionsByPlayer(playerId: number): Promise<TrainingSession[]> {
    return Array.from(this.trainingSessions.values())
      .filter(session => session.playerId === playerId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getUpcomingTraining(playerId: number): Promise<TrainingSession[]> {
    const now = new Date();
    return Array.from(this.trainingSessions.values())
      .filter(session => session.playerId === playerId && new Date(session.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }

  // Coach feedback methods
  async getCoachFeedback(id: number): Promise<CoachFeedback | undefined> {
    return this.coachFeedback.get(id);
  }

  async createCoachFeedback(feedback: InsertCoachFeedback): Promise<CoachFeedback> {
    const id = this.feedbackId++;
    const newFeedback: CoachFeedback = { 
      ...feedback, 
      id,
      gameId: feedback.gameId ?? null,
      strengths: feedback.strengths ?? null,
      improvements: feedback.improvements ?? null,
      rating: feedback.rating ?? null
    };
    this.coachFeedback.set(id, newFeedback);
    return newFeedback;
  }

  async updateCoachFeedback(id: number, feedback: Partial<InsertCoachFeedback>): Promise<CoachFeedback | undefined> {
    const existing = this.coachFeedback.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...feedback };
    this.coachFeedback.set(id, updated);
    return updated;
  }

  async deleteCoachFeedback(id: number): Promise<boolean> {
    return this.coachFeedback.delete(id);
  }

  async getFeedbackByPlayer(playerId: number): Promise<CoachFeedback[]> {
    return Array.from(this.coachFeedback.values())
      .filter(feedback => feedback.playerId === playerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getRecentFeedback(playerId: number, limit = 5): Promise<CoachFeedback[]> {
    const feedback = await this.getFeedbackByPlayer(playerId);
    return feedback.slice(0, limit);
  }

  // Squad methods
  async getSquadMember(id: number): Promise<SquadMember | undefined> {
    return this.squadMembers.get(id);
  }

  async createSquadMember(member: InsertSquadMember): Promise<SquadMember> {
    const id = this.squadId++;
    const newMember: SquadMember = { 
      ...member, 
      id,
      jerseyNumber: member.jerseyNumber ?? null,
      role: member.role ?? null,
      profilePicture: member.profilePicture ?? null
    };
    this.squadMembers.set(id, newMember);
    return newMember;
  }

  async updateSquadMember(id: number, member: Partial<InsertSquadMember>): Promise<SquadMember | undefined> {
    const existing = this.squadMembers.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...member };
    this.squadMembers.set(id, updated);
    return updated;
  }

  async deleteSquadMember(id: number): Promise<boolean> {
    return this.squadMembers.delete(id);
  }

  async getSquadByPlayer(playerId: number): Promise<SquadMember[]> {
    return Array.from(this.squadMembers.values())
      .filter(member => member.playerId === playerId);
  }

  // Coaching staff methods
  async getCoachingStaffMember(id: number): Promise<CoachingStaff | undefined> {
    return this.coachingStaff.get(id);
  }

  async createCoachingStaffMember(coach: InsertCoachingStaff): Promise<CoachingStaff> {
    const id = this.coachId++;
    const newCoach: CoachingStaff = { 
      ...coach, 
      id,
      contact: coach.contact ?? null
    };
    this.coachingStaff.set(id, newCoach);
    return newCoach;
  }

  async updateCoachingStaffMember(id: number, coach: Partial<InsertCoachingStaff>): Promise<CoachingStaff | undefined> {
    const existing = this.coachingStaff.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...coach };
    this.coachingStaff.set(id, updated);
    return updated;
  }

  async deleteCoachingStaffMember(id: number): Promise<boolean> {
    return this.coachingStaff.delete(id);
  }

  // Club methods
  async getClub(id: number): Promise<Club | undefined> {
    return this.clubs.get(id);
  }

  async createClub(club: InsertClub): Promise<Club> {
    const id = this.clubId++;
    const newClub: Club = { 
      ...club, 
      id,
      squadLevel: club.squadLevel ?? null,
      seasonStart: club.seasonStart ?? null,
      seasonEnd: club.seasonEnd ?? null,
      description: club.description ?? null,
      status: club.status ?? "active",
      logo: club.logo ?? null
    };
    this.clubs.set(id, newClub);
    return newClub;
  }

  async updateClub(id: number, club: Partial<InsertClub>): Promise<Club | undefined> {
    const existing = this.clubs.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...club };
    this.clubs.set(id, updated);
    return updated;
  }

  async deleteClub(id: number): Promise<boolean> {
    return this.clubs.delete(id);
  }

  async getClubsByPlayer(playerId: number): Promise<Club[]> {
    return Array.from(this.clubs.values()).filter(club => club.playerId === playerId);
  }

  async getActiveClubs(playerId: number): Promise<Club[]> {
    return Array.from(this.clubs.values()).filter(club => 
      club.playerId === playerId && club.status === "active"
    );
  }

  // Coach methods
  async getCoach(id: number): Promise<Coach | undefined> {
    return this.coaches.get(id);
  }

  async createCoach(coach: InsertCoach): Promise<Coach> {
    const id = this.coachId++;
    const newCoach: Coach = { 
      ...coach, 
      id,
      clubId: coach.clubId ?? null,
      contact: coach.contact ?? null,
      isActive: coach.isActive ?? true,
      profilePicture: coach.profilePicture ?? null
    };
    this.coaches.set(id, newCoach);
    return newCoach;
  }

  async updateCoach(id: number, coach: Partial<InsertCoach>): Promise<Coach | undefined> {
    const existing = this.coaches.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...coach };
    this.coaches.set(id, updated);
    return updated;
  }

  async deleteCoach(id: number): Promise<boolean> {
    return this.coaches.delete(id);
  }

  async getCoachesByPlayer(playerId: number): Promise<Coach[]> {
    return Array.from(this.coaches.values()).filter(coach => coach.playerId === playerId);
  }

  async getCoachesByClub(clubId: number): Promise<Coach[]> {
    return Array.from(this.coaches.values()).filter(coach => coach.clubId === clubId);
  }

  async getActiveCoaches(playerId: number): Promise<Coach[]> {
    return Array.from(this.coaches.values()).filter(coach => 
      coach.playerId === playerId && coach.isActive
    );
  }

  async getCoachingStaffByPlayer(playerId: number): Promise<CoachingStaff[]> {
    return Array.from(this.coachingStaff.values())
      .filter(coach => coach.playerId === playerId);
  }
}

export const storage = new MemStorage();
