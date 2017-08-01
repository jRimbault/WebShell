    /**
     * @author:             jRimbault
     * @date:               2017-07-13
     * @last modified date: 2017-07-18
     *
     * @note: Interact with the DOM to draw the user prompt
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
