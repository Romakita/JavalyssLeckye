/** section: Agenda
 * System.Agenda.Setting
 **/
System.Agenda.Setting = {
/**
 * new System.BlogPress.Setting()
 **/
	initialize: function(){
		$S.observe('system:open.settings', function(win){			
			win.TabControl.addPanel($MUI('Agenda'), System.Agenda.Setting.createPanel(win)).setIcon('agenda');
		});
		
		$S.observe('user:open.preferences', this.onOpenUser.bind(this));
		
		System.observe('system:startinterface', function(){
			if($U().getRight() <= 2){
				$S.observe('user:open', this.onOpenUser.bind(this));
				$S.observe('user:open.submit', function(){
					//System.Agenda.Setting.submit($WR.getByName('user.form'));	
				});
			}
		}.bind(this));
	},
/**
 *
 **/
	onOpenUser:function(win){
		win.createForm().exclude("AGENDA_RECALL_EVENT");
		win.createForm().exclude("AGENDA_GROUPS");
		win.createForm().exclude("AGENDA_USERS");
		win.createForm().exclude("AGENDA_USERS_EVT_ADD");
		win.createForm().exclude("AGENDA_USERS_EVT_EDIT");
		
		win.TabControl.addPanel($MUI('Agenda'), System.Agenda.Setting.createPanelUser(win)).setIcon('agenda');
	},
/**
 *
 **/	
	createPanel:function(win){
		var panel = new Panel({style:'width:500px; height:500px'});
		
		var splite = new SpliteIcon($MUI('Configuration de l\'agenda'), $MUI('Note : Les modifications sont automatiquements enregistrées.'));
		splite.setIcon('agenda-48');
		panel.appendChild(splite);
		
		var formStatut = {};
		formStatut.Table = new TableData();
		formStatut.Table.addHead($MUI('Intitulé'),{style:'font-weight:bold; text-align:center; padding:5px; color:#333'}).addHead($MUI('Couleur'),{style:'font-weight:bold; text-align:center; padding:5px; color:#333'}).addRow();
		
		formStatut.Statuts = [];
		
		var statuts = System.Agenda.Status();
		
		formStatut.Add = new SimpleButton({nofill:true, icon:'add-element', text:$MUI('Créer un statut')});
		
		formStatut.Add.on('click', function(){
			var obj = {
				color:	new InputColor(),
				text:	new Input({type:'text'}),
				value:	'',
				remove:	new SimpleButton({icon:'system-remove', nofill:true}),
				removed:false
			};
			
			obj.color.css('width', 150);
			formStatut.Table.addCel(obj.text).addCel(obj.color).addCel(obj.remove, {width:20}).addRow();
			
			obj.color.on('change', function(){
				System.Agenda.Setting.saveStatus(win, formStatut);
			});
			
			obj.text.on('change', function(){
				System.Agenda.Setting.saveStatus(win, formStatut);
			});
			
			obj.remove.on('click', function(){
				this.removed = true;
				this.text.parentNode.parentNode.parentNode.removeChild(this.text.parentNode.parentNode);
				
				System.Agenda.Setting.saveStatus(win, formStatut);
			}.bind(obj));
			
			formStatut.Statuts.push(obj);
		});
		
		panel.appendChild(new Node('h4', [$MUI('Gestion des statuts des événements'), formStatut.Add]));
		
		for(var i = 0; i < statuts.length; i++){
			
			var obj = {
				color:	new InputColor({value:statuts[i].color}),
				text:	new Input({type:'text', value:statuts[i].text}),
				value:	statuts[i].value,
				remove:	new SimpleButton({icon:'system-remove', nofill:true}),
				removed:false
			};
			
			obj.color.css('width', 150);
			formStatut.Table.addCel(obj.text).addCel(obj.color).addCel(obj.remove, {width:20}).addRow();
			
			obj.color.on('change', function(){
				System.Agenda.Setting.saveStatus(win, formStatut);
			});
			
			obj.text.on('change', function(){
				System.Agenda.Setting.saveStatus(win, formStatut);
			});
			
			obj.remove.on('click', function(){
				this.removed = true;
				this.text.parentNode.parentNode.parentNode.removeChild(this.text.parentNode.parentNode);
				
				System.Agenda.Setting.saveStatus(win, formStatut);
			}.bind(obj));
			
			if(i < 4){
				obj.text.readOnly = true;
				obj.text.toMagic(true);
				obj.remove.hide();	
			}
			
			formStatut.Statuts.push(obj);
		}
		panel.appendChild(formStatut.Table);
		
		return panel;
	},
	
	saveStatus:function(win, forms){
		var a = [];
				
		forms.Statuts.each(function(obj){
			
			if(!obj.removed){
				
				var o = {
					color:	obj.color.Value(),
					text:	obj.text.Value(),
					value:	obj.value
				};
				
				if(obj.value == ''){
					o.value = o.text.sanitize('-').toLowerCase();
				}
				
				a.push(o);
			}
			
		});
		
		$S.Meta('AGENDA_STATUS', a);
	},
/**
 *
 **/	
	createPanelUser:function(win){
		try{
		
		var panel = new Panel({style:'width:500px; height:500px'});
		
		var splite = new SpliteIcon($MUI('Gestion de l\'agenda partagé'));
		splite.setIcon('agenda-48');
		
		var user = win.getData();
		
		panel.appendChild(splite);
		//
		//
		//
		var forms = win.createForm();
		
		forms.AGENDA_GROUPS = new Select({
			multiple:	true,
			parameters:	'cmd=role.list'
		});
		
		forms.AGENDA_GROUPS.current = user.getMeta("AGENDA_GROUPS") || [];
		forms.AGENDA_GROUPS.Value(user.getMeta("AGENDA_GROUPS") || []);
		
		forms.AGENDA_GROUPS.load();
		
		forms.AGENDA_GROUPS.on('change', function(){
			var listGroups = [];
			forms.AGENDA_GROUPS.Value().each(function(e){
				listGroups.push(e.value);
			});
			
			forms.AGENDA_GROUPS.current = listGroups;
			forms.AGENDA_USERS.setData([]);
			forms.AGENDA_USERS_EVT_ADD.setData([]);
			forms.AGENDA_USERS_EVT_EDIT.setData([]);
						
			if(listGroups.length == 0){
				forms.AGENDA_USERS.parentNode.parentNode.hide();
				forms.AGENDA_USERS_EVT_ADD.parentNode.parentNode.hide();
				forms.AGENDA_USERS_EVT_EDIT.parentNode.parentNode.hide();
			}else{
				forms.AGENDA_USERS.parentNode.parentNode.show();
				forms.AGENDA_USERS_EVT_ADD.parentNode.parentNode.show();
				forms.AGENDA_USERS_EVT_EDIT.parentNode.parentNode.show();
				forms.AGENDA_USERS.setParameters('cmd=user.list&options=' + Object.EncodeJSON({Roles:listGroups})).load();
			}
			
			try{
				forms.active();
			}catch(er){}
		});
		
		forms.addFilters('AGENDA_GROUPS', function(){
			var a = [];
			forms.AGENDA_GROUPS.Value().each(function(e){
				a.push(e.value);
			});
			
			user.Meta.AGENDA_GROUPS = a;
			
			return '';
		});
		
		//
		//
		//
		forms.AGENDA_USERS = new Select({
			multiple:	true,
			parameters:	'cmd=user.list&options=' + Object.EncodeJSON({Roles:forms.AGENDA_GROUPS.current})
		});
		
		//forms.AGENDA_USERS.current = $U().getMeta("AGENDA_USERS") || [];
		forms.AGENDA_USERS.Value(user.getMeta("AGENDA_USERS") || []);
		forms.AGENDA_USERS.on('draw', function(line){
			if(line.getData().value == user.User_ID){
				line.hide();	
			}
		});
		forms.AGENDA_USERS.on('complete', function(obj){
			try{
				//forms.AGENDA_USERS.Value(forms.AGENDA_USERS.current);	
				forms.AGENDA_USERS_EVT_ADD.setData(obj);
				//forms.AGENDA_USERS_EVT_ADD.Value(forms.AGENDA_USERS_EVT_ADD.current);
				forms.AGENDA_USERS_EVT_EDIT.setData(obj);
				//forms.AGENDA_USERS_EVT_EDIT.Value(forms.AGENDA_USERS_EVT_EDIT.current);
			}catch(er){alert(er)}
		});
		
		forms.AGENDA_USERS.load();
		forms.AGENDA_USERS.on('change', function(){
			try{
				forms.active();
			}catch(er){}
		});
		
		forms.addFilters('AGENDA_USERS', function(){
			var a = [];
			forms.AGENDA_USERS.Value().each(function(e){
				a.push(e.value);
			});
			
			user.Meta.AGENDA_USERS = a;
			
			return '';
		});
		//
		//
		//
		
		forms.AGENDA_USERS_EVT_ADD = new Select({
			multiple:	true
		});
		forms.AGENDA_USERS_EVT_ADD.Value(user.getMeta("AGENDA_USERS_EVT_ADD") || []);
		forms.AGENDA_USERS_EVT_ADD.on('draw', function(line){
			if(line.getData().value == user.User_ID){
				line.hide();	
			}
		});
		forms.AGENDA_USERS_EVT_ADD.on('change', function(){
			try{
				forms.active();
			}catch(er){}
		});
		
		forms.addFilters('AGENDA_USERS_EVT_ADD', function(){
			var a = [];
			forms.AGENDA_USERS_EVT_ADD.Value().each(function(e){
				a.push(e.value);
			});
			
			user.Meta.AGENDA_USERS_EVT_ADD = a;
			
			return '';
		});
		//
		//
		//
		forms.AGENDA_USERS_EVT_EDIT = new Select({
			multiple:	true
		});
		forms.AGENDA_USERS_EVT_EDIT.Value(user.getMeta("AGENDA_USERS_EVT_EDIT") || []);
		forms.AGENDA_USERS_EVT_EDIT.on('draw', function(line){
			if(line.getData().value == user.User_ID){
				line.hide();	
			}
		});
		forms.AGENDA_USERS_EVT_EDIT.on('change', function(){
			try{
				forms.active();
			}catch(er){}
		});
		
		forms.addFilters('AGENDA_USERS_EVT_EDIT', function(){
			var a = [];
			forms.AGENDA_USERS_EVT_EDIT.Value().each(function(e){
				a.push(e.value);
			});
			
			user.Meta.AGENDA_USERS_EVT_EDIT = a;
			
			return '';
		});
		//
		//
		//
		forms.AGENDA_RECALL_EVENT =		new Select(); 
		forms.AGENDA_RECALL_EVENT.setData(System.Agenda.Event.Recalls);
		forms.AGENDA_RECALL_EVENT.Value(user.getMeta("AGENDA_RECALL_EVENT") || 0);
		forms.AGENDA_RECALL_EVENT.on('change', function(){
			try{
				forms.active();
			}catch(er){}
		});
		
		forms.addFilters('AGENDA_RECALL_EVENT', function(){
			user.Meta.AGENDA_RECALL_EVENT = forms.AGENDA_RECALL_EVENT.Value();
			return '';
		});
		//
		//
		//				
		panel.appendChild(new Node('h4', $MUI('Paramètres d\'affichage')));
		
		var table = new TableData();
		table.addHead($MUI('Groupes') + ' : ', {style:'width:180px'}).addField(forms.AGENDA_GROUPS).addRow();
		table.addHead($MUI('Agenda partagés') + ' : ', {style:'width:180px'}).addField(forms.AGENDA_USERS).addRow();
		
		panel.appendChild(table);
		
		panel.appendChild(new Node('h4', $MUI('Paramètres d\'accès')));
		
		var table = new TableData();
		table.addHead($MUI('Utilisateur pouvant créer des événements sur mon agenda') + ' : ', {style:'width:180px'}).addField(forms.AGENDA_USERS_EVT_ADD).addRow();
		table.addHead($MUI('Utilisateur pouvant modifier mes événements') + ' : ', {style:'width:180px'}).addField(forms.AGENDA_USERS_EVT_EDIT).addRow();
		
		panel.appendChild(table);
		
		if(forms.AGENDA_GROUPS.current.length == 0){
			forms.AGENDA_USERS.parentNode.parentNode.hide();
			forms.AGENDA_USERS_EVT_ADD.parentNode.parentNode.hide();
			forms.AGENDA_USERS_EVT_EDIT.parentNode.parentNode.hide();
		}
		
		panel.appendChild(new Node('h4', $MUI('Autres paramètres')));
		
		var table = new TableData();
		table.addHead($MUI('Rappel des événements par défaut') + ' : ', {style:'width:180px'}).addField(forms.AGENDA_RECALL_EVENT).addRow();
		
		panel.appendChild(table);
		//
		// 
		//
		
		if(user.User_ID == $U().User_ID){
			
			var submit = new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
			
			submit.on('click', function(){
				
				forms.save(user);
								
				user.commit();
				
				var splite = new SpliteIcon($MUI('Paramètres correctement enregistré'));
				splite.setIcon('filesave-ok-48');
				
				var box = win.createBox();
				box.setTitle($MUI('Confirmation')).setIcon('documentinfo').a(splite).setType('CLOSE').Timer(5).show();	
			});
			
			panel.appendChild(submit);
		}
		
		
		}catch(er){$S.trace(er)}
		return panel;
	},
	
	submit:function(win){
		
		var forms = win.createForm();
		var user = win.getData();
				
		
		
		user.setMeta("AGENDA_RECALL_EVENT", forms.AGENDA_RECALL_EVENT.Value(), false);
		
		
		var listUsers = [];
		forms.AGENDA_USERS.Value().each(function(e){
			listUsers.push(e.value);
		});
		
		user.setMeta("AGENDA_USERS", listUsers, false);
		
		var listUsers = [];
		forms.AGENDA_USERS_EVT_ADD.Value().each(function(e){
			listUsers.push(e.value);
		});
		
		user.setMeta("AGENDA_USERS_EVT_ADD", listUsers, false);
		
		var listUsers = [];			
		var list = forms.AGENDA_USERS_EVT_EDIT.Value();
		
		list.each(function(e){
			listUsers.push(e.value);
		});
		
		user.setMeta("AGENDA_USERS_EVT_EDIT", listUsers, false);
		
	}
};

System.Agenda.Setting.initialize();