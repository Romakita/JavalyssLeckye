/** section: CRM
 * System.CRM.Statistics
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : crm_statistics.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.CRM.Statistics = {
/** 
 * System.CRM.Statistics.options -> Array
 **/	
	options : [
		{text:$MUI('Format CSV'), value:'csv', icon:'export-csv-48'},
		{text:$MUI('Format Excel (xls)'), value:'xls', icon:'export-excel-48'},
		{text:$MUI('Format Excel (xlsx)'), value:'xlsx', icon:'export-excel-48'}
	],
/** 
 * System.CRM.Statistics.open() -> void
 **/	
	open:function(){
		
		var win = $WR.getByName('crm');
		var panel = win.Panel;
		
		System.CRM.setCurrent('statistics');
		
		if(!this.Board){
			this.Board = new WidgetContainer({number:2});
			
			var forms = this.Board.Form = {};
			var self =	this;
			//
			//
			//
			forms.User_ID = 		new Select({
				parameters:'cmd=user.list&options='+Object.EncodeJSON({
					op:			'-select',
					Roles:		System.Meta('CRM_GROUP_CALLER'),
					default:	' - Choisissez -'
				})
			});
			
			forms.User_ID.Value(0);
			forms.User_ID.load();
			
			forms.User_ID.css('width', 150);
			//
			//
			//
			var date = new Date();
			
			forms.Month = new Select();
			forms.Month.css('width', 100);
			forms.Month.setData(MUI.month[MUI.lang]);
			forms.Month.selectedIndex(date.getMonth());
			//
			//
			//
			forms.Year = new Select();
			forms.Year.css('width', 100);
			forms.Year.setData([
				{text:date.getFullYear() - 2, value:date.getFullYear() - 2},
				{text:date.getFullYear() - 1, value:date.getFullYear() - 1},
				{text:date.getFullYear(), value:date.getFullYear()}
			]);
			forms.Year.Value(date.getFullYear());
			
			forms.submit = new SimpleButton({text:'Générer'});
			forms.submit.on('click', function(){
				
				self.userTable.hide();
				
				if(forms.User_ID.Value()){
					var date = forms.Year.Value() + '-' + ('0' + (forms.Month.selectedIndex() + 1)).slice(-2) + '-01';
					
					date =		date.toDate();
					
					self.widgetUserTable.setParameters('cmd=crm.statistic.user&options=' + Object.EncodeJSON({User_ID:forms.User_ID.Value(), Days:date.getDaysInMonth(), Date:date.format('Y-m-d')}));
					self.widgetUserTable.load();
					self.widgetUserTable.show();
					
					var win =	$WR.getByName('crm');
					win.Panel.ProgressBar.show();
					win.createBubble().hide();
				}else{
					self.widgetUserTable.hide();
				}
				
			});
			//
			//
			//
			var table = this.Board.Navigation = new TableData();
			table.addClassName('liquid');
			table.css('margin', 0).css('margin-top', '-12px');
			
			table.addCel('Générer statistique pour :').addCel(forms.User_ID);		
			table.addCel('Mois / Anneé : ').addCel(forms.Month);
			table.addCel('/').addCel(forms.Year);	
			
			table.addCel(forms.submit);		
			//
			// Col 1
			//
			this.Board[0].css('width', 'calc(100% - 448px - 1.5%)');
			this.Board[0].appendChild(this.widgetUserTable = this.createWidgetUser(win));
			
			this.widgetUserTable.hide();
			
			this.widgetUserTable.on('complete', function(obj){
				
				this.userTable.show();
				
				var height = panel.PanelBody.getHeight() - 180;
				this.widgetUserTable.setHeight(height);
				this.widgetUserTable.refresh();
				
				this.widgetUserTable.footer.clear();
				this.widgetUserTable.footer.addRows([obj.Total]);
				
				this.userTable.getCel(0,1).innerHTML = obj.Total.Nb_Call;
				this.userTable.getCel(1,1).innerHTML = obj.Total.Nb_Opened_Work;
				this.userTable.getCel(2,1).innerHTML = obj.Total.Nb_Opened_Work != 0 ? Math.round(obj.Total.Nb_Call / obj.Total.Nb_Opened_Work) : 0;
				this.userTable.getCel(3,1).innerHTML = obj.Total.Min_Call;
				this.userTable.getCel(4,1).innerHTML = obj.Total.Max_Call;
				
				
				this.userTable.getCel(6,1).innerHTML = obj.Total.Nb_Days_Call_30 + ' ' + $MUI('jour(s)');
				this.userTable.getCel(7,1).innerHTML = obj.Total.Nb_Days_Call_30_50 + ' ' + $MUI('jour(s)');
				this.userTable.getCel(8,1).innerHTML = obj.Total.Nb_Days_Call_50 + ' ' + $MUI('jour(s)');
				
				var win =	$WR.getByName('crm');
								
				if(win.Panel.ProgressBar.hasClassName('splashscreen')){
					new Timer(function(){
						win.Panel.ProgressBar.hide();
						win.Panel.ProgressBar.removeClassName('splashscreen');
					}, 0.5, 1).start();
				}else{
					win.Panel.ProgressBar.hide();
				}
				
			}.bind(this));			
			//
			// Col 2
			//
			this.Board[1].css('width', '448px');
			
			var table = this.userTable = new TableData();
			table.hide();
			table.addClassName('liquid');
			table.addHead($MUI('Nombre appels du mois') + ' : ', {style:'font-size:18px;width:270px'}).addCel(' ', {style:'font-weight:bold;font-size:20px; width:150px'}).addRow();
			table.addHead($MUI('Jours ouvré (présence salarié)') + ' : ', {style:'font-size:18px'}).addCel(' ', {style:'font-weight:bold;font-size:20px'}).addRow();
			table.addHead($MUI('Appels moyen par jour ouvré') + ' : ', {style:'font-size:18px'}).addCel(' ', {style:'font-weight:bold;font-size:20px'}).addRow();
			table.addHead('- ' + $MUI('Valeur minimale') + ' : ', {style:'font-size:16px; padding-left:15px'}).addCel(' ', {style:'font-weight:bold;font-size:16px'}).addRow();
			table.addHead('- ' + $MUI('Valeur maximale') + ' : ', {style:'font-size:16px; padding-left:15px'}).addCel(' ', {style:'font-weight:bold;font-size:16px'}).addRow();
			
			table.addHead($MUI('Nombre de jour pour les appels passés') + ' : ', {style:'font-size:18px; text-align:left', colSpan:2}).addRow();
			table.addHead('- ' + $MUI('Etant inférieur à 30') + ' : ', {style:'font-size:16px; padding-left:15px'}).addCel(' ', {style:'font-weight:bold;font-size:16px'}).addRow();
			table.addHead('- ' + $MUI('Entre 30 et 50') + ' : ', {style:'font-size:16px; padding-left:15px'}).addCel(' ', {style:'font-weight:bold;font-size:16px'}).addRow();
			table.addHead('- ' + $MUI('Supérieur à 50') + ' : ', {style:'font-size:16px; padding-left:15px'}).addCel(' ', {style:'font-weight:bold;font-size:16px'}).addRow();
			
			forms.BtnExport = new SimpleButton({text:$MUI('Exporter le rapport'), icon:'export-48', type:'large'});
			forms.BtnExport.on('click', function(){
				var date = forms.Year.Value() + '-' + ('0' + (forms.Month.selectedIndex() + 1)).slice(-2) + '-01';
				date =		date.toDate();
					
				self.openExport({
					User_ID:	forms.User_ID.Value(), 
					Days:		date.getDaysInMonth(), 
					Date:		date.format('Y-m-d')
				});
			});
			table.addCel(forms.BtnExport);
			
			this.Board[1].appendChild(table);
			
		}
		
		panel.PanelBody.Header().appendChilds([
			this.Board.Navigation
		]);
		
		panel.PanelBody.Body().appendChild(this.Board);		
	},
