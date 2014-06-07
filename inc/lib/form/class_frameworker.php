<?php
/** section: Library
 * class FrameWorker 
 * includes Stream
 *
 * Cette classe permet de gérer les échanges de fichier entre Window et PHP. Elle permet entre autre de manipuler une instance wLoader de Window JS.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_frameworker.php
 * * Version : 1.1
 * * Date :	09/06/2012
 * * Statut : Stable
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

class FrameWorker extends Stream{
/**
 * FrameWorker.VERSION = 1.1
 * Version de la librairie.
 **/
	const VERSION = 			'1.1';
	static private $Current = 	'';
/**
 * FrameWorker.Start() -> void
 * 
 * Cette méthode prépare l'envoi d'un fichier depuis javascript vers PHP lorsque vous utilisez une instance WindowFormLoader.
 **/
	public static function Start(){
		set_time_limit(0);
		
		if(self::GetType() == 'iframe'){
			echo '<style>html, body{background:black; color: white; font-size:9px; font-family:verdana;}</style>';
			self::Draw("Start...");
		}
		
	}
/**
 * FrameWorker.Stop() -> void
 * 
 * Cette méthode indique que l'envoi d'un fichier depuis javascript vers PHP lorsque vous utilisez une instance WindowFormLoader est terminé.
 **/	
	public static function Stop($obj = NULL){
		if(self::GetType() == 'iframe'){
			
			if(empty($obj)){
				$obj = self::$Current;	
			}
			
			echo '
				<script>
					window.top.getFrameWorker('.self::getID().').onComplete('.json_encode($obj).');
				</script>';
			self::Draw("Stop...");
			
		}else{
			$options = new stdClass();
			
			if(defined('ABS_PATH') && defined('URI_PATH')){
				$options->uri = str_replace(ABS_PATH, URI_PATH, is_string($obj) ? $obj : self::$Current);
			}else{
				$options->uri = is_string($obj) ? $obj : self::$Current;
			}
			
			$options->data = $obj  == '' ? $options->uri : $obj;
			
			echo json_encode($options);	
		}
	}
/**
 * FrameWorker.Error() -> void
 * 
 * Cette méthode indique que l'envoi d'un fichier depuis javascript vers PHP lorsque vous utilisez une instance WindowFormLoader est terminé.
 **/	
	public static function Error($err = '', $description = ''){
		$obj = new stdClass();
		$obj->code = $err;
		
		if(empty($description)){
		
			switch($err){							
				case 'frameworker.upload.extension.err':
					$obj->description = 'The file\'s type is invalid';
					break;
					
				default: 
					switch(str_replace('frameworker.upload.err.', '', $err)){
						case '1':
							$obj->description = 'The uploaded file is too large';
							break;
						case '2':
							$obj->description = 'The uploaded file is too large';
							break;
						case '3':						
							$obj->description = 'The file upload was interrupted';
							break;
						case '4':
							$obj->description = 'The uploaded file is zero size';
							break;
						default: 
							$obj->description =	'Error exception';
					}
					
				break;	
					
			}
		}else{
			$obj->description = $description;
		}
		
		if(self::GetType() == 'iframe'){
			echo '
				<script>
					window.top.getFrameWorker('.self::getID().').onError('.json_encode($obj).');
				</script>';
			self::Draw("Stop...");
		}else{
			echo json_encode($obj);
		}
	}
/**
 * FrameWorker.Updoad(dest [, extension [, exclude]]) -> String
 * - FILES (FILES): Ressource du fichier chargé par un formulaire HTML.
 * - dest (String): Lien du dossier de destination.
 * - extension (String): liste des extensions autorisés, séparé par des `;` .
 * - exclude (String): liste des extensions non autorisés, séparé par des `;` .
 *
 * Cette méthode charge le fichier envoyé par le client dans le dossier de destination `dest`, vérifie si l'extension du fichier
 * correspond aux extensions `ext` autorisés et retourne le lien du fichier.
 **/
	public static function Upload($dest, $extension = '', $exclude = '', $e = ''){
		set_time_limit(0);
		$FILES = self::GetFileInstance();
		
		Stream::CleanNullByte($FILES, false);

		if($FILES['error']){
			self::Error('frameworker.upload.err.'.$FILES['error']);
			die();
		}
		
		$file = 	Stream::Sanitize(basename($FILES['name']));
		$file = 	$dest.$file;
		
		if(!empty($extension)){
			if(!Stream::Accept($FILES, $extension)){
				self::Error('frameworker.upload.extension.err');
				die();
			}
		}
		
		if(!empty($exclude)){
			if(self::Accept($FILES, $exclude)){
				self::Error('frameworker.upload.extension.err');
				die();
			}
		}
		
		//changement de mode
		//chmod($dest, 0755);
		
		if(self::GetType() == 'ajax-post'){
			 Stream::Write($file, base64_decode($FILES['data64']));
		}else{
			
			if(!move_uploaded_file($FILES['tmp_name'], $file)){
				self::Error('frameworker.upload.move.err');
				die();
			}
		}
		
		self::$Current = $file;
		
		return $file;
	}
