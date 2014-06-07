/** section: UI
 * class Terminal
 * 
 * Cette classe permet de gérer les erreurs lors de l'utilisation d'un logiciel reposant sur la bibliothèque Window.
 * Elle offre des outils pour afficher les erreurs dans le terminal et un outil de saisie de script. 
 *
 * <p class="note">version 0.2 - Window 2.1RTM</p>
 * <p class="note">Cette classe est définie dans le fichier terminal.js</p>
 **/

var $WT = null;
var Terminal = Class.create();
var WTManager = Terminal;

Terminal.prototype = {
	length:0,
/**
 * Terminal.js -> Object
 * Liste des elements du langage javascript.
 **/	
	js:{
		lbracket: 		/({)/g,
		rbracket: 		/(}|},)/g,
		keys:			/"(.[^"]+)":/gi,
		keys_num:		/"([0-9]+)":/gi,
		values:			/"(.[^"{}]+)"(,|#e)/gi,
		values_num:		/"?([0-9]+)"?(,|#e)/gi
	},
/**
 * Terminal.sql -> Object
 * Liste des elements du langage sql.
 **/	
	sql:{
		keywords:	/\b(INNER JOIN|COUNT|IN|NOT IN|EXIST|BETWEEN|AS|INTO|ON|INNER JOIN|LEFT JOIN|JOIN|RIGHT JOIN|EXISTS|COLUMNS|COLUMN|FIELDS|FIELD|FLUSH|FOR|FOREIGN|FUNCTION|DISTINCT|DESC|LIKE)\b/gi,
		keywords2:	/\b(CREATE|SELECT|INSERT|UPDATE|DELETE|SHOW TABLE|FROM|WHERE|ORDER BY|GROUP BY|LIMIT|SET|AND|OR|VALUES|CHANGE|HAVING|TRUNCATE|RENAME)\b/gi
	},
/**
 * new Terminal()
 *
 * Cette méthode créée une nouvelle instance de [[Terminal]]. L'instance créer sera référencé dans la variable `$WT`.
 **/
	initialize: function(){
		
		//#pragma region Instance
		
		$WT = this;
		this.tag =		'';
		this.options = 	[];
		this.current = 	0;
		this.window =	null;
		
		this.TextArea = 	new Node('div', {className:'wrap-text'});
		//
		// Observer
		//
		this.Observer = new Observer();
		this.Observer.bind(this);
		
		//#pragma region Event		
		
		this.lastAjaxResult = ''; 
		
		Ajax.Responders.register({
			onCreate:function(result){
				this.lastAjaxResult = ''; 
			}.bind(this),
			
			onException:function(request, exception){
				this.lastAjaxResult = request.transport.responseText;
				
				var obj = this.getError(exception);
				window.onerror(obj.title, obj.file, obj.line);
			}.bind(this)
		});
		
		// Override previous handler.
		var gOldOnError = window.onerror;
				
		window.onerror = function(errorMsg, url, lineNumber) {
			
			var node =		new Node('div', {className:'wrap-line'});
			var NodeMsg = 	new Node('h2', errorMsg);
			var NodeLine =	new Node('h4', $MUI('Line') +" : "+ lineNumber);
			var NodeFile = 	new Node('a', {title:url, line: lineNumber}, url);
			
			node.addClassName('msg-erreur');
						
			node.appendChilds([
				NodeMsg,
				NodeFile,
				NodeLine
			]);
			
			if(errorMsg.indexOf('JSON.parse') > -1){
				
				if(this.lastAjaxResult != ''){
					node.innerHTML += '<br />' +this.colorize(this.lastAjaxResult, true);
					this.lastAjaxResult = '';
				}
			}
						
			NodeFile.observe('click', function(evt){
				$WT.openFile(this.title);
			});
			
			$WT.TextArea.appendChild(node);
			
			if(this.ScrollBar){
				this.ScrollBar.refresh();
				this.ScrollBar.scrollToEnd();
			}
				
			if (gOldOnError){
				// Call previous handler.
				return gOldOnError(errorMsg, url, lineNumber);
			}
		
			// Just let default handler run.
			return false;
					
		}.bind(this);
		
		if(console && console.log){
			var consoleLog = console.log;
			console.log = function(s){
				this.trace(s);
				return consoleLog(s);
			}.bind(this);
		}
		
	},
