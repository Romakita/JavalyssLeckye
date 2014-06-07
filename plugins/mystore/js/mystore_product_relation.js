/** section: MyStore
 * class System.MyStore.Product.Relation
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_product_relation.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyStore.Product.Relation = {
	initialize:function(){
		
	},
	
	open:function(win, product){
		
		var box = win.createBox();
		box.hide();
		
		box.a(new Node('h1', $MUI('Relation entres les produits du catalogue')));
		
		var preview =  new System.MyStore.Product.Button({
			icon:		product.getPictures(0),
			price:		product.Price,
			text:		product.Title + ' ' + (product.getColors(0) ? product.getColors(0).Value.name : ''),
			subTitle:	product.Collection == '' ? $MUI('Pas de collection') :  ($MUI('Collection') + ' ' + product.Collection),
			overable: 	false
		});
		
		preview.css('width', '439px');
		preview.BtnDuplicate.hide();
		preview.BtnRemove.hide();
		preview.addClassName('show');
		
		box.a(new Node('h4', $MUI('Produit maitre')));
		box.a(preview);
		
		var forms = box.forms = {
			Removed:[]
		};
		//
		//
		//
		forms.Related_ID = new Node('div', {className:'area-input jpanel', style:'height:350px;overflow:auto'});
		//
		//
		//
		forms.wrapResult = new Node('div', {className:'area-input jpanel', style:'height:319px;overflow:auto'});
		//
		//
		//
		forms.search = new InputCompleter({
			button:		false,
			parameters:	'cmd=mystore.product.relation.list&options=' + Object.EncodeJSON({Post_ID:product.Post_ID, op:'-not', draft:true})
		});
		
		forms.search.css('width', '99.5%').css('margin-bottom', '3px');
		
		forms.search.Input.placeholder = $MUI('Saisissez un produit à rechercher');
		forms.search.Large(true);
		
		forms.search.on('draw', function(line){
			this.Hidden(true);
		});
		
		forms.search.on('complete', function(array){
			System.MyStore.Product.Relation.onSearchComplete(product, forms, array);
		});
		
		var widgets = new WidgetContainer({number:2});
				
		widgets.css('width', 900);
		widgets[0].css('height', '400px');
		widgets[1].css('height', '400px');
		
		
		widgets[0].a(new Node('h4', $MUI('Produits liées')));
		widgets[0].a(forms.Related_ID);
		
		widgets[1].a(new Node('h4', $MUI('Produits non liées')));
		widgets[1].a(forms.search);
		widgets[1].a(forms.wrapResult);
		
		box.a(widgets);
		
		box.setTheme('flat white');
		box.setType().show();
		
		
		box.submit({
			text:$MUI('Enregistrer'),
			click:function(){
				return System.MyStore.Product.Relation.submit(product, box);
			}
		});
		
		box.reset({
			click:function(){
				box.setTheme();
			}
		});
		
		this.load(product, forms);
	},
/**
 *
 **/	
	submit:function(product, box){
		box.setTheme();
		
		var forms = box.forms;
		
		try{
			
		if(forms.Removed.length){
			
			box.wait();
			
			System.exec('mystore.product.relation.delete', {
				parameters:'Post_ID=' + product.Post_ID + '&options=' + Object.EncodeJSON(forms.Removed),
				onComplete:function(){
					
					System.MyStore.Product.Relation.commitRelation(product, box);
					
				}
			});
			
		}else{
			
			System.MyStore.Product.Relation.commitRelation(product, box);
		}
		
		}catch(er){
			$S.trace(er);
		}
		
		return true;
	},
