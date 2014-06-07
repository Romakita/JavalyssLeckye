<?php
/** section: Plugins
 * class PostComment 
 * includes ObjectTools, iClass, iForm
 *
 * Cette classe gère l'édition et la lecture de commentaire.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_comment.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define("TABLE_POST_COMMENT", PRE_TABLE.'blogpress_posts_comments');

class PostComment extends ObjectTools implements iClass, iForm{
	const PRE_OP =				'blogpress.post.comment.';
/**
 * PostComment.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_POST_COMMENT;	
/**
 * PostComment.PRIMARY_KEY -> String
 * Clef primaire de la table PostComment.TABLE_NAME gérée par la classe.
 **/	
	const PRIMARY_KEY = 		'Comment_ID';

/**
 * PostComment#Comment_ID -> Number
 **/
	public $Comment_ID = 0;
/**
 * PostComment#Post_ID -> Number
 **/
	public $Post_ID = 0;
/**
 * PostComment#User_ID -> Number
 **/
	public $User_ID = 0;
/**
 * PostComment#Author -> String
 * Varchar
 **/
	public $Author = "";
/**
 * PostComment#Email -> String
 * Varchar
 **/
	public $Email = "";
/**
 * PostComment#Tracking -> Number
 **/
	public $Tracking = 0;
/**
 * PostComment#Url -> String
 * Varchar
 **/
	public $Url = "";
/**
 * PostComment#IP -> String
 * Varchar
 **/
	public $IP = "";
/**
 * PostComment#User_Agent -> String
 * Varchar
 **/
	public $User_Agent = "";
/**
 * PostComment#Content -> String
 * Longtext
 **/
	public $Content = "";
/**
 * PostComment#Note -> Number
 **/
	public $Note = 0;
/**
 * PostComment#Date_Create -> Datetime
 **/
	public $Date_Create = NULL;
/**
 * PostComment#Statut -> String
 * Varchar
 **/
	public $Statut =	'draft';
	protected static $Instance =	NULL;
	protected static $List =		NULL;
	protected static $MaxLength =	0;
