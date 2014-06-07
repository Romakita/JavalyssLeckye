<?php
/** section: jGalery
 * class jCarousel
 *
 * Cette classe gère un carrousel.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_jCarousel.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class BrickArray extends jGalery{
	static $FixedWidth =		false;
	static $PictureMaxWidth =	130;
	static $PictureMaxHeight =	-1;
	static $AUTO_INCREMENT =	0;
/**
 * BrickArray.BrickArray(array) -> String
 *
 * Cette méthode transforme une liste de galerie photo en tableau de Brick Photo.
 **/
 	public static function DrawArray($array){
		$string = 	'';
		$btns =		'';
		$id = 		"scroll-bar-".self::$AUTO_INCREMENT++;
		
		foreach($array as $o){
			if(!($o instanceof jGalery)){
				if(is_numeric($o)){
					$o = new self((int) $o);	
				}else{
					$o = self::ByName(utf8_encode(html_entity_decode($name)));
				}
			}
			
			$o = new self($o);
						
			if($o ){
				$pictures = $o->getPictures();
				
				if($pictures['length'] > 0){
				//	$js = javascript:$(\''.$id.'\').scrollTo($(\'' . strtolower(Stream::Sanitize($o->Name, '-')).'\')),
					
					$btns .= 	'<a class="button" href="#'.strtolower(Stream::Sanitize($o->Name, '-')) .'">' . $o->Name ."</a>";
					$string .= 	$o->draw(false);
				}
			}
		}
				
		return '
			<div class="nav-galery-brick">'.$btns.'</div>
			<div class="brick-array" id="'.$id.'">
				<div class="box-galery-brick" style="display:none">
					'.$string.'
				</div>
			</div>';
	}
/**
 * jCarousel.brick() -> String
 *
 * Cette méthode transforme l'instance en mur de brique HTML.
 **/
	public function draw($bool = true){
		
		$pictures = $this->getPictures();
		
		
		
		for($i = 0, $len = $pictures['length']; $i < $len; $i++){
			$pictures[$i] =	new jPicture($pictures[$i]);
			$pictures[$i]->Miniature  = jPicture::GetMiniature($pictures[$i]->Src);
		}
		
		return $this->layoutBrick($pictures, $this->Name, $bool);
	}
