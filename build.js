const { spawnSync, spawn } = require("child_process");
const ngrok = require("ngrok");
const process = require("process");
const { program } = require("commander");

program
    .option("-n, --ngrok", "Use ngrok to expose the server to the internet", false)
    .parse(process.argv);
    
const { ngrok: useNgrok } = program.opts(process.argv.slice(2));

process.on("SIGINT", function () {
    api.kill();
    front.kill();
    process.exit(1);
});

const buildApi = spawnSync("npm run build:api", { stdio: "inherit", shell: true });
if (buildApi.status !== 0) {
    console.log("API build failed");
    process.exit(1);
}
(async () => {
    const env = await (async () => {
        if (useNgrok) {
            const ngrockForward = await ngrok.connect();
            return { APP_URL: ngrockForward };
        }
        return {};
    })()
    const dbMigrateApi = spawnSync("npm run db:migrate:api", { stdio: "inherit", shell: true, env: env });
    if (dbMigrateApi.status !== 0) {
        console.log("API database migration failed");
        process.exit(1);
    }
    const api = spawn(`node apps/api/build/server.js`, { stdio: "inherit", shell: true, env: env})
    let front;
    let closeFront = false;
    api.on("close", (code) => {
        console.log(`API process exited with code ${code}`);
        try {
            front.kill();
            closeFront = true;
        } catch (e) {}
    });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    if (closeFront) return;
    front = spawn("npm run build:front:admin", { stdio: "inherit", shell: true });
    front.on("close", (code) => {
        console.log(`Front process exited with code ${code}`);
        if (code === 0) {
            spawnSync("npm run stop:api", { stdio: "inherit", shell: true });
            process.exit(0);
        } else {
            console.log("Front build failed");
            spawnSync("npm run stop:api", { stdio: "inherit", shell: true });
            process.exit(1);
        }
    });
})();
