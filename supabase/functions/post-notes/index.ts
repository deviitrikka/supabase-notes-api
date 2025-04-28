import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";
// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""; // Use Service Role key for secure writes
const supabase = createClient(supabaseUrl, supabaseKey);
console.info("Server started");
Deno.serve(async (req)=>{
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method Not Allowed"
    }), {
      status: 405
    });
  }
  const { user_id, title, content } = await req.json();
  // Validate required fields
  if (!user_id || !title || !content) {
    return new Response(JSON.stringify({
      error: "Missing required fields"
    }), {
      status: 400
    });
  }
  // Insert new note into Supabase
  const { data, error } = await supabase.from("notes").insert([
    {
      user_id,
      title,
      content
    }
  ]).select("*");
  if (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500
    });
  }
  return new Response(JSON.stringify({
    message: "Note created successfully",
    note: data
  }), {
    status: 201
  });
});
