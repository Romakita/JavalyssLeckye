<?php
/** section: Window Builder
 * class CssNode
 **/
class CssNode{
/**
 * CssNode#border -> CssBorder
 **/
	public $border = 		'';
/**
 * CssNode#background -> CssBackground
 **/
	public $background = 	'';	
/**
 * CssNode#boxShadow -> String
 **/
	public $boxShadow =		'';
/**
 * CssNode#color -> String
 **/
	public $color =			'';
/**
 * CssNode#font -> CssFont
 **/
	public $font =			'';
/**
 * CssNode#height -> String
 **/
	public $height =		'';
/**
 * CssNode#lineHeight -> String
 **/
	public $lineHeight =	'';
/**
 * CssNode#margin -> CssBox
 **/
	public $margin =		'';
/**
 * CssNode#min -> String
 **/
	public $min =			'';
/**
 * CssNode#max -> String
 **/
	public $max =			'';
/**
 * CssNode#padding -> CssBox
 **/
	public $padding =		'';
/**
 * CssNode#pointer -> String
 **/
	public $pointer =		'';
/**
 * CssNode#text -> String
 **/
	public $text =			'';
/**
 * CssNode#width -> String
 **/
	public $width =			'';
	
	public $Value =			'';
	public $serialize =		true;
	
	const CRLFT = "\r\n\t";
	const CRLF = "\r\n";
	
	static $CSS3_PREFIXE = array(
		'-ms-',
		'-moz-',
		'-webkit-',
		'-o-',
		''
	);
	
	public function __construct($serialize = true){
		$this->border = 	new CssBorder;
		$this->background = new CssBackground;
		$this->font =		new CssFont;
		$this->margin =		new CssBox('margin');
		$this->padding = 	new CssBox('padding');
		$this->min =		new CssDim('min');
		$this->max =		new CssDim('max');
		$this->serialize = 	$serialize;
	}
	
	public function __toString(){
		
		$str = 			'';
		$base = 		new self();
		$css3 =			false;
		
		foreach($this as $key => $value){
			$value = $this->$key;
			
			if(empty($value)){
				continue;
			}
			
			//$str .=   CssNode::CRLFT ."/*". $key."*/" . CssNode::CRLFT ;
			
			switch($key){
				default:
					if(is_object($value) && method_exists($value, '__toString')){
						$o = trim($value);
						
						if(!empty($o)){
							$str .= $o . CssNode::CRLFT;
						}
						
					}else{
						$str .= CssNode::DrawCSSProperty($key, $value);
					}					
					break;
					
				case 'mode':
				case 'serialize':
				case 'important':
				case 'Value':
					break;
				
				case 'text':
					if(strpos($value, 'text-shadow') !== false){
						$str .= $value . ';' . CssNode::CRLFT;
					}else{
						$str .= CssNode::DrawCSSProperty("text", $value);
					}
					break;
				
				case 'textShadow':
					$str .= CssNode::DrawCSSProperty("text-shadow", $value);
					break;
									
				case 'lineHeight':
					$str .= CssNode::DrawCSSProperty("line-height", $value);
					break;
					
				case 'boxShadow':
					$str .= CssNode::DrawCSSProperty("box-shadow", $value, false, true);
					break;				
			}
			
		}
				
		return $str . self::CRLF;
		
		//$str = '';
		
		//self::
		
		/*foreach($this as $key => $value){
						
			switch($key){
				default: 
					$keystring = $key;
					break;
				case 'lineHeight': 
					$keystring = 'line-height';
					break;
				case 'boxShadow':
					if($value == '') continue;
					$str .= $this->toBoxShadow();
					continue;
					
				case 'Value': continue;
			}
			
			if(is_string($value)){
				if($value == '') continue;
				$str .= $keystring. ': '.$value.";" . CssNode::CRLFT;
				continue;
			}
			
			if(is_object($value)){//conversion de l'objet en string
				if($value instanceof NodeCss && !$value->serialize) continue;
				
				$str .= $value;
			}
		}
		
		if($this->Value != ""){
			$str .= $this->Value . CssNode::CRLFT;	
		}
		
		return $str;*/
	}
	
