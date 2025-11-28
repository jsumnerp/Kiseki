import { JobApplicationStatus } from "@/api/v1/api_pb";
import { KanbanCard } from "@/components/kanban-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ApplicationModal } from "@/components/application-modal";
import {
  JobApplicationStatusNames,
  STATUSES,
} from "@/constants/job-application-statuses";
import { useQuery } from "@connectrpc/connect-query";
import { listJobApplications } from "@/api/v1/api-Service_connectquery";
import { useState } from "react";

const ColumnColors: Partial<{ [key in JobApplicationStatus]: string }> = {
  [JobApplicationStatus.APPLIED]: "bg-gray-900 dark:bg-gray-100",
  [JobApplicationStatus.INTERVIEW]: "bg-indigo-900 dark:bg-indigo-100",
  [JobApplicationStatus.OFFER]: "bg-purple-900 dark:bg-purple-100",
  [JobApplicationStatus.REJECTED]: "bg-red-900 dark:bg-red-100",
  [JobApplicationStatus.ACCEPTED]: "bg-green-900 dark:bg-green-100",
  [JobApplicationStatus.WITHDRAWN]: "bg-red-900 dark:bg-red-100",
  [JobApplicationStatus.SCREENING]: "bg-blue-900 dark:bg-blue-100",
};

export const Kanban = () => {
  const { data } = useQuery(listJobApplications, {});
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  function renderColumn(status: JobApplicationStatus) {
    const applications = data?.jobApplications.filter(
      (app) => app.status === status
    );

    return (
      <div
        key={status}
        className="bg-accent py-4 px-2 flex flex-col gap-2 rounded-xl"
      >
        <h2 className="text-md font-semibold text-left mb-4">
          {JobApplicationStatusNames[status]} ({applications?.length ?? 0})
        </h2>
        {applications?.map((job) => (
          <Dialog
            key={job.id}
            open={openDialogId === job.id}
            onOpenChange={(open) => setOpenDialogId(open ? job.id : null)}
          >
            <DialogTrigger asChild>
              <KanbanCard
                title={job.title}
                company={job.company}
                appliedOn={job.appliedOn!}
                color={ColumnColors[status]!}
              />
            </DialogTrigger>

            <ApplicationModal
              jobApplication={job}
              onClose={() => setOpenDialogId(null)}
            />
          </Dialog>
        ))}
      </div>
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
