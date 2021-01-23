// import { Credentials } from "aws-sdk";
import { ACMClient, ImportCertificateCommand, ImportCertificateResponse, ACMClientConfig } from "@aws-sdk/client-acm";
import path from "path";
import fs from "fs";
import { CredentialsOptions } from "aws-sdk/lib/credentials";

export async function uploadCertificate(): Promise<ImportCertificateResponse> {
    let credentials: CredentialsOptions | undefined;

    if (process.env.SC_ADMIN_ACCESS_KEY_ID && process.env.SC_ADMIN_SECRET_ACCESS_KEY) {
        credentials = {
            accessKeyId: process.env.SC_ADMIN_ACCESS_KEY_ID,
            secretAccessKey: process.env.SC_ADMIN_SECRET_ACCESS_KEY,
        };
    }
    const clientManager = new ACMClient({
        apiVersion: process.env.API_VERSION,
        credentials,
        region: process.env.REGION,
    });

    const importCommand = new ImportCertificateCommand({
        Certificate: fs.readFileSync(path.resolve(__dirname, `../secret/cert.pem`)),
        PrivateKey: fs.readFileSync(path.resolve(__dirname, `../secret/key.pem`)),
        CertificateArn: "arn:aws:acm:us-east-1:942394920512:certificate/29d4eafd-1014-4d2a-a506-8466588fbde4",
        CertificateChain: fs.readFileSync(path.resolve(__dirname, `../secret/fullchain.pem`)),
        Tags: [{ Key: "operation", Value: "test" }],
    });

    try {
        return await clientManager.send(importCommand);
    } catch (importError) {
        console.warn("IMPORT ERROR", importError);
    }
    return { CertificateArn: undefined };
}
