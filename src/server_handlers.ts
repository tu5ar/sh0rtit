import { type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { validateInput, FNV_1A} from "./utils.js";
import { addRecord, getLongLink } from "./dao.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const errorDir = path.join(projectRoot, "public", "error");
const publicDir = path.join(projectRoot, "public");

export function handleSignin(res: Response) {
    res.sendFile(path.join(publicDir, "index", "index.html"));
}

export async function handleNewRequest(longLink: string, res: Response) {
    const parsedLink = validateInput(longLink);
    if (!parsedLink) {
        res.status(204).send();
    } else {
        const shortLink = FNV_1A(parsedLink);
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