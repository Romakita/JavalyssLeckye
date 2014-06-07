<?php
/** section: jGalery
 * class NivoSlider
 *
 * Cette classe gère un carrousel.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_NivoSlider.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class NivoSlider extends jGalery{
/**
 * NivoSlider.draw() -> String
 *
 * Cette méthode transforme l'instance en carrousel HTML.
 **/
 	public function draw(){
		//
		// Paramètres par défaut
		//
		$options =						new stdClass();
		$options->className =			'';
		$options->themeNS =				'default';
    	$options->effect = 				'random'; // Specify sets like: 'fold,fade,sliceDown'
       	$options->slices =				15; // For slice animations
       	$options->boxCols = 			8; // For box animations
       	$options->boxRows =				4; // For box animations
       	$options->animSpeed = 			500; // Slide transition speed
       	$options->pauseTime =			3000; // How long each slide will show
       	$options->startSlide = 			0; // Set starting Slide (0 index)
       	$options->directionNav = 		true; // Next & Prev navigation
        $options->controlNav = 			true; // 1,2,3... navigation
       	$options->controlNavThumbs = 	false; // Use thumbnails for Control Nav
        $options->pauseOnHover = 		true; // Stop animation while hovering
		$options->manualAdvance = 		false; // Force manual transitions
        $options->prevText = 			'Prev'; // Prev directionNav text
        $options->nextText = 			'Next'; // Next directionNav text
        $options->randomStart = 		false; // Start on a random slide
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
		
		?>
		
		<div class="slider-wrapper theme-<?php echo $settings->themeNS == 'custom' ? $settings->className : $settings->themeNS; ?>">
        
            <div id="slider-<?php echo $this->Galery_ID; ?>" class="nivoSlider">
            <?php
				$captions = '';
				
				for($i  = 0; $i < $pictures['length']; $i++):
					$picture = new jPicture($pictures[$i]);
					
					//if(!file_exists(Permalink::ToABS($picture->Src))) continue;
					
					if(!empty($picture->Link)):
					?>
           		<a href="<?php Blog::Info($picture->Link); ?>">
					<?php
					endif;
					
					$content = trim(str_replace(array('<p>', '</p>'), '', $picture->Content));
					
					if(!empty($content)){
						$captions .= '
							<div id="caption-pics-'.$picture->Picture_ID.'" class="nivo-html-caption">'.$content.'</div>';
					}
					?>
            		<img src="<?php echo $picture->Src; ?>"<?php echo $settings->controlNavThumbs ? ' data-thumb="'. $picture->getThumbnail() .'"' : ''; ?><?php echo !empty($content) ? ' title="#caption-pics-'.$picture->Picture_ID .'"' : ''; ?> alt="<?php echo $picture->Title; ?>" />
            		<?php
					
					if(!empty($picture->Link)):
					?>
           		</a>
					<?php
					endif;
				endfor;					
			?>
            	
            </div>
            <?php
            	
				echo $captions;
			?>
        </div>
		<script>
			Extends.ready(function(){
				jQuery('#slider-<?php echo $this->Galery_ID; ?>').nivoSlider({
					effect: 			'<?php echo $settings->effect; ?>', // Specify sets like: 'fold,fade,sliceDown'
					slices: 			<?php echo $settings->slices; ?>, // For slice animations
					boxCols: 			<?php echo $settings->boxCols; ?>, // For box animations
					boxRows: 			<?php echo $settings->boxRows; ?>, // For box animations
					animSpeed: 			<?php echo $settings->animSpeed; ?>, // Slide transition speed
					pauseTime: 			<?php echo $settings->pauseTime; ?>, // How long each slide will show
					startSlide: 		<?php echo $settings->startSlide; ?>, // Set starting Slide (0 index)
					directionNav: 		<?php echo json_encode($settings->directionNav); ?>, // Next & Prev navigation
					controlNav: 		<?php echo json_encode($settings->controlNav); ?>, // 1,2,3... navigation
					controlNavThumbs: 	<?php echo json_encode($settings->controlNavThumbs); ?>, // Use thumbnails for Control Nav
					pauseOnHover: 		<?php echo json_encode($settings->pauseOnHover); ?>, // Stop animation while hovering
					manualAdvance: 		<?php echo json_encode($settings->manualAdvance); ?>, // Force manual transitions
					prevText: 			'<?php echo $settings->prevText; ?>', // Prev directionNav text
					nextText: 			'<?php echo $settings->nextText; ?>', // Next directionNav text
					randomStart: 		<?php echo json_encode($settings->randomStart); ?> // Start on a random slide
				});
			});
		</script>
        <?php
		
		return ob_get_clean();
	}
/**
 * NivoSlider.toString()
 **/	
	public function __toString(){
		return $this->draw();
	}
}