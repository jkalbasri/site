var commands = [{
    name: "clear",
    function: clearConsole
}];

var cursor = $('#cursor');
var terminal = $('#terminal');
var text = ["GLaDOS v1.09 (c) 1990 Aperture Science, Inc.\nWARN: This site is under construction\n$> ", ""];
var commandHistrory = [];
var lineY = 1;
var index = 0;
var historyIndex = 0;

setInterval(function () {
    cursor.toggleClass('invisible');
}, 500);

function clearConsole() {
    text = [];
    lineY = 0;
}

function printConsole(txt) {
    cursor.remove();
    terminal.html(text);
    terminal.append('<span id="cursor"></span>');
    cursor = $('#cursor');
}

function processCommand(rawData) {
    var args = rawData.split(" ");
    var command = args[0];
    commandHistrory[historyIndex] += rawData;
    args.shift();
    var unknownComand = true;
    for (var i = 0; i < commands.length; i++) {
        if (command === commands[i].name) {
            commands[i].function(args);
            unknownComand = false;
            break;
        }
    }
    if (unknownComand == true) {
        lineY++;
        text[lineY] = "\nsystem: command not found";
    }
    historyIndex++;
}

function nextLine() {
    processCommand(text[lineY]);
    if (lineY != 0) {
        lineY++;
        text[lineY] = "\n";
    }
    else
        text[lineY] = "";

    text[lineY] += "$> ";
    lineY++;
    text[lineY] = "";
    printConsole(text);
}

function erase(n) {
    text[lineY] = text[lineY].slice(0, -n);
    index--;
    printConsole(text);
}

$(document).ready(function () {
    printConsole(text)
})

$('html').on('keydown', function (e) {
    e = e || window.event;
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    // Backspace? Erase!
    if (keyCode === 8 && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (index != 0)
            erase(1);
    }
});

$(document).keypress(function (e) {
    // Make sure we get the right event
    e = e || window.event;
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    // Which key was pressed?
    switch (keyCode) {
        // ENTER
        case 13:
        {
            nextLine();
            break;
        }
        default:
        {
            var data = String.fromCharCode(keyCode);
            if (data != undefined) {
                var length = text[lineY].length;
                text[lineY] += data;
                index = index + (text[lineY].length - length);
                printConsole(text);
            }
          break;
        }
    }
});