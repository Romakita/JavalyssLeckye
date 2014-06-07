<?php
/** section: Agenda
 * class AgendaEvent
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_agenda_event.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
include_once('class_agenda_event_io.php');

class AgendaEvent extends AgendaEventIO implements iClass, iSearch{	
	const PRE_OP =				'agenda.event.';
/**
 * AgendaEvent.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'agenda_events';	
/**
 * AgendaEvent.PRIMARY_KEY -> String
 * Clef primaire de la table AgendaEvent.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Event_ID';

/**
 * AgendaEvent#Event_ID -> Number
 **/
	public $Event_ID = 0;
/**
 * AgendaEvent#User_ID -> Number
 **/
	public $User_ID = 0;
/**
 * AgendaEvent#Owner_ID -> Number
 **/
	public $Owner_ID = 0;
/**
 * AgendaEvent#Contact_ID -> Number
 **/
	public $Contact_ID = 0;
/**
 * AgendaEvent#Contact -> Number
 **/
	public $Contact = 0;
/**
 * AgendaEvent#Recall -> Number
 **/
	public $Recall = -1;
/**
 * AgendaEvent#Title -> String
 * Varchar
 **/
	public $Title = "";
/**
 * AgendaEvent#Comment -> String
 * Text
 **/
	public $Comment = "";
/**
 * AgendaEvent#Date_Start -> Datetime
 **/
	public $Date_Start = '0000-00-00 00:00:00';
/**
 * AgendaEvent#Date_End -> Datetime
 **/
	public $Date_End = '0000-00-00 00:00:00';
/**
 * AgendaEvent#Location -> String
 * Varchar
 **/
	public $Location = "";
/**
 * AgendaEvent#Date_Create -> Datetime
 **/
	public $Date_Create = '0000-00-00 00:00:00';
/**
 * AgendaEvent#Date_Update -> Datetime
 **/
	public $Date_Update = '0000-00-00 00:00:00';
/**
 * AgendaEvent.Statut -> String
 **/	
	public $Statut =		'busy';
/**
 * AgendaEvent.Type -> String
 **/	
	public $Type =			'agenda';
/**
 * AgendaEvent.Contacts -> Array
 **/		
	public $Contacts =		'';
/**
 * AgendaEvent.Users -> Array
 **/		
	public $Users =		'';
