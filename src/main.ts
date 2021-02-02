import { server } from "./server";

// Try to catch any uncaught async errors.
process.on("uncaughtException", (err) => {
    console.error("There was an uncaught error", err);
    process.exit(1); //mandatory (as per the Node.js docs)
});

async function main() {
    console.log("MAIN FUNC STARTING");
    try {
        await server();
    } catch (serverInitErr) {
        console.warn("SERVER INIT ERROR", serverInitErr);
    }
}

main()
    .catch((mainErr) => console.log("ERROR EXECUTING MAIN FUNCTION", mainErr))
    .finally(() => console.log("MAIN MODULE PROCESS ENDING"));
