import { JobApplicationStatus, type JobApplication } from "@/api/v1/api_pb";
import { KanbanColumn } from "@/components/kanban-column";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { STATUSES } from "@/constants/job-application-statuses";
import { useUpdateJobApplicationStatus } from "@/hooks/useUpdateJobApplicationStatus";
import {
  calculatePositionAtEnd,
  calculatePositionAtIndex,
  getSortedApplicationsByStatus,
} from "@/lib/application-sorting";

const ColumnColors: Partial<{ [key in JobApplicationStatus]: string }> = {
  [JobApplicationStatus.APPLIED]: "bg-gray-900 dark:bg-gray-100",
  [JobApplicationStatus.INTERVIEW]: "bg-indigo-900 dark:bg-indigo-100",
  [JobApplicationStatus.OFFER]: "bg-purple-900 dark:bg-purple-100",
  [JobApplicationStatus.REJECTED]: "bg-red-900 dark:bg-red-100",
  [JobApplicationStatus.ACCEPTED]: "bg-green-900 dark:bg-green-100",
  [JobApplicationStatus.WITHDRAWN]: "bg-red-900 dark:bg-red-100",
  [JobApplicationStatus.SCREENING]: "bg-blue-900 dark:bg-blue-100",
};

interface KanbanProps {
  jobApplications: JobApplication[];
}

export const Kanban = ({ jobApplications }: KanbanProps) => {
  const updateStatusMutation = useUpdateJobApplicationStatus();

  const handleDrop = (
    jobApplicationId: string,
    newStatus: JobApplicationStatus,
    targetIndex?: number
  ) => {
    const draggedCard = jobApplications.find(
      (app) => app.id === jobApplicationId
    );
    if (!draggedCard) return;

    // Adjust targetIndex when moving within the same column
    let adjustedTargetIndex = targetIndex;
    if (draggedCard.status === newStatus && targetIndex !== undefined) {
      const currentColumnApps = getSortedApplicationsByStatus(
        jobApplications,
        newStatus
      );
      const currentIndex = currentColumnApps.findIndex(
        (app) => app.id === jobApplicationId
      );

      // After filtering out the dragged card, if the target is after the current position,
      // we need to adjust by -1 because indices shift
      if (targetIndex > currentIndex) {
        adjustedTargetIndex = targetIndex - 1;
      } else {
        adjustedTargetIndex = targetIndex;
      }

      // If the adjusted position equals current, do nothing
      if (currentIndex === adjustedTargetIndex) return;
    }

    // Filter out the dragged card to get accurate index calculation
    const filteredApplications = jobApplications.filter(
      (app) => app.id !== jobApplicationId
    );

    const newPosition =
      adjustedTargetIndex !== undefined
        ? calculatePositionAtIndex(
            filteredApplications,
            newStatus,
            adjustedTargetIndex
          )
        : calculatePositionAtEnd(filteredApplications, newStatus);

    updateStatusMutation.mutate({
      id: jobApplicationId,
      status: newStatus,
      position: newPosition,
    });
  };

  function renderColumn(status: JobApplicationStatus) {
    const applicationsForStatus = getSortedApplicationsByStatus(
      jobApplications,
      status
    );

    return (
      <KanbanColumn
        key={status}
        status={status}
        applicationsForStatus={applicationsForStatus}
        allApplications={jobApplications}
        color={ColumnColors[status]!}
        onDrop={handleDrop}
      />
    );
  }

  return (
    <ScrollArea className="size-full whitespace-nowrap">
      <div
        className="grid size-full grid-cols-7 gap-2 px-6 min-w-[1400px]"
        aria-label="Kanban board"
      >
        {STATUSES.map((status) => renderColumn(status))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
