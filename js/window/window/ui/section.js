/** section: UI
 * class Section < Element
 * Cette classe créée un element de regroupement d'objet. L'entête est cliquable permettant d'en cacher son contenu.
 **/
var Section = Class.createSprite('div');
Section.prototype = {
	__class__:'section',
	className:'wobject section',
	hidden_:	false,
/**
 * new Section(title)
 * - title (String): Titre de la section
 *
 * Cette méthode créée une nouvelle section.
 **/
 	initialize:function(title){
		
		this.label = 	new Node('div', {className:'wrap-title'}, title);
		//
		//Body
		//
		this.SimpleButton = this.button =	new SimpleButton({type:'mini', icon:'1down-mini-blue'});
		//
		//Header
		//
		this.header = 	new Node('div', {className:'wrap-header'}, [this.label, this.button]);
		//
		//Body
		//
		this.body =		new Node('div', {className:'wrap-body'});
		
		this.Hidden(false);
		
		this.appendChild(this.header);
		this.appendChild(this.body);
		
		this.appendChild = function(node){
			this.body.appendChild(node);
			return this;
		};
		
		this.removeChild_ = this.removeChild;
		this.removeChild = function(node){
			this.body.removeChild(node);
			return this;
		};
		
		this.button.on('click',function(){
			this.Hidden(!this.hidden_);
		}.bind(this));
	},
/**
 * Section#Header() -> Element
 **/	
 	Header: function(){
		return this.header;
	},
/**
 * Section#Body() -> Element
 **/	
 	Body: function(){
		return this.body;
	},
/**
 * Section#Title(title) -> String
 * 
 * Assigne un titre à la section.
 **/
 	Title:function(title){
		if(!Object.isUndefined(title)){
			this.label.innerHTML = title;
		}
		return this.label;
	},
	show:function(){this.Hidden(false)},
	hide:function(){this.Hidden(true)},
/**
 * Section#Hidden(bool) -> Boolean
 * - bool (Boolean): Si la valeur est vrai alors le corps de la section sera caché.
 *
 * Cache ou fait apparaitre le corps de la section
 **/
	Hidden: function(bool){
		if(bool){
			this.body.hide();
			this.button.setIcon('');
			this.button.setIcon('1down-mini-blue');
			this.hidden_ = true;
		}else{
			this.body.show();
			this.hidden_ = false;	
			this.button.setIcon('');
			this.button.setIcon('1left-mini-blue');
		}
		return this.hidden_;
	},
	__destruct: function(){
	
		this.removeChild = this.removeChild_;
		$WR.destructObject(this, false);	
	}
};

/** section: UI
 * class SimpleSection < Element
 *
 * Cette classe créer une section simple sans corps de regroupement.
 **/
var SimpleSection = Class.createSprite('div');
SimpleSection.prototype = {
	__class__:'section',
	className:'wobject section',
	hidden_:	false,
/**
 * new SimpleSection(title)
 * - title (String): Titre de la section
 *
 * Cette méthode créée une nouvelle section.
 **/
 	initialize:function(title){
		
		this.label = 	new Node('div', {className:'wrap-title'}, title);
		//
		//Header
		//
		this.header = 	new Node('div', {className:'wrap-header'}, this.label);
		this.appendChild(this.header);
	}
};