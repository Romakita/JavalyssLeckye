<?php
/** section: MyStore
 * class MyStoreProdutDesigner < Contact  
 * includes ObjectTools
 *
 * Cette classe gère les informations liées à un designer.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_mystore_product_designer.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(class_exists('Contact')):

class MyStoreProductDesigner extends Contact{
	protected static $Instance =	NULL;
	protected static $List =		NULL;
	protected static $MaxLength =	0;
	
	static public function Initialize(){
		System::Observe('blog:start', array(__CLASS__, 'onStart'));
	}
	
	/**
 * Client_Compte.onStart() -> void
 *
 * Cette méthode permet de gérer le démarrage du logiciel et de créer un POST en fonction du PERMALIEN. 
 **/	
	public static function onStart(){
		
		//
		// #PHASE 1 : Analyse du permalien
		//
		//on récupère le permalien qui nous sert de paramètre pour la génération d'un post.
		$link = Permalink::Get();
		
		//on analyse la chaine
		if($link->match('/designers\/([0-9].*)/')){
			
			//
			// #PHASE 2 : Sécurisation du permalien
			//
			
			//le lien correspond à l'ouverture d'un module. $link => http://host.fr/compte/clients/open/1
			//On vérifie donc que le lien soit complet
			
			$parameters = $link->getParameters();//cette méthode découpe le permalien et stock ses infos dans un tableau.
			
			if(count($parameters) < 2){//le lien est incomplet, on redirige donc l'utilisateur vers la page du listing des modules
				header('Location:'.Blog::GetInfo('page:designers'));
				exit();
			}
			
			//récupération du Module si il existe
			$o = new self((int) $parameters[1]);
			self::$Instance = $o;
			
			if($o->Contact_ID == 0){//aucune correspondance en base de données. On redirige.
				header('Location:'.Blog::GetInfo('page:designers'));
				exit();
			}
			
			//
			// #PHASE 3 : Création du POST
			//
			
			//la page compte/clients/open n'existe pas en base de données car il s'agit d'un formulaire dynamique et non d'un module
			
			$post = 			new Post();
			$post->Name = 		Permalink::ToRel((string) $link);//on lui donne un nom unique
			$post->Parent_ID =  Post::ByName('designers')->Post_ID; //pour la création de la chaine d'Ariane c'est important !
			
			$post->Title =		(string) $o;
			
			$post->Template =	'page-mystore-designer.php'; //Une petite mise en page pré-développé pour se simplifier la vie.
			$post->Type =		'page';
			$post->Picture =	$o->Avatar;
			$post->Description = '<p>' . $o->getDescription() . '</p>' . $o->getFullDescription();
			
			Post::Current($post);//on indique que le post en cours est celui-ci.
			//
			// #PHASE 4 : Indiquer à BlogPress que tout va bien
			//
			Template::ImportPage();		//on importe le template.
			BlogPress::StopEvent();		//on stop la propagation de l'événement startpage.
			
			return false;
		}
		
		if($link->match('/compte\/clients/')){//pour le listing c'est plus simple. Un script JS et HOP.
			//
			// #PHASE 0 : si utilisateur non admin, renvoyer directement sur son compte client sans passer par le listing
			//
			if ($link . "/" == Blog::GetInfo('page:compte/clients')){
				$user = Client_Utilisateur::Get();
				$typeCompte = new Client_Type_Compte((int)$user->Type_ID);
				if ($typeCompte->Nom_fr != 'Administrateur'){
					header('Location:' . Blog::GetInfo('page:compte/clients') .'open/' . $user->Client_ID);
					exit;
				}
			}
			
			Blog::EnqueueScript('phibee.client', PHIBEE_URI.'inc/clients/1.0/client.js');	
			
			return;
		}
		
	}
/**
 * MyStoreProdutDesigner.Avatar() -> String
 **/	
	static public function Avatar(){
		return self::$Instance->Avatar;
	}
/**
 * MyStoreProdutDesigner.Name() -> String
 **/	
	static public function Name(){
		return self::$Instance->Name;	
	}	
/**
 * MyStoreProdutDesigner.FirstName() -> String
 **/	
	static public function FirstName(){
		return self::$Instance->FirstName;
	}
/**
 * MyStoreProdutDesigner.ID() -> Number
 **/	
	static public function ID(){
		return self::$Instance->Contact_ID;	
	}
/**
 * MyStoreProdutDesigner.Count() -> Number
 **/	
	static public function Count($id = ''){
		if(empty($id)){
			$id = self::ID();
		}
				
		return Sql::Count(self::TABLE_NAME, 'Categories like "%designer%"');	
	}
	
	public function Permalink(){
		return Blog::GetInfo('uri'). 'designers/' . self::ID() . '/' . Post::Sanitize(trim((string) self::Current()));	
	}
	
	public function getPermalink(){
		return Blog::GetInfo('uri'). 'designers/' . $this->Contact_ID . '/' . Post::Sanitize(trim((string) $this));	
	}
