    /**
     * @author:             jRimbault
     * @date:               2017-07-13
     * @last modified date: 2017-07-18
     *
     * @note: Define the shell behavior
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
