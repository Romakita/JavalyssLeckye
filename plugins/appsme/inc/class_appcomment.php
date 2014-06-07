<?php
/** section: AppsMe
 * class AppComment 
 * includes ObjectTools
 *
 * Cette classe gère l'édition et la lecture de commentaire.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_appAppComment.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
define("TABLE_APPCOMMENT", PRE_TABLE.'applications_releases_comments');
class AppComment extends ObjectTools implements iClass{
/**
 * AppComment.TABLE_NAME -> String
 * Nom de la table gérée par la classe.
 **/
	const TABLE_NAME = 			TABLE_APPCOMMENT;
/**
 * AppComment.PRIMARY_KEY -> String
 * Clef primaire de la table AppComment.TABLE_NAME gérée par la classe.
 **/
	const PRIMARY_KEY = 		'Comment_ID';
/**
 * AppComment#Comment_ID -> Number
 * Numéro d'identification du commentaire.
 **/
 	public $Comment_ID = 		0;
/**
 * AppComment#Post_ID -> Number
 * Numéro d'identification du post.
 **/
	public $Post_ID = 			0;
/**
 * AppComment#User_ID -> Number
 **/
	public $User_ID = 			0;
/**
 * AppComment#Author -> String
 * Auteur du commentaire.
 **/
 	public $Author =			'';
	public $Avatar =			'';
/**
 * AppComment#EMail -> String
 * Adresse e-mail de l'auteur du commentaire.
 **/
 	public $Email =				'';
/**
 * AppComment#Tracking -> String
 * Indique que l'utilisateur souhaite suivre la discussion par e-mail.
 **/
 	public $Tracking =			'';
/**
 * AppComment#IP -> String
 * Adresse IP de l'auteur du commentaire.
 **/
 	public $IP =				'';
/**
 * AppComment#User_Agent -> String
 * User Agent de l'auteur du commentaire.
 **/
 	public $User_Agent =		'';
/**
 * AppComment#Content -> String
 * Contenu du commentaire.
 **/	
	public $Content =			'';	
/**
 * AppComment#Note -> String
 * Note du commentaire.
 **/	
	public $Note =				'';
/**
 * AppComment#Date_Create -> String
 * Date de création du commentaire.
 **/
 	public $Date_Create =		'';
/**
 * AppComment#Statut -> String
 **/
	static $Comment =			NULL;
	static $Comments =			NULL;
/**
 * new Comment()
 * new Comment(json)
 * new Comment(array)
 * new Comment(obj)
 * new Comment(id)
 * - json (String): Chaine de caractère JSON équivalent à une instance [[Comment]].
 * - array (Array): Tableau associatif équivalent à une instance [[Comment]]. 
 * - obj (Object): Objet équivalent à une instance [[Comment]].
 * - id (int): Numéro d'identifiant d'un commentaire. Les informations du commentaire seront récupérés depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[Comment]].
 *
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
				$request = 			new Request();
				
				$request->select = 	'*';
				$request->from = 	self::TABLE_NAME;
				$request->where =	self::PRIMARY_KEY .' = '.$arg_list[0];
				
				$u = $request->exec('select');
				
				if($u['length'] > 0){
					$this->extend($u[0]);
					if($numargs == 1) self::$Comment = $this;
				}
			}
			elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);
		}
		
	}
	
	public static function Initialize(){
		
	}
/**
 * ApplicationReleaseComment.Install() -> void
 *
 * Cette méthode installe la table gérée par la classe.
 **/	
	public static function Install(){
		$request = 			new Request();
		
		$request->query = 	"CREATE TABLE ".self::TABLE_NAME." (
		  `Comment_ID` bigint(20) NOT NULL AUTO_INCREMENT,
		  `Release_ID` bigint(20) NOT NULL,
		  `User_ID` bigint(20) NOT NULL DEFAULT '0',
		  `Author` varchar(200) NOT NULL,
		  `Email` varchar(100) NOT NULL DEFAULT '',
		  `Tracking` tinyint(1) NOT NULL DEFAULT '0',
		  `Url` varchar(200) NOT NULL DEFAULT '',
		  `IP` varchar(100) NOT NULL DEFAULT '',
		  `User_Agent` varchar(255) NOT NULL DEFAULT '',
		  `Content` longtext NOT NULL,
		  `Note` int(11) NOT NULL,
		  `Date_Create` datetime NOT NULL,
		  `Statut` varchar(30) NOT NULL DEFAULT 'draft',
		  PRIMARY KEY (`Comment_ID`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8";
		$request->exec('query');	
	}
/**
 * AppComment.commit() -> Boolean
 *
 * Cette méthode ajoute un post si ce dernier n'existe pas ou enregistre les informations en base de données dans le cas contraire.
 * Cette méthode retourne vrai si la mise à jour des données réussi.
 **/
	public function commit(){
		$request = 			new Request();
		$request->from = 	self::TABLE_NAME;
		
		if($this->Date_Create == '') {
			$this->Date_Create = date('Y-m-d H:i:s');
		}
		
		if(User::IsConnect()){
			$this->User_ID = User::Get()->User_ID;	
		}else{
			$this->User_ID = '0';	
		}
		
		if($this->Comment_ID == 0){
						
			$request->fields = 	"(`Release_ID`, `User_ID`, `Author`, `Email`, `Tracking`, `IP`, `User_Agent`, `Content`, `Note`, `Date_Create`)";
			$request->values = 	"(
									'".Sql::EscapeString($this->Release_ID)."',  
									'".Sql::EscapeString($this->User_ID)."', 
									'".Sql::EscapeString($this->Author)."', 
									'".Sql::EscapeString($this->Email)."', 
									'".Sql::EscapeString($this->Tracking)."',
									'".Sql::EscapeString($this->IP)."',
									'".Sql::EscapeString($this->User_Agent)."',
									'".Sql::EscapeString($this->Content)."',
									'".Sql::EscapeString($this->Note)."', 
									'".Sql::EscapeString($this->Date_Create)."'
								)";
			
			if($request->exec('insert')){
				$this->Comment_ID = $request->exec('lastinsert');		
				
				if($this->Statut == "publish"){
					//$this->notify();
				}
						
				return true;
			}
			
			return false;
		}
		
		$request->set = "`Content` = '".Sql::EscapeString($this->Content)."',
						`Statut` = '".Sql::EscapeString($this->Statut)."'";
						
		if($this->Statut == "publish"){
			$this->notify();
		}
		
		$request->where = self::PRIMARY_KEY . ' = ' . $this->Comment_ID;
		//echo $request->compile('update');
		return $request->exec('update');
	}
	
	public function delete(){
		
	}
