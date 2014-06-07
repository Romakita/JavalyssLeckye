/** section: CRM Master
 * System.CRM.Client.Print
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
System.CRM.Client.Print = {	
/**
 * System.CRM.Client.Print.open(win) -> void
 **/	
	open:function(client, box){
		
		box.Flag = 	box.box.createFlag().setType(FLAG.RIGHT);
		box.setData(client);
		
		box.createForm();
		
		var splite = new SpliteIcon($MUI('Panneau d\'impression de la fiche client'));
		splite.setIcon('print-48');
			
		var html = new HtmlNode();
		html.css('padding', 0).css('margin', 'auto');
		html.appendChild(splite);
		html.appendChild(this.createInfo(box));
		html.appendChild(new Node('h4', $MUI('Choix du modèle d\'impression')));
		html.appendChild(new Node('p', {style:'padding-left:0px'}, $MUI('Plusieurs modèles existent pour imprimer la fiche. Veuillez en choisir un :')));	
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
		
		$S.fire('print:open', box);
	},
/**
 * System.CRM.Client.Print.createWidgetInfo(win) -> Widget
 *
 * Cette méthode créer le widget d'information d'une fiche de location à dupliquer.
 **/	
	createInfo: function(box){
		//
		// Widget
		//
		var table = 	new TableData();
		table.css('margin-bottom', '10px;').css('width', '100%');
		
		table.addHead($MUI('Client') + ' : ' , {width:120}).addField(box.getData().Company, {style:'font-weight:bold;height:20px'}).addRow();
		table.addHead($MUI('Raison sociale') + ' : ' ).addField(box.getData().CompanyName, {style:'font-weight:bold;height:20px'}).addRow();
				
		table.addHead($MUI('E-mail') + ' : ' ).addField(box.getData().Email, {style:'font-weight:bold;height:20px'}).addRow();
		table.addHead($MUI('Téléphone') + ' : ' ).addField(box.getData().Phone, {style:'font-weight:bold;height:20px'}).addRow();
		table.addHead($MUI('Fax') + ' : ' ).addField(box.getData().Fax, {style:'font-weight:bold;height:20px'}).addRow();
		//table.addHead($MUI('Client') + ' : ').addField(win.client.Company, {style:'font-weight:bold'}).addRow();
						
		return table;
	},
/**
 * System.CRM.Client.Print.createWidgetModel(win) -> Widget
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
		
			System.exec('crm.client.model.get', function(result){
				try{
					var options = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					return ;
				}
				
				System.CRM.Client.Print.options = options;
				
				forms.Models.setData(options);
			});
		}
				
		return forms.Models;
	},
/**
 * System.CRM.Client.Print.submit(box, opener) -> void
 *
 * Cette méthode sauvegarde les données du formulaire de changement de date.
 **/
	submit: function(box){
		
		box.setTheme();		
		box.wait();
		
		var options = {
			Model:box.createForm().Models.Value()
		};
		
		box.getData().print(options, function(result){
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
		});
		
		return true;
	}
};