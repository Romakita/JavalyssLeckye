<?php
/** section: Library
 * mixin ObjectTools
 *
 * Cet utilitaire gère la convertion d'une instance vers différent format tel que :
 * 
 * * JSON vers une instance de classe.
 * * Une instance de classe vers JSON. 
 * * Un tableau associatif vers une instance de classe.
 * * Une instance de classe vers un tableau associatif.
 * * Un objet générique vers une instance de classe.
 * * Une instance de classe vers un objet générique.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_object_tools.php
 * * Version : 1.5
 * * Date : 20/08/2013
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('ObjectTools')):

abstract class ObjectTools{
/**
 * ObjectTools#toJSON() -> String
 * Convertit l'instance au format JSON.
 **/
	public function toJSON(){
		return json_encode($this->toObject());
	}
/**
 * ObjectTools#evalJSON(json) -> void
 * - json (String): Chaine de caractère au format JSON.
 *
 * Cette méthode évalue la chaine `json` et restaure les attributs de la classe fille.
 **/
	public function evalJSON($json){
		
		if(!is_string($json)){
			return $json;
		}
		
		if(get_magic_quotes_gpc()){
			$json = stripslashes($json);
		}
			
		$json_ = json_decode($json);

		if(empty($json_)){
			$json_ = json_decode($json);
		}
		
		if(empty($json_)){
			$json_ = json_decode(self::RawURLDecode(@$json));
		}
		
		self::JSONError();
		
		$json = $json_;
		
		foreach($this as $key=>$value){
			@$this->$key = self::RawURLDecode(@$json->$key);
		}
		
	}
	
	private static function JSONError(){
		if(function_exists('json_last_error')){
			switch (json_last_error()) {
				case JSON_ERROR_NONE:
					
					break;
					
				case JSON_ERROR_DEPTH:
					die('<pre><code>Profondeur maximale atteinte</code></pre>');
					
					break;
					
				case JSON_ERROR_STATE_MISMATCH:
					die('<pre><code>Inadéquation des modes ou underflow</code></pre>');
					break;
					
				case JSON_ERROR_CTRL_CHAR:
					die('<pre><code>Erreur lors du contrôle des caractères</code></pre>');
					break;
					
				case JSON_ERROR_SYNTAX:
					die('<pre><code>Erreur de syntaxe ; JSON malformé</code></pre>');
					break;
					
				case JSON_ERROR_UTF8:
					die('<pre><code>Caractères UTF-8 malformés, probablement une erreur d\'encodage</code></pre>');
					break;
				default:
					die('<pre><code>Erreur inconnue</code></pre>');
					break;
			}
		}
	}
	
	private static function HasJSONError($obj = NULL){
		if(function_exists('json_last_error')){
			return JSON_ERROR_NONE != json_last_error();
		}
		return empty($obj);
	}
/**
 * ObjectTools.IsJSON(json) -> Boolean
 * - json (String): chaine json.
 *
 * `static` Cette méthode vérifie que le string est un json.
 **/	
	public static function IsJSON($json){
		if(is_string($json)){
			return in_array(substr(trim($json), 0, 1), array('[','{', '"'));
		}
		return false;
	}
/**
 * ObjectTools.IsMail(mail) -> Boolean
 * - mail (String): Adresse e-mail. 
 *
 * `static` Cette méthode vérifie la syntaxe de l'adresse e-mail.
 **/
	static function IsMail($mail, $fct = NULL) {
		if(preg_match('`^(\w(?:[-_. ]?\w)* )?((\w(?:[-_.]?\w)*)@\w(?:[-_.]?\w)*\.(?:[a-z]{2,4}))$`', $mail, $out)) {
			
			if($fct) {
				$nom = empty($out[1]) ? $out[3] : $out[1];
				return ($nom.'<'.$out[2].'>');
			}
			
			return true;
		}
		
		return false;
	}