/**
 * new PostComment()
 * new PostComment(json)
 * new PostComment(array)
 * new PostComment(obj)
 * new PostComment(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[PostComment]].
 * - array (Array): Tableau associatif équivalent à une instance [[PostComment]]. 
 * - obj (Object): Objet équivalent à une instance [[PostComment]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[PostComment]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		$this->Date_Create =	date('Y-m-d H:i:s');
		$this->User_Agent =		$_SERVER['HTTP_USER_AGENT'];
		$this->IP =				$_SERVER['REMOTE_ADDR'];
		
		if($numargs > 0){
			if(is_numeric($arg_list[0])) {
				//Informations de société
				$request = 			new Request(DB_BLOGPRESS);
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$u = $request->exec('select');
				
				if($u['length'] > 0){
					$this->extend($u[0]);
					if($numargs == 1) self::$Instance = $this;
				}
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);
		}
		
	}
/**
 * PostComment.Initialize() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/
	public static function Initialize(){
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		System::Observe('blog:form.submit', array(__CLASS__,'onFormSubmit'));
		System::Observe('blog:form.submit', array(__CLASS__,'onFormCommit'));
		System::Observe('blog:form.before', array(__CLASS__,'onBeforeForm'));
		System::Observe('blog:form.after', array(__CLASS__,'onAfterForm'));
		
		System::EnqueueScript('blogpress.post.comment', Plugin::Uri(). 'js/blogpress_comment.js');
	}
/**
 * PostComment.Install() -> void
 * Cette méthode installe l'extension ou une partie de l'extension gérées par la classe.
 **/
	public static function Install(){
		$request = 			new Request(DB_BLOGPRESS);
		
		$request->query = 	"RENAME TABLE `".PRE_TABLE."post_comments` TO `".PRE_TABLE."blogpress_posts_comments`";
		$request->exec('query');
		
		$request->query = 	"CREATE TABLE `".PRE_TABLE."blogpress_posts_comments` (
		  `Comment_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Post_ID` bigint(20) NOT NULL,
		  `User_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Author` varchar(200) NOT NULL,
		  `Email` varchar(100) NOT NULL DEFAULT '',
		  `Tracking` tinyint(1) NOT NULL DEFAULT '0',
		  `Url` varchar(200) NOT NULL DEFAULT '',
		  `IP` varchar(100) NOT NULL DEFAULT '',
		  `User_Agent` varchar(255) NOT NULL DEFAULT '',
		  `Content` longtext NOT NULL,
		  `Note` int(11) NOT NULL DEFAULT '0',
		  `Date_Create` datetime NOT NULL,
		  `Statut` varchar(30) NOT NULL DEFAULT 'draft',
		  PRIMARY KEY (`Comment_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		$request->exec('query');
				
		
				
		//
		// Ajout des champs pour la gestion des commentaires
		//
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_comments` CHANGE `Name` `Author` VARCHAR( 200 ) CHARACTER SET utf8 NOT NULL";
		$request->exec('query');
		//
		//
		//
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_comments` ADD `Email` VARCHAR( 100 ) NOT NULL DEFAULT '' AFTER `Author` ";
		$request->exec('query');
		//
		//
		//
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_comments` ADD `User_ID` BIGINT NOT NULL DEFAULT '0' AFTER `Post_ID`";
		$request->exec('query');
		//
		//
		//
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_comments` ADD `Url` VARCHAR( 200 ) NOT NULL DEFAULT '' AFTER `Email`";
		$request->exec('query');
		//
		//
		//
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_comments` ADD `IP` VARCHAR( 100 ) NOT NULL DEFAULT '' AFTER `Url`";
		$request->exec('query');
		//
		//
		//
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_comments` ADD `User_Agent` VARCHAR( 255 ) NOT NULL DEFAULT '' AFTER `IP`";
		$request->exec('query');
		
		//
		//
		//
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_comments` ADD `Tracking` BOOLEAN NOT NULL DEFAULT '0' AFTER `Email`";
		$request->exec('query');
		//
		//
		//
		$request->query = "ALTER TABLE `".PRE_TABLE."blogpress_posts_comments` CHANGE `Note` `Note` INT( 11 ) NOT NULL DEFAULT '0'";
		$request->exec('query');
		
	}
/**
 * PostComment#commit() -> Boolean
 *
 * Cette méthode enregistre les informations de la classe en base de données.
 **/
	public function commit(){
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		
		if($this->Date_Create == '') $this->Date_Create = date('Y-m-d H:i:s');
		
		if(User::IsConnect()){
			$this->User_ID = User::Get()->getID();	
		}else{
			$this->User_ID = '0';	
		}
				
		if($this->Comment_ID == 0){
						
			$request->fields = 	"`Post_ID`,
								`User_ID`,
								`Author`,
								`Email`,
								`Tracking`,
								`Url`,
								`IP`,
								`User_Agent`,
								`Content`,
								`Note`,
								`Date_Create`,
								`Statut`";
			$request->values = 	"'".Sql::EscapeString($this->Post_ID)."',
								'".Sql::EscapeString($this->User_ID)."',
								'".Sql::EscapeString($this->Author)."',
								'".Sql::EscapeString($this->Email)."',
								'".Sql::EscapeString($this->Tracking)."',
								'".Sql::EscapeString($this->Url)."',
								'".Sql::EscapeString($this->IP)."',
								'".Sql::EscapeString($this->User_Agent)."',
								'".Sql::EscapeString(trim($this->Content))."',
								'".Sql::EscapeString($this->Note)."',
								'".Sql::EscapeString($this->Date_Create)."',
								'".Sql::EscapeString($this->Statut)."'";
								
								
			System::Fire('blogpress.post.comment:commit', array(&$this, &$request));
			
			if($request->exec('insert')){
				$this->Comment_ID = $request->exec('lastinsert');
				
				System::Fire('blogpress.post.comment:commit.complete', array(&$this));
				
				if($this->Statut == "publish"){
					$this->notify();
				}
				
				return true;
			}
			
			return false;
		}
		
		$request->set = "`Content` = '".Sql::EscapeString(trim($this->Content))."',
						`Statut` = '".Sql::EscapeString($this->Statut)."'";
		$request->where = self::PRIMARY_KEY . ' = ' . $this->Comment_ID;
			
		System::Fire('blogpress.post.comment:commit', array(&$this, &$request));
		
		if($request->exec('update')){
			System::Fire('blogpress.post.comment:commit.complete', array(&$this));
			
			if($this->Statut == "publish"){
				$this->notify();
			}
		
			return true;
		}
	}
/**
 * PostComment#delete() -> Boolean
 *
 * Cette méthode supprime les informations de la classe de la base de données.
 **/
	public function delete(){
		//Supression de la facture
		$request = 			new Request(DB_BLOGPRESS);
		$request->from = 	self::TABLE_NAME;
		$request->where = 	"`".self::PRIMARY_KEY."` = '".$this->Comment_ID."' ";
		
		if($request->exec('delete')){
			System::Fire('blogpress.post.comment:remove', array(&$this));
			return true;
		}
		return false;

	}
/**
 * PostComment.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
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
			
			case self::PRE_OP."distinct":
				
				$tab = self::Distinct($_POST['field'], @$_POST['word']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				
				break;
				
			case self::PRE_OP."count":
				
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
				
				echo json_encode($tab['maxLength']);
				
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
		}
		
		return 0;	
	}	
/**
 * PostComment.execSafe(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function execSafe($op){
		
	}
/**
 * PostComment.Author() -> String
 *
 * Cette méthode retourne le nom de l'auteur du commentaire courant.
 **/
	static public function Author(){
		return self::$Instance->Author;	
	}
/**
 * PostComment.Avatar() -> String
 *
 * Cette méthode retourne le lien de l'avatar de l'auteur du commentaire courant.
 **/
	static public function Avatar(){
		$avatar =  self::$Instance->Avatar;	
		
		if($avatar == 'icon-men-48'){
			return '';	
		}
		
		return $avatar;
	}
/**
 * PostComment.ClassName([className]) -> String
 * - className (String): Classe CSS à ajouter.
 * 
 * Cette méthode construit le ou les classe(s) CSS du commentaire courant.
 **/	
	static public function ClassName($str = ''){
		return strtolower("comment " . Post::Sanitize(Post::CommentStatut()). " comment-" . self::ID() . ' ' .$str); 
	}
/**
 * PostComment.Content() -> String
 * - str (String): Contenu à assigner.
 *
 * Cette méthode permet d'assigner du contenu au commentaire courant. La méthode retourne le contenu du commentaire courant.
 **/	
	static public function Content($str = ''){
		
		if($str != ''){
			if(is_object(self::$Instance)){
				self::$Instance->Content = $str;	
			}else{
				self::$Instance['Content'] = $str;
			}
		}
				
		return is_object(self::$Instance) ? self::$Instance->Content : self::$Instance['Content'];	
	}
/**
 * PostComment.Count([postid]) -> Number
 * - postid (Number): Numéro du post.
 *
 * Cette méthode compte le nombre de commentaire du Post courant ou du postid.
 **/	
	static public function Count($postid = ''){
		if(empty($postid)){
			$postid = Post::ID();
		}
				
		return Sql::Count(PostComment::TABLE_NAME, Post::PRIMARY_KEY . ' = ' . ((int) $postid) . ' AND Statut = "publish"');	
	}
/**
 * PostComment.Note() -> Number
 *
 * Cette méthode retourne la note du commentare courant.
 **/	
	static public function Note($postid = ''){
		$o = self::Current();
		return empty($o) ? 0 : $o->Note;
	}
/**
 * PostComment.Current() -> Boolean | Comment
 *
 * Cette méthode retourn l'instance du commentaire en cours.
 **/
	public static function Current($comment = NULL){
		
		if(empty($comment)){
			return self::$Instance;
		}
		
		if(is_array($comment) || is_object($comment)){
			
			self::$Instance = new self($comment);
			
			System::Fire('blog:comment.build');
			
			return self::$Instance;	
		}
		
		return self::$Instance;
	}
/**
 * PostComment.ID() -> Number
 *
 * Cette méthode retourne l'ID du commentaire courant.
 **/	
	static public function ID(){
		return self::$Instance->Comment_ID;	
	}
/**
 * PostComment.Date([format = '' [, lang = fr [, encode = utf8]]]) -> String
 * - format (String): Format de la date à afficher (voir la document PHP pour strftime).
 * - lang (String): Langue pour l'affichage des dates.
 * - encode (String): Encodage de la chaine de caractère.
 *
 * Cette méthode retourne la date de création du commentaire en courant.
 **/
	static public function Date($format = '', $lang = 'fr', $encode = 'uft8'){
		if($format == '') return self::$Instance->Date_Create;
		return ObjectPrint::DateFormat(self::$Instance->Date_Create, $format, $lang, $encode);
	}
/**
 * PostComment.Have() -> Boolean
 * 
 * Cette méthode indique si [[Comment.GetList]] a retourné des commentaires.
 **/
	public static function Have(){
		
		if(is_array(self::$List)){
			return count(self::$List) > 0;
		}else{
			if(Post::Have()){
				$options = new stdClass();
				$options->Post_ID = Post::ID();
				
				self::GetList('', $options);
				
				return count(self::$List) > 0;
			}
		}
		
		return false;
	}
/**
 * Post.MaxLength() -> Number
 *
 * Cette méthode retourne le nombre maximal de commentaire contenu dans la liste de commentaires à afficher.
 **/
	public static function MaxLength(){
		return self::$MaxLength;	
	}
/**
 * PostComment.Next() -> PostComment | false
 *
 * Cette méthode passe au commentaire suivant.
 **/
	public static function Next(){
		self::$Instance = next(self::$List);
		
		//traitement du post
		if(is_array(self::$Instance) || is_object(self::$Instance)){
			
			self::$Instance = new self(self::$Instance);
			
			System::Fire('blog:comment.build');
			return self::$Instance;	
		}
		
		
		return self::$Instance = false;
	}
/**
 * PostComment.End() -> PostComment | false
 *
 * Cette méthode passe au dernier commentaire de la liste.
 **/	
	public static function End(){
		self::$Instance = end(self::$List);
		
		if(is_array(self::$Instance) || is_object(self::$Instance)){
			
			self::$Instance = new self(self::$Instance);
			
			System::Fire('blog:comment.build');
			return self::$Instance;	
		}
		
		return self::$Instance = false;
	}
/**
 * PostComment.Reset() -> PostComment | false
 *
 * Cette méthode revient au premier commentaire de la liste.
 **/	
	public static function Reset(){
		self::$Instance = reset(self::$List);
		
		if(is_array(self::$Instance) || is_object(self::$Instance)){
			
			self::$Instance = new self(self::$Instance);
			
			System::Fire('blog:comment.build');
			return self::$Instance;	
		}
		
		return self::$Instance = false;
	}
/**
 * PostComment.Prev() -> PostComment | false
 *
 * Cette méthode revient au commentaire précédent.
 **/
	public static function Prev(){
		self::$Instance = prev(self::$List);
		
		if(is_array(self::$Instance) || is_object(self::$Instance)){
			
			self::$Instance = new self(self::$Instance);
			
			System::Fire('blog:comment.build');
			return self::$Instance;	
		}
		
		return self::$Instance = false;
	}
/**
 * PostComment.Pagination() -> String
 *
 * Cette méthode affiche les boutons permettant de naviguer dans la liste des commentaire.
 **/
 	public static function Pagination($flag = false){
		if(!empty(self::$Cat)){
			return Permalink::DrawPaging(array('length' => self::MaxLength(), 'link' => Blog::GetInfo('uri') . self::Sanitize(self::$Cat)));
		}
		
		return Permalink::DrawPaging(array('length' => self::MaxLength()));
	}
/**
 * PostComment.notify() -> void
 *
 * Cette méthode envoi un e-mail de notification aux personnes suivant la discussion.
 **/	
	private function notify(){
		$post = new Post((int) $this->Post_ID, true);
		
		if(!$post->getCommentTracking()){
			return;
		}		
		
		//récupération de la liste des mail
		$options->post =	$this->Post_ID;
		$options->exclude =	$this->Comment_ID;
		$options->op =		'-tracking';
		
		$tab = self::GetList('', $options);
		$array = array();
		
		for($i = 0; $i < $tab['length']; $i++){
			
			$mailAdd = 		$tab[$i]['EMail'];
			
			$unregister = 	Blog::GetInfo('uri').'unregister-tracking/?email='.$mailAdd.'&post='.$post->Post_ID;
			$preview = 		Blog::GetInfo('uri').$post->Name;
			
			$mail = 		new Mail();
			$mail->setType(Mail::HTML);
			$mail->From = 	Blog::GetInfo('contact');
			$mail->addMailTo($mailAdd);
		
			$mail->setSubject("Nouveau commentaire sur ".Blog::GetInfo('uri'));
									
			$mail->Message = '
			<html>
			<head>
				<title>Nouveau commentaire</title>
			</head>
			<body>
				<div class="header">
					<h3>Nouveau commentaire sur '.Blog::GetInfo('uri').'</h3>
					<h4>Bonjour,</h4>
				</div>
				<div class="body">
					<p>Vous vous êtes abonné à une discussion sur '.Blog::GetInfo('uri').'. Cette e-mail vous informe qu\'un utilisateur à posté un nouveau commentaire accessible à cette adresse :</p>
					<p><a href="'.$preview.'">'.$preview.'</a>.</p>
					<p>Vous pouvez à tout moment vous désabonner de cette liste de discussion en cliquant sur ce lien :</p>
					<p><a href="'.$unregister.'">'.$unregister.'</a>.</p>
					
					<p>Cordialiement,</p>
					<p><strong>L\'équipe de '.Blog::GetInfo('title').'</strong></p>
				</div>
			</body>
			</html>';
								
			@$mail->send();
		}	
	}
/**
 * PostComment.Unregister() -> Boolean
 *
 * Cette méthode permet à un utilisateur de ce désabonner d'une discussion.
 **/
	public static function Unregister($post, $email){
		$request = new Request(DB_BLOGPRESS);
		
		$request->where = 	"`EMail` = '" . Sql::EscapeString($email) ."' AND Post_ID = " . ((int) $post);
		$request->set = 	"`Tracking` = '0'";
		
		return $request->exec('update');	
	}
/**
 * PostComment#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Comment_ID." AND UniqueKey = '".Sql::EscapeString($this->UniqueKey)."'") > 0;
	}
/**
 * PostComment.Distinct(field [, word]) -> Array
 *
 * Cette méthode liste les données d'une colonne de la table.
 **/
	public static function Distinct($field, $word = ''){
		$request = new Request(DB_BLOGPRESS);
		
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
 * PostComment.DrawNote() -> String
 *
 * Cette méthode affiche la note du commentaire courant au format HTML.
 **/
	public static function DrawNote(){
		
		$note = self::Note();		
		$note = (round($note * 2) / 2) * 2;
		
		?>
        <span class="object-stars-note">
        <?php
		for ($i = 0; $i < 10; $i += 2){
			if ($i + 1 == $note) {
				?>
				<span class="star-split"></span>
				<?php
			} elseif ($i < $note){
				?>
				<span class="star-full"></span>
				<?php
			} else {
				?>
				<span class="star-empty"></span>
				<?php
			}
		}
		?>
		</span>
		<?php
	}
/**
 * PostComment.GetList([clauses [, options]]) -> Array | Boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des données gérées par la classe.
 **/
	public static function GetList($clauses = '', $options = ''){
				
		$request = new Request(DB_BLOGPRESS);
		
		$request->select = 	'A.*, DATE_FORMAT(A.Date_Create, \'%Y-%m-%d\') as Date_Group, U.Avatar, Po.Title, Po.Comment_Statut';
		$request->from = 	self::TABLE_NAME . ' AS A LEFT JOIN '. User::TABLE_NAME . ' AS U ON A.' . User::PRIMARY_KEY .' = U.' . User::PRIMARY_KEY . ' 
							INNER JOIN '.Post::TABLE_NAME.' AS Po ON Po.' . Post::PRIMARY_KEY . ' = A.' . Post::PRIMARY_KEY;
							
		$request->where =	" 1 ";
		$request->order = 	'A.Date_Create DESC, Comment_ID DESC';
		
		$request->observe(array(__CLASS__, 'onGetList'));
		
		//
		// Gestion draft
		//
		if(User::IsConnect()){
			
			if(empty($options->draft)){
				if(empty($options->Statut)){
					$request->where =	"A.Statut = 'publish'";
				}
			}
		}else{
			if(empty($options->Statut)){
				$request->where =	"A.Statut = 'publish'";
			}
		}
		
		if(!empty($options->Statut)){
			$request->where .= ' AND A.Statut LIKE "%' . Sql::EscapeString($options->Statut) .'%"';
		}
		//
		//
		//
		if(isset($options->Post_ID)){
			$request->where .= " AND Po.".Post::PRIMARY_KEY." = '". (int) $options->Post_ID ."'";
		}
		
		if(isset($options->post)){
			$request->where .= " AND Po.".Post::PRIMARY_KEY." = '". (int) $options->post ."'";
		}
		
		if(!empty($options->exclude)){
			
			if(is_string($options->exclude)){
				$options->exclude = explode('; ', $options->exclude);	
			}
			$request->where .= " AND ".self::PRIMARY_KEY." NOT IN( '". Sql::EscapeString(implode('\', \'', $options->exclude)) ."')";
		}
	
		
		switch(@$options->op){
			default:break;
							
			case '-tracking':
				$request->select = 	'DISTINCT EMail';
				$request->where =	'Tracking = 1';
				break;
								
		}
		
		if(isset($clauses) && $clauses != ''){
			if(@$clauses->where) {
								
				$request->where .= " AND (
											Author like '%". Sql::EscapeString($clauses->where) . "%'
											OR EMail like '%". Sql::EscapeString($clauses->where) . "%'
											OR IP like '%". Sql::EscapeString($clauses->where) . "%'
											OR Content like '%". Sql::EscapeString($clauses->where) . "%'
										)";
				
			}
			if(@$clauses->order) 	$request->order = $clauses->order;
			if(@$clauses->limits) 	$request->limits = $clauses->limits;
		}
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
			
		}
		
		self::SetList($result);
		
		return $result; 
	}
