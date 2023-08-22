// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as postgres from "https://deno.land/x/postgres@v0.14.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as uuid from "https://deno.land/std@0.194.0/uuid/mod.ts";

const MAX_ROUNDS = 1;

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: topwords, error: topwordsError } = await supabase
      .from("words")
      .select("*")
      .filter("count", "gt", 0)
      .order("count", { ascending: false })
      .limit(10);

    const { data: bottomwords, error: bottomwordsError } = await supabase
      .from("words")
      .select("*")
      .filter("count", "lte", 0)
      .order("count", { ascending: true })
      .limit(10);

    console.log("creating image with these prompts:");
    console.log(topwords.map((s) => s.word).join(", "));
    console.log(bottomwords.map((s) => s.word).join(", "));

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: Deno.env.get("RUNPOD_API_KEY"),
      },
      body: JSON.stringify({
        input: {
          prompt: topwords.map((s) => s.word).join(", "),
          negative_prompt: bottomwords.map((s) => s.word).join(", "),
          width: 512,
          height: 512,
          guidance_scale: 7.5,
          num_inference_steps: 50,
          num_outputs: 1,
          prompt_strength: 0.8,
          scheduler: "K-LMS",
        },
      }),
    };

    const response = await fetch(
      "https://api.runpod.ai/v2/sd-anything-v4/runsync",
      options
    );
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    console.log(jsonResponse.output[0].image);

    const imgResponse = await fetch(jsonResponse.output[0].image);

    const { data, error: storageError } = await supabase.storage
      .from("generated-images")
      .upload(`public/${uuid.v1.generate()}.png`, imgResponse.body, {
        cacheControl: "3600",
        upsert: false,
      });
    if (storageError) console.error("error from storage save: ", storageError);
    console.log("here is storage data: ", data);

    const { error: gameInsertError } = await supabase.from("game").insert({
      top_words: topwords.map((s) => s.word),
      bottom_words: bottomwords.map((s) => s.word),
      img_url: data.path,
      game_round: 1,
    });
    if (gameInsertError)
      console.error("error from inserting new game: ", gameInsertError);

    return new Response(jsonResponse.output[0].image, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
