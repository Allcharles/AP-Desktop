import Terminal from "../../src/js-compiled/terminal.js";
import * as Analysis from "../../src/js-compiled/analysis.js";
const Application = require("spectron").Application;
const path = require("path");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;

/** Use this to enable UI tests. Warning, this will take longer */
const ENABLE_UI_TESTS = true;

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
var apPath = `${appPath}/ap/AnalysisPrograms.exe`;
var IS_WINDOWS = process.platform === "win32";

var app = new Application({
  path: electronPath,
  args: [appPath]
});

global.before(function() {
  chai.should();
  chai.use(chaiAsPromised);
});
/* Boilerplate End */

describe("Terminal Class Check", () => {
  function testAPTerminal(testTerminal, args) {
    //Create dereferenced array
    let testArgs = [];
    args.map(arg => testArgs.push(arg));
    if (!IS_WINDOWS) {
      testArgs.unshift("mono");
    }

    //Create test terminal
    let terminal = Terminal.createTerminal(testArgs);
    return (
      assert.strictEqual(
        terminal.spawnfile,
        testTerminal.spawnfile,
        "Terminal not detecting OS correctly"
      ) &&
      assert.strictEqual(
        terminal.spawnargs,
        testTerminal.spawnargs,
        "Terminal arguements incorrect"
      )
    );
  }

  it("Terminal toString no arguments", () => {
    let terminal = require("child_process").spawn("whoami");
    return assert.strictEqual("whoami", Terminal.toString(terminal));
  });

  it("Terminal toString single argument", () => {
    let terminal = require("child_process").spawn("whoami", ["arg2"]);
    return assert.strictEqual("whoami arg2", Terminal.toString(terminal));
  });

  it("Terminal toString multi arguments", () => {
    let terminal = require("child_process").spawn("whoami", ["arg2", "arg3"]);
    return assert.strictEqual("whoami arg2 arg3", Terminal.toString(terminal));
  });

  //Checks terminal executable is set correctly
  it("Terminal executable set correctly", () => {
    let terminal = Terminal.createTerminal("whoami");
    return assert.strictEqual("whoami", Terminal.toString(terminal));
  });

  //Checks a terminal with a single argument can be created
  it("Check single arguement terminal", () => {
    let terminal = Terminal.createTerminal("whoami", ["--option1"]);
    return assert.strictEqual("whoami --option1", Terminal.toString(terminal));
  });

  //Checks a terminal with multiple arguements can be created
  it("Check multi arguement terminal", () => {
    let terminal = Terminal.createTerminal("whoami", [
      "--option1",
      "--option2"
    ]);
    return assert.strictEqual(
      "whoami --option1 --option2",
      Terminal.toString(terminal)
    );
  });

  //Checks an AP specific command can be created
  it("Check single arguement AP command", () => {
    let terminal = Terminal.createAPTerminal(["list"]);

    if (IS_WINDOWS) {
      return assert.strictEqual(`${apPath} list`, Terminal.toString(terminal));
    } else {
      return assert.strictEqual(
        `mono ${apPath} list`,
        Terminal.toString(terminal)
      );
    }
  });

  //Checks an AP specific command with multiple arguements can be created
  it("Check multi arguement AP command", () => {
    let terminal = Terminal.createAPTerminal(["audio2csv", "help"]);

    if (IS_WINDOWS) {
      return assert.strictEqual(
        `${apPath} audio2csv help`,
        Terminal.toString(terminal)
      );
    } else {
      return assert.strictEqual(
        `mono ${apPath} audio2csv help`,
        Terminal.toString(terminal)
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

describe("Analysis Classes Check", () => {
  //Check single value AnalysisOption
  it("Check single value AnalysisOption", () => {
    return assert.strictEqual(
      new Analysis.AnalysisOption("-p").toString(),
      "-p"
    );
  });

  //Check multi-value AnalysisOption
  it("Check multi-value AnalysisOption", () => {
    return assert.strictEqual(
      new Analysis.AnalysisOption("-p", "true").toString(),
      "-p=true"
    );
  });

  //Check multi-value unsanitised AnalysisOption
  it("Check multi-value unsanitised AnalysisOption", () => {
    return assert.strictEqual(
      new Analysis.AnalysisOption("-p", true).toString(),
      "-p=true"
    );
  });

  //Check basic AP commands are generating correctly
  it("Check basic APCommand", () => {
    let ap = new Analysis.APCommand("list");
    let ap_terminal = Terminal.createAPTerminal(["list"]);
    let analysis_terminal = ap.getTerminal();

    return (
      assert.strictEqual(ap_terminal.spawnfile, analysis_terminal.spawnfile) &&
      assert.strictEqual(ap_terminal.spawnfile, analysis_terminal.spawnfile)
    );
  });

  //Check AP command with a single arguement
  it("Check single arguement APCommand", () => {
    let ap = new Analysis.APCommand("list", ["--help"]);
    let ap_terminal = Terminal.createAPTerminal(["list", "--help"]);
    let analysis_terminal = ap.getTerminal();

    return (
      ap_terminal.spawnfile === analysis_terminal.spawnfile &&
      ap_terminal.spawnargs === analysis_terminal.spawnargs
    );
  });

  //Check AP command with multiple arguements
  it("Check multi arguement APCommand", () => {
    let ap = new Analysis.APCommand("list", [
      new Analysis.AnalysisOption("--op1"),
      new Analysis.AnalysisOption("--op2")
    ]);
    let ap_terminal = Terminal.createAPTerminal(["list", ["--op1", "--op2"]]);
    let analysis_terminal = ap.getTerminal();

    return (
      ap_terminal.spawnfile === analysis_terminal.spawnfile &&
      ap_terminal.spawnargs === analysis_terminal.spawnargs
    );
  });

  //Check basic AP analysis commands are generating correctly
  it("Check basic APAnalysis", () => {
    let ap = new Analysis.APAnalysis(
      "audio2csv",
      "source.wav",
      "config.yml",
      "output/"
    );
    let ap_terminal = Terminal.createAPTerminal([
      "audio2csv",
      "source.wav",
      "config.yml",
      "output/"
    ]);
    let analysis_terminal = ap.getTerminal();

    return (
      ap_terminal.spawnfile === analysis_terminal.spawnfile &&
      ap_terminal.spawnargs === analysis_terminal.spawnargs
    );
  });

  //Check AP analysis command with a single arguement
  it("Check single arguement APAnalysis", () => {
    let ap = new Analysis.APAnalysis(
      "audio2csv",
      "source.wav",
      "config.yml",
      "output/",
      [new Analysis.AnalysisOption("-p")]
    );
    let ap_terminal = Terminal.createAPTerminal([
      "audio2csv",
      "source.wav",
      "config.yml",
      "output/",
      "-p"
    ]);
    let analysis_terminal = ap.getTerminal();

    return (
      ap_terminal.spawnfile === analysis_terminal.spawnfile &&
      ap_terminal.spawnargs === analysis_terminal.spawnargs
    );
  });

  //Check AP analysis command with a single arguement
  it("Check multi-value flag arguement APAnalysis", () => {
    let ap = new Analysis.APAnalysis(
      "audio2csv",
      "source.wav",
      "config.yml",
      "output/",
      [new Analysis.AnalysisOption("-p", "true")]
    );
    let ap_terminal = Terminal.createAPTerminal([
      "audio2csv",
      "source.wav",
      "config.yml",
      "output/",
      new Analysis.AnalysisOption("-p", "true").toString()
    ]);
    let analysis_terminal = ap.getTerminal();

    return (
      ap_terminal.spawnfile === analysis_terminal.spawnfile &&
      ap_terminal.spawnargs === analysis_terminal.spawnargs
    );
  });

  //Check AP analysis command with multiple arguements
  it("Check multi arguement APAnalysis", () => {
    let ap = new Analysis.APAnalysis(
      "audio2csv",
      "source.wav",
      "config.yml",
      "output/",
      [new Analysis.AnalysisOption("-p"), new Analysis.AnalysisOption("-o")]
    );
    let ap_terminal = Terminal.createAPTerminal([
      "audio2csv",
      "source.wav",
      "config.yml",
      "output/",
      new Analysis.AnalysisOption("-p").toString(),
      new Analysis.AnalysisOption("-o").toString()
    ]);
    let analysis_terminal = ap.getTerminal();

    return (
      ap_terminal.spawnfile === analysis_terminal.spawnfile &&
      ap_terminal.spawnargs === analysis_terminal.spawnargs
    );
  });
});

if (ENABLE_UI_TESTS) {
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
      return app.client
        .waitUntilWindowLoaded()
        .element("#page")
        .innerHTML.should.eventually.equal("Analysis");
    });

    //Check output tab is the middle tab and navigatable
    it("Check output tab navigation", function() {
      app.client
        .waitUntilWindowLoaded()
        .element("#output")
        .click();
      return app.client
        .waitUntilWindowLoaded()
        .element("#page")
        .innerHTML.should.eventually.equal("Output");
    });

    //Check output tab is the middle tab and navigatable
    it("Check utilities tab navigation", function() {
      app.client
        .waitUntilWindowLoaded()
        .element("#utilities")
        .click();
      return app.client
        .waitUntilWindowLoaded()
        .element("#page")
        .innerHTML.should.eventually.equal("Utilities");
    });
  });
}

if (ENABLE_UI_TESTS) {
  describe("Analysis", function() {
    this.timeout(5000);
    beforeEach(function() {
      return app.start();
    });

    afterEach(function() {
      return app.stop();
    });

    //Checks that the system has detected AP is installed correctly
    it("Analysis Loads", () => {
      return app.client.waitUntilWindowLoaded().waitForVisible("#AnalysisForm");
    });

    //Check if audio2csv is selectable
    it("Audio2csv checkbox", () => {
      return app.client
        .waitUntilWindowLoaded()
        .element("#audio2csv-label")
        .click();
    });

    // //Check if select audio files button exists
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
}
