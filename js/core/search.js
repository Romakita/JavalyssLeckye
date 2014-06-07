/** section: Core
 * class System.Search
 * Cette classe gère la recherche globale.
 *  
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : search.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/

System.Search = {
	options: [],
/**
 *
 **/	
	create:function(){
		if(this.Input){
			return this.Input;	
		}
		
		this.Input = new InputButton({type:'text', sync:true, placeholder:$MUI('Rechercher') + '...', icon:'system-close'});
		this.Input.Large(true);
		
		this.Input.css('background-position', '98% center');
		//
		//
		this.Input.on('focus', function(){
			//this.Value('');
		});
		
		this.Input.SimpleButton.hide();
		
		this.Input.SimpleButton.on('click', function(){
			
			if(this.ajax){
				try{this.ajax.transport.abort();}catch(er){}	
			}
			
			this.Input.Value('');
			System.Sidebar.Open(false);
			this.Input.SimpleButton.hide();
		}.bind(this));
		//
		//
		//
		this.Input.on('keyup', this.onKeyUp.bind(this));
		
		return new Node('div', {className:'wrap-search'}, this.Input);	
	},
/**
 *
 **/	
	onKeyUp:function(evt){
		evt.stop();
				
		try{
			System.fire('system.search:keyup', evt, this.Input.Value());
		}catch(er){}
		
		//if(this.
		
		//if(this.Input.Value().length < this.minLength) {
		//	this.Hidden(true);	
		//	return
		//};
				
		this.search(this.Input.Value());
		
		/*switch(evt.keyCode){
			case 13:
				this.search();	
				}
				break;
			case 40:
				if(this.CurrentSibling){
					this.Current(this.CurrentSibling.next() ? this.CurrentSibling.next() : this.CurrentSibling);
				}
				break;
			case 37:break;
			case 38:
				if(this.CurrentSibling){
					this.Current(this.CurrentSibling.previous() ? this.CurrentSibling.previous() : this.CurrentSibling);
				}
				break;	
			default:
				this.timer.start();
				break;		
		}*/
		
		return false;
	},
/**
 *
 **/
	search: function(word, appName){
		
		if(System.Sidebar.Title() != $MUI('Recherche')){
			System.Sidebar.Open(false);
		}
		
		if(this.Input.Value() == '' || this.Input.Value().length <= 3){
			System.Sidebar.Open(false);
			return;
		}
				
		var obj = {
			cmd: 		'cmd=system.search',
			parameters:	null,
			value:		word
		};
			
		System.fire('system.search:send', obj); 
			
		var globals = 		$WR().getGlobals('parameters');
		var parameters = 	"cmd=system.search&word=" + encodeURIComponent(word);
		parameters +=		globals == '' ? '' : ('&' + globals);		
			
		if(obj.parameters != null) parameters += "&" + obj.parameters;
			
		var sender = this;
						
		if(this.ajax){
			try{this.ajax.transport.abort();}catch(er){console.log(er)}	
		}
			
		this.loading = true;
			
		this.ajax = new Ajax.Request($S.link, {
			method:		'post',
			parameters: parameters,
			
			onCreate:function(result){
				this.Input.SimpleButton.setIcon('system-loading');
				this.Input.SimpleButton.show();
				result.ID = 0;
			}.bind(this),
			
			onLoading:function(){
				//this.ProgressBar.setProgress(2, 4, '');
			}.bind(this),
			
			onLoaded:function(){
				//this.ProgressBar.setProgress(3, 4,'');
			}.bind(this),
			
			onInteractive:function(){
				//this.ProgressBar.setProgress(4, 4, '');
			}.bind(this),
			
			onSuccess:function(){
				//this.ProgressBar.setProgress(4, 4, '');
			}.bind(this),	
			
			onComplete: function(result){
				this.Input.SimpleButton.setIcon('system-close');
				
				this.ajax = null;
				//this.ProgressBar.setProgress(4, 4, '');
				try{						
					//this.ProgressBar.hide();
					this.onComplete(result);
				}catch(er){
					System.trace(er);
				}
				this.loading = false;
			}.bind(this)
		});
	},
/**
 *
 **/	
	onComplete:function(result){
		
		if(this.Input.Value() == '' || this.Input.Value().length <= 3){
			this.Input.SimpleButton.hide();
			System.Sidebar.Open(false);
			return;
		}
		
		this.Input.SimpleButton.show();	
		try{
			var array = $A(result.responseText.evalJSON());
		}catch(er){
			System.Sidebar.refresh();
			$S.trace(result.responseText);
			return;
		}
		
		if(System.Sidebar.Title() != $MUI('Recherche')){
			System.Sidebar.clear();
		}
		
		System.Sidebar.Body().removeChilds();
		System.Sidebar.Counter(array.length);
		
		if(array.length == 0){
			
			if(System.Sidebar.Title() != $MUI('Recherche')){
				System.Sidebar.Title($MUI('Recherche'));
				System.Sidebar.Open(true);
				System.Sidebar.setTheme('white');
			}
			
			System.Sidebar.Body().appendChild(new Node('h2', {className:'not-found'}, $MUI('Aucun résultat ne correspond à votre recherche')));
			System.Sidebar.refresh();
			return;
		}
		
		for(var i = 0; i < array.length; i++){
			this.add(array[i]);
		}
		
		if(System.Sidebar.Title() != $MUI('Recherche')){
			System.Sidebar.Title($MUI('Recherche'));
			System.Sidebar.setTheme('white');
		}
		
		System.Sidebar.Open(true);
		
		System.Sidebar.Counter(array.length).refresh();
		System.Sidebar.refresh();
	},
/**
 *
 **/	
	add: function(obj){
		
		var options = {
			title:		'',
			icon:		'',
			appName:	$MUI('Autres'),
			appIcon:	'',
			onClick:	''
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		var group = System.Sidebar.select('.group-' + options.appName.sanitize('-').replace(/\(\)/gi, '').toLowerCase());
		
		if(group.length == 0){
			group = this.addGroup(options.appName, options.appIcon);
		}else{
			group = group[0];
		}
		
		var line = new LineElement(options);
		line.addClassName('line-altern-' + (group.list.childElements().length % 2 == 0 ? '0' : '1'));
		group.appendChild(line);
		
		line.on('click', function(){
			
			System.Sidebar.Open(false);
			System.Search.Input.Value('');
			System.Search.Input.SimpleButton.hide();
			
			eval(options.onClick + '(' + Object.toJSON(options) + ')');
			
		});
				
		return line;
	},
/*
 *
 **/	
	addGroup: function(name, icon){
		var group = new Section(name);
				
		var self = 	this;
		
		if(icon){
			group.label.addClassName('icon icon-' + icon);
		}
		
		group.addClassName('group-' + name.sanitize('-').toLowerCase());
		
		group.list = new Node('ul');
		group.Body().appendChild(group.list);				
		System.Sidebar.appendChild(group);
				
		return group;		
	}
	
};