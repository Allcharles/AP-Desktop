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

describe("Test Example", function() {
	beforeEach(function() {
		return app.start();
	});

	afterEach(function() {
		return app.stop();
	});

	it("Opens a Window", function() {
		return app.client
			.waitUntilWindowLoaded()
			.getWindowCount()
			.should.eventually.equal(1);
	});

	it("Tests the Title", function() {
		return app.client
			.waitUntilWindowLoaded()
			.getTitle()
			.should.eventually.equal("AP Desktop");
	});
});
