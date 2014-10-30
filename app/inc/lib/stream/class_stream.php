<?php
/** section: Library
 * mixin Stream
 * 
 * `abstract` Cette classe gère les flux tel que la lecture et écriture de fichier, la récupération de contenu via Curl ou la gestion d'archive Zip.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_stream.php
 * * Version : 1.8
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

require_once('class_file.php');
require_once('class_xmlnode.php');

abstract class Stream{
/**
 * Stream.VERSION -> String
 * Numéro de version de la bibliothèque.
 **/
	const VERSION = 	'1.8';
/**
 * Stream.CARRIAGE -> String
 * Constante de retour chariot.
 **/
	const CARRIAGE =	"\r\n";
/**
 * Stream.MEMORY_MAX_LIMIT -> String
 * Taille de la mémoire cache maximal.
 **/	
	static $MEMORY_MAX_LIMIT = '256M';
/**
 * Stream.Accept(FILES, extension) -> bool
 * - FILES (FILES): Ressource du fichier envoyé par un formulaire HTML par $_FILES
 * - extension (String): liste des extensions autorisés, séparé par des `;` .
 *
 * Cette méthode ananlyse l'extension du fichier importé en fonction de la liste `extension` passé.
 * Elle retourne vrai si l'extension est authorisé, faux dans le cas contraire.
 **/
	public static function Accept($FILES, $extension){
		
		if(is_array($FILES)){
			$mime_type = explode('/', $FILES['type']);
			$mime_type = $mime_type[1];
			
			if(strlen($mime_type) > 4){
				$mime_type = self::Extension($FILES['name']);
			}
		}else{
			$mime_type = self::Extension($FILES['name']);
		}

		return in_array($mime_type, explode(';', $extension)) ? $mime_type : false;
	}
/**
 * Stream.CleanNullByte(str [, replace = true]) -> String
 * Stream.CleanNullByte(array [, replace = true]) -> Array
 * Stream.CleanNullByte(Object [, replace = true]) -> Object
 * 
 * Cette méthode supprime le NULLBYTE d'une chaine de caractère.
 **/	
	public static function CleanNullByte($o, $replace = true){
		
		if(is_array($o) || is_object($o)){
			foreach($o as $key => $value){
				if(	is_array($o)){
					$o[$key] = self::CleanNullByte($value, $replace);
				}else{
					$o->$key = self::CleanNullByte($value, $replace);
				}
			}
			
			return $o;
		}
		
		if ( strpos($o, chr(0) ) !== false ) {
			return $replace ? str_replace(chr(0), '', $o) : substr ( $o, 0, strpos($o, chr(0)));
		}

        return $o;
	}
/**
 * Stream.Append(file, content) -> bool
 * - file (String): Lien du fichier.
 * - content (String): Contenu à ajouter.
 *
 * Cette méthode ajoute le contenu `content` à la suite du contenu du fichier `file`.
 *
 * <p class="note">[[Stream]] gère l'ouverture et la fermeture des flux</p>
 **/
	public static function Append($file, $mixed){
		$handle = 	fopen($file, "a");
		
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
 * Stream.Post(url [, params = null]) -> bool
 * - url (String): Lien de la page.
 * - params (String | array): Paramètre à envoyer en Post.
 *
 * Cette méthode envoi les informations `params` à la page indiqué par l'`url` en méthode `POST` et retourne le résultat.
 **/
	public static function Post($url, $param = ''){
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
		
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_URL, $url);
		
		if(!empty($param)){
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $param);
		}
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		
		$output = curl_exec($ch);
		
		curl_close($ch);
		
		return $output;
	}
/**
 * Stream.Get(url) -> bool
 * - url (String): Lien de la page.
 * - params (String | array): Paramètre à envoyer en Post.
 *
 * Cette méthode envoi les informations `params` à la page indiqué par l'`url` en méthode `POST` et retourne le résultat.
 **/
	public static function Get($url){
		$ch = curl_init($url);		
		
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, @$_SERVER['HTTP_USER_AGENT']);
		//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		
		$output = curl_exec($ch);
		
		curl_close($ch);
		
		return $output;
	}
/**
 * Stream.Download(url, param [, folder = null]) -> bool
 * Stream.Download(url, param, folder) -> bool
 * - url (String): Lien du contenu à récupérer
 * - folder (String): Dossier de destination.
 * - params (String | array): Paramètre à envoyer en Post.
 *
 * Cette méthode télécharge un fichier depuis un serveur distant vers le serveur local dans le dossier de destination `folder`.
 **/
	public static function Download($url, $param, $folder = ''){
		//var_dump($url);
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
		}else{
			$folder = $param;
		}
		
		// set url
		curl_setopt($ch, CURLOPT_URL, $url);
		
		//return the transfer as a string
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, @$_SERVER['HTTP_USER_AGENT']);
		
		if($param){
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $param);
		}
		// $output contains the output string
		$output = curl_exec($ch);
		
		// close curl resource to free up system resources
		curl_close($ch);
		
		$filename = Stream::Sanitize(basename($url), '-');
		
		//echo $folder.$filename;
		return self::Write($folder.$filename, $output) ? $folder.$filename : false;
	}