/**
 * PostComment.onGetList(row [,request]) -> void
 * - row (Array): Ligne traité par la requête.
 * - request (Request): Requêt en cours d'exécution.
 *
 * Cette méthode est appelée par un objet [[Request]] lors de son exécution.
 *
 **/	
	public static function onGetList(&$row, &$request){
		if(empty($row['Avatar'])){
			$row['Avatar'] = 'icon-men-48';	
		}
	}
/**
 * PostComment.SetList(list) -> void
 * - list (Array): Liste de commentaire.
 *
 * Cette méthode permet d'assigner une liste de commentaires à parcourir.
 **/	
	public static function SetList($list){
		
		self::$List = $list;
		
		if(is_array(self::$List)){
			unset(self::$List['length'], self::$List['maxLength']);
			
			if(!empty($list['maxLength'])){
				self::$MaxLength = $list['maxLength'];
			}else{
				self::$MaxLength = count(self::$List);
			}
			
			if(count(self::$List)){
				self::Current(@self::$List[0]);
			}else{
				self::$Instance = false;
				self::$MaxLength = 0;
			}
			
		}else{
			self::$List = self::$Instance = false;
			self::$MaxLength = 0;
		}			
	}
/**
 * PostComment.onFormSubmit() -> void
 *
 * Cette méthode teste les champs envoyés par le formulaire affiché dans la page source.
 *
 * Utilisez les méthodes [[System.GetCMD]] pour connaitre la commande et [[BlogPress.SetError]] pour indiquer une erreur dans le formulaire.
 **/
	public static function onFormSubmit(){
		
		if(System::GetCMD() != 'post.comment.submit') return;
				
		if(empty( $_POST['Post_ID'])){
			BlogPress::SetError('Une erreur est survenue lors de la création du commentaire (code comment.postid.empty)');
			return;
		}
		
		$post = new Post((int) $_POST['Post_ID'], true);
		
		if(!$post->commentIsOpen()){
			BlogPress::SetError('L\'écriture de commentaire est fermé pour cet article');
			return;
		}
		
		if(!User::IsConnect()){
			//test du champ nom
			if($_POST['Author'] == ''){
				BlogPress::SetError('Veuillez saisir votre nom');
			}
					
			//test du champ e-mail
			if($_POST['EMail'] == ''){
				BlogPress::SetError('Veuillez saisir votre adresse e-mail');
			}else{
				$mail = preg_replace('/[_\\-]/', '', $_POST['EMail']);
			
				if(!preg_match_all(BlogPress::REG_EMAIL, $mail, $matches)){
					BlogPress::SetError('Veuillez saisir une adresse e-mail valide');
				}
			}
		}
				
		//test du champ content
		if($_POST['Content'] == ''){
			BlogPress::SetError('Veuillez saisir votre message');
		}
	}
