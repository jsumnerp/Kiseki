import { timestampDate, type Timestamp } from "@bufbuild/protobuf/wkt";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";

export interface KanbanCardProps {
  id: string;
  title: string;
  company: string;
  appliedOn: Timestamp;
  color: string;
  index: number;
  onClick?: () => void;
  ariaLabel?: string;
}

export const KanbanCard = ({
  id,
  title,
  company,
  appliedOn,
  color,
  index,
  onClick,
  ariaLabel,
}: KanbanCardProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<"above" | "below" | null>(
    null
  );

  useEffect(() => {
    const el = ref.current;
    invariant(el);
    const cleanupDraggable = draggable({
      element: el,
      getInitialData: () => ({ jobApplicationId: id }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
    const cleanupDropTarget = dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        const data = {
          type: "card",
          index,
        };

        return attachClosestEdge(data, {
          element,
          input,
          allowedEdges: ["top", "bottom"],
        });
      },
      onDragEnter: ({ self, source }) => {
        // Don't show indicator when dragging over itself
        if (source.data.jobApplicationId === id) return;

        const closestEdge = extractClosestEdge(self.data);
        setDropIndicator(closestEdge === "top" ? "above" : "below");
      },
      onDrag: ({ self, source }) => {
        if (source.data.jobApplicationId === id) return;

        const closestEdge = extractClosestEdge(self.data);
        setDropIndicator(closestEdge === "top" ? "above" : "below");
      },
      onDragLeave: () => setDropIndicator(null),
      onDrop: () => setDropIndicator(null),
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [id, index]);

  // Render the card inside a Button so the whole card is clickable and keyboard-accessible.
  // We keep Card for visual structure but use Button as the interactive element.
  return (
    <div className="relative">
      {/* Drop indicator line above */}
      {dropIndicator === "above" && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-primary rounded-full z-10 pointer-events-none" />
      )}

      <Button
        onClick={onClick}
        aria-label={ariaLabel ?? `${title} at ${company}`}
        className={`w-full p-0 text-left h-fit transition-all ${
          isDragging ? "opacity-50" : ""
        }`}
        variant="ghost"
        ref={ref}
      >
        <Card className="gap-2 p-0 overflow-hidden border-0 w-full">
          <CardTitle
            className={`px-2 py-2 text-sm font-bold text-background ${color} rounded-tl-xl rounded-tr-xl text-wrap`}
          >
            {company}
          </CardTitle>
          <CardContent className="px-2 py-0">
            <p className="text-xs text-secondary-foreground text-wrap">
              {title}
            </p>
          </CardContent>
          <CardFooter className="text-xs px-2 py-0 pb-2 text-muted-foreground flex items-center justify-between">
            <span>
              Applied:{" "}
              {new Intl.DateTimeFormat("en-GB", {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(timestampDate(appliedOn))}
            </span>
          </CardFooter>
        </Card>
      </Button>

      {/* Drop indicator line below */}
      {dropIndicator === "below" && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full z-10 pointer-events-none" />
      )}
    </div>
  );
};
