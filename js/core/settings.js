/** section: Core
/** section: Core
 * System.Settings
 * Gestionnaire des panneaux de configurations de Javalyss.
 **/
System.Setting = System.Settings = {
/**
 * System.Settings.open() -> void
 *
 * Cette méthode ouvre une fenêtre avec les informations du logiciel.
 *
 * Ci-contre, le formulaire du panneau de configuration :
 *
 * <img src="http://www.javalyss.fr/sources/form-config.png" />
 **/
	open: function(it){

		try{
			var win = $WR.unique('settings', {
				autoclose:	false,
				action: function(){
					
				}.bind(this)
			});
			
			//on regarde si l'instance a été créée
			if(!win) return;
			
			win.overrideClose({
				close:	function(){
					if(win.forms.update){
						$S.reload();	
					}
				}.bind(this)
			});
			//
			//Window
			//
			win.forms = {update:false};
						
			win.setIcon('system-setting');
			win.setTitle($MUI('Panneau de configuration'));
			win.NoChrome(true);
			win.Resizable(false);
			win.createFlag().setType(FLAG.RIGHT);
			win.createBox();
			win.createBubble();
			win.createHandler($MUI('Opération en cours') + '...', true);
			$Body.appendChild(win);
			
			win.ActiveProgress_ = win.ActiveProgress;
			win.ActiveProgress = function(){
				win.forms.update = true;
				win.ActiveProgress_();
			};
			//
			//TabControl
			//
			win.createTabControl({type:'left'});
						
			win.TabControl.addPanel($MUI('Informations'), this.createPanelSystem(win)).setIcon('system-setting-home');
			
			win.TabControl.addPanel($MUI('Multimédia'), this.createPanelMedia(win)).setIcon('system-filemanager');
			win.TabControl.addPanel($MUI('Préférences'), this.createPanelPreferences(win)).setIcon('system-setting-advanced');
			win.TabControl.addPanel($MUI('Sécurité'), this.createPanelSecurity(win)).setIcon('system-setting-security');
			win.TabControl.addPanel($MUI('Groupes & accès'), this.createPanelGroup(win)).setIcon('system-group');

			win.TabControl.addPanel($MUI('Exportation'), this.createPanelExport(win)).setIcon('system-setting-export').on('click', function(){
				win.loadExport();
			});
			win.TabControl.addPanel($MUI('Tâche CRON'), this.createPanelCronInfo(win)).setIcon('system-setting-cron').on('click', function(){
				win.loadCron();
			});
			win.TabControl.addPanel($MUI('PHP info'), this.createPanelPHPInfo(win)).setIcon('system-setting-php-info');
			
			win.TabControl.addSection($MUI('Apps'));
			
			$S.fire('system:open.settings', win);
			$S.fire('system:open.config', win);
			
			win.moveTo(0,0);	
			win.resizeTo('auto', document.stage.stageHeight);
						
			win.TabControl.select(Object.isNumber(it) ? it : 0);
			
			return win;
		
		}catch(er){$S.trace(er)}
	},
/**
 * System.Settings.createPanelSystem(win) -> Panel
 * - win (Window): Instance window.
 *
 * Créer un panneau affichant les informations du logiciel.
 **/
	createPanelSystem: function(win){
		return this.createPanelInfo(win, 'logo');
	},
/** 
 * System.Settings.createPanelPHPInfo(win) -> Panel
 * - win (Window): Instance Window
 *
 * Créer un panneau permettant de configurer les préférences avancées.
 **/
	createPanelPHPInfo: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'info'});
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Informations sur votre serveur PHP'));
		splite.setIcon('system-setting-php-info-48');
		
		var node = new Node('div', {style:'overflow:auto;height:200px; border:1px solid #DFDFDF'});
		
		var i = 0;
		$A($S.LoadedExtensions).sort().each(function(ext){
			node.appendChild(new Node('div',{style:'padding:4px 6px;background:' + (i % 2 == 0 ? 'white' : '#EBEAEF') + '; border-bottom:1px solid #DFDFDF'}, ext));
			i++;
		});
		
		var table = 		new TableData();
		table.addHead($MUI('Version PHP'),  {style:'width:160px'}).addField($S.PHP_VERSION).addRow();
		table.addHead(' ', {height:8}).addRow();
		table.addHead($MUI('Taille Max upload')).addField(($S.UPLOAD_MAX_FILESIZE / 1024 / 1024) + ' Mo').addRow();
		table.addHead($MUI('Taille mémoire')).addField(($S.MEMORY_LIMIT / 1024 / 1024) + ' Mo').addRow();
		table.addHead(' ', {height:8}).addRow();
		table.addHead($MUI('Support Curl')).addField($S.Curl ? $MUI('Oui') : $MUI('Non')).addRow();
		table.addHead($MUI('Support Zip')).addField($S.Zip ? $MUI('Oui') : $MUI('Non')).addRow();
		
		table.addHead($MUI('Tâche CRON')).addField($S.CRON_STARTED ? $MUI('Active') : $MUI('Désactivé')).addRow();
		table.addHead(' ', {height:8}).addRow();
		table.addHead($MUI('Extensions PHP'), {style:'vertical-align:top'}).addField(node, {style:'padding:0px'}).addRow();
		
		
		panel.appendChild(splite);
		panel.appendChild(table);
		
				
		table.getCel(5, 1).on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette extension permet à Javalyss d\'envoyer et de récupérer des données dans le cadre de mise à jour du logiciel') +'.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		table.getCel(6, 1).on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette extension permet à Javalyss de gérer les archives au format ZIP') +'.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		
		return panel;
	},
