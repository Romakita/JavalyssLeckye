/** section: Plugins
 * class AccountAddress
 * Classe d'édition des adresses dans une page BlogPress.
 **/
var AccountAddress = Class.createAjax({
/**
 * AccountAddress#Name -> String
 * Nom de l'utilisateur
 **/
	Address_ID:				0,
/**
 * AccountAddress#User_ID -> String
 * Nom de l'utilisateur
 **/	
	User_ID:				0,
/**
 * AccountAddress#Name -> String
 * Nom de l'utilisateur
 **/
	Name:					"",
/**
 * AccountAddress#FirstName -> String
 * Prenom de l'utilisateur
 **/
	FirstName: 				"",
/**
 * AccountAddress#Address -> String
 * Adresse de l'utilisateur
 **/
	Address:				'',
/**
 * AccountAddress#Address2 -> String
 * Adresse de l'utilisateur
 **/
	Address2:				'',
/**
 * AccountAddress#CP -> String
 * Code postal de l'utilisateur
 **/
	CP:						'',
/**
 * AccountAddress#City -> String
 * Ville de l'utilisateur.
 **/
	City:					'',
/**
 * AccountAddress#Country -> String
 * Pays de l'utilisateur.
 **/
	Country:				'',	
/**
 * AccountAddress#Phone -> String
 * Numéro de téléphone de livraison
 **/
	Phone:					'',
/**
 * AccountAddress#commit(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Enregistre les informations de l'instance en base de données.
 **/	
	commit:function(callback, error){
		
		$S.exec('mystore.account.address.commit',{
			parameters:'MyStoreAccountAddress=' + this.toJSON(),
			onComplete:function(result){
				
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)){
						error.call(this, result.responseText);	
					}
					return;	
				}
				
				if(Object.isFunction(callback)){
					callback.call(this, this);	
				}
			}.bind(this)
		});
		
		return this;
	},
/**
 * AccountAddress#delete(callback) -> void
 * - callback (Function): Fonction appelée après traitement.
 *
 * Supprime les informations de l'instance de la base de données.
 **/	
	remove:function(callback, error){
		
		$S.exec('mystore.account.address.delete',{
			parameters:'MyStoreAccountAddress=' + this.toJSON(),
			onComplete:function(result){
				try{
					this.evalJSON(result.responseText);
				}catch(er){
					if(Object.isFunction(error)){
						error.call(this, result.responseText);	
					}
					return;	
				}
				
				if(Object.isFunction(callback)){
					callback.call(this, this);	
				}
			}.bind(this)
		});
		
		return this;
	}
});

