import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

//Supabase Configs
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const INSERT_ERROR_MSG = "Supabase - Insert Error";
const GET_ERROR_MSG = "Supabase - Get Error";

//DB Column Names
const COL_LONG_LINK = "long_link";
const COL_SHORT_LINK = "short_link";
const COL_SESSION_ID = "session_id";
const COL_CREATED_AT = "created_at";
const TABLE_MAIN = "main";

interface SessionLinks {
    long_link: string;
    short_link: string;
}

//add record
export async function addRecord(longLink: string, shortLink: string, sessionID: string): Promise<number> {
    try {
        await supabase
            .from(TABLE_MAIN)
            .upsert({
                [COL_LONG_LINK]: longLink,
                [COL_SHORT_LINK]: shortLink,
                [COL_SESSION_ID]: sessionID
            },
                {
                    onConflict: `${COL_LONG_LINK},${COL_SESSION_ID}`, ignoreDuplicates: true
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
            .from(TABLE_MAIN)
            .select(COL_LONG_LINK)
            .eq(COL_SHORT_LINK, shortLink)
            .maybeSingle();

        if (error) {
            throw error;
        }
        return data ? data.long_link : null;

    } catch (error) {
        console.log(GET_ERROR_MSG, error);
        return -1;
    }
}

//link pull on initial load
export async function initLinkPull(sessionID: string): Promise<SessionLinks[] | null> {
    try {
        const { data, error } = await supabase
            .from(TABLE_MAIN)
            .select(`${COL_SHORT_LINK},${COL_LONG_LINK}`)
            .eq(COL_SESSION_ID, sessionID)
            .order(COL_CREATED_AT, {
                ascending: false
            })
            .limit(10);

        if (error) {
            throw error;
        }
        return data || [];

    } catch (error) {
        console.log(GET_ERROR_MSG, error);
        return null;
    }
}
