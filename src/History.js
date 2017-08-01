    /**
     * @author:             jRimbault
     * @date:               2017-07-13
     * @last modified date: 2017-07-18
     *
     * @note: Interaction with the localStorage
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
