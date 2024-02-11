const { spawnSync, spawn } = require("child_process");

process.on("SIGINT", function () {
    api.kill();
    front.kill();
    process.exit(1);
});

spawnSync("npm run build:api", { stdio: "inherit", shell: true });
spawnSync("npm run db:migrate:api", { stdio: "inherit", shell: true });
const api = spawn("node apps/api/build/server.js", { stdio: "inherit", shell: true });
let front;
let closeFront = false;
api.on("close", (code) => {
    console.log(`API process exited with code ${code}`);
    try {
        front.kill();
        closeFront = true;
    } catch (e) {}
});
setTimeout(() => {
    if (closeFront) return;
    front = spawn("npm run build:front", { stdio: "inherit", shell: true });
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
}, 10000);