/**
 * Post.exec(command) -> int
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 * #### Liste des commandes gérées par cette méthode
 *
 * Les commandes suivantes doivent avoir un objet [[Post]] au format `JSON` dans `$_POST['Post']`.
 *
 * * `societe.commit`: Enregistre les informations de l'instance en base de données.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case "appcomment.commit":
				
				$comment = 	new self($_POST['Comment']);
								
				if(!$comment->commit()){
					return 'appcomment.commit.err';
				}
				echo $comment->toJSON();
				break;
				
			case "appcomment.delete":
				$comment = 	new self($_POST['Comment']);
								
				if(!$comment->delete()){
					return 'appcomment.delete.err';
				}
				echo $comment->toJSON();
				break;
			
			case "appcomment.list":
				
				$tab = self::GetList($_POST['clauses'], $_POST['options']);
				
				if(!$tab){
					return "appcomment.list.err";	
				}
								
				echo json_encode($tab);
				break;	
			
		}
		
		return 0;	
	}	
/**
 * AppComment.Author() -> String
 **/	
	static public function Author(){
		return is_object(self::$Comment) ? self::$Comment->Author : self::$Comment['Author'];	
	}
/**
 * AppComment.Avatar() -> String
 **/	
	static public function Avatar(){
		return is_object(self::$Comment) ? self::$Comment->Avatar : self::$Comment['Avatar'];	
	}
/**
 * AppComment.ClassName() -> String
 **/	
	static public function ClassName($str = ''){
		return strtolower("comment " . Post::Sanitize(Post::CommentStatut()). " comment-" . self::ID() . ' ' .$str); 
	}
/**
 * Post.Content() -> String
 **/	
	static public function Content($str = ''){
		
		if($str != ''){
			if(is_object(self::$Comment)){
				self::$Comment->Content = $str;	
			}else{
				self::$Comment['Content'] = $str;
			}
		}
				
		return is_object(self::$Comment) ? self::$Comment->Content : self::$Comment['Content'];	
	}
/**
 * AppComment.Current() -> Boolean | Comment
 *
 * Retourne le commentaire en cours.
 **/
	public static function Current($comment = NULL){
		
		if(empty($comment)){
			return is_object(self::$Comment) ? self::$comment : ( self::$comment = false );
		}
		
		self::$comment = $comment;
		
		System::Fire('blog:AppComment.build');
		
		return self::$comment;
	}
