<?php

if(!class_exists('BaseUI')):
/** section: Core
 * mixin BaseUI
 * 
 * Cette classe l'intégration des librairies JS et CSS dans les templates.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain | ANALEMME
 * * Fichier : abstract_baseui.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
abstract class BaseUI{
/**
 * BaseUI.ScriptLink -> Array
 *
 * Liste des listes liens des librairies JavaScript.
 **/	
	protected static $ScriptLink = array(
		'system' =>			'',
		'prototype' => 		'$path/prototype/prototype.1.7.1.js',
		'jquery' => 		'$path/jquery/jquery.min-1.9.js',
		'jquery.migrate' => '$path/jquery/jquery.migrate-1.1.1.js',
		'extends' => 		'$path/window/extends.min.js',
		'window' => 		'$path/window/window.min.js',
		
		'window.filemanager' => 		'$path/window/plugins/wfilemanager.js',
		'window.schedule' => 			'$path/window/plugins/schedule.js',
		'window.inputrecipient' => 		'$path/window/plugins/inputrecipient.js',
		'window.textareacompleter' => 	'$path/window/plugins/textareacompleter.js',
		'window.editor' => 				'$path/window/plugins/editor.js',
		
		'googlemap' => 		'http://maps.google.com/maps/api/js?sensor=false&language=fr',
		'googlecharts' => 	'https://www.google.com/jsapi',
		'jlightbox' => 		'$path/jquery/jquery.lightbox.min.js',
		'html5' 	=>		'$path/html5/html5.js',
		'canvas' 	=>		'$path/html5/canvas.js',
		'jquery.history' => '$path/jquery/jquery.history.js',
		
		'highcharts.adaptater' =>		'$path/highchartsjs/adapters/prototype-adapter.js',
		'highchartsjs' =>	'$path/highchartsjs/highcharts.js',
		'highstockjs' =>	'$path/highchartsjs/highstock.js',
		'hightcharts.exporting'=>'$path/highchartsjs/modules/exporting.js',
	);
/**
 * BaseUI.Lang -> String
 * Langue à utiliser pour l'interface.
 **/
	public static $Lang = 		LANG;
/**
 * BaseUI.Header -> Header
 **/
	public static $Header = 	'';
/**
 * BaseUI.Body -> String
 **/
	public static $Body = 		'';
/**
 * BaseUI.Theme -> String
 **/
	public static $Theme = 		DEFAULT_THEME;
/**
 * BaseUI.Title -> String
 **/
	public static $Title = 		'';
/**
 * BaseUI.Resolve(link) -> String
 * - link(String): Lien du script à résoudre.
 *
 * Cette méthode tente de résoudre le chemin d'un lien codé.
 **/
	static protected function Resolve($link){
		return str_replace(array('$path/'), array(System::Path('js', false)), $link);
	}
/**
 * BaseUI.GetTemplateName() -> String
 *
 * Cette méthode retourne le nom du template WindowJS à charger.
 **/
	static public function GetTemplateName(){

		if(User::IsConnect()){
			$template = @User::Meta('THEME');

			if(empty($template)){
				$template = System::Meta('DEFAULT_THEME');
			}
		}else{
			$template =	System::Meta('DEFAULT_THEME');
		}

		return $template;
	}
