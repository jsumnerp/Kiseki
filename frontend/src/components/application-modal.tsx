import { JobApplicationStatus, type JobApplication } from "@/api/v1/api_pb";
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { timestampDate, timestampFromDate } from "@bufbuild/protobuf/wkt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JobApplicationStatusNames } from "@/constants/job-application-statuses";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery } from "@connectrpc/connect-query";
import { createJobApplication } from "@/api/v1/api-Service_connectquery";

interface ApplicationModalProps {
  jobApplication?: JobApplication;
}

const applicationFormSchema = z.object({
  company: z.string().nonempty("Company is required"),
  title: z.string().nonempty("Title is required"),
  status: z
    .enum(JobApplicationStatus)
    .refine((value) => value !== JobApplicationStatus.UNSPECIFIED, {
      message: "Unspecified status is not allowed",
    }),
  description: z.string().optional(),
  cv: z
    .instanceof(File)
    .refine((file) => ["application/pdf"].includes(file.type), {
      message: "Invalid document file type",
    })
    .optional(),
  coverLetter: z.string().optional(),
  appliedOn: z.iso.date(),
  notes: z.string().optional(),
});

export const ApplicationModal = ({ jobApplication }: ApplicationModalProps) => {
  const isNewApplication = !jobApplication;

  const mutation = useMutation(createJobApplication);
  const {
    createdAt,
    company,
    title,
    status,
    description,
    cv,
    coverLetter,
    appliedOn,
    notes,
  } = jobApplication || {};

  const form = useForm<z.infer<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      company: company || "",
      title: title || "",
      status: status ?? JobApplicationStatus.APPLIED,
      description: description || "",
      cv: undefined,
      coverLetter: coverLetter || "",
      appliedOn: appliedOn
        ? timestampDate(appliedOn).toISOString().slice(0, 10)
        : "",
      notes: notes || "",
    },
  });

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function onSubmit(values: z.infer<typeof applicationFormSchema>) {
    console.log("Submitted values:", values);
    mutation.mutate({
      company: values.company,
      title: values.title,
      status: values.status,
      description: values.description,
      coverLetter: values.coverLetter,
      appliedOn: timestampFromDate(new Date(values.appliedOn)),
      notes: values.notes,
      cv: values.cv
        ? arrayBufferToBase64(await values.cv.arrayBuffer())
        : undefined,
    });
  }

  return (
    <DialogContent className="max-h-[90vh] sm:max-w-10/12 flex flex-col">
      <DialogHeader>
        <DialogTitle>Job application</DialogTitle>
        <DialogDescription>
          Update your job application details here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 grow min-h-0"
        >
          <div className="flex flex-col gap-4 grow overflow-auto">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={String(field.value)}
                      onValueChange={(val) =>
                        field.onChange(Number(val) as JobApplicationStatus)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {Object.entries(JobApplicationStatusNames).map(
                          ([key, label]) => (
                            <SelectItem key={key} value={String(key)}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Enter job description here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appliedOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applied On</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CV</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter cover letter here"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter additional notes here"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
