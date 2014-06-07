/** section: plugin
 * class jCarouselManager
 *
 * Cet espace de nom gère l'extension jCarouselManager.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_jcarousel.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.jGalery = Class.createAjax({
/**
 * jGalery#Galery_ID -> Number
 **/
	Galery_ID: 0,
/**
 * jGalery#User_ID -> Number
 **/
	User_ID: 	0,
/**
 * jGalery#Name -> String
 * Varchar
 **/
	Name: 		"",
/**
 * jGalery#Settings -> String
 * Text
 **/
	Settings: 	"",
/**
 * jGalery#Private -> Number
 **/
	Private: 	0,
/**
 * jGalery#Password -> String
 * Varchar
 **/
	Password: 	"",
/**
 * jGalery#Type -> String
 * Longtext
 **/
	Type: 		"jcarousel",
/**
 * jGalery#Order -> String
 * Number
 **/	
	Order:	0,
/**
 * new jGalery()
 *
 **/
 	initialize:function(options){
		if(!Object.isUndefined(options)){
			this.setObject(options);
		}
		
		if(this.Settings == ''){
			this.Settings = {};	
		}
	},
/**
 * System.jGalery#commit([callback [, error]]) -> void
 **/	
	commit:function(callback, error){
		$S.exec('jgalery.commit',{
			parameters:'jGalery=' + this.toJSON(),
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
 * System.Contact#exists([callback [, error]]) -> void
 **/	
	exists:function(callback, error){
		$S.exec('jgalery.exists',{
			parameters:'jGalery=' + this.toJSON(),
			onComplete:function(result){
				try{
					var bool = result.responseText.evalJSON();
				}catch(er){
					if(Object.isFunction(error)){
						error.call(this, result.responseText);	
					}
					return;	
				}
				
				if(Object.isFunction(callback)){
					callback.call(this, bool);	
				}
			}.bind(this)
		});
		
		return this;
	},
/**
 * System.jGalery#remove([callback [, error]]) -> void
 **/	
	remove:function(callback, error){
		$S.exec('jgalery.delete',{
			parameters:'jGalery=' + this.toJSON(),
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

Object.extend(System.jGalery, {
/**
 *
 **/		
	initialize:function(){
		$S.observe('system:startinterface', this.startInterface.bind(this));
		
		$S.observe('jpicture:submit.complete', function(){
			var win = $WR.getByName('jgalery');
			
			if(win){
				this.getListPictures(win, win.jGalery.Current);
			}
			
		}.bind(this));
		
		$S.observe('jpicture:remove.complete', function(picture){
			var win = $WR.getByName('jgalery');
			
			if(win){
				//if(picture.Galery_ID == win.jGalery.Current.Galery_ID){
					this.getListPictures(win, win.jGalery.Current);
				//}
			}
			
		}.bind(this));
		
		$S.observe('blogpress:create.editor', this.onCreateEditor.bind(this));
		//$S.observe('blogpress:post.open', this.onOpenBlogpressEditor.bind(this));
		
	},
	
	startInterface:function(){
		
		this.Menu = $S.DropMenu.addMenu($MUI('Galeries'), {icon:'jgalery', appName:'jGalery'}).observe('click', function(){this.open()}.bind(this));	
		
	},
/**
 * System.jGalery.open() -> void
 **/
	open:function(bool){
		var win = $WR.unique('jgalery', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('jgalery');
		
		win.forms = {};
		
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('jgalery');
		win.addClassName('jgalery');
		//
		// TabControl
		//
		//win.createTabControl({offset:22});
		win.appendChild(this.createPanel(win));
		//win.TabControl.addSimpleMenu(new SimpleMenu({text:$MUI('Explorer'), icon:'folder'}).on('click', this.explorer.bind(this)));
				
		$Body.appendChild(win);
		
		$S.fire('jgalery:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
		
		if(bool !== true) {
			//win.jGalery.BtnHost.click();
		}
		
		return win;
	},
/**
 * System.jGalery.openSetting(win, galery) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode ouvre une galerie.
 **/	
	openSetting:function(win, galery){
		
		galery = new System.jGalery(galery);
		
		try{
		win.jGalery.PanelSwip.clear();		
		
		var flag = 	win.createFlag();
		var form = {};
				
		win.jGalery.PanelSwip.Body().appendChild(new Node('h1', $MUI('Configuration de la galerie')));
		//
		//
		//
		var forms =  {};
		var htmlNode = new HtmlNode();
		//
		//
		//
		forms.Name = 			new Input({value:galery.Name, type:'text', maxLength:255, style:'width:200px'});
		//
		//
		//
		forms.Password = 		new Input({value:galery.Password, type:'text', maxLength:20, style:'width:100px'});
		//
		//
		//
		forms.Type = 			new Select();
		forms.Type.setData(this.Libraries.options);
		forms.Type.Value(galery.Type);
		
		forms.Type.on('change', function(){
			htmlNode.select('.setting-library').invoke('hide');
			forms[this.Value()].Table.show();
			
			win.jGalery.PanelSwip.refresh();
		});
		//
		//
		//
		forms.Private = 	new ToggleButton();
		forms.Private.Value(galery.Private == 1);		
		//
		//
		//
		var table = new TableData();
		
		htmlNode.appendChild(new Node('h4', $MUI('Informations')));
		
		table.addHead($MUI('Nom') + ' : ').addCel(forms.Name, {width:200}).addRow();
		//table.addHead($MUI('Privée') + ' : ').addCel(forms.Private, {width:200}).addRow();
		//table.addHead($MUI('Mot de passe') + ' : ').addCel(forms.Password, {width:200}).addRow();
		table.addHead($MUI('Librairie') + ' : ').addCel(forms.Type).addRow();
		
		htmlNode.appendChild(table);
		
		htmlNode.appendChild(new Node('p',{className:'note'}, $MUI('La librairie vous permet de choisir le façon dont doit être affiché la galerie sur votre site. Vous pouvez choisir entres différentes librairies pour personnaliser l\'affichage de votre Galerie photo !')));
		
		htmlNode.appendChild(new Node('h4', $MUI('Configuration de la librairie')));
		
		this.Libraries.draw(win, forms, galery, htmlNode);
		
		win.jGalery.PanelSwip.Body().appendChild(htmlNode);
		
		form.submit = 		new SimpleButton({text:$MUI('Save')});
		
		form.submit.on('click', function(){
			
			if(form.Name == ''){
				flag.setText($MUI('Veuillez choisir un nom pour votre galerie')).setType(Flag.RIGHT).show(this, true);
				return;
			}
			
			var evt = new StopEvent(win);
			$S.fire('jgalery:open.submit', evt);
			if(evt.stopped) return true;
			
			galery.Name =				forms.Name.Value();	
			galery.Private =			forms.Private.Value();
			galery.Password =			forms.Password.Value();
			galery.Type =				forms.Type.Value();
			galery.Settings =			{};
			
			System.jGalery.Libraries.options.each(function(e){		
				var formdata = forms[e.value];
				
				for(var key in formdata){
					if(key == 'Table') continue;
					galery.Settings[key] = formdata[key].Value();
				}	
			
			});
			
			win.jGalery.Progress.show();
			
			galery.exists(function(bool){
				if(bool){
					win.jGalery.Progress.hide();
					
					flag.setText($MUI('Le nom de la galerie existe déjà. Veuillez en choisir un autre.')).setType(Flag.RIGHT).show(forms.Name, true);
					
				}else{
					galery.commit(function(){
						win.jGalery.Progress.hide();
						win.jGalery.Current = this;
						
						$S.fire('jgalery:submit.complete', box);
						
						var box = win.createBox();
						var splite = new SpliteIcon($MUI('La galerie a été correctement sauvegardé'));
						splite.setIcon('filesave-ok-48');
						
						box.a(splite).ty('NONE').Timer(5).show();
												
						System.jGalery.getListGaleries(win);
						
					});	
				}
			});
		
		}.bind(this));
		
		win.jGalery.PanelSwip.Footer().removeChilds();
		
		win.jGalery.PanelSwip.Footer().appendChilds([
			form.submit
		]);
		
		forms.Name.on('change', function(){
			var o = 		new System.jGalery();
			o.Galery_ID = 	galery.Galery_ID;
			o.Name =		forms.Name.Value();
			
			o.exists(function(bool){
				if(bool){
					flag.setText($MUI('Le nom de la galerie existe déjà. Veuillez en choisir un autre.')).setType(Flag.RIGHT).show(forms.Name, true);
				}
			});
		});
		
		win.jGalery.Open(true, 650);
			
		}catch(er){$S.trace(er)}
	},
/**
 * System.jGalery.createPanel(win) -> Panel
 * Cette méthode créée le panneau de gestion du catalogue.
 **/
 	createPanel: function(win){
		
		var panel = new System.jPanel({
			title:			$MUI('jGalery'),
			placeholder:	$MUI('Rechercher une galerie'),
			style:			'width:900px',
			search:			false,
		//	parameters:		'cmd=galery.list',
			icon:			'jgalery-32'
		});
		
		panel.addClassName('jgalery');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		
		//panel.BtnAddGalery = panel.DropMenu.addMenu($MUI('Créer une galerie'));
		//panel.BtnAddGalery.parentNode.addClassName('create-galery');
		
		var btnAdd = new SimpleButton({icon:'add-galery', text:'Créer galerie'});
		
		btnAdd.on('click', function(){
			System.jGalery.openSetting(win);
		}.bind(this));
		
		panel.Header().appendChild(btnAdd);
		
		panel.DropMenu.appendChild(new SimpleSection($MUI('Mes galeries')));
		//
		//
		//
		var self = this;
		
		/*panel.InputCompleter.on('draw', function(line){
			
			var reg = new RegExp('(' + this.Text() + ')', 'gi');
			
			var str = '<span class="app-name">' + line.data.Name.replace(reg, '<b>$1</b>') + '</span> ' + $MUI('by') + ' <span class="app-author">' + line.data.Author.replace(reg, '<b>$1</b>')  +'</span>'; 
			
			line.setText(str);
		});
		
		panel.InputCompleter.on('complete', function(array){
			this.setCurrent(win, $MUI('Search'));
			this.drawGaleries(win, array);
		}.bind(this));
		
		panel.InputCompleter.on('change', function(value, line){
			this.Text('');
			this.Value('');
			self.openGalery(win, line.data);
		});*/
		//
		// DropFile
		//
		panel.createDropFile({
			parameters:	'cmd=galery.import',
			multiple:	true
		});
		
		//
		// Actions
		//
		
		panel.PanelBody.Header().appendChilds([
			new Node('span', {className:'tool-jgalery add', value:'Add'}, $MUI('Ajouter une photo')),
			new Node('span', {className:'tool-jgalery add', value:'AddPage'}, $MUI('Créer une page')),
			new Node('span', {className:'tool-jgalery setting', value:'Setting'}, $MUI('Configuration')),
			new Node('span', {className:'tool-jgalery remove', value:'Remove'}, $MUI('Supprimer la galerie'))
		]);
		
		panel.PanelBody.Header().select(".tool-jgalery").each(function(e){
			
			e.on('click', function(){
				
				switch(this.value){
					
					case 'Add':
						System.jGalery.jPicture.open({Galery_ID:win.jGalery.Current.Galery_ID});
						break;
						
					case 'AddPage':
						System.BlogPress.pages.open({
							Title:		win.jGalery.Current.Name,
							Content:	'[jgalery]' + win.jGalery.Current.Galery_ID + '[/jgalery]'
						});
						break;
						
					case 'Setting':
						System.jGalery.openSetting(win, win.jGalery.Current);
						break;
						
					case 'Remove':
						System.jGalery.remove(win, win.jGalery.Current);
						break;
				}
				
			});
			
		});
		
		win.jGalery = panel;
		
		this.getListGaleries(win);
		
		panel.DropFile.on('dropfile', function(node){
			node.data.Galery_ID = win.jGalery.Current.Galery_ID;
		});
		
		panel.DropFile.on('loaded', function(link, node){
			
			var pic = 		new System.jGalery.jPicture();
			pic.Galery_ID = node.data.Galery_ID;
			pic.Title = 	node.data.name;
			pic.Src =		link;
			
			pic.commit(function(){
				if(win.jGalery.Current.Galery_ID == pic.Galery_ID){
					self.getListPictures(win, win.jGalery.Current);
					panel.ProgressBar.hide();
				}
			});			
		});
		
		panel.DropFile.on('complete', function(o, node){
		//	panel.OpenDropPanel(false);
		});
		
		return panel;
		
	},
/**
 * System.jGalery.setCurrent() -> void
 **/	
	setCurrent:function(win, data){
		
		win.jGalery.clear();
		
		try{
			win.jGalery.setCurrentMenu($MUI(data.Name));
		}catch(er){}
		
		var oldCurrent = 		win.jGalery.Current;
		win.jGalery.Current = 	data;
		
		try{
			if(!Object.isUndefined(data.Galery_ID)){
				win.jGalery.DropFile.setParameters('cmd=jgalery.jpicture.import&Galery_ID=' + data.Galery_ID);
			}
		}catch(er){}
		
		//if(data == $MUI('Search')){
			//win.jGalery.BtnSearch.show();	
			//win.isSearch = true;
		//}else{
			//win.jGalery.InputCompleter.Text('');
			//win.jGalery.InputCompleter.Value('');	
			//win.isSearch = false;
		//}
				
	},
/**
 * AppsMe.getListApps(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode retourne la liste des applications du catalogue en ligne.
 **/	
	getListGaleries:function(win){
		
		win.jGalery.Progress.show();
		Element.select(win.jGalery.DropMenu, '.galeries').each(function(e){
			win.jGalery.DropMenu.removeChild(e.parentNode.parentNode.parentNode);
		});
		
		$S.exec('jgalery.list', {
			parameters:'options=' + escape(Object.toJSON({op:'-owner'})),
			onComplete:function(result){
				
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				if(array.length== 0){
					win.jGalery.Progress.hide();
					System.jGalery.openSetting(win);
					return;	
				}
				
				try{
					var self = this;
					for(var i = 0; i < array.length; i++){
						var btn = 	win.jGalery.DropMenu.addMenu($MUI(array[i].Name));
						
						if(i == 0){
							this.getListPictures(win, array[i]);
						}
						
						btn.data = 	array[i];
						
						btn.addClassName('galeries');
						
						btn.on('click', function(){
							self.getListPictures(win, this.data);
						});
					}
					
				}catch(er){
					$S.trace(er);	
				}
								
			}.bind(this)
		});
		
	},
/**
 * System.jGalery.getListPictures(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode retourne la liste des applications du catalogue en ligne.
 **/	
	getListPictures:function(win, galery){
		
		this.setCurrent(win, galery);
		win.jGalery.Progress.show();
		
		///var field = win.jGalery.galery.header.select('.selected')[0].value;
		
		$S.exec('jgalery.jpicture.list', {
			parameters:'options={"Galery_ID":' + galery.Galery_ID + '}',
			onComplete:function(result){
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(er);
					return;	
				}
								
				this.drawPictures(win, array);
				
				if(win.jGalery.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						win.jGalery.ProgressBar.hide();
						win.jGalery.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					win.jGalery.ProgressBar.hide();
				}
			}.bind(this)
		});
	},
/**
 * System.Market.drawPictures(win, array) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode construit le catalogue à partir de la liste des applications.
 **/	
	drawPictures: function(win, array){
		var self = this;
		var subbutton = null;
		
		win.jGalery.PanelBody.clear();
		
		if(array.length > 0){
			for(var i = 0; i < array.length; i++){
									
				var button = new HeadPiece({
					icon:		array[i].Src, 
					text:		array[i].Title
				});
				
				if(i == 0){
					subbutton = new HeadPiece({
						icon:		array[i].Src, 
						text:		array[i].Title
					});
					
					subbutton.Large(true);	
					
					win.jGalery.PanelBody.Body().appendChild(subbutton);
				}
				
				button.UID = 	i;
				button.data = 	array[i];
										
				win.jGalery.PanelBody.Body().appendChild(button);
								
				button.addClassName('draggable');
				
				button.appendChild(new Node('div', {className:'icon-move'}));
				button.remove = new Node('div', {className:'icon-cancel-14 remove'});
				button.appendChild(button.remove);
								
				button.createDrag({absolute:false});
				
				button.on('mouseover', function(){
					if(!this.ismove){
						subbutton.setText(this.data.Title);
						subbutton.setIcon(this.data.Src);
					}
				});
				
				button.on('dragstart', function(){
					this.ismove = false;
					
					win.addClassName('drag');
					this.addClassName('thedrag');
				});
				
				button.on('drag', function(){
					this.ismove =	true;
				});
				
				button.on('dragend', function(){
					win.removeClassName('drag');
					this.removeClassName('thedrag');
					
					var array = [];
					var i =		0;
					
					win.jGalery.PanelBody.select('.hp-button.draggable').each(function(e){
						array.push({Picture_ID:e.data.Picture_ID, Order:i});
						i++;
					});
					
					$S.exec('jgalery.jpicture.order.commit', {
						parameters:'Pictures=' + Object.EncodeJSON(array),
						onComplete:function(){
							System.jGalery.getListPictures(win, win.jGalery.Current);
							win.jGalery.ProgressBar.hide();
						}
					});
					
				});
				
				button.on('click', function(){
					if(!this.ismove){
						if(!document.HasScrolled){
							System.jGalery.jPicture.open(this.data);
						}
					}
					
					this.ismove = false;
				});
				
				button.remove.on('click', function(evt){
					evt.stop();
					
					System.jGalery.jPicture.remove(this.data);
					
				}.bind(button));
				
			}
			
			win.jGalery.PanelBody.refresh();
						
		}else{
			if(!win.isSearch){
				win.jGalery.PanelBody.Body().appendChild(new Node('H1', {className:'notfound'}, $MUI('Sorry. There is still no picture available in this section') + '.'));
			}else{
				win.jGalery.PanelBody.Body().appendChild(new Node('H1', {className:'notfound'}, $MUI('Sorry. No picture for your search') + '.'));
			}
		}
		
		return this;
	},
/**
 * jGalery.onCreateEditor() -> void
 **/	
	onCreateEditor:function(win){
		var box =		System.AlertBox;
		var flag = 		box.box.createFlag();
		
		var button = 	new SimpleButton({icon:'jgalery'});
		var type =		(win.getData ? win.getData().Type : win.post.Type).match(/page/);
		
		flag.add(button, {
			orientation:	Flag.TOP,
			text:			$MUI('Ajouter une galerie')
		});
		
		win.forms.Content.Header().appendChild(button);
		
		
		
		button.on('click', function(){
			box.hide();
			
			var splite = new SpliteIcon($MUI('Ajouter une galerie photo dans la page'), (type ? $MUI('Choisissez les paramètres de la galerie')  : $MUI('Choisissez la galerie à ajouter')) + ' : ');
			splite.setIcon('jgalery-48');
			
			var forms = {};		
			//
			//
			//	
			forms.toggle = new ToggleButton();
			forms.toggle.Value(false);
			//
			//
			//
			forms.Galerie_ID = new Select({
				parameters:'cmd=jgalery.list&options={"op":"-select"}'
			});
			
			forms.Galerie_ID.css('width', '99%');
			
			forms.Galerie_ID.Large(true);
			forms.Galerie_ID.load();
			forms.Galerie_ID.on('complete', function(){
				this.selectedIndex(0);
			});
			
			box.a(splite);
			
			box.a(new Node('h4', $MUI('Ajout d\'une galerie existante')));
			
			if(type == 'page'){
				var table = new TableData();
				table.css('width', '100%');
				table.addHead($MUI('Lister les galeries contenues dans les pages enfants') +' ?', {width:190}).addCel(forms.toggle).addRow();
				table.addHead(' ', {height:9}).addRow();
				table.addHead($MUI('Galerie à ajouter') + ' : ').addCel(forms.Galerie_ID);
				
				box.a(table);
								
				forms.toggle.on('change', function(){
					if(this.Value()){
						forms.Galerie_ID.parentNode.parentNode.hide();	
					}else{
						forms.Galerie_ID.parentNode.parentNode.show();
					}
				});
				
			}else{
				forms.Galerie_ID.css('width', '99%');
				box.a(forms.Galerie_ID);
			}
			//
			//
			//
			box.a(new Node('h4', $MUI('ou création d\'une galerie Ligthbox')));
			
			forms.Src = new FrameWorker({
				multiple:	true
			});
			forms.Src.css('width', '100%');
			
			box.a(forms.Src);
			
			try{
				box.setTheme('flat liquid white');
			}catch(er){
				box.setTitle($MUI('Galerie photo'));
			}
			
			box.setType().show();
			box.setIcon('jgalery');
			
			box.submit({
				text:$MUI('Ajouter'),
				click:function(){
					
					try{
						box.setTheme();
					}catch(er){}
					
					if(forms.toggle.Value()){
						win.forms.Content.Value(win.forms.Content.Value() + '[jgalery][/jgalery]');
					}else{
						win.forms.Content.Value(win.forms.Content.Value() + '[jgalery]' + forms.Galerie_ID.Value() + '[/jgalery]');
					}
				}
			});
			
			box.reset({
				click:function(){
					try{
						box.setTheme();
					}catch(er){}
				}
			});
			
		});
	},
/**
 * jGalery.remove() -> void
 **/
 	remove: function(win, jgalery){
		
		var box = 		win.AlertBox;
		var flag = 		box.box.createFlag().setType(FLAG.RIGHT);
		
		jgalery = new System.jGalery(jgalery);
		//
		//
		//	
		var splite = new SpliteIcon($MUI('Voulez-vous vraiment supprimer cette galerie') +  ' "' + jgalery.Name + '" ? ');
		splite.setIcon('trash-48');
		splite.setStyle('max-width:500px');
		
		box.as([splite]).ty()
		
		$S.fire('jcarousel:remove.open', box);
		
		box.show();
		
		box.submit({
			text: $MUI('Supprimer'),
			icon: 'delete',
			click: function(){
						
				var evt = new StopEvent(box);
				$S.fire('jgalery:remove.submit', evt);
				
				if(evt.stopped)	return true;
							
				box.wait();
								
				jgalery.remove(function(){
					box.hide();
					$S.fire('jgalery:remove.complete', jgalery);	
					
					var splite = new SpliteIcon($MUI('Galerie correctement supprimé') + '.', jgalery.Name);
					splite.setIcon('valid-48');
									
					box.setTitle($MUI('Confirmation')).a(splite).setType('CLOSE').Timer(5).show();
					
					win.jGalery.DropMenu.select('.galeries').each(function(e){
						e.parentNode.removeChild(e);
					});
					
					System.jGalery.getListGaleries(win);
					
				});
				
				return true;
			}
		});
		
		box.reset({icon:'cancel'});
	}
});

System.jGalery.initialize();