import app from "./lib/app";
import http from "http";
import ws from "./lib/ws";

const httpServer = http.createServer(app);
ws.attach(httpServer);
httpServer.listen(8080, () => {
    console.log("sap-traffic-pilot server is now running at 8080.");
});
