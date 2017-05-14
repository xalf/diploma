<?php
	header("Content-type: image/jpeg");
	header("Content-Disposition: attachment; filename=im.jpg" );

	$im = imagecreate (1000, 660);
	$background_color = imagecolorallocate($im, 255, 255, 255);
	imageFilledRectangle($im,0,0,1000,660,$background_color);

	$post = json_decode($_GET["values"]);
	foreach ($post as $val) {
		$background_color = imagecolorallocate($im, $val->color->r, $val->color->g, $val->color->b);
		if($val->type === "rectangle")
			imageFilledRectangle($im, $val->x, $val->y, $val->x + $val->width, $val->y + $val->height, $background_color); 
		if($val->type === "circle")
			imagefilledellipse($im, $val->x+($val->width / 2), $val->y + ($val->height / 2), $val->width, $val->height, $background_color); 
		if($val->type === "triangle"){
			imagefilledpolygon($im, array($val->x, $val->y + $val->height, $val->x + ($val->width / 2), $val->y, $val->x + $val->width, $val->y + $val->height), 3, $background_color); 

		}
	}
	
	imagejpeg($im);
?>