/**
 * ObjectTools.IsDate(mail) -> Boolean
 * - mail (String): Adresse e-mail. 
 *
 * `static` Cette méthode vérifie la syntaxe de l'adresse e-mail.
 **/	
	static function IsDate($date, $format = 'Y-m-d H:i:s'){
		
		if(self::_test_date($date, $format)){
			return true;	
		}
		
		if(strlen($date) > 10){
			return self::_test_date($date) || self::_test_date($date, 'd/m/Y H:i:s') || self::_test_date($date, 'm.d.Y H:i:s');
		}
				
		return self::_test_date($date, 'Y-m-d') || self::_test_date($date, 'd/m/Y') || self::_test_date($date, 'm.d.Y');
	}
	
	static function _test_date($date, $format = 'Y-m-d H:i:s'){
		$d = DateTime::createFromFormat($format, $date);
		return $d && $d->format($format) == $date;	
	}
/**
 * ObjectTools.DateFormat(date) -> String
 * - date (String): Date au format 'Y-m-d H:i:s';
 *
 * Cette méthode formate une date. Voir syntaxe PHP des dates pour la méthode strftime.
 **/	
	static public function DateFormat($date, $format = '', $lang = 'fr', $encode = 'uft8'){
		
		//setlocale(LC_TIME, $lang.'_'.strtoupper($lang));
		
		$strlang = strtolower(substr($lang, 0, 2)).'_'.strtoupper(substr($lang, 0, 2)).'.'.$encode;
		
		setlocale (LC_TIME, $strlang, $encode);

		$date = explode(' ', $date);
		
		$date[0] = explode('-', $date[0]);
		
		if(count($date) == 1){
			$date[1] = array(0,0,0);
		}else{
			$date[1] = explode(':', $date[1]);
		}
		
		if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {
			$format = preg_replace('#(?<!%)((?:%%)*)%e#', '\1%#d', $format);
		}
		
		return str_replace(array(
				'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
				'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
			), array(
				'Janvier', 'Février', 
				'Mars', 'Avril', 
				'Mai', 'Juin', 
				'Juillet', 'Août', 
				'Septembre', 'Octobre', 
				'Novembre', 'Décembre',
				'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
			), strftime($format, mktime($date[1][0], $date[1][1], $date[1][2], $date[0][1], $date[0][2], $date[0][0])));
	}
	
	static function TimestampToDate($Timestamp){
		$y = 	substr($Timestamp,0,4);
		$m = 	substr($Timestamp,4,2);
		$d = 	substr($Timestamp,6,2);
		$h = 	substr($Timestamp,8,2);
		$i = 	substr($Timestamp,10,2);
		$s = 	substr($Timestamp,12,2);
		
		return $y.'-'.$m.'-'.$d.' '.$h.':'.$i.':'.$s;
	}
/**
 * ObjectTools.PhoneFormat(phonenumber [, char [, splitLength]]) -> String
 * - phonenumber (String): Numéro de téléphone à formater.
 * - char (String): Caractère de séparation. Par défaut, c'est un espace blanc.
 *
 * Cette méthode formate un numéro de téléphone.
 **/	
	static public function PhoneFormat($phone, $char = ' ', $splitLength = 2){
		$label = '';
		
		if(strpos($phone, ':') !== false){
			$label = explode(':', $phone);
			$phone = trim($label[1]);
			
			$label = $label[0] . ':' . (strlen($phone) != strlen($label[1]) ? ' ' : ''); 
		}
		
		return $label . implode($char, str_split(trim($phone), $splitLength));
	}
/**
 * ObjectTools.DecodeJSON(json) -> Object
 * - json (String): Chaine de caractère à décoder.
 *
 * Cette méthode static décode une chaine JSON.
 **/
	public static function DecodeJSON($json, $try = false, $strip = true){
		
		if(!is_string($json)){
			return $json;
		}
		
		if(get_magic_quotes_gpc() && $strip){
			$json = stripslashes($json);
		}
				
		$json_ = json_decode($json);

		if(empty($json_)){
			$json_ = json_decode($json);
		}
		
		$json = $json_;
		
		if(!$try){
			self::JsonError();
		}
		
		return self::HasJSONError($json) ? NULL : self::RawURLDecode($json);
	}
/**
 * ObjectTools.Unserialize(json) -> Object
 * - json (String): Chaine de caractère à décoder.
 *
 * Cette méthode static décode une chaine JSON.
 **/
	public static function Unserialize($json){
		
		$json_ = unserialize(stripslashes($json));

		if(empty($json_)){
			$json_ = unserialize($json);
		}
		
		$json = $json_;
		
		return self::RawURLDecode($json);
	}