/**
 * Stream.Feed(url [, params]) -> array
 * - url (String): Lien du flux.
 *
 * Cette méthode récupère le flux RSS à l'`url` indiqué et le retourne sous forme de tableau.
 **/
	public static function Feed($url){
		if(!$url) return false;
		
		$ch = curl_init();
		// set url
		curl_setopt($ch, CURLOPT_URL, $url);
		
		//return the transfer as a string
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, @$_SERVER['HTTP_USER_AGENT']);
		
		// $output contains the output string
		$output = curl_exec($ch);
		
		// close curl resource to free up system resources
		curl_close($ch);
		
		$xml = simplexml_load_string($output); 
		
		if ($xml == NULL) {
			return "";
		}
				
		return self::xmlToArray($xml);
	}
/**
 * Stream.Quota(folder) -> int
 * - folder (String): Lien du dossier.
 *
 * Cette méthode retourne la taille du dossier `folder`.
 **/
	public static function Quota($folder){
		$dir = 		@opendir($folder);
		$size = 	0;
		
		if($dir) {
		
			while (($file = readdir( $dir ) ) !== false ) {
				
				if (substr($file, 0, 1) == '.' ) continue;
				if (is_dir($folder.$file)) {
					$size += self::Quota($folder.$file.'/');	
				}
				
				$file = new File($folder.$file);
				$size += $file->size;
			}
		}
		
		return $size;
	}
/**
 * Stream.Updoad(FILES, dest, extension) -> String
 * - FILES (FILES): Ressource du fichier chargé par un formulaire HTML.
 * - dest (String): Lien du dossier de destination.
 * - extension (String): liste des extensions autorisés, séparé par des `;` .
 * - exclude (String): liste des extensions non autorisés, séparé par des `;` .
 *
 * Cette méthode charge le fichier envoyé par le client dans le dossier de destination `dest`, vérifie si l'extension du fichier
 * correspond aux extensions `ext` autorisés et retourne le lien du fichier.
 **/
	public static function Upload($FILES, $dest, $extension = '', $exclude = ''){
		
		if($FILES['error']){
			return "file.upload.err.".$FILES['error'];
		}
		
		$file = 	self::Sanitize(basename($FILES['name']));
		$file = 	$dest.$file;
		
		if($extension != ''){
			if(!self::Accept($FILES, $extension)) return 'file.upload.extension.err';
		}
		
		if($exclude != ''){
			if(self::Accept($FILES, $exclude)) return 'file.upload.extension.err';
		}
		
		//changement de mode
		chmod($dest, 0777);
						
		if(!move_uploaded_file($FILES['tmp_name'], $file)) return 'file.upload.move.err';
		
		return $file;
	}
/**
 * Stream.MkDir(folder, chmod) -> bool
 * - folder (String): Lien du nouveau dossier.
 * - chmod (int): Droits d'accès du nouveau dossier de la forme 0755.
 *
 * Cette méthode crée un nouveau dossier si ce dernier n'existe pas.
 **/
	public static function MkDir($folder, $chmod = 0755){
		if (!is_dir($folder)){
			return mkdir($folder, $chmod);
		}	
		return false;
	}
/**
 * Stream.Depackage(file, folder) -> bool
 * - file (String): Lien de l'archive.
 * - folder (String): Dossier de destination.
 * 
 * Cette méthode dézippe l'archive dans le dossier destination `folder`.
 **/
	public static function Depackage($file, $folder){
		@ini_set('memory_limit', self::$MEMORY_MAX_LIMIT);
		
		$zip = new ZipArchive;
		
   		if ($r = $zip->open($file) === TRUE) {
			$zip->extractTo($folder);
			$zip->close();			
			return true;
		}
		
		return false;
	}
/**
 * Stream.Delete(file) -> bool
 * - file (String): Lien du fichier ou dossier.
 * 
 * Cette méthode supprime le fichier ou le dossier et son contenu du serveur.
 **/
	public static function Delete($dir, $undeletable = array(), $callback = ''){
		
		if(in_array($dir, $undeletable)){
			return false;	
		}
		//vérifier dossier authorisé
		
		if(is_dir($dir)) {
			
			$objects = scandir($dir);
			
			foreach ($objects as $object) {
				if ($object != "." && $object != "..") {
					if (filetype($dir."/".$object) == "dir") {
						self::Delete($dir."/".$object, $undeletable, $callback);
					}
					else {
						unlink($dir."/".$object);
						if($callback != '') @call_user_func_array($callback, array($dir."/".$object));
					}
				}
			}
			
			reset($objects);
			rmdir($dir);
		}else{
			unlink($dir);
		}
		return true;
	}
/**
 * Stream.Clean(dir, pattern) -> bool
 * - dir (String): Dossier de référence.
 * - pattern (String): Motif de nom de fichier ou dossier à supprimer.
 *
 * Cette méthode supprime les dossiers et fichier correspondant à la description du `pattern`.
 **/
	public static function Clean($dir, $pattern = ''){
		if($pattern == '') return false;
		//vérifier dossier authorisé
		
		if(is_dir($dir)) {
			
			$objects = scandir($dir);
			
			foreach ($objects as $object) {
				
				if ($object != "." && $object != "..") {
					$path = $dir."/".$object;
					
					if(preg_match($pattern, $path)){//flag trouvé dc suppression
						if (filetype($path) == "dir") {
							self::Delete($path);
						}else{
							unlink($path);	
						}
					}else{
						if (filetype($path) == "dir") {
							self::Clean($path, $pattern);
						}
					}
				}
			}
		}
		return true;
	}
