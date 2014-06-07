/** section: BlogPress
 * class System.BlogPress.Setting
 *
 * Cet espace de nom gère la configuration de l'extension BlogPress.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : blogpress_setting.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.BlogPress.Setting = {
/**
 * System.BlogPress.Setting.Categories -> Array
 **/
	Categories: null,
/**
 * new System.BlogPress.Setting()
 **/
	initialize: function(){
		$S.observe('system:open.settings', function(win){
			win.TabControl.addPanel($MUI('Blogpress'), System.BlogPress.Setting.createPanelSystemSetting(win)).setIcon('blogpress');
		});
	},
/**
 * System.BlogPress.Setting.open(win) -> void
 **/
	open:function(strname){
		
		var win = $WR.unique('blogpress.setting', {
			autoclose:	true,
			action: function(){
				this.open(strname);
			}.bind(this)
		});
		
		//on regarde si l'instance a été créée
		if(!win) return;
				
		win.forms = {};
		win.setIcon('blogpress');
		win.setTitle($MUI('Panneau de configuration - BlogPress v') + $S.plugins.get('BlogPress').Version);
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
				
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();
		win.createHandler($MUI('Chargement en cours') + '...', true); 
		//
		// TabControl
		//
		win.createTabControl({type:'left', maximize:true});
		win.TabControl.addClassName('blogpress');
		
		$Body.appendChild(win);
			
		win.TabControl.addPanel($MUI('Général'), this.createPanelGlobal(win)).setIcon('setting-info');
		
		//win.TabControl.addPanel($MUI('Apparence'), this.createPanelTheme(win)).setIcon('icons').on('click', function(){
		//	win.refreshApparence()
		//});
		
		win.TabControl.addPanel($MUI('Options de lecture'), this.createPanelRead(win)).setIcon('setting-read').on('click', function(){
			win.loadReadOptions();
		});
		
		win.TabControl.addPanel($MUI('Options d\'écriture'), this.createPanelWrite(win)).setIcon('setting-write').on('click', function(){
			win.loadWriteOptions();
		});
		
		win.TabControl.addPanel($MUI('Options référencement'), this.createPanelReferencement(win)).setIcon('setting-referencement').on('click', function(){
			//win.loadWriteOptions();
		});
		
		win.TabControl.addPanel($MUI('Options d\'inscription'), this.createPanelRegister(win)).setIcon('setting-register').on('click', function(){
			win.loadRegisterOptions();
		});
		
		win.TabControl.addPanel($MUI('Options des accès'), this.createPanelAccess(win)).setIcon('setting-access').on('click', function(){
			win.loadAccessOptions();
		});
			
		//win.TabControl.addPanel($MUI('Paypal'), this.createPanelPaypal(win)).setIcon('paypal');
			
		$S.fire('blogpress:open', win);
			
		
		win.resizeTo('auto', 700);  
		win.centralize();
		
		if(Object.isString(strname) || Object.isNumber(strname)){
			try{win.TabControl.get(strname).click();}catch(er){}
		}
		
		return win;
	},
	
	createPanelSystemSetting: function(win){
		var panel = new Panel({style:'width:500px;min-height:500px;', background: ''});
		panel.addClassName('blogpress setting');
		panel.appendChild(new Node('H1', {style:'color:#F36F0E'}, $MUI('Configuration de BlogPress')));
		
		var array = [
			new AppButton({text:$MUI('Options générales'), icon:'setting-info-48'}),
			new AppButton({text:$MUI('Options de lecture'), icon:'setting-read-48'}),
			new AppButton({text:$MUI('Options d\'écriture'), icon:'setting-write-48'}),
			new AppButton({text:$MUI('Options de référencement'), icon:'setting-referencement-48'}),
			new AppButton({text:$MUI('Options d\'inscription'), icon:'setting-register-48'}),
			new AppButton({text:$MUI('Options des accès'), icon:'setting-access-48'})
		];
		
		for(var i = 0; i < array.length; i++){
			var node = new Node('span', {style:'display:inline-block; margin:5px 15px'}, array[i]);
			panel.appendChild(node);
			array[i].it = i;
			array[i].on('click', function(){
				System.BlogPress.Setting.open(this.it);
			});
		}
				
		return panel;
	},
