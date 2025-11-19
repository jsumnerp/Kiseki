import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export interface HeaderProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
}

export const Header = ({ isLoggedIn, onLogout }: HeaderProps) => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between mb-8 border-b-2 border-muted-foreground">
      <h1 className="text-2xl font-bold">Kiseki</h1>
      <div className="flex gap-4">
        {isLoggedIn && (
          <Button onClick={onLogout} variant="destructive">
            Log Out
          </Button>
        )}
        <ModeToggle />
      </div>
    </header>
  );
};
