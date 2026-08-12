import { type Response } from "express";
import { User } from "./user.js";
import path from "path";
import { fileURLToPath } from "url";
import { validateInput, shortHash } from "./utils.js";
import { addRecord, getLongLink } from "./dao.js";

const SUCCESS_AUTH_REDIRECT_LINK = "http://localhost:3000/oauth2/success/"
const GITHUB_CLIENT_ID = "Ov23livQotXvtbyB5IYr";
const GITHUB_AUTH_LINK = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${SUCCESS_AUTH_REDIRECT_LINK}&scope=user:email`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const errorDir = path.join(projectRoot, "public", "error");
const publicDir = path.join(projectRoot, "public");

export function handleSignin(res: Response) {
    res.sendFile(path.join(publicDir, "index", "index.html"));
    //res.redirect(GITHUB_AUTH_LINK);
}

export function handleSuccessfulOauth(code: string, res: Response) {
    try {
        const user = new User(code);
        res.sendFile(path.join(publicDir, "index", "index.html"));
    } catch (error) {
        throwError(res);
    }
}

export async function handleNewRequest(longLink: string, res: Response) {
    const parsedLink = validateInput(longLink);
    if (!parsedLink) {
        res.status(204).send();
    } else {
        const shortLink = shortHash(parsedLink);
        await addRecord(parsedLink, shortLink);
        res.send(shortLink);
    }
}

export async function handleRedirects(shortLink: string, res: Response) {
    const longLink = await getLongLink(shortLink);
    if (typeof longLink !== "string") {
        throwError(res);
        return;
    }
    res.redirect(302, longLink);
}
export function throwError(res: Response): void {
    res.status(404).sendFile(path.join(errorDir, "error.html"));
}