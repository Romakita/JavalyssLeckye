<?php
/**
 * Gestion dynamique des themes
$version = "0.2";
include_once(ABS_PATH.'inc/inc.php');

include_once('window/lib/class_window.php');
include_once('window/lib/class_pixel.php');

//$_SESSION['User'] = $user_string;
if(!User::IsConnect()){
	echo 'system.gateway.time.exceded';
	return;
}
$User = User::Get();
///instanciation
$Effect =			$User->getMeta('Effect');
$ForeColor = 		$User->getMeta('ForeColor');
$TextColor =		$User->getMeta('TextColor');
$ForeColorOver =	$User->getMeta('ForeColorOver');
$TextColorOver =	$User->getMeta('TextColorOver');
$BorderColor =		new Pixel($ForeColor);
$BorderColorOver =	new Pixel($ForeColorOver);
$ForeColorMenu = 	new Pixel($ForeColor);

//Creation de la couleur de bordure
//
//$BorderColorOver->toHSL();

$BorderColor->toHSL();
$lum = $BorderColor->getLuminance() - ($Effect == 0 ? 50 : 70);
$BorderColor->setLuminance(max(array(0, $lum)));
$BorderColor = 		$BorderColor->toStringWeb();

$BorderColorOver->toHSL();
$lum = $BorderColorOver->getLuminance() - ($Effect == 0 ? 50 : 70);
$BorderColorOver->setLuminance(max(array(0, $lum)));
$BorderColorOver = 	$BorderColorOver->toStringWeb();

//copie des valeurs
//
//Bordure principal
//
$Global->border->color = 		$BorderColor;
$Global->background->color = 	$ForeColor;

$Global->UpdateHeader();
//
// Entete
// 
$Global->header->color = 					$TextColor;
$Global->header->background->image =		$Effect == 0 ? 'dynamic/images/gradient30.png' : 'dynamic/images/glass25.png';

$Global->UpdateButton();
//
// Button
//
$Global->button->normal->color =					$TextColor;
$Global->button->normal->background->image =		$Effect == 0 ? 'dynamic/images/gradient30.png' : 'dynamic/images/glass25.png';
$Global->button->normal->background->position =		"top";
$Global->button->normal->background->color =		$ForeColor;

$Global->button->over->color =						$TextColorOver;
$Global->button->over->border->color = 				$BorderColorOver;
$Global->button->over->background->image =			'none';
$Global->button->over->background->position =		"bottom";
$Global->button->over->background->color = 			$ForeColorOver;
//
// Table
//
$Global->UpdateRow();

$Global->row->over->color = 						$TextColorOver;
$Global->row->over->background->color =				$ForeColorOver;
$Global->row->over->border->color =					$BorderColorOver;
$Global->row->over->background->image =				'none';
//
// Window
//
$Global->UpdateWindow();
$Global->window->background->image =				$Effect == 0 ? '' : 'dynamic/images/body-bg.png';
$Global->window->header->background->image =		$Effect == 0 ? 'dynamic/images/gradient30.png' : 'dynamic/images/glass30.png';
$Global->window->menu->rubbon->background->image =	'dynamic/images/gradient30.png';
//
// TaskBar
//
$Global->UpdateTaskBar();

$Global->taskbar->background->position =			'top';
$Global->taskbar->background->image = 				$Effect == 0 ? 'dynamic/images/gradient30.png' : 'dynamic/images/glass40.png';
$Global->taskbar->background->color =				$ForeColor;

$Global->UpdateProgress();
echo "ici";

?>