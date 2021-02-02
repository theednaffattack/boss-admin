import PgBoss from "pg-boss";
import { listCertificates } from "./list-certificates";

export async function bossCertSubscription(): Promise<void> {
    if (process.env.DB_CONNECTION_STRING) {
        const boss = new PgBoss(process.env.DB_CONNECTION_STRING);

        boss.on("error", (error) => console.error(error));

        // start pg-boss
        try {
            await boss.start();
        } catch (startErr) {
            console.warn("PG BOSS START ERROR", startErr);
        }
        // assign a name to our queue
        const certQueue = "certificate-queue";

        // Schedule certificate checs daily.
        // Cron Explainer
        // minute | hour | day (o'month) | month | day (o'week)
        // Check at 3:00 p.m. on Saturday
        await boss.schedule(certQueue, "0 15 * * 6", { domain: "scapi.eddienaff.dev" });

        const jobId = await boss.publish(certQueue, { param1: "foo" });

        console.log(`created job in queue ${certQueue}: ${jobId}`);

        try {
            await boss.subscribe(certQueue, someAsyncJobHandler);
        } catch (subscribeErr) {
            console.warn("SUBSCRIBE ERROR", subscribeErr);
        }
    } else {
        throw new Error("Environment variable 'DB_CONNECTION_STRING' is missing!");
    }
}

async function someAsyncJobHandler(job: any): Promise<void> {
    console.log("VIEW JOB", job);
    console.log(`job ${job.id} received with data:`);
    console.log(JSON.stringify(job.data));

    await listCertificates();

    await doSomethingAsyncWithThis(job.data);
}

async function doSomethingAsyncWithThis(data: any): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 3000);
    });
}
