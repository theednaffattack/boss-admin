import { ACMClient, ACMClientConfig, ImportCertificateCommand, ImportCertificateResponse } from "@aws-sdk/client-acm";
import fs from "fs";
import path from "path";

export type ACMConfigOptions = ACMClientConfig["credentials"];

export async function addCertificate(): Promise<ImportCertificateResponse> {
    let credentials: ACMConfigOptions;

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
