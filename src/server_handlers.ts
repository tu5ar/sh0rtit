import { type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { validateInput, FNV_1A } from "./utils.js";
import { addRecord, getLongLink, initLinkPull } from "./dao.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const errorDir = path.join(projectRoot, "public", "error");
const publicDir = path.join(projectRoot, "public");

const COL_SESSION_ID = "session_id";
const ERROR_FILE = "error.html";

//create new short link and update the DB and refresh page to update it
export async function handleNewRequest(longLink: string, sessionID: string | undefined, res: Response): Promise<void> {
    const parsedLink = validateInput(longLink);
    if (!parsedLink) {
        res.status(204).send();
    } else {
        //valid url
        const shortLink = FNV_1A(parsedLink);
        if (!sessionID) {
            sessionID = initCookie(res);
        }
        await addRecord(parsedLink, shortLink, sessionID);
        res.send(shortLink);
    }
}

export async function handleRedirects(shortLink: string, res: Response): Promise<void> {
    const longLink = await getLongLink(shortLink);
    if (typeof longLink !== "string") {
        throwError(res);
        return;
    }
    res.redirect(302, longLink);
}
export function throwError(res: Response): void {
    res.status(404).sendFile(path.join(errorDir, ERROR_FILE));
}

//set cookie on first run
function initCookie(res: Response): string {
    const cookieValidityDays = 30;
    const maxAge = cookieValidityDays * 24 * 60 * 60 * 1000;
    const sessionID = crypto.randomUUID();
    res.cookie(COL_SESSION_ID, sessionID, {
        maxAge,
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });
    return sessionID;
}

//session-based link pull
export async function handleInitPull(sessionID: string, res: Response): Promise<void> {
    const data = await initLinkPull(sessionID);
    if (!data) {
        res.status(401).end();
        return;
    }
    res.send(data);
}