/**
 * Stream.Extension(file) -> bool
 * - file (String): Lien du fichier.
 * 
 * Cette méthode retourne l'extension du fichier.
 **/
	public static function Extension($file){
		$mime_type = strrchr($file, '.');
		return strtolower(substr($mime_type, 1, strlen($mime_type) - 1));	
	}
/**
 * Stream.FileName(file) -> bool
 * - file (String): Lien du fichier.
 * 
 * Cette méthode retourne le nom du fichier en fonction de son lien.
 **/
	public static function FileName($file){
		return basename($file);
	}
/**
 * Stream.Listing(folder [, pattern [, exclude [, extension]]]) -> array
 * - folder (String): Lien du dossier.
 * - pattern (String): Expression regulière afin de filtrer la liste retourné.
 * - exclude (array): Liste de fichier à exclure de liste.
 * - extension (array): liste des extentions devant être listé.
 *
 * Cette méthode créée la liste des noms de fichiers du dossier `folder` et la retourne.
 **/
	public static function Listing($path, $pattern = '', $exclude = array(), $extension = array()){

		$dir = 		@opendir($path);
		$array =	array();
		
		if($dir) {
			
			while (($file = readdir( $dir ) ) !== false ) {
				
				if ( substr($file, 0, 1) == '.' ) continue;
				
				if(!empty($extension)){
					if(!in_array(self::Extension($file), $extension)) continue;
				}
				
				if(!empty($exclude)){
					if(in_array($file, $exclude)) continue;
				}
				
				if($pattern != ''){
					if(preg_match($pattern, $file)){
						$array[] = utf8_encode($file);
					}
				}else{
					$array[] = utf8_encode($file);
				}
			}
		}
		
		return $array;
	}
/**
 * Stream.FileList(folder [, pattern [, exclude [, extension]]]) -> array
 * - folder (String): Lien du dossier.
 * - pattern (String): Expression regulière afin de filtrer la liste retourné.
 * - exclude (array): Liste de fichier à exclure de liste.
 * - extension (array): liste des extentions devant être listé.
 *
 * Cette méthode créée la liste des fichiers de type [[File]] du dossier `folder` et la retourne.
 **/
	public static function FileList($path, $patern = '', $exclude = array(), $extension = array()){

		$dir = 		@opendir($path);
		$array =	array();

		if($dir) {
		
			while (($file = readdir( $dir ) ) !== false ) {
				
				if (substr($file, 0, 1) == '.' ) continue;
				
				if(!empty($extension)){
					if(!in_array(self::Extension($file), $extension)) continue;
				}
				
				if(!empty($exclude)){
					if(in_array($file, $exclude)) continue;
				}
				
				if($patern != ''){
					if(preg_match($patern, $file)){
						$array[] = new File($path.$file, true);
					}
				}else{
					$array[] = new File($path.$file, true);
				}
			}
		}
		
		return $array;
	}
/**
 * Stream.Package(src, dest) -> bool
 * - src (String): Lien du dossier ou du fichier à archiver.
 * - dest (String): Lien du fichier une fois archivé.
 * - exclude (Array): Liste des noms de fichier à exclure.
 * 
 * Cette méthode créée une archive du dossier ou fichier `src` et le stock au lien indiqué par `dest`.
 **/
	public static function Package($src, $dest){
		@ini_set('memory_limit', self::$MEMORY_MAX_LIMIT);
		
		$zip = new ZipArchive;
		
		if($err = $zip->open($dest, ZIPARCHIVE::CREATE) === TRUE){
			
			if(is_file($src)) {
				$file = explode('/', $src);
				$file = $file[count($file)-1];
				$zip->addFile($src, $file);
			}else{
				self::addDir($src, $src, $zip);
			}
			
			$zip->close();
			
			return $zip;
		}else{
			switch($err){
				case ZipArchive::ER_EXISTS:
				 	die('Le fichier existe déjà.');
					break;
				
				case ZipArchive::ER_INCONS:
				 	die('L\'archive ZIP est inconsistante.');				 	
					break;
				
				case ZipArchive::ER_INVAL:
				 	die('Argument invalide.');
					break;
				
				case ZipArchive::ER_MEMORY:
				 	die('Erreur de mémoire.');
					break;
					
				case ZipArchive::ER_NOENT:
				 	die('Le fichier n\'existe pas.');
					break;
				
				case ZipArchive::ER_OPEN:
				 	die('Impossible d\'ouvrir le fichier.');
					break;
				
				case ZipArchive::ER_READ:
				 	die('Erreur lors de la lecture.');
					break;
				
				case ZipArchive::ER_SEEK:
				 	die('Erreur de position.');
					break;
			}
		}
		
		return false;
	}
	
	private static function addDir($folder, $src, $zip){
		$empty = str_replace($src.'/', '', $folder);
		
		if($empty > $src){
			$zip->addEmptyDir($empty);
		}
		
		$nodes = glob($folder . '/*');
		
		foreach ($nodes as $node) {

			if (is_dir($node)) {
				self::addDir($node, $src, $zip);
			} else if (is_file($node))  {
				$zip->addFile($node, str_replace($src.'/', '', $node));
			}
		}	
	}
