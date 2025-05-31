<?php
$ch = curl_init('https://www.googleapis.com/oauth2/v1/certs');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
$response = curl_exec($ch);

if(curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch);
} else {
    echo "Success:\n";
    var_dump(json_decode($response, true));
}

curl_close($ch);
?>