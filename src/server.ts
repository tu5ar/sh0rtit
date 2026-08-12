import express, { type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { handleNewRequest, handleRedirects, handleSignin, handleSuccessfulOauth, throwError } from "./server_handlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

const app = express();
app.use(express.json()).use(express.static(publicDir));

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, "login", "login-page.html"));
});

app.get("/oauth2/", (req: Request, res: Response) => {
    handleSignin(res);
})

app.get("/oauth2/success/", async (req: Request, res: Response) => {
    const responseCode = req.query.code as string;
    handleSuccessfulOauth(responseCode, res);
});

app.post("/api/new/", async (req: Request, res: Response) => {
    const longLink = req.body.original_link;
    handleNewRequest(longLink, res);
})

app.get("/api/:id", async (req: Request, res: Response) => {
    const shortLink = req.params.id as string;
    handleRedirects(shortLink, res);
})

app.all(/(.*)/, (req: Request, res: Response) => {
    throwError(res);
})

app.listen(3000, () => {
    console.log("Server Running");
})