/** 
 * System.CRM.Statistics.createWidgetUser(win) -> Widget
 **/	
	createWidgetUser:function(win){
		
		var options = {
			range1:		2000,
			range2:		2000,
			range3:		2000,
			readOnly:	true,
			link: 		$S.link,
			selectable:	false,
			select:		false,
			completer:	true,
			count:		false,	
			overable:	false,
			complex:	true,
			progress:	false,
			sort:		false,
			
			empty:		'- ' + $MUI('Aucune donnnée') + ' -',
			header:	{
				Date:				{title:$MUI('Date'), style:'text-align:center; background:#DFDFDF; font-weight:bold', width:90},
				
				Nb_Call:			{title:$MUI('Nb Appels'), style:'text-align:center;', width:80},
				NRP:				{title:$MUI('NRP'), style:'text-align:center;', width:70},
				NRA:				{title:$MUI('NRA'), style:'text-align:center;', width:70},
				CTINF:				{title:$MUI('CTINF'), style:'text-align:center;', width:70},
				PROJ:				{title:$MUI('PROJ'), style:'text-align:center;', width:70},
				OTH:				{title:$MUI('Autre'), style:'text-align:center;', width:70},
				RDV:				{title:$MUI('Nb RDV'), style:'text-align:center;', width:70},
				
				Start_AM:			{title:$MUI('1er appel AM'), style:'text-align:center', width:85},
				End_AM:				{title:$MUI('Dernier appel AM'), style:'text-align:center', width:85},
				Start_PM:			{title:$MUI('1er appel PM'), style:'text-align:center', width:85},
				End_PM:				{title:$MUI('Dernier appel PM'), style:'text-align:center', width:85},
				
				Duree:				{title:$MUI('Durée'), style:'text-align:center', width:80},
				
				Complement:			{title:'', style:'text-align:center; padding:0'}
			}
		};
		
		var table = new SimpleTable(options);
		
		table.addClassName('crm-table statistics');
		
		table.addHeader(options.header);
		
		table.footer = new SimpleTable(options);
		table.footer.addHeader(options.header);
		table.footer.addClassName('crm-table statistics footer');
		
		table.footer.addFilters('Date', function(e, cel, data){
			cel.css('text-align', 'right');
			
			return $MUI('Total : ');
		});
		
		table.addFilters('Date', function(e, cel, data){
			var date = data.Date.toDate();
			
			if(date.getDay() == 0 || date.getDay() == 6){
				
				cel.parentNode.css('background', '#CFCFCF');
				cel.css('background', 'transparent');	
			}else{
				cel.parentNode.css('background', 'white');	
			}
						
			return date.format('d-M');
		}.bind(this));
		
		table.addFilters(['Nb_Call', 'NRP', 'NRA', 'CTINF', 'PROJ', 'RDV','OTH'], function(e, cel, data){
			return e == 0 ? '' : e;
		});
		
		table.addFilters(['Start_AM', 'End_AM', 'Start_PM', 'End_PM'], function(e, cel, data){
			
			if(e == null){
				var date = data.Date.toDate();
				
				if(!(date.getDay() == 0 || date.getDay() == 6)){
					cel.css('background', '#F0F0F0');
				}
				return '';	
			}
			
			return e.toDate().format('h\\hi');
		});
		
		table.appendChild(table.footer);
		
		return table;
	},
