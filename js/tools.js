// To add a tool: create a folder under tools/ and add one entry here.
// A tool that opens inside the portal uses href "#<id>" and has a matching
// <section id="<id>" class="tool-view" hidden> in index.html.
var TOOLS = [
  {
    name: "AI Prompt Engineering Tutor",
    description: "Learn how to write clear AI prompts, using airport management scenarios. Read a short lesson, then try it yourself.",
    href: "tools/prompt-tutor/index.html"
  },
  {
    name: "Tool 1 \u2014 coming soon",
    description: "A placeholder showing how tools open and close in the portal.",
    href: "#tool-1"
  }
];

document.addEventListener("DOMContentLoaded", function () {
  var list = document.getElementById("tool-list");
  if (!list) return;
  TOOLS.forEach(function (tool) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.className = "card";
    link.href = tool.href;
    var title = document.createElement("h2");
    title.textContent = tool.name;
    var text = document.createElement("p");
    text.textContent = tool.description;
    link.append(title, text);
    item.appendChild(link);
    list.appendChild(item);
  });
});

// Portal navigation: show the tool view named in the URL (#tool-1), or the home view.
function showView() {
  var home = document.getElementById("home");
  if (!home) return;
  var target = document.getElementById(location.hash.slice(1));
  if (target && !target.classList.contains("tool-view")) target = null;
  Array.prototype.forEach.call(document.querySelectorAll(".tool-view"), function (view) {
    view.hidden = view !== target;
  });
  home.hidden = !!target;
  window.scrollTo(0, 0);
  if (target) target.querySelector("h1").focus();
}

window.addEventListener("hashchange", showView);
document.addEventListener("DOMContentLoaded", showView);
