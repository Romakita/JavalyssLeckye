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
class jCarousel extends jGalery{
/**
 * jCarousel.draw() -> String
 *
 * Cette méthode transforme l'instance en carrousel HTML.
 **/
 	public function draw(){
		//
		//Paramètres par défaut
		//
		$options =				new stdClass();
		$options->className =	'';
		$options->vertical = 	false;
		$options->scroll = 		1;
		$options->animation = 	800;
		$options->auto = 		10;
		$options->start = 		1;
		$options->theme = 		'tango';
		//
		// Options
		//	
		$settings = $this->getSettings($options);
		//
		// Liste des photos
		//
		$pictures = $this->getPictures();
				
		$ul =		'';
		$controls = '';
		
		ob_start();
		
		$i	= 1;
		if(!empty($pictures)){
			for($i  = 0; $i < $pictures['length']; $i++){
				$picture = new jPicture($pictures[$i]);
				
				$text = '<div class="box-text"><h1 class="title">' . $picture->Title .' </h1>';
				
				if($picture->Content){
					$text .= '<div class="description">'. $picture->Content .'</div>';
				}
				
				$text .= '</div>';
				
				$ul .= 			'
					<li>
						<a href="' . Blog::GetInfo($picture->Link) . '"><img src="'.$picture->Src.'" title="' . $picture->Title .'" alt="' . $picture->Title .'" />'.$text.'</a>
					</li>';
				
				$style =		'';
				$href = 		'';
				
				if(!$picture->Button){
					$style = 	' style="display:none" ';
				}else{
					if(!is_numeric($picture->Button)) $href =		' href="'.Blog::GetInfo($picture->Button).'"';
				}
				
				$controls .= 	'
					<a'.$href.' class="control control-'.strtolower(Stream::Sanitize($picture->Title, '-')).' '.($href == '' ? 'click' : 'hover').'" id="b'.$i.'"'.$style.'>
						<span class="text">'. $picture->Title .'</span><div class="pointer"></div>
						<div class="miniature" style="display:none"><img src="' . jPicture::GetMiniature($picture->Src) . '" style="width:100%" alt="'. $picture->Title .'" /></div>
					</a>';
				
				$i++;
			}
		}
		
		$settings->className = empty($settings->className) ? 'tango' : $settings->className; 
		
		?>
        <div class="jcarousel jcarousel-skin-<?php echo $settings->theme == 'custom' ? $settings->className : $settings->theme; ?>" id="carousel-<?php echo $this->Galery_ID; ?>">
            <ul><?php echo $ul ?></ul>
            <div class="jcarousel-control"><?php echo $controls; ?></div>
        </div>
        
        <script>
			Extends.ready(function(){
				
				jQuery("#carousel-<?php echo $this->Galery_ID ?>").jcarousel({
					
					vertical: 		<?php echo json_encode($settings->vertical); ?>,
					scroll: 		<?php echo $settings->scroll; ?>,
					animation: 		<?php echo $settings->animation; ?>,
					auto:			<?php echo $settings->auto; ?>,
					wrap:			'circular',
					start:			<?php echo $settings->start; ?>,
					
					initCallback: 	function(carousel){
				
						if(carousel.clip.children('ul').children('li').length == 1){
							carousel.options.auto = 0;
							jQuery(carousel.container.context).children('.jcarousel-control').children('a').hide();
						}
						
						jQuery(carousel.container.context).children('.jcarousel-control').children('a.click').bind('click', function() {
							carousel.scroll(jQuery.jcarousel.intval(this.id.replace("b", '')));			
							return false;
						});
						
						jQuery(carousel.container.context).children('.jcarousel-control').children('a.hover').bind('mouseover', function() {
							carousel.scroll(jQuery.jcarousel.intval(this.id.replace("b", '')));			
							return false;
						});
					},
					
					//buttonNextHTML: null,
					//buttonPrevHTML: null,
					
					itemVisibleInCallback: function(carousel, li, index){
						var options = jQuery(carousel.container.context).children('.jcarousel-control').children('a');
						options.removeClass('control-select');
						jQuery(options[(index-1) % options.length]).addClass('control-select');
					}
				});
			});
		</script>
        <?php
		
		return ob_get_clean();
	}
/**
 * jCarousel.toString()
 **/	
	public function __toString(){
		return $this->draw();
	}
}