/**
 * PostComment.onFormCommit() -> void
 *
 * Cette méthode permet d'enregistrer les données du formulaire seulement si aucune erreur n'a été signalé via la méthode [[BlogPress.SetError]].
 **/
	public static function onFormCommit(){
		
		if(System::GetCMD() != 'post.comment.submit') return;
		
		$post = new Post((int) $_POST['Post_ID'], true);
		
		$comment = new self();
		$comment->Post_ID = (int) @$_POST['Post_ID'];
		//sauvegarde du commentaire
		
		if(User::IsConnect()){
			$comment->User_ID = User::Get()->getID();
			$comment->Author =	User::Get()->Login;
			$comment->EMail =	User::Get()->EMail;
		}else{
			$comment->Author = 	$_POST['Author'];
			$comment->EMail = 	$_POST['EMail'];
			$comment->Url = 	$_POST['Url'];
		}
		
		$comment->Note = 		empty($_POST['Note']) ? -1 : (int) $_POST['Note'];
		$comment->Tracking =	empty($_POST['Tracking']) ? 0 : (int) $_POST['Tracking'];
		$comment->Content = 	$_POST['Content'];
					
		$comment->Statut =		!System::Meta('BP_COMMENT_APPROVE') ? 'publish' : 'draft';
					
		//enregistrement du commentaire
		if($comment->commit()){
			if($comment->Statut == 'draft'){
				
				$mails = 		Blog::GetInfo('contacts');
				
				$mail = 		new Mail();
				$mail->setType(Mail::HTML);
				$mail->From = 	Blog::GetInfo('contact');
				$mail->addMailTo($mails, Mail::BCC);
				$mail->setSubject("Nouveau commentaire sur ".Blog::GetInfo('uri'));
				
				$preview = 		Blog::GetInfo('uri').$post->Name;
								
				$mail->Message = '
				<html>
				<head>
					<title>Nouveau commentaire</title>
				</head>
				<body>
					<div class="header">
						<h3>Nouveau commentaire sur '.Blog::GetInfo('uri').'</h3>
						<h4>Bonjour,</h4>
					</div>
					<div class="body">
						<p>Un nouveau commentaire vient d\'être posté sur votre et est en attente de validation de votre part.</p>
						<p>Veuillez vous connecter à l\'administration puis rendez-vous dans BlogPress et enfin cliquez sur l\'onglet commentaire pour voir la liste des commentaires en attente de validation.</p>
						
						<h4>Détail du commentaire</h4>
						
						<p>Auteur : '.$comment->Author.'</p>
						<p>E-mail : '.$comment->EMail.'</p>
						<p>Commentaire : </p>
						<p>'.nl2br($comment->Content).'</p>
						
						<p>Cordialiement,</p>
						<p><strong>L\'équipe de '.Blog::GetInfo('title').'</strong></p>
					</div>
				</body>
				</html>';
									
				@$mail->send();
				
			}
		}
		
		header('Location:'.Blog::GetInfo('self').'?confirm=true');
		exit();
		
	}
