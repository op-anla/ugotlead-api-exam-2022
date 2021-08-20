// cluster.js
const cluster = require("cluster");
var myCache = require("cluster-node-cache")(cluster);
const os = require("os");

if (cluster.isMaster) {
  const cpus = os.cpus().length / 2;

  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
  require("./express/server");
}
