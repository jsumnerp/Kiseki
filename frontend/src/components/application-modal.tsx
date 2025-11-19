import type { JobApplication } from "@/api/v1/api_pb";
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { JobApplicationStatusNames } from "@/constants/job-application-statuses";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ApplicationModalProps {
  jobApplication: JobApplication;
}

export const ApplicationModal = ({ jobApplication }: ApplicationModalProps) => {
  const {
    createdAt,
    company,
    title,
    status,
    description,
    cv,
    coverLetter,
    appliedAt,
  } = jobApplication;
  return (
    <DialogContent className="h-[90vh] sm:max-w-10/12">
      <DialogHeader>
        <DialogTitle>Job application</DialogTitle>
        <DialogDescription>
          Update your job application details here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form className="flex flex-col grow min-h-0 gap-4">
        <ScrollArea className="grow overflow-hidden">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="company">Company</FieldLabel>
              <Input id="company" value={company} />
            </Field>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" value={title} />
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select defaultValue={String(status)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Applied" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(JobApplicationStatusNames).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Job Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Enter job description here"
                className="resize-none"
                value={description}
              />
            </Field>
            {/* <Field>
              <FieldLabel htmlFor="createdAt">Created At</FieldLabel>
              <Input
                id="createdAt"
                value={timestampDate(createdAt!).toLocaleDateString()}
              />
            </Field> */}
            <Field>
              <FieldLabel htmlFor="appliedAt">Applied At</FieldLabel>
              <Input
                id="appliedAt"
                value={
                  appliedAt ? timestampDate(appliedAt).toLocaleDateString() : ""
                }
                type="date"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="cv">CV</FieldLabel>
              <Input id="cv" value={cv} type="file" />
            </Field>
            <Field>
              <FieldLabel htmlFor="coverLetter">Cover Letter</FieldLabel>
              <Textarea
                id="coverLetter"
                placeholder="Enter cover letter here"
                className="resize-none"
                value={coverLetter}
              />
            </Field>
          </FieldGroup>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