/**
 * System.Setting.createPanelGroup(win) -> Panel
 *
 * Cette méthode créée le panneau du listing des groupes
 **/	
	createPanelGroup: function(win){
		var panel = new Panel({style:'padding:0px;min-height:500px;'});
		//
		//
		//
		var widget = System.Role.createWidget(win);
		widget.BorderRadius(false);
		widget.setStyle('border-top:0px');
		
		widget.css('height', '100%');
		widget.setTitle($MUI('Gestion des groupes et accès'));
				
		panel.appendChild(widget);
		
		widget.load();
		
		return panel;
	},
/**
 * System.Setting.createPanelPrint() -> Node
 *
 * Créer le panneau de configuration d'impression
 **/
	createPanelPrint: function(win){
		
		//#pragma region Instance
		//
		//Node
		//
		var panel = 	new Panel({background:"print", style:'width:500px;min-height:500px;'});
		//
		//Splite
		//
		var splite =	new SpliteIcon($MUI('Configuration de l\'impression'), $MUI('Ce panneau vous permet de personnaliser l\'entête et pied de page des fiches d\'impression. Veuillez resseigner les champs suivants') + ' :' );
		splite.setIcon('system-setting-print-48');	

		var options  =	System.Meta('Prints') || {
			Name:		$U('PRINT_FIELD_HEAD') || '',
			Address:	$U('PRINT_FIELD_ADR') || '',
			City:		$U('PRINT_FIELD_VILLE') || '',
			Phone:		$U('PRINT_FIELD_TEL') || '',
			Fax:		$U('PRINT_FIELD_FAX') || '',
			RCS:		$U('PRINT_FIELD_RCS') || '',
			TVA_Intra:	'',
			Logo:		$U('PRINT_FIELD_LOGO') || ''
		};
		
		var forms = new Extends.Form();
		//
		//Name
		//
		forms.Name = 			new Input({type:'text', maxLength: 100, value: options.Name, className:'icon-cell-edit'});
		forms.Name.on('keyup', function(){forms.Preview.draw();});
		//
		// Address
		//
		forms.Address = 		new Input({type:'text', maxLength: 255, value: options.Address, className:'icon-cell-edit'});
		forms.Address.on('keyup', function(){forms.Preview.draw();});
		//
		// City
		//
		forms.City = 			new Input({type:'text', maxLength: 100, value: options.City, className:'icon-cell-edit'});
		forms.City.on('keyup', function(){forms.Preview.draw();});
		//
		// Phone
		//
		forms.Phone = 			new Input({type:'text', maxLength: 100, value: options.Phone, className:'icon-cell-edit'});
		forms.Phone.on('keyup', function(){forms.Preview.draw();});
		//
		// Fax
		//
		forms.Fax = 			new Input({type:'text', maxLength: 100, value: options.Fax, className:'icon-cell-edit'});
		forms.Fax.on('keyup', function(){forms.Preview.draw();});
		//
		// RCS
		//
		forms.RCS = 			new Input({type:'text', maxLength: 100, value: options.RCS, className:'icon-cell-edit'});
		forms.RCS.on('keyup', function(){forms.Preview.draw();});
		//
		// TVA_Intra
		//
		forms.TVA_Intra = 		new Input({type:'text', maxLength: 100, value: options.TVA_Intra, className:'icon-cell-edit'});
		forms.TVA_Intra.on('keyup', function(){forms.Preview.draw();});
		//
		// Logo
		//
		forms.Logo = 		new FrameWorker({
			multiple: false
		}); 
		forms.Logo.css('width', 'auto');
		
		forms.Logo.Value(options.Logo);
		
		forms.Logo.on('complete', function(){
			forms.Preview.draw();
		});
		
		//
		// Preview
		//
		forms.Preview = 		new Node('div', {className:'system-print-preview'});
		
		forms.Preview.Logo = 	new Node('img', {className:'print-logo', width:50});
		
		forms.Preview.Text = 	new Node('div', {className:'print-text'}, [
			forms.Preview.Name = 		new Node('h1'),
			forms.Preview.Address = 	new Node('p'),
			forms.Preview.City = 		new Node('p'),
			forms.Preview.Phone = 		new Node('p'),
			forms.Preview.Fax = 		new Node('p'),
			forms.Preview.RCS = 		new Node('p'),
			forms.Preview.TVA_Intra = 	new Node('p')					
		]);
		
		forms.Preview.draw = function(){
			this.Name.innerHTML = 			forms.Name.Value();
			this.Address.innerHTML = 		forms.Address.Value();
			this.City.innerHTML = 			forms.City.Value();
			this.Phone.innerHTML = 			forms.Phone.Value();
			this.Fax.innerHTML = 			forms.Fax.Value();
			this.RCS.innerHTML = 			forms.RCS.Value();
			this.TVA_Intra.innerHTML = 		forms.TVA_Intra.Value();
			this.Logo.src = 				forms.Logo.Value();
			
			if(forms.Phone.Value() == '') this.Phone.hide();
			else this.Phone.show();
			
			if(forms.Fax.Value() == '') this.Fax.hide();
			else this.Fax.show();
			
			if(forms.RCS.Value() == '') this.RCS.hide();
			else this.RCS.show();
			
			if(forms.TVA_Intra.Value() == '') this.TVA_Intra.hide();
			else this.TVA_Intra.show();
			
			if(forms.Logo.Value() == '') this.Logo.hide();
			else this.Logo.show();
		};
		//
		//Splite
		//
		var submit = 		new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		//
		//Table1
		//
		var table = 	new TableData();	
		table.addHead($MUI('Nom / Société')).addCel(forms.Name).addRow();
		
		table.addHead($MUI('Adresse')).addCel(forms.Address).addCel(' ').addRow();
		table.addHead($MUI('CP & Ville')).addCel(forms.City).addRow();
		table.addHead($MUI('Tel')).addCel(forms.Phone).addRow();
		table.addHead($MUI('Fax')).addCel(forms.Fax).addRow();
		table.addHead($MUI('RCS')).addCel(forms.RCS).addRow();
		table.addHead($MUI('TVA Intra')).addCel(forms.TVA_Intra).addRow();
		table.addHead($MUI('Logo')).addCel(forms.Logo).addRow();
				
		var tablep = new TableData();
		tablep.className = '';
		
		tablep.addCel(forms.Preview.Logo)
		tablep.addCel(forms.Preview.Text);
		
		forms.Preview.appendChild(tablep);
		forms.Preview.draw();
		
		//#pragma endregion Instance
		
		panel.appendChilds([
			splite, 
			table,
			new Node('h4', $MUI('Prévisualisation')),
			forms.Preview, 
			
			submit
		]);

		/*var folder = Object.isUndefined($U('Logo')) ? null : $U('Logo');
		
		forms.Logo.SimpleButton.on('click',function(){
			$FM().join(folder, function(file){
				forms.Logo.Value(file.uri);
				forms.Preview.draw();
			});
			
		});*/
				
		submit.on('click',function(){
			win.ActiveProgress();
			
			var options = forms.save();
			
			System.Meta('Prints', options);
			
			win.AlertBox.hide();
				
			var splite = new SpliteIcon($MUI('Vos informations ont correctement été modifié'));
			splite.setIcon('filesave-ok-48');
			
			win.AlertBox.setTitle($MUI('Impression')).setIcon('print').a(splite).ty('CLOSE').Timer(5).show();
			win.AlertBox.reset({icon:'exit'});
			
		}.bind(this));
			
		return panel;
	},
