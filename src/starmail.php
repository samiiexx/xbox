<?php
// StarMail - Copyright (c) 2020 StarBox Technologies

ob_start();

// Set Environment = 'prod', else, default = 'dev'
$environment = 'dev';

if ($environment === 'dev') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    ini_set('log_errors', 0);
    ini_set("error_log", "starmail.log");
} elseif ($environment === 'prod' || !isset($environment) || is_string($environment)) {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    ini_set('log_errors', 1);
    ini_set("error_log", "starmail.log");
}

// General Options
define('RECAPTCHA_SECRET_KEY', '6LfonBIaAAAAAAEQq2-AeVh9-mwIAD8CwhMyXl2V');
define('COMPANY_EMAIL', 'osita@starboxtech.com');
// define('COMPANY_EMAIL', 'derlexrenpower@yahoo.com');
define('WEBMAIL', 'webform@derlexrenpower.com');
define('WEBMASTER', 'StarMail');
define('COMPANY_WEBSITE', 'https://derlexrenpower.com');

// Message options
define('SUCCESS_MESSAGE', 'Thank you for getting in touch, we will respond to you as soon as possible.');
define('ERROR_MESSAGE', 'Failed to send your message, please try again later or contact us by another method.');
define('ERROR_REQUIRED_ALL', 'Please fill in all required fields.');
define('ERROR_EMAIL', 'Please provide a valid email address.');
define('ERROR_RECAPTCHA', 'Please make sure you check the security CAPTCHA box.');

// Style options
define('BRAND_COLOR', '#10a1fe');
define('TEXT_COLOR', '#121212');
define('EMAIL_BRAND', 'images/logo-full.png');

function recaptcha($userResponse)
{
    // Build API request url
    $apiRequestString = '';
    $apiRequest = array(
        'secret' => RECAPTCHA_SECRET_KEY,
        'response' => $userResponse,
    );
    foreach ($apiRequest as $key => $value) {
        $apiRequestString .= $key . '=' . $value . '&';
    }

    $apiRequestString = rtrim($apiRequestString, '&');

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
    curl_setopt($ch, CURLOPT_POST, count($apiRequest));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $apiRequest);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $apiResponse = curl_exec($ch);
    curl_close($ch);

    return json_decode($apiResponse, true);
}

function formatFields(array $fields)
{
    if (!empty($fields['lname']) && $fields['lname'] !== '') {
        $name = array('name' => $fields['fname'] . ' ' . $fields['lname']);
        unset($fields['fname']);
        unset($fields['lname']);
        $fields = $name + $fields;
    } else {
        $name = array('name' => $fields['fname']);
        unset($fields['fname']);
        unset($fields['lname']);
        $fields = $name + $fields;
    }

    if (empty($fields['company']) && $fields['company'] == '') {
        unset($fields['company']);
    }

    unset($fields['success']);
    unset($fields['error']);

    $fields = array_combine(
        array_map('ucfirst', array_keys($fields)),
        array_values($fields)
    );

    return $fields;
}

