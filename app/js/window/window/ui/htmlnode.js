/** section: UI
 * class HtmlNode < Element
 * Cette classe permet de créer du contenu HTML automatiquement mis en forme.
 **/
var HtmlNode = Class.createSprite('div');
HtmlNode.prototype = {
	__class__:	'html-node',
	className: 	'wobject html-node',
	
	initialize:function(){},
/**
 * HtmlNode#append(str) -> HtmlNode
 * - str (String): Chaine de caractère.
 *
 * Cette méthode ajoute du contenue à l'instance.
 **/	
	append: function(str){
		this.innerHTML += str; 
		return this;
	}
};