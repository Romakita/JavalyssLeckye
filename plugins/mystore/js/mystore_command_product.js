/** section: Plugins
 * class System.MyStore.Command.Product
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_command_product.js
 * 
 **/
System.MyStore.Command.Product = Class.createAjax({
/**
 * System.MyStore.Command.Product#Detail_ID -> Number
 **/
	Detail_ID: 	0,
/**
 * System.MyStore.Command.Product#Post_ID -> Number
 **/
	Post_ID: 	0,
/**
 * System.MyStore.Command.Product#Command_ID -> Number
 **/
	Command_ID: 0,
/**
 * System.MyStore.Command.Product#Declinaison_ID -> Number
 **/
	Declinaison_ID: 0,
/**
 * System.MyStore.Command.Product#Reference -> String
 * Varchar
 **/
	Reference:	"",
/**
 * System.MyStore.Command.Product#Price -> Number
 * DECIMAL
 **/	
	Price:		0.0,
/**
 * System.MyStore.Command.Product#Qte -> Number
 * DECIMAL
 **/	
	Qte:		0,
/**
 * System.MyStore.Command.Product#Eco_Tax -> Number
 * DECIMAL
 **/	
	Eco_Tax:	0.0,
/**
 * System.MyStore.Command.Product#Cost_Delivery -> Number
 * DECIMAL
 **/	
	Cost_Delivery:	0.0
});

