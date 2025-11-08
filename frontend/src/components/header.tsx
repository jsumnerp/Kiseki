import { ModeToggle } from "@/components/mode-toggle";

export const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between mb-8 border-b-2 border-muted-foreground">
      <h1 className="text-2xl font-bold">Kiseki</h1>
      <ModeToggle />
    </header>
  );
};
