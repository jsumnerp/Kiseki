import { useMutation } from "@connectrpc/connect-query";
import { updateJobApplication } from "@/api/v1/api-Service_connectquery";
import { useQueryClient } from "@tanstack/react-query";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { useJobApplicationQueryKey } from "./useJobApplicationQueryKey";

export function useUpdateJobApplication() {
  const queryClient = useQueryClient();
  const listJobApplicationsKey = useJobApplicationQueryKey();

  return useMutation(updateJobApplication, {
    onMutate: async (updatedApplication) => {
      await queryClient.cancelQueries({ queryKey: listJobApplicationsKey });

      const previousApplications = queryClient.getQueryData(
        listJobApplicationsKey
      );

      queryClient.setQueryData(listJobApplicationsKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          jobApplications: old.jobApplications.map((app: any) =>
            app.id === updatedApplication.id
              ? {
                  ...app,
                  ...updatedApplication,
                  updatedAt: timestampFromDate(new Date()),
                }
              : app
          ),
        };
      });

      return { previousApplications };
    },
    onError: (_err, _updatedApplication, context) => {
      if (context?.previousApplications) {
        queryClient.setQueryData(
          listJobApplicationsKey,
          context.previousApplications
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listJobApplicationsKey });
    },
  });
}
