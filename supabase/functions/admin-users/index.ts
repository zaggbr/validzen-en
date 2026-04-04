import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Authenticate the calling user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const callerUid = userData.user?.id;
    if (!callerUid) throw new Error("User not authenticated");

    // Check if caller is admin (by email)
    const ADMIN_EMAILS = ["continentemedia@gmail.com"];
    if (!ADMIN_EMAILS.includes(userData.user?.email ?? "")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all auth users (for email)
    const { data: authUsers, error: authError } =
      await supabaseClient.auth.admin.listUsers({ perPage: 1000 });
    if (authError) throw new Error(`Auth list error: ${authError.message}`);

    // Fetch all user profiles
    const { data: profiles, error: profilesError } = await supabaseClient
      .from("user_profiles")
      .select("id, display_name, is_premium, premium_until, created_at")
      .order("created_at", { ascending: false });
    if (profilesError) throw new Error(`Profiles error: ${profilesError.message}`);

    // Build email map from auth users
    const emailMap: Record<string, string> = {};
    for (const u of authUsers.users) {
      emailMap[u.id] = u.email ?? "";
    }

    // Merge
    const result = profiles.map((p) => ({
      id: p.id,
      display_name: p.display_name,
      email: emailMap[p.id] ?? "",
      is_premium: p.is_premium,
      premium_until: p.premium_until,
      created_at: p.created_at,
    }));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
