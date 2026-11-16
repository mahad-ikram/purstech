/**
 * Milestone formatter for PursTech tool counts.
 * Floors the live tool count to the nearest multiple of 10 and appends "+"
 * Example: 51 -> "50+", 52 -> "50+", 59 -> "50+", 60 -> "60+"
 */
export function getToolMilestone(count: number): string {
  return `${Math.floor(count / 10) * 10}+`;
}

export const TOOL_MILESTONE = "50+";
