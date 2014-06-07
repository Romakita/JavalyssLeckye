<?php
/** section: Plugins
 * class MyStoreCollection < Post
 * includes ObjectTools
 *
 * Cette classe gère les fonctionnalités liées à la table #CLASS.
 *
 * #### Information 
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_post.php.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyStoreCollection extends Post{	
	const PRE_OP =				'mystore.collection.';
/**
 * MyStoreCollection.Initialize() -> void
 *
 * Cette méthode initialise les événements que la classe doit écouter.
 **/	
	public static function Initialize(){
						
		System::Observe('gateway.exec', array(__CLASS__, 'exec'));
		System::Observe('gateway.exec.safe', array(__CLASS__, 'execSafe'));
		System::Observe('blog:post.build', array(__CLASS__, 'onBuildPost')); 
		
		System::EnqueueScript('mystore.collection', Plugin::Uri().'js/mystore_collection.js');
		
	}
	
	public static function onBuildPost(){
		
		if(strpos(Post::Type(), 'page-mystore collection') !== false){
			$post = self::Current();
			$o = 	new self((int) Post::ID());
			
			self::Set($o);
		}
	}
/**
 * MyStoreCollection.exec(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function exec($op){
		
		switch($op){
			case self::PRE_OP . 'import':
				
				self::Import();
				
				break;
						
			case self::PRE_OP."exists":
				
				$o = new self($_POST[__CLASS__]);
				
				echo json_encode($o->exists());
				
				break;
							
			case self::PRE_OP."select.list":
				if(!empty($_POST['word'])){
					if(is_object($_POST['options'])){
						$_POST['options']->word = 	$_POST['word'];
					}else{
						$_POST['options'] = new stdClass();
						$_POST['options']->word = 	$_POST['word'];
					}
				}
			
				$tab = self::GetListForSelect($_POST['options']);
				
				if(!$tab){
					return $op.'.err';	
				}
				
				echo json_encode($tab);
				break;
				
			case self::PRE_OP."distinct":
				
				$tab = MyStoreProduct::Distinct('Collection', @$_POST['word'], @$_POST['default']);
				
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
				
		}
		
		return 0;	
	}
	
	
/**
 * MyStoreCollection.execSafe(command) -> Number
 * - command (String): Commande à éxécuter.
 *
 * Cette méthode `static` éxécute une commande envoyée par l'interface du logiciel.
 *
 **/
	public static function execSafe($op){
		
	}
/**
 * MyStoreCollection#exists() -> void
 *
 * Cette méthode vérifie si l'instance existe en base de données.
 **/	
	public function exists(){		
		return Sql::Count(self::TABLE_NAME, "`".self::PRIMARY_KEY."` != ".$this->Post_ID." AND Title = '".Sql::EscapeString($this->UniqueKey)."' AND Type like 'page-mystore collection'") > 0;
	}
	
	public static function Import(){
		
		$folder = (System::Meta('USE_GLOBAL_DOC') ? System::Path('publics.global') : System::Path()).'collection/';
		@Stream::MkDir($folder, 0775);
		FrameWorker::Start();
						
		//récupération du fichier
		$file = 		FrameWorker::Upload($folder, 'jpg;jpeg;png;gif;bmp;');
		//on renomme le fichier
		$newfile = 		str_replace(basename($file), substr(md5(date('Ymdhis')), 0, 15) . '.' . FrameWorker::Extension($file), $file);
		
		Stream::Rename($file, $newfile);
		FrameWorker::Resize($newfile);
		FrameWorker::Stop(str_replace(ABS_PATH, URI_PATH, $newfile));
		
	}
	
	public static function GetProducts($clauses = ''){
		$options = new stdClass();
		$options->Collection = self::Title();
		
		$result = MyStoreProduct::GetList($clauses, $options);
		Post::$Post = $result['length'] > 0 ? $result[0] : false;
		return $result;
	}
/**
 * MyStoreCollection.GetList([clauses [, options]]) -> Array | boolean
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
		$request->where =	'Type like "%page-mystore collection%"'; 
		$request->order = 	'Title ASC';
		
		if(!User::IsConnect()){
			$request->where .=	' AND Statut LIKE "%publish%" ';	
			$request->where .=	' AND Statut NOT LIKE "%private%" ';
		}else{
			if(empty($options->draft)){
				$request->where .=	' AND Statut LIKE "%publish%" ';	
			}
		}
				
		if(!empty($options->exclude)){
			if(is_array($options->exclude)){
				$request->where .=	" AND Post_ID NOT IN(" . implode(',', $options->exclude) . ')';
			}else{
				$request->where .=	" AND Post_ID != " . ((int) $options->exclude);
			}
		}
		
		$request->observe(array(__CLASS__, 'onGetList'));
				
		switch(@$options->op){
			default:break;
		}
		
		if(!empty($clauses)){
			if(!empty($clauses->where)) {
								
				$request->where .= " 	AND (`Post_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Parent_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`User_ID` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Category` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Title` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Title_Header` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Picture` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Content` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Summary` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Keyword` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Create` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Date_Update` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Name` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Type` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Statut` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Comment_Statut` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Template` like '%".Sql::EscapeString($clauses->where)."%' OR 
								`Menu_Order` like '%".Sql::EscapeString($clauses->where)."%')";
				
			}
			if(!empty($clauses->order)) 	$request->order = $clauses->order;
			if(!empty($clauses->limits)) 	$request->limits = $clauses->limits;
		}
				
		$result = $request->exec('select');
		//var_dump($request->query);
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		return $result; 
	}
	
	public static function onGetList(&$row, &$request){
		$options = new stdClass();
		$options->Collection = $row['Title'];
		
		$row['NbProduct'] = MyStoreProduct::Count($options);
	}
}

MyStoreCollection::Initialize();

?>