Object.extend(System.MyStore.Command.Product, {
/**
 * System.MyStore.Command.Product.open(win, callback) -> void
 **/	
	open:function(win, callback){
		
		var box = 	win.createBox();
		var forms = box.createForm();
		
		box.a(new Node('h1', 'Gestionnaire d\'ajout de référence'));
		//
		//
		//
		forms.Reference = new Input({type:'text'});
		forms.Reference.Large(true);
		forms.Reference.css('width', '300px');
		
		forms.addFilters('Reference', function(){
			
			forms.Post_ID = forms.Products.Value();
			
			if(forms.Products.Value().Post_ID != 0){
				if(forms.Reference.Value() == ''){
					
					var data = 			new System.MyStore.Product(forms.Products.Value());
					var declinaison = 	forms.Declinaison_ID.getSelectedData();
					
					if(forms.Declinaison_ID.Value() != 0){
						
						if(System.MyStore.StockEnable()){
							forms.Qte.parentNode.next().innerHTML = $MUI('En stock') + ' : ' + declinaison.Value.stock;
						}
						
						return data.Collection + ' ' + data.Title + ' ' + declinaison.Name + (declinaison.Value.code == '' ? ' (Déclinaison: ' + declinaison.Name + ')' :  ' (Ref: ' + declinaison.Value.code + ')');
					}
					
					if(System.MyStore.StockEnable()){
						forms.Qte.parentNode.next().innerHTML = $MUI('En stock') + ' : ' + data.Stock;
					}
					
					return data.Collection + ' ' + data.Title + (data.Product_Code == '' ? '' :  ' (Ref: ' + data.Product_Code + ')'); 	
					
				}
			}
			
			return forms.Reference.Value().trim();
		});
		
		forms.addFilters('Post_ID', function(){
			return forms.Products.Value().Post_ID;
		});
		//
		//
		//
		forms.Price = new Input({type:'number', decimal:2, empty:false, value:0});
		forms.Price.Large(true);
		forms.Price.css('width', 90).css('text-align', 'right');
		//
		//
		//
		forms.Qte = new Input({type:'number', decimal:0, empty:false, value:1});
		forms.Qte.Large(true);
		forms.Qte.css('width', 90).css('text-align', 'right');
		//
		//
		//
		forms.Eco_Tax = new Input({type:'number', decimal:2, empty:false, value:0});
		forms.Eco_Tax.Large(true);
		forms.Eco_Tax.css('width', 90).css('text-align', 'right');
		//
		//
		//
		forms.Cost_Delivery = new Input({type:'number', decimal:2, empty:false, value:0});
		forms.Cost_Delivery.Large(true);
		forms.Cost_Delivery.css('width', 90).css('text-align', 'right');
		
		box.a(new Node('h4', $MUI('Choisissez une référence')));
		//
		//
		//
		forms.Declinaison_ID = new Select();
		forms.Declinaison_ID.Large(true);
		forms.Declinaison_ID.css('width', '300px');
		
		forms.Declinaison_ID.on('draw', function(line){
			line.data.text = 	line.data.Name;
			line.data.value = 	line.data.Critere_ID;
			
			line.setText(line.data.text);
		});
		//
		//
		//
				
		forms.Products = new System.MyStore.Command.Product.ListBox({
			onChange:function(){
				
				forms.Declinaison_ID.parentNode.parentNode.hide();
				forms.Reference.parentNode.parentNode.hide();
				forms.Declinaison_ID.Value(0);
				
				var data = new System.MyStore.Product(forms.Products.Value());
								
				if(data.Post_ID != 0){
					var declinations = data.getDeclinations();
					
					if(declinations.length != 0){
						forms.Declinaison_ID.parentNode.parentNode.show();
						forms.Declinaison_ID.setData($A(declinations));
						forms.Declinaison_ID.selectedIndex(0);
						
						if(System.MyStore.StockEnable()){
							forms.Qte.parentNode.next().innerHTML = $MUI('En stock') + ' : ' + forms.Declinaison_ID.getSelectedData().Value.realStock;
						}
					}else{
						if(System.MyStore.StockEnable()){
							forms.Qte.parentNode.next().innerHTML = $MUI('En stock') + ' : ' + data.Real_Stock;
						}	
					}
									
				}else{
					forms.Reference.parentNode.parentNode.show();	
				}
				
				forms.Price.Value(data.Price);
				forms.Eco_Tax.Value(data.Eco_Tax);
				forms.Cost_Delivery.Value(data.Cost_Delivery);
			}
		});
		
		forms.Products.load();
		
		box.a(forms.Products);
		
		box.a(new Node('h4', $MUI('Facturation')));
		
		box.a(forms.Wrap = new Node('div', {className:'html-node jpanel', style:'padding:0'}));
		
		var table2 = forms.TableReference = new TableData();
		table2.addHead($MUI('Référence') + ' : ', {width:140}).addCel(forms.Reference, {colSpan:2}).addRow();
		table2.addHead($MUI('Déclinaison') + ' : ', {width:140}).addCel(forms.Declinaison_ID, {colSpan:2}).addRow();
		table2.addHead($MUI('PUHT') + ' :').addCel(forms.Price).addCel(' ').addRow();
		table2.addHead($MUI('Qte') + ' :').addCel(forms.Qte, {width:110}).addCel(' ', {style:'font-weight:bold'}).addRow();
		table2.addHead($MUI('Eco. Taxe') + ' :').addCel(forms.Eco_Tax).addCel(' ').addRow();
		table2.addHead($MUI('Coût de livraison') + ' :').addCel(forms.Cost_Delivery).addCel(' ').addRow();
		
		forms.Declinaison_ID.parentNode.parentNode.hide();
		
		box.a(table2);
		
		box.setTheme('flat white').setType().show();
		
		box.submit({
			text:'Ajouter',
			click:function(){
						
				var data = new System.MyStore.Command.Product(forms.save());
									
				if(Object.isFunction(callback)){
					callback.call('', data);				
				}
			}
		});
	}
});
/** section: Plugins
 * class System.MyStore.Command.Product.ListBox
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_command_product.js
 * 
 **/