/**
 * new AgendaEvent()
 * new AgendaEvent(json)
 * new AgendaEvent(array)
 * new AgendaEvent(obj)
 * new AgendaEvent(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[AgendaEvent]].
 * - array (Array): Tableau associatif équivalent à une instance [[AgendaEvent]]. 
 * - obj (Object): Objet équivalent à une instance [[AgendaEvent]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[AgendaEvent]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				$request = 			new Request();
				
				$request->select = 	self::TABLE_NAME . '.*, Date_Start as start, Date_End as end, Title as title, CONCAT(U.Name, " ", U.FirstName) User, CONCAT(O.Name, " ", O.FirstName) Owner, DATE_FORMAT(Date_Start, \'%Y-%m-%d\') as Date_Group';
				$request->from = 	self::TABLE_NAME . ' INNER JOIN ' . User::TABLE_NAME . ' U ON '.self::TABLE_NAME.'.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY . ' 
									LEFT JOIN ' . User::TABLE_NAME . ' O ON '.self::TABLE_NAME.'.Owner_ID = O.' . User::PRIMARY_KEY;
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$request->observe(array(__CLASS__, 'onGetList'));
				
				$u = $request->exec('select');
				//echo $request->compile();
				if($u['length']){
					$this->extend($u[0]);
				}
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->extend($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);

		}
	}
/**
 * AgendaEvent.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		System::Observe('system.search', array(__CLASS__, 'Search'));
		
		System::EnqueueScript('agenda.event', Plugin::Uri().'js/agenda_event.js');
		
	}
/**
 * AgendaEvent.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `agenda_events` (
		  `Event_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `User_ID` bigint(20) NOT NULL,
		  `Owner_ID` bigint(20) NOT NULL,
		  `Contact_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Contact` varchar(100) NOT NULL DEFAULT '',
		  `Title` varchar(300) NOT NULL,
		  `Comment` text NOT NULL,
		  `Date_Start` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Date_End` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Location` varchar(255) NOT NULL,
		  `Date_Create` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Date_Update` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Recall` INT( 8 ) NOT NULL DEFAULT '-1',
		  `Statut` varchar(40) NOT NULL DEFAULT 'busy',
		  `Contacts` text NOT NULL,
		  `Users` text NOT NULL,
		  `Type` varchar(50) NOT NULL DEFAULT 'agenda',
		  PRIMARY KEY (`Event_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
			
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `agenda_events` ADD `Contact_ID` BIGINT( 20 ) NOT NULL DEFAULT '0' AFTER `User_ID`";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `agenda_events` ADD `Contact` VARCHAR( 100 ) NOT NULL DEFAULT '' AFTER `Contact_ID`";
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `agenda_events` ADD `Contacts` TEXT NOT NULL DEFAULT '' AFTER `Statut`"; 
		$request->exec('query');
							
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `agenda_events` ADD `Owner_ID` BIGINT( 20 ) NOT NULL DEFAULT '0' AFTER `User_ID`"; 
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `agenda_events` CHANGE `Rappel_Mail` `Recall` INT( 8 ) NOT NULL DEFAULT '-1'"; 
		$request->exec('query');
		
		$request->query = 	"ALTER TABLE `agenda_events` ADD `Users` TEXT NOT NULL DEFAULT ''"; 
		$request->exec('query');
		
	}
/**	
 * AgendaEvent#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Event_ID == 0){
			
			$request->fields = 	"`User_ID`,
								`Owner_ID`,
								`Contact_ID`,
								`Contact`,
								`Recall`,
								`Title`,
								`Comment`,
								`Date_Start`,
								`Date_End`,
								`Location`,
								`Date_Create`,
								`Date_Update`,
								`Statut`,
								`Contacts`,
								`Users`,
								`Type`";
			$request->values = 	"'".Sql::EscapeString($this->User_ID)."',
								'".Sql::EscapeString(User::Get()->User_ID)."',
								'".Sql::EscapeString($this->Contact_ID)."',
								'".Sql::EscapeString($this->Contact)."',
								'".Sql::EscapeString($this->Recall)."',
								'".Sql::EscapeString($this->Title)."',
								'".Sql::EscapeString($this->Comment)."',
								'".Sql::EscapeString($this->Date_Start)."',
								'".Sql::EscapeString($this->Date_End)."',
								'".Sql::EscapeString($this->Location)."',
								NOW(),
								NOW(),
								'".Sql::EscapeString($this->Statut)."',
								'".Sql::EscapeString($this->Contacts)."',
								'".Sql::EscapeString($this->Users)."',
								'".Sql::EscapeString($this->Type)."'";
			
			System::Fire('agenda.event:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Event_ID = $request->exec('lastinsert');
				
				System::Fire('agenda.event:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"
								`Contact_ID` = '".Sql::EscapeString($this->Contact_ID)."',
								`Contact` = '".Sql::EscapeString($this->Contact)."',
								`Recall` = '".Sql::EscapeString($this->Recall)."',
								`Title` = '".Sql::EscapeString($this->Title)."',
								`Comment` = '".Sql::EscapeString($this->Comment)."',
								`Date_Start` = '".Sql::EscapeString($this->Date_Start)."',
								`Date_End` = '".Sql::EscapeString($this->Date_End)."',
								`Location` = '".Sql::EscapeString($this->Location)."',
								`Date_Update` = NOW(),
								`Statut` = '".Sql::EscapeString($this->Statut)."',
								`Contacts` = '".Sql::EscapeString($this->Contacts)."',
								`Users` = '".Sql::EscapeString($this->Users)."',
								`Type` = '".Sql::EscapeString($this->Type)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Event_ID."'";
		
		System::Fire('agenda.event:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('agenda.event:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * AgendaEvent#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Event_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('agenda.event:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * AgendaEvent.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			
			case self::PRE_OP."get":
				$o = new self($_POST[self::PRIMARY_KEY]);
				echo json_encode($o);
				
				break;
						
			case self::PRE_OP."commit":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->commit()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
			
			case self::PRE_OP."free":
				$o = new self($_POST[__CLASS__]);
				
				echo json_encode($o->free());
				
				break;
			
			case self::PRE_OP."attendant.free.list":
				$o = new self($_POST[__CLASS__]);
				
				echo json_encode($o->getFreeAttendants($_POST['options']));
				
				break;
			
			case self::PRE_OP . 'send':
				$o = new self($_POST[__CLASS__]);
				if(!$o->send()){
					return $op.'.err';
				}
				echo json_encode($o);
				break;
				
			case self::PRE_OP."delete":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->delete()){
					return $op.'.err';	
				}
				
				echo json_encode($o);
				
				break;
			
			case self::PRE_OP."exists":
				
				$o = new self($_POST[__CLASS__]);
				
				echo json_encode($o->exists());
				
				break;
			
			case self::PRE_OP."distinct":
				
				$tab = self::Distinct($_POST['field'], @$_POST['word']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;
				
			case self::PRE_OP."count":
				$date = 	$_POST['options']->date;
				$length = 	$_POST['options']->length;
				
				$_POST['options']->op = '-count';
				$array = array();
				
				for($i = 1; $i <= $length; $i++){
					$_POST['options']->date = $date .'-' . substr('0'.$i, -2);
					$_POST['options']->start = 	$_POST['options']->date . ' 00:00:00';
					$_POST['options']->end = 	$_POST['options']->date . ' 23:59:59';
					
					$nb = self::GetList('', $_POST['options']);
					
					if(!$nb){
						return $op.'err';
					}
					
					if($nb[0]['NB'] > 0){
						array_push($array, array('date' => $_POST['options']->date, 'length' => $nb[0]['NB']));
					}
				}
				
				echo json_encode($array);
				
				break;
			
			case self::PRE_OP."list":
				
				if(!empty($_POST['word'])){
					if(is_object($_POST['options'])){
						$_POST['options']->word = 	$_POST['word'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->word = 	$_POST['word'];
					}
				}
				
				if(!empty($_POST['start'])){
					if(is_object($_POST['options'])){
						$_POST['options']->start = 	$_POST['start'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->start = 	$_POST['start'];
					}
				}
				
				if(!empty($_POST['end'])){
					if(is_object($_POST['options'])){
						$_POST['options']->end = 	$_POST['end'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->end = 	$_POST['end'];
					}
				}
				
				if(!empty($_POST['User_ID'])){
					if(is_object($_POST['options'])){
						$_POST['options']->User_ID = 	$_POST['User_ID'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->User_ID = 	$_POST['User_ID'];
					}
				}
				
			
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;
			
			case self::PRE_OP."model.get":
				$o = new ModelPDF(AGENDA_PATH . 'models/prints/events/', System::Path('self'));
				
				echo json_encode($o->getList());
				break;
				
			case self::PRE_OP."model.list.get":
				$o = new ModelPDF(AGENDA_PATH . 'models/prints/listing/', System::Path('self'));
				
				echo json_encode($o->getList());
				break;	
			
			case self::PRE_OP."get.data":
				self::GetDataFromImportedFile();
				break;
			
			case self::PRE_OP."import":
				set_time_limit(0);
				ignore_user_abort();
				
				echo json_encode(self::ImportFile($_POST['options']));
				break;
				
			case self::PRE_OP."print":
				$o = new self($_POST[__CLASS__]);
				
				if(!$link = $o->printPDF($_POST['options'])){
					return $op.".err";	
				}
				
				echo json_encode($link);
				break;
			
			case self::PRE_OP."list.print":
				
				$link = self::PrintList($_POST['clauses'], $_POST["options"]);
				
				if(!$link){
					return $op.'.err';	
				}
				
				echo json_encode($link);
				
				break;
				
			case self::PRE_OP.'export':
				
				FrameWorker::Start();
				$file = self::Export($_POST['clauses'], $_POST['options']);
				FrameWorker::Stop(File::ToURI($file));
				break;
		}
		
		return 0;	
	}
/**
 * AgendaEvent.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * AgendaEvent#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Event_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * AgendaEvent.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = ''){
		$request = new Request(DB_NAME);
		
		$request->select = 	"distinct " . Sql::EscapeString($field) ." as text";		
		$request->from = 	self::TABLE_NAME;
		$request->where = 	' 1 ';
							
		if(!empty($word)){
			$request->where .= ' 
				AND '.Sql::EscapeString($field)." LIKE '". Sql::EscapeString($word)."%'";
		}
		
		$request->where .= 	" AND TRIM(".Sql::EscapeString($field).") != ''";
		$request->order =	Sql::EscapeString($field);
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
/**
 * AgendaEvent.Search(word) -> void
 * 
 * Méthode de recherche centralisé de Javalyss.
 **/	
	public static function Search($word){
		$clauses = new stdClass();
		$clauses->where = $word;
		
		$result = self::GetList($clauses);
		
		for($i = 0; $i < $result['length']; $i++){
			
			$obj = new IntelliSearch($result[$i]);
			
			$obj->onClick('System.Agenda.openFromSearch');
						
			$obj->setAppIcon('agenda');
			$obj->setAppName(MUI('Agenda'));
			
			IntelliSearch::Add($obj);
		}
	}
