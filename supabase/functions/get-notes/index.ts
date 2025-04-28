import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";
console.info("Server started");
// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""; // Use Service Role key for secure access
const supabase = createClient(supabaseUrl, supabaseKey);
Deno.serve(async (req)=>{
  if (req.method !== "GET") {
    return new Response(JSON.stringify({
      error: "Method Not Allowed"
    }), {
      status: 405
    });
  }
  // Extract authenticated user ID from Supabase Auth
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({
      error: "Unauthorized"
    }), {
      status: 401
    });
  }
  // Get authenticated user's ID
  const { data: user, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (authError || !user) {
    return new Response(JSON.stringify({
      error: "Invalid authentication"
    }), {
      status: 401
    });
  }
  const userId = user.user?.id; // Extract user ID
  // Fetch notes where user_id matches the authenticated user's ID
  const { data, error } = await supabase.from("notes").select("*").eq("user_id", userId);
  if (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500
    });
  }
  return new Response(JSON.stringify({
    notes: data
  }), {
    status: 200
  });
});
