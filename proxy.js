const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const minerListener = require('./lib/miner_listener.js');
const config = require('./config.json');

config.version = "0.1.5";

if (cluster.isMaster) {
    console.log(`VerusProxy v${config.version} by Darktron a fork of https://github.com/hellcatz/verusProxy`);

    let my_fork = function() {
        let worker = cluster.fork();
        worker.on('message', function(msg) {
            console.log('from worker:', msg);
        });
        return worker;
    };

    let numThreads = 1;
    if (config.threads && typeof config.threads === 'string') {
        if (config.threads.toLowerCase() === 'auto') {
            numThreads = totalCPUs;
        } else if (!isNaN(config.threads)) {
            numThreads = Math.min(Math.max(parseInt(config.threads, 10), 1), totalCPUs);
        }
    } else if (config.threads && typeof config.threads === 'number') {
        numThreads = Math.min(Math.max(config.threads, 1), totalCPUs);
    }

    console.log(`Using ${numThreads} out of ${totalCPUs} total threads`);

    for (let i = 0; i < numThreads; i++) {
        my_fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died, forking again`);
        my_fork();
    });

} else {
    process.on('message', function(msg) {
        console.log('from master:', msg);
    });

    if (!config.notifyTimeoutMs) {
        config.notifyTimeoutMs = 30000;
    }

    minerListener.createMiningListener(config);
}
