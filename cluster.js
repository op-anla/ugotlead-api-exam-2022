// cluster.js
const cluster = require("cluster");
var myCache = require("cluster-node-cache")(cluster);
const os = require("os");

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
  obj = { my: "Special", variable: 42 };
  myCache.set("myKey", obj).then(function (result) {
    console.log("err", result.err);
    console.log("success", result.success);
  });
  require("./express/server");
}
