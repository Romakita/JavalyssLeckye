Import('extends.bitmap.color');
/** section: UI
 * class ColoredBox < Element
 *
 * Cette classe ajoute le composant graphique permettant d'afficher une couleur avec effet Glass.
 **/
var ColoredBox = Class.createSprite('div');

ColoredBox.prototype = {
	__class__:'coloredbox',
	className:'wobject colored-box',
/**
 * new ColoredBox()
 *
 * Cette méthode créée une nouvelle instance de champ de saisie de couleur.
 **/
	initialize: function(){
		this.mask = new Node('div', {className:'colored-mask'});
		
		this.appendChild(this.mask);
		this.appendChild = 		null;
		this.appendChildAt = 	null;
		this.topChild =			null;
		this.removeChildAt = 	null;
		this.removeChild = 		null;
		this.getChildAt = 		null;
	},
/**
 * InputColor#setColor(color) -> InputColor
 *
 * Cette méthode change la couleur de l'instance.
 **/
	setColor:function(color){
		var c = new Color();
		
		c.setRGB(color);
		this.mask.setStyle({"backgroundColor":c.toString()});

		var lumi = c.getLuminance();
		if(lumi < 127) lumi = lumi + (255 * 30 /100);
		
		if(127 < lumi){
			lumi = 255 - (lumi * 30 /100);
		}

		this.setStyle({"backgroundColor":c.toHSL().setLuminance(lumi).toString()});
		c.setRGB(color);
	
		lumi = c.getLuminance();
		this.setStyle({"borderColor":c.toHSL().setLuminance(80).toString()});
		return this;
	}
};