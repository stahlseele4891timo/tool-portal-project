// Lessons are plain data: edit or add entries here without touching the logic below.
// Each "criteria" test is a regular expression run against the student's prompt.
var LESSONS = [
  {
    title: "Give the AI a role",
    text: "Tell the AI who it should act as. A role focuses the answer on the right kind of expertise.",
    weak: "How do I handle delayed flights?",
    strong: "Act as an airport operations duty manager. Explain how to handle a two-hour delay on a full flight.",
    scenario: "Scenario: you want help deciding how to reassign gates after a late arrival. Write a prompt that gives the AI a role.",
    criteria: [
      { label: "States a role (e.g. \"Act as...\" or \"You are...\")", test: /\b(act as|you are|acting as|pretend (to be|you are)|as an?)\b/i, tip: "Start with \"Act as...\" or \"You are...\"." },
      { label: "Names an airport job (manager, planner, coordinator...)", test: /\b(manager|planner|coordinator|controller|analyst|supervisor|officer|director|dispatcher|operations)\b/i, tip: "Pick a specific job, such as \"airport operations planner\"." }
    ],
    model: "Act as an airport gate planning coordinator. Flight BA212 arrives 40 minutes late at Gate B4, where flight LH88 is due to board. Suggest how to reassign gates so both flights are affected as little as possible."
  },
  {
    title: "Add context",
    text: "Give the facts the AI cannot guess: numbers, places, and why you are asking.",
    weak: "Plan the baggage team for tomorrow.",
    strong: "We have 12 baggage handlers and 3 carousels. Tomorrow has 18 arrivals, with a peak between 8 and 10 am. Plan shifts so that no bag waits more than 20 minutes.",
    scenario: "Scenario: tomorrow's passenger numbers are higher than usual and you need a plan for check-in desks. Write a prompt with enough context.",
    criteria: [
      { label: "Includes specific numbers or times", test: /\d/, tip: "Add numbers such as staff counts, flights, or times." },
      { label: "Mentions airport details (terminal, gate, runway, flight, passengers...)", test: /\b(terminal|gate|runway|flights?|passengers?|baggage|check-?in|carousel|apron|security|airline)\b/i, tip: "Name the part of the airport involved." },
      { label: "Explains the goal (\"so that\", \"because\", \"to avoid\"...)", test: /\b(so that|because|in order to|goal|to avoid|to reduce|to keep|to make sure)\b/i, tip: "Say why you need it, for example \"so that queues stay under 10 minutes\"." }
    ],
    model: "Terminal 2 expects 4,500 departing passengers tomorrow, 30% more than usual, with a peak from 6 to 9 am. We have 14 check-in desks and 20 agents. Create a desk and shift plan so that queues stay under 15 minutes."
  },
  {
    title: "Make the task clear",
    text: "Ask for one clear action, using a verb such as list, compare, draft, or prioritize, and say who the answer is for.",
    weak: "Tell me about runway safety.",
    strong: "List five runway safety checks that ground staff should do before the first morning departure. Write them for new trainees.",
    scenario: "Scenario: you need a short notice for staff about a taxiway closure. Write a prompt that states the task clearly.",
    criteria: [
      { label: "Uses a clear action verb (list, draft, compare...)", test: /\b(list|draft|write|create|compare|summari[sz]e|recommend|explain|prioriti[sz]e|schedule|suggest|outline|plan)\b/i, tip: "Start with a verb: \"Draft...\", \"List...\", \"Compare...\"." },
      { label: "Says who it is for (staff, passengers, trainees...)", test: /\b(for (the |our |new )?(staff|team|passengers|trainees|students|managers|crew|airlines?)|audience|readers?)\b/i, tip: "Add \"for ground staff\" or \"for passengers\"." },
      { label: "Is specific enough (at least 12 words)", test: /^(\S+\s+){11,}\S+/, tip: "Add more detail about what you want." }
    ],
    model: "Draft a short notice for ground staff announcing that Taxiway C is closed from 22:00 to 05:00 for repairs. Explain which alternative route to use."
  },
  {
    title: "Set the format and limits",
    text: "Say how the answer should look and what to avoid. This saves you from rewriting long answers.",
    weak: "Summarize last week's delays.",
    strong: "Summarize last week's delays in a table with columns for flight, cause, and minutes late. Keep it under 150 words and do not include weekend flights.",
    scenario: "Scenario: you want a summary of security queue problems for a weekly meeting. Write a prompt that sets the format and a limit.",
    criteria: [
      { label: "Asks for a format (table, bullet list, steps, summary...)", test: /\b(table|bullets?|bulleted|list|numbered|steps|paragraphs?|checklist|json|columns?)\b/i, tip: "Say \"as a table\" or \"in bullet points\"." },
      { label: "Sets a length limit (e.g. \"under 100 words\")", test: /(\b\d+\s*(words|bullets?|items|steps|rows|sentences|lines)\b|\b(under|no more than|at most|maximum|max|within)\b)/i, tip: "Add a limit such as \"under 120 words\"." },
      { label: "Says what to avoid or include (\"do not\", \"only\"...)", test: /\b(do not|don't|avoid|only|must|without|exclude|include)\b/i, tip: "Add a rule such as \"do not include technical jargon\"." }
    ],
    model: "Summarize this week's security queue problems as a table with columns for day, peak wait in minutes, and cause. Keep it under 120 words and include only weekdays."
  }
];

var current = 0;

function byId(id) { return document.getElementById(id); }

function showLesson(index) {
  current = index;
  var lesson = LESSONS[index];
  byId("lesson-title").textContent = (index + 1) + ". " + lesson.title;
  byId("lesson-text").textContent = lesson.text;
  byId("weak").textContent = lesson.weak;
  byId("strong").textContent = lesson.strong;
  byId("scenario").textContent = lesson.scenario;
  byId("answer").value = "";
  byId("feedback").textContent = "";
  Array.prototype.forEach.call(byId("lesson-tabs").querySelectorAll("button"), function (tab, i) {
    if (i === index) tab.setAttribute("aria-current", "true");
    else tab.removeAttribute("aria-current");
  });
}

function checkPrompt() {
  var lesson = LESSONS[current];
  var text = byId("answer").value.trim();
  var box = byId("feedback");
  box.textContent = "";

  if (!text) {
    var warn = document.createElement("p");
    warn.textContent = "Write your prompt in the box first, then check it.";
    box.appendChild(warn);
    return;
  }

  var heading = document.createElement("h3");
  heading.textContent = "Your prompt looks like it includes:";
  var list = document.createElement("ul");
  var passed = 0;

  lesson.criteria.forEach(function (c) {
    var ok = c.test.test(text);
    if (ok) passed++;
    var item = document.createElement("li");
    var mark = document.createElement("span");
    mark.className = ok ? "pass" : "miss";
    mark.textContent = ok ? "Found: " : "Missing: ";
    item.append(mark, document.createTextNode(c.label));
    if (!ok) {
      var tip = document.createElement("div");
      tip.className = "hint";
      tip.textContent = "Tip: " + c.tip;
      item.appendChild(tip);
    }
    list.appendChild(item);
  });

  var summary = document.createElement("p");
  summary.textContent = passed === lesson.criteria.length
    ? "Nice work. Everything on the checklist is there. This check only looks for keywords, so also read your prompt and ask whether a colleague would understand it."
    : "You have " + passed + " of " + lesson.criteria.length + ". Add what is missing and check again.";

  var details = document.createElement("details");
  var sum = document.createElement("summary");
  sum.textContent = "Show an example answer";
  var model = document.createElement("p");
  model.textContent = lesson.model;
  details.append(sum, model);

  box.append(heading, list, summary, details);
}

document.addEventListener("DOMContentLoaded", function () {
  var tabs = byId("lesson-tabs");
  LESSONS.forEach(function (lesson, i) {
    var item = document.createElement("li");
    var button = document.createElement("button");
    button.type = "button";
    button.className = "secondary";
    button.textContent = lesson.title;
    button.addEventListener("click", function () { showLesson(i); });
    item.appendChild(button);
    tabs.appendChild(item);
  });
  byId("check").addEventListener("click", checkPrompt);
  showLesson(0);
});
