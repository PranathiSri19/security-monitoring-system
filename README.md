# 🛡️ Security Monitoring System

The **Security Monitoring System** is a lightweight, cross-platform application designed to enhance system protection by continuously monitoring for threats and anomalies. It offers features similar to an Intrusion Detection System (IDS), providing real-time alerts, malware detection, and system status tracking in an intuitive and user-friendly interface.

## 🚀 Features

- 🔍 **Real-Time File & Process Monitoring**  
  Detects unauthorized file changes, suspicious processes, and system anomalies.

- 🦠 **Malware Scanning**  
  Scans uploaded or system files for potentially malicious patterns using static and heuristic analysis.

- ⚙️ **System Health & Update Check**  
  Monitors the status of system updates and alerts if critical updates are missing.

- 🔔 **Security Alerts Dashboard**  
  Displays categorized alerts (info, warning, critical) with recommended actions.

- 💾 **Log Tracking**  
  Maintains a local record of alerts, scans, and user responses for auditing purposes.

## 🧠 How It Works

1. **Initialization**: On launch, the system begins scanning for updates and initializing file watchers.
2. **Monitoring**: It checks selected directories, files, and system processes for suspicious behavior.
3. **Scanning**: Users can upload a file or select a directory for malware scanning.
4. **Alerting**: If a threat or abnormal activity is detected, a real-time alert is triggered.
5. **Logging**: All activities are logged for transparency and audit.

## 🧰 Technologies Used

- **Electron.js** – Cross-platform desktop framework
- **Node.js** – File system access, process management, and scanning logic
- **JavaScript/HTML/CSS** – User Interface and interactivity
- (Optional) APIs for advanced threat detection (VirusTotal, etc.)

