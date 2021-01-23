import PgBoss from "pg-boss";
import { listSecret } from "./list-certificates";

export const fake = "main";

export async function checkCertificates(): Promise<void> {
    if (process.env.DB_CONNECTION_STRING) {
        const boss = new PgBoss(process.env.DB_CONNECTION_STRING);

        boss.on("error", (error) => console.error(error));

        // start pg-boss
        try {
            await boss.start();
        } catch (startErr) {
            console.warn("PG BOSS START ERROR", startErr);
        }

        // schedule certificate checs daily
        boss.schedule;

        // assign a name to our queue
        const queue = "certificate-queue";

        const jobId = await boss.publish(queue, { param1: "foo" });

        console.log(`created job in queue ${queue}: ${jobId}`);

        try {
            await boss.subscribe(queue, someAsyncJobHandler);
        } catch (subscribeErr) {
            console.warn("SUBSCRIBE ERROR", subscribeErr);
        }
    } else {
        throw new Error("Environment variable 'DB_CONNECTION_STRING' is missing!");
    }
}

async function someAsyncJobHandler(job: any): Promise<void> {
    console.log(`job ${job.id} received with data:`);
    console.log(JSON.stringify(job.data));

    await listSecret();

    await doSomethingAsyncWithThis(job.data);
}

async function doSomethingAsyncWithThis(data: any): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 9000);
    });
}
