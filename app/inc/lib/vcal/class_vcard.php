<?php
/** section: Library
 * class vCarnet
 *
 * Cette classe gère la création de carnet d'adresse.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_vcalendar.php
 * * Statut : BETA
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 * 
 **/
if(!class_exists('vCarnet')):
class vCarnet{
/**
 * vCarnet#vObject -> Array
 * Liste des objets du vCarnet.
 **/
	public $vObject =	array();
/**
 * new vCarnet()
 *
 * Cette méthode créée une nouvelle instance [[vCarnet]].
 **/	
	public function __construct(){}
/**
 * vCarnet#toString() -> String
 **/	
	public function __toString(){
				
		//ajout des objets du vCalendar
		$length = 	count($this->vObject);
		$str = 		'';
		
		for($i = 0; $i < $length; $i++){
			$str .= $this->vObject[$i].vCalendar::CARRIAGE;
		}
		
		return $str;	
	}
/*
 * 
 **/	
	public function Package($folder){
		
		Stream::MkDir($folder, 0751);  
		Stream::Write($folder.'vcard.vcf', $this->__toString());
		  
		return $folder.'vcard.vcf';
	}
/**
 * vCarnet#push(obj) -> void
 * - obj (vCard): Objet a ajouter à l'instance vCarnet.
 *
 * Cette méthode ajoute un objet à l'instance.
 **/	
	public final function push($obj){
		$this->vObject[] = $obj;
	}
	
	public static function Download($file){
		header("Content-Type: text/x-vCard");
    	header("Content-Disposition: inline; filename=".basename($file));
		readfile($file); 	
	}
}
endif;
/** section: Library
 * class vCard
 *
 * Cette classe gère la création d'une vCard selon la version 3.0.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_vcalendar.php
 * * Version : 3.0
 * * Statut : BETA
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 * 
 **/
if(!class_exists('vCard')):
class vCard{
/**
 * vCard.TAG -> String
 * Balise d'ouverture de la vCard.
 **/	
	const TAG = 			'VCARD';
/**
 * vCard.VERSION -> String
 * Version de la vCard.
 **/	
	const VERSION = 		'3.0';
/**
 * vCard#Name -> String
 **/
	public $Name =			'';
/**
 * vCard#FirstName -> String
 **/	
	public $FirstName =		'';
/**
 * vCard#Org -> String
 **/	
	public $Org =			'';
/**
 * vCard#Title -> String
 **/	
	public $Title =			'';
/**
 * vCard#Note -> String
 **/	
	public $Note =			'';
/**
 * vCard#Tel -> String
 **/	
	public $Tel	=			'';
/**
 * vCard#TelWork -> String
 **/	
	public $TelWork	=		'';
/**
 * vCard#Mobile -> String
 **/	
	public $Mobile	=		'';
/**
 * vCard#Fax -> String
 **/	
	public $Fax =			'';
/**
 * vCard#Address -> String
 **/	
	public $Address =		'';
/**
 * vCard#City -> String
 **/	
	public $City =			'';
/**
 * vCard#Code -> String
 **/	
	public $Code =			'';
/**
 * vCard#Country -> String
 **/	
	public $Country =		'';
/**
 * vCard#Email -> String
 **/	
	public $Email =			'';
/**
 * vCard#Rev -> String
 **/	
	public $Rev =			'';
/**
 * new vCard()
 *
 * Cette méthode créée une nouvelle instance [[vCard]].
 **/	
	function __construct(){}
	
	static public function ParseFile($file){
		$lines = 	Stream::ReadToArray($file);
		$cards = 	array();
		
		$card = 	new self();
		
		while($card->parse($lines)){
			array_push($cards, $card);
			// MDH: Create new VCard to prevent overwriting previous one (PHP5)
			$card = new self();
		}
		
		return $cards;
	}
/*
 *
 **/	
	function parse(&$lines){
               
		$property = new vProperty();
				
        while ($property->parse($lines)) {
				
			switch($property->name){
								
				case 'FN':	
				case 'BEGIN':
				case 'LABEL':
				case 'VERSION':break;
				
				case 'N':
					$values = explode(';', $property->value);
					$this->Name = 		$values[0];
					$this->FirstName = 	$values[1];
					break;
				case 'EMAIL':
				case 'REV':
				case 'NOTE':
					$this->{ucfirst(strtolower($property->name))} = $property->value;
					break;
				
				case 'ORG':
					$this->{ucfirst(strtolower($property->name))} = str_replace(';', '', $property->value);
					break;
				
				case 'TEL':
					switch($property->params['TYPE'][0]){
						case 'HOME':
							$this->Tel = $property->value;
							break;
						case 'WORK':
							if(@$property->params['TYPE'][1] == 'Fax'){
								$this->Fax = $property->value;
							}else{
								$this->TelWork = $property->value;
							}
							break;
						case 'CELL':
							$this->Mobile = $property->value;
							break;
					}
					
					break;
				case 'ADR':
					$values = explode(';', $property->value);
					$this->Address =	$values[0];
					$this->City = 		$values[1];
					$this->Code = 		$values[2];
					$this->Country = 	$values[4];
					break;
				case 'END':
					return true;
			}
			
			$property = new vProperty();
        }
		
        return false;
	}
/**
 * vCard#toString() -> String
 **/	
	public function __toString(){
		
		$carriage = vCalendar::CARRIAGE;
		
		$str = 	"BEGIN:".self::TAG.$carriage;
		$str .= "VERSION:".self::VERSION.$carriage;
		$str .= "N:".vCalendar::FormatString($this->Name.';'.$this->FirstName).';;;'.$carriage;
		$str .= "FN:".vCalendar::FormatString($this->FirstName . ' ' .$this->Name).$carriage;
		
		$str .= $this->Org == '' ? 		'' : "ORG:".vCalendar::FormatString($this->Org).';'.$carriage;
		$str .= $this->Title == '' ?  	'' : "TITLE:".vCalendar::FormatString($this->Title).$carriage;
		$str .= $this->Note == '' ? 	'' : "NOTE;ENCODING=QUOTED-PRINTABLE:".vCalendar::FormatString($this->Note).$carriage;
		
		$str .= $this->Tel = '' ? 		'' : "TEL;TYPE=HOME:".vCalendar::FormatString($this->Tel).$carriage;
		$str .= $this->TelWork = ''? 	'' : "TEL;TYPE=WORK:".vCalendar::FormatString($this->TelWork).$carriage;
		
		$str .= $this->Mobile = '' ? 	'' : "TEL;TYPE=CELL:".vCalendar::FormatString($this->Mobile).$carriage;
		$str .= $this->Fax == '' ? 		'' : "TEL;TYPE=WORK;FAX:".vCalendar::FormatString($this->Fax).$carriage;
		
		$str .= "ADR;TYPE=WORK:;;".vCalendar::FormatString($this->Address.';'.$this->City.';'.$this->Code.';;'.$this->Country).$carriage;
		$str .= "LABEL;WORK;ENCODING=QUOTED-PRINTABLE:".vCalendar::FormatString($this->Address.'=0D=0A'.$this->City.', '.$this->Code.' =0D=0A'.$this->Country).$carriage;
		
		$str .= $this->Email != '' ?	'' : "EMAIL;PREF;INTERNET:".vCalendar::FormatString($this->Email).$carriage;
				
		if($this->Rev == '') $this->Rev = date('Y-m-d H:i:00');
		
		$str .= "REV:".vCalendar::FormatDate($this->Rev).$carriage;
		$str .= "END:".self::TAG;
		
		return $str;
	}
}

endif;
?>