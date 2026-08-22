import express, { type Request, type Response } from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import { fileURLToPath } from "url";
import { handleNewRequest, handleRedirects, handleInitPull, throwError } from "./server_handlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const SERVER_PORT = 3000;
const INDEX_FILE = "index.html";
const NEW_REQUEST_ENDPOINT = "/api/new/";
const REDIRECT_ENDPOINT = "/api/:id";
const INIT_ENDPOINT = "/init/";

const app = express();
app.use(express.json()).use(express.static(publicDir)).use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, "index", INDEX_FILE));
});

app.post(NEW_REQUEST_ENDPOINT, async (req: Request, res: Response) => {
    const longLink = req.body.original_link;
    const sessionID = req.cookies.session_id;
    handleNewRequest(longLink, sessionID, res);
})

app.get(REDIRECT_ENDPOINT, async (req: Request, res: Response) => {
    const shortLink = req.params.id as string;
    handleRedirects(shortLink, res);
})

app.get(INIT_ENDPOINT, async (req: Request, res: Response) => {
    const sessionID = req.cookies.session_id;
    handleInitPull(sessionID, res);
})

//catch all
app.all(/(.*)/, (req: Request, res: Response) => {
    throwError(res);
})

app.listen(SERVER_PORT, () => {
    console.log(`Server Running on port ${SERVER_PORT}`);
})

