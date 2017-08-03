    /**
     * @author:             jRimbault
     * @date:               2017-07-13
     * @last modified date: 2017-07-18
     *
     * @note: common helper functions
     */
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
        let params
        let request = new XMLHttpRequest()

        request.open((data ? 'POST' : 'GET'), url)

        request.onreadystatechange = function() {
            if (request.readyState > 3 && request.status === 200) {
                callback(JSON.parse(request.responseText))
            }
        }

        if (data) {
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            params = typeof data == 'string' ? data : Object.keys(data).map((k) => {
                return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
            }).join('&');
        }

        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        request.send(params)

        return request
    }
