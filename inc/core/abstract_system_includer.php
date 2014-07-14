<?php
/** section: Core
 * mixin System.Includer
 * 
 * Cette classe gère l'inclusion de script CSS et Javascript dans un document.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain | ANALEMME
 * * Fichier : abstract_system_includer.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

namespace System;

if(!class_exists('Includer')):

abstract class Includer{
    /**
     * System.Includer.ScriptSystem -> Array
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

    protected static $ScriptLink = array(
        'system' =>			            '',
        'prototype' => 		            '$path/prototype/prototype.1.7.2.js',
        'jquery' => 		            '$path/jquery/jquery.min-1.9.js',
        'jquery.migrate' =>             '$path/jquery/jquery.migrate-1.1.1.js',
        'extends' => 		            '$path/window/extends.min.js',
        'window' => 		            '$path/window/window.min.js',
        'window.filemanager' => 		'$path/window/plugins/wfilemanager.js',
        'window.schedule' => 			'$path/window/plugins/schedule.js',
        'window.inputrecipient' => 		'$path/window/plugins/inputrecipient.js',
        'window.textareacompleter' => 	'$path/window/plugins/textareacompleter.js',
        'window.editor' => 				'$path/window/plugins/editor.js',

        'googlemap' => 		            'http://maps.google.com/maps/api/js?sensor=false&language=fr',
        'googlecharts' => 	            'https://www.google.com/jsapi',
        'jlightbox' => 		            '$path/jquery/jquery.lightbox.min.js',
        'html5' 	=>		            '$path/html5/html5.js',
        'canvas' 	=>		            '$path/html5/canvas.js',
        'jquery.history' =>             '$path/jquery/jquery.history.js',

        'highcharts.adaptater' =>		'$path/highchartsjs/adapters/prototype-adapter.js',
        'highchartsjs' =>	            '$path/highchartsjs/highcharts.js',
        'highstockjs' =>	            '$path/highchartsjs/highstock.js',
        'hightcharts.exporting'=>       '$path/highchartsjs/modules/exporting.js',
    );
/**
 * System.Includer.Script -> Array
 **/
	protected static $Script = 	array();
/**
 * System.Includer.Css -> Array
 **/
	protected static $Css =     array();
/** deprecated
 * System.Includer.AddCSS(link [, media]) -> void
 * - link (String): Lien du fichier CSS à ajouter
 *
 * Cette méthode enregistre un lien d'un script CSS et sera ajouter au lancement du logiciel.
 **/
    public static function AddCSS($link, $media='all'){
        self::ImportCSS($link, $media);
    }
/*
 * System.Includer.AddJS(link) -> void
 * - link (String): Lien du fichier Javascript à ajouter
 *
 * Cette méthode enregistre un lien d'un script Javascript et sera ajouter au lancement du logiciel.
 **/
    public static function AddJS($link){
        self::EnqueueScript(md5($link), $link);
    }
/** deprecated
 * System.Includer.AddScript(link) -> void
 * - link (String): Lien du fichier Javascript à ajouter
 *
 * Cette méthode enregistre un lien d'un script Javascript et sera ajouter au lancement du logiciel.
 **/
    public static function AddScript($link){
        self::EnqueueScript(md5($link), $link);
    }

/**
 * System.Includer.EnqueueScript(scriptname [, src [, parameters]]) -> void
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
 * System.Includer.ImportCSS(src, media) -> void
 * - src (String): Lien du script css à importer.
 * - media (String): Média cible du script css.
 * 
 * Cette méthode permet d'importer un script CSS en vue d'être inséré dans l'entête du template.
 **/
	static public function ImportCSS($style, $media = 'screen'){
		array_push(self::$Css, '<link type="text/css" rel="stylesheet" href="'.$style.'" media="'.$media.'" />');
	}