/**
 * Stream.ParseCSV(file) -> Array
 * - file (String): Lien du fichier CSV.
 * 
 * Cette méthode analyse le fichier CSV `file` est retourne un tableau de données équivalent.
 **/
	public static function ParseCSV($file, $delimiter = ',', $enclosure = '"', $escape = '\\'){
				
		if (($handle = fopen($file, "r")) !== false) {
						
			$array = array();
			
			while (($data = fgetcsv($handle, 1024, $delimiter, $enclosure, $escape)) !== false) {
				array_push($array, $data);
			}
			
			fclose($handle);
			
			return $array;
		}
		
		return false;
	}
/**
 * Stream.ParseSQL(file) -> bool
 * - file (String): Lien du fichier SQL.
 * 
 * Cette méthode analyse le fichier SQL `file` et insère les données en base de données.
 * 
 * <p class="note">Cette méthode utilise la bibliothèque SqlManager pour analyser le fichier SQL. Si la bibliothèque est absente la méthode retourne false</p>
 **/
	public static function ParseSQL($file){
		
		if(class_exists('Sql') && method_exists('Sql', 'parse')){
			return Sql::Current()->parse($file);
		}
		return false;
	}
/**
 * Stream.ParseXLS(file) -> array
 * - file (String): Lien du fichier CSV.
 * 
 * Cette méthode analyse le fichier XLS `file` est retourne un tableau de données équivalent.
 *
 * <p class="note">Cette méthode utilise la bibliothèque spreadsheet.</p>
 **/
	public static function ParseXLS($file){
				
		require_once('class_spreadsheet.xls.php');
		
		// ExcelFile($filename, $encoding);
		$data = new Spreadsheet_Excel_Reader();
		
		// Set output Encoding.
		$data->setOutputEncoding('CP1251');
		$data->read($file);
		
		error_reporting(E_ALL ^ E_NOTICE);
			
		$array = array();
		
		// Pour chaque ligne
		for ($i = 1; $i <= $data->sheets[0]['numRows']; $i++) {
			// Pour chaque case
			$row = array();
			
			for ($j = 1; $j <= $data->sheets[0]['numCols']; $j++) {
				array_push($row, utf8_encode($data->sheets[0]['cells'][$i][$j]));
			}
			
			array_push($array, $row);
		}
		
		return $array;
	}
	
	public static function ParseFileXLS($file){
		return self::ParseXLS($file);
	}
/**
 * Stream.ParseXML(file) -> array
 * - file (String): Lien du fichier XML.
 * 
 * Cette méthode analyse le fichier XML `file` est retourne un tableau de données équivalent.
 **/
 	public static function ParseXML($file){
		$output = self::Read($file);
		if($output){
			$xml = simplexml_load_string($output);
			return self::xmlToArray($xml);
		}
		return false;
	}
	
	public static function ParseVCARD($file){
		return vCard::ParseFile($file);
	}
/**
 * Stream.GetData(file) -> Array
 *
 * Cette méthode récupère les données d'un fichier de données et retourne un tableau de données. 
 *
 * Les formats pris en charge sont `csv`, `csv Microsoft`, `xml`, `xls`, `xlsx` et `vcf`.
 **/	
	public static function GetData($file){
		
		switch(Stream::Extension($file)){
			case 'csv':
				
				$str = Stream::Read($file);
				
				if(strpos($str, '";"') !== false){
					return Stream::ParseCSV($file, ';');
				}
				
				return Stream::ParseCSV($file);	
				
			case 'xlsx':
			case 'xls':
				return self::ParseXLS($file);
				
			case 'xml':
				return self::ParseXML($file);
								
			case 'vcf':
				return Stream::ParseVCARD($file);			
		}
	}
/**
 * Stream.Read(file) -> bool
 * - file (String): Lien du fichier.
 *
 * Cette méthode lit le contenu du fichier `file`.
 *
 * <p class="note">[[Stream]] gère l'ouverture et la fermeture des flux</p>
 **/
	public static function Read($filename){
		if(!file_exists($filename)){
			die('File ' . $filename . ' does\'nt exists');
		}
		
		$str = file_get_contents($filename);
		
		if(is_string($str)){
			$str = str_replace("\r\n", "\n", $str);	
		}	
				
		return $str;
	}
/**
 * Stream.ReadToArray(file [, useIncludePath [, ressource]]) -> bool
 * - file (String): Lien du fichier.
 * - useIncludePath (String): Flag.
 * - ressource (RESSOURCE): Une ressource de contexte valide, créée avec la fonction stream_context_create()
 *
 * Cette méthode lit le contenu du fichier `file`.
 *
 * <p class="note">[[Stream]] gère l'ouverture et la fermeture des flux</p>
 *
 *
 * #### Le paramètre useIncludePath
 *
 * * `FILE_USE_INCLUDE_PATH` : Recherche le fichier dans l'include_path. 
 * * `FILE_IGNORE_NEW_LINES` : N'ajoute pas de nouvelle ligne à la fin de chaque élément du tableau. 
 * * `FILE_SKIP_EMPTY_LINES` : Ignore les lignes vides.
 *
 **/
	public static function ReadToArray($filename, $use_include_path = false , $ressource = NULL){
		return file($filename, $use_include_path, $ressource);
	}