/** 
 * System.Settings.createPanelPreferences(win) -> Panel
 * - win (Window): Instance Window
 *
 * Créer un panneau permettant de configurer les préférences avancées.
 **/
	createPanelPreferences: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'advanced'});
		
		var forms = 		win.forms;
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Préférences du logiciel'), $MUI('Changez les valeurs des champs du formulaire ci-contre (Toutes les modifications seront automatiquement enregistrées)') + ' :');
		splite.setIcon('system-setting-advanced-48');
		//
		//USE_UPDATE
		//
		forms.USE_UPDATE = new ToggleButton();
		forms.USE_UPDATE.Value($S.Meta('USE_UPDATE'));
		//
		//USE_UPDATE
		//
		forms.USE_BETA = new ToggleButton();
		forms.USE_BETA.Value($S.Meta('USE_BETA') || false);
		//
		//NAME_VERSION
		//
		//forms.MODE_SERVER = new ToggleButton();
		//forms.MODE_SERVER.Value($S.Meta('MODE_SERVER'));
		//
		//MODE_DEBUG
		//
		forms.MODE_DEBUG = new ToggleButton();
		forms.MODE_DEBUG.Value($S.Meta('MODE_DEBUG'));
		//
		//LINK_MARKET
		//
		forms.LINK_MARKET = 	new Node('input', {className:'icon-cell-edit', type:'text', value:$S.LINK_MARKET});
		//
		//
		//
		var table = 		new TableData();
		
		table.addHead($MUI('Mode développeur'), {className:'icon-system-setting-modedev system-icon-field'}).addCel(forms.MODE_DEBUG, {style:'text-align:right'}).addRow();
		table.addHead('  ', {style:'height:10px'}).addRow();	
		table.addHead($MUI('Recherche de mise à jour'), {style:'width:160px', className:'icon-system-setting-update system-icon-field'}).addCel(forms.USE_UPDATE, {style:'text-align:right'}).addRow();
		table.addHead($MUI('Canal beta'), {style:'width:160px', className:'icon-system-setting-beta system-icon-field'}).addCel(forms.USE_BETA, {style:'text-align:right'}).addRow();
		table.addHead('  ', {style:'height:10px'}).addRow();
		table.addHead($MUI('Javalyss Market'), {className:'icon-system-market system-icon-field'}).addField(forms.LINK_MARKET).addRow();
		table.addHead($MUI('Dossier des applications')).addField($S.URI_PATH + $S.PATH_PLUGIN).addRow();
		
		panel.appendChild(splite);
		panel.appendChild(table);
				
		forms.USE_UPDATE.on('change', function(){
			win.ActiveProgress();
			$S.Meta('USE_UPDATE', this.value);
		});
				
		forms.USE_UPDATE.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option vous permet d\'activer ou désactiver la recherche automatique des mises à jour du logiciel') + '.</p><p>'
							+ $MUI('Rendez-vous sur Javalyss Market afin de vérifier si votre logiciel est à jour') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});	
		
		forms.USE_BETA.on('change', function(){
			win.ActiveProgress();
			$S.Meta('USE_BETA', this.value);
		});
				
		forms.USE_BETA.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option vous permet d\'activer ou désactiver l\'accès au canal des betas') + '.</p>'
							+ '<p>' + $MUI('Le canal beta permet d\'acceder aux packets en cours de développement par l\'auteur')+'.</p>')
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		forms.MODE_DEBUG.on('change', function(){
			win.ActiveProgress();
			$S.Meta('MODE_DEBUG', this.Value());
		});

		forms.MODE_DEBUG.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option vous permet d\'activer ou désactiver le mode développeur') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
				
		forms.LINK_MARKET.on('change', function(){
			win.ActiveProgress();
			$S.Meta('LINK_MARKET', this.value);
		});		
		
		forms.LINK_MARKET.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Indiquez ici le lien du serveur de mise à jour du logiciel') + '.</p>'
							+ '<p class="icon-interact">' + $MUI('Javalyss est mis à jour régulièrement afin d\'être toujours plus performant') +'.</p><p class="icon-goto">' 
							+ $MUI('Rendez-vous dans Javalyss Market pour vérifier si votre logiciel est à jour') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
				
		return panel;
	},
