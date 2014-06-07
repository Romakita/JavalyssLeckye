<?php
/** section: InteractiveCatalog
 * class iCatalog
 *
 * Cet espace de nom gère l'extension [[jCarousel]].
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_icatalog.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class iCatalog extends Post{
	
	public static function GetSWF(){
		$link = new Permalink();
		$swf = 	Post::Meta('SWF');
		
		if(!($link->contain('www.'))){
			$swf = str_replace('www.', '', Post::Meta('SWF'));
		}else{
			if(strpos(Post::Meta('SWF'), 'http://') !== false){
				if(!(strpos(Post::Meta('SWF'), 'www.') !== false)){
					$swf = str_replace('http://', 'http://www.', Post::Meta('SWF'));
				}
			}
		}	
		
		return $swf;
	}
/**
 * iCatalog.exec(op) -> int
 * - op (String): Opération envoyé par l'interface.
 *
 * Cette méthode permet de traiter une opération envoyé par l'interface du logiciel.
 **/
	public static function exec($op){
		switch($op){
			
			case 'icatalog.pdf.import':
							
				FrameWorker::Start();
				
				$folder = System::Path('publics') . 'icatalog/';
				@Stream::MkDir(System::Path('publics') . 'icatalog/', 0711);			
								
				FrameWorker::Draw('upload -o="'.$folder.'"');
				
				//récupération du fichier
				$file = 		FrameWorker::Upload($folder, 'pdf;');
				//on renomme le fichier
				$newfile = 		str_replace(basename($file), substr(md5(basename($file)), 0, 15) . '.' . FrameWorker::Extension($file), $file);
				
				chmod($file, 0700);
				
				@Stream::Delete($newfile);
				Stream::Rename($file, $newfile);
				FrameWorker::Resize($newfile);
				FrameWorker::Stop(str_replace(ABS_PATH, URI_PATH, $newfile));
				
				break;	
				
			case 'icatalog.swf.import':
							
				FrameWorker::Start();
				
				$folder = System::Path('publics') . 'icatalog/';
				@Stream::MkDir(System::Path('publics') . 'icatalog/', 0711);			
								
				FrameWorker::Draw('upload -o="'.$folder.'"');
				
				//récupération du fichier
				$file = 		FrameWorker::Upload($folder, 'swf;');
				//on renomme le fichier
				$newfile = 		str_replace(basename($file), substr(md5(basename($file)), 0, 15) . '.' . FrameWorker::Extension($file), $file);
				chmod($file, 0755);
				
				@Stream::Delete($newfile);
				Stream::Rename($file, $newfile);
				FrameWorker::Resize($newfile);
				FrameWorker::Stop(str_replace(ABS_PATH, URI_PATH, $newfile));
				
				break;
				
			case 'icatalog.list':
				
				$list = System::Meta('iCatalogList');
				$options->op = '-admin';
			
				if(empty($list)){
					$array = 	self::GetList('', $options);
					$list = 	array();
					
					for($i = 0; $i < $array['length']; $i++){
						array_push($list, $array[$i]['Post_ID']);	
					}
					
					System::Meta('iCatalogList', $list);
					
					echo json_encode($array);
					return 0;
				}
				
				$tab = 		array();
				$newlist = 	array();
				
				foreach($list as $postid){
					$post = new Post((int) $postid);
					
					if($postid == 0){
						continue;
					}
					
					array_push($tab, new Post((int) $postid));
					array_push($newlist, $postid);
				}
				
				//ajout des nouveaux post
				$options->exclude = $newlist;
				$newpost = self::GetList('', $options);
				//var_dump($newpost);
				for($i = 0; $i < $newpost['length']; $i++){
					array_push($newlist, $newpost[$i]['Post_ID']);
					array_push($tab, $newpost[$i]);	
				}
				
				System::Meta('iCatalogList', $newlist);
				
				echo json_encode($tab);
				
				break;
		}
		
		
	}
	
	public static function execSafe($op){
		switch($op){
			case 'icatalog.download':
				if(!iCatalogs::HasRight()){
					return "You don't have a permission for download this content.";
				}
				
				if(is_numeric($_GET['id'])){
					
					$post = new iCatalog((int) $_GET['id']);
					
					if($post->Post_ID == 0){
						echo "The catalog doesn't exists.";
						return 0;
					}
					
					if($post->getMeta('PDF') == ''){
						echo "The catalog doesn't have downloadable content.";
						return 0;	
					}
					
					//
					// Ajouter le compteur
					//
					
					$stat = new iCStat();
					$stat->Post_ID = $post->Post_ID;
					$stat->commit();
										
					FrameWorker::Download(str_replace(URI_PATH, ABS_PATH, $post->getMeta('PDF')));
				}
				
				break;
		}	
	}