/**
 * PostComment.onBeforeForm() -> void
 *
 * Cette méthode permet d'afficher des données en tête du formulaire si le formulaire déclenche l'événement `blog:form.before`.
 *
 * #### Exemple
 *
 *     <form action="<?php Blog::Info('submit'); ?>" method="post" name="formRegister" class="form form-register">
 *     <?php
 *         Blog::Fire('form.before'); 
 *     ?>
 *     Formulaire
 *     <?php
 *         Blog::Fire('form.after'); 
 *     ?>
 *     </form>
 *
 **/
	public static function onBeforeForm(){
		
		if(System::GetCMD() != 'post.comment.submit') return;
		
		if(BlogPress::IsError() != ''){
			echo '
				<div class="box-form-error">
					<h2>Erreur dans le formulaire</h2>
					<p>Le formulaire a rencontré une ou plusieurs erreurs indiqués ci-après :</p>
					'.BlogPress::GetError().'
				</div>';
		}
	}
/**
 * PostComment.onAfterForm() -> void
 *
 * Cette méthode permet d'afficher des données en pied de formulaire si le formulaire déclenche l'événement `blog:form.after`.
 *
 * #### Exemple
 *
 *     <form action="<?php Blog::Info('submit'); ?>" method="post" name="formRegister" class="form form-register">
 *     <?php
 *         Blog::Fire('form.before'); 
 *     ?>
 *     Formulaire
 *     <?php
 *         Blog::Fire('form.after'); 
 *     ?>
 *     </form>
 *
 **/	
	public static function onAfterForm(){
		
	}
