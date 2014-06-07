/** section: Core
 * System.Template
 * 
 * Cette classe gère les formulaires de personnalisation du thème du logiciel. 
 * Au traver du formulaire vous pourrez changer le thème à votre convenance.
 *
 * Ci-contre, le gestionnaire des thèmes :
 *
 * <img src="http://www.javalyss.fr/sources/form-themes.png" />
 * 
 * #### Arborescence des thèmes
 *
 * Les thèmes du logiciel sont listés à partir des dossiers contenues dans le dossier principale des thèmes :
 *
 * <img src="http://www.javalyss.fr/sources/arborescence-themes.png" />
 *
 * Ci-dessus, vous avez la liste de dossier. L'identifiant d'un thème est déterminé à partir de son nom de dossier.
 * Ici, vous avez `abstudioartphoto` qui constitue un identifiant du thème AbStudioArtPhoto 0.1.
 *
 * #### Prise en compte du thème par le logiciel
 *
 * Le logiciel ne prend en compte que les dossiers remplissant les conditions suivantes :
 *
 * * Le dossier doit avoir au moins un fichier `.css` ou `.php`
 * * Ce fichier doit avoir une entête de description standard.
 * 
 * #### Entête d'un fichier de thème
 *
 * Ci-dessous l'entête d'un fichier de thème :
 *
 * <img src="http://www.javalyss.fr/sources/entete-themes.png" />
 *
 **/