/**
 * MyStoreProdutDesigner#getDescription() -> String
 *
 * Retourne une description courte du designer.
 **/	
	public function getDescription(){
		return empty($this->Comment) ? '' : @$this->Comment->remarque;
	}
	
	public static function GetProducts($clauses = ''){
		$options = new stdClass();
		$options->Designer = self::ID();
		
		return MyStoreProduct::GetList($clauses, $options);
	}
/**
 * MyStoreProdutDesigner.Description() -> String
 *
 * Retourne une description courte du designer.
 **/	
	static public function Description(){
		return self::$Instance->getDescription();	
	}
	
	public function getFullDescription(){
		$medias = $this->Medias;
		
		if(empty($medias) || $medias['length'] == 0){
			return '';
		}
		
		return $medias[0]['Description'];
	}
	
	static public function FullDescription(){
		return self::Current()->getFullDescription();
	}
	
	static public function PreviewPicture(){
		$medias = self::Current()->Medias;
		
		if(empty($medias) || $medias['length'] == 0){
			return '';
		}
		
		return $medias[0]['Link'];
	}
	
	static public function LargePreviewPicture(){
		$medias = self::Current()->Medias;
		
		if(empty($medias) || $medias['length'] < 2){
			return '';
		}
		
		return $medias[1]['Link'];
	}
/**
 * MyStoreProdutDesigner.Current() -> Boolean | Comment
 *
 * Retourne le commentaire en cours.
 **/
	public static function Current($o = NULL){
		
		if(empty($o)){
			return self::$Instance;
		}
		
		if(is_array($o) || is_object($o)){
			
			self::$Instance = new self($o);
			
			//System::Fire('blog:comment.build');
			
			return self::$Instance;	
		}
		
		return self::$Instance;
	}
/**
 * MyStoreProductDesigner.Have() -> Boolean
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

	public static function MaxLength(){
		return self::$MaxLength;	
	}
/**
 * MyStoreProductDesigner.Next() -> Boolean
 *
 * Passe au commentaire suivant.
 **/
	public static function Next(){
		self::$Instance = next(self::$List);
		
		//traitement du post
		if(is_array(self::$Instance) || is_object(self::$Instance)){
			
			self::$Instance = new self(self::$Instance);
			
			//System::Fire('blog:comment.build');
			return self::$Instance;	
		}
		
		
		return self::$Instance = false;
	}
	
	public static function End(){
		self::$Instance = end(self::$List);
		
		if(is_array(self::$Instance) || is_object(self::$Instance)){
			
			self::$Instance = new self(self::$Instance);
			
			//System::Fire('blog:comment.build');
			return self::$Instance;	
		}
		
		return self::$Instance = false;
	}
	
	public static function Reset(){
		self::$Instance = reset(self::$List);
		
		if(is_array(self::$Instance) || is_object(self::$Instance)){
			
			self::$Instance = new self(self::$Instance);
			
			//System::Fire('blog:comment.build');
			return self::$Instance;	
		}
		
		return self::$Instance = false;
	}
/**
 * MyStoreProductDesigner.Prev() -> Boolean
 *
 * Retourne au commentaire précédent.
 **/
	public static function Prev(){
		self::$Instance = prev(self::$List);
		
		if(is_array(self::$Instance) || is_object(self::$Instance)){
			
			self::$Instance = new self(self::$Instance);
			
			//System::Fire('blog:comment.build');
			return self::$Instance;	
		}
		
		return self::$Instance = false;
	}
/**
 * MyStoreProductDesigner.GetListByCategory(id, clauses = '') -> Boolean
 *
 * Cette méthode retourne la liste des Designers ayant travaillé sur des produits d'une catégorie de produit.
 **/	
	public static function GetListByCategory($category, $clauses = ''){
		
		$options = 				new stdClass();
		$options->op = 			'-distinct-designer';
		$options->Category = 	$category;
		
		return MyStoreProduct::GetList($clauses, $options);
	}
	
	public static function GetList($clauses = '', $options = ''){
		
		if(empty($options)){
			$options = new stdClass();	
		}
		
		$options->Category = 'designer';
		
		$result = parent::GetList($clauses, $options);
		
		
		self::SetList($result);	
		return $result;
	}
/**
 * MyStoreProductDesigner.SetList(list) -> void
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
		
	public function __toString(){
		return trim(ucfirst($this->Name) . ' ' . ucfirst($this->FirstName));	
	}
}
MyStoreProductDesigner::Initialize();
endif;
?>