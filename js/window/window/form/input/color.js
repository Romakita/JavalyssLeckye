/** section: Form
 * class InputColor < InputPopup
 *
 * Cette classe permet de créer un champ de saisie de code couleur via une collection de couleur.
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputColor en Javascript :</p>
 * 
 *     var input = InputColor({value:'#0066CC'});
 *     document.body.appendChild(input);
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment créer une instance InputButton en HTML :</p>
 * 
 *     <input value="#0066CC" class="box-input-color" type="text" />
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <input value="#0066CC" class="box-input-color" type="text" />
 *
 **/
var InputColor = Class.from(InputPopup);
InputColor.prototype = {
	__class__:	'inputcolor',
	className:	'wobject input input-button input-popup input-color',
	
	array:[
		'#000','#333','#666',
		'#999','#CCC','#FFF',
		'#F00','#0F0','#00F',
		'#FF0','#0FF','#F0F'
	],
	
	value: 		'',
/**
 * new InputColor()
 *
 * Cette méthode créée une nouvelle instance du champs de saisie de couleur [[InputColor]].
 *
 * ##### Paramètre options
 *
 * Le paramètre options prend différents attributs :
 * 
 * * `value` (`String`): Code couleur.
 * * `name` (`String`): Nom du champ.
 * * `button` (`Boolean`): Fait apparaitre le bouton du champ.
 * * `size` (`String`): Rendu du champ de saisie `large` ou `normal` (par défaut).
 **/
	initialize:function(obj){
		
		var options = {
			value:	'#000000',
			name:	'',
			button:	true,
			size:	'normal'
		};
		
		if(!Object.isUndefined(obj)){		
			Object.extend(options, obj);
		}
		//
		//
		//
		this.Input.maxLength = 7;
		//
		// SimpleButton
		//
		this.SimpleButton.setIcon('colors');
		
		if(options.size == 'large'){
			this.Large(true);
		}
		
		if(!options.button)	{
			this.addClassName('no-button');
		}
		//
		// ColoredBox
		//
		this.ColoredBox = 			(new ColoredBox()).setColor('#000');
		//
		// TabControl
		//
		this.TabControl = 			new TabControl();
		this.TabControl.Header().addClassName('gradient');
		this.TabControl.Header().removeClassName('wrap-header');
		this.TabControl.Header().addClassName('group-button');
		this.appendChild(this.ColoredBox);
		
		this.Popup.Scroll(false);
		this.Popup.appendChild(this.TabControl);
		//
		// panneaux des couleurs
		//
		this.TabControl.addPanel($MUI('Couleurs'), this.panelAllColor()).on('click', function(){
			if(document.navigator.mobile){
				this.Popup.moveTo(this);
			}
		}.bind(this));
		//
		//panneaux des gradients
		//
		this.TabControl.addPanel($MUI('Dégradés'), this.panelGradient()).on('click', function(){
			if(document.navigator.mobile){
				this.Popup.moveTo(this);
			}
		}.bind(this));
		//
		//panneaux des gradients gris
		//
		this.TabControl.addPanel($MUI('Dégradés gris'), this.panelGradientGray()).on('click', function(){
			if(document.navigator.mobile){
				this.Popup.moveTo(this);
			}
		}.bind(this));
		
		this.Value(options.value == '' ? '#000000' : options.value);
		
		Event.observe(this, 'keyup', this.onKeyUp.bind(this));
		Event.observe(this, 'change', this.onChange.bind(this));
		
	},
/*
 * InputColor.panelAllColor() -> Element
 *
 * Cette méthode créée le panneau de l'ensemble des couleurs.
 **/
	panelAllColor: function(){
		
		var colorsRed = 	new Array();
		var colorsBlue = 	new Array();
		var table = 		new TableData();
		var sender = 		this;
		
		table.addClassName('panel-colors input-color-panel');
		
		for(var i = 0; i < 16; i += 3){
			var color = new Color();
			color.setBlue(i.toHexa()+i.toHexa());
			
			for(var j = 0; j < 16; j += 3){
				color.setRed(j.toHexa()+j.toHexa());
				
				for(var k = 0; k < 16; k += 3){
					color.setGreen(k.toHexa()+k.toHexa());

					
					if(j.toHexa() + k.toHexa() + i.toHexa() < '900') colorsBlue.push(color.toString());
					else colorsRed.push(color.toString());
					
				}
			}
		}
		
		for(var y = 0, j = 0; y < 12; y++){
			
			var color = new Color();
			
			for(var x = 0; x < 21; x++){
				
				var div =	new Node('div', {className:'color-block'});		
						
				switch(x){
					
					case 0:
						continue;
					case 2:
						table.addCel('', {className:'empty'});
						continue;
						
					case 1:
						color.setRGB(this.array[y]);
						break;
					default:
						if(j < colorsBlue.length) color.setRGB(colorsBlue[j]);
						else color.setRGB(colorsRed[j - colorsBlue.length]);
						j++;
				}
								
				div.css('background-color', color.toString());
				div.rgb = 	color.toString();
				
				div.observe('click', function(evt){sender.onClickColor(evt, this);});
				
				if(!document.navigator.touchevent){
					div.observe('mouseover', function(evt){sender.onMouseOverColor(evt, this);});
					div.observe('mouseout', function(evt){sender.onMouseOutColor(evt, this);});
				}
				
				table.addCel(div);
				
			}
			table.addRow();
		}
		return table;
	},
/*
 * InputColor.panelGradient() -> Element
 *
 * Cette méthode créée le panneau de dégradé des couleurs.
 **/
	panelGradient: function(){
		
		var table = 		new TableData();
		var sender = 		this;
		
		table.addClassName('panel-colors input-color-panel');
		
		for(var i = 15; i >= 0; i--){
			var color = i.toHexa()+"00";
			var div =	new Node('span', {className:'color-block', style:"background-color:#"+color});
			
			div.rgb = "#"+color;
			
			div.observe('click', function(evt){sender.onClickColor(evt, this);});
			
			if(document.navigator.touchevent){
				div.observe('touchmove', function(evt){sender.onTouchMove(evt, this);});
			}else{
				div.observe('mouseover', function(evt){sender.onMouseOverColor(evt, this);});
				div.observe('mouseout', function(evt){sender.onMouseOutColor(evt, this);});
			}
			
			table.addCel(div);
		}
		table.addRow();
		
		for(var i = 15; i >= 0; i--){
			var color = "0"+i.toHexa()+"0";
			var div =	new Node('span', {className:'color-block', style:"background-color:#"+color});
			div.rgb = "#"+color;
			div.observe('click', function(evt){sender.onClickColor(evt, this);});
			
			if(document.navigator.touchevent){
				div.observe('touchmove', function(evt){sender.onTouchMove(evt, this);});
			}else{
				div.observe('mouseover', function(evt){sender.onMouseOverColor(evt, this);});
				div.observe('mouseout', function(evt){sender.onMouseOutColor(evt, this);});
			}
			
			table.addCel(div);
		}
		table.addRow();
		
		for(var i = 15; i >= 0; i--){
			var color = "00"+i.toHexa();
			var div =	new Node('span', {className:'color-block', style:"background-color:#"+color});
			div.rgb = "#"+color;
			div.observe('click', function(evt){sender.onClickColor(evt, this);});
			
			if(document.navigator.touchevent){
				div.observe('touchmove', function(evt){sender.onTouchMove(evt, this);});
			}else{
				div.observe('mouseover', function(evt){sender.onMouseOverColor(evt, this);});
				div.observe('mouseout', function(evt){sender.onMouseOutColor(evt, this);});
			}
			
			table.addCel(div);
		}
		table.addRow();
		
		for(var i = 15; i >= 0; i--){
			var color = i.toHexa()+i.toHexa()+"0";
			var div =	new Node('span', {className:'color-block', style:"background-color:#"+color});
			div.rgb = "#"+color;
			div.observe('click', function(evt){sender.onClickColor(evt, this);});
			
			table.addCel(div);
		}
		table.addRow();
		
		for(var i = 15; i >= 0; i--){
			var color = "0"+i.toHexa()+i.toHexa();
			var div =	new Node('div', {className:'color-block', style:"background-color:#"+color});
			div.rgb = "#"+color;
			div.observe('click', function(evt){sender.onClickColor(evt, this);});
			
			if(document.navigator.touchevent){
				div.observe('touchmove', function(evt){sender.onTouchMove(evt, this);});
			}else{
				div.observe('mouseover', function(evt){sender.onMouseOverColor(evt, this);});
				div.observe('mouseout', function(evt){sender.onMouseOutColor(evt, this);});
			}
			
			table.addCel(div);
		}
		table.addRow();
		
		for(var i = 15; i >= 0; i--){
			var color = i.toHexa()+"0"+i.toHexa();
			var div =	new Node('span', {className:'color-block', style:"background-color:#"+color});
			div.rgb = "#"+color;
			div.observe('click', function(evt){sender.onClickColor(evt, this);});
			
			if(document.navigator.touchevent){
				div.observe('touchmove', function(evt){sender.onTouchMove(evt, this);});
			}else{
				div.observe('mouseover', function(evt){sender.onMouseOverColor(evt, this);});
				div.observe('mouseout', function(evt){sender.onMouseOutColor(evt, this);});
			}
			
			table.addCel(div);
		}
		table.addRow();
		
		for(var i = 15; i >= 0; i--){
			var color = i.toHexa()+i.toHexa()+i.toHexa();
			var div =	new Node('div', {className:'color-block', style:"background-color:#"+color});
			div.rgb = "#"+color;
			div.observe('click', function(evt){sender.onClickColor(evt, this);});
			
			if(document.navigator.touchevent){
				div.observe('touchmove', function(evt){sender.onTouchMove(evt, this);});
			}else{
				div.observe('mouseover', function(evt){sender.onMouseOverColor(evt, this);});
				div.observe('mouseout', function(evt){sender.onMouseOutColor(evt, this);});
			}
			
			table.addCel(div);
		}
		return table;
	},
/*
 * InputColor.panelGradientGray() -> Element
 *
 * Cette méthode crée le panneau de dégradé de gris.
 **/
	panelGradientGray: function(){
		var table = 		new TableData();
		var sender = 		this;
		
		table.addClassName('panel-colors input-color-panel');
		
		for(var i = 15; i >= 0; i--){
			for(var y = 15; y >= 0; y--){
				var color = i.toHexa()+y.toHexa()+i.toHexa()+y.toHexa()+i.toHexa()+y.toHexa();
				var div =	new Node('span', {className:'color-block', style:"background-color:#"+color});
				div.rgb = "#"+color;
				div.observe('click', function(evt){sender.onClickColor(evt, this);});
				
				if(document.navigator.touchevent){
					div.observe('touchmove', function(evt){sender.onMouseOverColor(evt, this);});
				}else{
					div.observe('mouseover', function(evt){sender.onMouseOverColor(evt, this);});
					div.observe('mouseout', function(evt){sender.onMouseOutColor(evt, this);});
				}
				
				table.addCel(div);
			}
			table.addRow();
		}
		return table;	
	},
/**
 * InputColor.observe(eventName, callback) -> InputColor
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Est déclenché lorsque la valeur de l'instance change.
 * * `mouseovercolor` : Est déclenché lorsque le cursor survol une zone de couleur.
 * * `mouseoutcolor` : Est déclenché lorsque le cursor quitte une zone de couleur.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	observe: function(eventName, callback){
		
		switch(eventName){
			case 'keyup':
			case "change":
			case "mouseovercolor":
			case "mouseoutcolor":
				this.Observer.observe(eventName, callback);
			default:	
				Event.observe(this, eventName, callback);
		}
		
		return this;
	},
/**
 * InputColor.stopObserving(eventName, callback) -> InputColor
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `change` : Est déclenché lorsque la valeur de l'instance change.
 * * `mouseovercolor` : Est déclenché lorsque le cursor survol une zone de couleur.
 * * `mouseoutcolor` : Est déclenché lorsque le cursor quitte une zone de couleur.
 *
 * Et tous les autres événements propoposés par le DOM.
 **/
	stopObserving: function(eventName, callback){
		
		switch(eventName){
			case 'keyup':
			case "change":
			case "mouseovercolor":
			case "mouseoutcolor":
				this.Observer.stopObserving(eventName, callback);
			default:	
				Event.stopObserving(this, eventName, callback);
		}
		
		return this;
	},
	/**
	 * Declenche un écouteur à partir de son nom d'événement
	 */
	fire: function(eventName, callback){
		switch(eventName){
			case 'keyup':
			case "change":
			case "mouseovercolor":
			case "mouseoutcolor":
				this.Observer.fire.apply(this.Observer, $A(arguments));
			default:	
				Event.fire(this, eventName, callback);
		}
		
		return this;
	},
/*
 * InputColor.onKeyUp(evt) -> void
 **/	
	onKeyUp: function(evt){
		if(Event.getKeyCode(evt) == 13){
			this.blur();
			this.Observer.fire('keyup', evt);
			return;
		}
			
		//if(this.typebackup == 'number'){
		var str = 	this.Input.value.replace(/#/gi, '');
		var value = '';
		
		for(var i = 0, len = str.length; i < len; i++){
			var char = str.slice(i, i+1);
			if(char.match(/[a-fA-F0-9]/)){
				value += char;	
			}
		}
		
		this.Input.value = '#' + value;
		
		if(this.Input.value.length == 7){
			this.ColoredBox.setColor(this.Input.value);
		}
		
		if(this.Input.value.length == 4){
			this.ColoredBox.setColor(this.Input.value);
		}
		
		this.Observer.fire('keyup', evt);
	},
/*
 * InputColor.onTouchMove(evt, node) -> void
 **/
	onTouchMove: function(evt, node){
		evt.stop()		
	},
/*
 * InputColor.onChange(evt) -> void
 **/
	onChange: function(evt){
		Event.stop(evt);
		
		try{
			var str = 	this.Input.value.replace(/#/gi, '');
			var value = '';
			
			for(var i = 0, len = str.length; i < len; i++){
				var char = str.slice(i, i+1);
				if(char.match(/[a-fA-F0-9]/)){
					value += char;	
				}
			}
			
			this.Input.value = new Color((value + '000000').slice(0, value.length == 3 ? 3: 6)).toString();
			
			this.Value(this.Input.value);
			this.ColoredBox.setColor(this.Input.value);
		}catch(er){};
		
		this.fire('change', evt, this.Input.value);
		this.hide();
	},
	
	onClickColor: function(evt, element){
		Event.stop(evt);
		
		if(element.rgb){
			this.Value(element.rgb);
			this.ColoredBox.setColor(element.rgb);
		}
		
		this.fire('change', evt, element.rgb);	
		
		this.hide();
	},

	onMouseOverColor: function(evt, element){
		evt.stop();
		
		if(element.rgb){
			this.ColoredBox.setColor(element.rgb);
		}
	
		try{
			this.fire('mouseovercolor', evt, element.rgb);
		}catch(er){}
	},

	onMouseOutColor:function(evt){
		this.ColoredBox.setColor(this.Input.value);
		this.fire('mouseoutcolor', evt, this.Input.value);
	},
/**
 * InputColor.Value([value]) -> String
 * - value (`String`): Code couleur.
 *
 * Assigne ou/et retourne la valeur de l'instance.
 *
 * #### Setter/Getter
 *
 * <p class="note">Toutes les méthodes commençant par une majuscule sont des Setter/Getter.</p>
 * 
 * ##### Affectation d'une valeur :
 * 
 *     var c = new InputColor();
 *     c.Value('#909090');
 *
 * ##### Récupération d'une valeur :
 * 
 *     var c = new InputColor();
 *     c.Value('#909090');
 *     alert(c.Value());
 *
 **/
	Value: function(value){
		
		if(!Object.isUndefined(value)){
			this.Input.value = this.value = value;
			this.ColoredBox.setColor(value);
		}
		return this.Input.value;
	},
/**
 * InputColor.getValue() -> String
 *
 * Retourne la valeur de l'instance.
 **/
	getValue: function(){
		return this.Value();
	},
/**
 * InputColor.setValue(value) -> InputColor
 * - value (`String`): Code couleur.
 *
 * Assigne un code couleur à l'instance.
 **/
	setValue: function(value){
		this.Value(value);
		return this;
	}	
};
/**
 * InputColor.Transform(node) -> Select
 * InputColor.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance InputColor.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[InputColor]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * </ul>
 * <div>
 * <p>Cette exemple montre comment créer une instance InputColor en Javascript :</p>
 * 
 *     var input = InputColor({value:'#0066CC'});
 *     document.body.appendChild(input);
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment créer une instance InputButton en HTML :</p>
 * 
 *     <input value="#0066CC" class="box-input-color" type="text" />
 *
 * </div>
 * </div>
 * 
 * #### Résultat
 * 
 * <input value="#0066CC" class="box-input-color" type="text" />
 *
 **/
InputColor.Transform = function(e){
	
	if(Object.isElement(e)){
				
		var node = 			new InputColor();
		node.id = 			e.id;
		node.Input.name = 	e.name;
		node.Input.value =	e.value;
		node.title = 		e.title;
		
		node.addClassName(e.className);
		node.removeClassName('box-input-color');
		
		node.Value(node.Input.value);
			
		e.replaceBy(node);	
		
		return node;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(InputColor.Transform(e));
	});
	
	return options;
};