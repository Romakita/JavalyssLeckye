// JavaScript Document
System.CRM.Import = {
/**
 *
 **/	
	open:function(win){
		try{
			
			var forms = win.createForm();
			var panel = win.Panel;
			
			panel.clearSwipAll();
					
			win.Panel.Open(true, 900);
			
			panel.PanelSwip.footer.removeChilds();
			
			panel.PanelSwip.addPanel($MUI('Clients'), this.createPanel(win)).on('click', function(){
				win.submitClients.show();
				win.submitContacts.hide();
			});
			
			panel.PanelSwip.addPanel($MUI('Contacts'), System.Contact.Import.createPanel(win)).on('click', function(){
				win.submitContacts.show();
				win.submitClients.hide();
			});
			//
			//
			//
			$S.fire('crm.client.import:open', win);
			
		}catch(er){$S.trace(er)}
	},
/**
 *
 **/	
	createPanel:function(win){
		
		var forms = new Extends.Form();
		var panel = new Panel();
		var flag = win.createFlag();
		
		
		panel.appendChild(new Node('H1', {style:'margin: 0px 0px 25px;'}, $MUI('Importation de fiche client')));
		//
		//
		//
		forms.File = new FrameWorker({
			multiple:	false,
			parameters: 'cmd=crm.client.get.data',
			mini:		true
		});
		
		forms.File.DropFile.Flag = win.createFlag();
		
		forms.File.on('error', function(result){
			
			$S.trace(result.responseText);
			
			panel.select('.show-import-elements').invoke('hide');
			
			if(forms.Data){
				try{
					forms.Data.parentNode.removeChild(forms.Data);
				}catch(er){}
			}
			//forms.submit.hide();
		});
		
		forms.File.on('cancel', function(){
			
			panel.select('.show-import-elements').invoke('hide');
			
			if(forms.Data){
				forms.Data.parentNode.removeChild(forms.Data);
			}
			//forms.submit.hide();
		});
		
		forms.File.on('change', function(obj){
			
			panel.select('.show-import-elements').invoke('hide');
			
			if(forms.Data){
				try{
					forms.Data.parentNode.removeChild(forms.Data);
				}catch(er){};
			}
			//forms.submit.hide();
		});
		
		forms.File.on('complete', function(obj){
			
			forms.ExcludeFirstLine.Value(obj.ExcludeFirstLine);
			
			panel.select('.show-import-elements').invoke('show');
			
			forms.Data = System.CRM.Import.createTable();
			panel.select('.the-table')[0].appendChild(forms.Data);
			
			forms.Header = {};
			
			for(var key in obj.header){
				
				var select = new Select();
				select.linkCSS = 'cel-' + key;
				select.key = key;
								
				select.setData(obj.header[key].data);
				select.css('width', 120);
				
				select.remove = new SimpleButton({icon:'cancel-14', type:'mini'});
				select.remove.css('position', 'absolute').css('right', 0).css('top', '8px');
				
				flag.add(select.remove, {
					orientation: 	Flag.TOP,
					text:			$MUI('Cliquez ici pour supprimer la colonne')
				});
				
				//obj.header[key].style = 'font-size:10px;line-height:normal;border:1px solid #CFCFCF; background:white';
				obj.header[key].title = new Node('div', {style:'width:145px; position:relative;'}, [
					select,
					select.remove
				]);
								
				forms.Header[key] = select;
				
				select.remove.on('click', function(){
					this.Value('');
				 	forms.Data.select('.' + this.linkCSS).invoke('hide');
				}.bind(select));
			}
			
			forms.addFilters('Header', function(){
				
				var a = [];
				
				for(var key in this.Header){
					if(this.Header[key].Value() == '') continue;
					
					a.push({'key': this.Header[key].key, 'field': this.Header[key].Value()});					
				}
				
				return a;
			});
						
			forms.Data.addHeader(obj.header);
						
			new fThread(function(){
				forms.Data.addRows(obj.data);
			}, 0.5);
			
			forms.submit.show();
		});
		
		forms.File.css('margin', '25px 20px 40px');
		
		//panel.appendChild(new Node('h4', $MUI('Chargement de votre fichier (format : csv, vcard, xls ou xml)')));
		panel.appendChild(new Node('h4', $MUI('Chargement de votre fichier (format : csv, xls ou vcard)')));
		panel.appendChild(forms.File);
		
		
		panel.appendChild(new Node('h4', {className:'show-import-elements'}, $MUI('Configuration des types de données')));
		panel.appendChild(new Node('p', {className:'show-import-elements note'}, $MUI('Pour chaque colonne choisissez le type de données dont il s\'agit. Le tableau ne liste que les premier éléments du fichier.')));
				
		panel.appendChild(new Node('div', {className:'the-table'}));
		
		panel.appendChild(new Node('h4', {className:'show-import-elements'}, $MUI('Choisissez les options d\'importation')));
		//
		//
		//
		forms.ExcludeFirstLine = new ToggleButton();
		forms.ExcludeFirstLine.Value(false);
		//
		//
		//
		forms.EraseIfExists = new ToggleButton();
		forms.EraseIfExists.Value(false);
		
		forms.EraseIfExists.on('change',function(){
			if(this.Value()){
				forms.CreateIfExists.Value(false);	
			}
		});
		//
		//
		//
		forms.CreateIfExists = new ToggleButton();
		forms.CreateIfExists.Value(true);
		forms.CreateIfExists.on('change', function(){
			if(this.Value()){
				forms.EraseIfExists.Value(false);	
			}
		});
	
		var table = new TableData();
		table.addClassName('show-import-elements liquid');
		
		//table.addHead($MUI('Exclure la première ligne') + ' ?').addCel(forms.ExcludeFirstLine).addRow();
		table.addHead($MUI('Ecraser la fiche si elle existe déjà') + ' ?').addCel(forms.EraseIfExists).addRow();
		table.addHead($MUI('Ajouter la fiche si elle existe déjà (doublon)') + ' ?').addCel(forms.CreateIfExists).addRow();
		
		panel.appendChild(table);
		
		panel.select('.show-import-elements').invoke('hide');
		
		forms.submit = 	new SimpleButton({text:$MUI('Importer mes clients')});
		forms.submit.on('click', function(){
			System.CRM.Import.submit(win, forms);
		});
		
		win.Panel.PanelSwip.Footer().appendChild(forms.submit);
	
		//forms.submit.hide();
		
		win.submitClients = forms.submit;
		
		return panel;
	},
/**
 *
 **/	
	submit:function(win, forms){
		
		var flag = 	win.createFlag();
		var box = 	win.createBox();
		
		
		if(forms.File.Value() == ''){
			flag.setText($MUI('Veuillez choisir un fichier à importer')).color('red').show(forms.File, true);
			return;
		}
		
		var options = forms.save();
		
		box.wait();
		
		System.exec('crm.client.import', {
			parameters:'options=' + Object.EncodeJSON(options),
			onComplete:function(result){
				box.hide();
				
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					$S.trace(result.responseText);
					return;	
				}
				
				var splite = new SpliteIcon($MUI('Importation terminée'));
				splite.setIcon('valid-48');
				
				var table = new TableData();
				table.addHead($MUI('Nombre de fiche importée') + ' : ').addCel(obj.created, {style:'font-weight:bold'}).addRow();
				table.addHead($MUI('Nombre de fiche fusionnée') + ' : ').addCel(obj.merged.length, {style:'font-weight:bold'}).addRow();
				table.addHead($MUI('Nombre de fiche non importée') + ' : ').addCel(obj.noneAdd.length, {style:'font-weight:bold'}).addRow();
				
				box.setTheme('flat white liquid');
				box.a(splite).a(table).setType('CLOSE').show();
				
				box.reset(function(){
					box.setTheme();
				});
				System.CRM.Client.listing(win);
				
				
				
			}
		});
	},
/**
 *
 **/	
	createTable:function(){
		
		var table = new SimpleTable({
			range1:		10000,
			range2:		10000,
			range3:		10000,
			sort:		false,
			readOnly:	true,
			overable:	false,
			overflow:	true,
			scrollbar:	true
		});
		
		table.setTheme('excel');
		table.css('height', '400px');
		
		return table;
	}
};