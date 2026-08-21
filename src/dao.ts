import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const INSERT_ERROR_MSG = "Supabase - Insert Error";
const GET_ERROR_MSG = "Supabase - Get Error";

//add record
export async function addRecord(longLink: string, shortLink: string, sessionID: String): Promise<number> {
    try {
        await supabase
            .from("main")
            .upsert({
                long_link: longLink,
                short_link: shortLink,
                session_id: sessionID
            }, 
            {
                onConflict: "long_link, session_id", ignoreDuplicates: true
            }
            );
        return 0;
    } catch (error) {
        console.log(INSERT_ERROR_MSG, error);
        return -1;
    }
}

//get long link
export async function getLongLink(shortLink: string): Promise<string | number | null> {
    try {
        const { data, error } = await supabase
            .from("main")
            .select("long_link")
            .eq("short_link", shortLink)
            .maybeSingle();

        if (error) {
            throw error;
        }
        return data ? data.long_link : null; //can be str or null

    } catch (error) {
        console.log(GET_ERROR_MSG, error);
        return -1;
    }
}
