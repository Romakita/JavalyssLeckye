/** section: AppsMe
 * AppsMe
 *
 * Cet espace de nom gère l'extension AppsMe.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : appsme.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.AppsMe = {
/**
 * AppsMe.initialize()
 **/
	initialize: function(){
		
		//this.applications = new AppsUI();
		//this.releases = 	new ReleasesUI();
		
		$S.on('system:startinterface', this.onStartInterface.bind(this));
	},
/**
 * AppsMe.onStartInterface() -> void
 **/
 	onStartInterface: function(){
		//this.applications.startInterface();
		//$S.TaskBar.addLine($MUI('AppsMe'),  function(evt){this.listing()}.bind(this), {icon:'appsme'});
		
		this.Menu = $S.DropMenu.addMenu($MUI('AppsMe'), {
			icon:		'appsme',
			appName:	'AppsMe'
		}).observe('click', function(){this.open()}.bind(this));	
		
		$S.observe('application:submit.complete', function(){
			var win = $WR.getByName('appsme');
			if(win){
				System.AppsMe.App.listing(win);
			}
		}.bind(this));
		
		$S.observe('application:remove.complete', function(){
			var win = $WR.getByName('application.listing');
			if(win){
				System.AppsMe.App.listing(win);
			}
		}.bind(this));
		
		$S.observe('release:submit.complete', function(){
			var win = $WR.getByName('appsme');
			if(win){
				System.AppsMe.App.listing(win);
			}
		}.bind(this));
		
	},
	
	getMeta: function(key){
		var options = $S.Meta('AppsMe_Options') || {};	
		
		if(Object.isUndefined(options.Broadcast_Update_Apps)){
			options.Broadcast_Update_Apps = 1;
		}
		
		if(Object.isUndefined(options.Beta)){
			options.Beta = 1;
		}
		
		if(Object.isUndefined(options.Enable_Incidents)){
			options.Enable_Incidents = 1;
		}
		
		return Object.isUndefined(key) ? options : options[key];
	},
/**
 * AppsMe.open() -> Window
 **/	
	open:function(bool){
		var win = $WR.unique('appsme', {
			autoclose:	false
		});
		
		//on regarde si l'instance a été créée
		if(!win) return $WR.getByName('appsme');
		
		this.winList = win;
		
		win.forms = {};
		//win.setIcon('javalyss-market');
		win.Resizable(false);
		win.ChromeSetting(true);
		win.NoChrome(true);
		win.createFlag().setType(FLAG.RIGHT);
		win.createBox();	
		win.MinWin.setIcon('appsme');
		win.addClassName('appsme');
		
		win.appendChild(this.createPanel(win));
				
		$Body.appendChild(win);
		
		$S.fire('appsme:open', win);
		
		win.Fullscreen(true);
		win.moveTo(0,0);
		
		System.AppsMe.App.listing(win);
		
		return win;
	},
/**
 * AppsMe.createPanel(win) -> Panel
 * Cette méthode créée le panneau de gestion du catalogue.
 **/
 	createPanel: function(win){
		
		var panel = new System.jPanel({
			title:			'AppsMe',
			placeholder:	$MUI('Search for an application'),
			style:			'width:900px',
			parameters:		'cmd=appsme.app.list',
			menu:			false,
			search:			false
		});
		
		win.AppsMe = panel;
		
		var self =	this;
		
		panel.addClassName('appsme');
		panel.setTheme('grey flat');
		panel.Progress.addClassName('splashscreen');
		//
		//
		//
		var btnApps = new SimpleButton({icon:'edit-apps', text:$MUI('Catalogue')});
		btnApps.on('click', function(){
			try{
				System.AppsMe.App.listing(win);
			}catch(er){$S.trace(er)}
		});
		
		btnApps.addClassName('apps selected tab');
		
		var btnIncident = new SimpleButton({icon:'edit-incident', text:$MUI('Incidents')});
		btnIncident.on('click', function(){
			System.AppsMe.CrashRepport.listing(win);
		});
		
		var btnMessage = new SimpleButton({icon:'edit-message', text:$MUI('Messages')});
		btnMessage.on('click', function(){
			
		});
		
		var btnStatistics = new SimpleButton({icon:'edit-stats', text:$MUI('Statistics')});
		btnStatistics.on('click', function(){
			
		});
		
		var btnSettings = new SimpleButton({icon:'edit-setting', text:$MUI('Preferences')});
		btnSettings.on('click', function(){
			System.AppsMe.Setting.open();
		});
		
		panel.Header().appendChild(btnApps);
		//panel.Header().appendChild(btnIncident);
		
		if($U().getRight() != 3){
			panel.Header().appendChild(btnSettings);
		}
						
		return panel;
	},
