/** section: SiteMapGenerator
 * class System.CRM.Setting
 **/
System.SiteMapGeneratorSetting = {
/**
 * new System.SiteMapGeneratorSetting()
 **/
	initialize: function(){
		$S.observe('system:open.settings', function(win){
			win.TabControl.addPanel('Sitemap Generator', System.SiteMapGeneratorSetting.createPanel(win)).setIcon('sitemap-generator');
		});
		
		
	},
	
	createPanel:function(win){
		var panel = new Panel({style:'width:600px;min-height:500px'});
		
		var splite = new SpliteIcon($MUI('SiteMap Generator'));
		splite.setIcon('sitemap-generator-48');
		
		panel.appendChild(splite);
		
		var forms = new Extends.Form();
		var options = System.Meta('SMG_OPTIONS') || {XML:1, GZIP:1,GOOGLE:1, BING:1, MOREOVER:1};
		//
		//
		//
		forms.XML = new ToggleButton();
		forms.XML.Value(options.XML == 1);
		
		forms.addFilters('XML', function(){return this.XML.Value()?1:0});
		//
		//
		//
		forms.GZIP = new ToggleButton();
		forms.GZIP.Value(options.GZIP == 1);
		
		forms.addFilters('GZIP', function(){return this.GZIP.Value()?1:0});
		//
		//
		//
		forms.GOOGLE = new ToggleButton();
		forms.GOOGLE.Value(options.GOOGLE == 1);
		
		forms.addFilters('GOOGLE', function(){return this.GOOGLE.Value()?1:0});
		//
		//
		//
		forms.GOOGLE = new ToggleButton();
		forms.GOOGLE.Value(options.GOOGLE == 1);
		
		forms.addFilters('GOOGLE', function(){return this.GOOGLE.Value()?1:0});
		//
		//
		//
		forms.BING = new ToggleButton();
		forms.BING.Value(options.BING == 1);
		
		forms.addFilters('BING', function(){return this.BING.Value()?1:0});
		//
		//
		//
		forms.MOREOVER = new ToggleButton();
		forms.MOREOVER.Value(options.MOREOVER == 1);
		
		forms.addFilters('MOREOVER', function(){return this.MOREOVER.Value()?1:0});
		//
		//
		//
		forms.ROBOTS = new ToggleButton();
		forms.ROBOTS.Value(options.ROBOTS == 1);
		
		forms.addFilters('ROBOTS', function(){return this.ROBOTS.Value()?1:0});
		//
		//
		//
		var table = new TableData();
		
		table.addHead('Ecrire un fichier XML normal', {style:'width:280px'}).addCel(forms.XML, {width:50}).addRow();
		table.addHead('Ecrire un fichier gzippé').addCel(forms.GZIP).addRow();
		
		panel.appendChild(new Node('h4', $MUI('Options générales')));
		panel.appendChild(table);
		
		var table = new TableData();
		
		table.addHead('Informer Google des mises à jour du site', {style:'width:280px'}).addCel(forms.GOOGLE, {width:50}).addRow();
		table.addHead('Informer Bing des mises à jour du site').addCel(forms.BING).addRow();
		//table.addHead('Informer Ask.com des mises à jour du site').addCel(forms.ASK).addRow();
		table.addHead('Informer Moreover.com des mises à jour du site').addCel(forms.MOREOVER).addRow();
		table.addHead('Ajouter l\'URL du sitemap au fichier virtuel robots.txt').addCel(forms.ROBOTS).addRow();
		
		panel.appendChild(new Node('h4', $MUI('Notifications')));
		panel.appendChild(table);
		//
		//
		//
		panel.appendChild(new Node('h4', $MUI('Pages supplémentaires')));
		forms.INCLUDE = new WidgetTable({
			range1:		2000,
			range2:		2000,
			range3:		2000,
			readOnly:	true,
			search:		false,
			sort:		false,
			overable:	false,
			completer:	false
		});
		
		forms.INCLUDE.DropMenu.addMenu($MUI('Ajouter'), {icon:'add'}).on('click', function(){
			forms.INCLUDE.addRows([{link:'', frequency:'daily', priority:1, date: new Date()}]);
		});
		
		forms.INCLUDE.Body().css('height', 200);
		forms.INCLUDE.addHeader({
			'link':			{title:'URL de la page'},
			'priority':		{title:'Priorité', width:50},
			'frequency': 	{title:'Fréquence', width:120},
			'date': 		{title:'Dernière modification', width:120},
			'Action':		{title:'', width:30, style:'text-align:center', type:'action'}
		});
		
		forms.INCLUDE.addFilters('Action', function(e, cel){
			e.open.hide();
			
			e.remove.on('click', function(){
				cel.parentNode.parentNode.removeChild(cel.parentNode);
			});
			
			return e;
		});
		
		forms.INCLUDE.addFilters('link', function(e, cel, data){
			
			data.link = new Input({type:'text', value:Object.isElement(e) ? e.Value() : e});
			data.link.css('width', '98%');
			
			return data.link;
		});
		
		
		forms.INCLUDE.addFilters('priority', function(e, cel, data){
			
			data.priority = new Select();
			data.priority.css('width', 50);
			data.priority.setData([
				{value:0, text:0},
				{value:0.1, text:0.1},
				{value:0.2, text:0.2},
				{value:0.3, text:0.3},
				{value:0.4, text:0.4},
				{value:0.5, text:0.5},
				{value:0.6, text:0.6},
				{value:0.7, text:0.7},
				{value:0.8, text:0.8},
				{value:0.9, text:0.9},
				{value:1, text:1}
			]);
			
			data.priority.Value(Object.isElement(e) ? e.Value() : e);
			
			return data.priority;
		});
		
		forms.INCLUDE.addFilters('frequency', function(e, cel, data){
			
			data.frequency = new Select();
			data.frequency.css('width', 110);
			data.frequency.setData([
				{value:"always", text:$MUI('Toujours')},
				{value:"daily", text:$MUI('Tous les jours')},
				{value:"weekly", text:$MUI('Toutes les semaines')},
				{value:"monthly", text:$MUI('Tous les mois')},
				{value:"yearly", text:$MUI('Tous les ans')},
				{value:"never", text:$MUI('Jamais')}
			]);
			
			data.frequency.Value(Object.isElement(e) ? e.Value() : e);
			
			return data.frequency;
		});
		
		forms.INCLUDE.addFilters('date', function(e, cel, data){
			data.date = new InputCalendar({type:'datetime'});
			data.date.setDate(Object.isElement(e) ? e.Value() : e);
			return data.date;
		});
		
		forms.addFilters('INCLUDE', function(){
			
			var a = [];
			
			forms.INCLUDE.Table.getData().each(function(data){
				if(data.link.Value() != ''){
					a.push({
						link:		data.link.Value(), 
						date:		data.date.getDate(), 
						priority:	data.priority.Value(), 
						frequency:	data.frequency.Value()
					});	
				}
			});
			
			forms.INCLUDE.Table.clear();
			forms.INCLUDE.addRows(a);
				
			return a;
						
		});
		
		forms.INCLUDE.addRows(options.INCLUDE || []);
		
		panel.appendChild(forms.INCLUDE);
		//
		//
		//
		panel.appendChild(new Node('h4', $MUI('Pages à exclure')));
		
		forms.EXCLUDE = new WidgetTable({
			range1:		2000,
			range2:		2000,
			range3:		2000,
			readOnly:	true,
			search:		false,
			sort:		false,
			overable:	false,
			completer:	false
		});
		
		forms.EXCLUDE.DropMenu.addMenu($MUI('Ajouter'), {icon:'add'}).on('click', function(){
			forms.EXCLUDE.addRows([{link:''}]);
		});
		
		forms.EXCLUDE.Body().css('height', 200);
		forms.EXCLUDE.addHeader({
			'link':			{title:'URL de la page'},
			'Action':		{title:'', width:30, style:'text-align:center', type:'action'}
		});
		
		forms.EXCLUDE.addFilters('Action', function(e, cel){
			e.open.hide();
			
			e.remove.on('click', function(){
				cel.parentNode.parentNode.removeChild(cel.parentNode);
			});
			
			return e;
		});
		
		forms.EXCLUDE.addFilters('link', function(e, cel, data){
			
			data.link = new Input({type:'text', value:Object.isElement(e) ? e.Value() : e});
			data.link.css('width', '98%');
			
			return data.link;
		});
		
		forms.EXCLUDE.addRows(options.EXCLUDE || []);
		
		panel.appendChild(forms.EXCLUDE);
		
		forms.addFilters('EXCLUDE', function(){
			
			var a = [];
			
			forms.EXCLUDE.Table.getData().each(function(data){
				if(data.link.Value() != ''){
					a.push({
						link:		data.link.Value()
					});	
				}
			});
			
			forms.EXCLUDE.Table.clear();
			forms.EXCLUDE.addRows(a);
				
			return a;
		});
		//
		//
		//
		var submit = new SimpleButton({text:$MUI('Enregistrer'), type:'submit'});
		
		submit.on('click', function(){
			var box = win.createBox();
			var options = forms.save();
			
			System.Meta('SMG_OPTIONS', options);
			
			var splite = new SpliteIcon($MUI('Paramètres correctement enregistrés'));
			splite.setIcon('valid-48');
			
			box.a(splite).setTheme('flat white liquid');
			box.setType('CLOSE').Timer(5).show();
			
			System.exec('smg.robots.write');
		});
		
		panel.appendChild(submit);
		//
		//
		//
		var btnGenerate = new SimpleButton({text:$MUI('Générer le sitemap')});
		
		btnGenerate.on('click', function(){
			var box = win.createBox();
			
			var options = forms.save();
			
			System.Meta('SMG_OPTIONS', options);
			
			box.wait();
			
			System.exec('smg.robots.write');
			
			System.exec('smg.generate', function(result){
				
				var splite = new SpliteIcon($MUI('Sitemap correctement généré'));
				splite.setIcon('valid-48');
				
				box.a(splite).setTheme('flat white liquid');
				box.setType('CLOSE').Timer(5).show();
				
				System.exec('smg.notify');
				
			});
			
		});
		
		panel.appendChild(btnGenerate);
		
		return panel;	
	}
};

System.SiteMapGeneratorSetting.initialize();