/**
 * BaseUI.DrawStdLib(lib) -> String
 * - lib (String): Nom de la libraire.
 *
 * Cette méthode charge les librairies standards javascript dans la page cible.
 **/
	static protected function DrawStdLib($lib){
		global $PM;
		
		$link = new Permalink();
		
		
		
		if(User::IsConnect() && System::Meta('MODE_DEBUG') && !$link->contains('admin/compress')){
			if(!empty($lib['extends'])){
				$lib['extends'] = '$path/window/extends.js?lang='.strtolower(CoreUI::$Lang);
			}
			
			if(!empty($lib['window'])){
				$lib['window'] = '$path/window/window.js';	
			}
		}
		
		//si on a scriptaculous qui est dans la file d'attente
		if(@$lib['prototype'] && @$lib['jquery']){
			?>
		<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), $lib['prototype']); ?>"></script>
		<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), $lib['jquery']); ?>"></script>
			<?php
			if(isset($lib['extends'])):
			?>
            
		<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), $lib['extends']); ?>"></script>
            <?php
			endif;
		}else{
			if(@$lib['prototype']){
				?>
			<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), $lib['prototype']); ?>"></script>
                <?php
			}
			if(@$lib['extends']){
				?>
                
		<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), $lib['extends']); ?>"></script>
                <?php
			}
			
			if(@$lib['jquery']){
				?>
			<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), $lib['jquery']); ?>"></script>
				<?php
			}
		}
		
		if(@$lib['window']){
			?>
        
		<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), $lib['window']); ?>"></script>
			<?php
		}
		
		if(!isset($lib['jquery']) && (isset($lib['highchartsjs']) || isset($lib['highstockjs']))){
				?>
		<script type="text/javascript" src="<?php echo str_replace('$path/', System::Path('js', false), self::$ScriptLink['highcharts.adaptater']); ?>"></script>
				<?php
		}
		
		if(!User::IsConnect()):
						?>
			<script src="<?php echo self::Resolve('$path/minsys.js'); ?>" type="text/javascript"></script>
            <script>
            
                MinSys.version =	'<?php echo System::Meta('CODE_VERSION'). System::Meta('CODE_SUBVERSION'); ?>';
                MinSys.PHPSESSID = 	'<?php echo session_id(); ?>';
                
                Object.extend(MinSys, '<?php echo addslashes(json_encode(System::getMetas())); ?>'.evalJSON());
                
                Extends.ready(function(){
                    try{
                        MinSys.startInterface();
                        if($_GET['action'] == 'disconnect') MinSys.disconnect();	
                    }catch(er){if(window['console']){console.log(er)}}
                });	
            </script>
                        <?php
		else://connecté
																	
			foreach($lib['system'] as $script):
							?>    
		<script src="<?php echo self::Resolve($script); ?>" type="text/javascript"></script><?php
			endforeach;
						
			self::DrawParameters();
			
		endif;
		
		$template = self::GetTemplateName();
		
		if(User::IsConnect()){
		foreach($lib as $key => $value){
			if(in_array($key, array('extends', 'jquery', 'prototype', 'window', 'system'))) continue;
			
			switch($key){
				
				case 'googlemap':
					?>
			<script type="text/javascript" src="<?php echo self::Resolve($lib[$key]); ?>"></script>
            <script src="<?php echo GoogleMapAPI::GetClustererPath() ?>" type="text/javascript"></script>
					<?php
					GoogleMapAPI::DrawClassJS();
					break;
				case 'canvas':
					?>
           	<!--[if IE]><script type="text/javascript" src="<?php echo self::Resolve($lib[$key]); ?>"></script><![endif]-->
					<?php
					break;
				case 'html5':
					?>
            <!--[if lt IE 9]>
    		<script type="text/javascript" src="<?php echo self::Resolve($lib[$key]); ?>" ></script>
    		<![endif]-->
                    <?php
					break;
				case 'window.schedule':
					?>
            <link type="text/css" rel="stylesheet" href="<?php echo System::Path('uri'); ?>themes/compile/<?php echo $template; ?>/schedule/" class="system-window-css" />
			<script type="text/javascript" src="<?php echo self::Resolve($lib[$key]); ?>"></script>
					<?php
					break;
				case 'window.editor':
					$o = trim($lib[$key]);
					if(!empty($o)):
					?>
            <link type="text/css" rel="stylesheet" href="<?php echo System::Path('uri'); ?>themes/compile/<?php echo $template; ?>/editor/" class="system-window-css" />
			<script type="text/javascript" src="<?php echo self::Resolve($lib[$key]); ?>"></script>
					<?php
					endif;
					break;
					
				default:
					?>
                    
			<script type="text/javascript" src="<?php echo self::Resolve($lib[$key]); ?>"></script>
					<?php
					break;
			}			
		}
		
		
		echo $PM->printCSS().$PM->printScript();
		
		}
	}
/**
 * BaseUI.DrawParameters() -> void
 *
 * Cette méthode écrit les paramètres JS nécéssaire à l'initialisation d'une page.
 **/
	static protected function DrawParameters(){
		
		$uri = '';
		if(@!file_exists('themes/icons/16/')){
			$uri = 		'http://www.javalyss.fr/';
		}
		
		?>
        
		<script>

            System.VERSION = System.version = 	'<?php echo System::Meta('CODE_VERSION') . System::Meta('CODE_SUBVERSION'); ?>';
            System.PHPSESSID = 					'<?php echo session_id(); ?>';
            //extension des clefs métas du système
            Object.extend(System, '<?php echo addslashes(json_encode(System::getMetas())); ?>'.evalJSON());
            
            //extension des clefs métas de l\'utilisateur courant
                        
            System.PATH_PUBLIC =			'<?php echo PATH_PUBLIC; ?>';
            System.PATH_PRIVATE =			'<?php echo PATH_PRIVATE; ?>';
            System.PATH_PLUGIN =			'<?php echo PATH_PLUGIN; ?>';
            System.PATH_THEME =				'<?php echo PATH_THEME; ?>';
            
            System.URI_PATH =				'<?php echo URI_PATH; ?>';
            System.Apc = 					<?php echo json_encode(extension_loaded('apc')); ?>;
            System.Curl = 					<?php echo json_encode(extension_loaded('curl')); ?>;
            System.Zip = 					<?php echo json_encode(extension_loaded('zip')); ?>;
            
            System.LoadedExtensions =		<?php echo json_encode(get_loaded_extensions()); ?>;
            
            //Stockage des paramètres de PHP
            System.PHP_VERSION =			'<?php echo phpversion(); ?>';
            System.UPLOAD_MAX_FILESIZE =	'<?php echo (str_replace('M', '', ini_get('upload_max_filesize')) * 1024 * 1024); ?>';
            System.MEMORY_LIMIT =			'<?php echo (str_replace('M', '', ini_get('memory_limit')) * 1024 * 1024); ?>';
			
			System.CRON_STARTED =			<?php echo json_encode(Cron::IsStarted()); ?>;
        </script>
        
        <?php
	}
}
endif;
?>