import { shortHash } from "./utils.js";
import { addRecord } from "./dao.js";
import { getLongLink } from "./dao.js";
import express, { type Request, type Response } from "express";
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

const app = express();
app.use(express.json()).use(express.static(publicDir));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, "index.html"));
});

app.post("/api/new/", async (req: Request, res: Response) => {
    const longLink = req.body.original_link;
    const shortLink = shortHash(longLink);
    await addRecord(longLink, shortLink);
    res.send(shortLink);
})

app.get("/api/:id", async (req: Request, res: Response) => {
    const shortLink = req.params.id;
    if (typeof shortLink !== "string") {
        throwError(res);
        return;
    }
    const longLink = await getLongLink(shortLink);
    if (typeof longLink !== "string") {
        throwError(res);
        return;
    }
    res.redirect(302, longLink);
})

app.all(/(.*)/, (req: Request, res: Response) => {
    throwError(res);
})

app.listen(3000, () => {
    console.log("Server Running")
})

function throwError(res: Response): void {
    res.status(404).sendFile(path.join(publicDir, "error.html"));
}