import express, { Response } from "express";
import * as path from "path";
const HOST = "0.0.0.0";
const PORT = +(process.env.PORT ?? 80);
const app = express();
let status = (res: Response, code: number, message: string) => { if (message.length > 0) res.statusMessage = message; res.status(code); res.end(); }
app.use("/", express.static(path.resolve("./", "dist", "public")))

let USERNAME = "borb"
let PASSWORD = "borb"

function genToken (user: string, pass: string): string {
    let token = "";
    token += Buffer.from(user).toString("base64");
    token += ".";
    token += Buffer.from(pass).toString("base64");
    token += ".";
    token += Buffer.from(Date.now().toString(10)).toString("base64");
    return token;
}

app.use(express.json());
app.post("/api/auth", (req, res, next) => {
    console.log(`Client is requesting authorization.`)
    //let data;
    //try { data = JSON.parse(req.body) } catch (e) { return res.send('{"message": "Invalid JSON."}'), status(res, 400, "Bad Request"); };
    if (!("user" in req.body) || !("password" in req.body)) return res.send('{"message": "Missing username or password."}'), status(res, 400, "Bad Request");
    let { user: username, password } = req.body;
    if (password != PASSWORD || username != USERNAME) return res.send('{"message": "Invalid username or password."}'), status(res, 403, "Unauthorized");
    console.log(`Sending token to user \`${username}\` with password \`${password}.\``)
    let token = genToken(username, password);
    res.send('{"token": "'+token+'"}');
    status(res, 200, "OK");
});

const server = app.listen(PORT, HOST, 50);
server.on("listening", () => {
    let addr = server.address()
    if (typeof addr !== "string") addr = (addr?.address ?? "") + ":" + (addr?.port?.toString());
    console.log(`Server listening at ${addr}.`);
})