<?php
/**
 * == Window Builder ==
 * Cette section aborde la documentation de la bibliothèque Window Builder. 
 * Window Builder gère l'ensemble des fichiers de style CSS et templates nécessaire à la mise en page de la bibliothèque graphique Window.
 * 
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : package_window_css.php
 * * Version : 0.3
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 * #### Liste des corrections
 *
 * <div class="scrollpanel">
 *
 * <h5>Depuis 1.2</h5>
 *
 * <ul><li>Compression du fichier CSS renvoyé par le script PHP</li></ul>
 *
 * </div>
 *
 **/

/** section: Window Builder
 * class WR
 **/
class WR{
/**
 * WR.type -> css
 **/
	private static $type =			'css';
/**
 * WR.CompressCSS -> Boolean
 **/
	static $CompressCSS = 			true;
/**
 * WR.PathTemplate -> String
 **/	
	static $PathTemplate =			'';	
/**
 * WR.PathTemplate -> String
 **/
	static $PathWindow =			'';	
/**
 * WR.Include -> String
 *
 * 
 **/
	static $Include = 				true;
	private static $Array = 		array();		
	private static $isPrintHeader = false;
		
	public static function Initialize(){
	
		include_once('class_pixel.php');
		include_once('class_css.php');
		include_once('class_object_mouse_state.php');
		include_once('class_button.php');
		include_once('class_table.php');
		include_once('class_form.php');
		include_once('class_calendar.php');
		include_once('class_window.php');
		include_once('class_global.php');
	}
/**
 * WR.PrintHeader([compress]) -> void
 * - compress (Boolean): Active la compression du code CSS retourné vers le navigateur.
 * 
 * Cette méthode génère l'entete HTTP du fichier CSS renvoyé vers le navigateur.
 **/
	public static function PrintHeader($compress=true){
		//
		@ob_end_clean();
		
		if($compress){
			ob_start(array('WR', 'Compress'));
		}else{
			ob_start("ob_gzhandler");	
		}
		
		@header("Content-type: text/".self::$type."; charset: UTF-8");
		@header("Cache-Control: must-revalidate");
		$off = 0; # Set to a reaonable value later, say 3600 (1 hr);
		$exp = "Expires: " . gmdate("D, d M Y H:i:s", time() + $off) . " GMT";
		@header($exp);
	}
/**
 * WR.CreateGlobal() -> void
 **/	
	final private static function CreateGlobal(){
		global $Global, $Window, $TaskBar, $MinWin, $Line, $Table, $Calendar, $Button, $Form;
		//
		// Global
		//
		$Global = 	new GlobalCss();
		//
		//Window
		//
		$Window = 	$Global->window;
		//
		// TaskBar
		//
		$TaskBar = 	$Global->taskbar;
		//
		// MinWin
		//
		$MinWin = 	$Global->minwin;
		//
		// Line
		//
		$Line =		$Global->row;
		//
		// Table
		//
		$Table = 	$Global->table;
		//
		// Calendar
		//
		$Calendar = $Global->calendar;
		//
		// Button
		//
		$Button = 	$Global->button;
		//
		// Form
		//
		$Form = 	$Global->form;	
	}
/**
 * WR.ParseXML(link) -> void
 * - name (String): Nom du dossier du template à inclure.
 *
 * Cette méthode importe une template.
 **/	
	final static function ParseXML($pathname){
		global $Global, $Window, $TaskBar, $MinWin, $Line, $Table, $Button, $Calendar, $Form;
				
		self::CreateGlobal();
		
		if(file_exists($pathname.'/style.xml')){
			$Global->ParseXML($pathname.'/style.xml');
		}elseif(file_exists($pathname.'/style.xml.php')){
			include($pathname.'/style.xml.php');
		}
	}
/**
 * WR.ImportCSS(link) -> void
 * - name (String): Lien du fichier à importer.
 *
 * Cette méthode importe un fichier CSS.
 **/	
	final static function ImportCSS($link){
		global $Global, $Window, $TaskBar, $MinWin, $Line, $Table, $Button, $Calendar, $Form;
		include_once($link);
	}
	
	final static function ImportFragment($pathname){
		global $Global, $Window, $TaskBar, $MinWin, $Line, $Table, $Button, $Calendar, $Form;
		
		if($Global->import != '') include($pathname.'/'.$Global->import);
		
		echo "\n".@$Global->fragment;
	}
/**
 * WR.Compress(buffer) -> String
 **/
	final static function Compress($buffer){
		
		$buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer); // remove comments
		$buffer = str_replace(array("\r\n", "\r", "\n", "\t"), '', $buffer); // remove tabs, spaces, newlines, etc.
		$buffer = str_replace('{ ', '{', $buffer); // remove unnecessary spaces.
		$buffer = str_replace(' }', '}', $buffer);
		$buffer = str_replace('; ', ';', $buffer);
		$buffer = str_replace(', ', ',', $buffer);
		$buffer = str_replace(' {', '{', $buffer);
		$buffer = str_replace('} ', '}', $buffer);
		$buffer = str_replace(': ', ':', $buffer);
		$buffer = str_replace(' ,', ',', $buffer);
		$buffer = str_replace(' ;', ';', $buffer);
		$buffer = str_replace('<style>', '', $buffer);
		
		return $buffer;
	}
}

WR::Initialize();

?>
