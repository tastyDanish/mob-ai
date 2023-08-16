import { createClient } from "@supabase/supabase-js";
import { Database } from "./supa-types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

const supabase = createClient<Database>(url, key);

export default supabase;
