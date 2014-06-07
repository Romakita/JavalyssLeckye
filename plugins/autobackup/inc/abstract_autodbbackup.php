<?php
/** section: AutoDBBackup
 * class AutoDB Backup
 * includes ObjectTools
 *
 * Cette classe gère les informations liées à un contact
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_contact.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

abstract class AutoDBBackup extends ObjectTools{
	const PRE_OP =				'autodb.';
	
	protected static $MAX_NB_BACKUPS = array(
		'oneperhour' => 720, //un mois environ
		'oneperday' => 	60,  //deux mois
		'oneperweek' => 52 	 //une année
	);
/**
 * AutoDBBackup.Initialize() -> void
 **/	
	static public function Initialize(){
				
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('plugin.active', array(__CLASS__,'Install'));
		System::Observe('plugin.configure', array(__CLASS__,'Install'));
		
		System::EnqueueScript('autodb', Plugin::Uri().'js/autodb.js');
		
		System::AddCss(Plugin::Uri().'css/autodb.css');
		System::Observe('system:index', array(__CLASS__, 'SystemIndex'));
		
		self::Install();
		
	}
/**
 * AutoDBBackup.Install() -> void
 **/	
	static public function Install(){
		if(!Cron::TaskExists('autodbbackup')){
			Cron::Observe('autodbbackup', '* * * * *', array(__CLASS__, 'onTick'));
		}
	}
/**
 * AutoDBBackup.Install() -> void
 **/	
	static public function SystemIndex(){
		
		if(User::IsConnect()){
			if(method_exists('Plugin', 'HaveAccess') && !Plugin::HaveAccess('AutoDBBackup')){
				return;
			}
			
			if(User::Get()->getRight() == 3){	
				return;
			}
			//
			// Droit d'accès suffisant
			//
			
			$link = new Permalink();
			
			if($link->strStart('autodbbackup/backup-', false)){
				
				$file = str_replace('autodbbackup', 'private/autodbbackup/archives', File::ToABS((string) $link));
				
				if(file_exists($file)){
					FrameWorker::Download($file);
				}
				
				exit();
			}
		}
		
	}
/**
 * AutoDBBackup.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP . 'db.configure':
			case self::PRE_OP . 'db.update':
				self::Install();
				echo "Base configurée";
				break;	
			
			//
			// BACKUP
			//			
			case self::PRE_OP . 'backup.init':
				self::MkDir();
				break;
				
			case self::PRE_OP . 'backup.dump.table':
				set_time_limit(0);
				ignore_user_abort(true);
				
				self::DumpTables($_POST['Table']);
				
				echo json_encode(true);
				break;
			
			case self::PRE_OP . 'backup.dump.files':
				set_time_limit(0);
				ignore_user_abort(true);
				
				self::DumpFiles();
				
				echo json_encode(true);
				break;
			
			case self::PRE_OP . 'backup.package':
				 
				set_time_limit(0);
				ignore_user_abort(true);
				
				self::Clean($file = self::Package());
				
				$options = System::Meta('AUTO_DB_BACKUP');
				if(!empty($options->BACKUP_BY_MAIL) && !empty($options->BACKUP_MAIL_ADDR)){
					self::Send($file);
				}
				
				echo json_encode(true);
				
				break;
			//
			// RESTORE
			//
			case self::PRE_OP . 'restore.init':
				
				echo json_encode(self::RestoreInit( $_POST['options']));
				
				break;
			
			case self::PRE_OP . 'restore.clean':
							
				self::Clean();
				
				break;
				
			case self::PRE_OP . 'restore.table':
				set_time_limit(0);
				ignore_user_abort(true);
				
				self::RestoreTable($_POST['Table'], $_POST['options']);
				
				echo json_encode(true);
				break;
			
			case self::PRE_OP . 'restore.files':
				set_time_limit(0);
				ignore_user_abort(true);
				
				self::RestoreFiles($_POST['options']);
				
				echo json_encode(true);
				break;			
			
			//
			// AUTRE
			// 
			case self::PRE_OP . 'backup.remove':
			
				self::RemoveBackup($_POST['File']);
				
				break;
				
			case self::PRE_OP . 'backup.import':
			
				self::Import();
				
				break;
				
			case self::PRE_OP . 'list':
				
				echo json_encode(self::GetList($_POST['clauses']));
				
				break;
				
		}
		
		return 0;	
	}
/**
 * AutoDBBackup.onTick() -> void
 *
 * `static` Cette méthode est appelée par CRON PHP.
 **/	
	public static function onTick(){
		
		self::CalculateNextTime();
		
		$options = System::Meta('AUTO_DB_BACKUP');
		
		if(empty($options)){
			return true;	
		}
		
		if($options->BACKUP_SCHEDULE_MODE == 'never'){
			return true;
		}
		
		$date = date('Y-m-d H:i:00');
		
		if($date == $options->BACKUP_NEXT_TIME){
			self::Save(true);	
		}
		
	}
