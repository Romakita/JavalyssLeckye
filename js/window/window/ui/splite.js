/** section: UI
 * class Splite < Element
 * Crée une région graphique partagé.
 **/
var Splite = Class.createSprite('div');
Splite.prototype = {
	__class__: 	'splite',
	className:	'wobject splite',
/**
 * Splite#left -> Node
 * Région gauche de l'instance.
 **/
	left: null,
/**
 * Splite#right -> Node
 * Région droite de l'instance.
 **/
	right:null,
/**
 * new Splite()
 * Cette méthode créée une nouvelle instance de Splite.
 **/
	initialize:function(){
		this.left = this.leftContent = 		new Node('div', {className:'left-content'});
		this.right = this.rightContent = 	new Node('div', {className:'right-content'});
		this.appendChilds([
			this.leftContent, 
			this.rightContent
		]);
	},
/**
 * Splite#appendChildLeft(node) -> Splite
 * - node (Node): Element à ajouter à la partie gauche de l'instance.
 *
 * Cette méthode ajoute un `node` à la partie gauche de l'instance.
 **/
	appendChildLeft:function(elem){
		if(Object.isString(elem)) this.leftContent.innerHTML = elem;
		else {
			if(!Object.isArray(elem)) this.leftContent.appendChild(elem);
			else this.leftContent.appendChilds(elem);
		}
		return this;
	},
/**
 * Splite#appendChildRight(node) -> Splite
 * - node (Node): Element à ajouter à la partie droite de l'instance.
 *
 * Cette méthode ajoute un `node` à la partie droite de l'instance.
 **/
	appendChildRight:function(elem){
		if(Object.isString(elem)) this.rightContent.innerHTML = elem;
		else {
			if(!Object.isArray(elem)) this.rightContent.appendChild(elem);
			else this.rightContent.appendChilds(elem);
		}
		return this;
	},
	/**
	 * Vide les deux parties.
	 * @type Splite
	 */
	clear: function(){
		this.clearRight();
		this.clearLeft();
		return this;
	},
	/**
	 * Vide la partie de droite.
	 * @type Splite
	 */
	clearRight:function(){
		this.rightContent.innerHTML = '';
		return this;
	},
	/**
	 * Vide la partie de gauche.
	 * @type Splite
	 */
	clearLeft:function(){
		this.leftContent.innerHTML = '';
		return this;
	},
/**
 * Splite#removeChildLeft(node) -> Splite
 * - node (Node): Element à supprimer de la partie gauche de l'instance.
 *
 * Supprime un `node` de la partie gauche de l'instance.
 **/
	removeChildLeft:function(elem){
		if(Object.isString(elem)) this.leftContent.innerHTML = '';
		else this.leftContent.removeChild(elem);
		return this;
	},
/**
 * Splite#removeChildRight(node) -> Splite
 * - node (Node): Element à supprimer de la partie droite de l'instance.
 *
 * Supprime un `node` de la partie droite de l'instance.
 **/
	removeChildRight:function(elem){
		if(Object.isString(elem)) this.rightContent.innerHTML = '';
		else this.rightContent.removeChild(elem);
		return this;
	},
/**
 * Splite#setIcon(icon) -> Splite
 * - icon (String): Nom CSS de l'icone.
 *
 * Cette méthode ajoute une icône comme arrière plan de la région de gauche.
 **/
	setIcon: function(icon){
		this.left.className = 'left-content icon-' + icon;
		this.addClassName('icon splite-icon');
	},
	//deprecated
	getChildLeft:function(){
		return this.leftContent;
	},
	//deprecated
	getChildRight:function(){
		return this.rightContent;
	}
};
/** section: UI 
 * class SpliteIcon
 * Cette classe hérité ces propriétés de la classe Splite.
 * Elle est spécialement conçu pour créer une région séparé avec une icône et un texte.
 **/
 
/**
 * new SpliteIcon(title [,text [, icon]])
 * - title (String): Titre de la région.
 * - text (String): Texte de description supplémentaire.
 * - icon (String): Nom de l'icône CSS.
 *
 * Cette méthode créée une nouvelle instance de SpliteIcon.
 **/
function SpliteIcon(msg, msg2, icon){
	var splite = 	new Splite();
	
	splite.addClassName('icon splite-icon');
	
	this.body = new Node('i');
	
	splite.appendChildRight(this.header = new Node('h1', msg));
	splite.appendChildRight(this.body);
	
	this.body.innerHTML = msg2 ? msg2 : '';
	
	if(!Object.isUndefined(icon)){
		splite.setIcon(icon);
	}
	
	return splite;
}

/** section: UI 
 * class SpliteWait < Element
 * Cette classe créée une région graphique partagé. Sa particularité est d'afficher le message 
 * en rouge afin de transmettre une information importante.
 **/
 
/**
 * new SpliteWait(msg)
 * - msg(String): Message à afficher.
 *
 * Cette méthode créée une nouvelle instance SpliteWait.
 **/
function SpliteWait(msg){
	var node = new Node('div', {className: 'splite-wait-msg'});
	
	if(Object.isElement(msg)){
		node.appendChild(msg);	
	}else{
		node.innerHTML = msg;	
	}
	return node;
};

/** section: UI 
 * class SpliteInfo < Element
 * Cette classe créée une région graphique partagé. Sa particularité est d'afficher le message 
 * en bleu afin de transmettre une information.
 **/
 
/**
 * new SpliteInfo(msg)
 * - msg(String): Message à afficher.
 *
 * Cette méthode créée une nouvelle instance SpliteInfo.
 **/
function SpliteInfo(msg){
	
	var node = new Node('div', {className: 'splite-info-msg'});
	if(Object.isElement(msg)){
		node.appendChild(msg);	
	}else{
		node.innerHTML = msg;	
	}
	return node;
};

/** section: UI 
 * class SpliteDelete < Element
 * Cette classe créée une région graphique partagé. Sa particularité est d'afficher le message 
 * avec une icone de type poubelle afin de transmettre une information importante.
 **/
 
/**
 * new SpliteDelete(msg)
 * - msg(String): Message à afficher.
 *
 * Cette méthode créée une nouvelle instance SpliteDelete.
 **/
 
function SpliteDelete(msg){
	var splite = 	new Splite();
	var node = 		new Node('h1');
	splite.addClassName('splite-del-object');
	
	splite.appendChildRight(node);
	
	if(Object.isElement(msg)){
		node.appendChild(msg);	
	}else{
		node.innerHTML = msg;	
	}
	
	return splite;
}