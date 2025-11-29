import { generateKeyBetween } from "fractional-indexing";
import type { JobApplication, JobApplicationStatus } from "@/api/v1/api_pb";

/**
 * Sort applications by position (case-sensitive lexicographic order)
 */
function sortByPosition(apps: JobApplication[]): JobApplication[] {
  return apps.sort((a, b) =>
    a.position < b.position ? -1 : a.position > b.position ? 1 : 0
  );
}

/**
 * Get sorted applications for a specific status
 * @param allApplications - All job applications
 * @param status - The status to filter by
 * @returns Sorted applications for the given status
 */
export function getSortedApplicationsByStatus(
  allApplications: JobApplication[],
  status: JobApplicationStatus
): JobApplication[] {
  return sortByPosition(allApplications.filter((app) => app.status === status));
}

/**
 * Calculate the position for a job application at the end of a column
 * @param allApplications - All job applications
 * @param status - The target status/column
 * @returns The new position string
 */
export function calculatePositionAtEnd(
  allApplications: JobApplication[],
  status: JobApplicationStatus
): string {
  const sameStatusApps = sortByPosition(
    allApplications.filter((app) => app.status === status)
  );

  const lastApp = sameStatusApps[sameStatusApps.length - 1];
  return generateKeyBetween(lastApp?.position || null, null);
}

/**
 * Calculate the position for a job application between two other applications
 * @param allApplications - All job applications
 * @param status - The target status/column
 * @param targetIndex - The index where the card should be inserted (will be placed AT/BEFORE this index)
 * @returns The new position string
 */
export function calculatePositionAtIndex(
  allApplications: JobApplication[],
  status: JobApplicationStatus,
  targetIndex: number
): string {
  const sameStatusApps = sortByPosition(
    allApplications.filter((app) => app.status === status)
  );

  // Insert at targetIndex means between:
  // - beforeApp is at targetIndex - 1
  // - afterApp is at targetIndex
  const beforeApp = targetIndex > 0 ? sameStatusApps[targetIndex - 1] : null;
  const afterApp = sameStatusApps[targetIndex] || null;

  return generateKeyBetween(
    beforeApp?.position || null,
    afterApp?.position || null
  );
}
