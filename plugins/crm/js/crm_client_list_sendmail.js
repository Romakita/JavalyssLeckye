/** section: CRM Master
 * System.CRM.Client.Send
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
System.CRM.Client.Send = {
/**
 * System.CRM.Client.Send.open(win) -> void
 **/	
	open:function(clauses, options, box){
		
		box.Flag = 	box.box.createFlag().setType(FLAG.RIGHT);
		box.setData({clauses:clauses, options:options});
		
		var forms = box.createForm();
						
		var splite = new SpliteIcon($MUI('Envoi d\'e-mail groupé'));
		splite.setIcon('mail-48');
			
		var html = new HtmlNode();
		html.css('padding', 0).css('margin', 'auto');
		html.appendChild(splite);
		html.appendChild(this.createInfo(box));
				
		box.box.createBox();
		
		box.a(html);		
		box.setTheme('flat white liquid');
		box.setType().show();
				
		box.submit({
			text: $MUI('Envoyer'),
			click: function(){
				return this.submit(box);
			}.bind(this)
		});
		
		box.reset({
			click: function(){
				this.setTheme();
			}
		});
		
		$S.fire('crm.client.list.export:open', box);
	},
/**
 * System.CRM.Client.Send.createWidgetInfo(win) -> Widget
 *
 * Cette méthode créer le widget d'information d'une fiche de location à dupliquer.
 **/	
	createInfo: function(box){
		//
		//
		//
		var forms = box.createForm();
		
		forms.PrintMode = new Select();
		forms.PrintMode.css('width', 300);
		
		forms.PrintMode.on('draw', function(line){
			if(line.data.value == 'selected'){
				if(box.getData().options.clients.length == 0){
					line.hide();
				}
			}
		});
		
		forms.PrintMode.setData([
			{text:$MUI('De la page active'), value:'active'},
			{text:$MUI('D\'une selection de page'), value:'selection'},
			{text:$MUI('Des clients sélectionnés dans le listing'), value:'selected'},
			{text:$MUI('Tous les clients du listing'), value:'all', icon:'alert'}		
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
				
		table.addHead($MUI('Adresse e-mail') + ' : ' , {width:120}).addCel(forms.PrintMode, {colSpan:3}).addRow();
		table.addHead($MUI('De la page')).addCel(forms.StartPage, {width:40}).addCel($MUI('à'), {style:'text-align:center;width:10px'}).addCel(forms.EndPage).addRow();
							
		forms.StartPage.parentNode.parentNode.hide();
			
		return table;
	},
/**
 * System.CRM.Client.Send.submit(box, opener) -> void
 *
 * Cette méthode sauvegarde les données du formulaire de changement de date.
 **/
	submit: function(box){
		try{
		var forms = 	box.createForm();
		var clauses = 	box.getData().clauses.clone();
				
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
				
				var mails = [];
				
				box.getData().options.clients.each(function(e){
					mails.push(e.Email);
				});
				
				System.Opener.open('mailto', mails);
				box.hide();
				return;
		}
		
		box.getData().options.op = '-mail';
		
		System.exec('crm.client.list', {
			parameters:'options=' + Object.EncodeJSON(box.getData().options) + '&clauses=' + clauses.toJSON(),
			onComplete:function(result){
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				try{
					var mails = [];
				
					array.each(function(e){
						mails.push(e.Email);
					});
					
					System.Opener.open('mail', mails);
					
				}catch(er){$S.trace(er)}
			}
		});
		}catch(er){alert(er)}
		
		return true;
	}
};