import { useMutation } from "@connectrpc/connect-query";
import { deleteJobApplication } from "@/api/v1/api-Service_connectquery";
import { useQueryClient } from "@tanstack/react-query";
import { useJobApplicationQueryKey } from "./useJobApplicationQueryKey";

export function useDeleteJobApplication() {
  const queryClient = useQueryClient();
  const listJobApplicationsKey = useJobApplicationQueryKey();

  return useMutation(deleteJobApplication, {
    onMutate: async (deletedApplication) => {
      await queryClient.cancelQueries({ queryKey: listJobApplicationsKey });

      const previousApplications = queryClient.getQueryData(
        listJobApplicationsKey
      );

      queryClient.setQueryData(listJobApplicationsKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          jobApplications: old.jobApplications.filter(
            (app: any) => app.id !== deletedApplication.id
          ),
        };
      });

      return { previousApplications };
    },
    onError: (_err, _deletedApplication, context) => {
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
