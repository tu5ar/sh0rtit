import { createClient } from "@supabase/supabase-js";
const supabaseURL = "https://fgzrvuqqusxvmszfxbrq.supabase.co";
const supabaseKey = "sb_publishable_zN7LIQuGisQvooBKMas2Zg_HizlMvDu";
const supabase = createClient(supabaseURL, supabaseKey);

const INSERT_ERROR_MSG = "Supabase - Insert Error";
const GET_ERROR_MSG = "Supabase - Get Error";

//add record
export async function addRecord(longLink: string, shortLink: string): Promise<number> {
    try {
        await supabase
            .from("main")
            .upsert({
                long_link: longLink,
                short_link: shortLink
            },
                {
                    onConflict: "long_link",
                    ignoreDuplicates: true
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

export async function addUser(userId: number): Promise<number> {
    try {
        await supabase
            .from("users")
            .upsert({
                userid: userId
            }
            );
        return 0;
    } catch (error) {
        console.log(INSERT_ERROR_MSG, error);
        return -1;
    }
}