/**
 * jCarousel#layoutBrick(pictures, name [, bool]) -> String
 **/	
	protected function layoutBrick($pictures, $name, $bool = true){
		$string = 	'';
		$i = 		0;
		$id = 		strtolower(Stream::Sanitize($name, '-'));
		
		$options =					new stdClass();
		$options->className =		'';
		$options->themeBA =			'white';
		$options->themeLightBox =	'white';
		$options->fixed =			self::$FixedWidth;
		$options->maxWidth = 		self::$PictureMaxWidth;
		$options->maxHeight = 		self::$PictureMaxHeight;
			
		if($bool){
			$settings = $this->getSettings($options);
		}else{
			$settings = $options;	
		}
		
		$load = 	false;
		
		for($i = 0; $i < $pictures['length']; $i++){
			
			$picture =  	$pictures[$i];
			$dimension = 	'width="100%"';
			
			//if(empty($picture->Miniature)) continue;
			
			$file = 			System::Path('publics'). 'jgalery/' . $picture->Galery_ID . '/' . Stream::Sanitize(basename($picture->Src), '-');
			$fileThumbnail = 	System::Path('publics'). 'jgalery/' . $picture->Galery_ID . '/' . Stream::Sanitize(basename($picture->Miniature), '-');
			
			if(!file_exists($file)){
				$f = 			File::ToABS($picture->Src);
				
				if(strpos($f , 'http://') !== false || strpos($f , 'https://') !== false){
					
					set_time_limit(0);
					
					if(!$load){
						@ob_clean();
						@header( 'Content-type: text/html; charset=utf-8' );
						echo '<div class="jgalery-load-info">Chargement des galeries photo en cours. Veuillez patienter...</div>';
						echo '<div class="jgalery-load-info-progress"><div class="mask"></div></div>
						<style>
							.jgalery-load-info-progress{
								width:300px;
								border:2px solid #CCC;
								position:relative;
								height:20px;
								margin-top:10px;
								overflow:hidden;							
							}
							
							.jgalery-load-info-progress > .mask{
								position:absolute;
								top:1px;
								left:1px;
								bottom:1px;
								width:0;
								background:#3399ff;
								
								-webkit-transition-duration: 		400ms;
								-webkit-transition-property: 		width;
								-webkit-transition-timing-function: ease;
								
								-moz-transition-duration: 			400ms;
								-moz-transition-property: 			width;
								-moz-transition-timing-function:	ease;
								
								-o-transition-duration: 			400ms;
								-o-transition-property: 			width;
								-o-transition-timing-function: 		ease;
								
								transition-duration: 				400ms;
								transition-property: 				width;
								transition-timing-function: 		ease;
							}
						</style>';
						
						$load = true;
						@ob_end_flush(); 
						@ob_flush();
						flush();
					}
					
					Stream::MkDir(System::Path('publics') . 'jgalery/', 0755);
					Stream::MkDir(System::Path('publics') . 'jgalery/' . $picture->Galery_ID . '/', 0755);
					
					$file = Stream::Download($picture->Src, System::Path('publics'). 'jgalery/' . $picture->Galery_ID . '/');
					
					if($file != $fileThumbnail){
						$fileThumbnail = Stream::Download($picture->Miniature, System::Path('publics'). 'jgalery/' . $picture->Galery_ID . '/');
					}else{
						$fileThumbnail = $file;
					}
					
				}
			}
			
			if($load){
				$size = floor((($i+1) / $pictures['length']) * 100);
				
				echo '<style>
					.jgalery-load-info-progress > .mask{width:' . ($size) .'%;}
				</style>';
				
				@ob_end_flush(); 
				@ob_flush();
				flush();
			}
						
			$file = SystemCache::Push(array(
				'Src' => 	$file,
				'Width' => 	1024,
				'Height' =>	800,
				'ID' => 	basename($file) . '-full'
			));
			
			$fileThumbnail = SystemCache::Push(array(
				'Src' => 	file_exists($fileThumbnail) ? $fileThumbnail : $file,
				'Width' =>	$settings->maxWidth,
				'Height' => $settings->maxHeight,
				'ID' => 	basename($fileThumbnail) . '-thumb-2'
			));
			
			$dimension = getimagesize($fileThumbnail);
						
			$node = '
			<a id="picture-'. $id . '-' .$i .'" target="_blank" class="brick photo hide timestamp_'.time().'" href="'.File::ToURI($file).'" rel="lightbox['.$id.']" title="' . $name . ' - '.$picture->Title.'" data-theme="'.$settings->themeLightBox.'" style="'. 'width:'.$dimension[0].'px;height:'.$dimension[1].'px">
				<img src="'.File::ToURI($fileThumbnail).'" width="'.$dimension[0].'" height="'.$dimension[1].'" alt="'. $picture->Title .'" />
				<div class="overlay">
					<div class="inner">
						<div class="text">'. $picture->Title .'</div>
					</div>
				</div>
			</a>
			';
			
			$string .= $node;
		}
		
		if($load){
			echo '<script>window.location.reload()</script>';
			exit();	
		}
				
		if($bool){
			$string = '
				<div class="box-galery-brick theme-' . ($settings->themeBA == 'custom' ? $settings->className : $settings->themeBA) .'" style="display:none;">
					<div class="one-galery">
						<div class="wrap-header heading hide"><h2>'.$i.' photo'.( $i > 1 ? 's' : '') .'</h2></div>
						<div class="wrap-body body">
						'.$string.'
						</div>
					</div>
				</div>';
		}else{
			$string = '
			<div class="one-galery galery-'.$id.'">
				<div class="wrap-header heading hide" id="'.$id.'"><h1>'.$name.'</h1><h2>'.$i.' photo'.( $i > 1 ? 's' : '') .'</h2></div>
				<div class="wrap-body body">
				'.$string.'
				</div>
			</div>';
		}
		
		return $string;
	}
/**
 * jCarousel.toString()
 **/	
	public function __toString(){
		return $this->draw();
	}
}