/**
 * AutoDBBackup.CalculateNextTime() -> void
 *
 * `static` Cette méthode calcule la prochaine date d'execution
 **/	
	public static function CalculateNextTime(){
		$options = 	System::Meta('AUTO_DB_BACKUP');
		
		if($options->BACKUP_NEXT_TIME instanceof DateTime){
			$options->BACKUP_NEXT_TIME = $options->BACKUP_NEXT_TIME->format('Y-m-d H:i:s');
		}
		
		switch($options->BACKUP_SCHEDULE_MODE){
			default:return;
							
			case 'oneperhour':
				
				if($options->BACKUP_NEXT_TIME < date('Y-m-d H:i:00')){
					$date = new DateTime();
					$date->add(new DateInterval('PT1H'));
					$date->setTime($date->format('H'), 0,0);
					$options->BACKUP_NEXT_TIME = $date->format('Y-m-d H:i:s');
					System::Meta('AUTO_DB_BACKUP', $options);
				}
				
				
				break;
				
			case 'oneperday':
									
				if($options->BACKUP_NEXT_TIME < date('Y-m-d 02:00:00')){
					$date = new DateTime();
					$date->add(new DateInterval('P1D'));
					$date->setTime(2, 0,0);
					$options->BACKUP_NEXT_TIME = $date->format('Y-m-d H:i:s');
					System::Meta('AUTO_DB_BACKUP', $options);
				}
								
				break;
				
			case 'oneperweek':
				
				if($options->BACKUP_NEXT_TIME < date('Y-m-d 02:00:00')){
					$date = new DateTime();
					$date->add(new DateInterval('P7D'));
					$date->setTime(2,0,0);
					$options->BACKUP_NEXT_TIME = $date->format('Y-m-d H:i:s');
					System::Meta('AUTO_DB_BACKUP', $options);
				}
								
				break;	
		}
		
				
	}
/**
 * AutoDBBackup.Clean(file) -> void
 *
 * `static` Cette méthode supprime les fichiers temporaires et les archives si nécessaire.
 **/	
	public static function Clean($file){
		$options = 	System::Meta('AUTO_DB_BACKUP');
		//
		// Suppression de l'archive si nécessaire
		//
		if(empty($options->BACKUP_ON_SERVER)){
			Stream::Delete($file . '-db.zip', array(ABS_PATH));
			Stream::Delete($file . '-files.zip', array(ABS_PATH));
		}	
		
		Stream::Delete(System::Path('private').'autodbbackup/compile/');
		
		//
		// Vérification du nombre de sauvegarde
		//
		if($options->BACKUP_SCHEDULE_MODE != 'never'){
			$list = self::GetList();
		
			$nb =	self::$MAX_NB_BACKUPS[$options->BACKUP_SCHEDULE_MODE];
			
			if($list['length'] > $nb){
				for($i = $nb; $i < $list['length']; $i++){
					self::RemoveBackup($list[$i]);
				}
			}
		}
	}
/**
 *
 **/	
	public static function Import(){
		
		$base = System::Path('private').'autodbbackup/';
		@Stream::MkDir($base, 0700);
		
		$folder = $base . 'import/';
		@Stream::MkDir($folder, 0700);
		
		FrameWorker::Start();
		
		//récupération du fichier
		$file = FrameWorker::Upload($folder, 'zip;');
		$file = new File($file);
		
		if(strpos((string) $file, 'backup-') === false){
			die('frameworker.upload.backupname.err');
		}
		
		$base = explode('-', str_replace(array('backup-', '.zip'), '', basename((string) $file)));
			
		$file->type =	$base[6];
		$file->date =	$base[0] . '-' . $base[1] .'-'. $base[2] .' ' . $base[3] . ':' . $base[4] . ':' .$base[5];
		$file->base =	str_replace('-' . $base[6], '', implode('-', $base));
		$file->uri =	File::ToURI((string) $file);
		$file->imported = true;
		
		if($file->type != 'db'){
			die('frameworker.upload.backuptype.err');
		}
				
		FrameWorker::Stop($file);
		
	}
