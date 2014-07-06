<?php
/** section: SiteMapGenerator
 * class SiteMapGenerator 
 * includes ObjectTools
 *
 * Cette classe gère les informations liées à un contact
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : abstract_sitemap.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class SiteMapGenerator extends SiteMapXML{
	const PRE_OP =				'smg.';
/**
 *
 **/		
	private static $instance = 	NULL;
/**
 *
 **/	
	private static $stop = 		false;
/**
 *
 **/	
	protected $uris = 			array();
/**
 *
 **/
	static public function Initialize(){
			
		System::observe('gateway.exec', array(__CLASS__, 'exec'));
		System::observe('plugin.active', array(__CLASS__,'Install'));
		System::Observe('plugin.configure', array(__CLASS__,'Install'));
		
		System::Observe('blogpress:robots.write', array(__CLASS__,'WriteRobot'));
		System::Observe('blogpress.post:commit.complete', array(__CLASS__,'setDateUpdate'));
		
		System::EnqueueScript('sitemap.setting', Plugin::Uri().'js/sitemap_setting.js');
		System::AddCss(Plugin::Uri().'css/sitemap.css');
		
	}
/**
 *
 **/	
	static public function Install(){
		
		Cron::Observe('sitemapgenerator', '* * * * *', array(__CLASS__, 'onTick'));
		
		//self::Draw();
	}
/**
 *
 **/	
	static function setDateUpdate(){
		
		$options = self::GetOptions();
		
		$options->NEXT_UDPATE = new DateTime();
		$options->NEXT_UDPATE->add(new DateInterval('PT15M'));		
		$options->NEXT_UDPATE = $options->NEXT_UDPATE->format('Y-m-d H:i');
		
		System::Meta('SMG_OPTIONS', $options);
		
	}
/**
 *
 **/	
	static function onTick(){
		$options = self::GetOptions();
		
		if(!empty($options->NEXT_UDPATE)){
			
			if(date('Y-m-d H:i') == $options->NEXT_UDPATE){
				
				self::Draw();
				self::NotifyGoogle();
				self::NotifyBing();
				self::NotifyMoreover();
				
			}
		}
	}
/**
 *
 **/	
	static public function exec($op){
		
		switch($op){
			
			case self::PRE_OP . 'robots.write':
				BlogPress::WriteRobotsTXT();
				break;
				
			case self::PRE_OP . 'generate':
				
				self::Draw();
							
				break;
						
			case self::PRE_OP . 'notify':
			
				set_time_limit(0);
				ignore_user_abort(true);
		
				self::NotifyGoogle();
				self::NotifyBing();
				self::NotifyMoreover();
								
				break;	
		}
			
	}
/**
 *
 **/	
	static public function Draw(){
		
		set_time_limit(0);
		ignore_user_abort(true);
		
		$sitemap = self::Get();
		$sitemap->stylesheet = SMG_URI.'css/sitemap.xsl';
		
		$BP_HOME_STATIC = System::Meta('BP_HOME_STATIC');
		
		$excludeID = array();
		$excludeLink = array();
		
		$excludes = self::GetOptions()->EXCLUDE;
		
		for($i = 0; $i < count($excludes); $i++){
			array_push(	$excludeLink, $excludes[$i]->link);
		}
	
		//page d'index
		self::Push(array(
			'link' => 		URI_PATH,
			'date' => 		date('Y-m-d H:i:s'),
			'frequency' =>	'daily',
			'priority' =>	'1.0'
		));
		
		//page Blog
		if(!empty($BP_HOME_STATIC)){
			
			$BP_HOME_PAGE = System::Meta('BP_HOME_PAGE');
			
			array_push($excludeID,  $BP_HOME_PAGE);
			
			$BP_BLOG_PAGE = System::Meta('BP_BLOG_PAGE');
			
			if($BP_BLOG_PAGE){
				
				$post = new Post((int) $BP_BLOG_PAGE);
				
				if($post->Post_ID){
					
					array_push($excludeID,  $post->Post_ID);
					
					self::Push(array(
						'link' => 		$post->getPermalink(),
						'date' => 		$post->Date_Update,
						'frequency' =>	'daily',
						'priority' =>	'1.0'
					));
				}
			}
		}
		
		//page contact
		
		$CONTACT_PAGE = System::Meta('CONTACT_PAGE');
		
		if(!empty($CONTACT_PAGE)){
			
			$post = new Post((int) $CONTACT_PAGE);
						
			if($post->Post_ID){	
				
				array_push($excludeID, $post->Post_ID);
			
				self::Push(array(
					'link' => 		$post->getPermalink(),
					'date' => 		$post->Date_Update,
					'frequency' =>	'yearly',
					'priority' =>	'0.2'
				));
			}
			
		}
		
		$includes = self::GetOptions()->INCLUDE;
		
		if(!empty($includes)){
			
			for($i = 0, $len = count($includes); $i < $len; $i++){
				self::Push($includes[$i]);
			}
		}
		
		
		System::Fire('sitemap.exclude.post', array(&$excludeID));
				
		//page blog
		$options = new stdClass();
		$options->Type = 'like post;page';
		$options->exclude = $excludeID;
		
		$list = Post::GetList($options, $options);
		
		for($i = 0; $i < $list['length']; $i++){
			
			$post = new Post($list[$i]);
			
			if(in_array($post->getPermalink(), $excludeLink)){
				continue;	
			}
			
			self::$stop = false;
			
			$post->frequency = 	$post->isPage() ? 'weekly' : 'montly';
			$post->priority = 	0.6;
					
			System::Fire('sitemap.include.post', array(&$post));
			
			if(!self::$stop){
						
				self::Push(array(
					'link' => 		$post->getPermalink(),
					'date' => 		$post->Date_Update,
					'frequency' =>	$post->frequency,
					'priority' =>	$post->priority 
				));
				
			}
		}
		
		$file = System::Path('self') .'sitemap.xml';
		
		$sitemap->write($file);
		
		self::GZip($file);
		
		$n = self::GetOptions()->XML;
		
		if(empty($n)){
			Stream::Delete($file);
		}
		//
		// MAJ INFO
		//
		$options = self::GetOptions();
		
		$options->NEXT_UDPATE = false;
		$options->LAST_UDPATE = date('Y-m-d H:i:s');
				
		System::Meta('SMG_OPTIONS', $options);
	}
