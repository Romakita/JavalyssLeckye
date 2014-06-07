<?php
/** section: Newsletter
 * class NewsletterEmail
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_newsletter_email.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class NewsletterEmail extends ObjectTools{	
	const PRE_OP =				'newsletter.email.';
/**
 * NewsletterEmail.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			'newsletter_emails';	
/**
 * NewsletterEmail.PRIMARY_KEY -> String
 * Clef primaire de la table NewsletterEmail.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Email_ID';

/**
 * NewsletterEmail#Email_ID -> Number
 **/
	public $Email_ID = 0;
/**
 * NewsletterEmail#Model_ID -> Number
 **/
	public $Model_ID = 0;
/**
 * NewsletterEmail#Subject -> String
 * Varchar
 **/
	public $Subject = "";
/**
 * NewsletterEmail#Content -> String
 * Longtext
 **/
	public $Content = "";
/**
 * NewsletterEmail#Attachments -> String
 * Longtext
 **/
	public $Attachments = "";
	
	public $Recipients = "";
/**
 * NewsletterEmail#Date_Start_Sending -> Datetime
 **/
	public $Date_Start_Sending = '0000-00-00 00:00:00';
/**
 * NewsletterEmail#Date_End_Sending -> Datetime
 **/
	public $Date_End_Sending = '0000-00-00 00:00:00';
/**
 * NewsletterEmail#Nb_Email_Sent -> Number
 **/
	public $Nb_Email_Sent = 0;
/**
 * NewsletterEmail#Total_Emails -> Number
 **/
	public $Total_Emails = 0;
/**
 * NewsletterEmail#Statut -> Number
 **/
	public $Statut = "draft";

/**
 * new NewsletterEmail()
 * new NewsletterEmail(json)
 * new NewsletterEmail(array)
 * new NewsletterEmail(obj)
 * new NewsletterEmail(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[NewsletterEmail]].
 * - array (Array): Tableau associatif équivalent à une instance [[NewsletterEmail]]. 
 * - obj (Object): Objet équivalent à une instance [[NewsletterEmail]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[NewsletterEmail]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])) {
				$request = 			new Request();
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
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
 * NewsletterEmail.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
	}
/**
 * NewsletterEmail.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE `newsletter_emails` (
		  `Email_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Model_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Subject` varchar(255) NOT NULL,
		  `Content` longtext NOT NULL,
		  `Attachments` text NOT NULL,
		  `Date_Start_Sending` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Date_End_Sending` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
		  `Nb_Email_Sent` bigint(20) NOT NULL DEFAULT '0',
		  `Total_Emails` bigint(20) NOT NULL DEFAULT '0',
		   `Statut` VARCHAR( 50 ) NOT NULL,
		  PRIMARY KEY (`Email_ID`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8";
		
		$request->exec('query');	
	}
/**	
 * NewsletterEmail#commit() -> Boolean
 *
 * Cette méthode enregistre les données de l'instance en base de données.
 **/
	public function commit(){
		
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if ($this->Email_ID == 0){
			
			$request->fields = 	"`Model_ID`,
								`Subject`,
								`Content`,
								`Attachments`,
								`Date_Start_Sending`,
								`Date_End_Sending`,
								`Nb_Email_Sent`,
								`Total_Emails`,
								`Statut`";
			$request->values = 	"'".Sql::EscapeString($this->Model_ID)."',
								'".Sql::EscapeString($this->Subject)."',
								'".Sql::EscapeString($this->Content)."',
								'".Sql::EscapeString($this->Attachments)."',
								'".Sql::EscapeString($this->Date_Start_Sending)."',
								'".Sql::EscapeString($this->Date_End_Sending)."',
								'".Sql::EscapeString($this->Nb_Email_Sent)."',
								'".Sql::EscapeString($this->Total_Emails)."',
								'".Sql::EscapeString($this->Statut)."'";
			
			System::Fire('newsletter.email:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Email_ID = $request->exec('lastinsert');
				
				System::Fire('newsletter.email:commit.complete', array(&$this));
				return true;
			}
			
			return false;
		}
		
		
		$request->from = 	self::TABLE_NAME;
		$request->set = 	"`Model_ID` = '".Sql::EscapeString($this->Model_ID)."',
								`Subject` = '".Sql::EscapeString($this->Subject)."',
								`Content` = '".Sql::EscapeString($this->Content)."',
								`Attachments` = '".Sql::EscapeString($this->Attachments)."',
								`Date_Start_Sending` = '".Sql::EscapeString($this->Date_Start_Sending)."',
								`Date_End_Sending` = '".Sql::EscapeString($this->Date_End_Sending)."',
								`Nb_Email_Sent` = '".Sql::EscapeString($this->Nb_Email_Sent)."',
								`Total_Emails` = '".Sql::EscapeString($this->Total_Emails)."',
								`Statut` = '".Sql::EscapeString($this->Statut)."'";
							
		$request->where = 	self::PRIMARY_KEY." = '".$this->Email_ID."'";
		
		System::Fire('newsletter.email:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('newsletter.email:commit.complete', array(&$this));
			return true;
		}
		return false;
	}	
