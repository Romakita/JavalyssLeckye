/** section: AppsMe
 * System.AppsMe.Setting
 *
 * Gestion des préférences d'AppsMe.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : appsme.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.AppsMe.Setting = {
/**
 * AppsMe.openPreferences(win) -> void
 **/
	open: function(){
		
		var win = 		$WR.getByName('appsme');
		var panel = 	win.AppsMe;
		var forms = 	win.createForm();
		
		System.AppsMe.setCurrent('setting');
		panel.Open(true, 600);
		
		panel.PanelSwip.addPanel($MUI('Paramètres'), this.createPanel(win));
		panel.PanelSwip.addPanel($MUI('Catégories'), this.createPanelCategories(win));
		
				
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.MyStore.Setting.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('appsme.setting:open', win);
		
		return;	
	},
	
	submit:function(win){
		var form = win.createForm();
		
		var options = {
			Broadcast_Update_Apps: 	form.Broadcast_Update_Apps.Value() ? 1 : 0,
			Beta:					form.Beta.Value() ? 1 : 0,
			Enable_Incidents:		form.Enable_Incidents.Value() ? 1 : 0,
			Enable_Anonymous:		form.Enable_Anonymous.Value() ? 1 : 0,
			Enable_API_KEY:			form.Enable_API_KEY.Value() && form.Table_API_KEY.Value() != '' && form.Field_API_KEY.Value() != '' && form.Field_Enable_API_KEY.Value() != '' ? 1 : 0,
			Table_API_KEY:			encodeURIComponent(form.Table_API_KEY.Value()),
			Field_API_KEY:			encodeURIComponent(form.Field_API_KEY.Value()),
			Field_Enable_API_KEY:	encodeURIComponent(form.Field_Enable_API_KEY.Value())
		};
		
		form.Enable_API_KEY.Value(options.Enable_API_KEY);
		
		$S.Meta('AppsMe_Options', options); 
				
		win.AppsMe.progess.show();
		
		var array = [];
		
		widget.Table.getData().each(function(data){
			data.Title = encodeURIComponent(data.Title.Value());
			array.push(data);
		});
		
		$S.exec('appcategory.list.commit',{
			parameters:'Categories=' + escape(Object.toJSON(array)),
			onComplete:function(){
				win.AppsMe.progess.hide();
				widget.load();
			}
		});
	},
	
	createPanel:function(win){
		var panel = 	new Panel();
		var form = 		win.createForm();
		var options = 	$S.AppsMe.getMeta();
		
		//
		//
		//
		form.Beta = 		new ToggleButton();
		form.Beta.Value(options.Beta == 1 ? true : false);
		//
		//
		//
		form.Broadcast_Update_Apps = 	new ToggleButton();
		form.Broadcast_Update_Apps.Value(options.Broadcast_Update_Apps == 1 ? true : false);
		//
		//
		//
		form.Enable_Incidents = 	new ToggleButton();
		form.Enable_Incidents.Value(options.Enable_Incidents == 1 ? true : false);
		//
		//
		//
		form.Enable_Anonymous = 	new ToggleButton();
		form.Enable_Anonymous.Value(options.Enable_Anonymous == 1 ? true : false);
		//
		//
		//
		form.Enable_API_KEY = 	new ToggleButton();
		form.Enable_API_KEY.Value(options.Enable_API_KEY == 1 ? true : false);
		
		form.Table_API_KEY = 	new Input({type:'text', maxLength:100});
		form.Table_API_KEY.Value(options.Table_API_KEY || '');
		form.Table_API_KEY.Large(true);
		form.Table_API_KEY.css('width', '98%');
		
		form.Field_API_KEY = 	new Input({type:'text', maxLength:100});
		form.Field_API_KEY.Value(options.Field_API_KEY || 'Api_Key');
		form.Field_API_KEY.Large(true);
		form.Field_API_KEY.css('width', '98%');
		
		form.Field_Enable_API_KEY = 	new Input({type:'text', maxLength:100});
		form.Field_Enable_API_KEY.Value(options.Field_API_KEY || 'Enable');
		form.Field_Enable_API_KEY.Large(true);
		form.Field_Enable_API_KEY.css('width', '98%');
		//
		//
		//
		//var widget = 		this.createWidgetCategories(win);
		//var widgetTypes = 	this.createWidgetTypes(win);
		
		var table = new TableData();
		table.addClassName('liquid');
		
		panel.appendChild(new Node('h4', $MUI('Générales')));
		
		table.addHead($MUI('Broadcast the update apps') + ' ?', {style:'width:330px'}).addCel(form.Broadcast_Update_Apps).addRow();
		table.addHead($MUI('Enable Beta channel') + ' ?').addCel(form.Beta).addRow();
		//table.addHead($MUI('Enable Incident Management') + ' ?').addCel(form.Enable_Incidents).addRow();
		table.addHead($MUI('Anonymous users can post an opinion') + ' ?', {style:'line-height:25px'}).addCel(form.Enable_Anonymous).addRow();
		
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Authentification API')));
		
		var table = new TableData();
		table.addClassName('liquid');
		table.addHead($MUI('Authenticate connections from a manager API key') + ' ?', {style:'line-height:25px;width:330px'}).addCel(form.Enable_API_KEY).addRow();
		
		panel.appendChild(table);
		
		var table = new TableData();
		table.addHead($MUI('Name of the table manager keys'), {style:'line-height:25px'}).addCel(form.Table_API_KEY).addRow();
		table.addHead($MUI('Field name api key')).addCel(form.Field_API_KEY).addRow();
		table.addHead($MUI('Field name activation api key'), {style:'line-height:25px'}).addCel(form.Field_Enable_API_KEY).addRow();
		
		panel.appendChild(table);
				
		win.Flag.add(form.Broadcast_Update_Apps,{
			text:$MUI('Cette option permet de diffuser les mises à jour de façon des applications sur le réseau. Si l\'option est positionner sur Non, seule les mises à jour des extensions seront diffusées sur le réseaux.'),
			color:'grey'
		});
		
		win.Flag.add(form.Beta,{
			text:$MUI('Cette option active la diffusion des applications en version Beta sur le réseau.'),
			color:'grey'
		});
		
		win.Flag.add(form.Enable_Incidents,{
			text:$MUI('Cette option active la gestion des incidents.'),
			color:'grey'
		});
		
		win.Flag.add(form.Enable_API_KEY,{
			text:$MUI('Cette option permet de restreindre l\'accès au dépôt. Les clients ne pourront se connecter que si il possède une clef d\'authentification mise à disposition par un gestionnaire de clef.'),
			color:'grey'
		});
		
		win.Flag.add(form.Table_API_KEY,{
			text:$MUI('Indiquez le nom de la table SQL stockant les clefs.'),
			color:'grey'
		});
		
		win.Flag.add(form.Field_API_KEY,{
			text:$MUI('Indiquez le nom du champ SQL stockant les clefs'),
			color:'grey'
		});
		
		win.Flag.add(form.Field_Enable_API_KEY,{
			text:$MUI('Indiquez le nom du champ SQL indiquant l\'état d\'activation d\'une clef.'),
			color:'grey'
		});
		
						
		if(!form.Enable_API_KEY.Value()){
			form.Table_API_KEY.parentNode.parentNode.hide();
			form.Field_API_KEY.parentNode.parentNode.hide();
			form.Field_Enable_API_KEY.parentNode.parentNode.hide();
		}
		
		form.Enable_API_KEY.on('change', function(){
			if(!this.Value()){
				form.Table_API_KEY.parentNode.parentNode.hide();
				form.Field_API_KEY.parentNode.parentNode.hide();
				form.Field_Enable_API_KEY.parentNode.parentNode.hide();
			}else{
				form.Table_API_KEY.parentNode.parentNode.show();
				form.Field_API_KEY.parentNode.parentNode.show();
				form.Field_Enable_API_KEY.parentNode.parentNode.show();
			}
		});
		
		return panel;
		
	},
	
	createPanelCategories:function(win){
		var panel = 	new Panel();
		var form = 		win.createForm();
		var options = 	$S.AppsMe.getMeta();
		//
		//
		//
		var widget = 		this.createWidgetCategories(win);
		var widgetTypes = 	this.createWidgetTypes(win);
		
		panel.appendChild(new Node('H4', $MUI('List of types of applications')));
		panel.appendChild(widgetTypes);
		
		panel.appendChild(new Node('H4', $MUI('List of categories')));
		panel.appendChild(widget);
		
		widget.load();
				
		return panel;
		
	},
	
	createWidgetCategories:function(win){
		
		var widget = new WidgetTable({
			parameters:	'cmd=appcategory.list&options=' + Object.EncodeJSON({exclude:0, empty:true}),
			readOnly:	true,
			search:		false,
			completer:	false,
			overable:	false
		});
		widget.BorderRadius(false);
		widget.DropMenu.css('display','none');
		widget.Body().css('height', '300px');
		widget.Table.Header().hide();
		
		widget.addHeader({
			'Category_ID': 	{title: $MUI('N°'), style:'text-align:right', width:20},
			'Title': 		{title: $MUI('Title')}
		});
		
		widget.addFilters('Title', function(e, cel, data){
			if(data.Category_ID == 0){
				cel.parentNode.hide();	
			}
			
			var input = new Input({type:'text', value:e});
			input.Large(true);
			input.css('margin', '2px').css('width', '98%');
			
			data.Title = input;
			
			return input;
		});
		
		return widget;	
	},
	
	createWidgetTypes:function(win){
				
		var data = System.Meta('APPSME_TYPES') || [
			{id:1, value:'app', text:'app', readOnly:true},
			{id:2, value:'plugin', text:'plugin', readOnly:true},
			{id:3, value:'', text:'', readOnly:true},
			{id:4, value:'', text:'', readOnly:true},
			{id:5, value:'', text:'', readOnly:true}
		];
		
		var widget = new WidgetTable({
			readOnly:	true,
			search:		false,
			completer:	false,
			overable:	false
		});
		widget.BorderRadius(false);
		widget.DropMenu.css('display','none');
		widget.Body().css('height', '250px');
		widget.Table.Header().hide();
		
		widget.addHeader({
			'id': 		{title: $MUI('N°'), style:'text-align:right', width:20},
			'text': 	{title: $MUI('Title')}
		});
		
		widget.addFilters('text', function(e, cel, data){
			if(data.Category_ID == 0){
				cel.parentNode.hide();	
			}
			
			var input = new Input({type:'text', value:e});
			input.Large(true);
			input.css('margin', '2px').css('width', '98%');
			input.readOnly = data.readOnly
			data.Title = input;
			
			return input;
		});
		
		widget.addRows(data);
		
		return widget;	
	}
};