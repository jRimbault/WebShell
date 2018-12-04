"use strict";

const $ = {
  el: s => document.querySelector(s),
  els: s => [].slice.call(document.querySelectorAll(s) || []),
  li: (s, f) => document.addEventListener(s, f),
  ce: s => document.createElement(s),
  classAdd: (o, c) => o.classList.add(c),
  classHas: (o, c) => o.classList.contains(c),
  classRemove: (o, c) => o.classList.remove(c),
  replaceNode: (o, n) => o.parentNode.replaceChild(n, o)
};

function replaceNode(oldNode, newNode) {
  oldNode.parentNode.replaceChild(newNode, oldNode);
}

function ajax(url, callback, data) {
  let params;
  const request = new XMLHttpRequest();
  request.open(data ? "POST" : "GET", url);
  request.onreadystatechange = function () {
    if (request.readyState > 3 && request.status === 200) {
      callback(JSON.parse(request.responseText));
    }
  };
  if (data) {
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    params =
      typeof data == "string" ?
      data :
      Object.keys(data)
      .map(k => {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      })
      .join("&");
  }
  request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  request.send(params);
  return request;
}

class Overlay {
  constructor() {
    this.overlay = $.el("#overlay");
    this.beep = new Audio(
      "data:audio/wav;base64,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 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
    );
  }
  visible() {
    this.overlay.style.visibility =
      this.overlay.style.visibility == "visible" ? "hidden" : "visible";
  }
  blink(m = 1) {
    this.beep.play();
    this.visible();
    setTimeout(this.visible, 20 * m);
  }
}

class History {
  constructor() {
    this.count = localStorage.length;
  }
  toStorage(value) {
    if (value == "") return;
    localStorage.setItem(localStorage.length, value);
    this.count = localStorage.length;
  }
  fromStorage(i, item) {
    if (i === -1 && this.count === -1) return "";
    if (i === 1 && this.count === localStorage.length) return "";
    return localStorage.getItem(this.counter(i));
  }
  counter(i) {
    this.count = this.count + i;
    if (this.count < 0) this.count = -1;
    if (this.count >= localStorage.length) this.count = localStorage.length;
    return this.count;
  }
  full() {
    let output = "\n";
    for (let i = 0; i < localStorage.length; i++) {
      output += i + 1 + "\t" + localStorage.getItem(i) + "\n";
    }
    return output;
  }
  erase() {
    localStorage.clear();
  }
}

class Prompt {
  constructor() {
    this.username = $.el("#username").innerHTML;
    this.hostname = $.el("#hostname").innerHTML;
    this.output = $.el("#output");
    this.buildPrompt();
    this.prompt();
    this.buildInput();
    this.input();
    $.li("keydown", this.focus);
  }
  buildPrompt() {
    const line = $.ce("span");
    line.setAttribute("class", "prompt");
    line.innerHTML = this.username + "@" + this.hostname;

    const dir = $.ce("span");
    dir.setAttribute("class", "dir");
    dir.innerHTML = "~";
    line.append(dir);

    this.line = line;
  }
  prompt() {
    this.output.append(this.line);
  }
  buildInput() {
    const input = $.ce("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "input");

    this.box = input;
  }
  input() {
    this.box.value = "";
    this.output.append(this.box);
  }
  focus() {
    $.el("#input").focus();
  }
  updatePrompt(value) {
    const input = $.el("#input");
    const text = $.ce("span");
    text.innerHTML = value;
    replaceNode(input, text);
    this.prompt();
    this.input();
  }
}

class Shell {
  constructor(prompt, history, overlay) {
    this.prompt = prompt;
    this.history = history;
    this.overlay = overlay;
    this.output = $.el("#output");
    this.setInput();
    this.bindMethods();
    $.li("keydown", this.keyboard);
  }
  bindMethods() {
    this.keyboard = this.keyboard.bind(this);
    this.builtins = this.builtins.bind(this);
    this.command = this.command.bind(this);
    this.print = this.print.bind(this);
    this.checkReturn = this.checkReturn.bind(this);
  }
  builtins() {
    switch (this.input.value) {
      case "":
        this.print("\n");
        break;
      case "clear":
        this.clear();
        break;
      case "history":
        this.printHistory();
        break;
      case "erase":
        this.eraseHistory();
        break;
      case "help":
        this.help();
        break;
      default:
        this.command();
        break;
    }
  }
  clear() {
    this.output.innerHTML = "";
    this.prompt.prompt();
    this.prompt.input();
    this.setInput();
    this.overlay.blink();
  }
  eraseHistory() {
    this.history.erase();
    this.print("\n");
  }
  printHistory() {
    this.print(this.history.full());
  }
  help() {
    const help = [
      "try `echo $PATH | sed 's/:/\\n/g'` to give you an idea of what you can do",
      "build-ins:",
      "    help     show this help",
      "    history  show your history",
      "    clear    clear the screen"
    ];
    this.print("\n" + help.join("\n") + "\n");
  }
  command() {
    ajax(window.location.href, this.checkReturn, {
      command: this.input.value
    });
    this.history.toStorage(this.input.value);
  }
  checkReturn(json) {
    if (json.status) this.overlay.blink();
    this.print(json.output);
  }
  print(text) {
    this.output.innerHTML += text;
    this.prompt.updatePrompt(this.input.value);
    this.setInput();
    window.scrollTo(0, document.body.scrollHeight);
  }
  setInput() {
    this.input = $.el("#input");
  }
  previousCommand() {
    this.input.value = this.history.fromStorage(-1, this.input.value);
  }
  nextCommand() {
    this.input.value = this.history.fromStorage(1, this.input.value);
  }
  empty() {
    if (this.input.value === "") this.overlay.blink();
  }
  keyboard(event) {
    let code = event.keyCode;
    switch (code) {
      case 38:
        event.preventDefault();
        this.previousCommand();
        break;
      case 40:
        event.preventDefault();
        this.nextCommand();
        break;
      case 13:
        event.preventDefault();
        this.builtins();
        break;
      case 8:
        this.empty();
        break;
      case 17:
        event.preventDefault();
        break;
      default:
        break;
    }
  }
}

const overlay = new Overlay();
const prompt = new Prompt();
const history = new History();
const shell = new Shell(prompt, history, overlay);
