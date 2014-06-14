<?php
/** section: Core
 * mixin CoreUI
 * includes BaseUI
 * 
 * Cette classe gère l'initialisation des actions de base du logiciel dont :
 *
 * * L'interception des requêtes AJAX, 
 * * La compilation de CSS, 
 * * Le lancement de la page du planning,
 * * Le lancement de BlogPress.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain | ANALEMME
 * * Fichier : abstract_coreui.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('CoreUI')):

require_once('abstract_baseui.php');

abstract class CoreUI extends BaseUI{
/**
 * CoreUI.Uri -> String
 **/
	public static $Uri = 		'';
/**
 * CoreUI.Name -> String
 **/
 	public static $Name = 		'system';
/**
 * CoreUI.ScriptLink -> Array
 **/
	protected static $ScriptSystem = array(
		'$path/core/interact.js',
		'$path/core/system.js',
		'$path/core/sidebar.js',
		'$path/core/opener.js',
		'$path/core/search.js',
		'$path/core/settings.js',
		'$path/core/user.js',
		'$path/core/role.js',
		'$path/core/directory.js',
		'$path/core/filemanager.js',
		'$path/core/notify.js',
		'$path/core/crashrepport.js',
		'$path/core/plugin.js',
		'$path/core/manuel.js',
		'$path/core/jpanel.js'
	);
/**
 * CoreUI.Script -> Array
 **/
	protected static $Script = 	array();
/**
 * CoreUI.Css -> Array
 **/
	protected static $Css = 		'';
/**
 * CoreUI.Create() -> void
 *
 * Cette méthode créée la page du planning.
 **/
	static function Create(){
		$uri = System::Path('uri');
		
		if(@!file_exists('themes/icons/16/')){
			$uri = 		'http://www.javalyss.fr/';
		}
		
		self::$Title = 	'Connexion :: ' . System::Meta('NAME_VERSION');
		self::EnqueueScript('system', self::$ScriptSystem);

		//self::ImportCSS($uri.'themes/icons/icons.css.php');

        self::ImportTemplate();
					
		self::$Header = 	new ElementNode('');
		self::$Body = 		new ElementNode('');
		
		self::EnqueueScript('prototype');
		
		if(User::IsConnect()){
			self::$Lang = strtolower(User::Meta('LANG') ? User::Meta('LANG') : System::Meta('LANG'));
		}else{
			self::$Lang = System::Meta('LANG');
		}
		
		self::EnqueueScript('extends', '', 'lang='.strtolower(CoreUI::$Lang));
		self::EnqueueScript('window');
		self::EnqueueScript('window.filemanager');
	}
/**
 * CoreUI.Header() -> void
 * Cette méthode créee l'entête du Blog.
 * fires planning:header
 *
 * Cette méthode construit l'entête de la page.
 **/	
	static public function Header(){
		global $PM;
		
		echo self::$Css."\n";
		
		self::DrawStdLib(self::$Script);
		
		System::Fire(self::$Name.':header');
		
		echo self::$Header;
	}
/**
 * CoreUI.EnqueueScript(scriptname [, src [, parameters]]) -> void
 * - scriptname (String): Nom du script tel que `jquery`, `prototype` etc...
 * - src (String): Lien du script à charger
 * - parameters (String): Paramètre à passer au script JS.
 * 
 * Cette méthode gère l'inclusion sans doublon des script Javascript vers le template.
 **/	
	static public function EnqueueScript($scriptname, $src = '', $parameters = ''){
		
		@self::$Script[$scriptname] = $src == '' ? self::$ScriptLink[$scriptname] : $src;
			
		if($parameters != ''){
			if(!preg_match('/\\?/', self::$Script[$scriptname])){
				self::$Script[$scriptname] .= '?'.$parameters;
			}else{
				self::$Script[$scriptname] .= "&".$parameters;
			}
		}
	}
	
	static public function RemoveScript($scriptname){
		unset(self::$Script[$scriptname]);
	}
/**
 * CoreUI.ImportCSS(src, media) -> void
 * - src (String): Lien du script css à importer.
 * - media (String): Média cible du script css.
 * 
 * Cette méthode permet d'importer un script CSS en vue d'être inséré dans l'entête du template.
 **/
	static public function ImportCSS($style, $media = 'screen'){
		self::$Css .= '<link type="text/css" rel="stylesheet" href="'.$style.'" media="'.$media.'" />'."\n\t\t";
	}
