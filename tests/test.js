const Application = require("spectron").Application;
const path = require("path");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

/* Boilerplate start */
var electronPath = path.join(
	__dirname,
	"..",
	"node_modules",
	".bin",
	"electron"
);

if (process.platform === "win32") {
	electronPath += ".cmd";
}

var appPath = path.join(__dirname, "..");

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

describe("Terminal Check", function() {
	beforeEach(function() {
		return app.start();
	});

	afterEach(function() {
		return app.stop();
	});
});