Object.extend(AccountAddress, {
/**
 * AccountAddress.initialize() -> void
 * Cette méthode initialise les événements de la classe et intercept les boutons d'éditions des adresses.
 **/
	initialize: function(){
		
		Extends.after(function(){
			
			$$('.button-add-address').each(function(button){
				
				button.on('click', function(){
					AccountAddress.open();
				});
			});
			
			
			$$('.box-address').each(function(node){
				
				var address = {
					Address_ID:		node.data('id'),
					Name:			node.data('name'),
					FirstName:		node.data('firstname'),
					Address:		node.data('address'),
					Address2:		node.data('address2'),
					City:			node.data('city'),
					CP:				node.data('cp'),
					Country:		node.data('Country'),
					Phone:			node.data('phone')
				};
				
				node.select('.button-edit-address')[0].on('click', function(evt){
					evt.stop();
					AccountAddress.open(address);
					return false;
				});
				
				node.select('.button-remove-address')[0].on('click', function(evt){
					evt.stop();
					AccountAddress.remove(address);
					return false;
				});
				
				node.select('.checkbox-set-default')[0].on('change', function(){
					if(this.Checked()){
						$$('.box-address.selected').invoke('removeClassName', 'selected');
						node.addClassName('selected');
						
						$S.exec('mystore.account.address.default', {
							parameters:'Address_ID=' + address.Address_ID
						});
					}
				});
			});
			
		});
	},
/**
 * AccountAddress.open() -> void
 * Cette méthode ouvre le formulaire d'édition d'une adresse du compte utilisateur.
 **/	
	open:function(address){
		
		var box = System.AlertBox;
		var flag = box.box.createFlag();
		
		box.addClassName('mystore-address');
		
		var forms = box.createForm();
		box.setData(address = new AccountAddress(address));
		//
		//
		//
		forms.Name = new Input({type:'text', value:address.Name, maxLength:40});
		//
		//
		//
		forms.FirstName = new Input({type:'text', value:address.FirstName, maxLength:40});
		//
		//
		//
		forms.Address = new Input({type:'text', value:address.Address, maxLength:200});
		//
		//
		//
		forms.Address2 = new Input({type:'text', value:address.Address2, maxLength:200});
		//
		//
		//
		forms.City = 	new InputCity({value:address.City, maxLength:100});
		//
		//
		//
		forms.CP = 		new InputCP({value:address.CP, maxLength:10});
		forms.CP.linkTo(forms.City);
		//
		//
		//
		forms.Country = 		new InputCompleter({value:address.Country, maxLength:100, button:false});
		forms.Country.setData(Countries.toData());
		//
		//
		//
		forms.Phone = new Input({type:'text', value:address.Phone, maxLength:30});
		//
		//
		//	
		var nodeText1 = 		new Node('p', {className:'mystore-address-info info-1'});
		nodeText1.innerHTML = 	$MUI('Ajouter une nouvelle adresse <span class="word-or">ou</span> modifier votre adresse ci-dessous'); 
		//
		//
		//
		var nodeText2 = new Node('p', {className:'mystore-address-info info-2'});
		nodeText2.innerHTML = $MUI('Veuillez noter que modifier vos adresses ici n\'affectera pas vos commandes en cours') + '.';
		
		var nodeText3 = new Node('p', {className:'mystore-address-info info-3'});
		nodeText3.innerHTML = $MUI('Pour modifier l\'adresse de livraison d\'une commande en cours, rendez-vous sur la page') + ' <a href="' + System.LINK_COMMAND + '">' + $MUI('Mes commandes') +'</a>.';                        
		
		var table = new TableData();
		table.addClassName('table-form form-table');
		
		table.addHead($MUI('Prénom') + ' *').addField(forms.FirstName).addRow();
		table.addHead($MUI('Nom') + ' *').addField(forms.Name).addRow();
		table.addHead($MUI('Adresse') + ' *').addField(forms.Address).addRow();
		table.addHead($MUI('Adresse (ligne 2)')).addField(forms.Address2).addRow();
		table.addHead($MUI('Code postal')+ ' *').addField(forms.CP).addRow();
		table.addHead($MUI('Ville/Localité')+ ' *').addField(forms.City).addRow();
		table.addHead($MUI('Pays')+ ' *').addField(forms.Country).addRow();
		table.addHead($MUI('Téléphone')+ ' *').addField(forms.Phone).addRow();
		
		
		box.a(new Node('h4', $MUI('Renseignez votre nouvelle adresse'))).a(nodeText1).a(table).a(nodeText2).a(nodeText3).setType().show();		
		box.submit({
			text:$MUI('Enregistrer'),
			click:function(){
				try{
				flag.hide();
				
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
				
				box.removeClassName('mystore-address');
				box.wait();
				
				box.createForm().save(address);
				
				address.commit(function(){
					window.location.reload();
				});
				
				}catch(er){alert(er)}
				
				return true;
			}
		});
	},
/**
 * AccountAddress.remove(address) -> void
 * Cette méthode ouvre le formulaire de suppression d'une adresse.
 **/
	remove:function(address){
		var box = System.AlertBox;	
		box.addClassName('mystore-address-remove');
		
		box.setData(address = new AccountAddress(address));
		
		box.a(new Node('h4', $MUI('Voulez-vous vraiment supprimer cette addresse ?'))).setType('Y/N').show();	
		
		box.submit(function(){
			box.removeClassName('mystore-address-remove');
			box.wait();
			
			address.remove(function(){
				window.location.reload();
			});	
						
			return true;
		});
	}
});

AccountAddress.initialize();