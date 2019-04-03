"use strict";

/**
 * Builds a html image element for images using absolute paths.
 * Currently this only supports .png files.
 * @param {HTMLElement} parent HTML element to insert the image into. Image will be appended to the bottom of the element.
 * @param {string} filePath Full path to the image
 * @param {string} id HTML id if required
 * @param {string} htmlClass HTML class if required
 * @param {string} style HTML styling if required
 * @param {string} alt HTML image alt if required
 */
function buildImageSync(parent, filePath, id, htmlClass, style, alt) {
  var fs = require("fs");

  var imgBase64 = fs.readFileSync(filePath).toString("base64");
  insertImage(parent, imgBase64, id, htmlClass, style, alt);
}
/**
 * Builds a html image element for images using absolute paths.
 * Currently this only supports .png files.
 * This runs asychronously.
 * @param {HTMLElement} parent HTML element to insert the image into. Image will be appended to the bottom of the element.
 * @param {string} filePath Full path to the image
 * @param {string} id HTML id if required
 * @param {string} htmlClass HTML class if required
 * @param {string} style HTML styling if required
 * @param {string} alt HTML image alt if required
 */


function buildImage(parent, filePath, id, htmlClass, style, alt) {
  var fs = require("fs");

  fs.readFile(filePath, function (err, data) {
    insertImage(parent, data.toString("base64"), id, htmlClass, style, alt);
  });
}
/**
 * Builds and inserts html image element.
 * Currently this only supports .png files.
 * WARNING: This is not meant for use outside the function buildImage.
 * @param {HTMLElement} parent HTML element to insert the image into. Image will be appended to the bottom of the element.
 * @param {string} filePath Full path to the image
 * @param {string} id HTML id if required
 * @param {string} htmlClass HTML class if required
 * @param {string} style HTML styling if required
 * @param {string} alt HTML image alt if required
 */


function insertImage(parent, imgBase64, id, htmlClass, style, alt) {
  var imgHtml = '<img id="' + id + '" class="' + htmlClass + '" style="' + style + '" alt="' + alt + '" src="data:image/png;base64,' + imgBase64 + '" />';
  parent.insertAdjacentHTML("beforeend", imgHtml);
}