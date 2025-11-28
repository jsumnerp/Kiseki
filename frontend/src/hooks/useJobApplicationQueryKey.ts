import { createConnectQueryKey } from "@connectrpc/connect-query";
import { listJobApplications } from "@/api/v1/api-Service_connectquery";

export function useJobApplicationQueryKey() {
  return createConnectQueryKey({
    schema: listJobApplications,
    input: {},
    cardinality: "finite",
  });
}