/**
 * System.BlogPress.Setting.createPanelGlobal(win) -> Panel
 **/
	createPanelGlobal: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: ''});
		//
		//Splite
		//
		var splite =	new SpliteIcon($MUI('Options générales'));
		splite.setIcon('setting-info-48');
		//
		//
		//
		var forms = {};
		//
		// Submit
		//
		var submit = 			new SimpleButton({text:'Enregistrer les modifications', type:'submit', icon:'filesave'});
		//
		// BP_TITLE
		//
		forms.BP_TITLE = 		new Input({type:'text', maxLenght:200, className:'icon-cell-edit', value: $S.Meta('BP_TITLE') || ""});
		
		forms.BP_LOGO = 		new FrameWorker({
									multiple:false
								});
								
		forms.BP_LOGO.Value($S.Meta('BP_LOGO') || '');
		//
		// BP_SLOGAN
		//
		forms.BP_SLOGAN = 		new Input({type:'text', maxLenght:255, className:'icon-cell-edit', value: $S.Meta('BP_SLOGAN') || ""});
		//
		// BP_USE_POST
		//
		forms.CONTACT_PAGE = new Select({
			link:		$S.link,
			parameters:	'cmd=blogpress.post.select.list&options=' + Object.EncodeJSON({draft:false, Type:'like page', Statut:'publish'})
		});
		
		forms.CONTACT_PAGE.on('draw', function(line){
			
			if(line.data.level){
				var e = line.getText();
				for(var i = 0; i < line.data.level; i++){
					e  = '<span style="display:inline-block; width:5px; border-bottom:1px solid #F36F0E;position:relative; top:-4px; margin-right:3px"></span>' + e;	
				}
				line.setText(e);
			}else{
				
				if(line.data.children){
					line.Bold(true);
				}
			}
		});
			
		forms.CONTACT_PAGE.Value($S.Meta('CONTACT_PAGE') || "");
		forms.CONTACT_PAGE.load();
		//
		//
		//
		forms.BP_EMAIL = 	new InputRecipient({
			button:		false,
			parameters:	'cmd=mail.aggregate.list'///flux d'aggregation standard des mails de Javalyss
		});
		
		forms.BP_EMAIL.Value($S.Meta('BP_EMAIL')|| '');
		forms.BP_EMAIL.setStyle('margin:0; width:453px');
		//
		// Structure
		//
		forms.BP_REDIR_INDEX = new ToggleButton();
		forms.BP_REDIR_INDEX.Value($S.Meta('BP_REDIR_INDEX') == 1);
		//
		//BP_CONTACT
		//
		forms.BP_CONTACT = 	new ToggleButton();
		forms.BP_CONTACT.Value($S.Meta('BP_CONTACT') == 1);
		//
		//
		//
		//
		//
		//
		var table = new TableData();
		table.css('border-spacing', '4px');
		table.addHead($MUI('Titre du site'), {style:'width:160px'}).addField(forms.BP_TITLE).addRow();
		table.addHead($MUI('Slogan')).addField(forms.BP_SLOGAN).addRow();
		table.addHead($MUI('Logo')).addField(forms.BP_LOGO).addRow();
		var table3 = new TableData();
		table3.addHead($MUI('Le site est dans le même dossier que Javalyss ?'), {style:'width:337px'}).addCel(forms.BP_REDIR_INDEX, {style:'height:30px'}).addRow();
		
		var table4 = new TableData();
		table4.addHead($MUI('Les visiteurs peuvent me contacter ?'), {style:'width:337px'}).addCel(forms.BP_CONTACT, {style:'height:30px'}).addRow();	
		
		var table2 = new TableData();
		
		table2.addHead($MUI('Adresse de contact'), {style:'width:160px'}).addCel('').addRow();
		table2.addCel(forms.BP_EMAIL, {colSpan:2}).addRow();
		table2.addHead($MUI('Page de contact')).addField(forms.CONTACT_PAGE).addRow();
		
		panel.appendChild(splite);
		panel.appendChild(new Node('h4', $MUI('Informations sur le site')));
		panel.appendChild(table);
		panel.appendChild(table3);
		panel.appendChild(new Node('h4', $MUI('Gestion contact')));
		panel.appendChild(table4);
		panel.appendChild(table2);
		panel.appendChild(submit);
				
		submit.on('click', function(){			
			$S.Meta('BP_TITLE', forms.BP_TITLE.Value());
			$S.Meta('BP_SLOGAN', forms.BP_SLOGAN.Value());
			$S.Meta('BP_EMAIL', forms.BP_EMAIL.Value());
			$S.Meta('BP_CONTACT', forms.BP_CONTACT.Value() ? 1 : 0);
			$S.Meta('BP_LOGO', forms.BP_LOGO.Value());
			$S.Meta('CONTACT_PAGE', forms.CONTACT_PAGE.Value());
			
			win.ActiveProgress();
			$S.Meta('BP_REDIR_INDEX', forms.BP_REDIR_INDEX.Value() ? 1 : 0);
			
		});
						
		//Bulle info
		forms.BP_TITLE.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici le titre de votre site internet') + '.</p>');
			win.Flag.color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		forms.BP_SLOGAN.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici le slogan de votre site internet') + '.</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this, true);
		});
				
		forms.BP_CONTACT.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Activez ou désactiver le formulaire de contact pour que les visiteurs puissent vous contacter') + '.</p>');
			win.Flag.color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		forms.BP_EMAIL.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici l\'adresse e-mail pour que les utilisateurs puissent prendre contact avec vous') + '.</p>');
			win.Flag.color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		
		return panel;
	},
