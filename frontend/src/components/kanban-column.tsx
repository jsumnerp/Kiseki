import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { JobApplicationStatus, type JobApplication } from "@/api/v1/api_pb";
import { KanbanCard } from "@/components/kanban-card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ApplicationModal } from "@/components/application-modal";
import { JobApplicationStatusNames } from "@/constants/job-application-statuses";

interface KanbanColumnProps {
  status: JobApplicationStatus;
  applicationsForStatus: JobApplication[];
  allApplications: JobApplication[];
  color: string;
  onDrop: (
    jobApplicationId: string,
    newStatus: JobApplicationStatus,
    targetIndex?: number
  ) => void;
}

export const KanbanColumn = ({
  status,
  applicationsForStatus,
  allApplications,
  color,
  onDrop,
}: KanbanColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ source, location }) => {
        setIsDraggedOver(false);
        const jobApplicationId = source.data.jobApplicationId as string;

        // Check if dropped on a specific card or just the column
        const dropTargets = location.current.dropTargets;
        const cardDropTarget = dropTargets.find(
          (target) => target.data.type === "card"
        );

        if (cardDropTarget) {
          const targetIndex = cardDropTarget.data.index as number;
          const isDropAbove = cardDropTarget.data.isDropAbove as boolean;

          // If dropping above, insert before (at the card's index)
          // If dropping below, insert after (at the card's index + 1)
          const insertIndex = isDropAbove ? targetIndex : targetIndex + 1;
          onDrop(jobApplicationId, status, insertIndex);
        } else {
          // Dropped on empty space in column - add to end
          onDrop(jobApplicationId, status);
        }
      },
      getData: () => ({ status }),
    });
  }, [status, onDrop]);

  return (
    <div
      ref={ref}
      className={`bg-accent py-4 px-2 flex flex-col gap-2 rounded-xl transition-colors ${
        isDraggedOver ? "ring-2 ring-primary" : ""
      }`}
    >
      <h2 className="text-md font-semibold text-left mb-4">
        {JobApplicationStatusNames[status]} ({applicationsForStatus.length})
      </h2>
      {applicationsForStatus.map((job, index) => (
        <Dialog
          key={job.id}
          open={openDialogId === job.id}
          onOpenChange={(open) => setOpenDialogId(open ? job.id : null)}
        >
          <DialogTrigger asChild>
            <KanbanCard
              id={job.id}
              title={job.title}
              company={job.company}
              appliedOn={job.appliedOn!}
              color={color}
              index={index}
            />
          </DialogTrigger>

          <ApplicationModal
            jobApplication={job}
            jobApplications={allApplications}
            onClose={() => setOpenDialogId(null)}
          />
        </Dialog>
      ))}
    </div>
  );
};
