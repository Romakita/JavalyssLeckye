<?php
/**
 * Gestion dynamique des themes
$version = "0.2";
include_once(ABS_PATH.'inc/inc.php');

include_once('window/lib/class_window.php');
include_once('window/lib/class_pixel.php');

//$_SESSION['User'] = $user_string;
if(!@$_GET['preview']){

	$User =				User::Get();
	$Effect =			$User->getMeta('Effect');
	$ForeColor = 		new Pixel($User->getMeta('ForeColor'));
	$TextColor =		$User->getMeta('TextColor');
	$ForeColorOver =	new Pixel($User->getMeta('ForeColorOver'));
	$TextColorOver =	$User->getMeta('TextColorOver');	
}else{
	$ForeColor = 		new Pixel('#'.$_GET['ForeColor']);
	$TextColor =		'#'.$_GET['Text'];
	$ForeColorOver =	new Pixel('#'.$_GET['ForeColorOver']);
	$TextColorOver =	'#'.$_GET['TextOver'];
}
//création du dégradé
if($ForeColor->getGrey() < 100){
	$tmp = $ForeColor;
	$ForeColor = new Pixel('#FFFFFF');
	$ForeColor2 = $tmp;
	$ForeColor->average($ForeColor2, 30);
	
	$TextShadow = '0, 0, 0, 0.5';
}else{
	$ForeColor2 = new Pixel('#000000');
	
	$ForeColor2->average($ForeColor, 30);	
	$TextShadow = '255, 255, 255, 0.5';
}

if($ForeColorOver->getGrey() < 127){
	$tmp = $ForeColorOver;
	$ForeColorOver = new Pixel('#FFFFFF');
	$ForeColorOver2 = $tmp;
	$ForeColorOver->average($ForeColorOver2, 30);
	
	$TextShadowOver = '0, 0, 0, 0.5';
}else{
	$ForeColorOver2 = new Pixel('#000000');
	
	$ForeColorOver2->average($ForeColorOver, 30);	
	$TextShadowOver = '255, 255, 255, 0.5';
}
$BorderColor =		new Pixel($ForeColor2);
$BorderColorOver =	new Pixel($ForeColorOver2);
//$ForeColorMenu = 	new Pixel($ForeColor);

$BorderColor->toHSL();
$lum = 				$BorderColor->getLuminance() - ($Effect == 0 ? 50 : 70);
$BorderColor->setLuminance(max(array(0, $lum)));
$BorderColor = 		$BorderColor->toStringWeb();
//

$BorderColorOver->toHSL();
$lum = $BorderColorOver->getLuminance() - ($Effect == 0 ? 50 : 70);
$BorderColorOver->setLuminance(max(array(0, $lum)));
$BorderColorOver = 	$BorderColorOver->toStringWeb();

//Creation des Constant
define('GRADIENT_1', $Effect == 0 ? 'dynamic/images/gradient30.png' : 'dynamic/images/glass25.png');
define('GRADIENT_2', $Effect == 0 ? 'dynamic/images/gradient30.png' : 'dynamic/images/glass30.png');
define('GRADIENT_3', $Effect == 0 ? 'dynamic/images/gradient30.png' : 'dynamic/images/glass40.png');

define('COLOR', "".$TextColor);
define('FORE_COLOR', "".$ForeColor);
define('FORE_COLOR_2', "".$ForeColor2);
define('BORDER_COLOR', "".$BorderColor);
define('TEXT_SHADOW', "".$TextShadow);

define('FORE_COLOR_OVER_2', "".$ForeColorOver2);
define('FORE_COLOR_OVER', "".$ForeColorOver);
define('COLOR_OVER', "".$TextColorOver);
define('BORDER_COLOR_OVER', "".$BorderColorOver);
define('TEXT_SHADOW_OVER', "".$TextShadowOver);

$xml = Stream::Read(dirname(__FILE__).'/modele.xml');

$xml = str_replace('#GRADIENT_1', GRADIENT_1, $xml);
$xml = str_replace('#GRADIENT_2', GRADIENT_2, $xml);
$xml = str_replace('#GRADIENT_3', GRADIENT_2, $xml);

$xml = str_replace('#BORDER_COLOR_OVER', BORDER_COLOR_OVER, $xml);
$xml = str_replace('#FORE_COLOR_OVER_2', FORE_COLOR_OVER_2, $xml);
$xml = str_replace('#FORE_COLOR_OVER', BORDER_COLOR_OVER, $xml);
$xml = str_replace('#COLOR_OVER', COLOR_OVER, $xml);
$xml = str_replace('#TEXT_SHADOW_OVER', TEXT_SHADOW, $xml);

$xml = str_replace('#BORDER_COLOR', BORDER_COLOR, $xml);
$xml = str_replace('#FORE_COLOR_2', FORE_COLOR_2, $xml);
$xml = str_replace('#FORE_COLOR', FORE_COLOR, $xml);
$xml = str_replace('#COLOR', COLOR, $xml);
$xml = str_replace('#TEXT_SHADOW', TEXT_SHADOW, $xml);

$Global->ParseXML($xml);

?>