/**
 * FrameWorker.Download(file) -> void
 * - file (String): Lien du fichier à envoyer vers le poste client.
 *
 * Cette méthode force le téléchargement du fichier `file` vers le poste client.
 **/
	public static function Download($fl, $exit = true, $e = ''){
		$size = filesize($fl);
		$base = basename($fl);
		
		header('Content-Description: File Transfer');
		header("Content-Type: application/force-download");
		header('Content-Type: application/octet-stream'); 
		header("Content-Disposition: attachment; filename=".$base);
		header('Content-Transfer-Encoding: binary');
    	header('Expires: 0');
    	header('Cache-Control: no-cache,must-revalidate');
		header('Pragma: public');
		header('Content-Length: ' . $size);
		
		while (ob_get_level() > 0) {
    		ob_end_clean();
		}
		flush();
		//
    	//
		//
		set_time_limit(0);
		readfile($fl);
		//echo Stream::Read($fl);
		//self::ReadFile($fl);
		
		if($exit){
			exit;
		}
		
	}
	
	/*static function ReadFile($filename, $retbytes=true) {
		$chunksize = 	1 * (1024 * 1024); // how many bytes per chunk
		$buffer = 		'';
		$cnt =			0;
		// $handle = fopen($filename, 'rb');
		
		$handle = Stream::Read($file);
		
		if ($handle === false) {
		   return false;
		}
		
		while (!feof($handle)) {
		   $buffer = fread($handle, $chunksize);
		   echo $buffer;
		   ob_flush();
		   flush();
		   if ($retbytes) {
			   $cnt += strlen($buffer);
		   }
		}
		
		$status = fclose($handle);
		if ($retbytes && $status) {
		   return $cnt; // return num. bytes delivered like readfile() does.
		}
		return $status;
	
	} */
/**
 * FrameWorker.DownloadByPopup(file) -> void
 * - file (String): Lien du fichier à envoyer vers le poste client.
 *
 * Cette méthode force le téléchargement du fichier `file` vers le poste client  en utilisant une fenêtre popup.
 **/
	public static function DownloadByPopup($fl){
		echo "<script>window.top.open('".$fl."', 'download', 'status=no,scrollbars=no,toolbar=no,height=10,width=10');</script>";
	}
	/**
	 * Affiche une chaine de caractère dans le formulaire de chargement.
	 * @param $string Chaine à afficher.
	 * @param $style Style CSS de la ligne.
	 */
	public static function Draw($string, $style=""){
		if(self::GetType() == 'iframe'){
			echo '<script>window.top.getFrameWorker('.self::getID().').trace("<div>FrameWorker> <span style=\"'.$style.'\">'.$string.'</div>");</script>';
		}
	}
	/**
	 * Affiche une message dans la boite de dialogue.
	 */
	public static function Alert($title, $content, $type = "OK"){
		if(self::GetType() == 'iframe'){
			
			echo '
				<script>
					window.top.getFrameWorker('.self::getID().').onError({title:"'.addslashes($title).'", text:"'.addslashes($content).'", type:"'.$type.'"});
				</script>';
		}
	}
	/**
	 * Fait apparaitre la boite de dialogue.
	 */
	public static function ShowAlert(){
		if(self::GetType() == 'iframe'){
			echo '<script>window.top.getFrameWorker('.self::getID().').AlertBox.show()</script>';	
		}
	}
	/**
	 * Fait disparaitre la boite de dialogue.
	 */
	public static function HideAlert(){
		if(self::GetType() == 'iframe'){
			echo '<script>window.top.getFrameWorker('.self::getID().').AlertBox.hide()</script>';
		}
	}
	/**
	 * Cette méthode retourne le numéro de l'instance du formulaire
	 * @return {Number}
	 */
	public static function getID(){
		return (int) $_POST['INSTANCE_ID'];
	}
/**
 * FrameWorker.GetType() -> String
 * Retourne la méthode de chargement du formulaire choisi par la librairie Window JS. Les méthodes de chargement sont `iframe`, `ajax` et `ajax-post`
 **/	
	public static function GetType(){
		
		if(!empty($_POST['FrameWorkerDownload'])){//méthode iFrame
			return 'iframe';	
		}
		
		if(!empty($_FILES['FrameWorker'])){//méthode iFrame
			return 'iframe';	
		}
		
		if(!empty($_FILES['AjaxFile'])){//méthode Ajax
			return 'ajax';	
		}
		
		if(!empty($_POST['AjaxFile'])){//méthode Ajax
			return 'ajax-post';	
		}
	}
/**
 * FrameWorker.GetFileInstance() -> String
 * Cette méthode retourne la bonne instance $_FILES utilisée par la librairie Window JS.
 **/
	public static function GetFileInstance(){
		
		if(!empty($_FILES['FrameWorker'])){//méthode iFrame
			return $_FILES['FrameWorker'];	
		}
		
		if(!empty($_FILES['AjaxFile'])){//méthode Ajax
			return $_FILES['AjaxFile'];	
		}
		
		if(!empty($_POST['AjaxFile'])){//méthode Ajax
			return ObjectTools::DecodeJSON($_POST['AjaxFile']);	
		}
		
		return false;
	}
	/**
	 * Affichage rapide de message informatif dans le formulaire de chargement.
	 * @param {String} msg Message à afficher.
	 * @param {String} icon Icone affiché avec le message. 
	 */
	public static function printMSG($msg, $icon=""){
		if(self::GetType() == 'iframe'){
			echo '<script>window.top.getFrameWorker('.self::getID().').printMSG("'.$msg.'", "'.$icon.'")</script>';
		}
	}
}

?>