System.Template = System.themes = {
	
	initialize:function(){
		System.ready(function(){
			System.exec('system.template.list', function(result){
				try{
					System.Template.setObject(result.responseText.evalJSON());	
				}catch(er){
					
				}
			});
		});
	},
/**
 * System.Template.open() -> void
 *
 * Cette méthode ouvre le formulaire principal.
 **/
	open: function(){
		try{
			if(!(Object.isUndefined(this.win) || this.win == null)){
				try{
					this.win.close();
				}catch(er){}
				this.win = null;
			}
			//
			// Window
			//
			var win = 	this.win = new Window();
			win.setIcon('system-account-template');
			//win.setTitle($MUI('Centre des thèmes'));
			win.Resizable(false);
			win.ChromeSetting(true);//setClassName('window-panneau-config window-panneau-themes');
			win.createBox();
			win.createFlag();
			win.Body().setStyle('overflow:visible');
			win.createHandler($MUI('Mise à jour du thème en cours') + '...', true);
			
			$Body.appendChild(this.win);
			//
			// TabControl
			//
			win.TabControl = 	new TabControl();
			//win.TabControl.setStyle('margin:5px; width:580px');	
			win.TabControl.setStyle('margin:-1px');
			win.TabControl.Header().setStyle('position:absolute;top:-19px; padding-left:22px;');
			win.appendChilds([win.TabControl]);

			//génération des principaux panneaux
			win.TabControl.addPanel($MUI('Les thèmes'), win.PanelT = this.createPanelChoice(win)).setIcon('icons').on('click',function(){
				win.refresh();
			});
			
			win.TabControl.addPanel($MUI('Fond d\'écran'), win.PanelG = this.createPanelBackground(win)).setIcon('display-edit');
			win.TabControl.addPanel($MUI('Personnalisation avancée'), this.createPanelDynamic(win)).setIcon('style');
			
			$S.fire('themes:open', this.win);
			
			win.PanelT.refresh();
			
			win.centralize();
			
			this.win.observe('close', function(){this.win = null}.bind(this));

			//this.win.TabControl.select(Object.isNumber(it) ? it : 0);
		
		}catch(er){$S.trace(er)}
		
	},
/**
 * System.Template.createPanelBackground(win) -> Element
 * - win (Window): Instance d'une fenêtre.
 *
 * Cette méthode crée le panneau de configuration du fond d'écran.
 **/
	createPanelBackground:function(win){
		//
		// Panel
		//
		var Panel = 		new Node('div', {className:"panel panel-theme", style:'width:500px;min-height:500px;'});
		//
		// ScreenDiv
		//
		var screenDiv = 	new Node('div', {className:'system-screen'});
		//
		// ScreenDiv2
		//
		var screenDiv2 = 	new Node('div', {className:'system-screen-2', style:'background-image:url("'+ ($U('BACKGROUND') || '') +'");'});
		//
		// Splite
		//
		var splite =		new SpliteIcon($MUI('Personnalisation du fond d\'écran'), $MUI('Choisir un arrière plan pour votre bureau') + ' : ');
				
		splite.setIcon('system-account-background-48');
		screenDiv.appendChild(screenDiv2);
		
		
		Panel.Background = 	new InputButton({sync:true, icon:'fileimport'});
		Panel.Background.Text($U('BACKGROUND') || ('- '+$MUI('aucun fond d\'écran') +' -'));
		
		Panel.submit = new SimpleButton({text:$MUI('Enregister le fond d\'écran'), icon:'filesave', type:'submit'});
		Panel.submit.setStyle('margin-top:10px');
		
		
		var table = new TableData();
		
		table.addHead($MUI('Fond d\'écran') + ' : ').addField(Panel.Background);
		
		Panel.appendChilds([
			splite,
			screenDiv,
			table,
			Panel.submit,
		]);
				
		var folder = Object.isUndefined($U('BACKGROUND')) ? null : $U('BACKGROUND');
		
		Panel.Background.SimpleButton.on('click',function(){
			$FM().join(folder, function(file){
				Panel.Background.Value(file.uri);
				Panel.Background.Text(file.uri);
				screenDiv2.setStyle('background-image:url("'+ file.uri+'");');
				$S.Background.setStyle('background-image:url("'+ file.uri+'");background-repeat:no-repeat; background-position:center');
				
			});
			
		});
		
		Panel.submit.on('click',function(){
			win.ActiveProgress();
			
			$U('BACKGROUND', Panel.Background.Text());
			
			var splite = new SpliteIcon($MUI('Fond d\'écran correctement sauvegardé')+'.');
			splite.setIcon('filesave-ok-48');
			
			win.AlertBox.setTitle($MUI('Confirmation')).a(splite).setType('NONE').Timer(3).show();
		});
		
						
		return Panel;
	},
/**
 * System.Template.createPanelChoice() -> Element
 * - win (Window): Instance d'une fenêtre.
 *
 * Cette méthode crée le panneau permettant de personnaliser le thème du logiciel.
 **/
	createPanelChoice:function(win){
				
		var Panel = 		new Node('div', {className:"panel panel-theme", style:'min-width:510px;min-height:500px;'});
		//
		//
		//
		var btnActive = new SimpleButton({text:$MUI('Activer')});
		//btnActive.setStyle('position:absolute; right:88px; top:2px');
		btnActive.hide();
		//
		//
		//
		var btnPreview = new SimpleButton({text:$MUI('Prévisualiser')});
		//btnPreview.setStyle('position:absolute;right:2px; top:2px');
		//
		// Widget
		//
		var widget = new Widget();
		widget.Title($MUI('Thème'));
		//widget.setStyle('margin:0px;border-left:0px;background:transparent;');
		widget.Body().setStyle('height:400px;');
		
		widget.createScrollBar();
		widget.HTML = new HtmlNode();
		widget.appendChild(widget.HTML);
		widget.addGroupButton([btnActive, btnPreview]);
		
		widget.setText = function(theme){
			this.HTML.innerHTML =  '';
			this.HTML.append('<h1 class="lighter" style="margin-top:0">' + theme.Name + ' <span style="color:#235A81">' + theme.Version + '</span><p>' + $MUI('Créé par') + ' ' + theme.Author +'</p></h1>');
			this.HTML.append('<h2>' + $MUI('Description') + '</h2>');
			this.HTML.append('<p>' + theme.Description + '</p>');
			this.HTML.append('<h2>' + $MUI('Aperçu') + '</h2>');
			this.HTML.append('<div style="text-align:center"><div style="height:180px; width:240px;margin:auto; overflow:hidden;border:5px solid white;"><img style="width:240px" src="'+ theme.PathURI + '/screenshot.png" /></div></div>');
			
			if(Object.toJSON(theme) != Object.toJSON(self.Current)){
				btnActive.show();
			}else{
				btnActive.hide();
			}
			
			self.Selected = theme;
						
			widget.ScrollBar.refresh();
		};
		//
		// HeadPieceList
		//
		var widgetTheme = 	new HeadPieceList({select:false});
		widgetTheme.Body().setStyle('height:400px');
		widgetTheme.setTitle($MUI('Choix des thèmes'));
				
		widgetTheme.ScrollBar.observe('update', function(){
			if(widgetTheme.ScrollBar.isScrollable()){
				//widgetTheme.Body().setStyle('width:488px');
			}else{
				//widgetTheme.Body().setStyle('width:468px');
			}
		});
		//
		//
		//
		var widgets = new WidgetContainer({dragdrop:false, number:2}); 
		widgets.setStyle('width:800px; margin-bottom:10px');
		widgets.Compact(true);
		widgets.appendChild(widgetTheme);
		widgets.appendChild(widget);
		widgets[0].setStyle('width:300px');
		widgets[1].setStyle('width:500px');
			
		Panel.appendChilds([
			splite,
			widgets
		]);
		//
		// Splite
		//
		var splite =		new SpliteIcon($MUI('Personnalisation du thème'), $MUI('Cliquez sur un thème pour en afficher sa description') + ' :');
		splite.setIcon('system-account-template-48');	
		
		Panel.appendChilds([
			splite,
			widgets
		]);
		
		win.refresh = function(){
			widgetTheme.clear();
			
			for(var key in this.options){
				var hp = new HeadPiece({
					resize:	true,
					src: 	this.options[key].PathURI + '/screenshot.png',
					title:	this.options[key].Name + ' ' + this.options[key].Version
				});
				
				widgetTheme.appendChild(hp);
							
				hp.data = this.options[key];
				hp.data.ThemeKey = key.split('/')[0];
				
				hp.on('click',function(){
					widget.setText(this.data);
				});
				
				if(hp.data.ThemeKey == ($U('THEME') || 'system')){
					
					self.LastTheme = $U('THEME') || 'system';
					
					hp.Selected(true);
					this.Current = hp.data;	
					widget.setText(hp.data);
				}
			}
		}.bind(this);
		
		btnPreview.on('click', function(){
			$THM().changeThemes(self.LastTheme, self.Selected.ThemeKey);
			self.LastTheme = self.Selected.ThemeKey;
		}.bind(this));
		
		btnActive.on('click',function(){
			//win.ActiveProgress();
			
			$U('THEME', self.Selected.ThemeKey);
			
			new Timer(function(){$S.reload()}, 3).start();
			
			var splite = new SpliteIcon($MUI('Redémarrage en cours') + '...', $MUI('Application des nouveaux paramètres du thème. Patientez svp') + '...');
			splite.setIcon('colors-48');
			
			$S.AlertBox.a(splite).ty('NONE').show();
			$S.AlertBox.setIcon('colors');
		}.bind(this));
		
		return Panel;
	},
/**
 * System.Template.createPanelDynamic(win) -> Element
 * - win (Window): Instance d'une fenêtre.
 *
 * Cette méthode permet de personnaliser le thème nommé `dynamic`. Le thème `dynamic` offre une personnalisation plus avancée du logiciel.
 **/
	createPanelDynamic: function(win){
		
		var Panel = 		new Node('div', {className:"panel panel-advanced", style:'width:500px;min-height:500px;'});
		//
		//
		//
		var forms = {};
		//
		// Effect
		//
		forms.Effect = new Select();
		forms.Effect.setData([
			{value:0, text:$MUI('Gradient')},
			{value:1, text:$MUI('Glass')}
		]);
		forms.Effect.Value($U('Effect') || 0);
		//
		// Color
		//
		forms.ForeColor = 		new InputColor();
		forms.ForeColor.setValue($U('ForeColor') || '#000');
		//
		// Text
		//
		forms.Text =			new InputColor($U('TextColor') || '#FFF');
		forms.Text.setValue($U('TextColor') || '#FFF');
		//
		// Over
		//
		forms.ForeColorOver = 	new InputColor($U('ForeColorOver') || '#666');
		forms.ForeColorOver.setValue($U('ForeColorOver') || '#666');
		//
		// Text
		//
		forms.TextOver =		new InputColor($U('TextColorOver') || '#FFF');
		forms.TextOver.setValue($U('TextColorOver') || '#FFF');
		//
		// Table
		//
		var table = new TableData();
		table.setStyle('margin-left:20px;margin-bottom:10px; width:500px !important');
		
		table.addHead(new Node('H3', $MUI('Général'))).addRow();
		//table.addHead($MUI('Effet') + ' :', {style:'width:190px !important'}).addField(forms.Effect).addRow();
		table.addHead($MUI('Couleur de fond') + ' :', {style:'width:190px !important'}).addField(forms.ForeColor).addRow();
		table.addHead($MUI('Couleur du texte') + ' :').addField(forms.Text).addRow();
		table.addHead(new Node('H3', $MUI('Au survol'))).addRow();
		table.addHead($MUI('Couleur de fond') + ' :').addField(forms.ForeColorOver).addRow();
		table.addHead($MUI('Couleur du texte') + ' :').addField(forms.TextOver).addRow();
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Gestion de thème personnalisé'), $MUI('Choisissez vous même les couleurs de votre thème en changeant les valeurs du formulaire') + ' :');
		splite.setIcon('style-48');
		//
		//
		//
		forms.submit = 		new SimpleButton({text:$MUI('Appliquer'), icon:'filesave', type:'submit'});
		//
		//
		//
		forms.preview = 		new SimpleButton({text:$MUI('Aperçu'), icon:'search'});
		
		Panel.appendChilds([
			splite,
			table,
			forms.submit,
			forms.preview
		]);
		
		new ButtonInteract(win, {
			manuelid:	17,
			incident:	'Centre des thèmes - Personnalisation avancée',
			node:		Panel
		});
		
		forms.submit.on('click',function(){
			win.ActiveProgress();
			
			$U().setMeta('Effect', forms.Effect.Value(), true);
			$U().setMeta('ForeColor', forms.ForeColor.getValue(), true);
			$U().setMeta('TextColor', forms.Text.getValue(), true);
			$U().setMeta('ForeColorOver', forms.ForeColorOver.getValue(), true);
			$U().setMeta('TextColorOver', forms.TextOver.getValue(), true);
			
			$U().setMeta('THEME', 'dynamic');
			
			new Timer(function(){
				$S.reload();
			}, 2, 1).start();
			
			var splite = new SpliteIcon($MUI('Redémarrage en cours') + '...', $MUI('Application des nouveaux paramètres du thème. Patientez svp') + '...');
			splite.setIcon('colors-48');
			
			$S.AlertBox.ti($MUI('Gestion des thèmes')).a(splite).ty('NONE').show();
			$S.AlertBox.setIcon('colors');
		});
		
		forms.preview.on('click', function(){
			$Body.hide();
				
			$('system-window-css').href = 	'themes/window.css.php?themes=dynamic&preview=true&Effect=0&ForeColor=' 
											+ forms.ForeColor.getValue().replace('#', '')
											+ '&Text=' + forms.Text.getValue().replace('#', '') 
											+ '&ForeColorOver=' + forms.ForeColorOver.getValue().replace('#', '')
											+ '&TextOver=' + forms.TextOver.getValue().replace('#', '');
											
			$('system-css').href = 			'themes/style.css.php?themes=dynamic&preview=true&Effect=0&ForeColor=' 
											+ forms.ForeColor.getValue().replace('#', '')
											+ '&Text=' + forms.Text.getValue().replace('#', '') 
											+ '&ForeColorOver=' + forms.ForeColorOver.getValue().replace('#', '')
											+ '&TextOver=' + forms.TextOver.getValue().replace('#', '');
					
			new Timer(function(){
				$Body.show();
				$P.optimizeDimensions();
				
			}, 2, 1).start();
		
		});
				
		return Panel;
	},
/**
 * System.Template.changeThemes(themename) -> void
 * - themename (String): Nom d'identification du thème.
 *
 * Cette méthode change le thème du logiciel à partir de son nom d'identification.
 * 
 * <p class="note">Ce changement est temporaire !</p>
 *
 * Pour déterminer un nom de thème il suffit de vous rendre dans le dossier des thèmes
 * du logiciel. Ensuite chaque nom de dossier constitue un thème (excepté icon et window).
 * 
 * Ci-contre l'arborescence des thèmes :
 *
 * <img src="http://www.javalyss.fr/sources/arborescence-themes.png" />
 *
 * Par exemple, abstudioartphoto est le nom du thème. Si vous-voulez en faire un aperçu, il vous suffit d'écrire le code suivant :
 *
 *     //procédure pour créer un aperçu du thème
 *     $TH.changeThemes('abstudioartphoto');
 *     //application du thème à l'utilisateur
 *     $U('THEME', 'abstudioartphoto');
 *
 **/
	changeThemes: function(oTheme, nTheme){
		
		$Body.hide();
		$$('.system-window-css').each(function(node){
			node.href = 	node.href.replace('compile/' + oTheme, 'compile/' + nTheme).replace('compile/default', 'compile/' + nTheme);
			$S.trace(node.href);
		});
		
		new Timer(function(){
			$Body.show();
		}, 2, 1).start();
		
		//this.Current = theme.ThemeKey;		
	},
/**
 * System.Template.setObject(obj) -> void
 **/
	setObject: function(obj){
		this.options = obj;
		this.array = 	[];	
		
		for(var key in this.options){
			this.array.push({
				text: 	this.options[key].Name + ' ' + this.options[key].Version,
				value: 	this.options[key].ThemeKey
			});
		}
	}
};

System.Template.initialize();
/*
 * $THM() -> ThemesManager
 *
 **/
function $THM(){
	return System.Template;
}

System.Template.Button = Class.from(AppButton);

System.Template.Button.prototype = {
	className:'wobject button-template',
/*
 *
 **/	
	initialize:function(){
		//
		//
		//
		this.ButtonEnable = new SimpleButton({text:$MUI('Activer')});
		//
		//
		//
		this.ButtonPreview = new SimpleButton({text:$MUI('Visualiser')});
		//
		//
		//
		this.ButtonDetails = new SimpleButton({text:$MUI('Détail')});
	}
};
