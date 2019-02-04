/**
 * Toggles visibility to the output image
 * @param el [Object] Title element
 */
function toggleImage(el) {
  var img = document.querySelector("#div" + el.id.substr(3));

  img.style.display === "none"
    ? (img.style.display = "inherit")
    : (img.style.display = "none");
}