/**
 * System.BlogPress.Setting.createPanelRegister(win) -> Panel
 **/
	createPanelRegister: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'user'});
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Options d\'incription'), $MUI('Cette section vous permet de configurer le formulaire d\'inscription de votre site.'));
		splite.setIcon('setting-register-48');
		//
		//
		//
		var forms = 		{};
		//
		// Submit
		//
		var submit = 		new SimpleButton({text:'Enregistrer les modifications', type:'submit', icon:'filesave'});
		//
		//BP_REGISTER
		//
		forms.BP_REGISTER = 	new ToggleButton();
		forms.BP_REGISTER.Value($S.Meta('BP_REGISTER') || false);
		//
		//BP_REGISTER
		//
		forms.BP_REGISTER_VALID_REQ = 	new ToggleButton();
		forms.BP_REGISTER_VALID_REQ.Value($S.Meta('BP_REGISTER_VALID_REQ') || false);
		//
		//BP_REGISTER
		//
		forms.BP_REGISTER_PASS_AUTO = 	new ToggleButton();
		forms.BP_REGISTER_PASS_AUTO.Value($S.Meta('BP_REGISTER_PASS_AUTO') || false);
		//
		//BP_REGISTER
		//
		forms.BP_REGISTER_PHONE = 	new ToggleButton();
		forms.BP_REGISTER_PHONE.Value($S.Meta('BP_REGISTER_PHONE') || false);
		//
		//BP_REGISTER
		//
		forms.BP_REGISTER_ADDRESS = 	new ToggleButton();
		forms.BP_REGISTER_ADDRESS.Value($S.Meta('BP_REGISTER_ADDRESS') || false);
		//
		//BP_REGISTER
		//
		forms.BP_REGISTER_TYPE = new Select();
		forms.BP_REGISTER_TYPE.setData([
			{value:'0', text:$MUI('Particulier')},
			{value:'1', text:$MUI('Professionnel')},
			{value:'2', text:$MUI('Les deux')}
		]);
		forms.BP_REGISTER_TYPE.Value($S.Meta('BP_REGISTER_TYPE') || 0);
		//
		//BP_REGISTER
		//
		forms.BP_REGISTER_ROLE = new Select();
		forms.BP_REGISTER_ROLE.setData($S.getRolesAcces());
		forms.BP_REGISTER_ROLE.Value($S.Meta('BP_REGISTER_ROLE') || 3);
		//
		//BP_REGISTER
		//
		forms.BP_REGISTER_FROM_EMAIL = 	new Input({type:'email'});
		forms.BP_REGISTER_FROM_EMAIL.Value($S.Meta('BP_REGISTER_FROM_EMAIL') || '');
		
		//
		// 
		//
		var table = new TableData();
		table.css('border-spacing', '5px');
		table.addHead($MUI('Inscription ouverte aux visiteurs ?'), {style:'width:327px'}).addCel(forms.BP_REGISTER, {style:'height:30px'}).addRow();
		table.addHead($MUI('Un admin doit valider le compte ?')).addCel(forms.BP_REGISTER_VALID_REQ, {style:'height:30px'}).addRow();
		table.addHead($MUI('Génération automatique du mot de passe ?')).addCel(forms.BP_REGISTER_PASS_AUTO, {style:'height:30px'}).addRow();
		table.addHead($MUI('Activer l\'enregistrement du téléphone ?')).addCel(forms.BP_REGISTER_PHONE, {style:'height:30px'}).addRow();
		table.addHead($MUI('Activer l\'enregistrement des coordonnées ?')).addCel(forms.BP_REGISTER_ADDRESS, {style:'height:30px'}).addRow();
		
		var table2 = new TableData();
		table2.addHead($MUI('Adresse e-mail d\'émission :'), {style:'width:160px'}).addField(forms.BP_REGISTER_FROM_EMAIL).addRow();
		table2.addHead($MUI('Type d\'affichage du formulaire :'), {style:'width:160px'}).addField(forms.BP_REGISTER_TYPE).addRow();
		table2.addHead($MUI('Rôle par défaut des nouveaux inscrits :'), {style:'width:160px'}).addField(forms.BP_REGISTER_ROLE).addRow();
		//table2.addHead($MUI('Inscription ouverte aux visiteurs ?'), {style:'width:350px'}).addCel(forms.BP_REGISTER, {style:'height:30px'}).addRow();
		
		//table.addHead($MUI('La page d\'accueil affiche') + ' : ').addField(' ').addRow();	
		
		panel.appendChild(splite);
		//panel.appendChild(new Node('h3', $MUI('Inscription')));
		panel.appendChild(table);
		panel.appendChild(table2);
		
		panel.appendChild(submit);
		
		submit.on('click', function(){
						
			$S.Meta('BP_REGISTER', forms.BP_REGISTER.Value(), false);
			$S.Meta('BP_REGISTER_VALID_REQ', forms.BP_REGISTER_VALID_REQ.Value(), false);
			$S.Meta('BP_REGISTER_PASS_AUTO', forms.BP_REGISTER_PASS_AUTO.Value(), false);
			$S.Meta('BP_REGISTER_PHONE', forms.BP_REGISTER_PHONE.Value(), false);
			$S.Meta('BP_REGISTER_ADDRESS', forms.BP_REGISTER_ADDRESS.Value(), false);
			$S.Meta('BP_REGISTER_TYPE', forms.BP_REGISTER_TYPE.Value(), false);
			$S.Meta('BP_REGISTER_FROM_EMAIL', forms.BP_REGISTER_FROM_EMAIL.Value(), false);
			
			win.ActiveProgress();
			
			$S.Meta('BP_REGISTER_ROLE', forms.BP_REGISTER_ROLE.Value());
		});
				
		//Bulle info
		forms.BP_REGISTER.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Activez ou désactiver le formulaire d\'inscription pour les visiteurs de votre site internet') + '.</p>');
			win.Flag.color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		win.loadRegisterOptions = function(){
			
		};
				
		return panel;
	},
