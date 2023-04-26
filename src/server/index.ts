import express from "express";
import * as path from "path";
const HOST = "0.0.0.0";
const PORT = +(process.env.PORT ?? 80);
const app = express();

app.use("/", express.static(path.resolve("./", "dist", "public")))

const server = app.listen(PORT, HOST, 50);
server.on("listening", () => {
    let addr = server.address()
    if (typeof addr !== "string") addr = (addr?.address ?? "") + ":" + (addr?.port?.toString());
    console.log(`Server listening at ${addr}.`);
})