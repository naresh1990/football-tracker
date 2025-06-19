import { User } from "lucide-react";

interface PlayerProfileProps {
  player: any;
  stats: any;
}

export default function PlayerProfile({ player, stats }: PlayerProfileProps) {
  if (!player || !stats) return null;

  return (
    <>
      <div className="w-20 h-20 bg-gradient-to-br from-football-green to-field-green rounded-full flex items-center justify-center">
        <User className="text-white text-2xl" />
      </div>
    </>
  );
}