	public function Copy($obj){
		foreach($obj as $key => $value){
			if($value == '') continue;
						
			if(method_exists($this->$key, 'Copy')){
				$this->$key->Copy($value);
			}else{		
				$this->$key = $value;
			}
			
		}
	}
	
	public function toBoxShadow(){
		
		if($this->boxShadow == '') return '';
		return CssNode::DrawCSSProperty("box-shadow", $this->boxShadow, false, true);
		
	}
	
	public function boxShadow($default = ''){
		
		if($this->boxShadow == '') return $default;
		return CssNode::DrawCSSProperty("box-shadow", $this->boxShadow, false, true);
		
	}
	
	public static function Value($value){
		return str_replace('px', '', $value);	
	}
	
	public static function DrawCSS3Property($name, $value, $important = false){
		$str = '';
		
		foreach(self::$CSS3_PREFIXE as $prefixe){
			$str .= self::DrawCSSProperty($prefixe . $name, $value, $important);
		}
		
		return $str;
	}
	
	public static function DrawCSSProperty($name, $value, $important = false, $css3 = false){
		
		if($css3){
			return self::DrawCSS3Property($name, $value, $important);
		}
		
		return $name .': ' . $value . ($important ? ' !important' :  '') . ';' . CssNode::CRLFT;
	}
}
/** section: Window Builder
 * class CssBackground
 **/
class CssBackground{
	
	const PREFIXE =				'background-';
/**
 * CssBackground#color-> String
 **/	
	public $color =				'';
/**
 * CssBackground#image-> String
 **/
	public $image =				'';
/**
 * CssBackground#linearGradient-> String
 **/
	public $linearGradient = 	'';
/**
 * CssBackground#position-> String
 **/
	public $position =			'';
/**
 * CssBackground#origin-> String
 **/
	public $origin =			'';
/**
 * CssBackground#repeat-> String
 **/
	public $repeat =			'';	
/**
 * CssBackground#size-> String
 **/
	public $size =				'';
/**
 * CssBackground#clip-> String
 **/
	public $clip =				'';
/**
 * CssBackground#important-> Boolean
 **/
	public $important =			false;
/**
 * CssBackground#toString() -> String
 **/		
	public function __toString(){
		$str = 			'';
		$base = 		new self();
		$css3 =			false;
		
		foreach($base as $key => $value){
			$value = $this->$key;
			
			if(empty($value)){
				continue;
			}
			
			//$str .=   CssNode::CRLFT ."/*". $key."*/" . CssNode::CRLFT ;
			
			switch($key){
				default: 
					$str .= CssNode::DrawCSSProperty(self::PREFIXE . $key, $value, $this->important, $css3);
					break;
					
				case 'important':
					continue;
				
				case 'image':
					$value = 'url(' . $value . ')';
					
					$str .= CssNode::DrawCSSProperty(self::PREFIXE . $key, $value, $this->important);
					break;
					
				case 'clip':
				case 'origine':
				case 'size':
					$str .= CssNode::DrawCSSProperty(self::PREFIXE . $key, $value, $this->important, true);
					break;
					
				case 'linearGradient':
					
					if(!(strpos($this->linearGradient, 'background-image') !== false)){
						$linear = explode(', ', $this->linearGradient);	
						
						$str .= self::PREFIXE . "image: -ms-linear-gradient(". $this->linearGradient .");" . CssNode::CRLFT;
						$str .= self::PREFIXE . "image: -moz-linear-gradient(". $this->linearGradient .");" . CssNode::CRLFT;
						$str .= self::PREFIXE . "image: -o-linear-gradient(". $this->linearGradient .");" . CssNode::CRLFT;
						$str .= self::PREFIXE . "image: -webkit-gradient(linear, left top, left bottom, from(".@$linear[2]."), to(".@$linear[1]."));" . CssNode::CRLFT;
						$str .= self::PREFIXE . "image: -webkit-linear-gradient(". $this->linearGradient .");" . CssNode::CRLFT;
						$str .= self::PREFIXE . "image: linear-gradient(". $this->linearGradient .");" . CssNode::CRLFT;
						
					}else{
						$str .=  CssNode::CRLFT . str_replace(';', ";" . CssNode::CRLFT, str_replace(array("\r", "\n","\t"), "", $this->linearGradient)) . CssNode::CRLFT;
					}
					
					break;
					
			}
			
			
		}
		
		return $str . CssNode::CRLF;
	}	
/**
 * CssBackground#copy(o) -> CssBackground
 **/	
	public function copy($obj){
		
		foreach($obj as $key => $value){
			if(empty($value)) continue;
			
			$this->$key = $value;
		}
		
		return $this;
	}
/**
 * CssBackground#set(o) -> CssBackground
 **/	
	public function set($o){
		$new = new self();
		$new->copy($this);
		$new->copy($o);
		return $new;
	}
	