/**
 * AppComment.ID() -> Number
 **/	
	static public function ID(){
		return is_object(self::$Comment) ? self::$Comment->Post_ID : self::$Comment['Comment_ID'];	
	}
/**
 * AppComment.Date() -> String
 **/	
	static public function Date($format = '', $lang = 'fr', $encode = 'uft8'){
		if($format == '') return is_object(self::$Comment) ? self::$Comment->Date : self::$Comment['Date_Create'];
		
		//setlocale(LC_TIME, $lang.'_'.strtoupper($lang));
		
		$strlang = strtolower(substr($lang, 0, 2)).'_'.strtoupper(substr($lang, 0, 2)).'.'.$encode;
		
		setlocale (LC_TIME, $strlang, $encode);

		$date = explode(' ', self::Date());
		$date[0] = explode('-', $date[0]);
		$date[1] = explode(':', $date[1]);
		
		if (strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {
			$format = preg_replace('#(?<!%)((?:%%)*)%e#', '\1%#d', $format);
		}
		
		return str_replace(array(
				'January', 'February', 'Marsh', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
				'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
			), array(
				'Janvier', 'Fevrier', 
				'Mars', 'Avril', 
				'Mai', 'Juin', 
				'Juillet', 'Aout', 
				'Septembre', 'Octobre', 
				'Novembre', 'Decembre',
				'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
			), strftime($format, mktime($date[1][0], $date[1][1], $date[1][2], $date[0][1], $date[0][2], $date[0][0])));
	}
/**
 * AppComment.Have() -> Boolean
 * 
 * Cette méthode indique si [[AppComment.GetList]] a retourné des commentaires.
 **/
	public static function Have(){
		if(is_array(self::$Comments)){
			return self::$Comments['length'] > 0;
		}
		return false;
		//return self::GetList();
	}

/**
 * AppComment.Next() -> Boolean
 *
 * Passe au commentaire suivant.
 **/
	public static function Next(){
		self::$Comment = next(self::$Comments);
		
		//traitement du post
		if(is_array(self::$Comment)){
			System::Fire('blog:AppComment.build');
			return self::$Comment;	
		}
		
		
		return self::$Comment = false;
	}
/**
 * AppComment.Prev() -> Boolean
 *
 * Retourne au commentaire précédent.
 **/
	public static function Prev(){
		self::$Comment = prev(self::$Comments);
		
		if(is_array(self::$Comment)){
			System::Fire('blog:AppComment.build');
			return self::$Comment;	
		}
		
		return self::$Comment = false;
	}
/**
 * AppComment.Pagination() -> String
 **/
 	public static function Pagination($flag = false){
		$paginations = '';
		$get = '';
		
		if(isset($_GET['search'])){
			$get = '?search='.$_GET['search'];
		}
		
		$nbpost = System::Meta('BP_NB_POST_PER_PAGE');
		
		if(Post::CountMax() > $nbpost){
						
			$pages = ceil(Post::CountMax() / $nbpost);
			
			$link =  	BlogPress::GetPermalink().'/';			
			$current = 	0;
			
			if(preg_match('/page\/([0-9]*)\//', $link, $match)){
				$current = 	$match[1]-1;
				$link = 	str_replace($match[0], '', $link);
			}
			
			for($i = 0; $i < $pages; $i++){
				if($i == $current){
					$button = new SimpleButton('#', $i+1);
					$button->pushAttr('class', 'simple-button-selected');
					$paginations .= $button.'';
					continue;
				}
				
				$button = new SimpleButton($link.'page/'.($i+1).'/'.$get, $i+1);
				$paginations .= $button.'';
			}
			
			if($current == 0){
				$button = 		new SimpleButton($link.'page/'. ($current + 2).'/'.$get, 'Suivant');
				$paginations .= $button.'';
				
			}elseif($current == $pages-1){
				
				$button = 		new SimpleButton($link.'page/'.($current).'/'.$get, 'Précèdent');
				$paginations = $button.$paginations;
				
			}else{
				$button = 		new SimpleButton($link.'page/'.($current).'/'.$get, 'Précèdent');
				$paginations = $button.$paginations;
				$button = 		new SimpleButton($link.'page/'. ($current + 2).'/'.$get, 'Suivant');
				$paginations .= $button.'';
			}
			
		}
		
		return $paginations;
	}
/**
 * AppComment.notify() -> void
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
 * AppComment.Unregister() -> Boolean
 *
 * Cette méthode permet à un utilisateur de ce désabonner d'une discussion.
 **/
	public static function Unregister($post, $email){
		$request = new Request();
		
		$request->where = 	"`EMail` = '" . Sql::EscapeString($email) ."' AND Post_ID = " . ((int) $post);
		$request->set = 	"`Tracking` = '0'";
		
		return $request->exec('update');	
	}
/**
 * AppComment.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des sociétés du logiciel en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 *
 **/
	public static function GetList($clauses = '', $options = ''){
				
		$request = new Request();
		
		if(User::IsConnect()){
			$request->select = 	'A.*, R.Version';
		}else{
			$request->select = 	'A.Comment_ID, A.Release_ID, A.User_ID, A.Author, A.Email, A.Tracking, A.Url, A.Content, A.Note, A.Date_Create, A.Statut, R.Version';
		}
		
		$request->from = 	self::TABLE_NAME . ' A INNER JOIN '.Release::TABLE_NAME.' R ON A.'.Release::PRIMARY_KEY.' = R.'.Release::PRIMARY_KEY;
		$request->where =	"R.Statut = 'publish'";
		$request->order = 	'A.Date_Create DESC';
		$request->onexec = 	array('AppComment', 'onGetList');
		
		if(!empty($options)){
			
			if(!empty($options->app)){//application
				$request->where .= " AND R.".App::PRIMARY_KEY." = '". (int) $options->app ."'";
			}else{
				if(User::IsConnect()){
					$request->where .= " AND A.".User::PRIMARY_KEY." = '". User::Get()->User_ID ."'";
				}else{
					die('application.id.notfound');	
				}
			}
		}
		
		switch(@$options->op){
			default:break;
				
			case '-tracking':
				$request->select = 	'DISTINCT Email';
				$request->where =	'Tracking = 1';
				break;				
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " AND (
											Author like '%". Sql::EscapeString($clauses->where) . "%'
											OR EMail like '%". Sql::EscapeString($clauses->where) . "%'
											OR IP like '%". Sql::EscapeString($clauses->where) . "%'
											OR Content like '%". Sql::EscapeString($clauses->where) . "%'
										)";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		//echo $request->query;
			
		return self::$Comments = $result; 
	}
	
	public static function onGetList(&$row, &$request){
		if(1 * $row['User_ID'] != 0){
			$user = new User((int) $row['User_ID']);
			$row['Author'] = $user->Login;
		}
	}
/**
 * AppComment.onSubmit() -> void
 * Cette méthode valide les informations du formulaire.
 **/
	public static function onSubmit(){
		if(empty( $_POST['Post_ID'])){
			BlogPress::SetError('Une erreur est survenue lors de la création du commentaire (code AppComment.postid.empty)');
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
		
		if(BlogPress::IsError() == ''){
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
			
			$comment->Statut =		System::Meta('BP_COMMENT_APPROVE') ? 'publish' : 'wait';
			
			//enregistrement du commentaire
			$comment->commit();	
			
			header('Location:'.Blog::GetInfo('self').'?confirm=true');
			exit();
		}
	}
/**
 * AppComment.onBeforeForm() -> void
 * Cette méthode affiche les messages de traitement du formulaire.
 **/	
	public static function onBeforeForm(){
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
 * AppComment.DrawForm() -> void 
 **/		
	public static function DrawForm(){
		if(Post::CommentOpen())://test de commentaire ouvert à tous
		
		?>
		<form action="<?php Blog::Info('submit'); ?>" method="post" name="formComment" class="form form-post">
            <input type="hidden" name="cmd" value="post.AppComment.submit" />
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
                    <th>
                        <select class="box-select" name="Note" id="Note">
                            <option value="-1" selected="selected">Choisissez une note</option>
                            <option value="0" <?php echo @$_POST['Note'] === 0 ? 'selected="selected"' : '' ?>>0</option>
                            <option value="1" <?php echo @$_POST['Note'] == 1 ? 'selected="selected"' : '' ?>>1</option>
                            <option value="2" <?php echo @$_POST['Note'] == 2 ? 'selected="selected"' : '' ?>>2</option>
                            <option value="3" <?php echo @$_POST['Note'] == 3 ? 'selected="selected"' : '' ?>>3</option>
                            <option value="4" <?php echo @$_POST['Note'] == 4 ? 'selected="selected"' : '' ?>>4</option>
                            <option value="5 <?php echo @$_POST['Note'] == 5 ? 'selected="selected"' : '' ?>">5</option>
                        </select>
                    </th>
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
        	<span class="button"><input type="submit" value="Envoyer" /></span>
            </p>
        </form>
        <?php
		endif;
	}
}
?>