/*
 * Terminal.startInterface(menu, position) -> void
 **/
	startInterface: function(menu, position){
		
		if(Object.isUndefined(position)) position = 2;
		
		this.LineWT = new LineElement($MUI('Terminal'));
		this.LineWT.setIcon('terminal');
		this.LineWT.observe('click', this.open.bind(this));
		this.LineWT.Border(true);
		
	//	try{menu.addChildAt(this.LineWT, position);}catch(er){alert(er)}
	},
	
	setTag: function(tag){
		this.tag = tag;
	},
	
	unTag: function(){
		this.tag = '';
	},
/**
 * Terminal#clear() -> void
 *
 * Cette méthode efface le contenu dans la fenêtre du terminal.
 **/
	clear: function(){
		this.TextArea.innerHTML = '';
		this.length = 0;
		try{
			this.window.SimpleButton.setTag('');
		}catch(er){}
		this.ScrollBar.refresh();
		this.ScrollBar.scrollToEnd();
	},
/**
 * Terminal.open() -> void
 *
 * Cette méthode ouvre une fenêtre du terminal.
 **/
	open: function(b){
		
		if(this.window) {
			this.window.Hidden(false);
			this.window.focus();
			return this.window;
		}
try{
		this.window = new Window();
		this.window.Resizable(false);
		this.window.setTitle('Terminal').setIcon('terminal');
		this.window.addClassName('terminal');
		
		this.window.DropMenu.setType();
		this.window.DropMenu.Chrome(true);
		this.window.DropMenu.addMenu($MUI('Effacer'), {icon:'cancel'}).observe('click', this.clear.bind(this));
		this.window.BtnErrors = this.window.DropMenu.addMenu($MUI('Erreurs'), {icon:'14-layer-visible'});
					
		this.window.DropMenu.addMenu($MUI('Afficher package'), {icon:'package'}).observe('click', function(){$WT.trace(Extends.Imported())});
		
		//this.window.DropMenu.addMenu($MUI('Afficher package'), {icon:'package'}).observe('click', function(){throw('hello')});
		//
		// TextArea
		//
		
		//
		// InputCode
		//
		this.InputCode =	new InputButton({icon:'cell-edit'});
		this.InputCode.setStyle('width:auto');
		//
		// SimpleButton
		//
		this.SimpleButton = this.InputCode.SimpleButton;
		this.SimpleButton.observe('click', this.onClickEval.bind(this));
		this.InputCode.Input.observe('keyup', this.onKeyUp.bind(this));
		//
		//
		//
		var clear = new LineElement({text:$MUI('Effacer')}).observe('click', this.clear.bind(this));
		
		this.window.appendChild(this.TextArea);
		this.window.footer.appendChild(this.InputCode);
		
		document.body.appendChild(this.window);
		
		//
		// ScrollBar
		//
		this.ScrollBar = 	new ScrollBar({node:this.window.Body(), wrapper:this.TextArea, type:'vertical'});
		
		this.window.Fullscreen(true);
		this.window.moveTo((document.stage.stageWidth - this.window.getHeight()) / 2,  (document.stage.stageHeight - this.window.getHeight()) / 2);
				
		this.window.observe('close', function(){
			this.window = null;
		}.bind(this));
		
		this.window.SimpleButton = Object.isUndefined(b) ? this.window.MinWin : b;
		
		try{
			this.window.MinWin.SimpleMenu.appendChild(clear);
			this.window.SimpleButton.setTag(this.length > 0 ? this.length : '');
		}catch(er){}
		
		try{
			this.ScrollBar.refresh();
			this.ScrollBar.scrollToEnd();
		}catch(er){}
		
		this.window.BtnErrors.hidden = false;
		
		this.window.BtnErrors.on('click', function(){
			if(this.window.BtnErrors.hidden){
				this.window.BtnErrors.setIcon('');
				this.window.BtnErrors.hidden = false;
				this.window.BtnErrors.setIcon('14-layer-visible');
				this.TextArea.removeClassName('show-only-err');
				this.ScrollBar.refresh();
				this.ScrollBar.scrollToEnd();
			}else{
				this.window.BtnErrors.hidden = true;
				this.window.BtnErrors.setIcon('14-layer-novisible');
				this.TextArea.addClassName('show-only-err');	
				this.ScrollBar.refresh();
				this.ScrollBar.scrollToEnd();
			}
		}.bind(this));
		
		
		this.Observer.fire('open', this.window);
}catch(er){}
		
		return this.window;
	},
