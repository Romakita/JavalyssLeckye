/** section: Plugins
 * class System.MyStore.Selection
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_selection.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyStore.Selection = Class.createAjax({
/**
 * System.MyStore.Selection#Selection_ID -> Number
 **/
	Selection_ID: 0,
/**
 * System.MyStore.Selection#Post_ID -> Number
 **/
	Post_ID: 0,
/**
 * System.MyStore.Selection#Title -> Number
 **/	
	Title:	'',
/**
 * System.MyStore.Selection#Price -> Number
 **/	
	Price:	'0,00',
/**
 * System.MyStore.Selection#Collection -> Number
 **/	
	Collection:'',
/**
 * System.MyStore.Selection#Picture -> String
 * Varchar
 **/
	Picture: "",
/**
 * System.MyStore.Selection#Content -> String
 * Text
 **/
	Content: "",
/**
 * System.MyStore.Selection#Order -> Number
 **/
	Order: 0,
/**
 * System.MyStore.Selection#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('mystore.selection.commit', {
			
			parameters: 'MyStoreSelection=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) callback.call(this, result.responseText);
					return;	
				}
				
				this.oMeta = Object.toJSON(this.Meta);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	},
/**
 * System.MyStore.Selection#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('mystore.selection.delete',{
			parameters: 'MyStoreSelection=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});

Object.extend(System.MyStore.Selection , {
/** 
 * System.MyStore.Selection.open() -> void
 * Cette méthode ouvre le panneau de gestion des produits.
 **/	
	open:function(win, selection){
						
		try{
		
		var panel = win.MyStore;
		
		win.setData(selection = new System.MyStore.Selection(selection));
		var forms = win.createForm();
		//
		// Réinitialisation du contenu
		//
		panel.clearSwipAll();
		panel.Open(true, 650);
		//
		//
		//
				
		var button = new System.MyStore.Product.Button({
			icon:		selection.Picture, 
			text:		selection.Title || 'Nouvelle selection',
			subTitle:	$MUI('Collection') + ' : ' + selection.Collection,
			price:		selection.Price
		});
		
		button.BtnDuplicate.hide();
		button.BtnRemove.hide();
		
		panel.PanelSwip.Body().appendChild(button);
			
		panel.PanelSwip.addPanel($MUI('Info'), this.createPanelInfos(win));
		
		forms.Picture.on('complete', function(){
			button.setIcon(this.Value());
		});
		
		forms.Post_ID.on('change', function(){
			button.setText(this.Current().data.Title);
			button.setSubTitle($MUI('Collection') + ' : ' + this.Current().data.Collection);
			button.setPrice(this.Current().data.Price);
		});
		
		forms.Title.on('keyup', function(){
			button.setText(this.Value());
		});
		
		forms.Price.on('change', function(){
			button.setPrice(this.Value());
		});
		
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyStore.Selection.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('mystore.selection:open', win);
		
		return;
		
		}catch(er){$S.trace(er)}
		
	},
/**
 *
 **/	
	createPanelInfos:function(win){
		//var panel = win.MyStore;	
		var selection = 	win.getData();
		var forms = 	win.createForm();
		var self =		this;
		var panel = 	new Panel();
		//panel.createWidgets({number:2});
		//
		// Titre
		//
		forms.Post_ID = 		new Select({
			parameters:'cmd=mystore.product.list'
		});
		if(selection.Post_ID != 0){
			forms.Post_ID.Value(selection.Post_ID);
		}
		forms.Post_ID.load();
		
		forms.Post_ID.on('change', function(){
			forms.Title.Value(this.Current().data.Collection + ', ' + this.Current().data.Title);
			forms.Price.Value(this.Current().data.Price);
		});
		
		//
		//
		//
		forms.Title = 	new Input({type:'text', value:selection.Title});
		//
		//
		//
		forms.Picture =	new FrameWorker({
			multiple:	false,
			parameters:	'cmd=mystore.selection.import'
		})
		
		forms.Picture.Value(selection.Picture);
		//
		// Prix
		//
		forms.Price = 			new Input({type:'number', value:selection.Price, decimal:2, empty:false});
		
		forms.Price.css('width', 80).css('text-align', 'right');
		
		//
		// Titre
		//
		forms.Order = 	new Input({type:'number', value:selection.Order, decimal:0, empty:false});
		forms.Order.css('width', 50).css('text-align', 'right');
		//
		// Résumé pour le référencement / réseaux sociaux
		//
		forms.Content = 	new TextArea({type:'text', value:selection.Content, maxLength:500});
		
		//
		//
		//
		//panel.appendChild(new Node('h4', $MUI('Informations')));
		
		var table = 		new TableData();
		
		table.addHead($MUI('Produit de référence')).addCel(win.forms.Post_ID).addRow();
		table.addHead($MUI('Titre')).addCel(win.forms.Title).addRow(); 
		table.addHead($MUI('Prix')).addCel(win.forms.Price).addRow(); 
		table.addHead($MUI('Photo')).addCel(win.forms.Picture).addRow();
		table.addHead($MUI('Ordre')).addCel(win.forms.Order).addRow();
		table.addHead($MUI('Description')).addCel(win.forms.Content);
		
		panel.appendChild(table);
				
		return panel;
	},