	function toString(){
		return trim((empty($this->image) ? 'none' : 'url(' . $this->image . ')') .  ' ' . $this->position . ' ' . $this->color . ' '. $this->repeat);
	}
}
/** section: Window Builder
 * class CssBorder
 **/
class CssBorder{
	const PREFIXE =			'border-';
/**
 * CssBorder#style -> String
 **/
	public $style =			'';
/**
 * CssBorder#width -> String
 **/
	public $width =			'';
/**
 * CssBorder#color -> String
 **/
	public $color =			'';
/**
 * CssBorder#alternate -> String
 **/
	public $alternate =		'';
/**
 * CssBorder#radius -> String
 **/
	public $radius =		'';
/**
 * CssBorder#collapse -> String
 **/
	public $collapse =		'';
/**
 * CssBorder#important -> Boolean
 **/
	public $important =		false;
/**
 * CssBorder#toString() -> String
 **/	
	public function __toString(){
				
		$str = 			'';
		$base = 		new self();
		$css3 =			false;
		
		foreach($base as $key => $value){
			$value = $this->$key;
			
			if(empty($value)){
				continue;
			}
			
			switch($key){
				case 'important':
				case 'alternate':continue;
									
				case 'radius':
					$css3 = true;
					break;					
			}
			
			$str .= CssNode::DrawCSSProperty(self::PREFIXE . $key, $value, $this->important, $css3);
		}
		
		return $str . CssNode::CRLF;
	}
/**
 * CssBorder.toBorder -> String
 **/	
	public function toBorder(){
		if(!empty($this->width) || !empty($this->style) || !empty($this->color)){
			$str = $this->width . ' ' . $this->style . ' ' . $this->color;
		
			if($this->important) $str .=  ' !important';
			
			return $str;
		}
		
		return '';
	}
/**
 * CssBorder.toOutset -> String
 **/
 	public function toOutset(){
		
		if(empty($this->alternate)){
			return '';	
		}
		
		$str = 	CssNode::DrawCSSProperty(self::PREFIXE . 'width', strpos($this->width, 'px') !== false ? '' : 'px');
		$str .= CssNode::DrawCSSProperty(self::PREFIXE . 'bottom-color', $this->color);
		$str .= CssNode::DrawCSSProperty(self::PREFIXE . 'top-color', $this->alternate);
		$str .= CssNode::DrawCSSProperty(self::PREFIXE . 'style', $this->style);
				
		return $str . CssNode::CRLF;
	}
 
	public function toRadius($bool = false){
		return CssNode::DrawCSSProperty(self::PREFIXE . 'radius', $this->radius, $this->important, true) . CssNode::CRLF;;	
	}
/**
 * CssBorder#copy(o) -> CssBorder
 **/	
	public function copy($obj){
		
		foreach($obj as $key => $value){
			if(empty($value)) continue;
			
			$this->$key = $value;
		}
		
		return $this;
	}
/**
 * CssBorder#set(o) -> CssBorder
 **/	
	public function set($o){
		$new = new self();
		$new->copy($this);
		$new->copy($o);
		return $new;
	}
}
/** section: Window Builder
 * class CssFont
 **/