/**
 * Terminal#openFile(link) -> void
 *
 * Cette méthode ouvre le fichier possant problème.
 **/
	openFile: function(link){
		var box = $WT.window.createBox();
		box.box.Closable(false);
		box.appendChild(new Node('iframe', {src:link, style:'height:600px; width:800px;'}));
		box.setType('CLOSE').show();
	},
	
	getError:function(exception){
		var options = {title:'', line:'', file:''};
		
		switch(document.navigator.client){
			default:
				options.title = '' + exception;
				break;
				
			case 'Firefox':
				options.title = exception.message;
				options.line =	exception.lineNumber;
				options.file =	exception.fileName;
				
				break;
				
			case 'Chrome':
				options.file = 		exception.stack.replace(exception.name + ': ', '').replace(exception.message, '').replace(/ at /g, '').split('\n')[1].replace('(', '').replace(')', '').ltrim().split(' ');
				options.title = 	exception.message +	' in '+ options.file[0];
				options.file =		options.file[1];
				options.line = 		options.file.split(':')[2];
				
				break;
				
		}
		return options;
	},
/**
 * Terminal#trace(value) -> void
 * - value (String | Number | Date | Object): Valeur à afficher dans le terminal.
 *
 * Cette méthode affiche une valeur quelconque dans le terminal.
 **/
	trace: function(obj, options_){
		
		var options = {
			colorize:	true,
			printTag:	true		
		};
		
		if(!Object.isUndefined(options_)){
			Object.extend(options, options_);
		}
		
		if(document.navigator.client == 'Opera') return;
			
		var node = new Node('div', {className:'wrap-line prettyprint'});
		try{
			
			switch(typeof obj){
				case 'array':
					node.innerHTML = this.colorize(this.serialize(obj));
					node.addClassName('msg-info');
					break;
				
				case 'object':
					
					if(Object.isElement(obj)) node.innerHTML = obj;
					else {
						if(Object.isUndefined(obj)) {
							
							node.innerHTML = this.colorize(this.serialize(obj));
							break;
						}
						
						try{
							if(!Object.isUndefined(obj.message)){ //try catch
								node.addClassName('msg-erreur');
								this.length++;
								
								obj = this.getError(obj);
								
								var NodeMsg = 	new Node('h2', obj.title);
								var NodeLine =	new Node('h4', $MUI('Line') +" : "+ obj.line);
								var NodeFile = 	new Node('a', {title:obj.file, line: obj.line}, obj.file);
								
								node.appendChilds([
									NodeMsg,
									NodeFile,
									NodeLine
								]);
								
								NodeFile.on('click', function(){
									$WT.openFile(obj.fileName);	
								});
							
							}else{
								node.addClassName('msg-info');
								node.innerHTML = this.colorize(this.serialize(obj));
							}
							
						}catch(er){
							
							node.addClassName('msg-info');
							try{
								node.innerHTML = this.colorize(this.serialize(obj));
							}catch(er){
								node.innerHTML = obj;
							}
						}
					}
					break;
				case 'undefined': break;
				
				case 'string':
					if(obj.isJSON() && !obj.isDate()){
						obj = this.serialize(obj.evalJSON(obj));
					}
				
				default:
					node.innerHTML = '';
									
					if(this.tag != '') 		node.innerHTML =  this.tag;
					if(options.colorize) 	node.innerHTML += this.colorize(""+obj, true);
					else					node.innerHTML += obj;
					
					if(node.innerHTML.match(/\.err/)){
						node.addClassName('msg-err');	
						this.length++;
					}else{
						node.addClassName('msg-info');	
					}
					break;
			}
		}catch(er){console.log(er)}
		this.TextArea.appendChild(node);
		
		if(this.TextArea.childElements() > 30){
			this.TextArea.removeChild(this.TextArea.down());
		}
		
		try{
			this.window.SimpleButton.setTag(this.length);
		}catch(er){}
		
		var t = node.getElementsByClassName('code-pre');
		
		for(var i = 0; i < t.length; i++){
			t[i].isReply = false;
			
			t[i].observe('mouseover', function(evt){Event.stop(evt);this.className += ' code-pre-hover';});
			t[i].observe('mouseout', function(){this.className = this.className.replace(' code-pre-hover','');});
		}
		
		try{
			this.ScrollBar.refresh();
			this.ScrollBar.scrollToEnd();
		}catch(er){}
		
	},
	
	serialize: function(value){

		switch(typeof value){
			
			case "function":
				return value + '';
			case "boolean":
				return value ? 'true':'false';
			case "number":
				return value + '';
			case "string":
				var len = value.length;
				if(len > 300){
					value = value.slice(0,300) + '... [length:'+ len +']';
				}
				
				return '"' + value.escapeHTML() + '"';
				break;
			case "object":
				try{
					if(Object.isFunction(value.toString_)){
						value = '"' + value.toString_('datetime') + '"';	
					}else{
						
						if(Object.isElement(value)){
							value = value + '';
						}else{
							var str = Object.isArray(value) ? '[' : '{';
													
							for(var key in value){
								if(Object.isFunction(value[key])) continue;
								str += '"' + key +'":' + this.serialize(value[key]) + ",";
							}
							
							if(str.match(/,$/)){
								str = str.slice(0, str.length -1);	
							}
							
							str += Object.isArray(value) ? ']' : '}';
							
							value = str;
						}
					}
				}catch(er){}
				break;	
		};
		
		return value;
	},
