/** section: Plugins
 * System.MyStore.OutOfStock
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_outofstock.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyStore.OutOfStock = {
		empty: 'Vous n\'avez pas de produit ou de déclinaison épuisé',
/**
 *
 **/	
	listing:function(win){
		
		var panel = win.MyStore;
		
		System.MyStore.setCurrent('outofstock');
		
		if(!this.NavBar){
			
			this.NavBar = new NavBar( {
				range1:1000,
				range2:1000,
				range3:1000
			});
			this.NavBar.on('change', this.load.bind(this));	
		}
		
		panel.PanelBody.Header().appendChilds([
			this.NavBar
		]);
		
		this.load();
		
	},
/**
 *
 **/	
	getParameters:function(){
		
		var clauses = this.NavBar.getClauses();
		
		//var sort = this.NavBar.select('span.sort.selected')[0];
		//var field = sort.value;
				
		//if(sort.hasClassName('desc')){	
		//	sort = 'desc';
		//}else{
		//	sort = 'asc';
		//}
		
		//clauses.order = field + ' ' + sort;
		//clauses.where = $WR.getByName('mystore').Panel.InputCompleter.Text();
		
		var options = {
			draft:			false,
			op:				'-outofstock'
		};
		
		return 'options=' + Object.EncodeJSON(options) + '&clauses=' + clauses.toJSON();
	},
/**
 *
 **/	
	load:System.MyStore.Product.load,
};