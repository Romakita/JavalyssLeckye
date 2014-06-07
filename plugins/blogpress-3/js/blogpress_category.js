/** section: BlogPress
 * class Category
 **/
System.BlogPress.Category = Class.createAjax({
/**
 * Category.Category_ID -> Number
 * Numéro d'identification du post.
 **/
	Category_ID: 			0,
/**
 * Category.Category -> String
 * Categorie du poste.
 **/
	Category:			'Non classé',
	
	Description:		'',
	
	Type:				'post',
/**
 * Category.commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback){
		
		$S.exec('blogpress.category.commit', {
			
			parameters: 'PostCategory=' + this.toJSON(),
			onComplete: function(result){
				
				this.evalJSON(result.responseText);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	
	},
/**
 * Category.delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('category.delete',{
			parameters: 'Category=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});