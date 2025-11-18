import { timestampDate, type Timestamp } from "@bufbuild/protobuf/wkt";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface KanbanCardProps {
  title: string;
  company: string;
  createdAt: Timestamp;
  color: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export const KanbanCard = ({
  title,
  company,
  createdAt,
  color,
  onClick,
  ariaLabel,
}: KanbanCardProps) => {
  // Render the card inside a Button so the whole card is clickable and keyboard-accessible.
  // We keep Card for visual structure but use Button as the interactive element.
  return (
    <Button
      onClick={onClick}
      aria-label={ariaLabel ?? `${title} at ${company}`}
      className="w-full p-0 text-left h-fit"
      variant="ghost"
    >
      <Card className="gap-2 p-0 overflow-hidden border-0 w-full">
        <CardTitle
          className={`px-2 py-2 text-sm font-bold text-background ${color} rounded-tl-xl rounded-tr-xl text-wrap`}
        >
          {company}
        </CardTitle>
        <CardContent className="px-2 py-0">
          <p className="text-xs text-secondary-foreground text-wrap">{title}</p>
        </CardContent>
        <CardFooter className="text-xs px-2 py-0 pb-2 text-muted-foreground flex items-center justify-between">
          <span>Applied: {timestampDate(createdAt).toLocaleDateString()}</span>
        </CardFooter>
      </Card>
    </Button>
  );
};
