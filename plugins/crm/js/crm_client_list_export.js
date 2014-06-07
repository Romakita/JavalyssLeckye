/** section: CRM Master
 * System.CRM.Client.Export
 *
 * Cette espace de nom regroupe les méthodes et IHM gérant l'impression d'une fiche cliente.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_client_print.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.CRM.Client.Export = {
	options : [
		{text:$MUI('Format vCard'), value:'vcard', icon:'export-vcard-48'},
		{text:$MUI('Format CSV (Excel)'), value:'csve', icon:'export-excel-48'},
		{text:$MUI('Format CSV (Outlook)'), value:'csvo', icon:'export-csv-48'},
		{text:$MUI('Format XML'), value:'xml', icon:'export-xml-48'}/*,
		{text:$MUI('Format PDF'), value:'pdf', icon:'pdf-32'}*/
	],
/**
 * System.CRM.Client.Export.open(win) -> void
 **/	
	open:function(clauses, options, box){
		
		box.Flag = 	box.box.createFlag().setType(FLAG.RIGHT);
		box.setData({clauses:clauses, options:options});
		
		var forms = box.createForm();
		
		forms.FrameWorker = new FrameWorker({
			upload:		false,
			parameters:	'cmd=crm.client.export'
		});
		forms.FrameWorker.css('width', 10);
				
		var splite = new SpliteIcon($MUI('Panneau d\'exportation'));
		splite.setIcon('export-48');
			
		var html = new HtmlNode();
		html.css('padding', 0).css('margin', 'auto');
		html.appendChild(splite);
		html.appendChild(this.createInfo(box));
		html.appendChild(new Node('h4', $MUI('Choix du format d\'exportation')));
		html.appendChild(this.createModels(box));
		
		forms.FrameWorker.on('complete', function(uri){
			
			forms.FrameWorker.FrameWorker.src = uri;
			
			new Timer(function(){
				box.hide();
			}, 1.5, 1).start();
		});
		
		box.box.createBox();
		
		box.a(html);		
		box.setTheme('flat white liquid');
		box.setType('CLOSE').show();
				
		box.reset({
			click: function(){
				this.setTheme();
			}
		});
		
		$S.fire('crm.client.list.export:open', box);
	},
/**
 * System.CRM.Client.Export.createWidgetInfo(win) -> Widget
 *
 * Cette méthode créer le widget d'information d'une fiche de location à dupliquer.
 **/	
	createInfo: function(box){
		//
		//
		//
		var forms = box.createForm();
		
		forms.PrintMode = new Select();
		forms.PrintMode.on('draw', function(line){
			if(line.data.value == 'selected'){
				if(box.getData().options.clients.length == 0){
					line.hide();
				}
			}
		});
		
		forms.PrintMode.setData([
			{text:$MUI('La page active'), value:'active'},
			{text:$MUI('Une selection de page'), value:'selection'},
			{text:$MUI('Les clients sélectionnés dans le listing'), value:'selected'},
			{text:$MUI('Toutes les pages'), value:'all', icon:'alert'}	
		]);
		forms.PrintMode.Large(true);
		forms.PrintMode.selectedIndex(0);
		forms.PrintMode.on('change', function(){
			if(this.Value() == 'selection'){
				forms.StartPage.parentNode.parentNode.show();
			}else{
				forms.StartPage.parentNode.parentNode.hide();	
			}
		});
		//
		//
		//
		forms.StartPage = 	new Input({type:'number', value:box.getData().clauses.page+1, decimal:0}); 
		forms.StartPage.css('width', '40px').css('text-align','right');
		//
		//
		//
		forms.EndPage = 	new Input({type:'number', value: Math.round(box.getData().clauses.maxLength / box.getData().clauses.pagination), decimal:0}); 
		forms.EndPage.css('width', '40px').css('text-align','right');
		
		//
		// Widget
		//
		var table = 	new TableData();
		table.css('margin-bottom', '10px;').css('width', '100%');
				
		table.addHead($MUI('Exporter') + ' : ' , {width:120}).addCel(forms.PrintMode, {colSpan:3}).addRow();
		table.addHead($MUI('De la page')).addCel(forms.StartPage, {width:40}).addCel($MUI('à'), {style:'text-align:center;width:10px'}).addCel(forms.EndPage).addRow();
							
		forms.StartPage.parentNode.parentNode.hide();
			
		return table;
	},
/**
 * System.CRM.Client.Export.createWidgetModel(win) -> Widget
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
				
				self.submit(win);					
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
 * System.CRM.Client.Export.submit(box, opener) -> void
 *
 * Cette méthode sauvegarde les données du formulaire de changement de date.
 **/
	submit: function(box){
		var forms = 	box.createForm();
		var clauses = {};
		Object.extend(clauses, unescape(box.getData().clauses.toJSON()).evalJSON());
				
		switch(forms.PrintMode.Value()){
			case 'active':break;
			
			case 'selection':
				
				var start = 		forms.StartPage.Value() * box.getData().clauses.pagination;
				var end = 			forms.EndPage.Value() * box.getData().clauses.pagination - start;
				clauses.limits = 	start + ',' + end;
								
				break;
				
			case 'all':
				clauses.limits = '';
				break;
			
			case 'selected':
				var clauses = {};
				box.getData().options.Clients = [];
				
				box.getData().options.clients.each(function(e){
					box.getData().options.Clients.push(e.Client_ID);
				});
				
				delete  box.getData().options.clients;
				
				break;
		}
		
		box.getData().options.Format = box.createForm().Format.Value();
		
		forms.FrameWorker.setParameters('options=' + Object.toJSON(box.getData().options));
		forms.FrameWorker.setParameters('clauses=' + Object.toJSON(clauses));
		
		box.hide();
		box.setTheme();
		box.wait();
		
		box.a(forms.FrameWorker);
			
		forms.FrameWorker.submit();		
		
		return true;
	}
};