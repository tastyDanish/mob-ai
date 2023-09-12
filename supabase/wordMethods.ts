import supabase from "./supabase";

export const saveOrUpdateWord = async (word: string) => {
  try {
    const { count, error } = await supabase
      .from("words")
      .select("*", { count: "exact", head: true })
      .eq("word", word);
    if (count && count > 0) {
      const { data, error } = await supabase
        .from("words")
        .select("*")
        .eq("word", word)
        .limit(1)
        .single();
      if (data) {
        const { error } = await supabase
          .from("words")
          .update({ count: data.count + 1 })
          .eq("id", data.id);
      }
    } else {
      const { error } = await supabase
        .from("words")
        .insert({ word: word, count: 1 });
    }
  } catch (error) {
    console.error("Error saving or updating word:", error);
    throw error;
  }
};

export const getTopWords = async (limit: number) => {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .gt("count", 0)
    .order("count", { ascending: false })
    .limit(limit);
  return data!;
};

export const getBottomWords = async (limit: number) => {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .lt("count", 0)
    .order("count", { ascending: true })
    .limit(limit);
  return data!;
};

export const clearWords = async () => {
  try {
    const { error } = await supabase.from("words").delete().neq("id", -1);
    console.log("here is error for delete: ", error);
  } catch (error) {
    console.error("error deleteing words:", error);
  }
};