/**
 * iCatalog.GetList([clauses [, options]]) -> Array | boolean
 * - clauses (Object): Objet de restriction de la liste.
 * - options (Object): Objet de configuration de la liste.
 *
 * Cette méthode liste l'ensemble des sociétés du logiciel en fonction des paramètres `clauses` et `options`.
 *
 * #### Le paramètre options
 *
 * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
 * 
 * * `options.op` = "-p" : (Par defaut) Liste tous les posts publiés.
 * * `options.op` = "-post" : Liste tous les posts publiés et brouillons.
 * * `options.op` = "-page" : Liste tous les posts publiés et brouillons.
 * * `options.op` = "-r" : Liste les révisions d'un post avec `option.value = postid`.
 * * `options.op` = "-c" : Liste les les posts d'une categorie avec `option.value = category`.
 * *
 **/
	public static function GetList($clauses = '', $options = ''){
				
		$request = new Request();
		
		$request->select = 	'P.*, P.Title as text, P.Post_ID as value, U.Name AS AuthorName, U.FirstName, U.Login, U.Avatar, CONCAT(U.Name, \' \', U.FirstName) as Author';
		$request->from = 	self::TABLE_NAME . " AS P LEFT JOIN " . User::TABLE_NAME . " AS U ON P.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
		$request->where =	"P.Type LIKE '%icatalog%' "; //Statut like '%publish%' AND Type like '%post%'
		$request->order = 	'Date_Create DESC, Post_ID DESC';
		
		$sqlPublics = "P.Statut like '%publish%'";
		
		if(!User::IsConnect()){
			$sqlPublics = "(P.Statut like '%publish%' AND P.Statut NOT LIKE '%private%')";//
		}
						
		switch(@$options->op){
			case '-admin':
				if(is_array(@$options->exclude)){
					$request->where .= " AND Post_ID NOT IN('" . implode( "', '", $options->exclude)."')";
				}
				break;				
			default:
			case "-publish":
				$request->where = 	"P.Type LIKE '%icatalog%' AND " . $sqlPublics;
				
				if(is_array(@$options->include) && !empty($options->include)){
					$request->where .= " AND P.Post_ID IN ('".implode("', '", $options->include)."')";
				}
				
				if(is_array(@$options->exclude) && !empty($options->exclude)){
					$request->where .= " AND P.Post_ID NOT IN ('".implode("', '", $options->exclude)."')";
				}
				
				if(isset($options->children) && $options->children === false){
					$request->where .= "  AND P.Parent_ID = '0'";	
				}
				
				if(is_array(@$options->parent) && !empty($options->parent)){
					$request->where .= "  AND P.Parent_ID IN ('".implode("', '", $options->parent)."')";	
				}
				
				break;				
		}
		
		if(isset($clauses) && $clauses != ''){
			if(@$clauses->where) {
								
				$request->where .= " AND (
											Title like '%". Sql::EscapeString($clauses->where) . "%'
											OR U.Name like '%". Sql::EscapeString($clauses->where) . "%'
											OR U.FirstName like '%". Sql::EscapeString($clauses->where) . "%'
											OR Content like '%". Sql::EscapeString($clauses->where) . "%'
											OR Keyword like '%". Sql::EscapeString($clauses->where) . "%'
											OR Category like '%". Sql::EscapeString($clauses->where) . "%'
											OR Date_Create like '%". Sql::EscapeString($clauses->where) . "%'
											OR Date_Update like '%". Sql::EscapeString($clauses->where) . "%'
										)";
				
			}
			if(@$clauses->order) 	$request->order = $clauses->order;
			if(@$clauses->limits) 	$request->limits = $clauses->limits;
		}
		
		$result = $request->exec('select');
		//echo $request->query;
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		return self::$Posts = $result; 
	}
}
/**
 * class iCatalogs
 *
 * Cette classe gère une collection de post.
 **/
class iCatalogs extends Posts{
/**
 * iCatalogs.type -> String
 **/
	public $Type =			'icatalog';
/**
 * iCatalogs.HasRight() -> Boolean
 * Cette méthode indique que l'utilisateur à le droit de télécharger du contenu.
 **/	
	public static function HasRight(){
		$options = System::Meta('iCatalogOptions');
		
		if(!empty($options)){
			if(User::IsConnect()){
				$u = User::Get();
				
				if($u->Role_ID == 1) return true;
				
				$result = @$options->Roles[$u->Role_ID];
				
				return $result == 1;
			}
			
			return $options->Roles[0] == 1;	
		}
		
		if(User::IsConnect()){
			if($u->Role_ID == 1) return true;
		}
		
		return false;
	}
/**
 * iCatalogs.Draw() -> String
 **/
	public static function Draw($options = NULL){
		
		$options = $posts = 	new self($options);
		
		if(empty($options->order)){
			$options->order = '';
		}
				
		$posts->Type = 			'icatalog';
		$posts->limits = 		200;
		
		if($options->order == ''){
			$list = System::Meta('iCatalogList');
			$tab = 	array();
			
			foreach($list as $id){
				$posts->include = array($id);
				
				$post = $posts->exec();
				
				if($post['length' ] > 0){
					array_push($tab, $post[0]);	
				}
			}
			
			$posts = $tab;
			$posts['length'] = count($tab);
			
		}else{
			$posts = 				$posts->exec();	
		}
				
		$string =				'';
		
		if($options->title){
			$string = '<h3 class="'.$options->titleClass.'">' . $options->title .'</h3>';
		}
		
		$string .= 				'<ul class="list posts-list">';
		
		$string .= 				self::Children($posts);
		
		$string .= 				'<div class="clearfloat"></div></ul>';
		
		echo $string;
	}
}

?>