// To add a tool: create a folder under tools/ and add one entry here.
var TOOLS = [
  {
    name: "AI Prompt Engineering Tutor",
    description: "Learn how to write clear AI prompts, using airport management scenarios. Read a short lesson, then try it yourself.",
    href: "tools/prompt-tutor/index.html"
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