/**
 * AutoDBBackup.DumpDatabase(list) -> void
 *
 * `static` Cette méthode sauvegarde la base de données du logiciel dans un fichier `.sql`.
 **/
	public static function DumpTables($o){
		if(empty($o)){
			return;	
		}
		
		if(is_array($o)){
			
			foreach($o as $table){
				self::DumpTables($table);
			}
			
		}elseif(is_string($o)){
			
			$str = 		Sql::Dump(array($o));
			
			if(!empty($str)){
				Stream::Write(System::Path('private').'autodbbackup/compile/db/' . Stream::Sanitize($o, '-') .'.sql', $str);
			}
		}		
	}
/**
 * AutoDBBackup.DumpFiles() -> String
 *
 * `static` Cette méthode sauvegarde les fichiers principaux du logiciel (fichiers de configuration, themes et public).
 **/	
	public static function DumpFiles(){
		
		$options = 	System::Meta('AUTO_DB_BACKUP');
		//
		// Gestion des fichiers de synchro de logiciel tierce.
		//
		$flagSync = 	'\.svn$|\.yaml$|\.bak$|\.git$|\.ini$|\.SyncTrash$|\.SyncID$|\.SyncIgnore$|\.db$|_notes$';
		//
		// Masque des fichiers et dossiers Systeme non utile.
		//
		$flagThemes = 	'themes\/icons$|themes\/system$|themes\/window$|themes\/pmaster$|themes\/javalyssoriginal$|themes\/iphone$|themes\/iphone2$|themes\/font$|themes\/dynamic$';
		//
		//
		//
		$flag = '/' . $flagSync . '|' . $flagThemes . '|zipsys|compile|old|archives$|psd$|autodbbackup\/archives$|flag$|panel$|public\/javalyss_leckye(.*)\.zip';
		
		$base =	basename(System::Path('self'));
		$flag .= '|' . $base . '\/doc';
		$flag .= '|' . $base . '\/private';
		$flag .= '|' . $base . '\/js';
		$flag .= '|' . $base . '\/MUI';
		$flag .= '|' . $base . '\/inc\/lib';
		$flag .= '|' . $base . '\/inc\/core';
		$flag .= '|' . $base . '\/inc\/inc\.php';
		$flag .= '|' . $base . '\/index\.php';
		$flag .= '|' . $base . '\/install\.php';
			
		if(empty($options->BACKUP_PUBLICS)){
			$flag .= '|' . $base . '\/public';
		}
		
		if(empty($options->BACKUP_PLUGINS)){
			$flag .= '|' . $base . '\/plugins';
		}
				
		$flag .= '/';
		
		self::Copy(System::Path('self'), System::Path('private'). 'autodbbackup/compile/files/', $flag);
		
	}
/** debuggué
 * Stream.Copy(src, dest [, pattern]) -> bool
 * - src (String): Lien du fichier.
 * - dest (String): Lien du fichier de destination.
 * - pattern (String): Expression régulière indiquant quels sont les fichiers à ne pas copier.
 *
 * Cette méthode tente de copier un fichier vers `dest`.
 **/
	public static function Copy($src, $dest, $pattern = ''){
		$src = 	str_replace('//','/', $src);
		$dest = str_replace('//','/', $dest);
			
		if(!is_dir($src)){
			if(copy($src, $dest)) return $dest;
		}else{
			
			if($pattern != '' && preg_match($pattern, $src)){
				return $dest;
			}
			
			@Stream::MkDir($dest);
				
			$objects = scandir($src);
			
			foreach ($objects as $object) {
				
				if ($object != "." && $object != "..") {
					$paths = str_replace('//','/', $src."/".$object);
					$pathd = str_replace('//','/',$dest.'/'.$object);
					
					if($pattern != '' && preg_match($pattern, $paths)){
						continue;	
					}
					
					self::Copy($paths, $pathd, $pattern);
				}
			}
		}
				
		return false;
	}
/*
 *
 **/	
	public static function Package(){
		$date =		date('Y-m-d-H-i-s');
		
		$fileBase = System::Path('private').'autodbbackup/archives/backup-' .$date;
		
		$db = 		$fileBase . '-db.zip';
		$files =	$fileBase . '-files.zip';
		
		Stream::Package(System::Path('private') . 'autodbbackup/compile/db/', $db);
		Stream::Package(System::Path('private') . 'autodbbackup/compile/files/', $files);
		
		return $fileBase;	
	}
