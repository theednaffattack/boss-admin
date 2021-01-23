import { listSecret } from "./list-certificates";

async function runListCommand() {
    const secret = await listSecret();
    console.log("VIEW RETURNED secret", secret);
}

runListCommand();
