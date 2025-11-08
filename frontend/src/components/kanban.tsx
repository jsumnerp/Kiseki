import { JobApplicationStatus, type JobApplication } from "@/api/v1/api_pb";
import { timestampDate, timestampFromDate } from "@bufbuild/protobuf/wkt";
import { faker } from "@faker-js/faker";
import { Card, CardTitle, CardContent } from "@/components/ui/card";

const ColumnNames: Partial<{ [key in JobApplicationStatus]: string }> = {
  [JobApplicationStatus.APPLIED]: "Applied",
  [JobApplicationStatus.INTERVIEW]: "Interviewing",
  [JobApplicationStatus.OFFER]: "Offered",
  [JobApplicationStatus.REJECTED]: "Rejected",
  [JobApplicationStatus.ACCEPTED]: "Accepted",
  [JobApplicationStatus.WITHDRAWN]: "Withdrawn",
  [JobApplicationStatus.SCREENING]: "Screening",
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
      <div key={status} className="bg-accent outline py-4 px-2">
        <h2 className="text-sm font-semibold text-left">
          {ColumnNames[status]}
        </h2>
        {applications.map((job) => (
          <Card key={job.id}>
            <CardTitle>{job.company}</CardTitle>
            <CardContent>
              <p>{job.title}</p>
              <p>{timestampDate(job.createdAt!).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid size-full grid-cols-7 gap-2" aria-label="Kanban board">
      {STATUSES.map((status) => renderColumn(status))}
    </div>
  );
};
