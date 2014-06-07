/** section: Contacts
 * System.Contact.Export
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
System.Contact.Export = {
	options : [
		{text:$MUI('Format vCard'), value:'vcard', icon:'export-vcard-48'},
		{text:$MUI('Format CSV (Excel)'), value:'csve', icon:'export-excel-48'},
		{text:$MUI('Format CSV (Outlook)'), value:'csvo', icon:'export-csv-48'},
		{text:$MUI('Format XML'), value:'xml', icon:'export-xml-48'}/*,
		{text:$MUI('Format PDF'), value:'pdf', icon:'pdf-32'}*/
	],
/**
 * System.Contact.Export.open(win) -> void
 **/	
	open:function(box){
		
		box.Flag = 	box.box.createFlag().setType(FLAG.RIGHT);
		
		var forms = box.createForm();
		
		forms.FrameWorker = new FrameWorker({
			upload:		false,
			parameters:	'cmd=contact.export'
		});
		forms.FrameWorker.css('width', 10);
				
		var splite = new SpliteIcon($MUI('Panneau d\'exportation'));
		splite.setIcon('export-48');
			
		var html = new HtmlNode();
		html.css('padding', 0).css('margin', 'auto');
		html.appendChild(splite);
		
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
		
		$S.fire('contact.export:open', box);
	},
/**
 * System.Contact.Export.createWidgetModel(win) -> Widget
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
 * System.Contact.Export.submit(box, opener) -> void
 *
 * Cette méthode sauvegarde les données du formulaire de changement de date.
 **/
	submit: function(box){
		var forms = 	box.createForm();
				
		forms.FrameWorker.setParameters('options=' + Object.toJSON({Format:box.createForm().Format.Value()}));
		
		box.hide();
		box.setTheme();
		box.wait();
		
		box.a(forms.FrameWorker);
			
		forms.FrameWorker.submit();		
		
		return true;
	}
};