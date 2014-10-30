/** section: Bitmap
 * class Color
 * Cette classe permet de manipuler les couleurs au format RVB (Codé en héxadecimal) vers le format HSL et vice-versa.
 **/
var Color = Class.create();
Color.prototype = {
	__class_: 'color',
/**
 * Color.red -> Number
 * Valeur de la couleur Rouge.
 **/
	red: 	0,
/**
 * Color.green -> Number
 * Valeur de la couleur Verte.
 **/
	green: 	0,
/**
 * Color.blue -> Number
 * Valeur de la couleur Bleu.
 **/
	blue: 	0,
/**
 * Color.hue -> Number
 * Valeur de la Teinte dans le modèle HSL.
 **/
	hue: 	0,
/**
 * Color.opa -> Number
 * Valeur de l'opacité dans le modèle HSL
 **/
	opa: 	0,
/**
 * Color.lum -> Number
 * Valeur de la luminosité dans le modèle HSL
 **/
	lum: 	0,
/**
 * new Color([color])
 * - color (String): Couleur au format hexadecimal.
 *
 * Initialise une nouvelle couleur.
 *
 **/
	initialize: function(color){
		if(Object.isUndefined(color)) return;
		this.setRGB(color);
	},
/**
 * Color.toString() -> String
 *
 * Retourne la couleur au format RGB.
 **/ 
	toString: function(){
		return "#"+('0' + this.red.toHexa()).slice(-2) + ('0' + this.green.toHexa()).slice(-2) + ('0' + this.blue.toHexa()).slice(-2);
	},
	/* 
	 * @private 
	 */
	toHSL :function (){
		this.red = 		Math.round(this.red);
		this.green = 	Math.round(this.green);
		this.blue = 	Math.round(this.blue);
		
		var minval = Math.min (this.red, Math.min(this.green, this.blue));
		var maxval = Math.max (this.red, Math.max(this.green,this.blue));
		var mdiff = maxval - minval + 0.0;
		var msum = maxval + minval + 0.0;
		this.lum = msum / 510.0;
		
		if (maxval == minval){
			this.opa = 0.0;
			this.hue = 0.0;
		}
		else{
			var rnorm = (maxval - this.red) / mdiff;
			var gnorm = (maxval - this.green) / mdiff;
			var bnorm = (maxval - this.blue) / mdiff;
			
			this.opa = (this.lum <= 0.5) ? (mdiff / msum) : (mdiff / (510.0 - msum));
			
			if(this.red == maxval) 		this.hue = 60.0 * (6.0 + bnorm - gnorm);
			if(this.green == maxval)	this.hue = 60.0 * (2.0 + rnorm - bnorm);
			if(this.blue == maxval)		this.hue = 60.0 * (4.0 + gnorm - rnorm);
			if(this.hue > 360.0)		this.hue -= 360.0;
		}
		
		this.hue = Math.round(this.hue * 255.0 / 360.0);
		this.opa = Math.round(this.opa * 255.0);
		this.lum = Math.round(this.lum * 255.0);
		
		return this;
	},
	/* 
	 * @private 
	 */
	Magic :function(rm1, rm2, rh){
		var retval = rm1;
		
		if (rh > 360.0)			rh -= 360.0;
		if (rh < 0.0)			rh += 360.0;
		if (rh < 60.0)			retval = rm1 + (rm2 - rm1) * rh / 60.0;
		else if (rh < 180.0)	retval = rm2;
		else if (rh < 240.0)	retval = rm1 + (rm2 - rm1) * (240.0 - rh) / 60.0;
		
		return Math.round (retval * 255);
	},
	/* 
	 * @private 
	 */
	update:function (){

		var hue = 			this.hue * 360.0 / 255.0;
		var saturation = 	this.opa / 255.0;
		var luminance = 	this.lum / 255.0;
		
		if(saturation == 0.0){
			this.red = this.green = this.blue = Math.round (luminance * 255.0);
		}
		else{
		
			var rm1;
			var rm2;
			if (luminance <= 0.5)	rm2 = luminance + luminance * saturation;
			else					rm2 = luminance + saturation - luminance * saturation;
			
			rm1 = 2.0 * luminance - rm2;
			this.red = 		this.Magic (rm1, rm2, hue + 120.0);
			this.green = 	this.Magic (rm1, rm2, hue);
			this.blue =	 	this.Magic (rm1, rm2, hue - 120.0);
	  	}
	  	return this;
	},
/**
 * Color.setRGB(color) -> Color
 * - color (String): Valeur de la couleur au format RGB.
 * 
 * Change la valeur de la couleur de l'instance.
 **/
	setRGB:function(color){
		
		if(Object.isUndefined(color) || color == null || color == '') return;
		
		var str = color;
		
		if(color.slice(0,1) == '#'){
			str = color.replace('#', '');
		}

		if(!str.isHexa()) return;

		if(str.length == 3){
			
			this.red = 		str.slice(0,1) + "" + str.slice(0,1);
			this.green = 	str.slice(1,2) + "" + str.slice(1,2);
			this.blue = 	str.slice(2,3) + "" + str.slice(2,3);

		}
		
		if(str.length == 6){
			this.red = 		str.slice(0,2);
			this.green = 	str.slice(2,4);
			this.blue = 	str.slice(4,6);
		}
		
		this.red = 		this.red.toDecimal();
		this.green = 	this.green.toDecimal();
		this.blue = 	this.blue.toDecimal();

		return this.toHSL();
	},
/**
 * Color.setHue(hue) -> Color
 * - hue (Number): Valeur de la teinte entre 0 et 255.
 * 
 * Change la valeur de la teinte de l'instance.
 **/
	setHue:function(hue){
		if(hue > 255) 	this.hue = 255;
		if(hue < 0) 	this.hue = 0;
		this.hue = hue;
		return this.update();
	},
/**
 * Color.setLuminance(hue) -> Color
 * - hue (Number): Valeur de la luminosité entre 0 et 255.
 * 
 * Change la valeur de la luminosité de l'instance.
 **/
	setLuminance: function(lum){
		if(lum > 255) {
			this.lum = 255;
		}
		if(lum < 0) 	this.lum = 0;
		this.lum = lum;
		return this.update();
	},
/**
 * Color.setOpacity(opa) -> Color
 * - opa (Number): Valeur de l'opacité entre 0 et 255.
 * 
 * Change la valeur de la teinte de l'instance.
 **/
	setOpacity: function(opa){
		if(opa > 255) 	this.opa = 255;
		if(opa < 0) 	this.opa = 0;
		this.opa = opa;
		return this.update();
	},
/**
 * Color.setRed(red) -> Color
 * - red (Number): Valeur du rouge entre 0 et 255.
 * 
 * Change la valeur du rouge de l'instance.
 **/
	setRed:function(red){
		if(red.isHexa()) this.red = red.toDecimal();
		return this;
	},
/**
 * Color.setGreen(green) -> Color
 * - green (Number): Valeur du vert entre 0 et 255.
 * 
 * Change la valeur du vert de l'instance.
 **/
	setGreen:function(green){
		if(green.isHexa()){
			this.green = green.toDecimal();
		}
		return this;
	},
/**
 * Color.setBlue(blue) -> Color
 * - opa (Number): Valeur du bleu entre 0 et 255.
 * 
 * Change la valeur du bleu de l'instance.
 **/
	setBlue:function(blue){
		if(blue.isHexa()) this.blue = blue.toDecimal();
		return this;
	},
	getHue: function(){
		return this.hue;
	},
	getOpacity: function(){
		return this.opa;
	},
	getLuminance: function(){
		return this.lum;
	},
	getRed:function(){
		return this.red;
	},
	getGreen:function(){
		return this.green;
	},
	getBlue: function(){
		return this.blue;
	}
};