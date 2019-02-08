/**
 * Changes the navigation tab
 * @param [object] el HTML element
 */
function changePage(el) {
  //Get page and determine if this is a double click
  var page = document.getElementById("page");
  if (page.innerHTML === el.innerHTML) {
    return;
  }

  page.id = page.innerHTML.toLowerCase();
  el.id = "page";

  if (el.innerHTML === "Utilities") {
    document.querySelector("#analysis-tab").style.display = "none";
    document.querySelector("#output-tab").style.display = "none";
    document.querySelector("#utilities-tab").style.display = "inherit";
  } else if (el.innerHTML === "Analysis") {
    document.querySelector("#analysis-tab").style.display = "inherit";
    document.querySelector("#output-tab").style.display = "none";
    document.querySelector("#utilities-tab").style.display = "none";
  }
}
