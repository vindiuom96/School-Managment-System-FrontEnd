<?php
	echo exec("git pull --force");
	echo exec("ng build --delete-output-path false");
?>
