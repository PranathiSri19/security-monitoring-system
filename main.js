const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');
const {
    monitorTraffic,
    detectPortScanning,
    detectUnusualPorts,
    monitorCPUUsage,
    monitorARPSpoofing
} = require('./system-info');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // ✅ Remove CSP Warnings
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' 'unsafe-eval' data:"]
            }
        });
    });

    console.log("[SUCCESS] Electron app is running...");

    // ✅ Start Monitoring and Send Data to Renderer
    monitorTraffic(mainWindow);
    detectPortScanning(mainWindow);
    detectUnusualPorts(mainWindow);
    monitorCPUUsage(mainWindow);
    monitorARPSpoofing(mainWindow);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
