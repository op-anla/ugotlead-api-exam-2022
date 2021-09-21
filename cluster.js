// cluster.js
const cluster = require("cluster");
// const myCache = require("cluster-node-cache")(cluster);
const os = require("os");

if (cluster.isMaster) {
  let cpus = os.cpus().length / 2; //Change to const when prod
  cpus = 2; //Testing

  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
  require("./express/server");
}
