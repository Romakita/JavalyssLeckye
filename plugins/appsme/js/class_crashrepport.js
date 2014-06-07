/** section: AppsMe
 * class CrashRepport
 **/
System.AppsMe.CrashRepport = new Class.createAjax({
/**
 * CrashRepport#Crash_ID -> Number
 **/
	Crash_ID:			0, 	 	 	 	 	 	 	 
/**
 * CrashRepport#Application_ID -> Number
 **/
	Application_ID:		0,
/**
 * CrashRepport#Name -> Number
 **/
	Name:				'',
/**
 * CrashRepport#Name_Application -> Number
 **/
	Email:				'',
/**
 * CrashRepport#Function -> String
 **/
	Function:			'',
/**
 * CrashRepport#Conclusion -> String
 **/	
	Conclusion:			'',
/**
 * CrashRepport#Description -> String
 **/	
	Description:		'',
/**
 * CrashRepport#Version -> String
 **/
	Version:			'',
/**
 * CrashRepport#Statut -> Number
 **/
	Statut:				0,
/**
 * CrashRepport#commit(callback) -> void
 **/
	commit: function(callback){
		
		$S.exec('application.crash.commit', {
			
			parameters: "CrashRepport=" + this.toJSON(),
			onComplete: function(result){
				this.evalJSON(result.responseText);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});	
		
	},
/**
 * CrashRepport#remove(callback) -> void
 **/
	remove: function(callback){
		$S.exec('application.crash.delete',{
			parameters: 'CrashRepport=' + this.toJSON(),
			onComplete: function(result){
				
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}	
});

Object.extend(System.AppsMe.CrashRepport, {
	
	initialize:function(){
		
	},
/**
 * AppsUI.openCrash(win, crash) -> void
 * - win (Window): Instance du formulaire principal.
 * - crash (Object): Instance CrashRepport ou équivalent.
 *
 * Cette méthode ouvre un rapport d'erreur afin d'être analysé et traiter par le développeur de l'application.
 **/
	open: function(win, crash){
		
		crash = new CrashRepport(crash);
		
		//#pragma region Instance 
		var forms = {};
		//
		// Statut
		//
		forms.Statut = new Select();
		forms.Statut.setData([
			{value:0, text:$MUI('Non traité'), icon:'alert'},
			{value:1, text:$MUI('En cours'), icon:'file-search'},
			{value:2, text:$MUI('Clôturé'), icon:'valid'}
		]);
		forms.Statut.selectedIndex(crash.Statut);
		//
		// Splite
		//
		var splite = new SpliteIcon($MUI('Gestion du rapport d\'erreur'), $MUI('Ce formulaire détail une erreur envoyée par un utilisateur de votre application') + '.');
		splite.setIcon('alert-48');
		splite.setStyle('width:500px');
				
		win.AlertBox.a(splite);
		//
		// Table
		//
		var widget = new Widget();
		widget.setIcon('documentinfo');
		widget.Title($MUI('Informations'));
		widget.Table = new TableData();
		widget.Table.css('width', '100%');
		widget.appendChild(widget.Table);
				
		widget.Table.addHead($MUI('Fonction') + ' :', {width:100}).addField(crash.Function).addRow();
		widget.Table.addHead($MUI('Version') + ' :').addField(crash.Version).addRow();
		widget.Table.addHead($MUI('Posté le') + ' :').addField(crash.Date_Crash.toDate().toString_('date', MUI.lang)).addRow();
		widget.Table.addHead($MUI('Statut') + ' :').addField(forms.Statut).addRow();
		widget.Table.addHead($MUI('Contact') + ' :').addField(new Node('a', {href:'mailto:' + crash.Email}, crash.Email), {style:'height:24px'});
		
		win.AlertBox.a(widget);
		//
		//
		//
		widget = 	new Widget();
		widget.setIcon('file-edit');
		widget.Title($MUI('Description'));
		widget.Table = new TableData();
		widget.appendChild(widget.Table);
		widget.Body().setStyle('height:150px');
		
		var html = new HtmlNode();
		html.append(crash.Description.replace(new RegExp("\n", "g"),'<br />'));
		html.addClassName('html-node');
		widget.appendChild(html);
		
		win.AlertBox.a(widget);
		//
		//
		//
		forms.Conclusion = 	new WidgetTextArea();
		forms.Conclusion.setIcon('knotes');
		forms.Conclusion.Title($MUI('Remarques'));
		forms.Conclusion.Body().setStyle('height:150px');
		forms.Conclusion.setText(crash.Conclusion);
		forms.Conclusion.TextArea.placeholder = $MUI('Saisissez ici vos remarques') + '...';
		
		win.AlertBox.a(forms.Conclusion);
		//#pragma endregion Instance
		
		win.AlertBox.setTitle($MUI('Rapport d\'erreur')).setType().show();
		
		win.AlertBox.reset({icon:'cancel'});
		win.AlertBox.forms = 	forms;
		win.AlertBox.crash = 	crash;
		
		$S.fire('crash:open', win.AlertBox);
		
		win.AlertBox.submit({
			icon:'filesave',
			text:$MUI('Enregistrer'),
			click:function(){
							
				var evt = new StopEvent(win.AlertBox);
				$S.fire('crash:submit', evt);
				
				if(evt.stopped){
					return true;	
				}
				
				crash.Statut = 		forms.Statut.Value();
				crash.Conclusion = 	forms.Conclusion.getText();
							
				win.AlertBox.wait();
				
				crash.commit(function(){
					win.AlertBox.hide();
					
					$S.fire('crash:submit.complete', win.AlertBox);
					
					var splite = new SpliteIcon($MUI('Le formulaire a été correctement sauvegardé'), $MUI('Rapport N°') +' ' + crash.Crash_ID);
					splite.setIcon('filesave-ok-48');
						
					win.AlertBox.ti($MUI('Confirmation') + '...').a(splite).ty('NONE').Timer(3).show();
					
				});
				return true;
			}
		});
	},
	
/**
 * AppsUI.createWidgetCrash
 **/	
	createWidget: function(win){
		
		var widget = new WidgetTable({
			range1:		1000, 
			range2:		1000, 
			range3:		1000,
			readOnly:	true,
			link: 		$S.link,
			parameters:	'cmd=application.crash.list&options=' + Object.toJSON({op:'-n'}),
			selectable:	false,
			select:		false,
			completer:	false,
			complex:	true,
			field:		'Type',
			count:		false,	
			progress:	false,		
			empty:		'- ' + $MUI('Aucune application') + ' -'
		});
		
		widget.DropMenu.hide();
		widget.Table.Header().hide();
		widget.setStyle('margin:0px');
		widget.Body().setStyle('height:450px');
		
		widget.Table.onWriteName = function(key){
			switch(key){
				case 'app':	return '<span class="icon-appsme" style="padding-left:25px">' + $MUI('Apps') + '</span>';
				case 'plugin':	return '<span class="icon-plugin" style="padding-left:25px">' + $MUI('Plugins') + '</span>';
			}
		};
		
		widget.addHeader({ 
			Icon:		{title: '', width:40, style:'text-align:center'},
			Name:		{title:$MUI('')},
			Action:		{title:$MUI(''), width:30, type:'action'}
		});
		
		widget.addFilters(['Action'], function(e, cel, data){
			e.open.hide();
			
			if(data.Right != '0'){
				e.remove.hide();
			}
		});
				
		widget.addFilters(['Name'], function(e, cel, data){
			var html = new HtmlNode();
			
			html.setStyle('padding:5px');
			html.append('<h1 style="margin:0px;font-size:16px">' + e + ' v' + data.Version + '<p style="font-size:11px">' + $MUI('Function') + ' : ' + data.Function +', '+ $MUI('by') + ' ' 
			+ (data.Email != '' ? data.Email : $MUI('Anonymous')) + '</p></h1>');
			
			var date = data.Date_Crash.toDate();
			
			cel.on('mouseover', function(){
				win.Flag.setText('<p class="icon-date">' + $MUI('Posted on') + ' ' + date.format('l d F Y ') + $MUI('@') + date.format(' h:i') + '</p>' +
				'<p class="icon-documentinfo">'+ data.Description+'</p>').color('grey').setType(FLAG.TOP).show(cel, true);
			});
			
			return html;
		});
		
		widget.addFilters(['Icon'], function(e, cel, data){
			var button = new AppButton({icon:e ? e : (data.Type == 0 ? 'appsme' : 'plugin'), type:'mini'});									
			return button;
		}.bind(this));
		
		widget.on('click', function(evt,data){
			this.openCrash(win, data);
		}.bind(this));
		
		widget.on('remove', function(evt,data){
			this.removeCrash(win, data);
		}.bind(this));
		
		win.loadCrashs = widget.load.bind(widget);
		
		return widget;
	},
/**
 * AppsMe.getNbIncidentReport(win) -> void
 * - win (Window): Instance Window.
 *
 * Cette méthode récupère le nombre de mise à jour.
 **/
	getNbIncidentReport:function(win){
		
		if(this.getMeta('Enable_Incidents') == 1){
			$S.exec('application.crash.count', {
				parameters:'options=' + Object.toJSON({op:'-n'}),
				onComplete:	function(result){
					try{
						var obj = result.responseText.evalJSON();
					}catch(er){return er;}
											
					if(obj * 1 == 0){
						win.AppsMe.BtnIncident.hide();
						return;
					}
				
					win.AppsMe.BtnIncident.setText($MUI('Incident Report') + ' (' + obj + ')');			
				}.bind(this)
			});
		}else{
			win.AppsMe.BtnIncident.hide();
		}
		
	},
	
	listing:function(win){
		
		System.AppsMe.setCurrent('incident');
		win.AppsMe.Progress.show();
		
		$S.exec('application.crash.list', {
			parameters:'options=' + Object.toJSON({op:'-n'}),
			onComplete:function(result){
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(er);
					return;	
				}
				
				try{		
					
				var self = this;
		
				if(array.length > 0){
								
					for(var i = 0; i < array.length; i++){
							
						var button = new $S.AppsMe.AppButton({
							icon:		array[i].Icon, 
							text:		array[i].Name + (!array[i].Version ? '' : ' v' + array[i].Version),
							subTitle:	array[i].Type == 'app' ? $MUI('App')  : $MUI(array[i].Category),
							price:		array[i].Price,
							overable:	true
						});
						
						button.data = array[i];
						//
						// Button
						//
						var edit = 		new SimpleButton({icon:'search-14', type:'mini'});
						var remove =	new SimpleButton({icon:'cancel-14', type:'mini'});
						var node = 		new Node('div', {className:'wrap-button'}, [edit, remove]);
						
						button.appendChild(node);
															
						win.AppsMe.PanelBody.Body().appendChild(button);
						
						button.on('click', function(){
							//alert(document.HasScrolled);
							if(!document.HasScrolled){
								System.AppsMe.openApp(win, this.data);
							}
						});
						
						edit.on('click', function(){
							System.AppsMe.App.open(this.data);
						}.bind(button));
						
						remove.on('click', function(){
							System.AppsMe.App.remove(this.data, win);
						}.bind(button));
						
						button.addClassName('hide');
					}
					
					win.AppsMe.PanelBody.refresh();
					
					new Timer(function(){
						var b = win.AppsMe.body.select('.market-button.hide')[0];
						if(b){
							
							b.removeClassName('hide');
							b.addClassName('show');
						}
					}, 0.1, array.length).start();
					
				}else{
					if(!win.isSearch){
						win.AppsMe.PanelBody.Body().appendChild(new Node('H1', {className:'wrap-notfound'}, $MUI('Sorry. There is still no application available in this section') + '.'));
					}else{
						win.AppsMe.PanelBody.Body().appendChild(new Node('H1', {className:'wrap-notfound'}, $MUI('Sorry. No application for your search') + '.'));
					}
				}
								
				}catch(er){alert(er)}
				
				if(panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						panel.ProgressBar.hide();
						panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					panel.ProgressBar.hide();
				}
			}.bind(this)
		});
	}
});


System.AppsMe.CrashRepport.initialize();