/**
 * CoreUI.ImportCompilableCSS(link) -> void
 * - link (String): Lien du script css à importer.
 * 
 * Cette méthode permet d'importer un script CSS qui devra être compilé et compressé avant d'être affiché dans l'entête du template.
 **/	
	static public function ImportCompilableCSS($link){
		self::$Css .= '<link type="text/css" rel="stylesheet" href="'.$style.'" media="'.$media.'" />'."\n\t\t";
	}
/**
 * CoreUI.CompileCSS() -> void
 * 
 * Cette méthode compile et compresse les fichiers CSS en fonction des paramètres du template.
 **/	
	static protected function CompileCSS(){
		$link = 		new Permalink();
		$parameters = 	$link->getParameters();
		$template = 	@$parameters[2] == 'default' ? 'system' :  $parameters[2];
		$type =			@$parameters[3];
		$compress =		false;
		$linkCSS = 		'';
		
		include(ABS_PATH . 'inc/lib/window/package_window.php');
		
		if(!(User::IsConnect() && System::Meta('MODE_DEBUG'))){
			$compress = true;
		}
		
		if(@$parameters[4] == 'minified'){
			$compress = true;
		}
		
		if($template == 'custom'){
			
			$stripPath = 	URI_PATH.'themes/compile/custom/' . $type . '/';
			$path = 		str_replace($stripPath, '', $link);
			$path =			ABS_PATH . str_replace(array('../plugins','minified'), array('plugins', ''), $path);
			
			WR::ParseXML($path);
			
		}else{
			$path = ABS_PATH . 'themes/'.$template.'/';
			WR::ParseXML($path);
		}
		
		ob_start();
		
		switch($type){
				
			case 'system':
				WR::ImportCSS(ABS_PATH.'themes/window/core/window.default.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.icon.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.admin.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.progress.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.widget.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.menu.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.user.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.filemanager.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.setting.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.jpanel.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.directory.css');
				WR::ImportCSS(ABS_PATH.'themes/system/system.notify.css');
				WR::ImportCSS(ABS_PATH.'themes/window/plugins/filemanager.css');
				WR::ImportFragment($path);
				break;
				
			case 'window':
				WR::ImportCSS(ABS_PATH . 'themes/window/core/window.default.css');
				WR::ImportFragment($path);
				break;
				
			case 'filemanager':
				WR::ImportCSS(ABS_PATH . 'themes/window/plugins/filemanager.css');
				break;
			case 'schedule':
				WR::ImportCSS(ABS_PATH . 'themes/window/plugins/schedule.css');
				break;
			case 'editor':
				WR::ImportCSS(ABS_PATH . 'themes/window/plugins/editor.css');
				break;
		}
		
		$str = ob_get_clean();
		
		WR::PrintHeader($compress);
		
		if($template == 'system'){
			echo str_replace(array(
				'system/images',
				'window/images',
				'icons/'				
			),
			array(
				URI_PATH . 'themes/system/images',
				URI_PATH . 'themes/window/images',
				URI_PATH . 'themes/icons/'
			), $str);
		}else{
			echo str_replace(array(
				'system/images',
				$template . '/images',
				'window/images',
				'icons/'
				
			),
			array(
				URI_PATH . 'themes/system/images',
				URI_PATH . 'themes/'.$template.'/images',
				URI_PATH . 'themes/window/images',
				URI_PATH . 'themes/icons/'
			), $str);
		}
		
		ob_flush();
	}
/**
 * CoreUI.ImportTemplate(src, media) -> void
 * - src (String): Lien du script css à importer.
 * - media (String): Média cible du script css.
 * 
 * Cette méthode permet d'importer un script CSS en vue d'être inséré dans l'entête du template.
 **/
	static public function ImportTemplate($template = NULL, $all = true){
		$mode = System::Meta('MODE_DEBUG');

        if($mode){
            self::ImportCSS(System::Path('uri').'themes/compile/default/system/');
        }else{
            self::ImportCSS(System::Path('uri').'themes/system.min.css');
        }
		/*if(strpos($template, '/') !== false){
			self::$Css .= '<link type="text/css" rel="stylesheet" href="'.System::Path('uri').'themes/compile/custom/system/'.$template.'" class="system-window-css" />'."\n\t\t";
		}else{

			if(empty($template)){
				$template = self::GetTemplateName();
			}

			self::$Css .= '<link type="text/css" rel="stylesheet" href="'.System::Path('uri').'themes/compile/'. $template .'/system/" class="system-window-css" />'."\n\t\t";
		}*/
		
	}