/** 
 * System.Settings.createPanelTheme(win) -> Panel
 * - win (Window): Instance Window
 *
 * Créer un panneau permettant de configurer le thème par défaut du logiciel.
 **/
	createPanelTheme: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'theme'});
		
		var forms = 		win.forms;
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Préférence des thèmes'), $MUI('Changez les valeurs des champs du formulaire ci-contre (Toutes les modifications seront automatiquement enregistrées)') + ' :');
		splite.setIcon('system-setting-template-48');
		//
		//USE_THEMES
		//
		forms.USE_THEMES = new ToggleButton();
		forms.USE_THEMES.Value($S.Meta('USE_THEMES'));
		//
		// DEFAULT_THEME
		//
		forms.DEFAULT_THEME = 	new HeadPieceList({pagination:0});
		//forms.DEFAULT_THEME.Body().setStyle('width:468px; height:360px');
		forms.DEFAULT_THEME.setTitle($MUI('Thème par défaut des comptes utilisateurs'));
		
		/*forms.DEFAULT_THEME.ScrollBar.observe('update', function(){
			if(forms.DEFAULT_THEME.ScrollBar.isScrollable()){
				forms.DEFAULT_THEME.Body().setStyle('width:488px');
			}else{
				forms.DEFAULT_THEME.Body().setStyle('width:468px');
			}
		});*/
		
		forms.DEFAULT_THEME.refresh = function(){
			forms.DEFAULT_THEME.clear();
			
			for(var key in $S.themes.options){
				var hp = new HeadPiece({
					resize:	true,
					src: 	$S.themes.options[key].PathURI + '/screenshot.png',
					title:	$S.themes.options[key].Name + ' ' + $S.themes.options[key].Version,
					legend:	'<h1 style="color:#DDD; font-size:12px; line-height:20px; height:20px">' +
							 $S.themes.options[key].Name + ' ' + $S.themes.options[key].Version + '</h1>'+
							 '<i style="font-size:9px;padding-left:5px">'+ $S.themes.options[key].Author +'</i>'+
							 '<p class="icon-documentinfo" style="max-width:210px">'+ $S.themes.options[key].Description +'</p>'+
							 '<div style="text-align:center;padding-top:10px; overflow:hidden; width:250px; max-height:300px"><img style="border:3px white solid;" src="'+$S.themes.options[key].PathURI + '/screenshot.png" /></div>'
				});
				
				forms.DEFAULT_THEME.appendChild(hp);
							
				hp.data = $S.themes.options[key];
				hp.data.ThemeKey = key.split('/')[0];
				
				hp.on('click',function(){
					win.ActiveProgress();
					$S.Meta('DEFAULT_THEME', this.data.ThemeKey);
				});
				
				if(hp.data.ThemeKey == ($S.Meta('DEFAULT_THEME') || 'system')){
					hp.Selected(true);	
				}
			}
		}.bind(this);
		
		
		var table = 		new TableData();
		
		table.addHead($MUI('Les utilisateurs peuvent personnaliser le thème') + ' ? ', {style:'width:284px', className:''}).addCel(forms.USE_THEMES, {style:'text-align:right'}).addRow();
					
		panel.appendChild(splite);
		panel.appendChild(table);
		panel.appendChild(forms.DEFAULT_THEME);
		
		forms.USE_THEMES.on('change', function(){
			win.ActiveProgress();
			$S.Meta('USE_THEMES', this.value);
		});
		
		forms.USE_THEMES.parentNode.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option permet d\'activer ou de désactiver le gestionnaire des thèmes') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
				
		return panel;	
	},
