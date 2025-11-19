import { JobApplicationStatus } from "@/api/v1/api_pb";

export const JobApplicationStatusNames: Partial<{
  [key in JobApplicationStatus]: string;
}> = {
  [JobApplicationStatus.APPLIED]: "Applied",
  [JobApplicationStatus.INTERVIEW]: "Interviewing",
  [JobApplicationStatus.OFFER]: "Offered",
  [JobApplicationStatus.REJECTED]: "Rejected",
  [JobApplicationStatus.ACCEPTED]: "Accepted",
  [JobApplicationStatus.WITHDRAWN]: "Withdrawn",
  [JobApplicationStatus.SCREENING]: "Screening",
};