/**
 * Stream.Resize(file [, width = 1024 [, height = 800 [, quality = 100]]]) -> False | String
 * - file (String): Lien du fichier.
 * - width (Number): Largeur maximale de l'image.
 * - height (Number): Hauteur maximale de l'image.
 * - quality (Number): Qualité du fichier JPEG.
 *
 * Cette méthode redimensionne une image en gardant les proportions. Elle retourne faux si tout se passe bien.
 **/
 	public static function Resize($file, $width = 1024, $height = 800, $quality = 100){
		
		@ini_set( "memory_limit", self::$MEMORY_MAX_LIMIT);
		
		$olddim = getimagesize($file);
		
		if(!($olddim[0] < $width && $olddim[1] < $height)){
			$newdim = self::GetResize($file, (float) $width, (float) $height);
		}else{
			return;
		}
		
		switch (strtolower(self::Extension($file))) {
			case "jpg":
			case "jpeg": //pour le cas où l'extension est "jpeg"
				$img_src_resource = imagecreatefromjpeg($file);
				$img_dst_resource = imagecreatetruecolor((float) $newdim['width'], (float) $newdim['height']);
				break;
		
			case "gif":
				$img_src_resource = imagecreatefromgif($file);
				$img_dst_resource = imagecreate((float) $newdim['width'], (float) $newdim['height']);
				break;
		
			case "png":
				$img_src_resource = imagecreatefrompng($file);
				$img_dst_resource = imagecreatetruecolor((float) $newdim['width'], (float) $newdim['height']);
				
				imagealphablending($img_dst_resource, false);
				imagesavealpha($img_dst_resource, true);
				break;
		
			// On peut également ouvrir les formats wbmp, xbm et xpm (vérifier la configuration du serveur)
			default: return false;
		}
		
		imagecopyresampled($img_dst_resource, $img_src_resource, 0, 0, 0, 0, (float) $newdim['width'], (float) $newdim['height'], $olddim[0], $olddim[1]);
				
		if(!file_exists($file)){
			die('file doesn\'t exists');
		}
					
		switch(self::Extension($file)) {
			case "jpg":
			case "jpeg": //pour le cas où l'extension est "jpeg"
				$bool = @imagejpeg( $img_dst_resource, realpath($file), $quality);
				break;
			case "gif":
				$bool = @imagegif( $img_dst_resource, realpath($file));
				break;
			case "png":
				$bool = @imagepng( $img_dst_resource, realpath($file));
				break;
		}
		
		imagedestroy($img_src_resource);
						
		return $bool;
	}
/**
 * Stream.PngToJpg(file [, quality]) -> Boolean
 * - file (String): Lien du fichier.
 *
 * Cette méthode convertie un fichier PNG en fichier JPG.
 **/	
	public static function PngToJpg($file, $quality = 100) {
		
		@ini_set( "memory_limit", self::$MEMORY_MAX_LIMIT);
		
		//ob_start();
		
		if(strtolower(self::Extension($file)) == 'png') {
			$image = imagecreatefrompng($file);
			imagejpeg($image, str_replace('.png', '.jpg', $file), $quality);
			imagedestroy($image);
		}
		
		//$str = ob_get_clean();
		
		return;
	}
/*
 * Stream.GetResize(file [, width, height]) -> Boolean
 * - file (String): Lien du fichier.
 * - width (String): Largeur maximale de l'image
 * - height (String): Hauteur maximale de l'image
 *
 * Cette méthode redimensionne une image en gardant les proportions.
 **/	
	public static function GetResize($file, $widthMax, $heightMax){
			if(!file_exists($file)){
				return array('0' => 0, '1' => 0, 'width' => 0, 'height' => 0, 'Width' => 0, 'Height' => 0);
			}
			
			$dim =		getimagesize($file);
			$height = 	$dim[1];
			$width = 	$dim[0];
			
			if($width == 0) return  array('0' => 0, '1' => 0, 'width' => 0, 'height' => 0, 'Width' => 0, 'Height' => 0);
			if($height == 0) return  array('0' => 0, '1' => 0, 'width' => 0, 'height' => 0, 'Width' => 0, 'Height' => 0);
			
			if($heightMax == -1){//la hauteur n'est pas fixée
				$height = 	round(($widthMax / $width) * $height, 0);
				$width = 	$widthMax;	
				return array('0' => $width, '1' => $height, 'width' => $width, 'height' => $height, 'Width' => $width, 'Height' => $height);
			}
			
			if($widthMax == -1){//la largeur n'est pas fixée
				$width =	round(($heightMax / $height) * $width, 0);
				$height = 	$heightMax;
				return array('0' => $width, '1' => $height, 'width' => $width, 'height' => $height, 'Width' => $width, 'Height' => $height);
			}
			
			//le cadre est fixé
			if($height > $width){
				$width =	round(($heightMax / $height) * $width, 0);
				$height = 	$heightMax;
			}elseif($height < $width){
				
				if($widthMax <= $heightMax){
					$height = 	round(($widthMax / $width) * $height, 0);
					$width = 	$widthMax;
				}else{
					
					$width = 	round(($heightMax / $height) * $width, 0);
					$height = 	$heightMax; 
					
					if($width > $widthMax){
						$height = 	round(($widthMax / $width) * $height, 0);
						$width = 	$widthMax;
					}
					
				}
				
			}elseif($height == $width){
				//Largeur & hauteur du nouveau logo
				
				if($heightMax > $widthMax){
					$width = 	$widthMax;
					$height = 	$widthMax;
				}else{
					$width = 	$heightMax;
					$height = 	$heightMax;
				}
			}
					
			return array('0' => $width, '1' => $height, 'width' => $width, 'height' => $height, 'Width' => $width, 'Height' => $height);
		}
