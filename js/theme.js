(function () {
  var KEY = "theme";
  var root = document.documentElement;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.textContent = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  // Runs in <head>, so the saved theme is set before the page is drawn.
  apply(read() === "dark" ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) return;
    apply(root.getAttribute("data-theme"));
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* storage blocked: still works for this visit */ }
    });
  });
})();