/**
 * CoreUI.Draw() -> void
 *
 * Cette méthode génére la page du planning.
 **/	
	static function Draw(){
				
		?>
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
        <title><?php echo self::$Title; ?></title>
        
        <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        
        <link rel="shortcut icon" href="<?php echo System::Path('uri'); ?>themes/system/images/favicon.ico" type="image/x-icon">
		<link rel="icon" href="<?php echo System::Path('uri'); ?>themes/system/images/favicon.ico" type="image/x-icon">
		
		<?php
			self::Header();
		?>
        
		</head>
		<body>
		<?php
        	echo self::$Body
		?>
        </body>
        </html>
		<?php
	}
/**
 * CoreUI.StartInterface() -> void
 *
 * Cette méthode lance le logiciel ainsi que les procédures suivantes :
 *
 * * Analyse de la requête AJAX si elle existe.
 * * Vérifie si la page demandée est bien celle du planning.
 * * Vérifie si la page demandée est un script de CSS.
 * * Vérifie si le logiciel à une MAJ en attente de configuration.
 * * Importe les extensions du logiciel.
 * * Donne la main aux extensions si aucune des procédures précédentes n'a intérrompue le lancement du logiciel.
 *
 **/	
	static function StartInterface(){
		
		//var_dump(class_exists('BlogPress'));
		//exit();
		//
		//vérification de la requête
		//
		if(System::IsAjaxRequest()){
			System::Ajax(System::AjaxType());
			return;
		}
		//
		//routine de mise à jour
		//
		
		System::Update();
		
		//
		// Detection Page d'administration
		//
		if(System::IsAdminPageRequest()){
			self::StartAdmin();
			return;
		}
		//
		// Detection des ressources CSS à compiler.
		//
		if(System::IsCompileCSSRequest()){
			self::CompileCSS();
			return;
		}

		Plugin::Import();
		
		System::fire('system:index');
		
		if(!System::IsStopEvent()){
			if(!User::IsConnect()){
				
				//lancement de la page de connexion
				if(!@include('themes/' . CoreUI::$Theme . '/index.php')){					
					include('themes/system/index.php');
				}
			}else{				
				header('Location:'.URI_PATH.'admin/');
			}
		}
		
	}
	
	static public function Start(){
		if(file_exists(System::Path('self').'index_admin.php')){
			@Stream::Delete(System::Path('self').'index_admin.php');
			@Stream::Delete(System::Path('self').'gateway.php');
			@Stream::Delete(System::Path('self').'gateway.safe.php');
		}
		
		self::StartAdmin();
	}
/**
 * CoreUI.StartAdmin() -> void
 *
 * Cette méthode lance l'interface d'administration.
 **/	
	static public function StartAdmin(){
					
		if(System::Update()){
			@header('Location:'.URI_PATH.'index_admin.php');
		}
		
		ob_start();
		
		//Récupération de la liste des plugins
		Plugin::Import();
		
		if(ob_get_length() >  0 && System::Meta('MODE_DEBUG')) {
			CoreUI::$Body = '<div class="system-ob-content"><div class="system-ob-wrap icon-stop-24"><h1>Une erreur est survenue</h1>' . ob_get_clean() . '</div></div>';
		}
		
		ob_end_clean();
		
		if(!User::IsConnect()){
			
			System::fire('system:connexion');
			
			if(!System::IsStopEvent()){
				//lancement de la page de connexion
				if(!@include('themes/' . System::Meta('DEFAULT_THEME') . '/index.php')){
					include('themes/system/index.php');
				}
			}
		}else{
						
			self::Create();
			//deprecated
			System::fire(self::$Name.':admin');
			//new event
			System::Fire(self::$Name.':startinterface');
			
			if(!System::IsStopEvent()){
				self::EnqueueScript('jquery');
				self::$Title = 	'Administration :: ' . System::Meta('NAME_VERSION');
				self::Draw();
			}
		}
	}	
}
endif;
?>