/** 
 * System.Settings.createPanelMedia(win) -> Panel
 * - win (Window): Instance Window
 *
 * Créer un panneau permettant de configurer des paquets.
 **/
	createPanelMedia: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'multimedia'});
		
		var forms = 		win.forms;
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Préférence des médias'), $MUI('Changez les valeurs des champs du formulaire ci-contre (Toutes les modifications seront automatiquement enregistrées)') + ' :');
		splite.setIcon('system-filemanager-48');
		//
		//USE_FILEMANAGER
		//
		forms.USE_FILEMANAGER = new ToggleButton();
		forms.USE_FILEMANAGER.Value($S.Meta('USE_FILEMANAGER'));
		//
		//USE_GLOBAL_DOC
		//
		forms.USE_GLOBAL_DOC = new ToggleButton();
		forms.USE_GLOBAL_DOC.Value($S.Meta('USE_GLOBAL_DOC'));
		//
		// QUOTA
		//
		forms.QUOTA = 				new Node('input', {className:'icon-cell-edit', type:'text', value:$S.Meta('QUOTA') || 300, maxLength:4});
		
		forms.MEMORY_MAX_LIMIT =  	new Select();
		forms.MEMORY_MAX_LIMIT.setData([
			{value:'32M', text:'32M'},
			{value:'64M', text:'64M'},
			{value:'128M', text:'128M'},
			{value:'256M', text:'256M'},
			{value:'512M', text:'512M'}
		]);
		
		forms.MEMORY_MAX_LIMIT.Value($S.Meta('MEMORY_MAX_LIMIT') || (System.MEMORY_LIMIT / 1024 / 1024 )+'M');
		//
		// EXT_FILE_AUTH
		//
		forms.EXT_FILE_AUTH = 			new Node('textarea', {style:'height:100px'});
		forms.EXT_FILE_AUTH.value = 	$S.Meta('EXT_FILE_AUTH');
		forms.EXT_FILE_AUTH.value = 	forms.EXT_FILE_AUTH.value.replace(/;/gi, '; ');
		//
		// 
		//
		forms.EXT_FILE_EXCLUDE = 		new Node('textarea', {style:'height:100px'});
		forms.EXT_FILE_EXCLUDE.value = 	$S.Meta('EXT_FILE_EXCLUDE') || '';
		forms.EXT_FILE_AUTH.value = 	forms.EXT_FILE_AUTH.value.replace(/;/gi, '; ');
		forms.EXT_FILE_EXCLUDE.placeholder = $MUI('Aucune extension de fichier de bloqué');
		
		var table = 		new TableData();
		
		table.addHead($MUI('Gestion des médias'), {style:'width:160px'}).addCel(forms.USE_FILEMANAGER, {style:'text-align:right'}).addRow();
		table.addHead($MUI('Stockage global'), {className:'icon-system-setting-globaldoc system-icon-field'}).addCel(forms.USE_GLOBAL_DOC, {style:'text-align:right'}).addRow();
		table.addHead('  ', {style:'height:10px'}).addRow();
		table.addHead($MUI('Quota'), {className:'icon-system-setting-quota system-icon-field'}).addField(forms.QUOTA).addRow();
		table.addHead($MUI('Taille mémoire allouée'), {className:''}).addField(forms.MEMORY_MAX_LIMIT).addRow();
		
		table.addHead($MUI('Extensions autorisées'), {className:'', style:'vertical-align:top'}).addField(forms.EXT_FILE_AUTH).addRow();
		table.addHead($MUI('Extensions bloquées'), {className:'', style:'vertical-align:top'}).addField(forms.EXT_FILE_EXCLUDE).addRow();
		
		table.addHead('  ', {style:'height:10px'}).addRow();
		table.addHead($MUI('Dossier publique')).addField($S.URI_PATH + $S.PATH_PUBLIC).addRow();
		table.addHead($MUI('Dossier privé')).addField($S.URI_PATH + $S.PATH_PRIVATE).addRow();
			
		panel.appendChild(splite);
		panel.appendChild(table);
		
		forms.QUOTA.on('blur', function(){
			win.ActiveProgress();
			$S.Meta('QUOTA', this.value);
		});
		
		forms.QUOTA.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option vous permet de modifier l\'espace de stockage pour chaque utilisateur du logiciel') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		forms.USE_FILEMANAGER.on('change', function(){
			win.ActiveProgress();
			$S.Meta('USE_FILEMANAGER', this.value);
		});
				
		forms.USE_FILEMANAGER.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option permet d\'activer ou de désactiver le gestionnaire des médias') + '.</p>'
							+ '<p class="icon-multimedia">' + $MUI('Le gestionnaire des médias vous permet de gérer des fichiers sur le serveur') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		forms.MEMORY_MAX_LIMIT.on('change', function(){
			win.ActiveProgress();
			$S.Meta('MEMORY_MAX_LIMIT', this.value);
		});
		
		forms.MEMORY_MAX_LIMIT.parentNode.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option permet de fixer la mémoire vive maximal attribuée à PHP') + '.</p>'
							+ '<p class="">' + $MUI('Changez cette valeur si vous rencontrez des problèmes lors de traitement de fichier (redimensionnement d\'image ou création d\'archive)') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		forms.EXT_FILE_AUTH.on('change', function(){
			win.ActiveProgress();
			$S.Meta('EXT_FILE_AUTH', this.value.replace(/ /gi, '').replace(/\n/gi, '').replace(/\r/gi, ''));
		});
		
		forms.EXT_FILE_AUTH.parentNode.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici la liste des extensions des fichiers pouvant être téléchargé dans le gestionnaire des médias') + '.</p>'
							+ '<p>' + $MUI('Laissez ce champ à vide si vous ne voulez pas restreindre les extensions') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		forms.EXT_FILE_EXCLUDE.on('change', function(){
			win.ActiveProgress();
			$S.Meta('EXT_FILE_EXCLUDE', this.value.replace(/ /gi, '').replace(/\n/gi, '').replace(/\r/gi, ''));
		});
		
		forms.EXT_FILE_EXCLUDE.parentNode.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici la liste des extensions des fichiers bloquées dans le gestionnaire des médias') + '.</p>'
							+ '<p>' + $MUI('Laissez ce champ à vide si vous ne voulez pas restreindre les extensions') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		forms.USE_GLOBAL_DOC.on('change', function(){
			win.ActiveProgress();
			$S.Meta('USE_GLOBAL_DOC', this.value);
		});
		
		forms.USE_GLOBAL_DOC.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option permet d\'activer ou de désactiver le stockage des données commun à tous les utilisateurs du logiciel') + '.</p>'
							+ '<p>' + $MUI('Lorsque l\'option est désactivé, chaque utilisateur possède un dossier de stockage') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		return panel;	
	},
