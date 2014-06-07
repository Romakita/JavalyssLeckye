<?php
/**
 * class ShareThis
 **/
class ShareThis implements iPlugin{
/**
 * ShareThis.isStop -> Boolean
 **/	
	private static $isStop = false;
	private static $writedMeta = false;
/**
 * new ShareThis()
 **/	
	function __construct(){
		
	}
/**
 * ShareThis.Initialize(() -> void
 *
 * Cette méthode initialise les événements de la classe.
 **/	
	static public function Initialize(){
		
		if(empty($_GET['type'])){
			System::addScript(Plugin::Uri().'sharethis.js');
			System::addCSS(Plugin::Uri().'css/admin.sharethis.css');
		}
		
		if(empty($_GET['type'])){
			System::Observe('blog:post.build', array('ShareThis','onBuildPost'));
			System::Observe('blog:startinterface', array('ShareThis', 'onStartInterface'));
			System::Observe('blog:header', array('ShareThis','onWriteHeader'));
			System::Observe('plugin.active', array('ShareThis','Install')); 
			System::Observe('plugin.deactive', array('ShareThis','Uninstall')); 
			
			if(class_exists('BlogPress')){
				Blog::ImportCss(Plugin::Uri().'css/sharethis.css');
			}
		}else{
			ShareThis::css();	
		}

	}
/**
 * ShareThis.Install() -> void
 * Cette méthode installe l'extension ou une partie de l'extension gérées par la classe.
 **/
 	static public function Install(){
		System::Meta('ShareThis_AUTO', 1);	
	}
/**
 * ShareThis.Uninstall(eraseData) -> void
 * - eraseData (Boolean): Suppression de données. 
 *
 * Cette méthode désintalle  l'extension et supprime les données liées à l'extension si `eraseData` est vrai.
 **/	
	static public function Uninstall($eraseData = false){
		
	}
/**
 * ShareThis.exec(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/
	public static function exec($op){
		
	}
/**
 * ShareThis.execSafe(op) -> Boolean
 * - op (String): Nom de la commande à exécuter.
 *
 * Cette méthode exécute une commande - en mode non connecté - et affiche un résultat au format JSON de préférence.
 * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
 **/	
	static public function execSafe($op){
		
	}
/**
 * ShareThis.Stop() -> void
 **/
 	static public function Stop(){
		self::$isStop = true;
	}
/**
 * ShareThis.onBuildPost() -> void
 **/	
	static public function onBuildPost(){
		if(System::Meta('ShareThis_AUTO') == 1){
			
			if(!self::$isStop){
				Post::Content(Post::Content(). new self());
			}
			
			self::$isStop = false;
		}
	}
/**
 * ShareThis.onStartInterface() -> void
 **/	
	static public function onStartInterface(){
		Blog::EnqueueScript('extends');	
	}

	
	public static function WriteMeta($array = array()){
		
		if(self::$writedMeta) return;
		
		$options =				new stdClass();
		$options->type = 		'';
		$options->image = 		'';
		$options->app_id = 		'';
		$options->page_id = 	'';
		$options->admins = 		'';
		$options->title =		Blog::GetInfo('title');
		$options->description =	Blog::GetInfo('description');
		$options->href = 		Post::Permalink();
			
		$obj = System::Meta('ShareThis_FB_OPTIONS');
		
		$options->type =		@$obj->TYPE;
		$options->app_id =		@$obj->APP_ID;	
		$options->page_id =		@$obj->PAGE_ID;	
		$options->admins =		@$obj->ADMINS;	
		
		
		if(is_array($array) || is_object($array)){
			foreach($array as $key => $value){
				$options->{strtolower($key)} = $value;
			}
		}
		
		if(empty($options->image) && !empty($obj->IMAGE)){
			$options->image =		$obj->IMAGE;
		}
		
		if(Post::Picture() != ''){
			$options->image = Post::Picture();
		}
		
		if(empty($options->href)){
			$options->href = new Permalink();	
		}
		$options->description = Stream::StripTags($options->description);
		
		//var_dump($options);
		
?>
	
    <meta property="og:title" content="<?php echo $options->title; ?>" />
	<meta property="og:description" content="<?php echo  $options->description; ?>" />
	<meta property="og:type" content="<?php echo $options->type; ?>" />
	<meta property="og:url" content="<?php echo $options->href; ?>" />
<?php
			if(!empty($options->image)):
?>
	<meta property="og:image" content="<?php echo $options->image; ?>" />
<?php
			endif;
?>
	<meta property="og:site_name" content="<?php Blog::Info('name'); ?>" />
<?php
			if(!empty($options->admins)):
?>
	<meta property="fb:admins" content="<?php echo $options->admins; ?>" />
<?php
			endif;
?>
<?php
			if(!empty($options->page_id)):
?>
	<meta property="fb:page_id" content="<?php echo $options->page_id; ?>" />
<?php
			endif;
?>   
	<meta itemprop="name" content="<?php echo $options->title; ?>">
	<meta itemprop="description" content="<?php echo $options->description; ?>">
<?php
		
        self::$writedMeta = true;
	}
/**
 * ShareThis.onWriteHeader() -> void
 **/	
	public static function onWriteHeader(){
		
		self::WriteMeta();
			
		self::onWriteHeaderFB();
		self::onWriteHeaderTwitter();
		self::onWriteHeaderLinkedIn();
		self::onWriteHeaderGPlus();
	}
/**
 * ShareThis.onWriteHeaderFB() -> void
 **/	
	public static function onWriteHeaderFB(){
		
		if(System::Meta('ShareThis_FB') == 1){
			$obj = System::Meta('ShareThis_FB_OPTIONS');
			
			$options =			new stdClass();		
			$options->type = 	'';
			$options->image = 	'';
			$options->app_id = 	'';
			
			//<meta property="fb:admins" content="<?php echo $options->app_id; " />
			foreach($obj as $key => $value){
				$options->{strtolower($key)} = $value;
			}
			
?>
 
	<script>
     /*window.fbAsyncInit = function() {
        FB.init({
          appId: 	'<?php echo $options->app_id ?>', // App ID
          status: 	true, // check login status
          cookie: 	true, // enable cookies to allow the server to access the session
          xfbml: 	true  // parse XFBML
        });
    
        // Additional initialization code here
      };*/
    
        Extends.ready(function(){
            $Body.appendChild('div', {id:"fb-root"});
        });
            
        (function(d){
             var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement('script'); js.id = id; js.async = true;
             js.src = "//connect.facebook.net/fr_FR/all.js#xfbml=1&appId=<?php echo $options->app_id; ?>";
             ref.parentNode.insertBefore(js, ref);
        }(document));
        
     </script>
            
<?php
		}
	}
/**
 * ShareThis.onWriteHeaderTwitter() -> void
 **/	
	public static function onWriteHeaderTwitter(){
		
		if(System::Meta('ShareThis_TWITTER') == 1){
?>
	<script>
    
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
    
    </script>
<?php
		}
	}
/**
 * ShareThis.onWriteHeaderLinkedIn() -> void
 **/	
	public static function onWriteHeaderLinkedIn(){
		
		if(System::Meta('ShareThis_LINKEDIN') == 1){
?>
	<script src="//platform.linkedin.com/in.js" type="text/javascript"></script>
<?php
		}
	}
/**
 * ShareThis.onWriteHeaderGPlus() -> void
 **/	
	public static function onWriteHeaderGPlus(){
		
		if(System::Meta('ShareThis_GPLUS') == 1){
					
?>	            
	<script type="text/javascript">
      window.___gcfg = {lang: 'fr'};
    
      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    </script>
<?php	
		}
	}
/**
 * ShareThis.DrawButtonFB() -> void
 **/		
	public static function DrawButtonFB($obj = array()){
		$options = 			new stdClass();
			
		$options->action =			'like';
		$options->colorschemes = 	'';
		$options->send_button =		false;
		$options->width =			'110';
		$options->show_faces =		false;
		$options->font =			'segoe ui';
		$options->href =			Blog::GetInfo('uri');
		
		$str = 						'';
		$default = 					System::Meta('ShareThis_FB_OPTIONS');
		
		if(!empty($default)){
			foreach($default as $key => $value){
				$options->{strtolower($key)} = $value;
			}
		}
		
		foreach($obj as $key => $value){
			$options->{strtolower($key)} = $value;
		}
		
		if($options->href == ''){
			$options->href = Blog::GetInfo('uri');	
		}		
		
		$actions = $options->action == 'like' ? '' : ' data-action="'.$options->action.'"';
		$colorschemes = $options->colorschemes == 'white' ? '' : ' data-colorschemes="'.$options->colorschemes.'"';
		
		
		$str .= '<div class="fb-like share-button fb-button" data-href="'.$options->href.'" data-send="'. ($options->send_button ? 'true' : 'false') .'" data-layout="'.$options->layout.'" data-width="'.$options->width.'" data-show-faces="'.($options->show_faces ? 'true' : 'false') .'"'.$actions.$colorschemes.'  data-font="'.$options->font.'"></div>';
		
		/*data-action="'.$options->action.'" data-colorscheme="'.$options->colorschemes.'"*/
		return $str;
	}
/**
 * ShareThis.DrawButtonTwitter() -> void
 **/	
	public static function DrawButtonTwitter($obj = array()){
		
		$options = 				new stdClass();
		$options->href =		Blog::GetInfo('uri');
		$options->via =			'';
		$options->relatedto =	'';
		$options->size =		'medium';
		$options->count =		'none';
		$options->hashtags =	'';
		$options->dnt =			false;
		
		$default = System::Meta('ShareThis_TWITTER_OPTIONS');
		
		if(!empty($default)){
			foreach($default as $key => $value){
				$options->{strtolower($key)} = $value;
			}
		}
		
		foreach($obj as $key => $value){
			$options->{strtolower($key)} = $value;
		}
		
		$str = '<div class="share-button twitter-button">
					<a href="'.$options->href.'" class="twitter-share-button" data-via="'.$options->via.'" data-related="'.$options->relatedto.'" data-lang="fr" data-size="'.$options->size.'" data-count="'.$options->count.'" data-hashtags="'.str_replace(' ', '', $options->hashtags).'" data-dnt="'. ($options->dnt ? 'true'  : 'false').'">Tweet</a>
				</div>
				';
						
		return $str;
	}
/**
 * ShareThis.DrawButtonLinkedIn() -> void
 **/	
	public static function DrawButtonLinkedIn($obj = array()){
		$options = 			new stdClass();
		$options->href =	Blog::GetInfo('uri');
		$options->counter =	'no count';
		$default = 			System::Meta('ShareThis_LINKEDIN_OPTIONS');
		
		$str =				'';
		
		if(!empty($default)){
			foreach($default as $key => $value){
				$options->{strtolower($key)} = $value;
			}
		}
		
		foreach($obj as $key => $value){
			$options->{strtolower($key)} = $value;
		}
				
		$str .= '
				<div class="share-button linkedin-button">
					<script type="IN/Share" data-url="'.$options->href.'" data-counter="'.$options->counter.'"></script>
				</div>';
		return $str;
	}
/**
 * ShareThis.DrawButtonMySpace() -> void
 **/	
	public static function DrawButtonMySpace($obj = array()){
		$options = 			new stdClass();
		$options->href =	Blog::GetInfo('uri');
		$default = System::Meta('ShareThis_MYSPACE_OPTIONS');
		
		if(!empty($default)){
			foreach($default as $key => $value){
				$options->{strtolower($key)} = $value;
			}
		}
		
		foreach($obj as $key => $value){
			$options->{strtolower($key)} = $value;
		}
		
		switch($options->size){
			case '16':
				$options->size = System::Path('icon', false) .'16/myspace.png';
				break;
			case '32':
				$options->size = System::Path('icon', false) .'32/myspace.png';
				break;
			case '48':
				$options->size = System::Path('icon', false) .'48/myspace.png';
				break;
			case 'share':
				$options->size = 'http://cms.myspacecdn.com/cms//ShareOnMySpace/Myspace_btn_Share.png';
				break;
			case 'shareonmyspace':
				$options->size = 'http://cms.myspacecdn.com/cms//ShareOnMySpace/Myspace_btn_ShareOnMyspace.png';
				break;
		}
		
		$str = '
		<div class="share-button myspace-button">
			<a href="javascript:void(window.open(\'http://www.myspace.com/Modules/PostTo/Pages/?u=\'+encodeURIComponent(\''.$options->href.'\'),\'ptm\',\'height=450,width=550\').focus())">
    			<img src="'.$options->size.'" border="0" alt="Share on Myspace" />
			</a>
		</div>';
		
		return $str;
	}
/**
 * ShareThis.DrawButtonGPlus() -> void
 **/	
	public static function  DrawButtonGPlus($obj = array()){
		
		$options = 			new stdClass();
		$options->size =		'small';
		$options->annotation = 	'none';
		$options->width =		'110';
		
		$options->href =	Blog::GetInfo('uri');
		$default = 			System::Meta('ShareThis_GPLUS_OPTIONS');
		$str =				'';
		
		if(!empty($default)){
			foreach($default as $key => $value){
				$options->{strtolower($key)} = $value;
			}
		}
		
		foreach($obj as $key => $value){
			$options->{strtolower($key)} = $value;
		}
				
		$str .= '<div class="share-button gplus-button">
					<g:plusone size="'.$options->size.'" href="'.$options->href.'" annotation="'.$options->annotation.'" width="'.$options->width.'"></g:plusone>
				</div>';
		return $str;
	}
/**
 * ShareThis.toString() -> String
 **/	
	public function __toString(){
		
		$sharebar = '<div class="sharebar">';
		$options = 	new stdClass();
		
		if(System::Meta('ShareThis_FB') == 1){
			$options->href = 	Post::Permalink();
			$sharebar .= 		self::DrawButtonFB($options);	
		}
		
		if(System::Meta('ShareThis_TWITTER') == 1){
			$options->href = 	Post::Permalink();
			$sharebar .= 		self::DrawButtonTwitter($options);	
		}
		
		if(System::Meta('ShareThis_LINKEDIN') == 1){
			$options->href = 	Post::Permalink();
			$sharebar .= 		self::DrawButtonLinkedIn($options);	
		}
		
		if(System::Meta('ShareThis_GPLUS') == 1){
			$options->href = 	Post::Permalink();
			$sharebar .= 		self::DrawButtonGPlus($options);	
		}
		
		if(System::Meta('ShareThis_MYSPACE') == 1){
			$options->href = 	Post::Permalink();
			$sharebar .= 		self::DrawButtonMySpace($options);	
		}
		
		$sharebar .= '
			<div class="clearfloat"></div>
		</div>';
		
		return $sharebar;
	}
};
?>