/**
 * System.BlogPress.Setting.createPanelRead(win) -> Panel
 **/
	createPanelRead: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'advanced'});
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Options de lecture'));
		splite.setIcon('setting-read-48');
		//
		//
		//
		var forms = {};
		//
		// Submit
		//
		var submit = 		new SimpleButton({text:'Enregistrer les modifications', type:'submit', icon:'filesave'});
		//
		//BP_HOME_STATIC
		//
		forms.BP_HOME_STATIC = 	new ToggleButton();
		forms.BP_HOME_STATIC.Value($S.Meta('BP_HOME_STATIC') == null ? true : $S.Meta('BP_HOME_STATIC'));
		
		$S.trace($S.Meta('BP_HOME_STATIC'));
		//
		// BP_USE_PAGE
		//
		forms.BP_HOME_PAGE = new Select({
			link:		$S.link,
			parameters:	'cmd=blogpress.post.select.list&options=' + Object.EncodeJSON({draft:false, Type:'like page', Statut:'publish'})
		});
		
		forms.BP_HOME_PAGE.Value($S.Meta('BP_HOME_PAGE'));
		
		forms.BP_HOME_PAGE.on('draw', function(line){
			
			if(line.data.level){
				var e = line.getText();
				for(var i = 0; i < line.data.level; i++){
					e  = '<span style="display:inline-block; width:5px; border-bottom:1px solid #F36F0E;position:relative; top:-4px; margin-right:3px"></span>' + e;	
				}
				line.setText(e);
			}else{
				
				if(line.data.children){
					line.Bold(true);
				}
			}
		});
		//
		// BP_USE_POST
		//
		forms.BP_BLOG_PAGE = new Select({
			link:		$S.link,
			parameters:	'cmd=blogpress.post.select.list&options=' + Object.EncodeJSON({draft:false, Type:'like page', Statut:'publish'})
		});
		
		forms.BP_BLOG_PAGE.on('draw', function(line){
			
			if(line.data.level){
				var e = line.getText();
				for(var i = 0; i < line.data.level; i++){
					e  = '<span style="display:inline-block; width:5px; border-bottom:1px solid #F36F0E;position:relative; top:-4px; margin-right:3px"></span>' + e;	
				}
				line.setText(e);
			}else{
				
				if(line.data.children){
					line.Bold(true);
				}
			}
		});
			
		forms.BP_BLOG_PAGE.Value($S.Meta('BP_BLOG_PAGE'));
		//
		// BP_NB_POST_PER_PAGE
		//
		forms.BP_NB_POST_PER_PAGE = new Input({type:'text', style:'width:40px;margin-right:5px;text-align:right', maxLenght:2, value: $S.Meta('BP_NB_POST_PER_PAGE') || 5});
		//
		// BP_NB_POST_PER_PAGE
		//
		forms.BP_NB_COMMENT_PER_PAGE = new Input({type:'text', style:'width:40px;margin-right:5px;text-align:right', maxLenght:2, value: $S.Meta('BP_NB_COMMENT_PER_PAGE') || 5});
		//
		// BP_NB_POST_PER_PAGE
		//
		forms.BP_SUMMARY = 			new Select();
		forms.BP_SUMMARY.setData([
			{value:0, text:$MUI('Le texte complet')},
			{value:1, text:$MUI('L\'extrait')}
		]);
		forms.BP_SUMMARY.Value($S.Meta('BP_SUMMARY') || 1);
		//
		// BP_CHARSET
		//
		forms.BP_CHARSET = 			new Input({type:'text', maxLenght:10, className:'icon-cell-edit', value: $S.Meta('BP_CHARSET') || "utf-8"});
		//
		//
		//
				
		//
		// 
		//
		var table = new TableData();
		table.css('border-spacing', '5px');
		table.addHead($MUI('La page d\'accueil une page statique') +' ?', {style:'width:160px'})
		table.addCel(forms.BP_HOME_STATIC, {style:'text-align:right'}).addRow();
		
		table.addHead($MUI('Page d\'accueil')).addField(forms.BP_HOME_PAGE, {style:'text-align:right'}).addRow();
		table.addHead($MUI('Page des articles')).addField(forms.BP_BLOG_PAGE, {style:'text-align:right'}).addRow();
		table.addHead($MUI('Les pages du site doivent afficher au plus')).addCel([forms.BP_NB_POST_PER_PAGE, $MUI('articles')]).addRow();
		table.addHead($MUI('Un article doit afficher au plus')).addCel([forms.BP_NB_COMMENT_PER_PAGE, $MUI('commentaires')]).addRow();
		
		//table.addHead($MUI('Les flux de syndication affichent les derniers')).addCel(forms.BP_NB_POST_PER_PAGE)..addRow();
		
		table.addHead($MUI('Pour chaque article d\'un flux, fournir')).addField(forms.BP_SUMMARY).addRow();
		table.addHead($MUI('Encodage pour les pages et les flux RSS')).addField(forms.BP_CHARSET);
		
		//table.addHead($MUI('La page d\'accueil affiche') + ' : ').addField(' ').addRow();
		
		if(!forms.BP_HOME_STATIC.Value()){	
			table.getRow(1).hide();
			table.getRow(2).hide();	
		}		
		
		panel.appendChild(splite);
		panel.appendChild(table);	
		panel.appendChild(submit);
		
						
		forms.BP_HOME_STATIC.on('change', function(){
			if(!this.Value()){
				table.getRow(1).hide();
				table.getRow(2).hide();		
			}else{
				table.getRow(1).show();
				table.getRow(2).show();	
			}
		});
		
		submit.on('click', function(){
			
			$S.Meta('BP_HOME_STATIC', forms.BP_HOME_STATIC.Value());
			$S.Meta('BP_HOME_PAGE', forms.BP_HOME_PAGE.Value());
			$S.Meta('BP_BLOG_PAGE', forms.BP_BLOG_PAGE.Value());
			$S.Meta('BP_NB_POST_PER_PAGE', forms.BP_NB_POST_PER_PAGE.Value());
			$S.Meta('BP_NB_COMMENT_PER_PAGE', forms.BP_NB_COMMENT_PER_PAGE.Value());
			$S.Meta('BP_SUMMARY', forms.BP_SUMMARY.Value());
			
			win.ActiveProgress();
			
			$S.Meta('BP_CHARSET', forms.BP_CHARSET.Value());
		});
				
		//Bulle info
		forms.BP_HOME_PAGE.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Choisissez une des pages de la liste pour qu\'elle soit affichée en tant que page d\'accueil sur votre site') + '.</p>');
			win.Flag.color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		forms.BP_BLOG_PAGE.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Choisissez une des pages de la liste pour qu\'elle soit utilisée pour afficher la liste des articles') + '</p>');
			win.Flag.setType(FLAG.RIGHT).color('grey').show(this, true);
		});
		
		win.loadReadOptions = function(){
			forms.BP_HOME_PAGE.load();
			forms.BP_BLOG_PAGE.load();
		};
				
		return panel;
	},