/** 
 * System.Settings.createPanelSecurity(win) -> Panel
 * - win (Window): Instance Window
 *
 * Créer un panneau permettant de configurer les règles de sécurité du logiciel.
 **/
	createPanelSecurity: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'security'});
		
		var forms = 		win.forms;
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Préférences des règles de sécurité'), $MUI('Changez les valeurs des champs du formulaire ci-contre (Toutes les modifications seront automatiquement enregistrées)') + ' :');
		splite.setIcon('system-setting-security-48');
		//
		//USE_SECURITY
		//
		forms.USE_SECURITY = 		new ToggleButton();
		forms.USE_SECURITY.Value($S.Meta('USE_SECURITY') || 0);
		//
		//MODERATOR_MODE_USER
		//
		forms.MODERATOR_MODE_USER = new ToggleButton();
		forms.MODERATOR_MODE_USER.Value($S.Meta('MODERATOR_MODE_USER') || 0);
		
		
		var table = 		new TableData();
		
		table.addHead($MUI('Sécurité suppression'), {style:'width:160px'}).addCel(forms.USE_SECURITY, {style:'text-align:right'}).addRow();
		table.addHead($MUI('Sécurité modérateur')).addCel(forms.MODERATOR_MODE_USER, {style:'text-align:right'}).addRow();
		//table.addHead('  ', {style:'height:10px'}).addRow();
		//table.addHead($MUI('Clef Gateway'), {className:'icon-password system-icon-field'}).addField($S.GATEWAY_KEY).addRow();
		
		panel.appendChild(splite);
		panel.appendChild(table);
		
		forms.USE_SECURITY.on('change', function(){
			win.ActiveProgress();
			$S.Meta('USE_SECURITY', this.value);
		});
		
		forms.USE_SECURITY.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option vous permet d\'activer ou désactiver la demande de mot de passe lorsque l\'utilisateur tente de supprimer une ressource du logiciel') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		forms.MODERATOR_MODE_USER.on('change', function(){
			win.ActiveProgress();
			$S.Meta('MODERATOR_MODE_USER', this.value);
		});
		
		forms.MODERATOR_MODE_USER.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cette option vous permet d\'activer ou désactiver le module de gestion des utilisateurs pour les modérateurs') + '.</p>').setType(FLAG.RIGHT).color('grey').show(this, true);
		});	
			
		return panel;	
	},
