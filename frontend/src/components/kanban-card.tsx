import { timestampDate, type Timestamp } from "@bufbuild/protobuf/wkt";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export interface KanbanCardProps {
  title: string;
  company: string;
  createdAt: Timestamp;
  color: string;
}

export const KanbanCard = ({
  title,
  company,
  createdAt,
  color,
}: KanbanCardProps) => {
  return (
    <Card className="gap-2 p-0 overflow-hidden border-0">
      <CardTitle
        className={`px-2 py-2 text-sm font-bold text-background ${color} rounded-tl-xl rounded-tr-xl`}
      >
        {company}
      </CardTitle>
      <CardContent className="px-2 py-0">
        <p className="text-xs text-secondary-foreground">{title}</p>
      </CardContent>
      <CardFooter className="text-xs px-2 py-0 pb-2 text-muted-foreground flex items-center justify-between">
        <span>{timestampDate(createdAt).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
};