/**
 * System.MyStore.Selection.submit(win) -> void
 **/	
	submit:function(win){
		var forms = win.createForm();
				
		win.Flag.hide();
			
		if(forms.Post_ID.Value() == '') {
			win.Flag.setText($MUI('Veuillez choisir un produit pour votre selection'));
			win.Flag.show(forms.Post_ID);
			return true;
		}
		
		$S.fire('mystore.selection:open.submit', win);
		
		var selection = win.forms.save(win.getData());
		
		win.MyStore.Progress.show();
		
		selection.commit(function(){
			//System.MyStore.Selection.open(win, selection);
			win.setData(this);
			System.MyStore.Selection.load(win);
		});
		
		return this;
	},
/**
 *
 **/	
	listing:function(){
		
		var win = $WR.getByName('mystore');
		var panel = win.MyStore;
		
		System.MyStore.setCurrent('selection');
		
		var add = new Node('span', {className:'add icon icon-add-element', value:'Add'}, $MUI('Ajouter'));
		
		add.on('click', function(){
			System.MyStore.Selection.open(win);
		});
		
		panel.PanelBody.Header().appendChilds([
			add
		]);
		
		this.load();
		
	},
/**
 *
 **/	
	load:function(op){
		
		var win = $WR.getByName('mystore');
		var panel = win.MyStore;
		panel.Progress.show();
					
		$S.exec('mystore.selection.list', {
			//parameters:'options=' + Object.EncodeJSON({draft:true, Collection:this.NavBar.Collection.Value(), op:op, statistics:true}) + '&clauses=' + this.NavBar.getClauses().toJSON(),
			onComplete:function(result){
				
				try{
					var obj;
					var array = $A(obj = result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				panel.clearBody();
				
				//if(array.length == 0){
					//System.MyStore.Selection.open(win);	
				//}
				
				try{		
					
					for(var i = 0; i < array.length;  i++){
						
						var button =	new System.MyStore.Product.Button({
							icon:		array[i].Picture,
							price:		array[i].Price,
							text:		array[i].Title,
							subTitle:	array[i].Collection == '' ? $MUI('Pas de collection') :  ($MUI('Collection') + ' ' + array[i].Collection)
						});
						
						button.BtnDuplicate.hide();
						button.data = array[i];
						panel.PanelBody.Body().appendChild(button);
						
						button.addClassName('hide');
						
						button.on('click', function(){
							System.MyStore.Selection.open(win, this.data);	
						});
						
						button.BtnRemove.on('click', function(evt){
							evt.stop();
							System.MyStore.Selection.remove(win, this.data);
						}.bind(button));
					}	
					
					panel.PanelBody.refresh();
					
					new Timer(function(){
						var b = panel.PanelBody.select('.market-button.hide')[0];
						if(b){
							
							b.removeClassName('hide');
							b.addClassName('show');
						}
					}, 0.1, array.length).start();
					
										
				}catch(er){$S.trace(er)}
				
				if(panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						panel.ProgressBar.hide();
						panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					panel.ProgressBar.hide();
				}
			}.bind(this)
		});
	},
/**
 * System.MyStore.Selection.remove(win selection) -> void
 *
 * Cette méthode supprime l'instance [[Post]] de la base de données.
 **/
	remove: function(win, selection){
		selection = new System.MyStore.Selection(selection);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer cette selection') + ' ' + selection.Title + ' ? ', $MUI('Selection') + ' : ' +  selection.Title);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = win.createBox();
		box.setTheme('flat liquid black');
		box.a(splite).setIcon('delete').setType().show();
		
		$S.fire('mystore.selection:remove.open', box);
		
		box.reset({icon:'cancel'});
						
		box.submit({
			text:$MUI('Supprimer la selection'),
			icon:'delete',
			click:	function(){
			
				var evt = new StopEvent(box);
				$S.fire('mystore.selection:remove.submit', evt);
				
				if(evt.stopped)	return true;
				
				selection.remove(function(){
					box.hide();
					System.MyStore.Selection.listing();
						
					$S.fire('mystore.selection:remove.submit.complete', evt);
					
					//
					// Splite
					//
					var splite = new SpliteIcon($MUI('La selection a bien été supprimé'));
					splite.setIcon('valid-48');
					
					box.setTheme('flat liquid white');
					box.a(splite).setType('CLOSE').Timer(5).show();
					
				}.bind(this));
				
			}.bind(this)
		});
	}
});