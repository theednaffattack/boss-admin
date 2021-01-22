import { listsecret } from "./list-certificates";

async function runListCommand() {
    const secret = await listsecret();
    console.log("VIEW RETURNED secret", secret);
}

runListCommand();
