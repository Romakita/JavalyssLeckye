/** section: Plugins
 * class System.MyStore.Address
 *
 * Gère les adresses de livraison et de facturation du client.
 **/
System.MyStore.Address = Class.createAjax({
/**
 * System.MyStore.Address#Name -> String
 * Nom de l'utilisateur
 **/
	Address_ID:			0,
/**
 * System.MyStore.Address#User_ID -> String
 * Nom de l'utilisateur
 **/	
	User_ID:				0,
/**
 * System.MyStore.Address#Name -> String
 * Nom de l'utilisateur
 **/
	Name:					"",
/**
 * System.MyStore.Address#FirstName -> String
 * Prenom de l'utilisateur
 **/
	FirstName: 			"",
/**
 * System.MyStore.Address#Address -> String
 * Adresse de l'utilisateur
 **/
	Address:				'',
/**
 * System.MyStore.Address#Address2 -> String
 * Adresse de l'utilisateur
 **/
	Address2:				'',
/**
 * System.MyStore.Address#CP -> String
 * Code postal de l'utilisateur
 **/
	CP:					'',
/**
 * System.MyStore.Address#City -> String
 * Ville de l'utilisateur.
 **/
	City:					'',
/**
 * System.MyStore.Address#Country -> String
 * Pays de l'utilisateur.
 **/
	Country:				'',	
/**
 * System.MyStore.Address#Phone -> String
 * Numéro de téléphone de livraison
 **/
	Phone:					'',
/**
 * System.MyStore.Address#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/
	commit: function(callback, error){
		
		$S.exec('mystore.account.address.commit', {
			
			parameters: 'MyStoreAccountAddress=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					$S.trace(result.responseText);
					if(Object.isFunction(error)) callback.call(this, result.responseText);
					return;	
				}
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});
	},
/**
 * System.MyStore.Address#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/
	remove: function(callback){
		$S.exec('mystore.account.address.delete',{
			parameters: 'MyStoreAccountAddress=' + this.toJSON(),
			onComplete: function(result){
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});

/** section: Plugins
 * class System.MyStore.AddressNode
 *
 *
 **/
System.MyStore.AddressNode = Class.createElement('div');
System.MyStore.AddressNode.prototype = {
	
	className:	'wobject mystore-address',
/**
 * new System.MyStore.AddressNode(obj)
 *
 **/
	initialize:function(obj){
		
		this.addClassName('html-node border');
				
		this.wrapTitle = 	new Node('h4', {style:'margin-top:2px'});
		this.wrapName = 	new Node('p', {style:'font-weight:bold'});
		this.wrapAddress = 	new Node('p');
		this.wrapActions =	new GroupButton();
		//
		// Actions
 		//
		this.BtnCall = 		new SimpleButton({icon:'phone'});
		this.BtnMap = 		new SimpleButton({icon:'map'});
		this.BtnEdit = 		new SimpleButton({icon:'search-14'});
		
		this.wrapActions.appendChilds([
			this.BtnEdit,
			this.BtnCall,
			this.BtnMap
		]);
		
		this.appendChilds([
			this.wrapTitle,
			this.wrapName,
			this.wrapAddress,
			this.wrapActions
		]);
				
		this.setData(obj);
		
		this.BtnEdit.on('click', this.open.bind(this));
		this.BtnCall.on('click', function(){
			if(this.data.Phone != ''){
				System.Opener.open('tel', this.data.Phone);
			}
		}.bind(this));
		
		this.BtnMap.on('click', function(){
			System.Opener.open('map', {
				
				title:			this.data.Name + ' ' + this.data.FirstName,
				
				location: {
					Address:	this.data.Address,
					CP:			this.data.CP,
					City:		this.data.City,
					Country:	this.data.Country
				}
			});
		}.bind(this));
		
	},
/**
 * System.MyStore.AddressNode.open() -> void
 *
 * Cette méthode ouvre la boite de dialogue permettant d'éditer une adresse d'un compte utilisateur.
 **/	
	open:function(){
		
		var box = System.AlertBox;
		var forms = box.createForm();
		
		box.a(new Node('h1', $MUI('Edition de l\'' + this.wrapTitle.innerHTML.toLowerCase())));
		
		box.a(new Node('h4', $MUI('Choisissez une addresse')));
		
		// 
		//
		//
		forms.Address_ID = new Select({
			parameters:'cmd=mystore.account.address.list&options=' + Object.EncodeJSON({User_ID:this.User_ID, default:'- '+ $MUI('Créer une nouvelle adresse') +' -'})
		});
		forms.Address_ID.css('width', '99%');
		forms.Address_ID.Large(true);
		forms.Address_ID.on('draw', function(line){
			line.data.text = 	Object.isUndefined(line.data.text) ? 
								(line.data.Address_ID + '. ' + line.data.Name + ' ' + line.data.FirstName + ' - ' +  line.data.Address + ' ' + line.data.Address2 + ' ' + line.data.CP +' ' + line.data.City + ' ' + line.data.Country) 
								: line.data.text;
								
			line.data.value = 	Object.isUndefined(line.data.value) ? line.data.Address_ID : line.data.value;
			
			line.setText(line.data.text);
		});
		forms.Address_ID.Value(this.data.Address_ID);
		forms.Address_ID.load();
		
		forms.Address_ID.on('change', function(){
			var data = this.getSelectedData();
			
			forms.Address.Value(data.Address);
			forms.Address2.Value(data.Address2);
			forms.City.Text(data.City);
			forms.Country.Text(data.Country);
			forms.CP.Text(data.CP);
			forms.FirstName.Value(data.FirstName);
			forms.Name.Value(data.Name);
			forms.Phone.Value(data.Phone);
		});
		
		
		var table = 	new TableData();
		table.css('width', '99%');
		table.addHead($MUI('Choisissez'), {style:'width:130px'}).addCel(forms.Address_ID).addCel(' ').addRow();
		
		box.a(table);
		
		box.a(new Node('h4', $MUI('Détails de l\'adresse')));
		//
		// Name
		//
		forms.Name = new Input({type:'text', value:this.data.Name, maxLength:40});
		forms.Name.Large(true);
		forms.Name.css('width', '98%');
		//
		// FirstName
		//
		forms.FirstName = new Input({type:'text', value:this.data.FirstName, maxLength:40});
		forms.FirstName.Large(true);
		forms.FirstName.css('width', '98%');
		//
		// Addresse
		//
		forms.Address = new Input({type:'text', value:this.data.Address, maxLength:200});
		forms.Address.Large(true);
		forms.Address.css('width', '98%');
		//
		// Addresse2
		//
		forms.Address2 = new Input({type:'text', value:this.data.Address2, maxLength:200});
		forms.Address2.Large(true);
		forms.Address2.css('width', '98%');
		//
		// CP
		//
		forms.CP = new InputCP({maxLength:10, button:false});
		forms.CP.Value(this.data.CP);
		forms.CP.Large(true);
		forms.CP.css('width', '80px');
		//
		// City
		//
		forms.City = new InputCity({maxLength:100, button:false});
		forms.City.Value(this.data.City);
		forms.City.Large(true);
		forms.City.linkTo(forms.CP);
		forms.City.css('width', '99%');
		//
		// City
		//
		forms.Country = new InputCompleter({maxLength:100, button:false});
		forms.Country.css('width', '99%');
		forms.Country.Text(this.data.Country);
		forms.Country.Large(true);
		forms.Country.setData(Countries.toData());
		//
		// Phone
		//
		forms.Phone = 	new InputButton({type:'text', maxLength: 30, sync:true, icon:'phone', value:this.data.Phone});
		forms.Phone.Large(true);
		forms.Phone.css('width', '99%');
		forms.Phone.SimpleButton.on('click', function(){
			if(forms.Phone.Text() == '') return;
			System.Opener.open('tel', win.forms.Phone.Text());
		});
		
		var table = 	new TableData();
		table.css('width', '99%');
		table.addHead($MUI('Nom'), {style:'width:130px'}).addCel(forms.Name).addCel(' ').addRow();
		table.addHead($MUI('Prénom')).addCel(forms.FirstName).addRow();
		table.addHead($MUI('Adresse')).addCel(forms.Address).addRow();
		table.addHead($MUI(' ')).addCel(forms.Address2).addRow();
		table.addHead($MUI('CP')).addCel(forms.CP).addRow();
		table.addHead($MUI('Ville/Localité')).addCel(forms.City).addRow();
		table.addHead($MUI('Pays')).addCel(forms.Country).addRow();
		table.addHead($MUI('Téléphone')).addCel(forms.Phone);
		
		box.a(table);
		
		box.setTheme('flat liquid white');
		box.setType().show();	
			
		box.submit({
			text:$MUI('Enregistrer'),
			click:function(){
				return this.submit(box);
			}.bind(this)
		});		
	},
/**
 * System.MyStore.AddressNode#submit(t) -> System.MyStore.AddressNode 
 *
 **/	
	submit:function(box){
		
		var forms = box.createForm();
		
		if(forms.FirstName.Value() == ''){
			forms.FirstName.focus();
			flag.setText($MUI('Veuillez saisir un prénom pour votre adresse de livraison')).setType(Flag.RIGHT).show(forms.FirstName, true);
			return true;
		}
		
		if(forms.Name.Value() == ''){
			forms.Name.focus();
			flag.setText($MUI('Veuillez saisir un nom pour votre adresse de livraison')).setType(Flag.RIGHT).show(forms.Name, true);
			return true;
		}
		
		if(forms.Address.Value() == ''){
			forms.Address.focus();
			flag.setText($MUI('Veuillez saisir une adresse de livraison')).setType(Flag.RIGHT).show(forms.Address, true);
			return true;
		}
		
		if(forms.City.Text() == ''){
			forms.City.focus();
			flag.setText($MUI('Veuillez saisir une ville pour votre adresse de livraison')).setType(Flag.RIGHT).show(forms.City, true);
			return true;
		}
		
		if(forms.CP.Text() == ''){
			forms.CP.focus();
			flag.setText($MUI('Veuillez saisir un code postal pour votre adresse de livraison')).setType(Flag.RIGHT).show(forms.CP, true);
			return true;
		}
		
		if(forms.Country.Text() == ''){
			forms.Country.focus();
			flag.setText($MUI('Veuillez saisir un pays pour votre adresse de livraison')).setType(Flag.RIGHT).show(forms.Country, true);
			return true;
		}
		
		if(forms.Phone.Value() == ''){
			forms.Phone.focus();
			flag.setText($MUI('Veuillez saisir un numéro de téléphone pour votre adresse de livraison')).setType(Flag.RIGHT).show(forms.Phone, true);
			return true;
		}
		
		var data = new System.MyStore.Address(forms.save());
		data.User_ID = this.User_ID;
				
		this.setData(data);
		
		data.commit(function(){
			this.setData(data);
		}.bind(this));
		
	},
/**
 * System.MyStore.AddressNode#setTitle(t) -> System.MyStore.AddressNode 
 *
 **/	
	setTitle: function(t){
		this.wrapTitle.innerHTML = t;
		return this;
	},
/**
 * System.MyStore.AddressNode#setData(obj) -> System.MyStore.AddressNode 
 *
 **/	
	setData:function(obj){
		
		this.data = new System.MyStore.Address(obj);
		
		this.wrapName.innerHTML = 		this.data.Name + ' ' + this.data.FirstName;
		this.wrapAddress.innerHTML = 	'';
		
		if((this.data.Address + this.data.Address2).trim() != ''){
			this.wrapAddress.innerHTML += (this.data.Address + ' ' + this.data.Address2).trim() + '<br />';
		}
		
		if((this.data.CP + this.data.City).trim() != ''){
			this.wrapAddress.innerHTML += (this.data.CP + ' ' + this.data.City + ' ' + this.data.Country).trim() + '<br />';
		}
		
		if((this.data.Phone).trim() != ''){
			this.wrapAddress.innerHTML += $MUI('N° Tel') + ' : ' + System.MyStore.formatPhone(this.data.Phone);
		}
		
		return this;
	},
/**
 * System.MyStore.AddressNode#getData() -> System.MyStore.Address
 *
 **/	
	getData:function(){
		return this.data;
	},
	
	setUserID:function(id){
		this.User_ID = id;
	},
/**
 * System.MyStore.AddressNode#Value([obj]) -> Object
 *
 **/	
	Value:function(obj){
		if(!Object.isUndefined(obj)){
			this.setData(obj);
		}
		var obj = {};
		var o = this.getData();
		
		for(var key in o){
			if(Object.isFunction(o[key])) continue;
			obj[key] = o[key];
		}
		
		return obj;
	}
	
};
