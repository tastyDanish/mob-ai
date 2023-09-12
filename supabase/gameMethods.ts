import supabase from "./supabase";
import { epochToTimestamp } from "../utils/dateUtils";

export const getLastCompletedGame = async () => {
  const currentTime = Math.floor(Date.now() / 1000);
  const { data, error } = await supabase
    .from("game")
    .select("*")
    .lt("end_time", epochToTimestamp(currentTime))
    .order("end_time", { ascending: false })
    .single();

  return data;
};

export const getLastGame = async () => {
  const currentTime = Math.floor(Date.now() / 1000);
  const { data, error } = await supabase
    .from("game")
    .select("*")
    .gt("end_time", epochToTimestamp(currentTime))
    .order("end_time", { ascending: false })
    .single();

  return data;
};

export const finishGame = async (
  top: string[],
  bottom: string[],
  url: string
) => {
  const { data: lastGame, error } = await supabase
    .from("game")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .single();
  console.log("here is error for last game get: ", error);
  console.log("getting last game: ", lastGame);
  if (lastGame) {
    console.log("saving game with top words: ", top.join(", "));
    const { error } = await supabase
      .from("game")
      .update({ top_words: top, bottom_words: bottom, img_url: url })
      .eq("id", lastGame.id);
    console.log("finish game error: ", error);
  } else {
    console.log("last game was null????");
  }
};
