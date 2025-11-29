import { useMutation } from "@connectrpc/connect-query";
import { updateJobApplicationStatus } from "@/api/v1/api-Service_connectquery";
import { useQueryClient } from "@tanstack/react-query";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { useJobApplicationQueryKey } from "./useJobApplicationQueryKey";

export function useUpdateJobApplicationStatus() {
  const queryClient = useQueryClient();
  const listJobApplicationsKey = useJobApplicationQueryKey();

  return useMutation(updateJobApplicationStatus, {
    onMutate: async (statusUpdate) => {
      await queryClient.cancelQueries({ queryKey: listJobApplicationsKey });

      const previousApplications = queryClient.getQueryData(
        listJobApplicationsKey
      );

      queryClient.setQueryData(listJobApplicationsKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          jobApplications: old.jobApplications.map((app: any) =>
            app.id === statusUpdate.id
              ? {
                  ...app,
                  status: statusUpdate.status,
                  updatedAt: timestampFromDate(new Date()),
                  position: statusUpdate.position ?? undefined,
                }
              : app
          ),
        };
      });

      return { previousApplications };
    },
    onError: (_err, _statusUpdate, context) => {
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
