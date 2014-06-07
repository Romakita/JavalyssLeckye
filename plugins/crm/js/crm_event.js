/** section: CRM
 * System.CRM.Event
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : crm_contact.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
 
System.Agenda.Event.prototype.Client_ID = 0;
System.Agenda.Event.prototype.Company = '';

System.CRM.Event = {
/**
 * System.CRM.Event.initialize() -> void
 **/
	initialize:function(){
		System.on('agenda.event:open', this.onOpen.bind(this));
		System.on('agenda.event:draw', this.onDraw.bind(this));
	},
/**
 * System.CRM.Event.onDraw() -> void
 **/	
	onDraw:function(event, html){
		var data = event.getData();
		
		if(data.Client_ID){
			var table = html.select('.table-data')[0];	
			
			table.addHead($MUI('Client') + ' : ').addField(data.Company).addRow();
		}
		
	},
/**
 * System.CRM.Event.onOpen() -> void
 **/
	onOpen:function(win){
		var event = win.getData();
		var forms = win.createForm();
		
		forms.Client_ID = new InputCompleter({
			minChar:	1,
			delay:		0,
			parameters:	'cmd=crm.client.list&options=' + Object.EncodeJSON({op:'-completer'})
		});
		
		forms.Client_ID.Value(event.Client_ID);
		forms.Client_ID.Text(event.Company);
				
		forms.addFilters('Client_ID', function(){			
			return this.Client_ID.Value() == '' ? 0 : this.Client_ID.Value();
		});
				
		forms.Client_ID.on('change', function(){
			
			if(this.Value() == 0 || this.Text() == ''){
				
				this.value = 0;
				
				forms.Contact_ID_2.parentNode.parentNode.hide();
				forms.Contact_ID.parentNode.parentNode.show();
				
					
			}else{
				
				forms.Contact_ID_2.parentNode.parentNode.show();
				forms.Contact_ID.parentNode.parentNode.hide();
				
				var options = {
					op:			'-select',
					Client_ID: 	this.Value(),
					default:	true
				};
				
				forms.Contact_ID_2.setParameters('op=contact.list&options=' + Object.EncodeJSON(options)).load();
			}
			
			forms.Contact_ID_2.Value(0);
			forms.Contact_ID.Value(0);
			forms.Contact_ID.Text('');
			
		});
		//
		//
		//
		var options = {
			op:			'-select',
			default:	true,
			Client_ID: 	event.Client_ID
		};
				
		forms.Contact_ID_2 = new Select({
			parameters:	'op=contact.list&options=' + Object.EncodeJSON(options)	
		});
		
		forms.Contact_ID_2.Value(event.Contact_ID);
		forms.Contact_ID_2.Text(event.Contact);
		
		forms.Contact_ID_2.on('change', function(){
			forms.Contact_ID.Value(this.Value());
			forms.Contact_ID.Text(this.Text());
		});
				
		var tr = forms.Contact_ID.parentNode.parentNode;
		tr.parentNode.insertBefore(
			new Node('tr', [	
				new Node('th', $MUI('Client')),
				new Node('td', forms.Client_ID)
			])
		, tr);
		
		tr.parentNode.insertBefore(
			new Node('tr', [	
				new Node('th', $MUI('Contact')),
				new Node('td', forms.Contact_ID_2)
			])			
		, tr);
		
		if(forms.Client_ID.Value() == 0){
			forms.Contact_ID_2.parentNode.parentNode.hide();
		}else{
			forms.Contact_ID_2.load();
			forms.Contact_ID.parentNode.parentNode.hide();
		}
	},
/**
 * System.CRM.Event.createPanelListing() -> void
 **/	
	createPanelListing:function(win){
		var panel = new Panel();
		
		
		var button = new SimpleButton({nofill:true, icon:'add-element', text:$MUI('Ajouter')});
		button.on('click', function(){
			System.Agenda.Event.open({
				Client_ID: 	win.getData().Client_ID,
				Company:	win.getData().Company
			}, 'window');
		});
		
		panel.appendChild(new Node('h4', [$MUI('Rendez-vous avec le client'), button]));
		
		var table = win.createForm().WidgetEvents =  new SimpleTable({
			range1:			2000,
			range2:			2000,
			range3:			2000,
			parameters:		'cmd=agenda.event.list&options=' + Object.EncodeJSON({Client_ID:win.getData().Client_ID}),
			selectable:		false,
			readOnly:		true,
			empty:			'- ' + $MUI('Aucun évènement d\'enregistré pour ce client') + ' -'
		});
		
		table.addHeader({
			Action:			{title:'', style:'text-align:center', width:40, type:'action'},
			Date_Start:		{title:$MUI('Début'), width:140, style:'text-align:center', type:'date', format:'d/m/Y h\\hi'},
			Date_End:		{title:$MUI('Fin'), width:140, style:'text-align:center', type:'date', format:'d/m/Y h\\hi'},
			Title:			{title:$MUI('Objet'), style:'text-align:center'},
			Statut:			{title:$MUI('Statut'), width:100, style:'text-align:center'}
		});
		
		table.Body().css('height', '490px');
		
		table.addFilters('Title', function(e, cel, data){
			cel.css('text-align', 'left');
			
			return e;
		});
		
		table.addFilters('Statut', function(e, cel, data){
			var statut = System.Agenda.Status(e);
			var box = 	new ColoredBox();
			box.setColor(statut.color);
			box.setStyle('position:absolute; right:4px; top:7px;');
			return new Node('div', {style:'padding-right:30px;position:relative; height:30px; line-height:30px;'}, [$MUI(statut.text), box]);
		});
		
		table.on('open', function(evt, data){
			System.Agenda.Event.open(data, 'window');
		});
		
		table.on('remove', function(evt, data){
			System.Agenda.Event.remove(data, win.createBox());
		});
				
		panel.appendChild(table);
		
		table.load();
		
		return panel;
	}
};

System.CRM.Event.initialize();