/**
 * System.Market.setCurrent() -> void
 **/	
	setCurrent:function(name){
		var win = $WR.getByName('appsme');
		var panel = win.AppsMe;
		
		
		if(name != 'setting'){
			panel.Header().select('.selected').invoke('removeClassName', 'selected');
			panel.Header().select('.simple-button.' + name).invoke('addClassName', 'selected');
				
			panel.clearAll();
			win.CurrentName = name;
			
		}else{
			panel.clearSwipAll();
		}
		
		panel.Open(false);
		win.destroyForm();
					
	},
/**
 * System.Market.openApp(win, app) -> void
 *
 * Cette méthode ouvre le panneau de l'application.
 **/	
	openApp:function(win, app){
		
		var panel = win.AppsMe;
		
		///win.setData(apps = new System.MyStore.Product(product));
		//var forms = win.createForm();
		//
		// Réinitialisation du contenu
		//
		panel.clearSwipAll();
		panel.Open(true, 650);
		
		var button = new MarketButton({
			icon:		app.Icon, 
			text:		app.Name, 
			note:		app.Note, 
			nbNote:		app.Nb_Note, 
			subTitle:	app.Category, 
			price:		app.Price,
			version: 	app.Nb_Downloads + ' ' +$MUI('downloads')
		});
		
		win.AppsMe.PanelSwip.Body().appendChild(button);
		
		var html = new HtmlNode();
		
		if(app.Date_Update){
			var weight = ((app.Weight / 1024) / 1024).toFixed(2);
			html.append('<ul class="wrap-list"><li><span>' + $MUI('Publisher') + ' : ' + app.Author  + '</span></li>' 
			+ '<li><span>' + $MUI('Release')  + ' ' +  app.Date_Publication.toDate().toString_('date', MUI.lang) + '</span></li>'
			+ '<li><span>' + $MUI('Updated')  + ' ' +  app.Date_Update.toDate().toString_('date', MUI.lang) + '</li>'
			+ '<li><span>' + $MUI('Version') + ' ' + app.Version + ', ' + weight + ' Mo</span></li>');
		}else{
			html.append('<ul class="wrap-list"><li><span>' + $MUI('Publisher') + ' : ' + app.Author  + '</span></li>' 
			+ '<li><span>' + $MUI('Release')  + ' ' +  app.Date_Publication.toDate().toString_('date', MUI.lang) + '</span></li>');
			
			if(Object.isUndefined(app.Local)){
				html.append('<p class="wait">' + $MUI('The application is not yet available for download') + '</p>');
			}
		}
		
		html.append(app.Description);
		
		win.AppsMe.PanelSwip.Body().appendChild(html);
		
		var btnEdit = 	new SimpleButton({text:$MUI('Edit')});
		
		btnEdit.on('click', function(){
			System.AppsMe.App.open(app);
		}.bind(this));
		
		panel.PanelSwip.footer.appendChilds([
			btnEdit
		]);
		
	},
