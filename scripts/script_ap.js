/*
 * This script is designed to seperate windows and linux. This is because of a bug in the pwsh
 * node library which has unexpected results on windows.
 */

var exec = require("child_process").exec;
function puts(error, stdout, stderr) {
  console.log(stdout);
}

var os = require("os");

if (os.type() === "Linux") {
  console.log("Linux Detected. Downloading AP.");
  exec("npm run ap_download:linux", puts);
} else if (os.type() === "Darwin") {
  console.log("Macintosh Detected. Downloading AP.");
  exec("npm run ap_download:linux", puts);
} else if (os.type() === "Windows_NT") {
  console.log("Windows Detected. Downloading AP.");
  exec("npm run ap_download:windows", puts);
} else {
  throw new Error("Unsupported OS found: " + os.type());
}
