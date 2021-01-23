import { addCertificate } from "./add-certificate";

async function runUploadCommand() {
    const secret = await addCertificate();
    console.log("VIEW RETURNED secret", secret);
}

runUploadCommand();
