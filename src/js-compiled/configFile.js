"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Config File Object
 */
var ConfigFile =
/*#__PURE__*/
function () {
  /**
   * Creates a config file object.
   * @param {int} id ID of the config file
   * @param {string} folder Full path to the file (C:/)
   * @param {string} filename File name (Towsey.Acoustic)
   * @param {string} extension File extension (.yml)
   */
  function ConfigFile(id, folder, filename, extension) {
    _classCallCheck(this, ConfigFile);

    this.id = id;
    this.folder = folder;
    this.filename = filename;
    this.extension = extension;

    this.toString = function () {
      return this.folder + this.filename + this.extension;
    };
  }
  /**
   * Returns the file id
   */


  _createClass(ConfigFile, [{
    key: "getID",
    value: function getID() {
      return this.id;
    }
    /**
     * Returns the files containing folder
     */

  }, {
    key: "getFolder",
    value: function getFolder() {
      return this.folder;
    }
    /**
     * Returns the full file path
     */

  }, {
    key: "getFilePath",
    value: function getFilePath() {
      return this.folder + this.getFullFilename();
    }
    /**
     * Returns the filename exclusive of extension
     */

  }, {
    key: "getFilename",
    value: function getFilename() {
      return this.filename;
    }
    /**
     * Returns the filename inclusive of extension
     */

  }, {
    key: "getFullFilename",
    value: function getFullFilename() {
      return this.filename + this.extension;
    }
    /**
     * Returns the files extension
     */

  }, {
    key: "getExtension",
    value: function getExtension() {
      return this.extension;
    }
    /**
     * Returns the contents of the file
     */

  }, {
    key: "getContents",
    value: function getContents() {
      return fs.readFileSync(this.getFilePath()).toString();
    }
  }]);

  return ConfigFile;
}();