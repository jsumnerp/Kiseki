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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

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
    <DialogContent className="h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Job application</DialogTitle>
        <DialogDescription>
          Update your job application details here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="grow overflow-hidden">
        <form className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={company} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            <Input id="status" value={status} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="createdAt">Created At</Label>
            <Input
              id="createdAt"
              value={timestampDate(createdAt!).toLocaleDateString()}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="appliedAt">Applied At</Label>
            <Input
              id="appliedAt"
              value={
                appliedAt ? timestampDate(appliedAt).toLocaleDateString() : ""
              }
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="cv">CV</Label>
            <Input id="cv" value={cv} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Input id="coverLetter" value={coverLetter} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </DialogContent>
  );
};
