import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";
console.info("Server started");
// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""; // Use Service Role key for authentication
const supabase = createClient(supabaseUrl, supabaseKey);
Deno.serve(async (req)=>{
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method Not Allowed"
    }), {
      status: 405
    });
  }
  const { email, password } = await req.json();
  // Validate required fields
  if (!email || !password) {
    return new Response(JSON.stringify({
      error: "Missing email or password"
    }), {
      status: 400
    });
  }
  // Authenticate user with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 401
    });
  }
  // Extract JWT token
  const token = data.session?.access_token;
  return new Response(JSON.stringify({
    message: "Authentication successful",
    token
  }), {
    status: 200
  });
});