/**
 * System.Market.openApp(win, app) -> void
 *
 * Cette méthode ouvre le panneau de l'application.
 **/	
	/*openOpinionsApp:function(win, app){
		if(Object.isUndefined(app)){
			app = this.CurrentApp;	
		}
		
		try{
		
		this.CurrentApp = app;
		var panel = win.AppsMe;
		
		win.AppsMe.PanelSwip.removeClassName('local');
		win.AppsMe.PanelSwip.removeClassName('download');
		win.AppsMe.PanelSwip.removeClassName('update');
		win.AppsMe.PanelSwip.removeClassName('removable');
		
		win.AppsMe.PanelSwip.Body().removeChilds();
		win.AppsMe.PanelSwip.refresh();
		
		win.AppsMe.Open(true, 650);
		
		var button = new MarketButton({
			icon:		app.Icon, 
			text:		app.Name, 
			note:		app.Note, 
			nbNote:		app.Nb_Note, 
			subTitle:	app.Category, 
			version: 	app.Nb_Downloads + ' ' +$MUI('downloads')
		});
		
		win.AppsMe.PanelSwip.Body().appendChild(button);
		
		panel.PanelSwip.Comments = new WidgetTable({
			range1:			10,
			range2:			20,
			range3:			30,
			overable:		false,
			parameters:		'cmd=appcomment.list&options=' + escape(Object.toJSON({op:'-app', Application_ID:app.Application_ID})),
			completer:		false,
			readOnly:		true,
			scrollbar:		win.AppsMe.PanelSwip.ScrollBar
		});
		
		panel.PanelSwip.Comments.Body().css('min-height', '500px');
		panel.PanelSwip.Comments.removeClassName('widget');
		panel.PanelSwip.Comments.Table.removeClassName('simple-table');
		panel.PanelSwip.Comments.addClassName('widget-comments');
		panel.PanelSwip.Comments.Table.addClassName('table-comments');
		
		panel.PanelSwip.Comments.Table.Header().hide();
		
		panel.PanelSwip.Comments.addHeader({
			Author: 		{title:''},
			Content: 		{title:''}
		});	
		
		panel.PanelSwip.Comments.addFilters('Author', function(e, cel, data){
			
			cel.parentNode.appendChild(new StarsRating(1 * data.Note));
			
			return $MUI('By') + ' ' + e + ' - ' + $MUI('Version') + ' ' + data.Version;
		});
		
		panel.PanelSwip.Comments.load();
		
		win.AppsMe.PanelSwip.Body().appendChild(panel.PanelSwip.Comments);
		//
		//
		//
		panel.PanelSwip.BtnEdit = 	new SimpleButton({text:$MUI('Edit')});
		
		panel.PanelSwip.BtnEdit.on('click', function(){
			this.applications.open(this.CurrentApp);
		}.bind(this));
				
		panel.PanelSwip.BtnRemove = 		new SimpleButton({text:$MUI('Remove')});
		
		panel.PanelSwip.BtnRemove.on('click', function(){
			this.applications.remove(this.CurrentApp, win);
		}.bind(this));
		
		panel.PanelSwip.footer.removeChilds();
		
		panel.PanelSwip.footer.appendChilds([
			panel.PanelSwip.BtnEdit,
			panel.PanelSwip.BtnRemove
		]);
		
		}catch(er){$S.trace(er)}
	},*/
/**
 * System.Market.openStatisticsApp(win, app) -> void
 *
 * Cette méthode ouvre le panneau de l'application.
 **/
	/*openStatisticsApp:function(win, app){
		if(Object.isUndefined(app)){
			app = this.CurrentApp;	
		}
		
		try{
		
		this.CurrentApp = app;
		var panel = win.AppsMe;
		
		
		
		win.AppsMe.PanelSwip.removeClassName('local');
		win.AppsMe.PanelSwip.removeClassName('download');
		win.AppsMe.PanelSwip.removeClassName('update');
		win.AppsMe.PanelSwip.removeClassName('removable');
		
		win.AppsMe.PanelSwip.Body().removeChilds();
		win.AppsMe.PanelSwip.refresh();
		
		win.AppsMe.Open(true, 650);
		
		var button = new MarketButton({
			icon:		app.Icon, 
			text:		app.Name, 
			note:		app.Note, 
			nbNote:		app.Nb_Note, 
			subTitle:	app.Category, 
			version: 	app.Nb_Downloads + ' ' +$MUI('downloads')
		});
		button.css('margin-bottom', '20px');
		
		win.AppsMe.PanelSwip.Body().appendChild(button);
		//
		// Charts
		//
		var divChart = new Node('div');
		
		divChart.css('height', '340px');
		divChart.css('width', '100%');
		
		win.AppsMe.PanelSwip.Body().appendChild(divChart);
		
		Highcharts.setOptions($S.AppsMe.HightCharts.dark);
		
		this.generateDownloadStatistics(divChart, app);
		//
		// 
		//
		var widgets = new WidgetContainer({number:2});
		widgets[0].css('height', 250);
		widgets[1].css('height', 250);
		
		win.AppsMe.PanelSwip.Body().appendChild(widgets);
		
		this.generateReleaseStatistics(widgets[0], app);
		this.generateLangStatistics(widgets[1], app);
		//
		//
		//
		panel.PanelSwip.BtnEdit = 	new SimpleButton({text:$MUI('Edit')});
		
		panel.PanelSwip.BtnEdit.on('click', function(){
			this.applications.open(this.CurrentApp);
		}.bind(this));
				
		panel.PanelSwip.BtnRemove = 		new SimpleButton({text:$MUI('Remove')});
		
		panel.PanelSwip.BtnRemove.on('click', function(){
			this.applications.remove(this.CurrentApp, win);
		}.bind(this));
		
		panel.PanelSwip.footer.removeChilds();
		
		panel.PanelSwip.footer.appendChilds([
			panel.PanelSwip.BtnEdit,
			panel.PanelSwip.BtnRemove
		]);
		
		}catch(er){$S.trace(er)}
	},
	
	generateDownloadStatistics:function(div, app){
		var arrayMonth = 		[];
		var stats =				app.Stats.ByMonth;
		
		var dataEffectif = 		[];
		var dataTotal = 		[];
		var date =				new Date();
		
		date.setMonth(date.getMonth() - 12);
								
		for(var i = 0;  i <= 12; i++){
			arrayMonth[i] = date.format('M');
			var key = 		date.format('Y-m');	
				
			if(Object.isUndefined(stats[key])){
				dataEffectif[i] = 	0;
				dataTotal[i] =	 	0;
			}else{
				dataEffectif[i] = 	1 * stats[key].single;
				dataTotal[i] = 		1 * stats[key].total;
			}
			
			date.setMonth(date.getMonth() + 1);
		}
					
		var chart = new Highcharts.Chart({
            chart: {
                renderTo: 	div,
                type: 		'column'
            },
            title: {
                text: 		'Nombre de téléchargement sur les 12 derniers mois'
            },
			
            xAxis: {
                categories: arrayMonth
            },
			
            yAxis: {
                min: 			0,
				minRange:		10,
				allowDecimals:	false,
                title: {
                    text: ' '
                }
            },
						
            tooltip: {
                formatter: function() {
                    return  ''+ this.y +' Téléchargement(s)';
                }
            },
			
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Téléchargement unique',
                data: dataEffectif
            }, {
                name: 'Téléchargement total',
                data: dataTotal
           	}]
        });
	},*/
