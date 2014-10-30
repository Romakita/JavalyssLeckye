/** section: Core
 * class System.Market.App
 * Cette classe gère les informations d'une applications.
 **/
System.Market.App = Class.createAjax({
	Application_ID: 	0,
	Release_ID:			0,
	Name:				'',
	Version:			'',
	Type:				'',
/**
 * System.Market.App#download(oncomplete, onerror) -> void
 * - oncomplete (Function): Méthode appelée lorsque le téléchargement est terminé.
 * - onerror (Function): Méthode appelée lorsque le téléchargement rencontre une erreur.
 *
 * Cette méthode installe l'archive télécharge l'archive de l'application en vue de son installation.
 **/	
	download:function(callback, error){
		
		$S.exec('market.app.get', {
			parameters: 'App=' + this.toJSON(),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)){
						error.call(this, result.responseText);
					}
					return;
				}
				
				if(Object.isFunction(callback)){
					callback.call(this, result.responseText);
				}
			}.bind(this)
		});
	},
/**
 * System.Market.App#install(oncomplete, onerror) -> void
 * - oncomplete (Function): Méthode appelée lorsque le téléchargement est terminé.
 * - onerror (Function): Méthode appelée lorsque le téléchargement rencontre une erreur.
 *
 * Cette méthode installe l'archive téléchargé via la méthode [[System.Market.App#download]].
 **/	
	install:function(callback, error){
		$S.exec('market.app.install', {
			parameters: 'App=' + this.toJSON(),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)){
						error.call(this, result.responseText);
					}
					return;
				}
				
				if(Object.isFunction(callback)){
					callback.call(this, result.responseText);
				}
			}.bind(this)
		});
	},
/**
 * System.Market.App#configure(oncomplete, onerror) -> void
 * - oncomplete (Function): Méthode appelée lorsque le téléchargement est terminé.
 * - onerror (Function): Méthode appelée lorsque le téléchargement rencontre une erreur.
 *
 * Cette méthode configure l'application installé via la méthode [[System.Market.App#install]].
 **/	
	configure:function(callback, error){
		$S.exec('plugin.configure', {
			parameters: 'redir_cmd=market.app.configure&App=' + this.toJSON(),
			onComplete: function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)){
						error.call(this, result.responseText);
					}
					return;
				}
				
				if(Object.isFunction(callback)){
					callback.call(this, result.responseText);
				}
			}.bind(this)
		});
	},
/**
 * System.Market.App#toJSON() -> String
 *
 * Sérialise l'instance au format JSON.
 **/
	toJSON:function(){
		
		var object = {
			Application_ID:	this.Application_ID,
			Release_ID:		this.Release_ID,
			Name:			this.Name,
			Version:		this.Version,
			Type:			this.Type
		};
		
		return escape(Object.toJSON(Object.encodeURIComponent(object)));
	},
});