/**
 * PostComment.Draw() -> void
 *
 * Cette méthode construit et affiche le formulaire permettant de commenter un post.
 **/	
 	public static function Draw(){
		self::DrawForm();	
	}
	
	public static function DrawForm(){
		if(Post::CommentOpen())://test de commentaire ouvert à tous
		
		?>
		<form action="<?php Blog::Info('submit'); ?>" method="post" name="formComment" class="form form-post">
            <input type="hidden" name="cmd" value="post.comment.submit" />
            <input type="hidden" name="Post_ID" value="<?php echo Post::ID(); ?>" />
            
            
            <?php 
				Blog::Fire('form.before'); 
				
				if(!empty($_GET['confirm'])){
					?>
					<div class="box-form-valid">
						<h2>Commentaire correctement enregistré !</h2>
					</div>
                    <?php	
				}
				
				if(!User::IsConnect()):
			?>           
               	<table class="table-form form-table">
            	<tbody>
                <tr><th><label for="Author">Nom *</label></th>
                <td><input id="Author" type="text" name="Author" maxlength="200" value="<?php echo @$_POST['Author'] ?>" /></td>
                </tr>
                <tr><th><label for="EMail">E-mail *</label></th>
                <td><input id="EMail" type="text" name="EMail" maxlength="100" value="<?php echo @$_POST['EMail'] ?>" /></td>
                </tr>
                <tr><th><label for="Url">Site web</label></th>
                <td><input id="Url" type="text" name="Url" maxlength="200" value="<?php echo @$_POST['Url'] ?>" /></td>
                </tr>
            <?php
				else:
			?>
            	<p class="content-login">Logué en tant que <?php echo User::Get()->Login; ?></p>
                <table class="table-form form-table">
            	<tbody>
            <?php
				endif;
			?>
            
            <?php if(Post::IsNotable()): ?>
               	
                <tr>
                    <th><label for="Note">Note</label></th>
                    <td>
                        <select class="box-select" name="Note" id="Note">
                            <option value="-1" selected="selected">Choisissez une note</option>
                            <option value="0" <?php echo @$_POST['Note'] === 0 ? 'selected="selected"' : '' ?>>0</option>
                            <option value="1" <?php echo @$_POST['Note'] == 1 ? 'selected="selected"' : '' ?>>1</option>
                            <option value="2" <?php echo @$_POST['Note'] == 2 ? 'selected="selected"' : '' ?>>2</option>
                            <option value="3" <?php echo @$_POST['Note'] == 3 ? 'selected="selected"' : '' ?>>3</option>
                            <option value="4" <?php echo @$_POST['Note'] == 4 ? 'selected="selected"' : '' ?>>4</option>
                            <option value="5 <?php echo @$_POST['Note'] == 5 ? 'selected="selected"' : '' ?>">5</option>
                        </select>
                    </td>
                </tr>
                
            <?php endif; ?>
            </tbody>
            </table>
            
            <?php if(Post::CommentTracking()): ?>
                <p class="content-tracking">
                    <label for="Tracking">Suivre la conversation ?</label>
                    <select class="box-toggle-button" id="Tracking" Name="Tracking">
                        <option value="0" selected="selected">Non</option>
                        <option value="1">Oui</option>
                    </select>
                </p>
            <?php
			endif;			
			?>
            
            <p class="p-label-content"><label for="Content">Votre commentaire *</label></p>
            <p><textarea id="Content" name="Content"><?php echo @$_POST['Content'] ?></textarea></p>
            
			<?php 
                Blog::Fire('form.after'); 
            ?>
            <p>
        	<span class="button submit"><input type="submit" value="Envoyer" /></span>
            </p>
        </form>
        <?php
		endif;
	}
}

class Comment extends PostComment{}

PostComment::Initialize();
?>