/** 
 * System.Settings.createPanelSecurity(win) -> Panel
 * - win (Window): Instance Window
 *
 * Créer un panneau permettant de configurer les règles de sécurité du logiciel.
 **/
	createPanelExport: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'file'});
		var splite =		new SpliteIcon($MUI('Gestionnaire d\'exportation'), $MUI('Choisissez les options d\'exportation de la base de données') + ' :');
		splite.setIcon('system-setting-export-48');
		
		var form =			{};
		
		form.submit = 		new SimpleButton({text:$MUI('Exporter'), type:'submit'});
		form.submit.css('margin-left', 15);		
		//
		// Form
		//
		form.Table =		new ListBox({
								type:		Checkbox.BOX,
								parameters:	'cmd=system.table.list',
								empty: 		'- '  + $MUI('Aucune table à exporter') + ' -',
							});
							
		form.Table.css('height', 250).css('width', 'auto');
		//
		//
		//
		form.Toggle =		new ToggleButton({type:'mini'});
		form.Toggle.css('float', 'left');
		//
		//
		//
		form.Backup_Software = new ToggleButton();
		form.Backup_Software.Value(false);
		//
		//
		//
		var table = 		new TableData();
		table.addHead($MUI('Liste des tables à exporter') + ' : ', {style:'width:165px; vertical-align:top'}).addField(form.Table, {style:'padding:0'}).addRow();
		table.addHead(' ').addCel(new Node('div', [form.Toggle, new Node('div', {style:'float: left; line-height: 22px;padding-left:7px;'}, $MUI('sélectionner / désélectionner'))])).addRow();
		table.addHead(' ', {height:9}).addRow();
		table.addHead($MUI('Faire une sauvegarde des fichiers') +' ? ').addCel(form.Backup_Software).addRow();
		//table.addHead($MUI('Format d\'exportation') +' : ').addField(form.Extensions).addRow();
		
		win.loadExport = function(){
			form.Table.load();
		};
		
		form.Backup_Software.on('change', function(){
			if(this.Value()){
				form.Extensions.parentNode.parentNode.hide();
			}else{
				form.Extensions.parentNode.parentNode.show();
			}
		});
		
		form.Table.on('change', function(){
			form.Toggle.Value(form.Table.select('.checkbox').length == form.Table.select('.checkbox.checked').length);
		});
		
		form.Toggle.on('change', function(){
			if(this.Value()){
				form.Table.select('.checkbox').each(function(e){
					e.Checked(true);
				});
			}else{
				form.Table.select('.checkbox').each(function(e){
					e.Checked(false);
				});	
			}
		});
		
		panel.appendChild(splite);
		panel.appendChild(table);
		panel.appendChild(form.submit);
		
		form.submit.on('click', function(){
			
			var array = form.Table.getChecked();
			
			if(array.length == 0){
				win.Flag.setText($MUI('Veuillez choisir au moins une table à exporter')).setType(FLAG.TOP).show(forms.Table, true);
				return;	
			}
			var list = [];
			array.each(function(data){
				list.push(data.value);
			});
			
			win.ActiveProgress();
			
			$S.exec('system.file.export', {
				parameters: 'Compile='+ (form.Backup_Software.Value() ? 1 : 0) +'&List=' + escape(Object.toJSON(list)),
				onComplete:	function(result){
					try{
						var file = result.responseText.evalJSON();
					}catch(er){
						return;
					}
					
					var iFrame =	new Node('iframe', {style:'width:300px;height:300px;display:none', name:'myframe', src:file});
															
					var box = win.createBox();
					var splite = new SpliteIcon($MUI('Téléchargement du fichier en cours'));
					splite.setIcon('valid-48');
					box.setTheme('flat liquid black');
					box.appendChild(iFrame);
					box.a(splite).Timer(5).setType('NONE').show();
				}
			});
		});
		
		return panel;
	},
/**
 * System.Settings.createPanelCronInfo(win) -> Panel
 * - win (Window): Instance Window
 *
 * Créer un panneau contenant les informations et documentations du logiciel.
 **/
	createPanelCronInfo: function(win){		
		//
		//Panel
		//
		var panel = 		new Panel({style:'width:550px'});
		
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Centre des tâches planifiées CRON'));
		splite.setIcon('system-setting-cron-48');
		panel.appendChild(splite);
		//
		// INFO
		//
		var table = new TableData();
		table.addHead($MUI('Statut'), {style:'width:150px'}).addField(System.CRON_STARTED ? $MUI('Actif') : $MUI('Stoppé')).addRow();
		table.addHead($MUI('Nombre de tâche')).addField(0).addRow();
		table.addHead($MUI('Version')).addField('').addRow();
						
		panel.appendChild(table);
		//
		// 
		//
		panel.appendChild(new Node('h4', $MUI('Tâches enregistrées')));	
		
		var nodeTasks = new Node('div', {className:'textarea', style:'height:200px;overflow:auto'});
		panel.appendChild(nodeTasks);
		
		panel.appendChild(new Node('h4', $MUI('Rapport d\'execution')));
		
		var nodeTextArea = new TextArea();
		nodeTextArea.css('width', '98%').css('height', '300px').css('line-height','20px');
		panel.appendChild(nodeTextArea);
		
		
		win.loadCron = function(){
			win.AlertBox.wait();
			panel.setOpacity(0);
			
			$.http.get('admin/system/cron/info').success(function(data){
				win.AlertBox.hide();
				
				panel.setOpacity(1);
				var info = data;
				//
				//
				//
				table.getCel(0,1).innerHTML = '<p><strong>' + (info.Statut ? $MUI('Actif') : $MUI('Stoppé')) +'</strong></p>';
				table.getCel(2,1).innerHTML = '<p><strong>CRON PHP v' + info.Version + '</strong></p>';
				
				y = 0;
				
				var tableTasks = new TableData();
				nodeTasks.removeChilds();
				nodeTasks.appendChild(tableTasks);

				for(var key in info.Tasks){
					task = info.Tasks[key];
					
					var icon = new AppButton({
						icon:	task.name + '-32',
						type:	'mini'
					});
					
					icon.addClassName('user');
						
					tableTasks.addCel(icon).addCel(task.name, {style:'font-size: 13px; padding-left: 5px;width:130px'});
										
					if(y % 2 == 1){
						tableTasks.addRow();
					}else{
						tableTasks.addCel(' ',  {style:'width:10px'});	
					}
					
					y++;
				}
				
				table.getCel(1,1).innerHTML = '<p><strong>' + y + '</strong></p>';
				
				nodeTextArea.Value(info.Log);
				
				nodeTextArea.scrollTop = 0;
			});
		};
		
		
		return panel;
	},