/**
 * System.Includer.CompileCSS() -> void
 * 
 * Cette méthode compile et compresse les fichiers CSS en fonction des paramètres du template.
 **/	
	static public function CompileCSS(){
		$link = 		new \Permalink();
		$parameters = 	$link->getParameters();
		$template = 	@$parameters[2] == 'default' ? 'system' :  $parameters[2];
		$type =			@$parameters[3];
		$compress =		false;
		$linkCSS = 		'';
		
		include(ABS_PATH . 'inc/lib/window/package_window.php');
		
		if(!(User::IsConnect() && \System::Meta('MODE_DEBUG'))){
			$compress = true;
		}
		
		if(@$parameters[4] == 'minified'){
			$compress = true;
		}
		
		if($template == 'custom'){
			
			$stripPath = 	URI_PATH.'themes/compile/custom/' . $type . '/';
			$path = 		str_replace($stripPath, '', $link);
			$path =			ABS_PATH . str_replace(array('../plugins','minified'), array('plugins', ''), $path);
			
			\WR::ParseXML($path);
			
		}else{
			$path = ABS_PATH . 'themes/'.$template.'/';
			\WR::ParseXML($path);
		}
		
		ob_start();
		
		switch($type){
				
			case 'system':
				\WR::ImportCSS(ABS_PATH.'themes/window/core/window.default.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.icon.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.admin.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.progress.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.widget.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.menu.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.user.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.filemanager.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.setting.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.jpanel.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.directory.css');
				\WR::ImportCSS(ABS_PATH.'themes/system/system.notify.css');
				\WR::ImportCSS(ABS_PATH.'themes/window/plugins/filemanager.css');
				\WR::ImportFragment($path);
				break;
				
			case 'window':
				\WR::ImportCSS(ABS_PATH . 'themes/window/core/window.default.css');
				\WR::ImportFragment($path);
				break;
				
			case 'filemanager':
				\WR::ImportCSS(ABS_PATH . 'themes/window/plugins/filemanager.css');
				break;
			case 'schedule':
				\WR::ImportCSS(ABS_PATH . 'themes/window/plugins/schedule.css');
				break;
			case 'editor':
				\WR::ImportCSS(ABS_PATH . 'themes/window/plugins/editor.css');
				break;
		}
		
		$str = ob_get_clean();
		
		\WR::PrintHeader($compress);
		
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
     * System.Includer.Path([type]) -> String
     * - type (String): type de dossier cible
     *
     * Cette méthode retourne le chemin absolue vers le dossier publique de l'utilisateur.
     *
     * Cette méthode prend en paramètre optionnel un `type`. Ce paramètre peut prendre différente valeur comme suivants :
     *
     * * `public` par défaut :  retourne le chemin absolue vers le dossier publique de l'utilisateur.
     * * `private` : retourne le chemin absolue du dossier privé du système.
     * * `plugin` : retourne le chemin absolue du dossier des extensions.
     *
     * Depuis la version 0.2.1 d'autres constantes sont disponibles :
     *
     * * `self` : retourne le chemin du logiciel (Equivalent à `Global.ABS_PATH`).
     * * `theme` : retourne le chemin absolue du dossier des thèmes du système.
     * * `lib` : retourne le chemin absolue du dossier des librairies.
     * * `core` : retourne le chemin absolue du dossier des fichiers système.
     * * `conf` : retourne le chemin absolue du dossier des fichiers de configuration.
     * * `icon` : retourne le chemin absolue du dossier des icônes.
     * * `panel` : retourne le chemin absolue du dossier des panneaux.
     *
     **/
    public static function Path($type = "public", $abs = true){

        switch($type){

            case "prints":
                return ($abs ? ABS_PATH : URI_PATH).PATH_PUBLIC.'Prints/';
            case "models":
                return ($abs ? ABS_PATH : URI_PATH).'models/';
            case "models.default":
            case 'model.default':
                return self::Path('models.version', $abs). '/'. '/default/';

            default:
            case "publics":
                return ($abs ? ABS_PATH : URI_PATH).PATH_PUBLIC;

            case "publics.global":
                return ($abs ? ABS_PATH : URI_PATH).PATH_PUBLIC . 'global/';

            case "public":
                //self::iDie(true);
                return ($abs ? ABS_PATH : URI_PATH).PATH_PUBLIC.User::Get()->getID().'/';
            case "private":
                return ($abs ? ABS_PATH : URI_PATH).PATH_PRIVATE;
            case 'plugins':
            case "plugin":
                return ($abs ? ABS_PATH : URI_PATH).PATH_PLUGIN;
            case "self":
                return ABS_PATH;
            case 'uri':
                return URI_PATH;
            case "theme":
            case "themes":
                return ($abs ? ABS_PATH : URI_PATH).PATH_THEME;
            case 'icons':
            case "icon":
                return ($abs ? ABS_PATH : URI_PATH).PATH_THEME.'icons/';
            case "panel":
                return ($abs ? ABS_PATH : URI_PATH).PATH_THEME.'panel/';
            case "flag":
                return ($abs ? ABS_PATH : URI_PATH).PATH_THEME.'flag/';
            case "lib":
                return ($abs ? ABS_PATH : URI_PATH).'inc/lib/';
            case "core":
                return ($abs ? ABS_PATH : URI_PATH).'inc/core/';
            case "conf":
                return ($abs ? ABS_PATH : URI_PATH).'inc/conf/';
            case 'js':
                return ($abs ? ABS_PATH : URI_PATH).'js/';
            case 'mail':
                return ABS_PATH.'inc/core/model-mail.php';
        }
    }

    static protected function PrintCSS(){
        return implode("\n", self::$Css)."\n";
    }

    static protected function PrintLibrairiesScript($lib){

        $str = '';

        //si on a scriptaculous qui est dans la file d'attente
        if(@$lib['prototype'] && @$lib['jquery']){

            $str .= '<script type="text/javascript" src="'.str_replace('$path/', self::Path('js', false), $lib['prototype']) . '"></script>' ."\n";
            $str .= '<script type="text/javascript" src="'.str_replace('$path/', self::Path('js', false), $lib['jquery']) . '"></script>' ."\n";

            if(isset($lib['extends'])){
                $str .= '<script type="text/javascript" src="'.str_replace('$path/', self::Path('js', false), $lib['extends']) .'"></script>' ."\n";
            }
        }else{
            if(@$lib['prototype']){
                $str .= '<script type="text/javascript" src="'. str_replace('$path/', self::Path('js', false), $lib['prototype']) .'"></script>' ."\n";
            }

            if(@$lib['extends']){
                $str .= '<script type="text/javascript" src="'. str_replace('$path/', self::Path('js', false), $lib['extends']) .'"></script>' ."\n";
            }

            if(@$lib['jquery']){
                $str .= '<script type="text/javascript" src="'.str_replace('$path/', self::Path('js', false), $lib['jquery']) . '"></script>' ."\n";
            }
        }

        if(@$lib['window']){
            $str .= '<script type="text/javascript" src="' . str_replace('$path/', self::Path('js', false), $lib['window']) .'"></script>' ."\n";
        }

        if(!isset($lib['jquery']) && (isset($lib['highchartsjs']) || isset($lib['highstockjs']))){
            $str .= '<script type="text/javascript" src="' . str_replace('$path/', self::Path('js', false), self::$ScriptLink['highcharts.adaptater']).'"></script>' ."\n";
        }

        return $str;
    }

    static protected function PrintExternalScript($lib){
        global $PM;

        $str  = '';

        foreach($lib as $key => $value){
            if(in_array($key, array('extends', 'jquery', 'prototype', 'window', 'system'))) continue;

            switch($key){

                case 'googlemap':
                    $str .= '<script type="text/javascript" src="'. self::Resolve($lib[$key]).'"></script>' . "\n";
                    $str .= '<script src="'. \GoogleMapAPI::GetClustererPath().'" type="text/javascript"></script>' . "\n";

                    \GoogleMapAPI::DrawClassJS();
                    break;
                case 'canvas':
                    $str .= '<!--[if IE]><script type="text/javascript" src="'. self::Resolve($lib[$key]).'"></script><![endif]-->' . "\n";
                    break;
                case 'html5':
                    $str .= '<!--[if lt IE 9]><script type="text/javascript" src="'. self::Resolve($lib[$key]).'" ></script><![endif]-->' . "\n";
                    break;
                case 'window.schedule':
                    $str .= '<link type="text/css" rel="stylesheet" href="'. self::Path('uri').'themes/compile/default/schedule/" />' . "\n";
                    $str .= '<script type="text/javascript" src="'. self::Resolve($lib[$key]).'"></script>' . "\n";

                    break;
                case 'window.editor':
                    $o = trim($lib[$key]);
                    if(!empty($o)):
                        $str .= '<link type="text/css" rel="stylesheet" href="'. self::Path('uri').'themes/compile/default/editor/" />' . "\n";
                        $str .= '<script type="text/javascript" src="'. self::Resolve($lib[$key]).'"></script>' . "\n";
                    endif;
                    break;

                default:
                    $str .= '<script type="text/javascript" src="'. self::Resolve($lib[$key]).'"></script>' . "\n";
                    break;
            }
        }

        return $str . $PM->printCSS().$PM->printScript();
    }

    static protected function PrintSystemScript(){
        $str = '';
        if(User::IsConnect()):
            foreach(self::$ScriptSystem as $script):
                $str .= '<script src="'.self::Resolve($script).'" type="text/javascript"></script>' . "\n";
            endforeach;

            $str .= self::PrintScriptParameters();
        endif;
        return $str;
    }
/**
 * SystemIncluder.PrintScriptParameters() -> void
 *
 * Cette méthode écrit les paramètres JS nécéssaire à l'initialisation d'une page.
 **/
    static protected function PrintScriptParameters(){

        ob_start();
        ?>

        <script>

            System.VERSION = System.version = 	'<?php echo \System::Meta('CODE_VERSION') . \System::Meta('CODE_SUBVERSION'); ?>';
            System.PHPSESSID = 					'<?php echo session_id(); ?>';
            //extension des clefs métas du système
            Object.extend(System, '<?php echo addslashes(json_encode(\System::getMetas())); ?>'.evalJSON());

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

            System.CRON_STARTED =			<?php echo json_encode(\Cron::IsStarted()); ?>;
        </script>

        <?php
        return ob_get_clean();
    }
/**
 * SystemIncluder.Resolve(link) -> String
 * - link(String): Lien du script à résoudre.
 *
 * Cette méthode tente de résoudre le chemin d'un lien codé.
 **/
    static protected function Resolve($link){
        return str_replace(array('$path/'), array(\System::Path('js', false)), $link);
    }
}

endif;

?>