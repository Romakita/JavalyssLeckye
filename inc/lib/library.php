<?php
/** 
 * == Library ==
 * Cette section documente l'ensemble des classes standards des logiciels basés sur l'architecture Javalyss et PMO.
 **/
abstract class DynamicLoadLibrary{
	
	public static function Initialize(){
		
		spl_autoload_register(array('DynamicLoadLibrary', '__autoLoad'));
		
		//gestion des flux et fichiers
		require_once('stream/class_stream.php');
		//gestion sql
		require_once('sql/class_sql.php');
		//gestion des objets
		require_once('object/class_object_print.php');
		//gestion des formulaires Ajax et PHP
		require_once('form/class_frameworker.php');
		//gestion HTTP Request
		require_once('http/class_permalink.php');
		//gestion des modèles
		require_once('models/class_pluginmanager.php');
		require_once('models/class_templatesmanager.php');
        require_once('mui/class_multilingual.php');

	}
/*
 * Librairie incluse à la demande. 
 **/	
	public static function __autoLoad($class) {
		
		switch($class){
			case 'FPDF':
				if(!defined('FPDF_FONTPATH')){
					define('FPDF_FONTPATH', ABS_PATH."inc/lib/fpdf/font/");
				}
				
				require(ABS_PATH."inc/lib/fpdf/fpdf.php");
				break;
				
			case 'SiteMapXML':
				require_once('stream/class_sitemapxml.php');
				break;
			
			case 'Color':
				require_once('object/class_color.php');
				break;
			
			case 'Cron':
				require_once('cron/class_cron.php');
				break;
			
			case 'Mail':
				require_once('mail/class_mail.php');
				break;
				
			case 'TemplatesManager':
				require_once('models/class_templatesmanager.php');
				break;
				
			case 'vCalendar':
			case 'vEvent':
			case 'vAlarm':
			case 'vCard':
			case 'vTodo':
				require_once('vcal/class_vcalendar.php');
				break;
			//
			// Geolocation
			//
			case 'Geocode':
				require_once('geolocation/class_geocode.php');
				break;
				
			case 'GeoIP':
				require_once('geolocation/class_geoip.php');
				break;
			
			case 'GoogleMapAPI':
				require_once('geolocation/class_googlemap.php');
				break;
		}
	}
}

DynamicLoadLibrary::Initialize();

/** section: Library
 * class FPDF
 *
 * FPDF est une classe PHP qui permet de générer des fichiers PDF en pur PHP, c'est-à-dire sans utiliser la librairie PDFlib.
 *
 * Voir la documentation : <a href="http://www.fpdf.org/">http://www.fpdf.org/</a>
 **/

?>