/**
 * System.BlogPress.Setting.createPanelWrite(win) -> Panel
 **/
	createPanelWrite: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'advanced'});
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Options d\'écriture'));
		splite.setIcon('setting-write-48');
		//
		//
		//
		var forms = {};
		//
		// Submit
		//
		var submit = 		new SimpleButton({text:'Enregistrer les modifications', type:'submit', icon:'filesave'});
		//
		//BP_HOME_STATIC
		//
		forms.BP_TRACKING = 	new ToggleButton();
		forms.BP_TRACKING.Value($S.Meta('BP_TRACKING') == null ? true : $S.Meta('BP_TRACKING'));
		//
		//BP_HOME_STATIC
		//
		forms.BP_COMMENT = 	new ToggleButton();
		forms.BP_COMMENT.Value($S.Meta('BP_COMMENT') == null ? true : $S.Meta('BP_COMMENT'));
		//
		//BP_HOME_STATIC
		//
		forms.BP_NOTE = 	new ToggleButton();
		forms.BP_NOTE.Value($S.Meta('BP_NOTE') == null ? true : $S.Meta('BP_NOTE'));
		//
		//
		//
		forms.BP_COMMENT_APPROVE = 	new ToggleButton();
		forms.BP_COMMENT_APPROVE.Value($S.Meta('BP_COMMENT_APPROVE') == null ? true : $S.Meta('BP_COMMENT_APPROVE'));
		//
		// 
		//
		var table = new TableData();
		table.css('border-spacing', '5px');
		table.addHead($MUI('Activer les commentaires') +' ?', {style:'width:250px'})
		table.addCel(forms.BP_COMMENT, {style:'text-align:right'}).addRow();
		
		table.addHead($MUI('Activer le suivi des commentaires') +' ?')
		table.addCel(forms.BP_TRACKING, {style:'text-align:right'}).addRow();
		
		table.addHead($MUI('Activer la notation') +' ?')
		table.addCel(forms.BP_NOTE, {style:'text-align:right'}).addRow();
		
		table.addHead($MUI('Le commentaire doit être validé par un modérateur') +' ?')
		table.addCel(forms.BP_COMMENT_APPROVE, {style:'text-align:right'}).addRow();
		
		panel.appendChild(splite);
		panel.appendChild(table);	
		panel.appendChild(submit);
				
		submit.on('click', function(){
			
			$S.Meta('BP_TRACKING', forms.BP_TRACKING.Value());
			$S.Meta('BP_COMMENT', forms.BP_COMMENT.Value());
			$S.Meta('BP_NOTE', forms.BP_NOTE.Value());
			
			win.ActiveProgress();
			
			$S.Meta('BP_COMMENT_APPROVE', forms.BP_COMMENT_APPROVE.Value());
		});
				
		
		
		win.loadWriteOptions = function(){
			
		};
				
		return panel;
	},