/**
 * NewsletterEmail#delete() -> Boolean
 *
 * Cette méthode supprime les données de l'instance de la base de données.
 **/	
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_NAME);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Email_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('newsletter.email:remove', array(&$this));
			return true;
		}
		return false;

	}
	
	public function createQueue(){
		
		if(empty($this->Recipients)){
			return;
		}
		
		$mails =	array();
		$groups = 	NewsletterPlugin::GetBroadcastGroups();
		
		foreach($this->Recipients as $oMail){
			
			if(in_array($oMail, $groups)){
				
				$group = explode('@', $oMail);
				
				if($group[1] == 'newsletter.fr'){
					
					if($group[0] == 'subscribers'){
						$list = NewsletterContact::GetList();	
						
						for($i = 0; $i < $list['length']; $i++){
							array_push($mails, $list[$i]['Email']);
						}
					}else{// il s'agit d'un groupe Utilisateur
						
						$role = Role::ByName($group[0]);
						$options = new stdClass();
						$options->Role_ID = $role->Role_ID;
						$options->op = '-mail';
						
						$list = NewsletterContact::GetList($options, $options);	
						
						for($i = 0; $i < $list['length']; $i++){
							array_push($mails, $list[$i]['value']);
						}
					}
				}else{
					System::Fire('newsletter:broadcast', array($oMail, &$mails));
				}
			}
			
		}
		
		$this->Total_Emails = count($mails);
		
		if(!is_array(@$_SESSION[__CLASS__])){
			$_SESSION[__CLASS__] = array();
		}
		
		$this->Statut = 'process';
		$this->commit();
		
		$_SESSION[__CLASS__][$this->Email_ID] = $mails;
		
		return $this->commit();
	}
	
	public function check(){
		$this->extend(new self($this->Email_ID));
	}
	
	public function send(){
		set_time_limit(0);
		ignore_user_abort(true);
		
		$list = $_SESSION[__CLASS__][$this->Email_ID];
				
		$this->Statut = 'process';
		$this->Date_Start_Sending = date('Y-m-d H:i:s');
		$this->Nb_Email_Sent = 0;
		$this->commit();
		
		$from = System::Meta('NEWSLETTER_FROM');
		$from = empty($from) ? "" : $from;
		
		foreach($list as $address){
			
			$mail = new Mail();
			$mail->setType(Mail::HTML);
					
			$mail->addMailTo($address);
			$mail->From =		$from;
			
			$mail->Subject = 	$this->Subject;
			$mail->Message = 	stripslashes($this->Content);
			
			
			$mail->Message = str_replace(array(
				'[[link.view.mail]]',
				'[[link.unregister]]'
				),
				
				array(
					URI_PATH . 'newsletter/preview/' . $this->Email_ID,
					URI_PATH . 'newsletter/unsubscribe/' . $address
				),
				
				$mail->Message
			);
			
			///$mail->Message .= 	'<p style="color:#555; border-top:1px solid #333;"> <small>Généré par <a href="http://planningmaster.fr">Planning Master Online</a>, gestion de planning graphique en ligne.</small></p>';
 			
			if(is_array($this->Attachments)){
				foreach($this->Attachments as $attach){
					$mail->addAttach(Permalink::ToABS($attach));
				}
			}
			
			@$mail->send();
			
			//$mail->getInfo();
			
			$this->Nb_Email_Sent++;
			$this->commit();
		
		}
		
		$this->Statut = 'sent';
		$this->Date_End_Sending = date('Y-m-d H:i:s');
		
		$this->commit();
				
		return true;
	}
/**
 * NewsletterEmail.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP."commit":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->commit()){
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
				
			case self::PRE_OP."create.queue":
				$o = new self($_POST[__CLASS__]);
				$o->createQueue();
				
				echo json_encode($o);
				
				break;
			
			case self::PRE_OP."check":
				$o = new self($_POST[__CLASS__]);
				$c = new self($o->Email_ID);
				echo json_encode($c);
				break;	
			
			case self::PRE_OP."send":
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->send()){
					return $op.'.err';
				}
				
				echo "Mail sending !";
				
				break;	
			
			case self::PRE_OP."distinct":
				
				$tab = self::Distinct($_POST['field'], @$_POST['word']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
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
			
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;
			
			case self::PRE_OP."print":
			
				$_POST['clauses']->limits ='';
				
				$pdf = self::PrintList($_POST['clauses'], $_POST["options"]);
				
				if(!$pdf){
					return $op.'.err';	
				}
				
				@Stream::MkDir(System::Path('prints'), 0777);
				$link = System::Path('prints') . str_replace('.', '-', self::PRE_OP) . 'list-' . date('ymdhis') .'.pdf';
				@unlink($link);
				$pdf->Output($link, 'F');
				
				echo json_encode(str_replace(ABS_PATH, URI_PATH, $link));
				
				break;
		}
		
		return 0;	
	}
/**
 * NewsletterEmail.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * NewsletterEmail#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Email_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * NewsletterEmail.Distinct(field [, word]) -> Array
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
 * NewsletterEmail.GetList([clauses [, options]]) -> Array | boolean
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
		
		$request->select = 	'*';
		$request->from = 	self::TABLE_NAME;
		$request->where =	' 1 '; 
		$request->order = 	"FIELD( Statut, 'draft', 'process', 'sent', '')";
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		if(isset($options->Statut)){
			
			$request->where .= " AND  Statut like '%".Sql::EscapeString($options->Statut)."%'";
			
		}
		
		
		switch(@$options->op){
			default:
							
				break;
				
			case "-select":
				$request->select = 	self::PRIMARY_KEY.' as value, Field as text';
				break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Email_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Model_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Subject` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Content` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Start_Sending` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_End_Sending` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Nb_Email_Sent` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Total_Emails` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order .= ','.$clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		//
		// Evenement
		//
		System::Fire('newsletter.email:list', array(&$request, $options));
				
		$result = $request->exec('select');
		//echo $request->query;
		if($result){
			$result['maxLength'] = Sql::Count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row){
		$row['Summary'] = Stream::StripTags($row['Content']);	
	}
	
	public function draw(){
		?>
        
        <!DOCTYPE html>
        <html>
        
        <head>
            <title><?php echo $this->Subject ?></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        </head>
        <body>
        	<?php echo $this->Content; ?>
        </body>
        </html>
        
        <?php	
	}
}

NewsletterEmail::Initialize();

?>