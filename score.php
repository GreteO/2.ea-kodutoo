<?php
// READ GET save.php?latest=true
if (isset($_GET['latest'])){
 echo file_get_contents('scoreData.txt');
}
// WRITE POST save.php 
// body sees json
if (isset($_POST['json'])){
  if(file_put_contents('scoreData.txt', $_POST['json'])){
    //$o =   json_decode($_POST['json']);
    $gamePoints =   json_decode($_POST['json']);
    //echo $o->text.' salvestati';
    echo $gamePoints->text. 'salvestati';
  }
}
?>

