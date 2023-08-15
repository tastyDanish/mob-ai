import { createClient } from "@supabase/supabase-js";
import { Database } from "./utils/db-types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient<Database>(url, key);
export default supabase;
