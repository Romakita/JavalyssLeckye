/*
 * Manuel. Permet la gestion du guide utilisateur.
 * file manuel.js
 * date 09/03/2011
 * author Lenzotti Romain
 * version 0.1
 * note : This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 **/

/** section: Core
 * class System.Manuel
 * Gestion du guide utilisateur pour le logiciel Javalyss.
 **/
System.Manuel = Class.createAjax( {
/**
 * System.Manuel#Crash_ID -> Number
 **/
	Man_ID:				0, 	 	 	 	 	 	 	 
/**
 * System.Manuel#Application_ID -> Number
 **/
	Application_ID:		0,
/**
 * System.Manuel#Name_Application -> Number
 **/
	Parent_ID:			0,
/**
 * System.Manuel#Title -> String
 **/
	Title:				'',
/**
 * System.Manuel#Description -> String
 **/	
	Description:		'',
/**
 * System.Manuel#Level -> Number
 **/	
	Level:				0,
/**
 * System.Manuel#Version -> String
 **/
	Version:			'',
/**
 * System.Manuel#Statut -> Number
 **/
	Statut:				0,
/**
 * System.Manuel#get(callback [, options]) -> System.Manuel
 *
 * Cette méthode récupère un manuel de l'application depuis le serveur principal Javalyss.
 **/
	get: function(callback, options){
		
		$S.exec('system.manuel.get', {
			parameters: "Man_ID=" + this.Man_ID + "&options=" + escape(Object.toJSON(options || {})),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
					if(Object.isFunction(callback)) callback.call(this, this);
				}catch(er){
					if(Object.isFunction(callback)) callback.call(this, false);
				}
			}.bind(this)
			
		});
		
		return this;
	},
/**
 * System.Manuel#commit(callback) -> System.Manuel
 * - callback (Function): Fonction appelée après que la reqête AJAX soit terminée.
 *
 * Cette méthode enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback){

		$S.exec('application.manuel.commit', {
			
			parameters: "Manuel=" + this.toJSON(),
			onComplete: function(result){
				this.evalJSON(result.responseText);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
		return this;
	},
/*
 * System.Manuel#remove(callback) -> System.Manuel
 * - callback (Function): Fonction appelée après que la reqête AJAX soit terminée.
 *
 * Cette méthode supprime les informations de l'instance en base de données.
 **/
	remove: function(callback){
		$S.exec('application.manuel.delete',{
			parameters: 'Manuel=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
		return this;
	}	
});

Object.extend(System.Manuel, {
/**
 * System.Manuel.startInterface() -> void
 *
 * Lancement de l'interface pour la gestion des crashes.
 **/
	startInterface: function(){},
/**
 * System.Manuel.learn(manID [, options]) -> Window
 * - manID (String): Nom de la fonctionnalité.
 * - options (Object): Option de configuration du rapport d'erreur.
 *
 * Cette méthode permet d'ouvrir une page du guide utilisateur.
 *
 * #### Paramètre options
 *
 * Le paramètre `options` permet de configurer le mode d'ouverture de la page. Les attributs sont les suivants :
 *
 *
 **/	
	learn: function(manID, options){
		
		if(!(Object.isUndefined(this.winMan) || this.winMan == null)){
			try{
				this.winMan.close();
			}catch(er){}
		}
		//
		// Manuel
		//
		var man = new System.Manuel();
		
		man.Man_ID = manID;
		
		//
		// Window
		//
		var win = this.winMan = new Window();
		win.Resizable(false);
		win.setTitle($MUI('Manuel')).setIcon('write');
		win.body.setStyle('background:#EFEFEF');
		
		win.createHandler($MUI('Récupération du manuel') + '...', true);
		win.createBox();
		win.createFlag();
		
		$Body.appendChild(win);

		win.resizeTo(500, document.stage.stageHeight);
		win.moveTo('right', 'top');
		
		win.ActiveProgress();
		
		man.get(function(result){
			
			if(result){
		
				//
				// Splite
				//
				var html = new HtmlNode();
				
				html.append('<h1>' + man.Title + '</h1>');
				html.append(man.Description);
				
				win.appendChild(html);
								
				var options = html.getElementsByClassName('box-flag');

				for(var i = 0; i < options.length; i++){
					options[i].text = options[i].title;			
					options[i].title = '';
					
					options[i].on('mouseover', function(){				
						win.Flag.setType(FLAG.LEFT).color('grey').setText('<p class="icon-documentinfo">' + this.text + '</p>').show(this, true);
						return false;
					});
				}
								
				options = html.getElementsByClassName('box-simple-button');
				
				for(var i = 0; i < options.length; i++){
					try{
						var a = 	options[i];
						var text = 	a.innerHTML;
						var icon = 	a.className;
						var btn = 	new SimpleButton({text:text, icon:icon});
						
						btn.link =	a.href;
						
						//options[i].removeChild(a);
						options[i].replaceBy(btn);
						//décrementation du nombre d'enfant dans option (dingue que javascript touche à option)
						i--;
						
						btn.on('click', function(){
							try{
								eval(this.link.replace('javascript:',''));
							}catch(er){
								
								try{
									window.location = this.link;
								}catch(er){}
							}
						});
						
					}catch(er){}
				}
				
			}else{
				var splite = SpliteInfo($MUI('Le manuel demandé n\'existe pas ou n\'est pas encore publié par l\'équipe en charge de votre application') + '.');
				win.appendChild(splite);
			}
			
		}, options);
		
		win.observe('close', function(){this.winMan = null}.bind(this));
		
		return win;
	},
/**
 * System.Manuel.createHandler(fn, options) -> Function
 * - fn (String): Nom de la fonctionnalité.
 * - options (Object): Option de configuration du rapport d'erreur.
 *
 * Cette méthode permet de créer un nouveau rapport d'erreur rencontré dans l'application et retourne une fonction pouvant être appellé au clique d'un élément
 * de type bouton.
 **/	
	createHandler: function(id, options){
		var sender = this;
		return function(){sender.learn(id, options)};	
	}
});