/**
 *
 **/	
	/*generateReleaseStatistics:function(div, app){
		var data = 		app.Stats.ByVersion;
		var array = 	[];
		var keysup = 	false;
		
		for(var key in data){
			if(array.length < 4){
				array.push([key, 1 * data[key]]);
			}else{
				if(!keysup){
					keysup = key + ' et moins';
					array.push([keysup, 0]);
				}
				
				array[array.length-1][1] += 1 * data[key];
			}
		}
				
		var chart = new Highcharts.Chart({
            chart: {
                renderTo: 				div,
                plotBackgroundColor: 	null,
                plotBorderWidth:		null,
                plotShadow: 			false
            },
            title: {
                text: 		'Téléchargement par version',
				style: {
					color: 	'#FFF',
					font: 	'11px Segeo UI, HelveticaNeue, Helvetica, Arial'
				}
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: 	true,
                    cursor: 			'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Release share',
                data: array
            }]
        });
	},*/
/**
 *
 **/	
	/*generateLangStatistics:function(div, app){
						
		var chart = new Highcharts.Chart({
            chart: {
                renderTo: 				div,
                plotBackgroundColor: 	null,
                plotBorderWidth:		null,
                plotShadow: 			false
            },
            title: {
                text: 		$MUI('Téléchargement par langue'),
				style: {
					color: 	'#FFF',
					font: 	'11px Segeo UI, HelveticaNeue, Helvetica, Arial'
				}
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: 	true,
                    cursor: 			'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Language share',
                data: app.Stats.ByLang
            }]
        });
	}*/
};

$S.AppsMe.AppButton = Class.from(AppButton);
$S.AppsMe.AppButton.prototype = {
	
	className:'wobject market-button appsme-button',
/**
 * new AppsMe.AppButton([options])
 **/	
	initialize:function(obj){
		
		var options = {
			price: 		0,
			subTitle:	'',
			overable:	false,
			progress:	false,
			price:	''
		};
		
		Object.extend(options, obj || {});
		
		//
		//
		//
		this.SubTitle = new Node('span', {className:'wrap-subtitle'}, options.subTitle);
		//
		//
		//
		this.Price = 	new Node('span', {className:'wrap-price'}, $MUI('Free'));	
		
		if(options.price != ''){
			this.Price.innerHTML = options.price;
		}
		
		this.appendChild(this.SubTitle);
		this.appendChild(this.Price);
						
		this.Overable(options.overable);
	},
	
	Overable:function(bool){
		this.removeClassName('overable');
		
		if(bool){
			this.addClassName('overable');	
		}
	}
};

$S.AppsMe.initialize();