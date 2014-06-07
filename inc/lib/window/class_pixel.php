<?php
/**
 * @brief Gestion des couleurs en PHP. Cette classe permet de convertir une couleur au format RGB 
 * vers le format HSL et vice versa.
 * @file class_color.php
 * @date 10/07/2010
 * @package Color
 * @author Lenzotti Romain
 * @version	0.3
 * @licence This work is licensed under a Creative Commons Attribution 2.5 Generic License, http://creativecommons.org/licenses/by/2.5/
 */
/**
 * @brief Gestion des couleurs en PHP. Cette classe permet de convertir une couleur au format RGB 
 * vers le format HSL et vice versa.
 * @class Color
 */
class Pixel{
	private $red = 		0;			/**<Couleur ROUGE*/
	private $green = 	0;			/**<Couleur VERTE*/
	private $blue = 	0;			/**<Couleur BLEU*/
	private $hue = 		0;			/**<Teinte de la couleur HSL*/
	private $opa = 		0;			/**<Opacité de la couleur HSL*/
	private $lum = 		0;			/**<Luminosité de la couleur HSL*/
	/**
	 * Initialisation d'une couleur. Par defaut, la couleur est noir.
	 * @param {String} color Couleur au format hexadecimal RGB. Soit #333, soit #33333.
	 */
	public function __construct($color = ''){
		if($color == '') return;
		$this->setRGB($color);
	}
	
	public function average($color, $percent = 50){
		if(is_string($color)) $color = new Pixel($color);
		$inv = 100 - $percent;
		
		$this->red = 		($this->red * $percent + $color->getRed() * $inv) / 100;
		$this->green = 		($this->green * $percent + $color->getGreen() * $inv) / 100;
		$this->blue = 		($this->blue * $percent + $color->getBlue() * $inv) / 100;
		
		$this->toHSL();
	}
	
	public function getGrey(){
		return 	($this->red + $this->green + $this->blue) / 3;
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
	 * Convertie la couleur RGB en valeur HSL.
	 */
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
	 * Retourne le code Hexadecimal de la couleur.
	 * @param {String} char Caractère devant la chaine. Par défaut #.
	 * @return {String}
	 */
	public function toString($char="#"){
		$str = $char;
		$str .= substr('0'.dechex($this->red), -2);
		$str .= substr('0'.dechex($this->green), -2);
		$str .= substr('0'.dechex($this->blue), -2);
		
		return $str;
	}
	
	public function __toString(){
		$str = "#";
		$str .= substr('0'.dechex($this->red), -2);
		$str .= substr('0'.dechex($this->green), -2);
		$str .= substr('0'.dechex($this->blue), -2);
		
		return $str;
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
	 * Assigne une couleur de type #FFF ou #FFFFFF.
	 * @param {String} color Couleur RGB au format hexadecimal
	 */
	public function setRGB($color){
		$str = $color;

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

		return $this->toHSL();
	}
	/**
	 * Change le teinte de la couleur.
	 * @param {Number} hue Valeur de la teinte entre 0 et 255.
	 */
	public function setHue($hue){
		if($hue > 255) 	$this->hue = 255;
		if($hue < 0) 	$this->hue = 0;
		$this->hue = $hue;
		return $this->update();
	}
	/**
	 * Change la luminosité de la couleur.
	 * @param {Number} lum Valeur de la luminosité entre 0 et 255.
	 */
	public function setLuminance($lum){
		if($lum > 255) {
			$this->lum = 250;
		}
		if($lum < 0) 	$this->lum = 0;
		$this->lum = $lum;
		return $this->update();
	}
	/**
	 * Change la saturation de la couleur.
	 * @param {Number} opa Valeur de l'opacité entre 0 et 255.
	 */
	public function setOpacity($opa){
		if($opa > 255) 	$this->opa = 255;
		if($opa < 0) 	$this->opa = 0;
		$this->opa = $opa;
		return $this->update();
	}
	/**
	 * Change la valeur du rouge de la couleur RGB.
	 * @param {String} red Valeur hexadécimal sur deux lettres.
	 */
	public function setRed($red){
		if(preg_match('/^[a-fA-F\d]+$/',$red)) $this->red = toDecimal($red);
		return $this;
	}
	/**
	 * Change la valeur du vert de la couleur RGB.
	 * @param {String} green Valeur hexadécimal sur deux lettres.
	 */
	public function setGreen($green){
		if(preg_match('/^[a-fA-F\d]+$/',$green)) $this->green = toDecimal($green);
		return $this;
	}
	/**
	 * Change la valeur du bleu de la couleur RGB.
	 * @param {String} blue Valeur hexadécimal sur deux lettres.
	 */
	public function setBlue($blue){
		if(preg_match('/^[a-fA-F\d]+$/', $blue)) $this->blue = toDecimal($blue);
		return $this;
	}
	/**
	 * Retourne la valeur du Hue de la couleur HSL.
	 * @return {Number} 
	 */
	public function getHue(){
		return $this->hue;
	}
	/**
	 * Retourne l'opacité de la couleur HSL.
	 * @return {Number} 
	 */
	public function getOpacity(){
		return $this->opa;
	}
	/**
	 * Retourne la luminosité de la couleur HSL.
	 * @return {Number} 
	 */
	public function getLuminance(){
		return $this->lum;
	}
	/**
	 * Retourne la valeur du rouge de la couleur RGB.
	 * @return {Number} 
	 */
	public function getRed(){
		return $this->red;
	}
	/**
	 * Retourne la valeur du vert de la couleur RGB.
	 * @return {Number} 
	 */
	public function getGreen(){
		return $this->green;
	}
	/**
	 * Retourne la valeur du bleu de la couleur RGB.
	 * @return {Number} 
	 */
	public function getBlue(){
		return $this->blue;
	}
	
}



?>