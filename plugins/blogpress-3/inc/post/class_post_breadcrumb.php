<?php
/** section: Plugins
 * PostBreadCrumb
 **/
abstract class PostBreadCrumb{
/**
 * Post.Draw([home [, sep]]) -> String 
 **/
 	static public function Draw($home = '', $sep = ">>", $topParent = -1){
		
		if(BlogPress::IsSearch()){
			return 	'<div xmlns:v="http://rdf.data-vocabulary.org/#" class="breadcrumbs">
						<a href="'.Blog::GetInfo('uri').'" class="bc-link post-home" typeof="v:Breadcrumb">'.MUI($home).'</a> 
						<span class="bc-sep"> '.$sep.' </span> 
						<span class="bc-link current-post" typeof="v:Breadcrumb">'.MUI('Rechercher').'</span>
					</div>';
		}
		
		if(Post::ID() > 0){
			$parent =  		new Post((int) Post::ID(), false);
		}else{
			$parent =  		Post::Current();	
		}
		
		$string = 		'';
		$i = 			0;
		
		if(!is_array($home)){
		
			if($home == ''){
				$home = 	MUI(Blog::GetInfo('title'));
			}
			
			if(!is_object($parent)){
				return 	'';
			}
			
			if(preg_match('/page/', $parent->Type)){
								
				$inject = System::Fire('blog:post.breadcrumbs', array(&$parent, &$i, $sep));
				
				$string = '<span class="bc-link current-post" typeof="v:Breadcrumb">'.MUI($parent->Title).'</span>';
				
				if(!empty($inject)){
					$string = $inject . $string;
				}
				
				while($parent->Parent_ID != 0 && $i < 5){//niveau max 5
					$parent = 	new Post((int) $parent->Parent_ID, false);	
					
					$inject = System::Fire('blog:post.breadcrumbs', array(&$parent, &$i, $sep));
										
					if(!empty($inject)){
						$string = $inject.'<a href="'.$parent->uri().'" class="bc-link post-parent post-parent-'.$i.'" typeof="v:Breadcrumb">'.MUI($parent->Title).'</a><span class="bc-sep"> '.$sep.' </span>'.$string;
					}else{
						$string = '<a href="'.$parent->uri().'" class="bc-link post-parent post-parent-'.$i.'" typeof="v:Breadcrumb">'.MUI($parent->Title).'</a><span class="bc-sep"> '.$sep.' </span>'.$string;
					}
					
					$i++;
					
					if(is_string($topParent)){
						if($parent->Name == $topParent){
							break;	
						}
					}else{
						if($parent->Post_ID == $topParent){
							break;	
						}
					}
				}
				
				if($topParent == -1){
					$string =  '<a href="'.Blog::GetInfo('uri').'" class="bc-link post-home" typeof="v:Breadcrumb">'.MUI($home).'</a><span class="bc-sep"> '.$sep.' </span>'.$string;
				}
			}
			
		}else{
			$array = 	$home;			
			$string =  '<a href="'.Blog::GetInfo('uri').'" class="bc-link post-home" typeof="v:Breadcrumb">'.MUI(Blog::GetInfo('title')).'</a><span class="bc-sep"> '.$sep.' </span>';
			
			foreach($array as $value){
				$string .= '<a href="'.Blog::GetInfo($value['link']).'" class="bc-link post-parent post-parent-'.$i.'" typeof="v:Breadcrumb">'.MUI($value['text']).'</a><span class="bc-sep"> '.$sep.' </span>';
			}
			
			$string .= '<span class="bc-link current-post" typeof="v:Breadcrumb">'.MUI($parent->Title).'</span>';
		}
		
		return '<div xmlns:v="http://rdf.data-vocabulary.org/#" class="breadcrumbs">'.$string.'</div>';
	}	
}
?>