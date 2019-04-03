import Terminal from "../../src/js-compiled/terminal.js";
const Application = require("spectron").Application;
const path = require("path");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

/* Boilerplate start */
var electronPath = path.join(
  __dirname,
  "../..",
  "node_modules",
  ".bin",
  "electron"
);

if (process.platform === "win32") {
  electronPath += ".cmd";
}

var appPath = path.join(__dirname, "../..");

var app = new Application({
  path: electronPath,
  args: [appPath]
});

global.before(function() {
  chai.should();
  chai.use(chaiAsPromised);
});
/* Boilerplate End */

describe("Basic Functionality", function() {
  this.timeout(5000);
  beforeEach(function() {
    return app.start();
  });

  afterEach(function() {
    return app.stop();
  });

  //Checks initial window is opening correctly
  it("Check window opens", function() {
    return app.client
      .waitUntilWindowLoaded()
      .getWindowCount()
      .should.eventually.have.at.least(1);
  });

  //Checks title of App if AP Desktop
  it("Check for correct title", function() {
    return app.client
      .waitUntilWindowLoaded()
      .getTitle()
      .should.eventually.equal("AP Desktop");
  });

  //Check initial tab is the analysis tab
  it("Check initial tab is Analysis", function() {
    return (
      app.client.waitUntilWindowLoaded().element("#page").innerHTML ===
      "Analysis"
    );
  });

  //Check output tab is the middle tab and navigatable
  it("Check output tab navigation", function() {
    app.client
      .waitUntilWindowLoaded()
      .element("#output")
      .click();
    return (
      app.client.waitUntilWindowLoaded().element("#page").innerHTML === "Output"
    );
  });

  //Check output tab is the middle tab and navigatable
  it("Check utilities tab navigation", function() {
    app.client
      .waitUntilWindowLoaded()
      .element("#utilities")
      .click();
    return (
      app.client.waitUntilWindowLoaded().element("#page").innerHTML ===
      "Utilities"
    );
  });
});

describe("Terminal Check", () => {
  //Checks a terminal can be created
  it("Check no argument terminal", () => {
    let terminal = Terminal.createTerminal("whoami");
    return terminal.spawnfile === "whoami";
  });

  //Checks a terminal with a single argument can be created
  it("Check single arguement terminal", () => {
    let args = ["-option1"];
    let terminal = Terminal.createTerminal("whoami", args);

    if (terminal.spawnfile !== "whoami") return false;
    for (let i = 0; i < args.length; i++) {
      if (terminal.spawnargs[i] !== args[i]) return false;
    }
    return true;
  });

  //Checks a terminal with multiple arguements can be created
  it("Check multi arguement terminal", () => {
    let args = ["-option1", "-option2"];
    let terminal = Terminal.createTerminal("whoami", args);

    if (terminal.spawnfile !== "whoami") return false;
    for (let i = 0; i < args.length; i++) {
      if (terminal.spawnargs[i] !== args[i]) return false;
    }
    return true;
  });

  //Checks an AP specific command can be created
  it("Check single arguement AP command", () => {
    const AP_NAME = "AnaysisPrograms.exe";
    let terminal = Terminal.createAPTerminal(["list"]);

    if (process.platform === "win32") {
      let command = terminal.spawnfile.substr(
        terminal.spawnfile.length - AP_NAME.length,
        AP_NAME.length
      );
      return (
        command === AP_NAME &&
        terminal.spawnargs.length === 1 &&
        terminal.spawnargs[0] === "list"
      );
    } else {
      let ap = terminal.spawnargs[0].substr(
        terminal.spawnfile.length - AP_NAME.length,
        AP_NAME.length
      );
      return (
        terminal.spawnfile === "mono" &&
        terminal.spawnargs.length === 2 &&
        ap === AP_NAME &&
        terminal.spawnargs[1] === "list"
      );
    }
  });

  //Checks an AP specific command with multiple arguements can be created
  it("Check multi arguement AP command", () => {
    const AP_NAME = "AnaysisPrograms.exe";
    let args = ["audio2csv", "help"];
    let terminal = Terminal.createAPTerminal(args);

    if (process.platform === "win32") {
      let command = terminal.spawnfile.substr(
        terminal.spawnfile.length - AP_NAME.length,
        AP_NAME.length
      );
      return (
        command === AP_NAME &&
        terminal.spawnargs.length === args.length &&
        terminal.spawnargs[0] === args[0] &&
        terminal.spawnargs[1] === args[1]
      );
    } else {
      let ap = terminal.spawnargs[0].substr(
        terminal.spawnfile.length - AP_NAME.length,
        AP_NAME.length
      );
      return (
        terminal.spawnfile === "mono" &&
        terminal.spawnargs.length === args.length + 1 &&
        ap === AP_NAME &&
        terminal.spawnargs[1] === args[0] &&
        terminal.spawnargs[2] === args[1]
      );
    }
  });
});

describe("AP Check", () => {
  it("Check Environment", () => {
    let terminal = Terminal.createAPTerminal(["CheckEnvironment"]);

    terminal.on("error", function(err) {
      console.log(err);
      return false;
    });

    //Check for valid environment
    terminal.stdout.on("data", function(data) {
      //Third message from terminal contains the success message
      var match = "SUCCESS - Valid environment";

      //Check terminal output for successful environment
      if (data.includes(match)) {
        return true;
      }
    });

    //If terminal close is given before finding valid environment, return false
    terminal.on("close", function(code) {
      return false;
    });
  });
});