/**
 *
 **/	
	static function GZip($src, $level = 5, $dst = false){
		
		$n = self::GetOptions()->GZIP;
		
		if(empty($n)){
			return;
		}
		
		if($dst == false){
			$dst = $src.".gz";
		}
		
		if(file_exists($src)){
			
			$filesize = 	filesize($src);
			$src_handle = 	fopen($src, "r");
			
			if(file_exists($dst)){
				Stream::Remove($dst);
			}
						
			$dst_handle = gzopen($dst, "w$level");
			
			while(!feof($src_handle)){
				$chunk = fread($src_handle, 2048);
				gzwrite($dst_handle, $chunk);
			}
			
			fclose($src_handle);
			gzclose($dst_handle);
			
			return true;
			
		} else {
			error_log("$src doesn't exist");
		}
		return false;
	}
	
	static function Ignore(){
		self::$stop = true;
	}
/**
 *
 **/	
	static public function Get(){
		if(empty(self::$instance)){
			self::$instance = new self();	
		}
		
		return self::$instance;
	}
/**
 *
 **/	
	static public function GetOptions(){
		$options = System::Meta('SMG_OPTIONS');
		
		if(!is_object($options)) {
			$options = new stdClass();
			$options->GOOGLE = 		1;
			$options->BING = 		1;
			$options->MOREOVER =	1;
			$options->GZIP =		1;
			$options->XML =			1;
			$options->ROBOTS =		0;
		}
		
		return $options;
	}
/**
 *
 **/	
	static public function Push($o){
		
		if(is_array($o) || is_object($o)){
			
			$o = $o instanceof SiteMapURL ? $o : new SiteMapURL($o);
			
			if(!in_array($o->link, self::Get()->uris)){
				array_push(self::Get()->childs, $o);
				array_push(self::Get()->uris, $o->link);
			}
		}
	}
/**
 *
 **/	
	static public function NotifyGoogle(){
		
		$n = self::GetOptions()->GOOGLE;
		
		if(empty($n)){
			return;
		}
		
		$link = System::Path('uri') . 'sitemap.xml';
		$file = System::Path('self') . 'sitemap.xml';
		
		if(file_exists($file)){
			echo Stream::Get("http://www.google.com/webmasters/sitemaps/ping?sitemap=" . urlencode($link));
		}
		
	}
/**
 *
 **/	
	static public function NotifyBing(){
		//Ping Google
		$n = self::GetOptions()->BING;
		
		if(empty($n)){
			return;
		}
		
		$link = System::Path('uri') . 'sitemap.xml';
		$file = System::Path('self') . 'sitemap.xml';
		
		if(file_exists($file)){
			echo Stream::Get("http://www.bing.com/webmaster/ping.aspx?siteMap=" . urlencode($link));
		}
		
	}
/**
 *
 **/	
	static public function NotifyMoreover(){
		
		$n = self::GetOptions()->MOREOVER;
		
		if(empty($n)){
			return;
		}
		
		$link = System::Path('uri') . 'sitemap.xml';
		$file = System::Path('self') . 'sitemap.xml';
		
		if(file_exists($file)){
			echo Stream::Get("http://api.moreover.com/ping?u=" . urlencode($link));
		}
		
	}
	
	static public function WriteRobot(&$str){
		
		$n = self::GetOptions()->ROBOT;
		
		if(empty($n)){
			return;
		}
		
		$str .= "\nSitemap: " . $smUrl . "\n";	
	}
}	

SiteMapGenerator::Initialize();
?>