/**
 *
 **/	
	commitRelation:function(product, box){
		var forms = box.forms;
		var list = [];
			
		forms.Related_ID.select('.store-button.add').each(function(node){
			list.push(node.data.Post_ID);
		});
		
		if(list.length){
			box.wait();
			
			System.exec('mystore.product.relation.commit', {
				parameters:'Post_ID=' + product.Post_ID + '&options=' + Object.EncodeJSON(list),
				onComplete:function(result){
					System.MyStore.Product.Relation.onCompleteSubmit(product,box);
					
				}
			});
		}else{
			System.MyStore.Product.Relation.onCompleteSubmit(product,box);
		}
	},
	
	onCompleteSubmit:function(product, box){
		box.hide();
		
		var splite = new SpliteIcon($MUI('Les relations entres produits ont bien été sauvegardé'));
		splite.setIcon('filesave-ok-48');
		
		box.setTitle($MUI('Confirmation'));
		box.a(splite).setType('CLOSE').Timer(5);
		box.show();
	},
/**
 *
 **/	
	load:function(p, forms){
		
		forms.Related_ID.addClassName('icon-loading-gif');
		
		System.exec('mystore.product.relation.list',{
			parameters:'options=' + Object.EncodeJSON({Post_ID:p.Post_ID, draft:true}),
			onComplete:function(result){
				
				forms.Related_ID.removeClassName('icon-loading-gif');
				
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				
				for(var i = 0; i < array.length; i++){
			
					var product = new System.MyStore.Product(array[i]);
					
					var button = new System.MyStore.Product.Button({
						icon:		product.getPictures(0),
						price:		product.Price,
						text:		product.Title + ' ' + (product.getColors(0) ? product.getColors(0).Value.name : ''),
						subTitle:	product.Collection == '' ? $MUI('Pas de collection') :  ($MUI('Collection') + ' ' + product.Collection),
						overable: 	false
					});
					
					button.data = product;
					
					button.BtnDuplicate.hide();
					button.addClassName('show');
					button.BtnRemove.setIcon('remove-element');
					
					button.on('click', function(){
						this.parentNode.removeChild(this);
						
						forms.Removed.push(this.data.Post_ID);
					
						System.MyStore.Product.Relation.setParameters(p, forms);
						forms.search.search();
						
					});
					
					button.css('width', '400px');
					
					forms.Related_ID.appendChild(button);
				}
			}
		});
	},
/**
 *
 **/	
	onSearchComplete:function(p, forms, array){
		
		try{
			
		forms.wrapResult.removeChilds();
		
		for(var i = 0; i < array.length; i++){
			
			var product = new System.MyStore.Product(array[i]);
			
			var button = new System.MyStore.Product.Button({
				icon:		product.getPictures(0),
				price:		product.Price,
				text:		product.Title + ' ' + (product.getColors(0) ? product.getColors(0).Value.name : ''),
				subTitle:	product.Collection == '' ? $MUI('Pas de collection') :  ($MUI('Collection') + ' ' + product.Collection),
				overable: 	false
			});
			
			button.data = product;
			
			button.BtnDuplicate.hide();
			button.addClassName('show');
			button.BtnRemove.setIcon('add-element');
			
			button.on('click', function(){
				forms.Related_ID.a(this);
				
				this.stopObserving('click');
				this.BtnRemove.setIcon('remove-element');
				this.addClassName('add');
				
				System.MyStore.Product.Relation.setParameters(p, forms);
				
				this.on('click', function(){
					this.parentNode.removeChild(this);
					
					if(!this.hasClassName('add')){
						forms.Removed.push(this.data.Post_ID);	
					}
					
					System.MyStore.Product.Relation.setParameters(p, forms);
					forms.search.search();
					
				});
			});
			
			button.css('width', '400px');
			
			forms.wrapResult.appendChild(button);
		}
		
		}catch(er){alert(er)}
			
	},
	
	setParameters:function(product, forms){
		var list = [];
				
		forms.Related_ID.select('.store-button').each(function(node){
			list.push(node.data.Post_ID);
		});
		
		forms.search.setParameters('cmd=mystore.product.relation.list&options=' + Object.EncodeJSON({Post_ID:product.Post_ID, exclude:list, op:'-not', draft:true}));
	}
};
System.MyStore.Product.Relation.initialize();