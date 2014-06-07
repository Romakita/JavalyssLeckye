/** section: CRM
 * System.CRM.Contact
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : crm_contact.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.CRM.Contact = {
/**
 * System.CRM.Contact.initialize() -> void
 **/
	initialize:function(){
		System.on('contact:open', this.onOpen.bind(this));
		
		System.observe('contact:open.submit.complete', function(){
			
			var win = $WR.getByName('crm.client') || $WR.getByName('crm') ;
			
			if(win){
				win.createForm().WidgetContacts.setParameters('cmd=contact.list&options=' + Object.EncodeJSON({Client_ID:win.getData().Client_ID})).load();
			}
		});
		
		System.observe('contact:remove.submit.complete', function(){
			
			var win = $WR.getByName('crm.client') || $WR.getByName('crm');
			if(win){
				win.createForm().WidgetContacts.setParameters('cmd=contact.list&options=' + Object.EncodeJSON({Client_ID:win.getData().Client_ID})).load();
			}
		});
	},
/**
 * System.CRM.Contact.onOpen() -> void
 **/
	onOpen:function(win){
		
		var forms = win.createForm();
		
		forms.Client_ID = new InputCompleter({
			parameters:	'cmd=crm.client.list&options=' + Object.EncodeJSON({op:'-select'}),
			button:		false
		});
		
		forms.Client_ID.Value(win.getData().Client_ID);
		forms.Client_ID.Text(win.getData().Company);
				
		forms.addFilters('Company', function(){
			return this.Client_ID.Text();
		});
		
		forms.addFilters('Client_ID', function(){
			return this.Client_ID.Value() == '' ? 0 : this.Client_ID.Value();
		});
		
		forms.Company.replaceBy(forms.Client_ID);
		
		if(forms.Client_ID.Value() != 0){
			
			if(win.Panel){	
				var btn = new Node('span', {style:'float:right'}, $MUI('Voir client'));
					
				btn.on('click',function(){
					System.CRM.Client.GetAndOpen(forms.Client_ID.Value(), 'window');
				});
					
				win.Panel.PanelSwip.Header().top(btn);
			}else{
				var btn = new SimpleButton({text:$MUI('Voir client')});
					
				btn.on('click',function(){
					System.CRM.Client.GetAndOpen(forms.Client_ID.Value(), 'window');
				});
				
				win.TabControl.Header().appendChild(btn);
			}
		}
		
		forms.Categories.observe('draw', function(line){
			if(line.getText() == 'CRM'){
				line.hide();	
			}
		});
		
	},
/**
 * System.CRM.Contact.createPanelListing() -> void
 **/	
	createPanelListing:function(win){
		var panel = new Panel();
		
		var button = new SimpleButton({nofill:true, icon:'add-element', text:$MUI('Ajouter')});
		button.on('click', function(){
			System.Contact.open({
				Client_ID: 	win.getData().Client_ID,
				Company:	win.getData().Company
			}, 'window');
		});
		
		panel.appendChild(new Node('h4', [$MUI('Contacts du client'), button]));
		
		var table = win.createForm().WidgetContacts = new SimpleTable({
			parameters:	'cmd=contact.list&options=' + Object.EncodeJSON({Client_ID:win.getData().Client_ID}),
			selectable:	false,
			readOnly:	true
		});
		
		table.addHeader({
			Action:			{title: '', width:100, style:'text-align:center', type:'action'},
			Name:			{title:$MUI('Nom'), style:'text-align:center'},
			FirstName:		{title:$MUI('Prénom'), style:'text-align:center'},
			Service:		{title:$MUI('Service'),width:200, style:'text-align:center', sort:false},
			Phone:			{title:$MUI('Téléphone'), width:200, style:'text-align:center'}
		});
		
		table.Body().css('height', '400px');
		
		table.addFilters('Name', function(e, cel, data){
			cel.colSpan = 2;	
			cel.css('text-align', 'left');
			
			var node = 	new Node('h5', {style:'margin:0px'}, (data.Civility + ' ' + e + ' ' + data.FirstName).trim());
			var p = 	new Node('p', {style:'font-weight:normal; font-size:11px;margin:0; padding:0'}, data.Comment.evalJSON().function);
			
			node.appendChild(p);
					
			return node;
		});
		
		table.addFilters('Action', function(e, cel, data){
			e.remove.css('margin-right', '5px');
			cel.css('text-align', 'left');
			
			var contact = new System.Contact(data);
			
			if(contact.haveMail()){
				var button = new SimpleMenu({icon:'mail', type:'mini'});
				e.appendChild(button);
				
				for(var key in contact.Email){
					var line = new LineElement();
					line.setText($MUI(System.Contact.Labels[key]) + ' : ' + contact.Email[key]);
					
					line.mail = contact.Email[key];
					
					line.on('click', function(evt){
						evt.stop();
						
						if(System.Opener){
							System.Opener.open('mailto', this.mail);
						}else{
							window.location = 'mailto:' + this.mail;
						}
					});
				}
			}
			
			if(contact.havePhoneNumber()){
				var button = new SimpleMenu({icon:'mail', type:'mini'});
				e.appendChild(button);
				
				for(var key in contact.Phone){
					var line = new LineElement();
					line.setText($MUI(System.Contact.Labels[key]) + ' : ' + contact.Phone[key]);
					
					line.phone = contact.Phone[key];
					
					line.on('click', function(evt){
						evt.stop();
						
						if(System.Opener){
							System.Opener.open('tel', this.phone);
						}else{
							window.location = 'tel:' + this.phone;
						}
					});
				}
			}				
			
			var location  = [data.Address, data.City, data.CP, data.Country].without('', ' ').join(', ').trim();
			
			if(location != 'FRANCE'){
				
				if(System.Opener){
					
					var button  = new SimpleButton({icon:'map', type:'mini'});
					button.data = data;
					
					e.appendChild(button);
											
					button.on('click', function(){
						
						System.Opener.open('map', {
							
							title:			this.data.Name + ' ' + this.data.FirstName,
							
							location: {
								Address:	this.data.Address,
								CP:			this.data.CP,
								City:		this.data.City,
								Country:	this.data.Country
							}
						});
						
					});
				}
			}
							
			return e;
		});
		
		table.addFilters('Service', function(e, cel, data){
			return data.Comment.evalJSON().service
		});
		
		table.addFilters('FirstName', function(e, cel){
			cel.hide();
			return '';
		});
		
		table.addFilters('Phone', function(e, cel, data){
			cel.css('text-align', 'left');
			
			var obj = e.evalJSON();
			var node = new Node('div');
			
			for(var key in obj){
				node.appendChild(new Node('p', [
					new Node('strong', $MUI(System.Contact.Labels[key]) + ' : '),
					new Node('span', obj[key])
				]));
			}
			
			return node;
		});
		
		table.on('open', function(evt, data){
			System.Contact.open(data, 'window');
		});
		
		table.on('remove', function(evt, data){
			System.Contact.remove(data, win.createBox());
		});
		
		panel.appendChild(table);
		
		table.load();
		
		return panel;
	}
};

System.CRM.Contact.initialize();