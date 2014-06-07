<?php
/** section: Library
 * class Color
 * includes ObjectTools
 *
 * Cette classe permet de faire des calculs sur les couleurs (conversion RVB, HSL).
 * 
 * * Auteur : Lenzotti Romain
 * * Fichier : class_color.php
 * * Version : 29/04/2012
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 * * Librairie requise : [[Stream]]
 *
 **/
if(!class_exists('Color')):
include_once('class_object_tools.php');

class Color extends ObjectTools{
	private $red = 		0;
	private $green = 	0;
	private $blue = 	0;
	private $hue = 		0;
	private $opa = 		0;
	private $lum = 		0;
/**
 * new Color()
 * new Color(color)
 * new Color(number)
 * - color (String): Couleur au format hexadecimal RGB. Soit #333, soit #33333.
 * - number (Number): Valeur numérique entre 0 et 255.
 *
 * Créée une nouvelle instance [[Color]].
 **/
	public function __construct($color = ''){
		if($color instanceof Color || is_object($color)){
			$this->extend($color);
		}else{
			if($color != ''){
				$this->setRGB($color);
			}
		}
	}
	/**
	 * Convertie la couleur HSL en valeur RGB.
	 * @param rm1 
	 * @param rm2
	 * @param rm3
	 * @return {Number}
	 */
	final private function Magic($rm1, $rm2, $rh){
		$retval = $rm1;
		
		if ($rh > 360.0)		$rh -= 360.0;
		if ($rh < 0.0)			$rh += 360.0;
		if ($rh < 60.0)			$retval = $rm1 + ($rm2 - $rm1) * $rh / 60.0;
		else if ($rh < 180.0)	$retval = $rm2;
		else if ($rh < 240.0)	$retval = $rm1 + ($rm2 - $rm1) * (240.0 - $rh) / 60.0;
		
		return round($retval * 255);
	}
/**
 * Color#toHSL() -> Color
 * Convertie la couleur RGB en valeur HSL.
 **/
	public function toHSL(){
		$this->red = 	round($this->red);
		$this->green = 	round($this->green);
		$this->blue = 	round($this->blue);
		
		$minval = 	min ($this->red, min($this->green, $this->blue));
		$maxval = 	max ($this->red, max($this->green, $this->blue));
		$mdiff = 	$maxval - $minval + 0.0;
		$msum = 	$maxval + $minval + 0.0;
		
		$this->lum = $msum / 510.0;
		
		if ($maxval == $minval){
			$this->opa = 0.0;
			$this->hue = 0.0;
		}
		else{
			$rnorm = ($maxval - $this->red) / $mdiff;
			$gnorm = ($maxval - $this->green) / $mdiff;
			$bnorm = ($maxval - $this->blue) / $mdiff;
			
			$this->opa = ($this->lum <= 0.5) ? ($mdiff / $msum) : ($mdiff / (510.0 - $msum));
			
			if($this->red == $maxval) 	$this->hue = 60.0 * (6.0 + $bnorm - $gnorm);
			if($this->green == $maxval)	$this->hue = 60.0 * (2.0 + $rnorm - $bnorm);
			if($this->blue == $maxval)	$this->hue = 60.0 * (4.0 + $gnorm - $rnorm);
			if($this->hue > 360.0)		$this->hue -= 360.0;
		}
		
		$this->hue = round($this->hue * 255.0 / 360.0);
		$this->opa = round($this->opa * 255.0);
		$this->lum = round($this->lum * 255.0);
		
		return $this;
	}
/**
 * Color#toString() -> Color
 * Retourne le code Hexadecimal de la couleur.
 **/
	public function toString($char="#"){
		$str = $char;
		$str .= substr('0'.dechex($this->red), -2);
		$str .= substr('0'.dechex($this->green), -2);
		$str .= substr('0'.dechex($this->blue), -2);
		
		return $str;
	}
	
