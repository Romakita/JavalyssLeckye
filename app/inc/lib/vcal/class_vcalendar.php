<?php
/** section: Library
 * class vCalendar
 *
 * Cette classe gère la création de vCalendar (standard 2.0).
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_vcalendar.php
 * * Version : 2.0
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 * 
 **/
if(!class_exists('vCalendar')):

require_once('class_vevent.php');
require_once('class_vtodo.php');
require_once('class_valarm.php');
require_once('class_vcard.php');

class vCalendar{
/**
 * vCalendar.CARRIAGE -> String
 * Constante de retour chariot.
 **/
	const CARRIAGE = 	"\r\n";
/**
 * vCalendar.VERSION -> String
 * Version de la vCard.
 **/
	const VERSION = 	'2.0';
/**
 * vCalendar.TAG -> String
 * Balise d'ouverture de la vCalendar.
 **/	
	const TAG = 		'VCALENDAR';
/**
 * vCalendar#PropID -> String
 * Priorietaire de la vCard.
 **/	
	public $PropID = 	'vCalendarManager';
/**
 * vCalendar.TZ -> String
 * Zone horaire.
 **/
	public $TZ =		'+01';
/**
 * vCalendar.vObject -> Array
 * Liste des objets de la vcard.
 **/
	public $vObject =	array();
/**
 * new vCalendar()
 *
 * Cette méthode créée une nouvelle instance [[vCalendar]].
 **/	
	public function __construct(){}
/**
 * vCalendar#toString() -> String
 **/
	public function __toString(){
		
		$carriage = self::CARRIAGE;
		
		$str = 	"BEGIN: ".self::TAG.$carriage;
		$str .= "VERSION: ".self::VERSION.$carriage;
		$str .= "PROPID: ".$this->PropID.$carriage;
		$str .= "TZ: ".$this->TZ.$carriage;
		
		//ajout des objets du vCalendar
		$length = count($this->vObject);
		
		for($i = 0; $i < $length; $i++){
			$str .= $this->vObject[$i].self::CARRIAGE;
		}
		
		$str .= 	"END: ".self::TAG;
		
		return $str;	
	}
/**
 * vCalendar#push(obj) -> void
 * - obj (vEvent | vAlarm | vTodo): Objet a ajouter à l'instance vCalendar.
 *
 * Cette méthode ajoute un objet à l'instance.
 **/	
	public final function push($obj){
		$this->vObject[] = $obj;
	}
/** deprecated
 * vCalendar.Download(file) -> void
 * - file (String): Lien du fichier à télécharger.
 *
 * Cette méthode force le téléchargement du fichier.
 **/
	public static function Download($file){
		error_reporting(0);

		//header("Content-Type: text/x-vCalendar");
		header("Content-type: application/force-download");
		header('Content-Type: application/octet-stream'); 
		header("Content-Transfer-Encoding: Binary");
    	header("Content-Disposition: inline; filename=".basename($file));
		header("Expires: 0");
		header("Cache-Control: no-cache, must-revalidate");
		header("Pragma: no-cache"); 
		header('Content-Length: ' . filesize($fl));
		
		readfile($file); 	
	}
/**
 * vCalendar.FormatString(str) -> String
 * - str (String): Chaine à convertir.
 *
 * Cette méthode convertit la retour chariot `\r` par la chaine `=0D=0A=`.
 **/
	public static function FormatString($str){
		//return utf8_decode(str_replace("\r", "=0D=0A=", $str));
		return str_replace("\r", "=0D=0A=", $str);
	}
/**
 * vCalendar.FormatDate(str) -> String
 * - str (String): Chaine à convertir.
 *
 * Cette méthode convertit la chaine en date vCalendar.
 **/
	public static function FormatDate($strDate){
		$strback = 		$strDate;
		$strDate = 		explode(' ', $strDate);
		
		//if(count($strDate) == 2) return $strback;
		
		$strDate[0] = 	str_replace('-','', $strDate[0]);
		$strDate[1] = 	explode(':', $strDate[1]);
		$strDate[1] = 	$strDate[1][0] . $strDate[1][1].'00Z';
		
		return $strDate[0].'T'.$strDate[1];
	}
}
/** section: Library
 * class vProperty
 *
 * Cette classe gère la création propriété pour les classes [[vCalendar]], [[vCard]], [[vEvent]], etc...
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_vcalendar.php
 * * Version : 2.0
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 * 
 **/