/**
 * AgendaEvent.SearchMail(word) -> void
 * 
 * Méthode de recherche centralisé de Javalyss.
 **/	
	public static function SearchMail($word){
		
	}
/**
 * AgendaEvent#locked() -> Boolean
 * 
 **/	
	public function locked(){
		
		if($this->User_ID == User::Get()->User_ID){
			return false;	
		}
		
		if(empty($this->Owner_ID)){
			return true;
		}
		
		if($this->Owner_ID == User::Get()->User_ID){
			return false;	
		}
		
		$u = new User($this->User_ID);
		$users = $u->getMeta('AGENDA_USERS_EVT_EDIT');
		
		if(empty($users)){
			return true;	
		}
		
		return !in_array(User::Get()->User_ID, $users);
	}
/**
 * AgendaEvent#send() -> Boolean
 * 
 **/	
	public function send(){
		ignore_user_abort(true);
		set_time_limit(0);
		
		$user = new User($this->User_ID);
		$mail = new Mail();
		
		$mail->setSubject($this->Title . ' le ' . self::DateFormat($this->Date_Start, '%e %B %Y'));
		
		$statut = Agenda::Status($this->Statut);
		
		$mail->Message = '
		<h3>Bonjour,</h3>
		<p>Voici un rappel de votre rendez-vous "'.$this->Title.'".</p>
		<h3>Détail de l\'événement</h3>
		<ul>
			<li><span><strong style="width:180px;display:inline-block">Début le :</strong> '.  self::DateFormat($this->Date_Start, '%d/%m/%Y %H:%M').'</span></li>
			<li><span><strong style="width:180px;display:inline-block">Fin le :</strong> ' . self::DateFormat($this->Date_End, '%d/%m/%Y %H:%M') .'</span></li>
			<li><span><strong style="width:180px;display:inline-block">Statut :</strong> ' . $statut->text .'</span></li>';
		
		if(!empty($this->Location)){
			$mail->Message .= '<li><span><strong style="width:180px;display:inline-block">Lieu :</strong> <a href="http://maps.google.com/?q='.$this->Location.'">'. $this->Location .'</a></span></li>';
		}
		
		if($this->haveAttendant()){//Evenement partagé
			
			$owner = new User($this->Owner_ID);
			
			$mail->From =		$owner->getMail();
			$mail->FromName = 	$owner->Name . ' ' . $owner->FirstName;		
			$mail->addBcc($owner->getMail(), $owner->Name . ' ' . $owner->FirstName);
			
			$mail->Message .= '<li><span><strong style="width:180px;display:inline-block">Organisateur :</strong> <a href="mailto:'.$owner->getMail().'">'. $owner->Name . ' ' . $owner->FirstName .'</a></span></li>';
		
			$users = $this->getAttendants();
			$attendants = array();
			
			for($i = 0; $i < $users['length']; $i++){
				$u = new User($users[$i]);
				
				array_push($attendants, '<a href="mailto:'.$u->getMail().'">' . $u->Name . ' ' . $u->FirstName . '</a>');
				$mail->addBcc($u->getMail(), $u->Name . ' ' . $u->FirstName);
			}
			
			$mail->Message .= '<li><span><strong style="width:180px;display:inline-block">Participants :</strong> '. implode(', ', $attendants) .'</span></li>';
			
		}else{//Evenement personnel
			
			$host = Permalink::Host();
			$host = strpos($host, '127.0.0.1') !== false ? 'javalyss.fr' : $host;
			
			$mail->From =		'agenda@' . $host;
			$mail->FromName = 	'Agenda';
			$mail->addMailTo($user->getMail());	
			
		}
		
		$mail->Message .= '</ul>';
		
		if(!empty($this->Contact)){
			$mail->Message .= '<h3>Contact</h3>
			<ul>';
			
			$mail->Message .= '<li><span><strong style="width:180px;display:inline-block">Nom :</strong> '.$this->Contact.'</span></li>';
						
			if(!empty($this->Contact_ID)){
				
				$contact = new Contact((int) $this->Contact_ID);
				
				$mail->Message .= '<li><span><strong style="width:180px;display:inline-block">Société :</strong> '.$contact->Company.'</span></li>';
				
				$function = $contact->getFunction();
				if(empty($function)){
					$mail->Message .= '<li><span><strong style="width:180px;display:inline-block">Fonction :</strong> '. $function .'</span></li>';	
				}
								
				if($contact->haveMail()){
					foreach($contact->Email as $type => $mail){
						$mail->Message .= '<li><span><strong style="width:180px;display:inline-block">E-mail ('.Contact::TypeToLabel($type).') :</strong> <a href="mailto:'.$mail.'">'. $mail.'</a></span></li>';	
					}
				}
				
				if($contact->havePhoneNumber()){
					foreach($contact->Phone as $type => $phone){
						$mail->Message .= '<li><span><strong style="width:180px;display:inline-block">N° Téléphone ('.Contact::TypeToLabel($type).') :</strong> '. $phone . '</span></li>';	
					}
				}	
			}
			
			$mail->Message .= '</ul>';
		}
		
		if(!empty($this->Comment)){	
			$mail->Message .= '<h3>Remarques</h3><p> '. nl2br($this->Comment) .'</p>';
		}
		
		if($this->haveContacts()){
			$mail->addCc($this->Contacts);
		}
		
		$mail->importTemplate(AGENDA_PATH.'models/mails/events/model.php');
		$mail->setType(Mail::HTML);
		
		if($mail->send()){
			return true;	
		}
		
		echo ($mail->ErrorInfo);
		
		return false;
	}
