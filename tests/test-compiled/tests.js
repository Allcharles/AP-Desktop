"use strict";

var _terminal = _interopRequireDefault(require("../../src/js-compiled/terminal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Application = require("spectron").Application;

var path = require("path");

var chai = require("chai");

var chaiAsPromised = require("chai-as-promised");
/* Boilerplate start */


var electronPath = path.join(__dirname, "../..", "node_modules", ".bin", "electron");

if (process.platform === "win32") {
  electronPath += ".cmd";
}

var appPath = path.join(__dirname, "../..");
var app = new Application({
  path: electronPath,
  args: [appPath]
});
global.before(function () {
  chai.should();
  chai.use(chaiAsPromised);
});
/* Boilerplate End */

describe("Terminal Check", function () {
  //Checks a terminal can be created
  it("Check no argument terminal", function () {
    var terminal = _terminal["default"].createTerminal("whoami");

    return terminal.spawnfile === "whoami";
  }); //Checks a terminal with a single argument can be created

  it("Check single arguement terminal", function () {
    var args = ["-option1"];

    var terminal = _terminal["default"].createTerminal("whoami", args);

    if (terminal.spawnfile !== "whoami") return false;

    for (var i = 0; i < args.length; i++) {
      if (terminal.spawnargs[i] !== args[i]) return false;
    }

    return true;
  }); //Checks a terminal with multiple arguements can be created

  it("Check multi arguement terminal", function () {
    var args = ["-option1", "-option2"];

    var terminal = _terminal["default"].createTerminal("whoami", args);

    if (terminal.spawnfile !== "whoami") return false;

    for (var i = 0; i < args.length; i++) {
      if (terminal.spawnargs[i] !== args[i]) return false;
    }

    return true;
  }); //Checks an AP specific command can be created

  it("Check single arguement AP command", function () {
    var AP_NAME = "AnaysisPrograms.exe";

    var terminal = _terminal["default"].createAPTerminal(["list"]);

    if (process.platform === "win32") {
      var command = terminal.spawnfile.substr(terminal.spawnfile.length - AP_NAME.length, AP_NAME.length);
      return command === AP_NAME && terminal.spawnargs.length === 1 && terminal.spawnargs[0] === "list";
    } else {
      var ap = terminal.spawnargs[0].substr(terminal.spawnfile.length - AP_NAME.length, AP_NAME.length);
      return terminal.spawnfile === "mono" && terminal.spawnargs.length === 2 && ap === AP_NAME && terminal.spawnargs[1] === "list";
    }
  }); //Checks an AP specific command with multiple arguements can be created

  it("Check multi arguement AP command", function () {
    var AP_NAME = "AnaysisPrograms.exe";
    var args = ["audio2csv", "help"];

    var terminal = _terminal["default"].createAPTerminal(args);

    if (process.platform === "win32") {
      var command = terminal.spawnfile.substr(terminal.spawnfile.length - AP_NAME.length, AP_NAME.length);
      return command === AP_NAME && terminal.spawnargs.length === args.length && terminal.spawnargs[0] === args[0] && terminal.spawnargs[1] === args[1];
    } else {
      var ap = terminal.spawnargs[0].substr(terminal.spawnfile.length - AP_NAME.length, AP_NAME.length);
      return terminal.spawnfile === "mono" && terminal.spawnargs.length === args.length + 1 && ap === AP_NAME && terminal.spawnargs[1] === args[0] && terminal.spawnargs[2] === args[1];
    }
  });
});
describe("AP Check", function () {
  it("Check Environment", function () {
    var terminal = _terminal["default"].createAPTerminal(["CheckEnvironment"]);

    terminal.on("error", function (err) {
      console.log(err);
      return false;
    }); //Check for valid environment

    terminal.stdout.on("data", function (data) {
      //Third message from terminal contains the success message
      var match = "SUCCESS - Valid environment"; //Check terminal output for successful environment

      if (data.includes(match)) {
        return true;
      }
    }); //If terminal close is given before finding valid environment, return false

    terminal.on("close", function (code) {
      return false;
    });
  });
});
describe("Basic Functionality", function () {
  this.timeout(5000);
  beforeEach(function () {
    return app.start();
  });
  afterEach(function () {
    return app.stop();
  }); //Checks initial window is opening correctly

  it("Check window opens", function () {
    return app.client.waitUntilWindowLoaded().getWindowCount().should.eventually.have.at.least(1);
  }); //Checks title of App if AP Desktop

  it("Check for correct title", function () {
    return app.client.waitUntilWindowLoaded().getTitle().should.eventually.equal("AP Desktop");
  }); //Check initial tab is the analysis tab

  it("Check initial tab is Analysis", function () {
    return app.client.waitUntilWindowLoaded().element("#page").innerHTML === "Analysis";
  }); //Check output tab is the middle tab and navigatable

  it("Check output tab navigation", function () {
    app.client.waitUntilWindowLoaded().element("#output").click();
    return app.client.waitUntilWindowLoaded().element("#page").innerHTML === "Output";
  }); //Check output tab is the middle tab and navigatable

  it("Check utilities tab navigation", function () {
    app.client.waitUntilWindowLoaded().element("#utilities").click();
    return app.client.waitUntilWindowLoaded().element("#page").innerHTML === "Utilities";
  });
});
describe("Analysis", function () {
  this.timeout(5000);
  beforeEach(function () {
    return app.start();
  });
  afterEach(function () {
    return app.stop();
  }); //Checks that the system has detected AP is installed correctly

  it("Analysis Loads", function () {
    return app.client.waitUntilWindowLoaded().waitForVisible("#AnalysisForm");
  }); //Check if audio2csv is selectable

  it("Audio2csv checkbox", function () {
    return app.client.waitUntilWindowLoaded().element("#audio2csv-label").click();
  }); // //Check if select audio files button exists
  // it("Audio2csv select audio files", () => {
  //   app.client
  //     .waitUntilWindowLoaded()
  //     .element("#audio2csv-label")
  //     .click();
  //   return app.client
  //     .waitForVisible("#audio-select-files")
  //     .element("#audio-select-files")
  //     .click();
  // });
  // //Check if select audio folder button exists
  // it("Audio2csv select audio folder", () => {
  //   app.client
  //     .waitUntilWindowLoaded()
  //     .element("#audio2csv-label")
  //     .click();
  //   return app.client
  //     .waitForVisible("#audio-select-folder")
  //     .element("#audio-select-folder")
  //     .click();
  // });
});