class CssFont{
	const PREFIXE =			'font-';
/**
 * CssFont#family -> String
 **/
	public $family = 		'';
/**
 * CssFont#size -> String
 **/
	public $size =			'';	
/**
 * CssFont#stretch -> String
 **/
	public $stretch =		'';
/**
 * CssFont#style -> String
 **/
	public $style =			'';	
/**
 * CssFont#weight -> String
 **/
	public $weight =		'';
/**
 * CssFont#color -> String
 **/
	public $color =			'';
	
	public $lineHeight =	'';
/**
 * CssFont#important -> Boolean
 **/	
	public $important =		false;
	
	public function __toString(){
		
		$str = 			'';
		$base = 		new self();
		$css3 =			false;
		
		foreach($base as $key => $value){
			$value = $this->$key;
			
			if(empty($value)){
				continue;
			}
			
			switch($key){
				case 'important':continue;
				
				case 'lineHeight':
					$str .= CssNode::DrawCSSProperty("line-height", $value, $this->important);
					break;
					
				case 'color':
					$str .= CssNode::DrawCSSProperty($key, $value, $this->important);
					break;
				
				default:
					$str .= CssNode::DrawCSSProperty(self::PREFIXE . $key, $value, $this->important);				
			}
			
			
		}
		
		return $str . CssNode::CRLF;
	}
/**
 * CssFont#copy(o) -> CssFont
 **/	
	public function copy($obj){
		
		foreach($obj as $key => $value){
			if(empty($value)) continue;
			
			$this->$key = $value;
		}
		
		return $this;
	}
/**
 * CssFont#set(o) -> CssFont
 **/	
	public function set($o){
		$new = new self();
		$new->copy($this);
		$new->copy($o);
		return $new;
	}
}
/** section: Window Builder
 * class CssBox
 **/
class CssBox{
/*
 *
 **/	
	public $type =			'';
/**
 * CssBox#left -> String
 **/	
	public $left =			'';
/**
 * CssBox#right -> String
 **/
	public $right =			'';
/**
 * CssBox#bottom -> String
 **/
	public $bottom =		'';
/**
 * CssBox#top -> String
 **/
	public $top =			'';	
	
	public $important =		false;
	
	public function __construct($type = ''){
		$this->type = $type;
	}
	
	public function __toString(){
		
		$str = 			'';
		$base = 		new self();
		$css3 =			false;
		
		foreach($base as $key => $value){
			$value = $this->$key;
			
			if(empty($value)){
				continue;
			}
			
			switch($key){
				case 'type':
				case 'important':continue;
				default:
					$str .= CssNode::DrawCSSProperty($this->type . '-' . $key, $value, $this->important);				
			}
			
			
		}
		
		return $str . CssNode::CRLF;
		
	}
/**
 * CssFont#copy(o) -> CssFont
 **/	
	public function copy($obj){
		
		foreach($obj as $key => $value){
			if(empty($value)) continue;
			
			$this->$key = $value;
		}
		
		return $this;
	}
/**
 * CssFont#set(o) -> CssFont
 **/	
	public function set($o){
		$new = new self();
		$new->copy($this);
		$new->copy($o);
		return $new;
	}
}
/** section: Window Builder
 * class CssDim
 **/
class CssDim{
	
	public $type =			'';
	
	public $height =		'';
	public $width =			'';
	
	public function __construct($type = ''){
		$this->type = $type;
	}
	
	public function __toString(){
		
		$str = 			'';
		$base = 		new self();
		$css3 =			false;
		
		foreach($base as $key => $value){
			$value = $this->$key;
			
			if(empty($value)){
				continue;
			}
			
			switch($key){
				case 'type':
				case 'important':continue;
				default:
					$str .= CssNode::DrawCSSProperty($this->type . '-' . $key, $value, $this->important);				
			}
			
			
		}
		
		return $str . CssNode::CRLF;
	}
/**
 * CssFont#copy(o) -> CssFont
 **/	
	public function copy($obj){
		
		foreach($obj as $key => $value){
			if(empty($value)) continue;
			
			$this->$key = $value;
		}
		
		return $this;
	}
/**
 * CssFont#set(o) -> CssFont
 **/	
	public function set($o){
		$new = new self();
		$new->copy($this);
		$new->copy($o);
		return $new;
	}
}

?>