/**
 * AgendaEvent.HaveRecall() -> Boolean
 *
 * Indique si il y des rappels à envoyer.
 **/
 	public static function HaveRecall(){
		$date = date('Y-m-d H:i:%');
			//	$date = date('2013-12-30 16:45:00');
		
		return Sql::Count(self::TABLE_NAME, "Recall != -1 AND DATE_SUB(Date_Start, INTERVAL Recall MINUTE) LIKE '".$date."'") > 0;
	}
/*
 *
 **/	
	public function free(){
		$request = 			new Request();
		$request->select = 	'COUNT(Event_ID) as NB';
		$request->from	=	self::TABLE_NAME;	
		
		$request->where =	" (
			User_ID = ". (int) $this->User_ID . " 
			OR Users LIKE '%\"" . (int) $this->User_ID . "\"%'
		)";
		
		$request->where .=	"
							AND ((`Date_Start` > '".$this->Date_Start."' AND `Date_Start` < '".$this->Date_End."')
							OR (`Date_End` > '".$this->Date_Start."' AND `Date_End` < '".$this->Date_End."')
							OR (`Date_Start` <= '".$this->Date_Start."' AND `Date_End` >= '".$this->Date_End."')) ";
		
		$request->where .=	" AND Event_ID != " . (int) $this->Event_ID;
		
		$result = $request->exec('select');
		
		if(!$result){
			die(Sql::Current()->getRequest() . ' ' .Sql::Current()->getError());
		}
		
		return $result['length'] ? $result[0]['NB'] == 0 : true;
	}
