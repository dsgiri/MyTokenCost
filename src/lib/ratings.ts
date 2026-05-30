import { supabase } from "./supabase";

// Get or generate a persistent anonymous visitor ID to prevent double-voting
const getVisitorId = (): string => {
  if (typeof window === "undefined") return "ssr-node";
  let id = localStorage.getItem("mtc_visitor_uuid");
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("mtc_visitor_uuid", id);
  }
  return id;
};

export interface RatingSummary {
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
}

/**
 * Fire-and-forget upvote/downvote telemetry submitter.
 * Runs silently in the background without blocking the UI or throwing unhandled exceptions.
 */
export const submitRating = (
  entityType: "calculator" | "blog" | "blueprint",
  entityId: string,
  voteType: "up" | "down",
  feedbackText?: string
): void => {
  const visitorId = getVisitorId();

  // Run the async operation in the background (fire-and-forget)
  (async () => {
    try {
      const { error } = await supabase
        .from("public_ratings")
        .upsert(
          {
            entity_type: entityType,
            entity_id: entityId,
            ip_hash: visitorId,
            vote_type: voteType,
            feedback_text: feedbackText || null,
            created_at: new Date().toISOString(),
          },
          { onConflict: "entity_type,entity_id,ip_hash" }
        );

      if (error) {
        console.warn("Telemetry update suppressed silently:", error.message);
      }
    } catch (err: unknown) {
      console.warn("Telemetry connection failed silently:", err);
    }
  })();
};

/**
 * Fetch ratings summary for a given public entity.
 * Catches errors and returns fallback counts if database is not reachable.
 */
export const fetchRatings = async (
  entityType: "calculator" | "blog" | "blueprint",
  entityId: string
): Promise<RatingSummary> => {
  try {
    const visitorId = getVisitorId();
    
    const { data, error } = await supabase
      .from("public_ratings")
      .select("vote_type, ip_hash")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId);

    if (error) {
      throw error;
    }

    let upvotes = 0;
    let downvotes = 0;
    let userVote: "up" | "down" | null = null;

    if (data) {
      data.forEach((row) => {
        if (row.vote_type === "up") upvotes++;
        if (row.vote_type === "down") downvotes++;
        if (row.ip_hash === visitorId) {
          userVote = row.vote_type as "up" | "down";
        }
      });
    }

    return { upvotes, downvotes, userVote };
  } catch (err) {
    console.warn("Failed to fetch telemetry, returning defaults:", err);
    return { upvotes: 0, downvotes: 0, userVote: null };
  }
};
