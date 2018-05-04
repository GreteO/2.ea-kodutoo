<?php
// READ GET save.php?latest=true
if (isset($_GET['latest'])){
 echo file_get_contents('scoreData.txt');
}
// WRITE POST save.php 
// body sees json
if (isset($_POST['json'])){

  $arr = json_decode(file_get_contents('scoreData.txt'));
 
  array_push($arr, json_decode($_POST['json']));

  function cmp($a, $b)
  {
      return $a->score < $b->score;
  }
  
  usort($arr, "cmp");

  if(file_put_contents('scoreData.txt', json_encode($arr))){
    var_dump(json_decode($_POST['json']));
    //$gamePoints =  json_decode($_POST['json']);
    //echo $scoreInfo->text.' salvestati';
    //echo $gamePoints->points. 'salvestati';
  }
}
?>

