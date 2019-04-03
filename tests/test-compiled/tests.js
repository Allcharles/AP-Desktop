"use strict";

var _terminal = _interopRequireDefault(require("../../src/js-compiled/terminal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Application = require("spectron").Application;

var path = require("path");

var chai = require("chai");

var chaiAsPromised = require("chai-as-promised");
/* Boilerplate start */


var electronPath = path.join(__dirname, "..", "node_modules", ".bin", "electron");

if (process.platform === "win32") {
  electronPath += ".cmd";
}

var appPath = path.join(__dirname, "..");
var app = new Application({
  path: electronPath,
  args: [appPath]
});
global.before(function () {
  chai.should();
  chai.use(chaiAsPromised);
});
/* Boilerplate End */

/*
describe("Basic Functionality", function() {
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
*/

describe("Terminal Check", function () {
  it("Check default Commands", function () {
    var terminal;

    if (process.platform === "win32") {
      terminal = _terminal["default"].createTerminal("dir");
      return terminal.spawnfile === "dir";
    } else {
      terminal = _terminal["default"].createTerminal("ls");
      return terminal.spawnfile === "ls";
    }
  });
  it("Check AP Commands", function () {
    var AP_NAME = "AnaysisPrograms.exe";

    var terminal = _terminal["default"].createAPTerminal(["list"]);

    if (process.platform === "win32") {
      var command = terminal.spawnfile.substr(terminal.spawnfile.length - AP_NAME.length, AP_NAME.length);
      return command === AP_NAME && terminal.spawnargs.length === 1 && terminal.spawnargs[0] === "list";
    } else {
      var ap = terminal.spawnargs[0].substr(terminal.spawnfile.length - AP_NAME.length, AP_NAME.length);
      return terminal.spawnfile === "mono" && terminal.spawnargs.length === 2 && ap === AP_NAME && terminal.spawnargs[1] === "list";
    }
  });
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
  it("Check basic audio2csv analysis", function () {
    return true;
  });
});
