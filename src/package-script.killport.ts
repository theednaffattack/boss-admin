import { killPort } from "./utilities.kill-port";

const port = process.env.VIRTUAL_PORT;

killPort(port, "tcp").then(console.log).catch(console.log);