/**
 * Stream.Sanitize(name) -> String
 * - name (String): Nom à nettoyer
 *
 * Cette méthode replace les accents par leurs équivalents sans accents et les caractère interdit par un _ .
 **/
	public static function Sanitize($name, $char = '_'){
		//var_dump(explode('', 'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ'));
		$array = array(
			array('À','Á','Â','Ã','Ä','Å','Ç','È','É','Ê','Ë','Ì','Í','Î','Ï','Ò','Ó','Ô','Õ','Ö','Ù','Ú','Û','Ü','Ý','à','á','â','ã','ä','å','ç','è','é','ê','ë','ì','í','î','ï','ð','ò','ó','ô','õ','ö','ù','ú','û','ü','ý','ÿ', chr(0)), 
			array('A','A','A','A','A','A','C','E','E','E','E','I','I','I','I','O','O','O','O','O','U','U','U','U','Y','a','a','a','a','a','a','c','e','e','e','e','i','i','i','i','o','o','o','o','o','o','u','u','u','u','y','y', '')
		);
		
		$name = str_replace($array[0], $array[1], $name);
		
   		return str_replace(array(' ', '--', '\''), array($char,'-', ''), preg_replace('/\\\\|\\/|\\||\\:|\\?|\\*|"|<|>|[[:cntrl:]]/', $char, $name));
	}
/**
 * Stream.Tree(folder [, all]) -> array
 * - folder (String): Lien du dossier
 * - all (bool): si vrai tout les enfants du dossier seront listé.
 * 
 * Cette méthode crée une arborescence des dossiers `folder`.
 *  
 * <p class="note">Attention cette méthode peut être longue sur de grosse arborescence.</p>
 * <p class="note">Si l'arborescence est trop grande spécifier le paramètre `all` à faux pour ne lister les dossiers directement relié au dossier `folder`.</p>
 *
 **/
	public static function Tree($folder, $all = true){
		
		$array['length'] = 0;
		
		$dir = 		@opendir($folder);
		
		if($dir) {
		
			while (($file = readdir( $dir ) ) !== false ) {
									
				if(substr($file, 0, 1) == '.' ) continue;
				if(is_file($folder.$file)) continue;
								
				$array[$array['length']] = new File(utf8_encode($folder.$file));
			
				//if($all) $array[$array['length']]->childs = self::Tree($folder.$file.'/');
				
				$array['length']++;
			}
		}
		
		return $array;
	}
/*
 * Stream.xmlToArray(xml) -> array
 *
 * Cette méthode convertit un flux XML en Tableau.
 **/
 	public static function XMLToArray($simpleXmlElementObject, &$recursionDepth=0) {
			
		if(is_string($simpleXmlElementObject)){
			$simpleXmlElementObject = simplexml_load_string($simpleXmlElementObject);	
		}
		
		return self::_xmlToArray($simpleXmlElementObject);
	}
	
	private static function _xmlToArray($simpleXmlElementObject, &$recursionDepth=0) {
			
		//if(is_string($simpleXmlElementObject)){
		//	$simpleXmlElementObject = simplexml_load_string($simpleXmlElementObject);	
		//}
			
		if(!defined("DEBUG")){
			define("DEBUG", false);
		}
		
		if(!defined("MAX_RECURSION_DEPTH_ALLOWED")){
			// Maximum Recursion Depth that we can allow.
			define("MAX_RECURSION_DEPTH_ALLOWED", 25);
		}
		if(!defined("SIMPLE_XML_ELEMENT_OBJECT_PROPERTY_FOR_ATTRIBUTES")){
			// SimpleXMLElement object property name for attributes
			define("SIMPLE_XML_ELEMENT_OBJECT_PROPERTY_FOR_ATTRIBUTES", "@attributes");
		}
		
		if(!defined("SIMPLE_XML_ELEMENT_PHP_CLASS")){
			// SimpleXMLElement object name.
			define ("SIMPLE_XML_ELEMENT_PHP_CLASS", "SimpleXMLElement");
		}
		
		if ($recursionDepth > MAX_RECURSION_DEPTH_ALLOWED) {
			// Fatal error. Exit now.
			return NULL;
		}


		if($recursionDepth == 0) {
			
			if (!$simpleXmlElementObject instanceof SimpleXMLElement) {
				return NULL; 
			} else {
				$callerProvidedSimpleXmlElementObject = $simpleXmlElementObject;
			}
		}


		if ($simpleXmlElementObject instanceof SimpleXMLElement) {
			// Get a copy of the simpleXmlElementObject
			$copyOfsimpleXmlElementObject = $simpleXmlElementObject;
			// Get the object variables in the SimpleXmlElement object for us to iterate.
			$simpleXmlElementObject = get_object_vars($simpleXmlElementObject);
		}

		// It needs to be an array of object variables.
		if (is_array($simpleXmlElementObject)) {
			// Initialize the result array.
			$resultArray = array();
			
			// Is the input array size 0? Then, we reached the rare CDATA text if any.
			if (count($simpleXmlElementObject) <= 0) {
				// Let us return the lonely CDATA. It could even be
				// an empty element or just filled with whitespaces.
				return (trim(strval($copyOfsimpleXmlElementObject)));
			}
			
			
			// Let us walk through the child elements now.
			foreach($simpleXmlElementObject as $key=>$value) {
				$recursionDepth++; 
				$resultArray[$key] = 
				self::_xmlToArray($value, $recursionDepth);
				$recursionDepth--;
			}
			
			
			if ($recursionDepth == 0) {
				// That is it. We are heading to the exit now.
				// Set the XML root element name as the root [top-level] key of
				// the associative array that we are going to return to the caller of this
				// recursive function.
				$tempArray = $resultArray;
				$resultArray = array();
				$resultArray[$callerProvidedSimpleXmlElementObject->getName()] = $tempArray;
			}
			return ($resultArray);
		}
		// We are now looking at either the XML attribute text or
		// the text between the XML tags.
		return (trim(strval($simpleXmlElementObject)));

	}