function mailer(array $fields)
{
    // Recipient
    $toEmail = COMPANY_EMAIL;

    // Subject
    $subject = 'You have a new inquiry from ' . formatFields($fields)['Name'];

    // Message
    $body = '
        <style>
        *{margin:0;padding:0;line-height:1;box-sizing:border-box}body{font-family:sans-serif;font-weight:400;width:100%;padding:50px 20px;font-size:16px;color:' . TEXT_COLOR . ';background-color:#f5f5f5}.brand-section{background-color:#fff;padding:50px}.brand-section img{width:350px;height:auto}.hero-section{background-color:#efefef;padding:50px}.welcome{font-size:64px;margin-bottom:15px;color:' . BRAND_COLOR . ';font-weight:700}.message-section{padding:20px 50px 30px;background-color:#fff}.field{width:100%;border-bottom:4px solid #efefef;margin:40px 0}.title{color:' . BRAND_COLOR . ';font-weight:700;margin-bottom:5px}.content{margin-bottom:10px;line-height:1.5}.footer{padding:10px;color:' . TEXT_COLOR . ';font-size:13px;text-align:center;line-height:1.5}.link{color:' . BRAND_COLOR . ';text-decoration:none}
        </style>
    ';

    $body .= '
        <body>
            <div class="main" style="width:600px;margin: 0 auto;">
                <div class="brand-section">
                    <img src="' . EMAIL_BRAND . '" alt="Logo" class="brand-logo">
                </div>
                <div class="hero-section">
                    <p class="welcome">Hello,</p>
                    <p class="subtext">You have a new inquiry from your website, <a class="link" href="' . COMPANY_WEBSITE . '">' . COMPANY_WEBSITE . '</a>.</p>
                </div>
                <div class="message-section">
    ';

    foreach (formatFields($fields) as $title => $content) {
        $body .= '
    <div class="field">
        <div class="title">' . $title . '</div>
        <div class="content">' . $content . '</div>
    </div>
    ';
    }

    $body .= '
                </div>
            </div>
            <div class="footer" style="width:600px;margin: 0 auto;">
                Copyright &copy ' . date('Y') . ' StarMail <br> Powered by <a href="https://starboxtech.com">StarBox Technologies Ltd.</a>
            </div>
        </body>
    ';

    // Headers
    $headers = 'From: ' . WEBMASTER . '<' . WEBMAIL . '>' . "\r\n";
    $headers .= 'Reply-To: ' . $fields['email'] . "\r\n";
    $headers .= 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";

    // Send mail
    return mail($toEmail, $subject, $body, $headers);
}

//
// Begin handler
//

// Init error messages
$errorMsg = '';

// Init response data
$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // FOR DEBUGGING
    // $fields = array(
    //     'fname' => 'Osita',
    //     'lname' => 'Ugwueze',
    //     'phone' => '09088483333',
    //     'company' => 'Coventry Uni',
    //     'email' => 'osita957@gmail.com',
    //     'message' => 'The code below ensures that all elements are sized in this more intuitive way.',
    // );

    // Get form data
    $fields = array(
        'fname' => filter_var(
            trim($_POST['fname']),
            FILTER_SANITIZE_STRING,
            FILTER_FLAG_STRIP_HIGH) ?? '',
        'lname' => filter_var(
            trim($_POST['lname']),
            FILTER_SANITIZE_STRING,
            FILTER_FLAG_STRIP_HIGH) ?? '',
        'email' => filter_var(
            trim($_POST['email']),
            FILTER_SANITIZE_STRING,
            FILTER_FLAG_STRIP_HIGH) ?? '',
        'phone' => filter_var(
            trim($_POST['phone']),
            FILTER_SANITIZE_STRING,
            FILTER_FLAG_STRIP_HIGH) ?? '',
        'company' => filter_var(
            trim($_POST['company']),
            FILTER_SANITIZE_STRING,
            FILTER_FLAG_STRIP_HIGH) ?? '',
        'message' => filter_var(
            trim($_POST['message']),
            FILTER_SANITIZE_STRING,
            FILTER_FLAG_STRIP_HIGH) ?? '',
    );

    $response = $fields;

    //
    // Validation
    //

    // reCAPTCHA Validate (Disable condition if not using reCAPTCHA)
    $clientResponse = recaptcha($_POST['g-recaptcha-response']);

    if ($clientResponse['success']) {

        // Check required fields
        if (
            (!empty($fields['fname']) && $fields['fname'] !== '') &&
            (!empty($fields['email']) && $fields['email'] !== '') &&
            (!empty($fields['phone']) && $fields['phone'] !== '') &&
            (!empty($fields['message']) && $fields['message'] !== '')
        ) {
            // Check valid email
            if (filter_var($fields['email'], FILTER_VALIDATE_EMAIL) !== false) {

                // Check send mail
                if (mailer($fields)) {
                    $response['success'] = SUCCESS_MESSAGE;
                } else {
                    $errorMsg .= ERROR_MESSAGE . '<br>';
                    $response['error'] = $errorMsg;
                }
            } else {
                $errorMsg .= ERROR_EMAIL . '<br>';
                $response['error'] = $errorMsg;
            }

        } else {
            $errorMsg .= ERROR_REQUIRED_ALL . '<br>';
            $response['error'] = $errorMsg;
        }

    } else {
        $errorMsg .= ERROR_RECAPTCHA . '<br>';
        $response['error'] = $errorMsg;
    }

}

ob_end_clean();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header('Content-type: application/json');
    exit(json_encode($response));
}
