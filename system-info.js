const { netstat } = require('node-netstat');
const os = require('os');

const TRAFFIC_THRESHOLD = 100; // MB per interval
const PORT_SCAN_THRESHOLD = 10; // Number of ports accessed per IP
const COMMON_PORTS = [80, 443, 22, 21, 25];

function sendData(mainWindow, message) {
    console.log(message); // ✅ Show logs in terminal
    mainWindow.webContents.send('update-monitoring', message); // ✅ Send data to index.html
}

// ✅ Monitor Network Traffic
function monitorTraffic(mainWindow) {
    let prevRx = 0, prevTx = 0;

    setInterval(() => {
        const networkInterfaces = os.networkInterfaces();
        let totalRx = 0, totalTx = 0;

        Object.values(networkInterfaces).forEach(ifaces => {
            ifaces.forEach(iface => {
                if (!iface.internal) {
                    totalRx += iface.rx_bytes || 0;
                    totalTx += iface.tx_bytes || 0;
                }
            });
        });

        const rxDiff = (totalRx - prevRx) / (1024 * 1024);
        const txDiff = (totalTx - prevTx) / (1024 * 1024);

        if (rxDiff > TRAFFIC_THRESHOLD || txDiff > TRAFFIC_THRESHOLD) {
            sendData(mainWindow, `[WARNING] Traffic Spike: Received ${rxDiff.toFixed(2)} MB, Sent ${txDiff.toFixed(2)} MB`);
        } else {
            sendData(mainWindow, `[INFO] Network Stable: Received ${rxDiff.toFixed(2)} MB, Sent ${txDiff.toFixed(2)} MB`);
        }

        prevRx = totalRx;
        prevTx = totalTx;
    }, 10000);
}

// ✅ Detect Port Scanning
function detectPortScanning(mainWindow) {
    const connections = {};

    netstat({ filter: { state: 'ESTABLISHED' } }, (data) => {
        const remoteIP = data.remote.address;
        if (!connections[remoteIP]) {
            connections[remoteIP] = new Set();
        }
        connections[remoteIP].add(data.remote.port);

        if (connections[remoteIP].size > PORT_SCAN_THRESHOLD) {
            sendData(mainWindow, `[ALERT] Possible Port Scan from IP: ${remoteIP}`);
        }
    });

    sendData(mainWindow, "[INFO] Port scanning detection started...");
}

// ✅ Detect Unusual Port Access
function detectUnusualPorts(mainWindow) {
    netstat({ filter: { state: 'LISTEN' } }, (data) => {
        if (!COMMON_PORTS.includes(data.local.port)) {
            sendData(mainWindow, `[ALERT] Unusual port open: ${data.local.port}`);
        }
    });

    sendData(mainWindow, "[INFO] Unusual port detection started...");
}

// ✅ Monitor CPU Usage
function monitorCPUUsage(mainWindow) {
    setInterval(() => {
        const load = os.loadavg()[0]; // 1-minute CPU load
        if (load > 2.5) {
            sendData(mainWindow, `[WARNING] High CPU Load: ${load.toFixed(2)}`);
        } else {
            sendData(mainWindow, `[INFO] CPU Usage Normal: ${load.toFixed(2)}`);
        }
    }, 5000);
}

// ✅ Monitor ARP Spoofing (Simulated)
function monitorARPSpoofing(mainWindow) {
    sendData(mainWindow, "[INFO] ARP Spoofing Detection is running... (Simulated)");
}

// Export functions
module.exports = { monitorTraffic, detectPortScanning, detectUnusualPorts, monitorCPUUsage, monitorARPSpoofing };