/**
 * ObjectTools.RawURLDecode(json) -> Object
 * - json (String): Chaine de caractère à décoder.
 *
 * Cette méthode static applique la fonction rawurldecode sur un objet.
 **/	
	public static function RawURLDecode($obj){
		if(is_numeric($obj)) return $obj;
		
		if(is_string($obj)) {
			
			if(self::IsJSON($obj)){
				
				$j = self::DecodeJSON($obj, true, false);
				
				if(!empty($j)){					
					return $j;
				}else{
					$j = self::DecodeJSON($obj, true);	
					return $j;
				}
			}
			
			if(get_magic_quotes_gpc()){
				$obj = stripslashes($obj);
			}
						
			return rawurldecode($obj);
		}
		
		if(is_array($obj)){
			foreach($obj as $key => $value){
				$obj[$key] = self::RawURLDecode($value);	
			}
		}elseif(is_object($obj)){
			foreach($obj as $key => $value){
				$obj->$key = self::RawURLDecode($value);
			}
		}
		
		return $obj;
	}
/**
 * ObjectTools#toObject() -> Object
 * 
 * Cette méthode retourne un objet générique équivalent à l'instance.
 **/
	public function toObject(){
		$obj = new stdClass();
		foreach($this as $key=>$value){
			$obj->$key = $value;
		}
		return @$obj;
	}
/**
 * ObjectTools#toArray() -> Array
 * 
 * Cette méthode retourne un tableau associatif équivalent à l'instance.
 **/
	public function toArray(){
		$obj = array();
		foreach($this as $key=>$value){
			$obj[$key] = $value;
		}
		return @$obj;
	}
/**
 * ObjectTools#setObject(obj) -> Object
 * - obj (Object): Objet générique équivalent à l'instance.
 *
 * Cette méthode récupère les informations de l'objet équivalent à l'instance.
 **/
	public function setObject($obj){
		foreach($this as $key=>$value){
			$this->$key = self::RawURLDecode(@$obj->$key);
		}
	}
/**
 * ObjectTools#setArray(array) -> Object
 * - array (Array): Tableau associatif équivalent à l'instance.
 *
 * Cette méthode récupère les informations du tableau associatif équivalent à l'instance.
 **/
	public function setArray($obj){
		foreach($this as $key=>$value){
			$this->$key = self::RawURLDecode(@$obj[$key]);
		}
	}
/**
 * ObjectTools#extend(obj) -> void
 * - obj (Array | Object): Objet ou tableau associatif.
 *
 * Cette méthode ajoute les informations de l'objet `obj` à l'instance.
 **/
	public function extend($obj){
		if(is_object($obj) || is_array($obj)){
			foreach($obj as $key=>$value){
				@$this->$key = self::RawURLDecode(@$value);
			}
		}
	}
/**
 * ObjectTools.ArrayToObject(a) -> void
 * - a (Array): Objet ou tableau associatif.
 *
 * Cette méthode convertie un tableau de données en objet.
 **/	
	public static function ArrayToObject($a){
		if(is_string($a)){
			$a = self::DecodeJSON($a);	
		}
		
		if(is_object($a) || is_array($a)){
			$o = new stdClass();
			
			foreach($a as $key => $value){
				$o->$key = self::RawURLDecode(@$value);
			}
			
			return $o;
		}			
	}
/**
 * ObjectTools.DataMerge(a) -> Array
 * - a (Array): tableau de données.
 *
 * Cette méthode créée un tableau de données d'une ligne à partir d'un tableau de données complet.
 *
 **/	
	public static function DataMerge($array){
		
		$config = array();
		
		for($i = 0, $len = count($array); $i < $len; $i++){
			
			$complete = true;
			
			foreach($array[$i] as $key => $value){
				
				if(empty($config[$key])){
					$config[$key] = $value;
					$complete = false;
					continue;
				}
			}
			
			if($complete){
				return $config;	
			}
		}
		
		return $config;
	}
}

endif;
?>