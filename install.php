<?php
if(!defined('ABS_PATH')){
/**
 * Global.ABS_PATH -> Boolean
 * Lien absolue du répertoire du logiciel en cours d'installation.
 **/
	define('ABS_PATH', str_replace('\\','/', dirname(__FILE__)) . '/');
}

define('MODE_INSTALL', true);

/**
 * mixin Install
 * Outil d'installation de logiciel basé sur l'architecture Javalyss.
 *
 * Cette classe contient les méthodes permettant de récupérer une archive d'un logiciel basé sur l'architecture de Javalyss et de l'installer sur le 
 * serveur du client.
 * 
 * Un mode d'installation en local est implémenté permettant d'installer le logiciel sans passé par la phase de récupération des paquets d'installation.
 **/
class Install{
/**
 * Install.VERSION -> Number
 * Numéro de version de l'utilitaire d'installation.
 **/
	var $VERSION =			'1.1';
/**
 * Install.NAME_VERSION -> String
 * Nom de la version de l'installateur.
 **/
	var $NAME_VERSION = 	'Javalyss Carbon';
/**
 * Install.URI -> Boolean
 * Répertoire de référence des librairies de nécessaire à Javalyss Install.
 **/	
	var $URI = 			'';
/**
 * Install.GATEWAY -> Boolean
 * Adresse web du dépôt Javalyss Server.
 **/
	var $GATEWAY = 		"http://www.javalyss.fr/gateway.safe.php";
/**
 * Install.ICON_PACK -> Boolean
 * Adresse web du paquage des icônes pour les logiciels basés sur Javalyss.
 **/
	var $ICON_PACK =	'http://www.javalyss.fr/public/javalyss_icons_pack.zip';
/**
 * Install.Draw() -> void
 **/	
	function Draw(){
		
		if(file_exists('inc/conf/default/conf.install.php')){
			if(file_exists('inc/conf/conf.db.php')) header('Location:index.php');
			include('inc/conf/default/conf.install.php');
		}

		$nameVersion  = defined('NAME_VERSION') ? NAME_VERSION : $this->NAME_VERSION;
		$version =		defined('CODE_VERSION') ? CODE_VERSION.CODE_SUBVERSION : $this->VERSION;
		$link =			'install.php';
		$window =		$this->URI."themes/system.min.css";
        
		if( phpversion() < "5.0.0" ){
			$window =		"themes/window.css";
		}
		
		?>
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title><?php echo $nameVersion; ?> :: Installation</title>
            <link href="http://server.javalyss.fr/themes/icons/icons.css.php" rel="stylesheet" type="text/css" />
            <link href="<?php echo $window; ?>" rel="stylesheet" type="text/css"/>
            <link href="<?php echo $this->URI; ?>themes/system/system.install.css" rel="stylesheet" type="text/css" />
            
            <link rel="shortcut icon" href="<?php echo $this->URI; ?>themes/system/images/favicon.ico" type="image/x-icon">
            <link rel="icon" href="<?php echo $this->URI; ?>themes/system/images/favicon.ico" type="image/x-icon">
            
            <script src="<?php echo $this->URI; ?>js/prototype/prototype.js" type="text/javascript"></script>
            <script src="<?php echo $this->URI; ?>js/window/extends.js?import=window&lang=fr" type="text/javascript"></script>
            <script src="<?php echo $this->URI; ?>js/install.js" type="text/javascript"></script>
            <script>
                $S.URI =			'<?php echo $this->URI; ?>';
				$S.LOCAL =			<?php echo defined('NAME_VERSION') ? 'true' : 'false'; ?>;
				$S.VERSION =		'<?php echo $version; ?>';
				$S.NAME_VERSION =	'<?php echo $nameVersion; ?>';
				$S.link =			'<?php echo $link; ?>';
				
                $S.initialize();
                $S.Writable = 		<?php echo is_writable('.') ? 'true' : 'false'; ?>;
                $S.Curl = 			<?php echo extension_loaded('curl') ? 'true' : 'false'; ?>;
                $S.Zip = 			<?php echo extension_loaded('zip') ? 'true' : 'false'; ?>;
				$S.MySQL = 			<?php echo extension_loaded('mysql') ? 'true' : 'false'; ?>;
				$S.MsSQL = 			<?php echo extension_loaded('sqlsrv') ? 'true' : 'false'; ?>;
                $S.Php = 			"<?php echo phpversion(); ?>";
				$S.Icons =			<?php echo file_exists('themes/icons/16/') ? 'true' : 'false'; ?>;
            </script>
            </head>
            <body>
            	
            </body>
            </html>	
            <?php
	}
/**
 * Install.Post(url, params) -> bool
 * - url (String): Lien de la page.
 * - params (String | array): Paramètre à envoyer en Post.
 *
 * Cette méthode envoi les informations `params` à la page indiqué par l'`url` en méthode `POST` et retourne le résultat.
 **/
	function Post($url, $param){
		$ch = curl_init();		
		
		if(is_array($param)){ 
			$str = '';
			$start = false;
			
			foreach($param as $key=>$value){
				
				if(!$start) $start = true;
				else $str .= '&';
				
				if(is_array($value) || is_object($value)){
					$str .= $key.'='.serialize($value);	
				}else{
					$str .= $key.'='.$value;
				}	
			}
			$param = $str;
		}
		
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $param);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		
		$output = curl_exec($ch);
		
