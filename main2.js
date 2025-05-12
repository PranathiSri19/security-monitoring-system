import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { exec } from "child_process";
import psList from "ps-list";
import fs from "fs-extra";
import ApkParser from "apk-parser2";

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadFile("index.html");
});

ipcMain.on("start-scan", async (event) => {
  const memoryInfo = {
    total: (os.totalmem() / 1024 / 1024).toFixed(2),
    used: ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2),
    free: (os.freemem() / 1024 / 1024).toFixed(2)
  };

  const suspiciousConnections = await getSuspiciousConnections();
  event.sender.send("system-stats", { memoryInfo, suspiciousConnections });
});

async function getSuspiciousConnections() {
  return new Promise((resolve) => {
    exec("netstat -an", (error, stdout) => {
      if (error) return resolve([]);
      const connections = stdout.split("\n").filter((line) => /:[0-9]+/.test(line));
      resolve(connections);
    });
  });
}

ipcMain.handle("scan-apk", async (event, filePath) => {
  try {
    const parser = await ApkParser.readFile(filePath);
    const manifest = await parser.parseManifest();
    const permissions = manifest.usesPermissions.map(p => p.name);

    const dangerousPermissions = [
      "android.permission.INTERNET",
      "android.permission.READ_SMS",
      "android.permission.RECORD_AUDIO"
    ];
    
    const suspicious = permissions.filter(p => dangerousPermissions.includes(p));

    return {
      packageName: manifest.package,
      permissions,
      suspicious
    };
  } catch (error) {
    return { error: "Failed to analyze APK" };
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
