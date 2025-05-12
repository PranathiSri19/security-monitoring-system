const express = require('express');
const rateLimit = require('express-rate-limit');
const os = require('os');
const si = require('systeminformation');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Dummy users for login
const users = { admin: "password123", user: "userpass" };

// Rate limiter for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Try again later.',
});

// --------------------- LOGIN SYSTEM ---------------------
app.post('/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        console.log(`✅ User '${username}' logged in.`);
        res.json({ message: 'Login successful!' });
    } else {
        console.warn(`❌ Failed login for user: '${username}'.`);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// ----------------- SYSTEM INFO ENDPOINT -----------------
app.get('/system-info', async (req, res) => {
    try {
        const cpu = await si.cpu();
        const mem = await si.mem();
        const disk = await si.fsSize();

        const systemInfo = {
            cpu: cpu.brand,
            cores: cpu.cores,
            speed: `${cpu.speed} GHz`,
            totalMemory: `${(mem.total / (1024 ** 3)).toFixed(2)} GB`,
            freeMemory: `${(mem.free / (1024 ** 3)).toFixed(2)} GB`,
            diskTotal: `${(disk[0].size / (1024 ** 3)).toFixed(2)} GB`,
            diskFree: `${(disk[0].available / (1024 ** 3)).toFixed(2)} GB`,
        };

        console.log('✅ System info retrieved.');
        res.json(systemInfo);
    } catch (error) {
        console.error('❌ Error fetching system info:', error);
        res.status(500).json({ error: 'Failed to fetch system information' });
    }
});

// ---------------- MONITORING FUNCTIONS -----------------
function monitorTraffic() {
    console.log("🚀 Monitoring network traffic...");
    exec("netstat -tn", (err, stdout) => {
        if (err) {
            console.error("❌ Error monitoring traffic:", err);
            return;
        }
        console.log("📡 Active network connections:\n", stdout);
    });
}

function detectPortScanning() {
    console.log("🚀 Detecting port scanning...");
    exec("netstat -an | grep SYN", (err, stdout) => {
        if (stdout) {
            console.warn("⚠️ Possible port scanning detected:\n", stdout);
        }
    });
}

function detectUnusualPorts() {
    console.log("🚀 Checking for unusual ports...");
    const commonPorts = [80, 443, 22, 21, 25, 3389, 3306];
    exec("netstat -tuln", (err, stdout) => {
        if (err) {
            console.error("❌ Error detecting ports:", err);
            return;
        }
        const lines = stdout.split("\n").slice(2);
        lines.forEach(line => {
            const match = line.match(/:(\d+)\s+/);
            if (match && !commonPorts.includes(parseInt(match[1]))) {
                console.warn(`⚠️ Unusual port detected: ${match[1]}`);
            }
        });
    });
}

function monitorCPUUsage() {
    console.log("🚀 Monitoring CPU usage...");
    setInterval(async () => {
        const load = await si.currentLoad();
        if (load.currentLoad > 80) {
            console.warn(`⚠️ High CPU usage detected: ${load.currentLoad.toFixed(2)}%`);
        }
    }, 5000);
}

function monitorARPSpoofing() {
    console.log("🚀 Monitoring ARP spoofing...");
    exec("arp -a", (err, stdout) => {
        if (err) {
            console.error("❌ Error checking ARP table:", err);
            return;
        }
        console.log("🔍 ARP Table:\n", stdout);
    });
}

// --------- START ALL MONITORING FUNCTIONS ----------
monitorTraffic();
detectPortScanning();
detectUnusualPorts();
monitorCPUUsage();
monitorARPSpoofing();

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
