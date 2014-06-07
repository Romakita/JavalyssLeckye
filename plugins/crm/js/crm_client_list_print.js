/** section: CRM Master
 * System.CRM.Client.PrintList
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
System.CRM.Client.PrintList = {	
/**
 * System.CRM.Client.PrintList.open(win) -> void
 **/	
	open:function(clauses, options, box){
		
		box.Flag = 	box.box.createFlag().setType(FLAG.RIGHT);
		box.setData({clauses:clauses, options:options});
		
		box.createForm();
		
		var splite = new SpliteIcon($MUI('Panneau d\'impression'));
		splite.setIcon('print-48');
			
		var html = new HtmlNode();
		html.css('padding', 0).css('margin', 'auto');
		html.appendChild(splite);
		html.appendChild(this.createInfo(box));
		html.appendChild(new Node('h4', $MUI('Choix du modèle d\'impression')));
		html.appendChild(new Node('p', {style:'padding-left:0px'}, $MUI('Plusieurs modèles existent pour imprimer le listing. Veuillez en choisir un :')));	
		html.appendChild(this.createModels(box));
		
		box.a(html);		
		box.setTheme('flat white liquid');
		box.setType().show();
				
		box.submit({
			text: $MUI('Imprimer'),
			click: function(){
				return this.submit(box);
			}.bind(this)
		});
		
		box.reset({
			click: function(){
				this.setTheme();
			}
		});
		
		$S.fire('crm.client.list.print:open', box);
	},
/**
 * System.CRM.Client.PrintList.createWidgetInfo(win) -> Widget
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
				
		table.addHead($MUI('Imprimer') + ' : ' , {width:120}).addCel(forms.PrintMode, {colSpan:3}).addRow();
		table.addHead($MUI('De la page')).addCel(forms.StartPage, {width:40}).addCel($MUI('à'), {style:'text-align:center;width:10px'}).addCel(forms.EndPage).addRow();
							
		forms.StartPage.parentNode.parentNode.hide();
			
		return table;
	},
/**
 * System.CRM.Client.PrintList.createWidgetModel(win) -> Widget
 *
 * Cette méthode créer le widget d'information d'une fiche de location à dupliquer.
 **/
	createModels: function(win){
		var forms = win.createForm();
		
		//
		// Widget
		//
		forms.Models = 			new Node('div', {className:'area-input', style:'height:300px; overflow:auto; border-width:2px; border-radius:0'});			
		forms.Models.appendChild(new Node('p', $MUI('Chargement en cours') +'...'));
			
		forms.Models.setData = function(array){
			this.removeChilds();
			
			var i = 0;
			for(var key in array){
				
				var data = 	array[key];
				var button = new HeadPiece({
					src: 	data.PathURI + 'screenshot.png',
					resize:	true,
					title:	data.Name
				});
				
				button.value = 	key;
				button.data = 	data;
				button.Large(true);
				
				if(i == 0){
					button.Selected(true);
					i++;
				}
				
				button.on('click', function(){
					forms.Models.select('.selected').invoke('Selected', false);
					this.Selected(true);					
				});
				
				this.appendChild(button);
			};
		};
		
		forms.Models.Value = function(){
			var a = forms.Models.select('.selected');
			if(a.length == 0){
				return '';	
			}
			return a[0];
		};
		
		if(this.options){
			
			forms.Models.setData(this.options);
			
		}else{
		
			System.exec('crm.client.model.list.get', function(result){
				try{
					var options = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					return ;
				}
				
				System.CRM.Client.PrintList.options = options;
				
				forms.Models.setData(options);
			});
		}
				
		return forms.Models;
	},
/**
 * System.CRM.Client.PrintList.submit(box, opener) -> void
 *
 * Cette méthode sauvegarde les données du formulaire de changement de date.
 **/
	submit: function(box){
		var forms = 	box.createForm();
		var clauses = 	box.getData().clauses.clone();
		box.setTheme();		
		box.wait();
		
		switch(forms.PrintMode.Value()){
			case 'active':break;
			case 'selection':
				
				var o  = {
					where:  clauses.where,
					limits: '',
					toJSON: function(){
						return Object.EncodeJSON(this)
					}
				};
				
				var start = 	forms.StartPage.Value() * clauses.pagination;
				var end = 		forms.EndPage.Value() * clauses.pagination - start;
				o.limits = 		start + ',' + end;
				
				clauses = 		o;
				
				break;
				
			case 'all':
				clauses  = {
					where:  clauses.where,
					limits: '',
					toJSON: function(){
						return Object.EncodeJSON(this)
					}
				};
				break;
				
			case 'selected':
				var clauses = {toJSON:function(){return '{}'}};
				box.getData().options.Clients = [];
				
				box.getData().options.clients.each(function(e){
					box.getData().options.Clients.push(e.Client_ID);
				});
				
				delete  box.getData().options.clients;
				
				break;
		}
		
		box.getData().options.Model = box.createForm().Models.Value();
				
		System.exec('crm.client.list.print', {
			parameters:'options=' + Object.EncodeJSON(box.getData().options) + '&clauses=' + clauses.toJSON(),
			onComplete:function(result){
				try{
					var link = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				try{
					box.hide();
									
					var win = System.openPDF(link);
					win.setTitle(box.forms.Models.data.Name);	
					win.Resizable(false);
					
					document.body.appendChild(win);
				}catch(er){$S.trace(er)}
			}
		});
		
		return true;
	}
};