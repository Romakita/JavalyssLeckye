/** section: CRM Master
 * System.Agenda.PrintList
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
System.Agenda.PrintList = {	
/**
 * System.Agenda.PrintList.open(win) -> void
 **/	
	open:function(options, box){
		
		box.Flag = 	box.box.createFlag().setType(FLAG.RIGHT);
		box.setData({clauses:{}, options:options});
		
		box.createForm();
		
		var splite = new SpliteIcon($MUI('Panneau d\'impression'));
		splite.setIcon('print-48');
			
		var html = new HtmlNode();
		html.css('padding', 0).css('margin', 'auto');
		html.appendChild(splite);
		html.appendChild(this.createInfo(box));
		html.appendChild(new Node('h4', $MUI('Choix du modèle d\'impression')));
		html.appendChild(new Node('p', {style:'padding-left:0px'}, $MUI('Plusieurs modèles existent pour imprimer le listing. Veuillez en choisir un :')));	
		html.appendChild(this.createModel(box));
		
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
		
		$S.fire('agenda.print:open', box);
	},
/**
 * System.Agenda.PrintList.createWidgetInfo(win) -> Widget
 *
 * Cette méthode créer le widget d'information d'une fiche de location à dupliquer.
 **/	
	createInfo: function(box){
		//
		//
		//
		var forms = box.createForm();
		//
		//
		//
		forms.start = new InputCalendar({
			type:'date'
		});
		forms.start.setDate(box.getData().options.start);
		forms.start.Large(true);
		//
		//
		//
		forms.end = new InputCalendar({
			type:'date'
		});
		
		forms.end.setDate(box.getData().options.end);
		forms.end.linkTo(forms.start);
		forms.end.Large(true);
		//
		//
		//
		forms.Users = new Select({
			multiple:true,
			parameters:'cmd=user.list&options=' + Object.EncodeJSON({Users:System.Agenda.getUsersID()})	
		});
		forms.Users.Large(true);
		forms.Users.Value([System.Agenda.getUserID()]);
		forms.Users.load();
		
		forms.addFilters('Users', function(){
			var a = [];
			
			this.Users.Value().each(function(e){
				a.push(e.value);
			});
			
			return a;
		});
		//
		// Widget
		//
		var table = 	new TableData();
		table.css('margin-bottom', '10px;').css('width', '100%');
				
		table.addHead($MUI('Imprimer du'), {width:120}).addCel(forms.start, {style:'font-weight:bold'}).addRow();
		table.addHead($MUI('Au')).addCel(forms.end, {style:'font-weight:bold'}).addRow();
		table.addHead($MUI('Agenda de')).addCel(forms.Users).addRow();
		
		return table;
	},
/**
 * System.Agenda.PrintList.createWidgetModel(win) -> Widget
 *
 * Cette méthode créer le widget d'information d'une fiche de location à dupliquer.
 **/
	createModel: function(win){
		var forms = win.createForm();
		
		//
		// Widget
		//
		forms.Model = 			new Node('div', {className:'area-input', style:'height:300px; overflow:auto; border-width:2px; border-radius:0'});			
		forms.Model.appendChild(new Node('p', $MUI('Chargement en cours') +'...'));
			
		forms.Model.setData = function(array){
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
					forms.Model.select('.selected').invoke('Selected', false);
					this.Selected(true);					
				});
				
				this.appendChild(button);
			};
		};
		
		forms.Model.Value = function(){
			var a = forms.Model.select('.selected');
			if(a.length == 0){
				return '';	
			}
			return a[0].value;
		};
		
		if(this.options){
			
			forms.Model.setData(this.options);
			
		}else{
		
			System.exec('agenda.event.model.list.get', function(result){
				try{
					var options = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					return ;
				}
				
				System.Agenda.PrintList.options = options;
				
				forms.Model.setData(options);
			});
		}
				
		return forms.Model;
	},
/**
 * System.Agenda.PrintList.submit(box, opener) -> void
 *
 * Cette méthode sauvegarde les données du formulaire de changement de date.
 **/
	submit: function(box){
		var forms = 	box.createForm();
		box.setTheme();		
		box.wait();
		
		box.forms.save(box.getData().options);
							
		System.exec('agenda.event.list.print', {
			parameters:'options=' + Object.EncodeJSON(box.getData().options),
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
					win.setTitle(box.forms.Model.data.Name);	
					win.Resizable(false);
					
					document.body.appendChild(win);
				}catch(er){$S.trace(er)}
			}
		});
		
		return true;
	}
};