	public function __toString(){
		return $this->toString();	
	}
	/**
	 * Retourne le code Hexadecimal de la couleur au format WEB. 
	 * @param {String} char Caractère devant la chaine. Par défaut #.
	 * @return {String}
	 */
	public function toStringWeb($char="#"){
		$str = $char;
		$str .= substr(dechex($this->red),0,1).substr(dechex($this->red),0,1);
		$str .= substr(dechex($this->green),0,1).substr(dechex($this->green),0,1);
		$str .= substr(dechex($this->blue),0,1).substr(dechex($this->blue),0,1);
		
		return $str;
	}
	/**

	 * Met à jours les valeurs de la couleurs.
	 */
	final private function update(){

		$hue = 			$this->hue * 360.0 / 255.0;
		$saturation = 	$this->opa / 255.0;
		$luminance = 	$this->lum / 255.0;
		
		if($saturation == 0.0){
			$this->red = $this->green = $this->blue = round ($luminance * 255.0);
		}
		else{
		
			$rm1;
			$rm2;
			if ($luminance <= 0.5)	$rm2 = $luminance + $luminance * $saturation;
			else					$rm2 = $luminance + $saturation - $luminance * $saturation;
			
			$rm1 = 2.0 * $luminance - $rm2;
			$this->red = 	$this->Magic ($rm1, $rm2, $hue + 120.0);
			$this->green = 	$this->Magic ($rm1, $rm2, $hue);
			$this->blue =	$this->Magic ($rm1, $rm2, $hue - 120.0);
	  	}
	  	return $this;
	}
/**
 * Color#setRGB(color) -> Color
 * - color (Array | Number | String): Code couleur.
 * 
 * Cette méthode permet de changer la valeur RGB de la couleur gérée par l'instance.
 **/
	public function setRGB($color){
		$str = $color;
		
		if(is_array($color)){
			$this->red = 	$color[0];
			$this->green = 	$color[1];
			$this->blue = 	$color[2];	
		}elseif(is_numeric($color)){
			$this->red = 	$color;
			$this->green = 	$color;
			$this->blue = 	$color;	
		}else{
			if(substr($color,0,1) == '#'){
				$str = substr($color, 1, strlen($color) -1);
			}
	
			if(!preg_match('/^[a-fA-F\d]+$/', $str)) return;
	
			if(strlen($str) == 3){
				$this->red = 	substr($str, 0, 1) . substr($str, 0, 1);
				$this->green = 	substr($str, 1, 1) . substr($str, 1, 1);
				$this->blue = 	substr($str, 2, 1) . substr($str, 2, 1);
			}
			if(strlen($str) == 6){
				$this->red = 	substr($str, 0,2);
				$this->green = 	substr($str, 2,2);
				$this->blue = 	substr($str, 4,2);
	
			}
			
			$this->red = 	hexdec($this->red);
			$this->green = 	hexdec($this->green);
			$this->blue = 	hexdec($this->blue);
		}

		return $this->toHSL();
	}
/**
 * Color#setHue(hue) -> Color
 * - hue (Number): Valeur de la teinte entre 0 et 255.
 * 
 * Cette méthode change le teinte de la couleur.
 **/
	public function setHue($hue){
		if($hue > 255) 	$this->hue = 255;
		if($hue < 0) 	$this->hue = 0;
		$this->hue = $hue;
		return $this->update();
	}
/**
 * Color#setLuminance(lum) -> Color
 * - hue (Number): Valeur de la luminosité entre 0 et 255.
 * 
 * Cette méthode change la luminosité de la couleur.
 **/
	public function setLuminance($lum){
		if($lum > 255) {
			$this->lum = 250;
		}
		if($lum < 0) 	$this->lum = 0;
		$this->lum = $lum;
		return $this->update();
	}
/**
 * Color#setLuminance(lum) -> Color
 * - lum (Number): Valeur de l'opacité entre 0 et 255. 
 * 
 * Cette méthode change la saturation de la couleur.
 **/
	public function setOpacity($opa){
		if($opa > 255) 	$this->opa = 255;
		if($opa < 0) 	$this->opa = 0;
		$this->opa = $opa;
		return $this->update();
	}
/**
 * Color#setRed(red) -> Color
 * - red (Number | String): Valeur du canal rouge entre 0 et 255 (ou en valeur hexadécimal sur deux caratères).
 * 
 * Cette méthode change la valeur du canal rouge.
 **/
	public function setRed($red){
		if(is_numeric($red)){
			$this->red = $red;
		}elseif(preg_match('/^[a-fA-F\d]+$/',$red)){
			$this->red = toDecimal($red);
		}
		
		return $this;
	}
/**
 * Color#setGreen(green) -> Color
 * - green (Number | String): Valeur du canal vert entre 0 et 255 (ou en valeur hexadécimal sur deux caratères).
 * 
 * Cette méthode change la valeur du canal vert.
 **/
	public function setGreen($green){
		if(is_numeric($green)){
			$this->green = $green;
		}elseif(preg_match('/^[a-fA-F\d]+$/',$green)){
			$this->green = toDecimal($green);
		}
		return $this;
	}
/**
 * Color#setBlue(blue) -> Color
 * - blue (Number | String): Valeur du canal bleu entre 0 et 255 (ou en valeur hexadécimal sur deux caratères).
 * 
 * Cette méthode change la valeur du canal bleu.
 **/
	public function setBlue($blue){
		if(is_numeric($blue)){
			$this->blue = $blue;
		}elseif(preg_match('/^[a-fA-F\d]+$/', $blue)){
			$this->blue = toDecimal($blue);
		}
		return $this;
	}
/**
 * Color#getHue() -> Number
 *
 * Retourne la valeur de la teinte de la couleur.
 **/
	public function getHue(){
		return $this->hue;
	}
/**
 * Color#getHue() -> Number
 *
 * Retourne la valeur de la saturation de la couleur.
 **/
	public function getOpacity(){
		return $this->opa;
	}
/**
 * Color#getLuminance() -> Number
 *
 * Retourne la valeur de la luminosité de la couleur.
 **/
	public function getLuminance(){
		return $this->lum;
	}
/**
 * Color#getRed() -> Number
 *
 * Retourne la valeur rouge de la couleur.
 **/
	public function getRed(){
		return $this->red;
	}
/**
 * Color#getGreen() -> Number
 *
 * Retourne la valeur verte de la couleur.
 **/
	public function getGreen(){
		return $this->green;
	}
/**
 * Color#getBlue() -> Number
 *
 * Retourne la valeur bleu de la couleur.
 **/
	public function getBlue(){
		return $this->blue;
	}
}

endif;

?>