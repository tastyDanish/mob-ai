// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as postgres from "https://deno.land/x/postgres@v0.14.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as uuid from "https://deno.land/std@0.194.0/uuid/mod.ts";

const MAX_ROUNDS = 1;

const seedPhrases: string[] = [
  "(oil painting) of",
  "(newspaper picture) of",
  "(Photorealistic photography) of",
  "(digital artwork) of",
  "(vintage illustration) of",
  "(watercolor depiction) of",
  "(rage comic) of",
  "(stone carving) of",
  "(cave drawing) of",
  "(Museum display) of",
  "(impressionist portrait) of",
  "(tv ad) of",
  "(childrens game) of",
  "(modern sculpture) of",
];

// Function to get a random seed phrase
function getRandomSeedPhrase(): string {
  const randomIndex = Math.floor(Math.random() * seedPhrases.length);
  return seedPhrases[randomIndex];
}

const createPrompt = (prompt: any, words: any) => {
  return (
    prompt.phrase +
    " ((" +
    words[0].word +
    ")), " +
    " (" +
    words[1].word +
    "), " +
    words
      .slice(2)
      .map((s: any) => s.word)
      .join(", ")
  );
};

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
      .limit(5);

    if (topwords.length === 0) {
      console.log("no top words, skipping creation");
      return new Response(null, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    }

    // now we delete all the words:
    const { error: wordDeleteError } = await supabase
      .from("words")
      .delete()
      .neq("id", 0);

    if (wordDeleteError)
      console.error("error from deleting words: ", wordDeleteError);

    const { data: seedPhrase, error: seedPhraseError } = await supabase
      .from("seed")
      .select("*")
      .limit(1)
      .single();

    if (seedPhraseError)
      console.log("had error with seedPhrase: ", seedPhraseError);

    console.log("creating image with these prompts:");
    console.log(createPrompt(seedPhrase, topwords));

    const { error: newSeedError } = await supabase
      .from("seed")
      .update({ phrase: getRandomSeedPhrase() })
      .eq("id", 1);

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: Deno.env.get("RUNPOD_API_KEY"),
      },
      body: JSON.stringify({
        input: {
          prompt: createPrompt(seedPhrase, topwords),

          negative_prompt:
            "child, childish, young, worst quality, low quality, lowres, monochrome, greyscale, multiple views, comic, sketch, watermark, plain background",
          width: 576,
          height: 768,
          guidance_scale: 8,
          num_inference_steps: 40,
          num_outputs: 1,
          prompt_strength: 0.7,
          scheduler: "PNDM",
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
      top_words: createPrompt(seedPhrase, topwords).split(","),
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