/** 
 * System.CRM.Statistics.openExport(win) -> Widget
 **/	
	openExport:function(options){
		
		var win = $WR.getByName('crm');
		var box = win.createBox();
		
		box.Flag = 	box.box.createFlag().setType(FLAG.RIGHT);
		box.setData({options:options});
		
		var forms = box.createForm();
						
		var splite = new SpliteIcon($MUI('Panneau d\'exportation'));
		splite.setIcon('export-48');
			
		var html = new HtmlNode();
		html.css('padding', 0).css('margin', 'auto');
		html.appendChild(splite);
		html.appendChild(new Node('h4', $MUI('Choix du format d\'exportation')));
		html.appendChild(this.createModels(box));
		
		box.box.createBox();
		
		box.a(html);		
		box.setTheme('flat white liquid');
		box.setType('CLOSE').show();
				
		box.reset({
			click: function(){
				this.setTheme();
			}
		});
		
		$S.fire('crm.statistic.list.export:open', box);
	},
/**
 * System.CRM.Statistics.createWidgetModel(win) -> Widget
 *
 * Cette méthode créer le widget d'information d'une fiche de location à dupliquer.
 **/
	createModels: function(win){
		var forms = win.createForm();
		var self =	this;
		
		//
		// Widget
		//
		forms.Format = 			new Node('div', {className:'area-input', style:'height:auto; overflow:auto; border-width:2px; border-radius:0; text-align:center'});			
		
		for(var i = 0; i < this.options.length; i++){
			
			var button = new AppButton(this.options[i]);
			button.value = this.options[i].value;
			
			button.on('click', function(){
				forms.Format.select('.selected').invoke('Selected', false);
				this.Selected(true);
				
				self.submitExport(win);					
			});
			
			forms.Format.appendChild(button);
		}
		
		forms.Format.Value = function(){
			var a = forms.Format.select('.selected');
			if(a.length == 0){
				return '';	
			}
			return a[0].value;
		};
		
		return forms.Format;
	},
/**
 * System.CRM.Statistics.submitExport(box, opener) -> void
 *
 * Cette méthode sauvegarde les données du formulaire de changement de date.
 **/
	submitExport: function(box){
		var forms = 	box.createForm();
		
		box.hide();
		box.wait();
		
		box.getData().options.Format = box.createForm().Format.Value();
			
		$S.exec('crm.statistic.export', {
			parameters: 'options='+ Object.EncodeJSON(box.getData().options),
			onComplete:	function(result){
				box.hide();
				
				var file = 		result.responseText.evalJSON();
				
				var iFrame =	new Node('iframe', {style:'width:300px;height:300px;display:none', name:'myframe', src:file});
				
				var splite = new SpliteIcon($MUI('Téléchargement du fichier en cours'));
				splite.setIcon('valid-48');
				box.setTheme('flat liquid black');
				box.appendChild(iFrame);
				box.a(splite).Timer(5).setType('NONE').show();
			}
		});
		
		return true;
	}
};