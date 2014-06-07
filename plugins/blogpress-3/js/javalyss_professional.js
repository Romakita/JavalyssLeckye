Object.extend(System.User, {
/**
 * System.User.onOpen(win) -> Panel
 **/	
	onOpen:function(win){
		var user = 	win.getData();
		var forms = win.createForm();
		
		Object.extend(user, {
			LegalStatut: 	user.getMeta('LegalStatut') || '',
			Service:		user.getMeta('Service') || '',
			Sector:			user.getMeta('Sector') || '',
			Workforce:		user.getMeta('Workforce') || '',
			Company:		user.getMeta('Company') || '',
			Siret:			user.getMeta('Siret') || '',
			TVA_Intra:		user.getMeta('TVA_Intra') || ''
		});
		
		if(user.getMeta('Company')){
			win.TabControl.addPanel($MUI('Société'), System.User.createPanelProfessional(win)).setIcon('administrator');
		}else{
			if(user.User_ID != 0){
				var add = new SimpleButton({text:$MUI('Créer profil pro'), icon:'administrator-add'});
				
				win.TabControl.Header().appendChild(add);
				
				add.on('click', function(){
					win.TabControl.Header().removeChild(add);
					win.TabControl.addPanel($MUI('Société'), System.User.createPanelProfessional(win)).setIcon('administrator').click();
				});
			}
		}
		
		if(user.User_ID == 0){
			
			var splite = new SpliteIcon($MUI('Création d\'un nouveau compte'), $MUI('Choisissez le type de compte utilisateur que vous souhaitez créer') + ' :');
			splite.setIcon('account-type-48');
			
			var app1 = new AppButton({icon:'user-edit-32', text:$MUI('Particulier')});
			var app2 = new AppButton({icon:'administrator-32', text:$MUI('Professionel')});
			
			app1.on('click', function(){
				win.AlertBox.hide();
			});
			
			app2.on('click', function(){
				win.TabControl.addPanel($MUI('Société'), System.User.createPanelProfessional(win)).setIcon('administrator');
				win.AlertBox.hide();
			});
			
			win.AlertBox.setTitle($MUI('Création du compte')).as([splite, new Node('center', [app1, app2])]).setType('NONE').show();
		}
		
	},
/**
 * System.User.createPanelProfessional(win) -> Panel
 **/	
	createPanelProfessional: function(win){
		
		var forms =		win.createForm();
		var user =		win.getData();
		
		var panel = 	new Panel({background:"user", style:'width:500px;min-height:500px;'});
		var splite =	new SpliteIcon($MUI('Information sur la société'), user.FirstName + ' ' +  user.Name);
		splite.setIcon('administrator-48');
		//
		// 
		//
		forms.LegalStatut = new Select();
		forms.LegalStatut.setData($S.Meta('BP_LEGAL_STATUTES'));
		forms.LegalStatut.Value(user.LegalStatut || '');
		//
		// 
		//
		forms.Service = new Select();
		forms.Service.setData($S.Meta('BP_SERVICES'));
		forms.Service.Value(user.Service || '');
		forms.Service.Input.readOnly = false;
		//
		// 
		//
		forms.Sector = new Select();
		forms.Sector.setData($S.Meta('BP_SECTORS'));
		forms.Sector.Value(user.Sector || '');
		forms.Sector.Input.readOnly = false;
		//
		// 
		//
		forms.Workforce = new Select();
		forms.Workforce.setData($S.Meta('BP_WORKFORCE'));
		forms.Workforce.Value(user.Workforce || '');
		//
		// 
		//
		forms.Company = new Input({type:'text', maxLength:100, value: user.Company || ''});
		//
		//
		//
		forms.Siret = new Input({type:'text', maxLength:14, value: user.Siret || ''});
		//
		//
		//
		forms.TVA_Intra = new Input({type:'text', maxLength:30, value: user.TVA_Intra || ''});
	
		var table = new TableData();
		table.addHead($MUI('Raison sociale'), {style:'width:130px'}).addField(forms.Company).addRow();
		table.addHead($MUI('Statut')).addField(forms.LegalStatut).addRow();
		table.addHead($MUI('Siret')).addField(forms.Siret).addRow();
		table.addHead($MUI('N° TVA Intra')).addField(forms.TVA_Intra).addRow();
		table.addHead($MUI('Service')).addField(forms.Service).addRow();
		table.addHead($MUI('Secteur')).addField(forms.Sector).addRow();
		table.addHead($MUI('Effectif')).addField(forms.Workforce).addRow();
	
		panel.appendChild(splite);
		panel.appendChild(table);
	
		if(user.User_ID == $U().User_ID){
			var submit = new SimpleButton({text:$MUI('Enregistrer'), icon:'filesave', type:'submit'});
			panel.appendChild(submit);
			
			submit.on('click', function(){
				
				if(forms.Company.Value() == ''){
								
					win.TabControl.get($MUI('Société')).click();
					
					win.Flag.setText($MUI('Veuillez saisir le nom de votre entreprise')).color('red').show(forms.Company, true);
					forms.Company.focus();
					forms.Company.select();
					
					return true;
				}
				
				win.ActiveProgress();
				
				user.setMeta('Company', forms.Company.Value(), true);
				user.setMeta('LegalStatut', forms.LegalStatut.Value(), true);
				user.setMeta('Siret', forms.Siret.Value(), true);
				user.setMeta('TVA_Intra', forms.TVA_Intra.Value(), true);
				user.setMeta('Service', forms.Service.Text(), true);
				user.setMeta('Sector', forms.Sector.Text(), true);
				user.setMeta('Workforce', forms.Workforce.Value());
				
				this.addIfNotExistsService(forms.Service.Text());
				forms.Service.setData($S.Meta('BP_SERVICES'));
				
				this.addIfNotExistsService(forms.Sector.Text());
				forms.Sector.setData($S.Meta('BP_SECTORS'));
				
				win.AlertBox.hide();
					
				var splite = new SpliteIcon($MUI('Vos informations ont correctement été modifié'));
				splite.setIcon('filesave-ok-48');
				
				win.AlertBox.setTitle($MUI('Mon compte')).setIcon('bookmark').a(splite).ty('CLOSE').Timer(5).show();
				win.AlertBox.getBtnReset().setIcon('exit');
				
			}.bind(this));
		}
	
		if(user.User_ID != 0 && user.getMeta('Company') != ''){
			
			var reset = new SimpleButton({icon:'delete', text:$MUI('Supprimer mon profil pro')});
			win.Flag.add(reset, {
				orientation:Flag.TOP,
				text:		$MUI('Cliquez sur ce bouton pour supprimer toutes les informations professionel associées au compte'),
				icon:		'documentinfo'
				
			});
			
			panel.appendChild(reset);
			
			reset.on('click', function(){
				forms.Company = null;
				win.TabControl.removePanel($MUI('Société'));
				
				var add = new SimpleButton({text:$MUI('Créer profil pro'), icon:'administrator-add'});
				
				win.TabControl.Header().appendChild(add);
				
				add.on('click', function(){
					win.Flag.hide();
					win.TabControl.Header().removeChild(add);
					win.TabControl.addPanel($MUI('Société'), UsersManager.prototype.createPanelProfessional(win)).setIcon('administrator').click();
				});
				
				user.setMeta('Company', '', true);
				user.setMeta('LegalStatut', '', true);
				user.setMeta('Siret', '', true);
				user.setMeta('TVA_Intra', '', true);
				user.setMeta('Service', '', true);
				user.setMeta('Sector', '', true);
				user.setMeta('Workforce', '');
			});
		}
		
		return panel;
	},
/**
 * System.User.onSubmit(win) -> void
 **/	
	onSubmit:function(evt){
		var win = 		$WR.getByName('user.form');
		var user =		win.getData();
		var forms = 	win.createForm();
		
		if(forms.Company){
			if(forms.Company.Value() == ''){
				evt.stop();
				
				win.TabControl.get($MUI('Société')).click();
				
				win.Flag.setText($MUI('Veuillez saisir le nom de votre entreprise')).color('red').show(forms.Company, true);
				forms.Company.focus();
				forms.Company.select();
				
				return true;
			}
					
			if(forms.Siret.Value() == ''){
				evt.stop();
				
				win.TabControl.get($MUI('Société')).click();
				
				win.Flag.setText($MUI('Veuillez saisir un numéro de siret valide')).color('red').show(forms.Siret, true);
				forms.Siret.focus();
				forms.Siret.select();
				return true;
			}
			try{
			user.Meta.Company = 	forms.Company.Value();
			user.Meta.LegalStatut = forms.LegalStatut.Value();
			user.Meta.Siret = 		forms.Siret.Value();
			user.Meta.TVA_Intra = 	forms.TVA_Intra.Value();
			user.Meta.Service = 	forms.Service.Text();
			user.Meta.Sector = 		forms.Sector.Text();
			user.Meta.Workforce = 	forms.Workforce.Value();
			//
			//
			//
			this.addIfNotExistsService(forms.Service.Text());
			forms.Service.setData($S.Meta('BP_SERVICES'));
			
			this.addIfNotExistsService(forms.Sector.Text());
			forms.Sector.setData($S.Meta('BP_SECTORS'));
			
			}catch(er){$S.trace(er)}
		}else{
			user.Meta.Company = 	'';
			user.Meta.LegalStatut = '';
			user.Meta.Siret = 		'';
			user.Meta.TVA_Intra = 	'';
			user.Meta.Service = 	'';
			user.Meta.Sector = 		'';
			user.Meta.Workforce = 	'';
		}
	},
/**
 * System.User.addIfNotExistsService(text) -> void
 **/	
	addIfNotExistsService:function(text){
		if(text == '') return;
		
		var array = $S.Meta('BP_SERVICES') || [];
		var txt = text.toLowerCase().trim();
		
		for(var i = 0; i < array.length && array[i].text.toLowerCase().trim() != txt; i++){
			continue;	
		}
		
		if(i >= array.length){
			array.push({text:text, value:text});
		}
		
		array = array.sortBy(function(s){
			return s.text;
		});
		
		$S.Meta('BP_SERVICES', array);
	},
/**
 * System.User.addIfNotExistsSector(text) -> void
 **/	
	addIfNotExistsSector:function(text){
		if(text == '') return;
		
		var array = $S.Meta('BP_SECTORS') || [];
		var txt = text.toLowerCase().trim();
		
		for(var i = 0; i < array.length && array[i].text.toLowerCase().trim() != txt; i++){
			continue;	
		}
		
		if(i >= array.length){
			array.push({text:text, value:text});
		}
		
		array = array.sortBy(function(s){
			return s.text;
		});
		
		$S.Meta('BP_SECTORS', array);
	}
	
});

$S.observe('user:open', System.User.onOpen.bind(System.User));
$S.observe('user:open.submit', System.User.onSubmit.bind(System.User));

$S.observe('user:open.preferences', function(win){
	
	var user = 	win.getData();
	var forms = win.createForm();
	
	Object.extend(user, {
		LegalStatut: 	user.getMeta('LegalStatut') || '',
		Service:		user.getMeta('Service') || '',
		Sector:			user.getMeta('Sector') || '',
		Workforce:		user.getMeta('Workforce') || '',
		Company:		user.getMeta('Company') || '',
		Siret:			user.getMeta('Siret') || '',
		TVA_Intra:		user.getMeta('TVA_Intra') || ''
	});
	
	win.TabControl.addPanel($MUI('Société'), System.User.createPanelProfessional(win)).setIcon('administrator');
});

System.User.prototype.isProfessional = function(){
	return user.getMeta('Company') != '';
};