		curl_close($ch);
		
		return $output;
	}
/**
 * Install.Download(url, folder) -> bool
 * - url (String): Lien du contenu à récupérer
 * - folder (String): Dossier de destination.
 *
 * Cette méthode télécharge un fichier depuis un serveur distant vers le serveur local dans le dossier de destination `folder`.
 **/
	function Download($url, $folder){
		//var_dump($url);
		$ch = curl_init();
		// set url
		curl_setopt($ch, CURLOPT_URL, $url);
		
		//return the transfer as a string
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		
		// $output contains the output string
		$output = curl_exec($ch);
		
		// close curl resource to free up system resources
		curl_close($ch);
		
		$filename = basename($url);
		
		//echo $folder.$filename;
		return self::Write($folder.$filename, $output) ? $folder.$filename : false;
	}
/**
 * Install.Depackage(file, folder) -> bool
 * - file (String): Lien de l'archive.
 * - folder (String): Dossier de destination.
 * 
 * Cette méthode dézippe l'archive dans le dossier destination `folder`.
 **/
	function Depackage($file, $folder){
		
		$zip = new ZipArchive;
		
   		if ($r = $zip->open($file) === TRUE) {
			$zip->extractTo($folder);
			$zip->close();			
			return true;
		}
		return false;
	}
/**
 * Install.MkDir(folder, chmod) -> bool
 * - folder (String): Lien du nouveau dossier.
 * - chmod (int): Droits d'accès du nouveau dossier de la forme 0775.
 *
 * Cette méthode crée un nouveau dossier si ce dernier n'existe pas.
 **/
	function MkDir($folder, $chmod = 0775){
		if (!is_dir($folder)){
			return mkdir($folder, $chmod);
		}	
		return false;
	}
/**
 * Install.Write(file, content) -> bool
 * - file (String): Lien du fichier.
 * - content (String): Contenu à écrire dans le fichier.
 *
 * Cette méthode écrit le contenu `content` dans le fichier `file`.
 *
 * <p class="note">[[Stream]] gère l'ouverture et la fermeture des flux</p>
 **/
	function Write($file, $mixed){
		$handle = 	fopen($file, "w");
		
		if(!$handle) return false;

		if(is_array($mixed)){
			$str = '';
			for($i = 0; $i < count($mixed); $i++) $str .= $mixed[$i];
			
		}else $str = $mixed;
		
		fwrite($handle, $str);
		fclose($handle);
		
		return true;
	}
