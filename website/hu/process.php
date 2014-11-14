<?php
//add the recipient's address here
$myemail = 'freisinger.adam@lathatatlanegyetem.hu';
 
//grab named inputs from html then post to #thanks
if (isset($_POST['name'])) {
$name = strip_tags($_POST['name']);
$email = strip_tags($_POST['email']);
$message = strip_tags($_POST['message']);
echo "A fejlesztési javaslatodat megkaptuk, köszönjük.";
 
//generate email and send!
$to = $myemail;
$email_subject = "Contact form submission: $name";
$email_body = " Here are the details:\n Name: $name \n ".
"Email: $email\n Message \n $message";
$headers = "From: $myemail\n";
$headers .= "Reply-To: $email";
mail($to,$email_subject,$email_body,$headers);
}
?>