/**
 * System.BlogPress.Setting.createPanelAccess(win) -> Panel
 **/
	createPanelAccess: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'advanced'});
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Options des accès'), $MUI('Cette section vous permet de configurer la façon dont BlogPress doit rediriger les utilisateurs en fonction de leurs groupes lorsqu\'ils se connectent à votre site internet. Par défaut, ils accèdent à l\'interface Javalyss !'));
		splite.setIcon('setting-access-48');
		//
		//
		//
		var forms = {};
		//
		// Submit
		//
		var submit = new SimpleButton({text:'Enregistrer les modifications', type:'submit', icon:'filesave'});
		//
		//BP_ADMIN_ENABLE
		//
		forms.BP_ADMIN_ENABLE = 	new ToggleButton();
		forms.BP_ADMIN_ENABLE.Value($S.Meta('BP_ADMIN_ENABLE') || false);
		//
		//
		//	
		var table1 = new TableData();
		table1.css('border-spacing', '5px');
		table1.addHead($MUI('Activer la redirection en fonction des groupes ?'), {style:'width:350px'}).addCel(forms.BP_ADMIN_ENABLE, {style:'height:30px'}).addRow();
		
		var table2 = new TableData();
		table2.addHead($MUI('Choississez les pages pour les groupes suivants') + ' :', {colSpan:2, style:'padding-bottom:5px;'}).addRow();
		
		var roles = $S.getRolesAcces();
		var options = $S.Meta('BP_ADMIN_OPTIONS') || [];
		
		forms.BP_ADMIN_OPTIONS = [];
		
		for(var i = 1; i < roles.length; i++){
			//if(roles[i].text.slice(0,1) == '[') continue;
			
			var node = new Select();
			node.Value(options[roles[i].value] || 0);
					
			table2.addHead(roles[i].text, {style:'width:160px'}).addField(node).addRow();
			forms.BP_ADMIN_OPTIONS[roles[i].value] = node;
		}
		
		win.loadAccessOptions = function(){	
			$S.exec('blogpress.post.select.list', {
				parameters: 'options=' + Object.EncodeJSON({default: $MUI('Back office Javalyss'), draft:true, Type:'like page'}),
				onComplete: function(result){
					try{
						var data = result.responseText.evalJSON();
					}catch(er){alert(er)}
					
					for(var i = 1; i < roles.length; i++){
						forms.BP_ADMIN_OPTIONS[roles[i].value].setData(data);
					}
				}
			});
		};
				
		panel.appendChild(splite);
		panel.appendChild(table1);	
		
		panel.appendChild(table2);
		panel.appendChild(submit);
		
		submit.on('click', function(){
			
			$S.Meta('BP_ADMIN_ENABLE', forms.BP_ADMIN_ENABLE.Value());		
			win.ActiveProgress();
			
			var roles = 	$S.getRolesAcces();
			var access = 	[];
			
			for(var i = 1; i < roles.length; i++){
				access[roles[i].value] = forms.BP_ADMIN_OPTIONS[roles[i].value].Value();
			}
			
			$S.Meta('BP_ADMIN_OPTIONS', access);
			
			win.loadAccessOptions();
		});
				
		return panel;
	},
