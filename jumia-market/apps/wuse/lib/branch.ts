import type { BranchSlug } from "./types";

/**
 * Each deployment of this app IS one branch (Wuse or Garki).
 * The branch identity and the URL of the sister-branch app are read
 * from environment variables so the exact same codebase can be deployed
 * twice (once per branch) and still know how to talk to its partner.
 */
export const CURRENT_BRANCH = (process.env.NEXT_PUBLIC_BRANCH ||
  "wuse") as BranchSlug;

export const PARTNER_BRANCH: BranchSlug =
  CURRENT_BRANCH === "wuse" ? "garki" : "wuse";

// Server-side only: the base URL used to call the partner branch's API.
export const PARTNER_BRANCH_URL =
  process.env.BRANCH_PARTNER_URL ||
  (CURRENT_BRANCH === "wuse" ? "http://localhost:3001" : "http://localhost:3000");

export const BRANCH_LABELS: Record<BranchSlug, string> = {
  wuse: "Wuse Branch",
  garki: "Garki Branch",
};
