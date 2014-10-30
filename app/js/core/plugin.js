/** section: Core
 * class System.Plugin
 * Gestionnaire des modules additionnels du logiciel.
 * Il permet de gerer des fichiers sur le serveur Web.
 **/
System.plugins = System.Plugin = Class.createAjax({
/**
 * System.Plugin#Name -> String
 * Nom de l'extension
 **/
	Name:				'',
/**
 * System.Plugin#Folder -> String
 * Répertoire de l'extension.
 **/
	Folder:				'',
/**
 * System.Plugin#active(erasedata, callback) -> System.Plugin
 *
 * Cette méthode désactive l'extension.
 **/	
	active: function(callback, onerror){
				
		$S.exec('plugin.active', {
			parameters:'Plugin='+ this.toJSON(),
			onComplete:function(result){
				
				if(result.responseText != 'plugin.active.ok'){
					if(Object.isFunction(onerror)){
						onerror.call(this, result.responseText);	
					}
					return;
				}
				if(Object.isFunction(callback)){
					callback.call(this, this);	
				}
			}
		});
		
		return this;
	},
/**
 * System.Plugin#deactive(erasedata, callback) -> System.Plugin
 *
 * Cette méthode désactive l'extension.
 **/	
	deactive: function(erase, callback, onerror){
				
		$S.exec('plugin.deactive', {
			parameters:'Plugin='+ this.toJSON() + '&Erase=' + Object.toJSON(erase ? true : false),
			onComplete:function(result){
				if(result.responseText != 'plugin.deactive.ok'){
					if(Object.isFunction(onerror)){
						onerror.call(this, result.responseText);	
					}
					return;
				}
				
				if(Object.isFunction(callback)){
					try {
					callback.call(this, this);	
					}catch(er){alert(er)}
				}
			}
		});
		
		return this;
	},
/**
 * System.Plugin#remove(callback) -> System.Plugin
 *
 * Cette méthode supprime l'extension.
 **/	
	remove:function(callback, onerror){
		
		$S.exec('plugin.remove', {
			parameters:'Plugin='+ this.toJSON(),
			onComplete:function(result){
				
				if(result.responseText != 'plugin.remove.ok'){
					if(Object.isFunction(onerror)){
						onerror.call(this, this);	
					}
					return;
				}
				
				if(Object.isFunction(callback)){
					try {
					callback.call(this, this);	
					}catch(er){alert(er)}
				}
			}
		});
		
		return this;
	}
});

Object.extend(System.plugins, {
	options: 	null,
	hash:		null,
	update:		[],
/**
 * System.Plugin.get(name) -> Plugin
 * - name (Nom): Nom du plugin.
 *
 * Cette méthode retourne un objet contenant les informations du plugin `name`.
 **/	
	get: function(name){
		return !Object.isUndefined(this.hash[name]) ? this.hash[name] : false;
	},
/**
 * System.Plugin.getData(name) -> Array
 * - name (Nom): Nom du plugin.
 *
 * Cette méthode retourne la liste des plugins
 **/	
	getData: function(name){
		return $A(this.options);
	},
/*
 * System.Plugin.startInterface() -> void
 *
 * Lance l'interface du gestionnaire de fichier. Cette méthode est appellé par le système.
 **/
	startInterface: function(){},
	
	setObject: function(obj){
		this.options = 	obj;
		this.hash =		{};
		
		for(var key in this.options){
			this.hash[this.options[key].Name] = this.options[key];
		};	
	},
/*
 *
 **/	
	haveAccess:function(name){
		return this.get(name) ? this.get(name).GroupAccess : true;
	},
	
	reload:function(){
		$S.exec('plugin.reload', function(result){
			try{
				var obj = result.responseText.evalJSON();
			}catch(er){return}
			
			this.options = obj;		
			
		}.bind(this));
	}
});