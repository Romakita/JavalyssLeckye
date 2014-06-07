<?php
/**
 * class Posts
 *
 * Cette classe gère une collection de post.
 **/
class Posts{
	public $parent =		0;
	public $descendant =	-1;
	public $exclude =		NULL;
	public $include =		NULL;
	public $title =			'Articles';
	public $more =			'plus';
	public $titleClass =	'';
/**
 * Posts.type -> String
 **/
	public $Type =			'post';
/**
 * Posts.limits -> Number
 **/
	public $limits = 		5;
/**
 * Posts.order -> Number
 **/
	public $order = 		'';
	
	public $before = 		'';
	public $after = 		'';
/**
 * Posts.where -> String
 **/
	public $where =			'';
/**
 * Posts.op -> String
 **/
	protected $op = 		'-p';
	protected static $currentOptions = NULL;
/**
 * new Posts()
 *
 * Cette méthode créée une nouvelle instance `Posts`.
 **/
	function __construct($instance = NULL){
		if(is_object($instance) || is_array($instance)){
			foreach($instance as $key => $value){
				$this->$key = $value;
			}
		}
		
		self::$currentOptions = $this;
	}
/**
 * Posts.Draw() -> String
 **/
	static function Draw($options = NULL){
		
		$options = $posts = 	new self($options);
		
		if($options->order == ''){
			$options->order = 'Parent_ID, Menu_Order ASC, Title';
		}
		
		//$posts->descendant = 	0;
		$posts->limits = 		200;
		$posts->Type = 			'page';
		$posts = 				$posts->exec();
		
		$string =				'';
		
		if($options->title) 	$string = '<h3 class="'.$options->titleClass.'">' . MUI($options->title) .'</h3>';
		
		$string .= 				'<ul class="list posts-list">';
		
		$string .= 				self::Children($posts);
		
		if(!empty($options->append)){
			$string .= 			$options->append;	
		}
		
		$string .= 				'<div class="clearfloat"></div></ul>';
		
		echo $string;
	}
/**
 * Posts.Children() -> String
 **/	
	protected static function Children($posts){
		$string = '';
		
		for($i = 0; $i < $posts['length']; $i++){
			$post = new Post($posts[$i]);
			
			$current = $post->Post_ID == Post::ID() ? ' post-current' : '';
			
			System::Fire('blog:posts.draw', array(&$post));
						
			$string .= '<li class="post-entry post-'.$i.' post-'.$post->Post_ID.' post-'.$post->Post_ID.' post-'.Post::Sanitize($post->Title).$current.' level-' . @$post->level . '"><a href="'.Blog::Info('uri', false).$post->Name.'">'. self::$currentOptions->before. MUI($post->Title) . self::$currentOptions->after .'</a>';
			
			if($posts[$i]['children']){
				$sub = self::Children($posts[$i]['children']);
				if($sub){
					$sub = '<ul class="children">'.$sub.'</ul>';	
				}
				
				$string .= $sub;
			}
			
			$string .= '</li>';
		}
		return $string;
	}
/**
 * Posts.Last() -> String
 **/	
	static function Last($options = NULL){
		$options = $posts = new self($options);
		$posts->descendant = 0;
		$posts = $posts->exec();
		
		$string = '<h3 class="'.$options->titleClass.'">' . MUI($options->title);
		
		if($posts['maxLength'] > $posts['length']){
			$string .= '<a class="more" href="'.Blog::GetInfo('blog').'">'.MUI($options->more).'</a>';	
		}
		
		$string .= '</h3><ul class="list posts-list posts-recently">';
		
		for($i = 0; $i < $posts['length']; $i++){
			$post = new Post($posts[$i]);
			
			System::Fire('blog:posts.draw', array(&$post));
			
			$string .= '<li class="post-entry post-'.$post->Post_ID.' post-'.Post::Sanitize($post->Title).'"><a href="'.Blog::Info('uri', false).$post->Name.'">'. MUI($post->Title) .'</a></li>';
		}
		
		$string .= '<li class="clearfloat"></li></ul>';
		
		echo $string;
	}
/**
 * Posts.exec() -> Array
 **/
	public function exec(){
		
		$request = 			new Request(DB_BLOGPRESS);
		
		$request->select = 	'P.*, U.Name AS AuthorName, U.FirstName, U.Login, U.Avatar, CONCAT(U.Name, \' \', U.FirstName) as Author';
		$request->from = 	Post::TABLE_NAME . " AS P LEFT JOIN " . User::TABLE_NAME . " AS U ON P.".User::PRIMARY_KEY." = U.".User::PRIMARY_KEY;
		$request->where =	"Type LIKE '%".$this->Type."%' AND Parent_ID = ".((int) $this->parent);
		$request->order = 	'Parent_ID, Menu_Order ASC, Date_Create DESC';
		$request->limits =  "0,5";
		$request->onexec =	array(&$this, 'onGetList');
		
		$sqlPublics = "P.Statut like '%publish%'";
						
		if(!User::IsConnect()){
			$sqlPublics = "(P.Statut like '%publish%' AND P.Statut NOT LIKE '%private%')";
		}
		
		if(is_array($this->include) && !empty($this->include)){
			$request->where .= " AND P.Post_ID IN ('".implode("', '", $this->include)."')";
		}
		
		if(is_array($this->exclude) && !empty($this->exclude)){
			$request->where .= " AND P.Post_ID NOT IN ('".implode("', '", $this->exclude)."')";
		}
		
		$request->where .= ' AND ' . $sqlPublics;
		
		if(@$this->where) {
							
			$request->where .= " AND (
										Title like '%". Sql::EscapeString($this->where) . "%'
										OR Author like '%". Sql::EscapeString($this->where) . "%'
										OR U.Name like '%". Sql::EscapeString($this->where) . "%'
										OR U.FirstName like '%". Sql::EscapeString($this->where) . "%'
										OR Content like '%". Sql::EscapeString($this->where) . "%'
										OR Keyword like '%". Sql::EscapeString($this->where) . "%'
										OR Category like '%". Sql::EscapeString($this->where) . "%'
										OR Date_Create like '%". Sql::EscapeString($this->where) . "%'
										OR Date_Update like '%". Sql::EscapeString($this->where) . "%'
									)";
			
		}
		
		if(@$this->order) 	$request->order = $this->order;
		if(@$this->limits) 	$request->limits = $this->limits;
		
		$result = $request->exec('select');
		
		if($result){
			$result['maxLength'] = Sql::count($request->from, $request->where);
		}
		
		return $result; 
	}
/**
 * Posts.onGetList() -> void
 **/	
	public function onGetList(&$row){
		
		$row['children'] = 			new self($this);
		$row['children']->parent = $row['Post_ID'];
		$row['children']->include = NULL;
		$row['children']->exclude = NULL;
				
		if($this->descendant != 0){
			$row['children'] = 			$row['children']->exec();
		}
		
		$row['Nb_Comments'] = Sql::count(Comment::TABLE_NAME, 'Post_ID = ' . (int) $row['Post_ID']);
	}
}
?>