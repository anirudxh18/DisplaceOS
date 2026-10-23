

const SUPABASE_URL = "https://sojowsopfbgesjzsicvm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wNF3g_id9KWh4lHubBFGDg_PZ6qyieY";

if (!window.supabase) {
  console.error("Supabase library failed to load.");
} else {
  window.displaceSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  console.log("DisplaceOS Supabase client initialized.");
}