/**
 * AgendaEvent.getFreeAttendants() -> Array
 *
 * Cette méthode retourne la liste de participants disponible pour des dates d'un événement.
 **/	
	public function getFreeAttendants($options = ''){
		
		$users = User::GetList($options, $options);
		
		$event = new self($this);
		
		for($i = 0; $i < $users['length']; $i++){
			
			$event->User_ID = $users[$i]['User_ID'];
			
			$users[$i]['Free'] = $event->free();
		}
		
		return $users;	
	}
/**
 * AgendaEvent.getAttendants() -> Array
 *
 * Cette méthode retourne la liste des participants à l'événement.
 **/		
	public function getAttendants(){
		$options = new stdClass();
		
		$options->Users = is_array($this->Users) ? $this->Users : json_decode($this->Users);
		
		return User::GetList($options, $options);
	}
	
	public function haveAttendant(){
		if(empty($this->Users)){
			return false;	
		}
		
		$o = is_array($this->Users) ? $this->Users : json_decode($this->Users);
		
		return count($o) > 0;
	}
/**
 * AgendaEvent.haveContacts() -> Boolean
 *
 * Cette méthode retourne la liste de diffusion de l'événement.
 **/	
	public function haveContacts(){
		if(empty($this->Contacts)){
			return false;	
		}
		
		$o = is_array($this->Contacts) ? $this->Contacts : json_decode($this->Contacts);
		
		return count($o) > 0;
	}
