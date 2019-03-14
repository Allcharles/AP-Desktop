/**
 * Config File Object
 */
class ConfigFile {
  /**
   * Creates a config file object.
   * @param {int} id ID of the config file
   * @param {string} folder Full path to the file (C:/)
   * @param {string} filename File name (Towsey.Acoustic)
   * @param {string} extension File extension (.yml)
   */
  constructor(id, folder, filename, extension) {
    this.id = id;
    this.folder = folder;
    this.filename = filename;
    this.extension = extension;

    this.toString = function() {
      return this.folder + this.filename + this.extension;
    };
  }

  /**
   * Returns the file id
   */
  getID() {
    return this.id;
  }

  /**
   * Returns the files containing folder
   */
  getFolder() {
    return this.folder;
  }

  /**
   * Returns the full file path
   */
  getFilePath() {
    return this.folder + this.getFullFilename();
  }

  /**
   * Returns the filename exclusive of extension
   */
  getFilename() {
    return this.filename;
  }

  /**
   * Returns the filename inclusive of extension
   */
  getFullFilename() {
    return this.filename + this.extension;
  }

  /**
   * Returns the files extension
   */
  getExtension() {
    return this.extension;
  }

  /**
   * Returns the contents of the file
   */
  getContents() {
    return fs.readFileSync(this.folder + this.filename).toString();
  }
}
