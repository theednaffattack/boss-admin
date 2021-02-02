import { listCertificates } from "./list-certificates";

async function runListCommand() {
    const secret = await listCertificates();
    console.log("VIEW RETURNED secret", secret);
}

runListCommand();