/**
 * AgendaEvent.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des instances en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 * 
 * Pas d'options.
 *
 **/	
	public static function GetList($clauses = '', $options = ''){
		
		$request = 			new Request();
		
		$request->select = 	self::TABLE_NAME . '.*, Date_Start as start, Date_End as end, Title as title, CONCAT(U.Name, " ", U.FirstName) User, CONCAT(O.Name, " ", O.FirstName) Owner, DATE_FORMAT(Date_Start, \'%Y-%m-%d\') as Date_Group';
		$request->from = 	self::TABLE_NAME . ' INNER JOIN ' . User::TABLE_NAME . ' U ON '.self::TABLE_NAME.'.' . User::PRIMARY_KEY . ' = U.' . User::PRIMARY_KEY . ' 
							LEFT JOIN ' . User::TABLE_NAME . ' O ON '.self::TABLE_NAME.'.Owner_ID = O.' . User::PRIMARY_KEY;
		
		$request->where =	' 1 ';
		$request->order = 	'';
				
		if(!empty($options->end) && !empty($options->start)){
			$request->where .=	"
							AND ((`Date_Start` > '".$options->start."' AND `Date_Start` < '".$options->end."')
							OR (`Date_End` > '".$options->start."' AND `Date_End` < '".$options->end."')
							OR (`Date_Start` <= '".$options->start."' AND `Date_End` >= '".$options->end."')) ";
		}
		//
		// Affichage en fonction de l'utilisateur
		//
		if(!empty($options->Users)){
			if(is_string($options->Users)){
				$options->Users = explode(';', $options->Users);
			}
			
			$request->where .= " AND ".self::TABLE_NAME.".User_ID IN(" . implode(', ', $options->Users) . ")";
		}else{
			if(!empty($options->User_ID)){
				$request->where .=	" AND (
					".self::TABLE_NAME.".User_ID = ". (int) $options->User_ID . " 
					OR ".self::TABLE_NAME.".Users LIKE '%\"" . (int) $options->User_ID . "\"%'
				)";
			}	
		}
				
		switch(@$options->op){
			default:
				$request->observe(array(__CLASS__, 'onGetList'));			
				break;
			case '-count':
				$request->select = 'COUNT(*) as NB';
				break;
			case '-recall':
				$date = date('Y-m-d H:i') . ':%';
			//	$date = date('2013-12-30 16:45:00');
				$request->where .=	" AND Recall != -1 AND DATE_SUB(Date_Start, INTERVAL Recall MINUTE) LIKE '".$date."'";
				break;
			//case "-select":
			//	$request->select = 	self::PRIMARY_KEY.' as value, Societe as text';
			//	break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (
								
								`Title` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Comment` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Location` like '%".Sql::EscapeString($clauses->where)."%' OR
								`Statut` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('agenda.event:list', array(&$request, $options));
				
		$result = $request->exec('select');
		//echo $request->query;
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row, &$request){
		$row['background'] = Agenda::Status($row['Statut']);
		
		if(is_object($row['background'])){
			$row['background'] = $row['background']->color;
		}else{
			$row['background'] = Agenda::Status('provisory');
			$row['background'] = $row['background']->color;
		}
		
		if(!empty($row['Users'])){
			$row['Users'] = json_decode($row['Users']);
			$row['Attendants'] = array();
			
			foreach($row['Users'] as $id){
				$u = new User((int) $id);
				array_push($row['Attendants'], $u->Name . ' ' . $u->FirstName);
			}
		}
		
		$o = new self($row);
		$row['Locked'] = $o->locked();
		
	}
}

AgendaEvent::Initialize();

?>