/**
 * System.Settings.createPanelInfo(win) -> Panel
 * - win (Window): Instance Window
 *
 * Créer un panneau contenant les informations et documentations du logiciel.
 **/
	createPanelInfo: function(win, type){
		var type = Object.isUndefined(type) ? 'info' : 'logo';
		
		//
		//Panel
		//
		var panel = 		new Panel({background:type, style:'width:430px'});
		
		//
		//Splite
		//
		var splite =		new SpliteIcon(type == 'info' ?  $MUI('Informations sur le logiciel') : $MUI('Panneau de configuration'), $S.NAME_VERSION + ' v' +  $S.version);
		splite.setIcon('system-setting-home-48');
		//
		//btnCoreJS
		//
		var btnCoreJS = 		new AppButton({text:$MUI('Codex<br />Javascript'), icon:'system-code-48'});
		//
		//btnCorePHP
		//
		var btnCorePHP = 		new AppButton({text:$MUI('Codex<br />PHP'), icon:'system-code-48'});
		//
		//btnCore
		//
		var btnExtends = 		new AppButton({text:'Codex<br />Extends ' + Extends.Version, icon:'system-extendsjs-48'});
		//
		//btnCore
		//
		var btnWindow = 		new AppButton({text:'Codex<br />Window ' + $WR.version, icon:'system-windowjs-48'});
		//
		//btnCore
		//
		var btnCGU = 			new AppButton({text:'CGU<br />Javalyss', icon:'system-agreement-48'});
		//
		//btnCore
		//
		var btnICON = 			new AppButton({text:'Liste des<br />icônes', icon:'system-icons-48'});
		
		var btnFLAG = 			new AppButton({text:'Liste des<br />drapeaux', icon:'system-flag-48'});
		//
		//Licence
		//
		var licence =	new HtmlNode();
		licence.setStyle('padding:0px;');
		licence.append('<p>' + ($S.LICENCE_VERSION ? $S.LICENCE_VERSION : 'This work is licensed under a Creative Commons Attribution 2.5 Generic License <a href="javascript:System.open(\'http://creativecommons.org/licenses/by/2.5/\', \'Licence logiciel\')">http://creativecommons.org/licenses/by/2.5/</a><div style="background:url(http://i.creativecommons.org/l/by/3.0/88x31.png) no-repeat center;height:31px;margin:4px"></div>') + '</p>');
		//
		//Table
		//
		var table = 		new TableData();
		table.addHead($MUI('Logiciel'));
		table.addField($S.NAME_VERSION).addRow();
		
		table.addHead($MUI('Version ')).addField($S.version).addRow();
		table.addHead($MUI('Date ')).addField($S.DATE_VERSION.toDate().format('l d F Y')).addRow();
		table.addHead('  ', {style:'height:10px'}).addRow();
		//table.addHead($MUI('Client(s)') + ' : ').addField($S.NAME_CLIENT).addRow();
		table.addHead($MUI('Contributeur(s)')).addField($S.CONTRIBUTORS).addRow();
		table.addHead('  ', {style:'height:10px'}).addRow();
		table.addHead($MUI('Licence'), {style:'vertical-align:top'}).addField(licence).addRow();
		table.addHead(' ').addCel([]);
		//
		// Widget
		//
		/*var widget = new Widget();
		widget.setTitle($MUI('Documentations'));
		widget.setIcon('file-doc');
		widget.appendChilds([btnCoreJS, btnCorePHP, btnWindow, btnExtends, btnICON, btnFLAG, btnCGU]);
		widget.setStyle('width:450px');
		widget.setStyle('min-height:0px');*/
				
		panel.appendChilds([
			splite,
			table,
			new Node('h4', $MUI('Documentations')),
			btnCoreJS, btnCorePHP, btnWindow, btnExtends, btnCGU
		]);
		
		var self = this;
		
		btnWindow.on('click', function(){self.openDoc($S.LINK_DOC_WINDOW, "Window JS");});
		btnExtends.on('click', function(){self.openDoc($S.LINK_DOC_EXTENDS, "Extends JS");});
		btnCoreJS.on('click', function(){self.openDoc($S.LINK_DOC_CORE, "Core JS");});
		btnCorePHP.on('click', function(){self.openDoc($S.LINK_DOC_CORE_PHP, "Core PHP");});
		btnCGU.on('click', function(){
			var win = System.open('http://javalyss.fr/cgu/javalyss.html', "Conditions générales d'utilisation");
			win.resizeTo(500, document.stage.stageHeight);
			win.moveTo('right', 'top');
		});
	
		return panel;
	},
	
	openDoc:function(link, title){
		var win = System.open(link, title);
		win.NoChrome(true);
		win.Resizable(false);
		win.resizeTo(990, document.stage.stageHeight);
		win.moveTo('right', 'top');
		win.setIcon('write');
		return win;
	}
};