/**
 * Stream.Rename(oldname, newname) -> bool
 * - oldname (String): Nom du dossier ou fichier.
 * - newname (String): Nouveau nom du dossier ou fichier.
 *
 * Cette méthode de renommer le dossier ou fichier `oldname` en `newname`.
 **/
	public static function Rename($old, $new){
		
		if(is_file($new)) {
			$extension = self::Extension($new);
			
			$newname = str_replace('.'.$extension, '', $new);
			$i = 1;
			
			while(is_file($newname.'('.$i.').'.$extension)){
				$i++;
			}
			
			$new = $newname.'('.$i.').'.$extension;
		}
		elseif(is_dir($new)){
			
			$i = 1;
			
			while(is_file($new.'('.$i.')')){
				$i++;
			}
			
			$new = $new.'('.$i.')';
		}
		
		if(rename($old, $new)) return $new;
		return false;
	}
/**
 * Stream.StripTags(str) -> String
 * - str (String): Chaine de caratère à convertir.
 * 
 * Cette méthode supprime les balises HTML et 
 **/
	public static function StripTags($string){
				
		// ----- remove HTML TAGs -----
		$search = array('@<script[^>]*?>.*?</script>@si',  // Strip out javascript
               '@<[\/\!]*?[^<>]*?>@si',            // Strip out HTML tags
               '@<style[^>]*?>.*?</style>@siU',    // Strip style tags properly
               '@<![\s\S]*?--[ \t\n\r]*>@'         // Strip multi-line comments including CDATA
		);
		
		$string = preg_replace($search, '', $string); 
		$string = strip_tags ($string);
	   
		// ----- remove control characters -----
		$string = str_replace("\"", '', $string);    // --- replace with empty space
		$string = str_replace("\r", '', $string);    // --- replace with empty space
		$string = str_replace("\n", ' ', $string);   // --- replace with space
		$string = str_replace("\t", ' ', $string);   // --- replace with space
	   
		// ----- remove multiple spaces -----
		$string = trim(preg_replace('/ {2,}/', ' ', $string));
		
		return $string;
	}
/**
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
			
			@self::MkDir($dest);
				
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
/**
 * Stream.Move(src, dest [, pattern]) -> bool
 * - src (String): Lien du fichier.
 * - dest (String): Lien du fichier de destination.
 * - pattern (String): Expression régulière indiquant quels sont les fichiers à ne pas déplacer.
 *
 * Cette méthode tente de déplacer un fichier ou dossier vers `dest`.
 **/
	public static function Move($src, $dest, $pattern = ''){
		$src = 	str_replace('//','/', $src);
		$dest = str_replace('//','/', $dest);
			
		if(!is_dir($src)){
			if(rename($src, $dest)) return $dest;
		}else{
			@self::MkDir($dest);
			
			$objects = scandir($src);
			
			foreach ($objects as $object) {
				
				if ($object != "." && $object != "..") {
					$paths = $src."/".$object;
					$pathd = $dest.'/'.$object;
					
					if($pattern != '' && preg_match($pattern, $object)){
						continue;	
					}
					
					self::Move($paths, $pathd, $pattern);
				}
			}
			
			if($pattern != '' && preg_match($pattern, $src)){
				//@self::Delete($src);
			}
		}
				
		return false;
	}

/**
 * Stream.Write(file, content) -> bool
 * - file (String): Lien du fichier.
 * - content (String): Contenu à écrire dans le fichier.
 *
 * Cette méthode écrit le contenu `content` dans le fichier `file`.
 *
 * <p class="note">[[Stream]] gère l'ouverture et la fermeture des flux</p>
 **/
	public static function Write($file, $mixed, $mode = 'w'){
		
		$handle = 	fopen($file, $mode);
		
		if(!$handle){
			//throw(new Exception	('Failed to open stream: No such file or directory in '.$file));
			return false;
		}
		
		if(is_array($mixed)){
			$str = '';
			for($i = 0; $i < count($mixed); $i++) $str .= $mixed[$i];
			
		}else $str = $mixed;
		
		fwrite($handle, $str);
		fclose($handle);
		
		return true;
	}
