const { spawnSync, spawn } = require("child_process");
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
    // const dbMigrateApi = spawnSync(`npm run db:migrate:api${useNgrok ? ":ngrok" : ""}`, { stdio: "inherit", shell: true });
    if (dbMigrateApi.status !== 0) {
        console.log("API database migration failed");
        process.exit(1);
    }
    const api = spawn(`npm run start:api${useNgrok ? ":ngrok" : ""}`, { stdio: "inherit", shell: true})
    let front;
    let admin;
    let close = false;
    api.on("close", (code) => {
        console.log(`API process exited with code ${code}`);
        try {
            front.kill();
            close = true;
        } catch (e) {}
        try {
            admin.kill();
            close = true;
        } catch (e) {}
    });
    if (close) return;
    console.log("Front build started");
    front = spawn("npm run build:front", { stdio: "inherit", shell: true });
    front.on("close", (code) => {
        console.log(`Front process exited with code ${code}`);
        if (code === 0) {
            console.log("Front build successful");
            if(close) return;
            console.log("Admin build started");
            admin = spawn(`npm run build:admin`, { stdio: "inherit", shell: true })
            admin.on("close", (code) => {
                console.log(`Admin process exited with code ${code}`);
                if (code === 0) {
                    console.log("Admin build successful");
                    spawnSync("npm run stop:api", { stdio: "inherit", shell: true });
                    process.exit(0);
                } else {
                    console.log("Admin build failed");
                    spawnSync("npm run stop:api", { stdio: "inherit", shell: true });
                    process.exit(1);
                }
            });
        } else {
            console.log("Front build failed");
            spawnSync("npm run stop:api", { stdio: "inherit", shell: true });
            process.exit(1);
        }
    });
})();