/*
 *
 **/
	public static function MkDir(){
		
		$options = 	System::Meta('AUTO_DB_BACKUP');
		//
		//
		//
		$base = System::Path('private').'autodbbackup/';
		Stream::MkDir($base, 0700);
		chmod($base, 0700);
			
		//
		// Dossier de stockage sur le serveur
		//
		$archives = $base . 'archives/';
		Stream::MkDir($archives, 0700);
		chmod($archives, 0700);
			
		//
		// Dossier de compilation
		//
		$compile = $base . 'compile/';
		
		if(file_exists($compile)){
			@Stream::Delete($compile);
		}
		
		Stream::MkDir($compile, 0700);
		
		$db =		$compile . 'db/';
		Stream::MkDir($db, 0700);
		
		if(!empty($options->BACKUP_FILES)){
			$files = 	$compile.'files/';
			Stream::MkDir($files, 0700);		
		}
		
		$str = '<Files *.zip>' . Stream::CARRIAGE;
		$str .= 'Deny from all' . Stream::CARRIAGE; 
		$str .= '</Files>' . Stream::CARRIAGE;
		
		if(!file_exists($archives . '.htaccess')){
			Stream::Write($archives . '.htaccess', $str);
		}
		
	}
/**
 * AutoDBBackup.RestoreInit(options) -> void
 *
 * `static` Cette méthode initialise la restoration du logiciel.
 **/	
	public static function RestoreInit($options){
		self::MkDir();
		
		$file = $options->File;
		
		if(is_string($file)){
			$file = new File(File::ToABS($file));
			
			if(strpos((string) $file, 'backup-') === false){
				exit();
			}
			
			$base = explode('-', str_replace(array('backup-', '.zip'), '', basename((string) $file)));
				
			$file->type =	$base[6];
			$file->date =	$base[0] . '-' . $base[1] .'-'. $base[2] .' ' . $base[3] . ':' . $base[4] . ':' .$base[5];
			$file->base =	str_replace('-' . $base[6], '', implode('-', $base));
			$file->uri =	File::ToURI((string) $file);
			$file->imported = true;
			
			$options->File = $file;
		}
		
		switch($options->File->type){
			case 'db':
				$file = File::ToABS(empty($file->imported) ? str_replace('autodbbackup', 'private/autodbbackup/archives', $file->uri) : $file->uri);
				
				break;
							
			case 'db-files':
				//
				// DB
				//
				$file = str_replace('-files', '-db', File::ToABS(empty($file->imported) ? str_replace('autodbbackup', 'private/autodbbackup/archives', $file->uri[0]) : $file->uri[0]));
				break;
		}
		
		Stream::Depackage($file, System::Path('private').'autodbbackup/compile/db/');
		
		if(!empty($options->File->imported)){
			Stream::Delete($file, array(ABS_PATH));
		}
		
		if(empty($options->RestoreTables)){
			$files = Stream::Listing(System::Path('private').'autodbbackup/compile/db/', NULL, NULL, array('sql'));
			$result = array();
			
			foreach($files as $file){
				$result[] = str_replace('.sql', '', $file);	
			}
			
			return $result;
		}
	}	
/**
 * AutoDBBackup.RestoreTable(table) -> void
 *
 * `static` Cette méthode restore le contenu d'une table.
 **/
	public static function RestoreTable($table, $options){
		
		if(method_exists('Plugin', 'HaveAccess') && !Plugin::HaveAccess('AutoDBBackup')){
			return;
		}
				
		$file = System::Path('private').'autodbbackup/compile/db/' . Stream::Sanitize($table, '-') .'.sql';
		
		if(!file_exists($file)){
			return;
		}
		//
		// Suppression de la table
		//
		if(!Sql::Query('TRUNCATE TABLE ' . $table)){
			die(Sql::PrintError());	
		}
		//
		// Restoration de la table
		//
		return Sql::Parse($file);
	}
/**
 * AutoDBBackup.RestoreFiles(options) -> void
 *
 * `static` Cette méthode restore les fichiers sauvegardés
 **/
	public static function RestoreFiles($options){
		
		if(method_exists('Plugin', 'HaveAccess') && !Plugin::HaveAccess('AutoDBBackup')){
			return;
		}
				
		$file = $options->File;
		
		switch($options->File->type){
			case 'files':
				$file = str_replace('autodbbackup', 'private/autodbbackup/archives', $file->uri);
				
				break;
							
			case 'db-files':
				//
				// DB
				//
				$file = str_replace('-db', '-files', str_replace('autodbbackup', 'private/autodbbackup/archives', $file->uri[0]));
				break;
		}
		
		if(file_exists($file)){
			Stream::Depackage($file, System::Path('self'));
		}
	}
