import { uploadCertificate } from "./upload-certificate";

async function runUploadCommand() {
    const secret = await uploadCertificate();
    console.log("VIEW RETURNED secret", secret);
}

runUploadCommand();