class vProperty{
/**
 * vProperty#name -> String
 **/
    var $name;          // string
/**
 * vProperty#params -> Array
 **/
    var $params;        // params[PARAM_NAME] => value[,value...]
/**
 * vProperty#params -> String
 **/
    var $value;         // string
/**
 * vProperty#parse(lines) -> Boolean
 *
 * Parses a vCard property from one or more lines. Lines that are not
 * property lines, such as blank lines, are skipped. Returns false if
 * there are no more lines to be parsed.
 **/
    public function parse(&$lines){
		
        while (list(, $line) = each($lines)) {
            $line = rtrim($line);
            $tmp = $this->split_quoted_string(":", $line, 2);
				
            if (count($tmp) == 2) {
                $this->value = $tmp[1];
                $tmp = strtoupper($tmp[0]);
                $tmp = $this->split_quoted_string(";", $tmp);
				
                $this->name = $tmp[0];
                $this->params = array();
				
                for ($i = 1; $i < count($tmp); $i++) {
                    $this->_parseParam($tmp[$i]);
                }
				
				if (!empty($this->params['ENCODING']) && $this->params['ENCODING'][0] == 'QUOTED-PRINTABLE') {
					$this->_decodeQuotedPrintable($lines);
				}
				
				if (!empty($this->params['CHARSET']) && $this->params['CHARSET'][0] == 'UTF-8') {
					$this->value = utf8_decode($this->value);
				}
				
                return true;
            }
        }
        return false;
    }
    /*
     * Splits the value on unescaped delimiter characters.
     */
    public function getComponents($delim = ";"){
        $value = $this->value;
        // Save escaped delimiters.
        $value = str_replace("\\$delim", "\x00", $value);
        // Tag unescaped delimiters.
        $value = str_replace("$delim", "\x01", $value);
        // Restore the escaped delimiters.
        $value = str_replace("\x00", "$delim", $value);
        // Split the line on the delimiter tag.
        return explode("\x01", $value);
    }

    // ----- Private methods -----

    /*
     * Parses a parameter string where the parameter string is either in the
     * form "name=value[,value...]" such as "TYPE=WORK,CELL" or is a
     * vCard 2.1 parameter value such as "WORK" in which case the parameter
     * name is determined from the parameter value.
     */
    private function _parseParam($param){
        $tmp = $this->split_quoted_string('=', $param, 2);
		
        if (count($tmp) == 1) {
            $value = $tmp[0]; 
            $name = $this->_paramName($value);
            $this->params[$name][] = $value;
        } else {
            $name = $tmp[0];
            $values = $this->split_quoted_string(',', $tmp[1]); 
            foreach ($values as $value) {
                $this->params[$name][] = $value;
            }
        }
    }

    /*
     * The vCard 2.1 specification allows parameter values without a name.
     * The parameter name is then determined from the unique parameter value.
     */
    private function _paramName($value){
		
        static $types = array (
			'DOM', 'INTL', 'POSTAL', 'PARCEL','HOME', 'WORK',
			'PREF', 'VOICE', 'FAX', 'MSG', 'CELL', 'PAGER',
			'BBS', 'MODEM', 'CAR', 'ISDN', 'VIDEO',
			'AOL', 'APPLELINK', 'ATTMAIL', 'CIS', 'EWORLD',
			'INTERNET', 'IBMMAIL', 'MCIMAIL',
			'POWERSHARE', 'PRODIGY', 'TLX', 'X400',
			'GIF', 'CGM', 'WMF', 'BMP', 'MET', 'PMB', 'DIB',
			'PICT', 'TIFF', 'PDF', 'PS', 'JPEG', 'QTIME',
			'MPEG', 'MPEG2', 'AVI',
			'WAVE', 'AIFF', 'PCM',
			'X509', 'PGP'
		);
				
        static $values = 	array ( 'INLINE', 'URL', 'CID');
        static $encodings = array ('7BIT', 'QUOTED-PRINTABLE', 'BASE64');
		
        $name = 'UNKNOWN';
		
        if (in_array($value, $types)) {
            $name = 'TYPE';
        } elseif (in_array($value, $values)) {
            $name = 'VALUE';
        } elseif (in_array($value, $encodings)) {
            $name = 'ENCODING';
        }
		
        return $name;
    }

    /*
     * Decodes a quoted printable value spanning multiple lines.
     */
    private function _decodeQuotedPrintable(&$lines){
        $value = &$this->value;
        while ($value[strlen($value) - 1] == "=") {
            $value = substr($value, 0, strlen($value) - 1);
            if (!(list(, $line) = each($lines))) {
                break;
            }
            $value .= rtrim($line);
        }
        $value = quoted_printable_decode($value);
    }
	
	private function split_quoted_string($d, $s, $n = 0){
		$quote = false;
		$len = strlen($s);
		for ($i = 0; $i < $len && ($n == 0 || $n > 1); $i++) {
			$c = $s{$i};
			if ($c == '"') {
				$quote = !$quote;
			} else if (!$quote && $c == $d) {
				$s{$i} = "\x00";
				if ($n > 0) {
					$n--;
				}
			}
		}
		return explode("\x00", $s);
	}
}
endif;
?>