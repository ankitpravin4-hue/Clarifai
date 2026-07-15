import { supabaseAdmin } from "@/lib/supabase";

export type UserPlan = "free" | "pro";

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("plan, expires_at")
    .eq("user_id", userId)
    .single();

  if (!data) return "free";
  if (data.plan === "pro" && new Date(data.expires_at) > new Date()) return "pro";
  return "free";
}
