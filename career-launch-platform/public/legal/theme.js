/* Light / dark mode for the legal pages.
   Uses the same saved choice as the main site (localStorage "theme"), otherwise the device setting.
   Loaded in <head> before the stylesheet so the page never flashes the wrong mode. */
(function () {
  var KEY = "theme";
  var root = document.documentElement;

  function saved() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) {
      return null;
    }
  }
  function apply(dark) {
    root.classList.toggle("dark", dark);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      var label = dark ? "Switch to light mode" : "Switch to dark mode";
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    }
  }

  var media = window.matchMedia("(prefers-color-scheme: dark)");
  var choice = saved();
  apply(choice ? choice === "dark" : media.matches);

  document.addEventListener("DOMContentLoaded", function () {
    apply(root.classList.contains("dark")); // set the button label now that it exists
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var dark = !root.classList.contains("dark");
      try {
        localStorage.setItem(KEY, dark ? "dark" : "light");
      } catch (e) {}
      apply(dark);
    });
  });

  // Device setting changed and the visitor has not chosen for themselves → follow it.
  media.addEventListener("change", function (e) {
    if (!saved()) apply(e.matches);
  });
  // Changed in another tab → keep this tab in step.
  window.addEventListener("storage", function (e) {
    if (e.key === KEY && (e.newValue === "dark" || e.newValue === "light")) apply(e.newValue === "dark");
  });
})();