/**
 * System.BlogPress.Setting.createPanelReferencement(win) -> Panel
 **/
	createPanelReferencement: function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: 'advanced'});
		//
		//Splite
		//
		var splite =		new SpliteIcon($MUI('Options de référencement'));
		splite.setIcon('setting-referencement-48');
		//
		//
		//
		var forms = {};
		//
		// Submit
		//
		var submit = 			new SimpleButton({text:'Enregistrer les modifications', type:'submit', icon:'filesave'});
		//
		// BP_TITLE
		//
		forms.BP_SCHEME_TITLE = new Input({type:'text', maxLenght:200, className:'icon-cell-edit', value: $S.Meta('BP_SCHEME_TITLE') || "#POST | #TITLE"});
		//
		// BP_KEYWORDS
		//
		forms.BP_KEYWORDS = 	new Node('textarea', {style:'height:100px'});
		forms.BP_KEYWORDS.innerHTML = $S.Meta('BP_KEYWORDS') || "";
		//
		// BP_EMAIL
		//
		forms.BP_DESCRIPTION = 	new Node('textarea', {style:'height:100px'});
		forms.BP_DESCRIPTION.innerHTML = $S.Meta('BP_DESCRIPTION') || "";
		//
		//
		//
		forms.BP_GOOGLE_VERIFICATION = 		new Input({type:'text', maxLenght:50, className:'icon-cell-edit', value: $S.Meta('BP_GOOGLE_VERIFICATION') || ""});
		//
		//BP_ENABLE_INDEXED_CONTENT
		//
		forms.BP_ENABLE_INDEXED_CONTENT = 	new ToggleButton();
		forms.BP_ENABLE_INDEXED_CONTENT.Value($S.Meta('BP_ENABLE_INDEXED_CONTENT') || true);
		
		var table = new TableData();
		table.css('border-spacing', '5px');
		table.addHead($MUI('Structure d\'un titre de page'), {style:'width:350px'}).addField(forms.BP_SCHEME_TITLE, {style:'height:30px'}).addRow();
		table.addHead($MUI('Mots clefs'), {style:'vertical-align:top'}).addField(forms.BP_KEYWORDS).addRow();
		table.addHead($MUI('Description'), {style:'vertical-align:top'}).addField(forms.BP_DESCRIPTION).addRow();
		table.addHead($MUI('Code Google vérification')).addField(forms.BP_GOOGLE_VERIFICATION).addRow();
		table.addHead($MUI('Authoriser les robots à indexer les pages ?')).addCel(forms.BP_ENABLE_INDEXED_CONTENT).addRow();
		
		panel.appendChild(splite);
		panel.appendChild(table);
		panel.appendChild(submit);	
		
		submit.on('click', function(){
			
			$S.Meta('BP_SCHEME_TITLE', forms.BP_SCHEME_TITLE.Value());
			$S.Meta('BP_GOOGLE_VERIFICATION', forms.BP_GOOGLE_VERIFICATION.Value());
			$S.Meta('BP_KEYWORDS', forms.BP_KEYWORDS.value.replace(/\n|\r/gi, '').slice(0, 300));
			$S.Meta('BP_DESCRIPTION', forms.BP_DESCRIPTION.value.replace(/\n|\r/gi, '').slice(0, 300));
			
			win.ActiveProgress();
			
			$S.Meta('BP_ENABLE_INDEXED_CONTENT', forms.BP_ENABLE_INDEXED_CONTENT.Value(), function(){
				$S.exec('blogpress.write.robots.txt');	
			});
					
		});
		
		forms.BP_KEYWORDS.on('keydown', function(){
			this.value = this.value.replace(/\n|\r/gi, '').slice(0, 300);
		});
		
		forms.BP_DESCRIPTION.on('keydown', function(){
			this.value = this.value.replace(/\n|\r/gi, '').slice(0, 300);
		});
		
		win.Flag.add(forms.BP_SCHEME_TITLE, {
			orientation: 	Flag.RIGHT,
			text:			$MUI('Saisissez ici la structure du titre de référencement d\'une page. Exemple si vous saisissez : #POST | #TITLE, le titre référencé sera : "Le titre du post | le titre du site"'),
			icon:			'documentinfo',
			color:			'grey'
		});
		
		win.Flag.add(forms.BP_GOOGLE_VERIFICATION, {
			orientation: 	Flag.RIGHT,
			text:			$MUI('Saisissez ici la clef de vérification de votre site fournit par Google'),
			icon:			'documentinfo',
			color:			'grey'
		});
				
		forms.BP_KEYWORDS.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici les mots clefs séparés par des "," pour le référencement de votre site internet') + '.</p>');
			win.Flag.color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		forms.BP_DESCRIPTION.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici une description de votre site. Cette description sera utilisée pour le référencement') + '.</p>');
			win.Flag.color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
				
		return panel;
	}
};

System.BlogPress.Setting.initialize();