import { JobApplicationStatus, type JobApplication } from "@/api/v1/api_pb";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { faker } from "@faker-js/faker";
import { KanbanCard } from "@/components/kanban-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ColumnNames: Partial<{ [key in JobApplicationStatus]: string }> = {
  [JobApplicationStatus.APPLIED]: "Applied",
  [JobApplicationStatus.INTERVIEW]: "Interviewing",
  [JobApplicationStatus.OFFER]: "Offered",
  [JobApplicationStatus.REJECTED]: "Rejected",
  [JobApplicationStatus.ACCEPTED]: "Accepted",
  [JobApplicationStatus.WITHDRAWN]: "Withdrawn",
  [JobApplicationStatus.SCREENING]: "Screening",
};

const ColumnColors: Partial<{ [key in JobApplicationStatus]: string }> = {
  [JobApplicationStatus.APPLIED]: "bg-gray-900 dark:bg-gray-100",
  [JobApplicationStatus.INTERVIEW]: "bg-indigo-900 dark:bg-indigo-100",
  [JobApplicationStatus.OFFER]: "bg-purple-900 dark:bg-purple-100",
  [JobApplicationStatus.REJECTED]: "bg-red-900 dark:bg-red-100",
  [JobApplicationStatus.ACCEPTED]: "bg-green-900 dark:bg-green-100",
  [JobApplicationStatus.WITHDRAWN]: "bg-red-900 dark:bg-red-100",
  [JobApplicationStatus.SCREENING]: "bg-blue-900 dark:bg-blue-100",
};

const STATUSES = Object.values(JobApplicationStatus).filter(
  (value) =>
    typeof value === "number" && value !== JobApplicationStatus.UNSPECIFIED
) as JobApplicationStatus[];

const jobApplications: JobApplication[] = Array.from({ length: 20 }, () => ({
  $typeName: "api.v1.JobApplication",
  id: faker.string.uuid(),
  company: faker.company.name(),
  title: faker.person.jobTitle(),
  createdAt: timestampFromDate(faker.date.past()),
  status: faker.helpers.arrayElement(STATUSES),
}));

export const Kanban = () => {
  function renderColumn(status: JobApplicationStatus) {
    const applications = jobApplications.filter((app) => app.status === status);

    return (
      <div
        key={status}
        className="bg-accent py-4 px-2 flex flex-col gap-2 rounded-xl"
      >
        <h2 className="text-md font-semibold text-left mb-4">
          {ColumnNames[status]} ({applications.length})
        </h2>
        {applications.map((job) => (
          <KanbanCard
            key={job.id}
            title={job.title}
            company={job.company}
            createdAt={job.createdAt!}
            color={ColumnColors[status]!}
          />
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
