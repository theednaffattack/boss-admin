import { addCertificate } from "./add-certificate";

async function runAddCertificateCommand() {
    const [arg] = process.argv.slice(2);

    return await addCertificate(arg);
}

runAddCertificateCommand();
