import { useMutation } from "@connectrpc/connect-query";
import { createJobApplication } from "@/api/v1/api-Service_connectquery";
import { useQueryClient } from "@tanstack/react-query";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { useJobApplicationQueryKey } from "./useJobApplicationQueryKey";

export function useCreateJobApplication() {
  const queryClient = useQueryClient();
  const listJobApplicationsKey = useJobApplicationQueryKey();

  return useMutation(createJobApplication, {
    onMutate: async (newApplication) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listJobApplicationsKey });

      // Snapshot previous value
      const previousApplications = queryClient.getQueryData(
        listJobApplicationsKey
      );

      // Optimistically update cache
      queryClient.setQueryData(listJobApplicationsKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          jobApplications: [
            ...old.jobApplications,
            {
              ...newApplication,
              id: crypto.randomUUID(), // Temporary ID
              createdAt: timestampFromDate(new Date()),
              updatedAt: timestampFromDate(new Date()),
            },
          ],
        };
      });

      return { previousApplications };
    },
    onError: (_err, _newApplication, context) => {
      // Rollback on error
      if (context?.previousApplications) {
        queryClient.setQueryData(
          listJobApplicationsKey,
          context.previousApplications
        );
      }
    },
    onSettled: () => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({ queryKey: listJobApplicationsKey });
    },
  });
}