/*
 *
 **/
	public static function Save($updateTime = false){
		set_time_limit(0);
		ignore_user_abort(true);
					
		$options = System::Meta('AUTO_DB_BACKUP');
		//
		// Initialisation des dossires
		//
		self::MkDir();
		//
		// Sauvegarde de la base de données
		//
		self::DumpTables($options->BACKUP_TABLES);
		
		//
		// Sauvegarde des fichiers
		//
		if(!empty($options->BACKUP_FILES)){
			self::DumpFiles($options->BACKUP_TABLES);
		}
		
		$file = self::Package();
		//
		// Envoi de l'archive par E-mail
		//
		
		if(!empty($options->BACKUP_BY_MAIL) && !empty($options->BACKUP_MAIL_ADDR)){
			self::Send($file);
		}
		
		self::Clean($file);
		
		if($updateTime){
			$options = 	System::Meta('AUTO_DB_BACKUP');
			$options->BACKUP_LAST_TIME = date('Y-m-d H:i:s');
			System::Meta('AUTO_DB_BACKUP', $options);
		}
					
		return $file;
	}
/**
 * AutoDBBackup.RemoveBackup(file) -> void
 *
 * `static` Cette méthode supprime une archive.
 **/	
	public static function RemoveBackup($file){
		if(empty($file)){
			return;	
		}
		if(User::Get()->getRight() == 3) return;
		
		if(is_array($file->uri)){
			foreach($file->uri as $f){
				$file = str_replace('autodbbackup', 'private/autodbbackup/archives', File::ToABS($f));
				Stream::Delete($file, array(ABS_PATH));
			}
		}else{
			$file = str_replace('autodbbackup', 'private/autodbbackup/archives', File::ToABS($file->uri));
			Stream::Delete($ile, array(ABS_PATH));
		}
		
	}
/**
 * AutoDBBackup.Send(file) -> void
 *
 * `static` Cette méthode envoi l'archive des bases de données à l'adresse e-mail configurée.
 **/	
	public static function Send($file){
		$options = System::Meta('AUTO_DB_BACKUP');
		
		$mail = new Mail();
		$mail->setType(Mail::HTML);
					
		$mail->addMailTo($options->BACKUP_MAIL_ADDR);
		$mail->From = 		"autodbbackup@" . Permalink::Host('javalyss.fr'); //javalyss.fr est l'hote par défaut si l'extension est exécuté sur un serveur local.
		$mail->FromName = 	'AutoDBBackup';
		$mail->Subject = 	Permalink::Host('javalyss.fr') . ' sauvegarde';
		$mail->Message = 	'Veuillez trouver en pièce jointe la sauvegarde de votre base de données.';
		
		$mail->addAttach($file . '-db.zip');
			
		@$mail->send();
	}
/**
 * AutoDBBackup.GetList() -> Array
 *
 * `static` Cette méthode liste les sauvegardes stockées dans le dossier de sauvegarde autodbbackup.
 **/
 	public static function GetList($clauses = ''){
		
		$folder =	System::Path('private').'autodbbackup/archives/';
		$list = 	Stream::Listing($folder, NULL, NULL, array('zip'));
		$array = 	array();
		
		foreach($list as $file){
			$file = new File($folder.$file);
			
			$base = explode('-', str_replace(array('backup-', '.zip'), '', basename((string) $file)));
			
			$file->type =	$base[6];
			$file->date =	$base[0] . '-' . $base[1] .'-'. $base[2] .' ' . $base[3] . ':' . $base[4] . ':' .$base[5];
			$file->base =	str_replace('-' . $base[6], '', implode('-', $base));
			
			$file->uri =	str_replace('private/autodbbackup/archives', 'autodbbackup', File::ToURI((string) $file));
			
			if(!empty($array[$file->base])){
				$file->type = 	'db-files';
				$file->size +=	$array[$file->base]->size;
				$file->uri =  	array($file->uri, $array[$file->base]->uri);
			}
			
			$array[$file->base] = $file;
		}
		
		$list = 	array();
		$i = 		0;
		$start = 	0;
		$size =		-1;
		
		if(!empty($clauses) && !empty($clauses->limits)){
			list($start, $size) = explode(',', $clauses->limits);
		}
		
		//
		// Tri
		//
		uasort($array, array(__CLASS__, 'onSort'));
		
		foreach($array as $file){
			
			if(0 <= $size){
				if($i >= $start){
					if(!($i < $start + $size)){
						$i++;
						continue;
					}
				}else{
					$i++;
					continue;
				}
			}
			
			array_push($list, $file);
			$i++;
		}
				
		$list['length'] = count($list);
		$list['maxLength'] = $i;
		
		
		return $list;
	}
	
	public static function onSort($a, $b){
		return strcmp(basename($b->date), basename($a->date));
	}
}

AutoDBBackup::Initialize();
?>