/**
 * Terminal#colorizeJSON(str) -> void
 * - str (String): Chaine à coloriser.
 *
 * Cette méthode colorise du code au format JSON.
 **/
	colorizeJSON:function(str, bool){
		str = 	str.stripslashes();
		
		if(!bool){
			str = 	str.replace(/="/gi, '=&quote;');
			str = 	str.replace(/">/gi, '&quote;>');
			str = 	str.replace(/" /gi, '&quote; ');
			str = 	str.replace(/</gi, '&lt;');
			str = 	str.replace(/>/gi, '&gt;');
			str = 	str.replace(/\\\//gi, '/');
			str = 	str.replace(/\\n/gi, '<br />');
		}
		
		str =	str.replace(this.js.lbracket, '$1<ul class="code-pre">');
		str =	str.replace(this.js.rbracket, '#e</ul>$1');
		str = 	str.replace(this.js.keys, '<li class="code-line"><span class="code-json-key">"$1"</span> <span className="code-json-fleche">=></span>');
		str = 	str.replace(this.js.keys_num, '<li class="code-line"><span class="code-json-key">"$1"</span> <span className="code-json-fleche">=></span>');
		str =	str.replace(this.js.values, '<span class="code-json-value">"$1"</span>$2</li>');
		str =	str.replace(/"",/gi, '<span class="code-json-value">""</span>,</li>');
		str =	str.replace(/""#e/gi, '<span class="code-json-value">""</span></li>');
		str =	str.replace(/(false|true|null)/gi, '<span class="value-boolean">$1</span>');
		
		str =	str.replace(this.js.values_num, '<span class="code-json-value value-number">$1</span>$2</li>');
		str =	str.replace(/#e/g,'');
		return str;
	},
/**
 * Terminal#colorizeSQL(str) -> void
 * - str (String): Chaine à coloriser.
 *
 * Cette méthode colorise du code au format SQL.
 **/
 	colorizeSQL:function(str){		
		str = 	str.replace(this.sql.keywords, '<span class="code-sql"><b>$1</b></span>');
		str = 	str.replace(this.sql.keywords2, '<br /><span class="code-sql"><b>$1</b></span>');
		str =	str.replace('<br />', '');
		return str;
	},
/**
 * Terminal#colorize(str) -> void
 * - str (String): Chaine à coloriser.
 *
 * Cette méthode colorise du code au format SQL et JSON.
 **/
	colorize: function(str, bool){
		return this.colorizeSQL(this.colorizeJSON(str, bool));
	},
/** 
 * Terminal#observe(eventName, callback) -> Terminal
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Cette méthode ajoute un écouteur `callback` à un nom d'événement `eventName`.
 *
 * #### Evénements pris en charge :
 *
 * * `eval` : Appelle la fonction lorsque le Terminal tente d'évaluer le script saisie.
 *
 * Et tous les autres propoposés par le DOM sont repportés vers l'instance [[Window]] du terminal.
 **/
 	on: function(eventName, callback){return this.observe(eventName, callback);},
	observe: function(eventName, callback){
		switch(eventName){
			case "open":
			case 'eval':
				this.Observer.observe(eventName, callback);
				break;
			default:
				if(this.window)	this.window.observe(eventName, callback);
		}
		
		return this;
	},
/**
 * Terminal#stopObserving(eventName, callback) -> Terminal
 * - eventName (String): Nom de l'événement.
 * - callback (Function): Fonction associée à l'événement.
 *
 * Supprime un écouteur `callback` associé à un nom d'événement `eventName`.
 **/
	stopObserving: function(eventName, callback){
		switch(eventName){
			case "open":
			case 'eval':
				this.Observer.stopObserving(eventName, callback);
				break;
			default:
				this.window.stopObserving(eventName, callback);
		}
		
		return this;
	},
/**
 * Terminal#onClickEval(cmd) -> void
 *
 * Cette méthode evalue une chaine de commande.
 **/	
	eval: function(cmd){
		this.InputCode.setText(cmd);
		this.onClickEval();
	},
/**
 * Terminal#onClickEval() -> void
 *
 * Cette méthode gère l'événement onEval.
 **/
	onClickEval: function(){

		if(this.InputCode.setText() == '') return;
		
		this.options.push(this.InputCode.getText());
		this.current = this.options.length;
		
		if(/(clear)/.exec(this.InputCode.getText())){
			this.clear();
			this.InputCode.value = '';
			return;
		}
		
		if(/(close|this.close|exit)/.exec(this.InputCode.getText())){
			this.window.removeChild(this.TextArea);
			this.window.footer.removeChild(this.TableFoot);
			this.window.close();
			this.window = null;
			return;
		}
			
		try{
			var result = eval(this.InputCode.getText());
			this.trace(result);
		}catch(er){
			//tentative d'évaluation
			var argv = 	this.InputCode.getText().split(' ');
			var evt = 	new StopEvent(argv);
			
			evt.text = this.InputCode.getText();
			
			var str = 	this.Observer.fire('eval', evt, argv, argv.length); 
			
			if(!evt.stopped){
				this.trace(er);
			}else{
				if(str){
					this.trace(str, {colorize:true});
				}
			}
		}
		
		this.InputCode.setText('');
		this.InputCode.Input.select();
	},
/**
 * Terminal#onKeyUp() -> void
 *
 * Méthode appellée lors d'une action du clavier sur le champs de saisie.
 **/
 	onKeyUp: function(evt){
		//if(evt.keyCode != 13) return;
		switch(evt.keyCode){
			case 13:
				this.onClickEval();
				evt.stop();
				return false;
			case 38:
				if(this.current == 0) break;
				this.current--;
				this.InputCode.setText(this.options[this.current]);
				evt.stop();
				return false;
			case 40:
				if(this.current < this.options.length -1) {
					this.current++;
					this.InputCode.setText(this.options[this.current]);
				}
				evt.stop();
				return false;
		}
	}
};

if(Object.isUndefined(console)){
	console = {
		log:function(s){
			$WT.trace(s);
		}
	};
}