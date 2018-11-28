<?php
	echo exec("git pull --force");
	echo exec("ng build --delete-output-path false");
  echo exec("cd ..");
  echo exec("rm index.html");
?>