/**
 * Install.exec(cmd) -> void
 **/
	function exec($op){
		
		switch($op){
			default: $this->Draw();break;
			
			case "install.application.get":
				session_start();
				$_SESSION['Application'] = 		$_POST['Application'];
				//$_SESSION['Extensions'] = 	json_decode(stripslashes($_POST['Extensions']));

				$_SESSION['Application'] = $this->Post($this->GATEWAY, array(
					'cmd' => 				'application.release.last',
					'NAME_VERSION' => 		$_SESSION['Application']
				));
				
				$_SESSION['Application'] = unserialize($_SESSION['Application']);
								
				echo json_encode($_SESSION['Application']);
				$_SESSION['Application'] = serialize($_SESSION['Application']);
				
				break;
				
			case "install.application.download":
				set_time_limit(0);
				ignore_user_abort(true);
				
				session_start();
				//creation du dossier public
				self::MkDir(ABS_PATH."public/");
				
				$update = unserialize($_SESSION['Application']);
				//récupération du fichier
				$_SESSION['FILE'] = 	self::Download($update['Link_Release'], ABS_PATH."public/");				
				$_SESSION['ICONS'] = 	self::Download($this->ICON_PACK, ABS_PATH."public/");
				break;
			
			case "install.icons.download":
				set_time_limit(0);
				ignore_user_abort(true);
				
				$file = $this->Download($this->ICON_PACK, ABS_PATH."public/");
				$this->Depackage($file, ABS_PATH."themes/icons/");
				
				break;
			case "install.application.depackage":
				session_start();
				
				set_time_limit(0);
				ignore_user_abort(true);
				
				if(!$_SESSION['FILE']) {
					echo "install.application.depackage.notfound";
					break;
				}
				
				//Dépackage
				json_encode($this->Depackage($_SESSION['FILE'], ABS_PATH));
				break;
				
			case "install.icons.depackage":
				session_start();
				
				set_time_limit(0);
				ignore_user_abort(true);
				
				if(!$_SESSION['ICONS']) {
					echo "install.icons.depackage.notfound";
					break;
				}
				//Dépackage
				json_encode($this->Depackage($_SESSION['ICONS'], ABS_PATH."themes/icons/"));
				break;
				
			case "install.connection"://tentative de connexion
				
				if(file_exists('inc/conf/conf.db.php')){
					header('Location:index.php');
					return;
				}
				
				include(ABS_PATH.'inc/lib/sql/class_sql.php');
				
				$DB = json_decode(stripslashes($_POST['DB']));
				//SQL génère une erreur si les informations de connexion à la base de données sont incorrects
				new SQL(array(
					'login' => 		$DB->DB_LOGIN, 
					'password' => 	$DB->DB_PASS, 
					'host' => 		$DB->DB_HOST, 
					'db' => 		$DB->DB_NAME, 
					'type' =>		$DB->DB_TYPE
				));
				//Dans le cas contraire on signal que la connexion est établie
				echo "install.connection.ok";
				
				break;
				
			case "install.write.config"://Ecriture du fichier de configuration
				//inclusion des librairies
				include_once('inc/conf/default/conf.install.php');
				include_once('inc/conf/default/conf.file.php');
				include_once('inc/lib/library.php');
				@include_once('inc/core/class_system.php');
				
				if(is_writable(ABS_PATH.'inc/conf/')){
				
					if(class_exists('System')){
						if(method_exists('System', 'WriteConfig')){
							$DB = json_decode(stripslashes($_POST['DB']));
							
							System::WriteConfig($DB->DB_LOGIN, $DB->DB_PASS, $DB->DB_HOST, $DB->DB_NAME, $DB->DB_TYPE, $DB->PRE_TABLE);
							echo "install.write.config.ok";
						}else{
							echo "install.method.notfound";	
						}
					}else{
						echo "install.class.notfound";	
					}
				}else{
					echo "install.folder.unwritable";
				}	
								
				break;
			
			case "install.write.db":
				//inclusion des librairies
				include_once('inc/conf/default/conf.install.php');
				include_once('inc/conf/default/conf.file.php');
				include_once('inc/lib/library.php');
				@include_once('inc/core/class_system.php');
				
				System::sDie();
		
				require('inc/conf/conf.db.php');
				new SQL(array(
					'login' => 		DB_LOGIN, 
					'password' => 	DB_PASS, 
					'host' => 		DB_HOST, 
					'db' => 		DB_NAME, 
					'type' =>		DB_TYPE
				));
				
				$err = System::WriteDatabase();
				
				if($err){
					Stream::Delete(System::Path('conf').'conf.db.php');
					Stream::Delete(System::Path('conf').'conf.file.php');
					Stream::Delete(System::Path('conf').'conf.soft.php');					
					echo "install.db.".$err;	
					return;
				}
				
				echo "install.install.db.ok";
				
				break;
				
			case 'install.user.commit':
				
				include_once('inc/conf/default/conf.install.php');
				include_once('inc/conf/default/conf.file.php');
				include_once('inc/lib/library.php');
				@include_once('inc/core/class_system.php');
				require('inc/conf/conf.db.php');
						
				System::sDie();
				
				require(ABS_PATH.'inc/core/class_user.php');
				
				new SQL(array(
					'login' => 		DB_LOGIN, 
					'password' => 	DB_PASS, 
					'host' => 		DB_HOST, 
					'db' => 		DB_NAME, 
					'type' =>		DB_TYPE
				));
				
				$user = new User($_POST['User']);
				
				if(!$user->commit()){
					$current = Sql::Current();
					echo $current->getRequest();
					echo $current->getError();
					echo "install.user.commit.err";
				}else{
					echo "install.user.commit.ok";
				}
							
				break;
		}
	}
}
//
//
//
$o = new Install();
$o->exec(@$_POST['cmd']);
?>
