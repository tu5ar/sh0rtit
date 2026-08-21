import express, { type Request, type Response } from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import { fileURLToPath } from "url";
import { handleNewRequest, handleRedirects, throwError } from "./server_handlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const SERVER_PORT = 3000;

const app = express();
app.use(express.json()).use(express.static(publicDir)).use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, "index", "index.html"));
});

app.post("/api/new/", async (req: Request, res: Response) => {
    const longLink = req.body.original_link;
    const sessionID = req.cookies.session_id;
    handleNewRequest(longLink, sessionID, res);
})

app.get("/api/:id", async (req: Request, res: Response) => {
    const shortLink = req.params.id as string;
    handleRedirects(shortLink, res);
})

app.all(/(.*)/, (req: Request, res: Response) => {
    throwError(res);
})

app.listen(SERVER_PORT, () => {
    console.log("Server Running");
})

