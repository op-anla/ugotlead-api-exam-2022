// cluster.js
const cluster = require("cluster");
const os = require("os");
if (cluster.isMaster) {
  const cpus = os.cpus().length / 2; //Change to const when prod
  // cpus = 2; //Testing

  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  // SIGUSR2 received
  process.on("SIGUSR2", () => {
    console.log("Received SIGUSR2 from system");
  });
  // Right after the fork loop within the isMaster=true block
  cluster.on("exit", (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.id} crashed. ` + "Starting a new worker...");
      cluster.fork();
    }
  });
} else {
  require("./express/server");
}