/**
 * Stream.WriteCSV(file, array [, header [, parse [, enclosure]]]) -> bool
 * - file (String): Lien du fichier.
 * - array (array): Tableau de données.
 * - header (array): Liste des colonnes à enregistrer dans le fichier.
 * - parse (char): Caractère de séparation.
 * - enclosure (char): Caractère d'enclosure des chaines de caractères.
 *
 * Cette méthode écrit le contenu `array` dans le fichier `file` au format CSV.
 *
 * <p class="note">[[Stream]] gère l'ouverture et la fermeture des flux</p>
 **/
	public static function WriteCSV($file, $array, $header = false, $parse = ';', $enclosure = '"'){
		$handle = 	fopen($file, "w+");
		
		if(!$handle) return false;
		
		//vérification du type tableau
		if($array['length'] != ''){
			$length = $array['length'];	
		}else{
			$length = count($array['length']);	
		}
		if($length == 0) return;
		
		$width = 	0;
		$is_assoc = false;
		
		if(!$header){//pas d'entete donc recherche d'une entete
			$header = array();
			
			foreach($array[0] as $key => $value){
				if(is_numeric($key)) continue;
				$header[] = 		$key;
				
			}
			
			$width = count($header);
			
			if($width > 0){
				//fputcsv($handle, $header, $parse, $enclosure);
				self::WriteLineCSV($handle, $header, $parse, $enclosure);
				$is_assoc = true;
			}else{
				$width = count($array[0]);
			}
			
		}else{//il y a une entete, on vérifie sont type
		
			$width = 			count($header);
			$header_ =			array();
			$header_string = 	array();
			$is_assoc = 		true;
			
			if(is_array($header[0])){
				
				for($i = 0; $i < $width; $i++){
					$header_[] = 		$header[$i][0];
					$header_string[] = 	utf8_decode($header[$i][1]);
				}
				
				$header = $header_;
				
				//var_dump($header_string);
				//fputcsv($handle, $header_string, $parse, $enclosure);
				self::WriteLineCSV($handle, $header_string, $parse, $enclosure);
			}else{
				//fputcsv($handle, $header, $parse, $enclosure);
				self::WriteLineCSV($handle, $header, $parse, $enclosure);
			}		
		}
						
		//ecriture du corps du fichier
		for($i = 0; $i < $length; $i++){
			$row = array();
			
			for($y = 0; $y < $width; $y++){
				
				if($is_assoc){//tableau associatif
					$value = is_object($array[$i]) ? $array[$i]->{$header[$y]} : $array[$i][$header[$y]];
					
				}else{//tableau indexé
					$value = is_object($array[$i]) ? $array[$i]->{$y} : $array[$i][$y];
				}
				
				$row[] = utf8_decode($value);
			}
			//écriture de la ligne
			//fputcsv($handle, $row, $parse, $enclosure);
			
			self::WriteLineCSV($handle, $row, $parse, $enclosure);
		}
		
		fclose($handle);
		return true;
	}
	
	final private static function WriteLineCSV($handle, $array, $parser, $enclosure = '"'){
		$str = implode($enclosure.$parser.$enclosure, $array);
		
		fwrite($handle, $enclosure.str_replace(array("\r","\n"), "", $str).$enclosure.$parser."\r\n");
	}
/**
 * Stream.WriteXML(file, xmlNode [, header]) -> bool
 * - file (String): Lien du fichier.
 * - xmlNode (XmlNode): Noeud principal du conteneur XML.
 * - header (array): personnalisation de l'entete de description du fichier XML.
 *
 * Cette méthode écrit le contenu `xmlNode` dans le fichier `file` au format XML.
 *
 * <p class="note">[[Stream]] gère l'ouverture et la fermeture des flux</p>
 **/
	public static function WriteXml($file, $XmlNode, $header = ''){
		
		$str = '<?xml version="1.0" encoding="utf-8"?>'.Stream::CARRIAGE;
		$str .= '<!--'.$header.'-->'.Stream::CARRIAGE;
		$str .= $XmlNode;
		
		return self::Write($file, $str);
	}
}
/** section: Library
 * class StreamList
 * includes Stream
 * 
 * Cette classe permet de parcourir un dossier avec les méthodes tels que [[StreamList.next]] ou [[StreamList.prev]].
 * Autrement dit, il s'agit d'un outil de parcours de tableau spécialisé pour les dossiers.
 **/
class StreamList extends Stream{
	private $array = array();
/**
 * new StreamList(path [, pattern = null [, exclude = array [, extension = array]]])
 * - path (String): Lien du dossier.
 * - pattern (String): Expression regulière afin de filtrer la liste retourné.
 * - exclude (array): Liste de fichier à exclure de liste.
 * - extension (array): liste des extentions devant être listé.
 *
 * Cette méthode créée une nouvelle instance de [[StreamList]] et liste l'ensemble des fichiers du dossier.
 * Ensuite utilisez les méthodes [[StreamList.next]] ou [[StreamList.prev]]
 **/
	function __construct($path, $patern = '', $exclude = array(), $extension = array('php')){
		$this->exec($path, $patern, $exclude, $extension);
	}
/**
 * StreamList.current(path [, pattern = null [, exclude = array [, extension = array]]]) -> String
 *
 * Cette méthode liste les fichiers d'un dossier.
 **/
	public function exec($path, $patern = '', $exclude = array(), $extension = array('php')){
		$this->array = self::Listing($path, $patern, $exclude, $extension);
		return $this->array;
	}
/**
 * StreamList.current() -> String
 *
 * Retourne la valeur courant à l'emplacement du pointeur.
 **/
	public function current(){
		return current($this->array);
	}
/**
 * StreamList.key() -> String
 *
 * Retourne la clef courante.
 **/
	public function key(){
		return key($this->array);
	}
/**
 * StreamList.next() -> String
 *
 * Avance le pointeur du tableau et retourne le nom du fichier. 
 **/
	public function next(){
		return next($this->array);
	}	
/**
 * StreamList.prev() -> String
 *
 * Recule le pointeur du tableau et retourne le nom du fichier.
 **/
	public function prev(){
		return prev($this->array);
	}
}
?>