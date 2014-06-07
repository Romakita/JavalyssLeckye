/** section: Form
 * class TextAreaCompleter < InputPopup
 *
 * Cette classe permet de créer un champ de saisie de valeur (un ou plusieurs) avec possibilité d'auto-complétion.
 *
 * <p class="note">Cette classe est une extension de Window JS. Pour l'inclure vous devez utiliser la méthode Import('plugins.textareacompleter').</p>
 *
 **/ 
var TextAreaCompleter = Class.from(InputPopup);

TextAreaCompleter.prototype = {
	className:	'wobject area-input input-recipient area-completer show-button',
	link:		'',
	parameters:	'',
/**
 * new TextAreaCompleter([options])
 * - options (Object): Objet de configuration.
 *
 * Cette méthode créée une nouvelle instance d'[[TextAreaCompleter]].
 *
 * #### Paramètres options
 * 
 * Le paramètre options permet de configurer l'instance. Les attributs pris en charge sont :
 *
 * * `button` (`Boolean`): Si la valeur est fausse le bouton sera caché.
 * * `link` (`String`) : Lien du serveur PHP.
 * * `parameters` (`String`): paramètres à passer au script PHP.
 * * `value` (`String` | `Array`): Adresse e-mail ou liste d'adresse e-mail à ajouter à l'instance.
 *
 **/	
	initialize:function(obj){
		var node = 	this;
		
		var options = {
			link:		$WR().getGlobals('link'),
			parameters:	'',
			value:		'',
			button:		true
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		this.link = 		options.link;
		this.parameters = 	options.parameters;
		//
		//
		//
		this.SimpleButton.setText($MUI('Ajouter'));
		this.SimpleButton.setIcon('');	
		//
		//
		//
		this.body =				new Node('ul', {className:'wrap-list'});
		//
		//
		//
		this.Input.Large(true);
		
		///build
	
		this.appendChild(this.SimpleButton);
		this.appendChild(this.body);
		this.body.appendChild(this.Input);
		this.appendChild(new Node('div', {className:'clearfloat'}));
		this.appendChild(this.Popup);
		
		if(!options.button){
			this.addClassName('no-button');
			this.removeClassName('show-button');
		}
		
		this.Observer.observe('show', this.onShow.bind(this));
		this.on('click', function(){
			this.Input.focus();
		}.bind(this));
		this.Input.on('focus', this.onFocus.bind(this));
		this.Input.on('blur', this.onBlur.bind(this));
		this.Input.on('keyup', this.onKeyUp.bind(this));
		this.Input.on('keypress', this.onKeyPress.bind(this));
		this.Input.on('change', this.onChange.bind(this));
		
		if(options.value != ''){
			this.Value(options.value);
		}
	},
/**
 * TextAreaCompleter#clear() -> TextAreaCompleter
 *
 * Vide l'instance.
 **/	
	clear:function(){
		this.body.removeChilds();
		this.body.appendChild(this.Input);
		return this;
	},
/**
 * TextAreaCompleter#push(value) -> TextAreaCompleter
 * - value (String, Array): Valeur à ajouter.
 *
 * Cette méthode ajoute une valeur ou une liste de valeur à l'instance.
 **/	
	push:function(data){
		
		if(Object.isArray(data)){
			for(var i = 0; i < data.length; i++){
				this.push(data[i]);	
			}
			return;	
		}
		
		var li = 	new Node('li', {className:'background grey'}, data.text || data.value);
		li.data = 	data;
		li.value =	data.value;
		
		li.SimpleButton = new SimpleButton({type:'mini', icon:'cancel-14'});
		li.appendChild(li.SimpleButton);

		this.body.appendChild(li);
		this.body.appendChild(this.Input);
		
		this.Input.css('width', '80px');
		this.Input.css('width', this.body.getWidth() - this.Input.positionedOffset().left - this.Input.css('padding-left') - this.Input.css('padding-right') - this.Input.css('border-left-width') - this.Input.css('border-right-width'));
		
		this.Input.Value('');
		
		li.SimpleButton.on('click', function(){
			this.parentNode.parentNode.removeChild(this.parentNode);
		});
		
		return this;			
	},
/**
 * InputCompleter#observe(eventName, callback) -> InputCompleter
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` sur le nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * Le champ d'auto-complétion prend en charge un certain nombre d'événement personnalisé, comme suivant :
 *
 * * `change` : Appelle la fonction lors du changement de valeur du champ.
 * * `complete` : Appelle la fonction lorsque la recherche est terminé.
 * * `draw` : Appelle la fonction lorsque la liste est en cours de contruction. 
 * * `keypress` : Appelle la fonction lorsque l'utilisateur presse une touche du clavier.
 *
 **/
	observe:function(eventName, handler){
		switch(eventName){
			case "hide":
			case "show":
			case "change": 		
			case "complete":
			case 'keypress':	
			case "draw":	
			case "send":		this.Observer.observe('completer:'+eventName, handler);
								break;
			case 'keydown':
			case 'keyup':
			case 'blur':
			case 'focus':		this.Input.on(eventName, handler.bind(this));
								break;
					
			default: Event.observe(this, eventName, handler);
		}
		return this;
	},
/**
 * TextAreaCompleter#stopObserving(eventName, callback) -> InputCompleter
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` sur le nom d'événement `eventName`.
 **/	
	stopObserving:function(eventName, handler){
		switch(eventName){
			case "hide":
			case "show":
			case "change": 		
			case "complete":
			case 'keypress':	
			case "draw":	
			case "send":		this.Observer.stopObserving('completer:'+eventName, handler);
								break;
			case 'keydown':
			case 'keyup':
			case 'blur':
			case 'focus':		this.Input.stopObserving(eventName, handler.bind(this));
								break;
					
			default: Event.stopObserving(this, eventName, handler);
		}
		return this;
	},
/**
 * TextAreaCompleter#search() -> void
 *
 * Lance une recherche sur le contenu saisi.
 **/
	search: function(){
		if(this.link == '') return;
		if(this.Input.Value() == '') return;
		
		var obj = {
			cmd: 		this.parameters,
			parameters:	null,
			value:		this.Input.value
		};
		
		//this.Observer.fire('completer:send', obj); 
		
		var globals = 		$WR().getGlobals('parameters');
		var parameters = 	"word=" + encodeURIComponent(this.Input.Value());
		parameters +=		this.parameters == '' ? '' : ('&'+this.parameters);
		parameters +=		globals == '' ? '' : ('&' + globals);		
		
		if(obj.parameters != null) parameters += "&" + obj.parameters;
		
		var sender = this;
		
		if(this.ajax && this.ajax.transport){
			if(Object.isFunction(this.ajax.transport.abort)){
				this.ajax.transport.abort();
			}
		}
		
		this.loading = true;
		
		this.ajax = new Ajax.Request(this.link, {
			method:		'post',
			parameters: parameters,	
			
			onComplete: function(result){
				this.ajax = null;
				
				this.onComplete(result);
				
			}.bind(this)
		});		
	},
/*
 * TextAreaCompleter#onComplete() -> void
 **/
	onComplete: function(result){
		
		var obj = result.responseText.evalJSON(result.responseText);
		
		this.Observer.fire('completer:complete', obj, this);
		this.draw(obj);
	},
/**
 * TextAreaCompleter#draw(array) -> TextAreaCompleter 
 * - array (Array): Tableau de données.
 *
 * Construit la liste en fonction du tableau de données.
 **/
	draw: function(array){
				
		if(array.length == 0) {		
			this.Hidden(true);
			return;
		}
						
		this.Popup.clear();
		this.Popup.show();
				
		this.Observer.fire('completer:show');	
	
		var sender = this;
			
		function onMouse(evt){
			sender.onClickLine(evt, this);	
		}
		
		var i = 0;
		
		$A(array).each(function(data){
			var reg = 	new RegExp("(" + this.Input.Value() + ")",'gi');
			
			var line = new LineElement({
				text:	'<p class="wrap-name">' + data.text.replace(reg, '<strong>$1</strong>') +'</p>' +  (Object.isUndefined(data.subtext) ? '' : '<p class="wrap-mail">' + data.subtext.replace(reg, '<strong>$1</strong>') + '</p>'),
				size:	'large'
			});
				
			if(!Object.isUndefined(data.icon)){
				line.setIcon(data.icon);
			}
			
			if(!Object.isUndefined(data.color)){
				line.setColor(data.color);
			}
			
						
			if(i == 0){
				this.Current(line);	
			}
			
			line.addClassName('line-altern-' + (i % 2));
			line.Value(data.value);
			line.data = data;
			
			this.Observer.fire('completer:draw', line, data);
			
			line.observe('mouseup', onMouse);
			
			this.Popup.appendChild(line);
			i++;
						 
		}.bind(this));
		
		this.Popup.css('width', this.getWidth() - this.Popup.css('padding-left')  - this.Popup.css('padding-right') - this.Popup.css('border-right-width') - this.Popup.css('border-left-width'));	
		this.Popup.moveTo(this);
		this.Popup.refresh();
		
		return this;
	},
/**
 * TextAreaCompleter#Current() -> LineElement
 *
 * Cette méthode retourne le ligne selectionnée dans le completer.
 **/
	Current: function(newcurrent){
		
		if(!Object.isUndefined(newcurrent)){
			if(Object.isElement(newcurrent)){
				if(this.CurrentSibling) this.CurrentSibling.Selected(false);
			
				this.CurrentSibling = newcurrent;
				this.CurrentSibling.Selected(true);
				
				this.Popup.ScrollBar.scrollTo(this.CurrentSibling);
			
				this.setText(this.CurrentSibling.Value());
			}
		}
		
		return this.CurrentSibling;
	},
/**
 * TextAreaCompleter#length() -> Number
 *
 * Cette méthode retourne le nombre d'adresses e-mail stockées dans l'instance.
 **/		
	length:function(){
		return this.body.select('li').length;
	},
/*
 * TextAreaCompleter#onShow() -> void
 **/
	onShow:function(){
		this.Popup.hide();
		this.search();
	},
/*
 * TextAreaCompleter#onClickLine() -> void
 **/	
	onFocus:function(evt){
		this.addClassName('focus');
	},
/*
 * TextAreaCompleter#onClickLine() -> void
 **/	
	onBlur:function(evt){
		this.removeClassName('focus');
		this.body.select('li.selected').invoke('removeClassName', 'selected');
	},
/*
 * TextAreaCompleter#onClickLine() -> void
 **/
	onClickLine: function(evt, line){
			
		if(this.Popup.ScrollBar.isMove()) return;		
		Event.stop(evt);
				
		this.Hidden(true);
		
		this.push(line.data);
		
		this.Observer.fire('completer:change', evt);
		
	},
/*
 * TextAreaCompleter#onChange() -> void
 **/	
	onChange:function(evt){
		new Timer(function(){
			
			if(this.Input.Value() != ''){
				this.push({text:this.Input.Value(), value:this.Input.Value()});
				this.Input.Value('');
				this.Observer.fire('completer:change', evt);
			}
			
			this.focus();
		}.bind(this), 0.1, 1).start();
	},
/*
 * TextAreaCompleter#onKeyPress() -> void
 **/	
	onKeyUp: function(evt){
		
		switch(Event.getKeyCode(evt)){
			case 13:
				
				if(!this.Hidden()){					
					if(this.CurrentSibling){
						this.push(this.CurrentSibling.Value());
						this.Observer.fire('completer:change', evt);
						
						this.Input.Value('');
						this.Hidden(true);
						
						this.CurrentSibling = null;
					}
				}
				
				this.focus();
				evt.stop();
				
				return;
				
			case 40:
				evt.stop();
				if(this.CurrentSibling){
					this.Current(this.CurrentSibling.next() ? this.CurrentSibling.next() : this.CurrentSibling);
				}
				return;
			case 37:return;
			case 38:
				evt.stop();
				if(this.CurrentSibling){
					this.Current(this.CurrentSibling.previous() ? this.CurrentSibling.previous() : this.CurrentSibling);
				}
				return;	
		}
		
		if(this.Input.Value() != ''){
			this.search();
		}else{
			this.Hidden(true);	
		}
	},
/*
 * TextAreaCompleter#onKeyPress() -> void
 **/	
	onKeyPress: function(evt){
			
		try{
			this.Observer.fire('completer:keypress', evt);
		}catch(er){}
		
		switch(Event.getKeyCode(evt)){
			/*case 181:
			case 178:
			case 176:
			case 168:
			case 167:
			case 164:
			case 163:
			case 123:
			case 125:
			case 124:
			case 126:
			case 96:
			case 94:
			case 93:
			case 92:
			case 91:
			case 63:
			case 62:
			case 61:
			case 60:
			case 59:
			case 58:
			case 47:
			case 44:
			case 43:
			case 42:
			case 41:
			case 40:
			case 39:
			case 38:
			case 37:
			case 36:
			case 34:
			case 33:
				evt.stop();
				break;*/
			case 13:
				this.focus();
				if(this.Hidden()){	
					evt.stop();
				}
				break;
			case 8:
				
				if(this.Input.Value() == ''){//suppression éventuelle d'un élément
										
					var childs = this.body.select('li.selected');
					
					if(childs.length){
						this.body.removeChild(childs[0]);
					}
				
					childs = this.body.select('li');
					
					if(childs.length){
						childs[childs.length-1].addClassName('selected');
					}
					
					evt.stop();
				}
				
				break;
			default:
				this.body.select('li.selected').invoke('removeClassName', 'selected');
		}
	},
/**
 * TextAreaCompleter#get(it) -> String
 * - it (Number): Indice de la donnée à récupérer dans le tableau.
 *
 * Cette méthode retourne une des valeurs stockée dans l'instance.
 **/
	get:function(i){
		var options = 	this.body.select('li');
		return options[i].value;
	},
/**
 * TextAreaCompleter#setParameters(parameters) -> TextAreaCompleter
 * - parameters (String): Paramètres.
 *
 * Cette méthode permet d'assigner les paramètres POST à envoyer au serveur.
 **/	
	setParameters:function(param){
		this.parameters = param;
		return this;
	},
/**
 * TextAreaCompleter#Value([value]) -> String
 * - value (String): Valeur à assigner.
 * 
 * Assigne ou/et retourne la valeur de l'instance.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new TextAreaCompleter();
 *     c.Value('mon@mail.com');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new TextAreaCompleter();
 *     c.Value('mon@mail.com');
 *     alert(c.Value()); //['mon@mail.com']
 *
 **/	
	Value:function(value){
		if(!Object.isUndefined(value)){
			this.push(value);
		}
		
		var options = 	this.body.select('li');
		var array = 	[];
		
		options.each(function(line){
			if(line.data && !Object.isUndefined(line.data.subtext)){
				delete line.data.subtext;
			}
			array.push(line.data);
		});
		
		return array;
	}
};
/**
 * TextAreaCompleter.Transform(node) -> Select
 * TextAreaCompleter.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance TextAreaCompleter.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[TextAreaCompleter]].
 *
 *
 **/
TextAreaCompleter.Transform = function(e){
	
	if(Object.isElement(e)){
				
		var node = 	new TextAreaCompleter({
			link:		e.data('link') == null ? '' : e.data('link'),
			parameters: e.data('parameters') == null ? '' : e.data('parameters')
		});
		
		node.appendChild(e);
		e.hide();
		
		node.addClassName(e.className);
		node.removeClassName('box-area-completer');
				
		if(e.tagName.toLowerCase() == 'textarea'){
			node.Value(e.innerHTML);
		}else{
			node.Value(e.value);	
		}
		
		node.on('change', function(){
			var array = this.Value();
			e.value = array.join(';');
		});
		
		e.getParent = e.getInstance = function(){
			return this.parentNode;
		};
		
		e.replaceBy(node);	
		
		return node;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(TextAreaCompleter.Transform(e));
	});
	
	return options;
};

$WR.ready(function(){
	TextAreaCompleter.Transform('.box-area-completer');
});