System.MyStore.Command.Product.ListBox  = Class.createElement('div');
System.MyStore.Command.Product.ListBox.prototype = {
	className:'wobject border listbox-command',
	
	onLoad:		null,
	onComplete:	null,
	onDraw:		null,
/**
 * new System.MyStore.Command.Product.ListBox(options)
 *
 *
 **/	
	initialize:function(options){
		
		Object.extend(this, options || {});
		//
		//
		//
		this.body = 	new Node('div', {className:'wrap-body'})
		//
		//
		//
		this.NavBar = new NavBar({
			range1:			5,
			range2:			5,
			range3:			5
		});
		
		this.NavBar.GroupPaging.addClassName('hide');
		this.NavBar.setMaxLength(0);
		//
		//
		//
		this.InputCompleter =  	new InputButton({icon:'search'});
		this.InputCompleter.Large(true);
		this.InputCompleter.setStyle({float:'right', top:'1px', right:'1px', width:'130px'});
		this.InputCompleter.observe('keyup', this.onKeyUp.bind(this));
		
		this.NavBar.appendChild(this.InputCompleter);
		//
		// Frameworker
		//
		this.appendChild(this.NavBar);
		this.appendChild(this.body);
		
		this.NavBar.on('change', function(){
			this.load();
		}.bind(this));
	},
/**
 * System.MyStore.Command.Product.ListBox#load() -> void
 *
 *
 **/	
	load:function(){
		
		if(Object.isFunction(this.onLoad)){
			this.onLoad.call(this);
		}
		
		this.body.removeChilds();
		
		if(this.ajax && this.ajax.transport){
			if(Object.isFunction(this.ajax.transport.abort)){
				this.ajax.transport.abort();
			}
		}
		
		this.ajax = System.exec('mystore.product.list', {
			parameters:'clauses=' + this.NavBar.getClauses().toJSON() + '&options=' + Object.EncodeJSON({default:$MUI('Référence personnalisée')}),
			onComplete:function(result){
				
				this.ajax = null;
				
				var array = result.responseText.evalJSON();
				var self =	this;
				
				this.NavBar.setMaxLength(array.maxLength);
				
				for(var i = 0; i < array.length; i++){
					
					var button = new System.MyStore.Command.Product.ListBox.Button(array[i]);
					button.data = array[i];
					
					if(i == 0){
						button.Checkbox.Checked(true);
						button.addClassName('selected');
					}
						
					button.Checkbox.on('change', function(evt){
											
						if(Object.isFunction(self.onChange)){
							self.onChange.call(self, evt, this);
						}
						
						self.select('.command-product.selected').invoke('removeClassName', 'selected');
						this.addClassName('selected');
						
					}.bind(button));
					
					this.body.appendChild(button);
					
					if(Object.isFunction(this.onDraw)){
						this.onDraw.call(this, button);
					}
				}
								
				if(Object.isFunction(this.onComplete)){
					
					this.onComplete.call(this);
				}
				
			}.bind(this)
		});
		
	},
/**
 *
 **/	
	onKeyUp: function(evt){
		
		if(this.InputCompleter.getText() == '' && this.NavBar.clauses.where != '') {
			this.NavBar.clauses.where = 	'';
			this.load();
		}else{
			if(this.InputCompleter.getText().length >= 2){
				this.NavBar.clauses.page = 	0;
				this.NavBar.clauses.where = 	this.InputCompleter.getText();			
				this.load();
			}
		}
		
	},
/**
 * System.MyStore.Command.Product.ListBox#Value() -> System.MyStore.Command.Product
 *
 *
 **/	
	Value:function(){
				
		var o = this.body.select('.checked');
		
		if(o.length == 0){
			return '';	
		}
		
		return o[0].parentNode.data;
	}
	
};
/** section: Plugins
 * class System.MyStore.Command.Product.ListBox.Button
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_command_product.js
 * 
 **/
System.MyStore.Command.Product.ListBox.Button = Class.from(AppButton);
System.MyStore.Command.Product.ListBox.Button.prototype = {
	
	className:'wobject market-button command-product-button overable show',
/**
 * new System.MyStore.Product.Button([options])
 **/	
	initialize:function(product){		
		product = new System.MyStore.Product(product);
				
		this.setText(product.Title + ' ' + (product.getColors(0) ? product.getColors(0).Value.name : ''));
		
		var icon = product.getPictures(0);
		
		this.setIcon(icon == '' ? 'mystore-no-picture' : icon);
		
		//
		//
		//
		this.SubText = new Node('span', {className:'wrap-subtitle'});
		this.SubText.innerHTML = product.Collection == '' ? $MUI('Pas de collection') :  ($MUI('Collection') + ' ' + product.Collection);
		//
		//
		//
		this.Price = 	new Node('span', {className:'wrap-price wrap-version'}, product.Price + ' €');
		//
		//
		//
		this.Checkbox = new Checkbox({type:'radio', name:'mystoreproduct'});
						
		this.appendChild(this.SubText);
		this.appendChild(this.Checkbox);
		this.appendChild(this.Price);
		
		this.on('click', function(evt){
			this.Checkbox.Checked(true);
			this.Checkbox.fire('checkbox:change', evt);
		}.bind(this));
		
	},
		
	setSubText:function(title){
		this.setSubText.innerHTML = title;
		return this;
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};