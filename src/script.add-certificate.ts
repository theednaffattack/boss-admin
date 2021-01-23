import { addCertificate } from "./add-certificate";

async function runAddCertificateCommand() {
    const secret = await addCertificate();
    console.log("VIEW RETURNED secret", secret);
}

runAddCertificateCommand();
