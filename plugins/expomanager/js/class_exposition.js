/** section: System.Exposition
 * class System.Exposition
 * Cette classe gère les interfaces des expositions.
 **/
System.Exposition = Class.createAjax({
	/**
 * Exposition.Exposition_ID -> Number
 **/
	Exposition_ID:			0,
/**
 * Exposition.DateDep -> Number
 **/
	DateDep:				null,
/**
 * Exposition.DateRet -> Number
 **/
	DateRet:				null,
/**
 * Exposition.Adresse -> String
 **/
	Adresse:			null,
/**
 * Exposition.Adresse2 -> String
 **/
	Adresse2:			null,
/**
 * Exposition.Ville -> String
 **/
	Ville:				'',
/**
 * Exposition.CP -> String
 **/
	CP:					'',
/**
 * Post.Post_ID -> Number
 * Numéro d'identification du post.
 **/
	Post_ID: 			0,
/**
 * Post.Parent_ID -> Number
 * Numéro d'identification du post parent.
 **/
	Parent_ID:			0,
	Revision_ID:		0,
/**
 * Post.User_ID -> Number
 * Numéro d'identification de l'auteur du post.
 **/
	User_ID:			0,
/**
 * Post.Category -> String
 * Categorie du poste.
 **/
	Category:			'exposition;',
/**
 * Post.Title -> String
 * Titre du post.
 **/
	Title:				'',
/**
 * Post.Title -> String
 * Titre du post pour le référencement.
 **/
	Title_Header:		'',
/**
 * Post.Content -> String
 * Contenu du post.
 **/
	Content:			'',
/**
 * Post.Summary -> String
 * Résumé du post.
 **/
	Summary:			'',
/**
 * Post.Keyword -> String
 * Contenu du post.
 **/
	Keyword:			'',
/**
 * Post.Date_Create -> DateTime
 * Date de création du post.
 **/
	Date_Create: 		'',
/**
 * Post.Date_Update -> DateTime
 * Date de modification du post.
 **/
	Date_Update:		'',
/**
 * Post.Name -> String
 * Nom didentification du post pour les liens méta (Utilisation des méthodes URL REWRITING)
 **/
	Name:				'',
/**
 * Post.Picture -> String
 **/
	Picture:			'',
/**
 * Post.Type -> String
 * Type du post. Page ou Post.
 **/
	Type:				'post post-expo',
/**
 * Post.Statut -> String
 * Etat de l'article.
 **/
	Statut:				'publish',
/**
 * Post.Comment_Statut -> String
 **/
	Comment_Statut: 	'open',
/**
 * Post.Template -> String
 **/
 	Template:			'',
/**
 * Post.Menu_Order -> Number
 **/
 	Menu_Order:			0,
/**
 * Post.Meta -> String
 **/
 	Meta:				'',
/**
 * new Exposition([obj])
 *
 * Cette méthode créée une nouvelle instance d'une tâche.
 **/
	initialize: function(obj){
		
		this.User_ID = $U().User_ID;
		
		if(!Object.isUndefined(obj)){
			this.setObject(obj);
		}
		if(this.DateDep == null){
			this.DateDep = new Date();	
		}
		if(this.DateRet == null){
			this.DateRet = new Date();	
		}
		
	},
/**
 * System.Exposition#commit(callback) -> void
 **/
	commit: function(callback){

		$S.exec('exposition.commit', {
			
			parameters: "Exposition=" + escape(Object.toJSON(this)),
			onComplete: function(result){
				this.evalJSON(result.responseText);
				
				if(Object.isFunction(callback)) callback.call(this, this);
			}.bind(this)
			
		});	
		
	},
/**
 * System.Exposition#remove(callback) -> void
 **/
	remove: function(callback){
		$S.exec('exposition.delete',{
			parameters: 'Exposition=' + escape(Object.toJSON(this)),
			onComplete: function(result){
				
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){return;}
				
				if(Object.isFunction(callback)) callback.call('');
			}.bind(this)
		});
	}
});
Object.extend(System.Exposition, {
	VERSION:	0.1,
/**
 * new System.Exposition() -> void
 *
 * Cette méthode créée une nouvelle instance du gestionnaire des tâches.
 **/
	initialize: function(){
		/*
		this.ExpensesManager = new ExpensesManager();
		
		$S.observe('expo:submit.complete', function(task){
			this.onChangeDate();

			if(!Object.isUndefined(this.winList)){
				this.winList.load();	
			}
			$NM().load();
		}.bind(this));
			
		$S.observe('expo:remove.complete', function(task){
			this.onChangeDate();
			
			if(!Object.isUndefined(this.winList)){
				this.winList.load();
			}
			$NM().load();
		}.bind(this));
		
		$S.observe('system:startinterface', this.startInterface.bind(this));
		
		$S.observe('system:external.open', function(win, obj){
			var title = win.Title();
			if(title.slice(0,3) == 'mc_'){
				win.setIcon('file-edit');
				win.Title($MUI('TinyMCE'));
				win.resizeTo(obj.width, obj.height);
				win.moveTo(0, obj.top);
				win.Cacheable(false);
				win.Resizable(false);	
			}
		});
		
		$S.observe('expense:submit.complete', function(){
			if(Object.isFunction(this.win.loadNote)) this.win.loadNote();
		}.bind(this));
		
		//$S.observe('notify:draw', this.listNotify.bind(this));*/
	},
/**
 * ExpositionsManager.startInterface() -> void
 *
 * Cette méthode liste les procédures à effectuer lors du lancement de l'interface d'administration.
 **/
	startInterface:function(){
		$S.DropMenu.addMenu($MUI('Expositions'), {icon:'cal'}).on('click', function(){this.listNotFinish()}.bind(this));
		$S.DropMenu.addLine($MUI('Expositions'), $MUI('Ajouter'), {icon:'add', border:true, bold:true}).on('click', function(){this.open()}.bind(this));	
		$S.DropMenu.addLine($MUI('Expositions'), $MUI('Listing des prochaines expositions'), {icon:'1right'}).on('click', function(){this.listNotFinish()}.bind(this));
		$S.DropMenu.addLine($MUI('Expositions'), $MUI('Listing des expositons terminées'), {icon:'valid', border:true}).on('click', function(){this.listFinish()}.bind(this));
		$S.DropMenu.addLine($MUI('Expositions'), $MUI('Listing complet'), {icon:'list'}).on('click', function(){this.listing()}.bind(this));
		
		///
		var panel = this.Panel = new System.jPanel({
			title:			'',
			placeholder:	$MUI('Rechercher'),
			parameters:		'cmd=exposition.list',
			icon:			'date-32'
		});
		
		panel.addClassName('agenda');	
		//
		//
		//
		panel.Bubble = new Bubble();
		panel.appendChild(panel.Bubble);
		//
		//
		//
		panel.Schedule = new Schedule({
			collision:	true,
			parameters:	'cmd=exposition.list'
		});
		
		panel.Schedule.createProgressBar();
		
		panel.Header().appendChild(panel.Schedule.NavBar());
		panel.Schedule.NavBar().css('float', 'left');
		panel.Schedule.css('border', '0px').css('position', 'absolute').css('width', 'auto').css('top', '0').css('bottom', 0).css('left', 0).css('right', 0);
		
		panel.PanelBody.replaceBy(panel.Schedule);
		panel.PanelBody = panel.Schedule;
				
		panel.addClassName('jgalery');
		
		panel.BtnAdd = panel.DropMenu.addMenu($MUI('Créer un événement'));
		panel.BtnAdd.parentNode.addClassName('create');
		
		panel.BtnAdd.on('click', function(){
			//System.jGalery.openSetting(win);
		}.bind(this));
		
		panel.Calendar = new Calendar();
		panel.Calendar.on('change', function(){
			panel.Schedule.setDate(this.getDate());
		});
		
	///	panel.Calendar.observe('draw', this.onDraw.bind(this));
		panel.Calendar.observe('next', this.onChangeDate.bind(this));
		panel.Calendar.observe('prev', this.onChangeDate.bind(this));
		panel.Calendar.observe('nexttwo', this.onChangeDate.bind(this)); 
		panel.Calendar.observe('prevtwo', this.onChangeDate.bind(this));
		
		panel.DropMenu.appendChild(panel.Calendar);
		
		System.addPanel($MUI('Exposition'), panel);
		
		panel.Schedule.load();
		
		panel.Schedule.on('complete', this.onChangeDate.bind(this));
		panel.Schedule.on('change', function(){
			panel.Calendar.setDate(panel.Schedule.getDate());
			this.onChangeDate();
		}.bind(this));
		
		panel.Schedule.on('draw', function(event){
			panel.Bubble.hide();
			
			if(!event.data.DateDep){
				return;
			}
			
			var html = 	new HtmlNode();
			var table = new TableData();
			table.addHead($MUI('Début le') + ' : ', {width:80}).addField(event.data.DateDep.toDate().format('l d M Y à h\\hi'), {width:250}).addRow();
			table.addHead($MUI('Fin le') + ' : ').addField(event.data.DateRet.toDate().format('l d M Y à h\\hi')).addRow();
			table.addHead(' ', {height:8}).addRow();
			table.addHead($MUI('Adresse') + ' : ').addField(event.data.Adresse).addRow();
			table.addHead($MUI('Ville') + ' : ').addField(event.data.Ville).addRow();
			table.addHead($MUI('Code postal') + ' : ').addField(event.data.CP).addRow();
			
			html.appendChilds([
				new Node('h2', {style:'margin-top:0;'}, event.Title), 
				table
			]);
			
			panel.Bubble.add(event, {
				duration:	0,
				text:		html
			});
		});
		
		panel.Schedule.on('create', function(evt, event){
			//panel.Flag =		panel.Flag || new Flag();
			
			var buttonAdd = 	new SimpleButton({type:'submit', text:$MUI('Créer un événement')});
			buttonAdd.css('margin-right', '10px');
			
			//var buttonUpdate = 	new SimpleButton({text:$MUI('Modifier l\'événement')});
			var buttonClose =	new SimpleButton({text:'x', noFill:true, nofill:true});
			buttonClose.setStyle('position:absolute;top:5px; right:5px; font-weight:bold; color:#333');
			
			buttonClose.on('click', function(){
				panel.Bubble.hide();
				event.destroy();
			});
			
			var input =			new Input({type:'text'});
			input.Large(true);
			input.css('width', '99%');
			
			var html = 	new HtmlNode();
			var table = new TableData();
			table.css('margin-bottom', '15px');
			table.addHead($MUI('Début le') + ' : ', {width:80}).addCel(event.start.format('l d M Y à h\\hi'), {width:250}).addRow();
			table.addHead($MUI('Fin le') + ' : ').addCel(event.end.format('l d M Y à h\\hi')).addRow();
			table.addHead(' ', {height:8}).addRow();
			table.addHead($MUI('Objet') + ' : ').addCel(input).addRow();
			
			html.appendChilds([
				new Node('h2', {style:'margin-top:0;margin-bottom:20px'}, $MUI('Création d\'un événement')), 
				table,
				buttonAdd,
				//buttonUpdate,
				buttonClose
			]);
			
			panel.Bubble.show(evt, html).moveTo(panel.Bubble.css('left') - input.positionedOffset().left - 30, panel.Bubble.css('top') - input.positionedOffset().top - input.css('height')-10);
			input.focus();
			
			buttonAdd.on('click', function(){
				if(input.Value() == ''){
					panel.Schedule.Flag.setText($MUI('Veuillez choisir un titre pour votre événement !')).setType(FLAG.TOP).show(input, true);
					return;
				}
				
				System.Exposition.open({
					DateDep:event.start,
					DateRet:event.end,
					Title:	input.Value()
				});
				
				panel.Bubble.hide();
				event.destroy();
			});
		});
		
		panel.Bubble.on('mouseup', function(evt){
			evt.stop();
		});
		
		document.on('mouseup', function(){
			panel.Bubble.hide();
		});
		//
		// Widget
		//
		var widget = 	this.widget =	new WidgetTable({
			range1:		100, 
			range2:		100, 
			range3:		100,
			search:		false,
			link:		$S.link,
			readOnly:	true,	
			progress:	false,					
			empty:		' - ' + $MUI('Aucune exposition pour ce mois-ci') + ' - ',
			parameters: 'cmd=exposition.list&options=' + escape(Object.toJSON({
							op:		'-next'
						}))
		});
		
		widget.css('background', 'transparent');
		widget.BorderRadius(false);
		widget.Header().hide();
		widget.Body().css('max-height', '400px').css('background', 'rgba(255,255, 255, 0.7)');
		widget.Table.Header().hide();
		
		widget.addHeader({
			Title:			{title:'Titre'},
			Action:			{title:'', width:50, style:'text-align:center', type:'action'}
		});
		
		widget.addFilters('Title', function(e, cel, data){
			//cel.parentNode.css('background','transparent');
			var html = new HtmlNode();
			html.css('padding', 0);
			html.append('<h1 style="font-size:15px;margin:0">' + e + '<p style="font-size:10px">' + data.DateDep.toDate().format('l d F Y à h\\hi') + ' </p></h1>');
			
			var html2 = 	new HtmlNode();
			var table = new TableData();
			table.addHead($MUI('Début le') + ' : ', {width:80}).addField(data.DateDep.toDate().format('l d M Y à h\\hi'), {width:250}).addRow();
			table.addHead($MUI('Fin le') + ' : ').addField(data.DateRet.toDate().format('l d M Y à h\\hi')).addRow();
			table.addHead(' ', {height:8}).addRow();
			table.addHead($MUI('Adresse') + ' : ').addField(data.Adresse).addRow();
			table.addHead($MUI('Ville') + ' : ').addField(data.Ville).addRow();
			table.addHead($MUI('Code postal') + ' : ').addField(data.CP).addRow();
			
			html2.appendChilds([
				new Node('h2', {style:'margin-top:0;'}, data.Title), 
				table
			]);
			
			panel.Bubble.add(cel, {
				duration:	0,
				text:		html2
			});
			
			return html;
		});
		
		widget.load();		
		
		widget.observe('click', function(evt, data){
			System.Exposition.open(data);
		});
		
		panel.DropMenu.appendChild(new SimpleSection($MUI('Exposition à venir')));
		panel.DropMenu.appendChild(widget);
	},
/**
 * EvenementsManager.onChangeData() -> void
 *
 * Cette méthode est appelée lorsque l'utilisateur change la date du calendrier.
 **/
	onChangeDate: function(){
		
		$S.exec('exposition.count', {
			parameters:'options='+ Object.EncodeJSON({
				date:	this.Panel.Calendar.getDate().format('Y-m'),
				length:	this.Panel.Calendar.getDate().daysInMonth()
			}),
			
			onComplete:function(result){
				
				try{
					var array = $A(result.responseText.evalJSON());
				}catch(er){
					return $S.trace(result.responseText);
				}
				
				try{
												
				for(var i = 0; i < array.length; i++){
					
					var options = this.Panel.Calendar.select('.date-' + array[i].date.replace(/-/gi, ''));
					
					options.each(function(e){
						e.addTag(array[i].length);
					});
				}
				}catch(er){alert(er)}
			}.bind(this)
		});
	},
/**
 * System.Exposition.open(task) -> void
 *
 * Ouvre un nouveau formulaire des tâches.
 **/
	open: function(post){
		try{
			
			var win = $WR.unique('exposition', {
				autoclose:	true,
				action: function(){
					this.open(post);
				}.bind(this)
			});
			//on regarde si l'instance a été créée
			if(!win) return;
			
			win.overideClose({
				submit:this.submit.bind(this), 
				change:this.checkChange.bind(this),
				close: function(){this.win = null}.bind(this)
			});
			
			win.post = 			new System.Exposition(post);
			//
			//forms
			//
			var forms =		{};
			//
			// Window
			//
			win.Resizable(false);
			win.createFlag().setType(FLAG.TYPE);
			win.createBox();
			win.ChromeSetting(true);
			win.setTitle($MUI('Gestion d\'une exposition')).setIcon('cal');	
			win.createHandler($MUI('Chargement en cours'), true);
			
			win.forms = 	forms;
			this.win = 		win;
			
			$Body.appendChild(win);
			//
			// DropMenu
			//
			//win.DropMenu.setType(DROP.RUBBON);
						
			forms.submit = 		new SimpleButton({text:$MUI('Enregistrer'), icon:'filesave'}).on('click', function(){this.submit(win)}.bind(this));
			forms.print = 		new SimpleMenu({text:'', icon:'print'});
			forms.addNote = 	new SimpleMenu({text:'', icon:'add'});
			forms.close = 		new SimpleButton({text:$MUI('Fermer'), icon:'exit'}).on('click', function(){win.close();}.bind(this));
			
			//
			//TabControl
			//
			forms.TabControl = win.createTabControl();
						
			forms.TabControl.addPanel($MUI('Evèvenement'), this.createPanel(win)).on('click', function(){win.centralize()});
			forms.TabControl.addPanel($MUI('Article'), System.BlogPress.posts.createPanelGeneral(win)).setIcon('newsticker').on('click', function(){win.centralize()});
			forms.TabControl.addPanel($MUI('Paramètres'), System.BlogPress.posts.createPanelParameters(win)).setIcon('advanced').on('click', function(){win.centralize()});
			
			forms.Note = forms.TabControl.addPanel($MUI('Note de frais'), this.createPanelNote(win)).setIcon('knotes').on('click', function(){win.centralize()});
			//forms.TabControl.addSimpleMenu(forms.print);
			//forms.TabControl.addSimpleMenu(forms.addNote);
						
			forms.Title2.on('keyup', function(){
				if(post.Name == ''){
					forms.Name.value = this.value.sanitize('-').toLowerCase();
				}
			});
			
			forms.Title.on('change', function(){
				forms.Title2.Value(this.Value());
			});
			
			win.Footer().appendChilds([
				win.forms.submit,
				win.forms.close
			]);
			
			$S.fire('expo:open', win);
			
			forms.Content.load();
			win.centralize();
						
			//Ajout de l'aide et incident
			
			forms.print.on('click', function(){
				$S.exec('exposition.print', {
					parameters: 'Exposition_ID=' + post.Exposition_ID,
					onComplete: function(result){
						var win = $S.openPDF(result.responseText);
						win.setTitle($MUI('Fiche d\'exposition'));							
					}
				});
			});
			
			forms.print.on('mouseover', function(){
				win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Imprimer la fiche')  + '</p>').setType(FLAG.BOTTOM).color('grey').show(this, true);
			});
			
			forms.addNote.on('click', function(){
				this.ExpensesManager.open({Exposition_ID:win.post.Exposition_ID}, win);
			}.bind(this));
			
			forms.addNote.on('mouseover', function(){
				win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Ajouter une note de frais')  + '</p>').setType(FLAG.BOTTOM).color('grey').show(this, true);
			});
			
		}catch(er){$S.trace(er)}
	},
/**
 * createPanel(win) -> Panel
 *
 **/	
	createPanel: function(win){
		
		//
		// Panel
		//
		var panel = 	new Panel({background:"date", style:'width:500px'});
		var splite = 	new SpliteIcon($MUI('Informations générales de l\'exposition'), $MUI('Modifier les champs suivants pour personnaliser l\'exposition') + ' :');
		splite.setIcon('cal-48');
		//
		// Titre
		//
		win.forms.Title2 =			new Input({type:'text', value:win.post.Title});
		win.forms.Title2.on('change', function(){
			win.forms.Title.Value(this.Value());
		});
		//
		// DateCrea
		//
		win.forms.DateDep =			new InputCalendar({type:'select'});
		win.forms.DateDep.activeHours(15);
		win.forms.DateDep.setDate(win.post.DateDep.clone());
		//
		// DateReal
		//
		win.forms.DateRet =			new InputCalendar({type:'select'});
		win.forms.DateRet.activeHours(15);
		win.forms.DateRet.addInputCalendar(win.forms.DateDep);
		win.forms.DateRet.setDate(win.post.DateRet.clone());
		//
		// Adresse
		//
		win.forms.Adresse =			new Input({type:'text', value:win.post.Adresse});
		//
		// Adresse2
		//
		win.forms.Adresse2 =		new Input({type:'text', value:win.post.Adresse2});
		//
		// CodePostal
		// 
		win.forms.CP = 				new InputCP();
		win.forms.CP.Text(win.post.CP);
		//
		// Ville
		// 
		win.forms.Ville = 			new InputCity();
		win.forms.Ville.setInputCP(win.forms.CP);
		win.forms.Ville.Text(win.post.Ville);
		//
		// MontantHT
		//
		win.forms.MontantHT = 	new Node('p', {style:'text-align:right;width:80px; border:1px solid #CCC; padding:5px;'}, '0.00 €');
		win.forms.MontantTTC = 	new Node('p', {style:'text-align:right;width:80px; border:1px solid #CCC; padding:5px;'}, '0.00 €');
		
		var table = new TableData();
				
		table.addHead($MUI('Titre') + ' : ', {width:130}).addField(win.forms.Title2).addRow();
		table.addHead($MUI('Date de début') + ' : ').addField(win.forms.DateDep).addRow();
		table.addHead($MUI('Date de fin') + ' : ').addField(win.forms.DateRet).addRow();
		table.addHead($MUI('Adresse') + ' : ', {width:130}).addField(win.forms.Adresse).addRow();
		table.addHead(' ').addField(win.forms.Adresse2).addRow();	
		table.addHead($MUI('Code Postal') + ' : ').addField(win.forms.CP).addRow();
		table.addHead($MUI('Ville') + ' : ').addField(win.forms.Ville).addRow();
		
		
		table.addHead(new Node('h3', $MUI('Note de frais')), {colSpan:2}).addRow();
		table.addHead($MUI('Total HT') + ' : ',{width:130}).addCel(win.forms.MontantHT).addRow();
		table.addHead($MUI('Total TTC') + ' : ').addCel(win.forms.MontantTTC);
		
		win.forms.Title2.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici <b>le titre</b> de votre exposition') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		win.forms.Adresse.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici <b>l\'adresse</b> de votre exposition') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		win.forms.Adresse2.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici <b>le complétement d\'adresse</b> de votre exposition') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		win.forms.CP.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici <b>le code postal</b> de votre exposition') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);			
		});
		
		win.forms.Ville.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici <b>la ville</b> de votre exposition') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
			
		win.forms.DateDep.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Choisissez une <b>date de début</b> pour votre exposition') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
		
		win.forms.DateRet.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Choisissez une <b>date de fin</b> pour votre exposition') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
		});
					
		panel.appendChild(splite);
		panel.appendChild(table);
		
		return panel;
	},
/**
 * Exposition.createPanelNote
 **/
 	createPanelNote:function(win){
		//#pragma region Instance
		//
		// Panel
		//
		var panel = 	new Panel({style:'height:500px;width:600px'});
		panel.Compact(true);
		//
		//SimpleTable
		//
		var widget = new WidgetTable({
			link: 		$S.link,
			parameters: 'op=expense.list&options=' + escape(Object.toJSON({op:'-e', value:win.post.Exposition_ID})),
			readOnly:	true
		});
		
		widget.Title($MUI('Listing des notes de frais'));
		widget.setIcon('knotes');
		
		widget.addHeader({
			Action: 	{title:' ', type:'action', width:40},
			Frais_ID:	{title:'N°', width:40, style:'text-align:right'},
			Description:{title:'Description'},
			Date:		{title:'Date', width:'150'},
			Montant_HT:	{title:'Montant HT', width:'100', style:'text-align:center'},
			Montant_TTC:{title:'Montant TTC', width:'100', style:'text-align:center'}
		});
				
		//#pragma endregion Instance
		
		widget.on('open', function(evt, data){
			this.ExpensesManager.open(data, win);
		}.bind(this));
		
		widget.on('remove', function(evt, data){
			this.ExpensesManager.remove(win, new Expense(data));
		}.bind(this));
				
		widget.addFilters('Date', function(e){
			try{
				return e.toDate().format('d M Y');
			}catch(er){
				return e;	
			}
		});
		
		win.post.Montant_T_HT = 0;
		win.post.Montant_T_TTC = 0;
		
		widget.addFilters('Montant_HT', function(e, cel){
			cel.setStyle('text-align:right;');
			win.post.Montant_T_HT += (1 * e);
			
			win.forms.MontantHT.innerHTML = 	win.post.Montant_T_HT.format(2, ",", " ") + ' €';
		
			return 	'<p>' + (1 * e).format(2, ",", " ") + ' €' + '</p>';
		}.bind(this));
		
		widget.addFilters('Montant_TTC', function(e, cel){
			cel.setStyle('text-align:right;');
			win.post.Montant_T_TTC += (1 * e);
			
			win.forms.MontantTTC.innerHTML = win.post.Montant_T_TTC.format(2, ",", " ") + ' €';
			
			return '<p>' + 	(1 * e).format(2, ",", " ") + ' €' + '</p>';
		}.bind(this));
				
		win.getClausesNote = function(){
			return widget.clauses;
		};
		
		win.loadNote = function(){
			win.ActiveProgress();
			widget.load();
		};
		
		widget.on('complete', function(obj){
			win.forms.Note.setText($MUI('Notes de frais') + ' (' + obj.length  +')');
		});
				
		panel.appendChild(widget);
		
		if(win.post.Exposition_ID != 0) {
			win.ActiveProgress();
			widget.load();	
		}
		
		return panel;
	},
/**
 * System.Exposition.checkChange(win) -> Boolean
 * - win (Window): Instance du formulaire.
 * 
 * Cette méthode vérifie l'état du formulaire et retourne vrai si le formulaire a été modifié, faux dans le cas de contraire.
 **/	
	checkChange:function(win){
		var last = 		win.post.clone();
		var current =	win.post.clone();
		
		current.Title = 			win.forms.Title.Value();
		current.DateDep = 			win.forms.DateDep.getDate();
		current.DateRet = 			win.forms.DateRet.getDate();
		current.Adresse = 			win.forms.Adresse.Value();
		current.Adresse2 = 			win.forms.Adresse2.Value();
		current.Ville = 			win.forms.Ville.Text();
		current.CP = 				win.forms.CP.Text();
		current.Title_Header = 		win.forms.Title_Header.Value();
		current.Summary = 			win.forms.Summary.Value();
		current.Name =  			win.forms.Name.Value();
		current.Picture =  			win.forms.Picture.Value();
		current.Content = 			win.forms.Content.Value();
		current.Menu_Order = 		win.forms.Menu_Order.Value();
		current.Keyword =			win.forms.Keyword;
		current.Statut =			win.forms.Statut + (win.forms.Private.Value() ? '' : ' private');
		current.Category = 			'';
		
		current.Comment_Statut = '';
		//gestion des statuts des commentaires
		current.Comment_Statut += win.forms.CommentOpen.Value() ? 'open' : 'close';
		current.Comment_Statut += win.forms.CommentTracking.Value() ? ' track' : '';
		current.Comment_Statut += win.forms.CommentNotable.Value() ? ' note' : '';
		
		var options = win.forms.Category.Table.getChecked();
		
		if(win.forms.Category.length == 0){
			current.Category = 'Non classé;'
		}
		
		options.each(function(data){
			current.Category +=  data.Name + ';'; 
		});

		return (function(o, n){
			
					for(var key in o){
						if(Object.isFunction(o[key])) continue;
						
						if(key == 'DateDep' || key == 'DateRet'){
							if(o[key].toString_('datetime') != n[key].toString_('datetime')){
								return true;
							}
							continue;
						}
						
						if(key == 'Name'){
							var name = o[key].split('/');
							if(name[name.length-1] != n[key]){
								return true;	
							}
							continue;	
						}
						
						if(key == 'oMeta') {
							continue;
						}
						
						if(key == 'Meta') {
							$S.trace(o['o' + key]);
							$S.trace(Object.toJSON(n[key]));
							
							if(o['o' + key] != Object.toJSON(n[key])){
								return true;
							}
							continue;
						}
						
						if(o[key] != n[key]){
							$S.trace(key + ' => ' + o[key] + ' <> ' + n[key]);
							return true;
						}					
					}
					return false;
					
				})(last, current);
	},
/**
 * System.Exposition.submit(win) -> void
 *
 * Valide et enregistre le formulaire de la fenêtre `win`.
 **/
	submit: function(win, noclose){
		
		noclose = Object.isUndefined(noclose) ? false : noclose;
		
		win.Flag.hide();
		win.AlertBox.hide();
		
		if(win.forms.Title.value == ''){
			win.Flag.setText($MUI('Veuillez saisir un titre pour cette exposition')).show(win.forms.Title);
			return;
		}
		
		var evt = new StopEvent(win);
		$S.fire('expo:open.submit', evt);
		
		if(evt.stopped) return true;
		
		var current = 			win.post.clone();
		
		current.Title = 			win.forms.Title.value;
		current.DateDep = 			win.forms.DateDep.getDate();
		current.DateRet = 			win.forms.DateRet.getDate();
		current.Adresse = 			win.forms.Adresse.value;
		current.Adresse2 = 			win.forms.Adresse2.value;
		current.Ville = 			win.forms.Ville.Text();
		current.CP = 				win.forms.CP.Text();
		current.Description = 		win.forms.Description.Value();
		
		win.post.Title_Header = 	win.forms.Title_Header.Value();
		win.post.Picture =  		win.forms.Picture.Value();
		win.post.Name =  			win.forms.Name.Value();
		win.post.Content = 			win.forms.Content.Value();
		win.post.Summary = 			win.forms.Summary.Value();
		win.post.Menu_Order = 		win.forms.Menu_Order.Value();
		win.post.Keyword =			win.forms.Keyword;
		win.post.Statut =			win.forms.Statut + (win.forms.Private.Value() ? '' : ' private');
		
		if(win.post.Type == ''){
			win.post.Type =			'post post-expo';
		}
		
		win.post.Category = 		'';
		
		var options = win.forms.Category.Table.getChecked();
		
		if(win.forms.Category.length == 0){
			win.post.Category = 'Non classé;'
		}
		
		options.each(function(data){
			win.post.Category +=  data.Name + ';'; 
		});
		
		win.post.Comment_Statut = '';
		//gestion des statuts des commentaires
		win.post.Comment_Statut += win.forms.CommentOpen.Value() ? 'open' : 'close';
		win.post.Comment_Statut += win.forms.CommentTracking.Value() ? ' track' : '';
		win.post.Comment_Statut += win.forms.CommentNotable.Value() ? ' note' : '';
		
		win.ActiveProgress();
		
		current.commit(function(responseText){
			
			$S.fire('expo:submit.complete', current);
						
			try{
				if(newObj){
									
					win.forceClose();
					
					this.open(current);
					
					var splite = new SpliteIcon($MUI('Voulez-vous fermer le formulaire') + ' ? ', $MUI('Exposition') +' : ' + current.Title);
					splite.setIcon('documentinfo-48');
					
					if(!noclose){
						this.win.AlertBox.ti($MUI('Fermer le formulaire') + '...').a(splite).ty().show();
						this.win.AlertBox.getBtnSubmit().setText($MUI('Fermer')).setIcon('exit');
						this.win.AlertBox.getBtnReset().setText($MUI('Continuer à modifier le formulaire')).setIcon('file-edit');
						
						this.win.AlertBox.submit(function(){
							this.win.forceClose();
						}.bind(this));
					}
					return;
					
				}
				
				//Confirmation d'enregistrement
				var splite = new SpliteIcon($MUI('Le formulaire a été correctement sauvegardé'), $MUI('Exposition') +' : ' + current.Title);
				splite.setIcon('filesave-ok-48');
					
				win.AlertBox.ti($MUI('Confirmation') + '...').a(splite).ty('NONE').Timer(3).show();
				win.man = current;
				
				if(!noclose){
					win.AlertBox.reset(function(){
						win.forceClose();
					});
				}
			}catch(er){}
		}.bind(this))
		
		return true;
		
	},
/**
 * System.Exposition.listNotify($N) -> void
 *
 * Cette méthode liste les événements pour les affichers dans le gestionnaire des notifications.
 **/	
	listNotify: function($N){
		$S.exec('exposition.list', {
			parameters:'options=' + escape(Object.toJSON({op:'-e'})),
			onComplete: function(result){
			
				try{
					var obj = result.responseText.evalJSON();
				}catch(er){
					return;	
				}
				
				if(obj.length > 0){
					
					var title = $MUI('Prochaine exposition') + ' : ' + obj[0].Title;
					
					var line = $N.addNotify({
						title: 	title,
						icon:	'cal',
						date:	obj[0].DateDep.toDate()
					});
					
					line.date.innerHTML = $MUI('Planifié le') + ' '+ obj[0].DateDep.toDate().format('l d F Y');
					line.on('click', function(){this.open(obj[0])}.bind(this));
						
				}
			}.bind(this)
		});
	},
/**
 * System.Exposition.listNotFinish() -> void
 **/
	
	listFinish: function(){
		this.searchByFinish();
	},
	
	searchByFinish: function(box){
		this.listing({op:'-f'});
		this.winList.on('complete',function(){
			this.setTitle($MUI('Listing des expositions terminé')).setIcon('valid');
		});
	},
		
	listNotFinish: function(){
		this.searchByNotFinish();
	},
	
	searchByNotFinish: function(box){
		this.listing({op:'-e'});
		this.winList.on('complete',function(){
			this.setTitle($MUI('Listing des expositions à venir')).setIcon('1right');
		});
		
	},
/**
 * TaskManager.onChangeFilter(node) -> void
 *
 * Action appellée lors du changement de filtre dans le listing.
 **/
	onChangeFilter: function(node){
		try{

			this.winList.clauses.query = 	'';
			this.winList.clauses.page = 	0;
			
			switch(node.value){
				default:
				case 0: 
					this.winList.setTitle($MUI('Listing complet des tâches')).setIcon('list');
					this.listing({});
					break;
				case 1:
					this.searchByNotFinish(this.winList.AlertBox);
					break;
				case 2:
					this.searchByFinish(this.winList.AlertBox);
					break;
			}
		
		}catch(er){$S.trace(er)}
	},		
/**
 * System.Exposition.listing([options]) -> void
 *
 * Ouvre la fenêtre du listing des tâches.
 **/
	listing: function(options){
		
		options = Object.isUndefined(options) ? '' : options;
		
		if(!(Object.isUndefined(this.winList) || this.winList == null)){
			try{this.winList.close();}catch(er){}
		}
			
		var sender = this;	
				
		this.winList = 	new WindowList({
			range1:		25, 
			range2:		50, 
			range3:		100,
			title:		$MUI('Listing complet des expositions'),
			link:		$S.link,
			select:		true,
			readOnly:	true,
			icon:		'list',
			empty:		'- ' + $MUI('Aucune exposition d\'enregistrée') + ' -'
		});
		
		$Body.appendChild(this.winList);
		
		this.winList.addHeader(new HeaderList({ 
			Act1:			{title:'', width:50, style:'text-align:center', type:'action'},
			Exposition_ID:	{title:'N°', width:40, style:'text-align:right'},
			Title:			{title:'Titre'},
			DateDep:		{title:'Début le', width:130},
			DateRet:		{title:'Fin le',  width:130},
			Adresse:		{title:'Adresse', width:230},
			Ville:			{title:'Ville', width:170},
			CP:				{title:'CP', width:60, style:'text-align:center'}
		}));
		
		this.winList.Select.setData([
			{text:$MUI('Aucun filtre'), value:0},
			{text:$MUI('En cours'), value:1, icon:'1right'},
			{text:$MUI('Terminé'), value:2, icon:'valid'}
		]);
		
		this.winList.Select.selectedIndex(0);
		
		//if(1 * $P.getUserKey('Droits_Inventaire') == 1) {
			this.winList.DropMenu.addMenu($MUI('Ajouter une exposition'), {icon:'add'}).observe('click', function(){this.open()}.bind(this));
		//}
		//filtre
		this.winList.DropMenu.addMenu($MUI('Imprimer'), {icon:'print'}).on('click', function(){
			$S.exec('exposition.list.print', {
				parameters: 'clauses=' + escape(Object.toJSON(this.winList.clauses)) + '&' + this.winList.parameters,
				onComplete: function(result){
					var win = $S.openPDF(result.responseText);
					win.setTitle($MUI('Listing des expositions'));							
				}
			});
		}.bind(this)).mouseover(function(){
			sender.winList.Flag.setText('<p class="icon-documentinfo">' + $MUI('Cliquez ici pour imprimer le listing') + '.<p>')
			sender.winList.Flag.setType(FLAG.BOTTOM).color('grey').show(this, true);
		});				
				
		this.winList.addFilters(['DateDep', 'DateRet'], function(e){
			return '<p>'+e.toDate().format('D. d M. Y')+'</p>';
		})
		//events--------------------------------------------------------------------
		this.winList.observe('close', function(){this.winList = null;}.bind(this));
		this.winList.Select.on('change', function(){
			sender.onChangeFilter(this);
		});
		
		this.winList.on('open', function(evt, data){
			this.open(data);	
		}.bind(this));

		this.winList.on('remove', function(evt, data){
			this.remove(data);	
		}.bind(this));
					
		this.winList.Fullscreen(true);
		this.winList.Hidden(false);
		this.winList.setParameters('cmd=exposition.list&options=' + escape(Object.toJSON(options))).load();
	},
/**
 * TaskManager.remove(task) -> void
 *
 * Supprime une tâche du listing.
 **/
	remove: function(post){
		
		post = new System.Exposition(post);
		//
		// Splite
		//
		var splite = 			new SpliteIcon($MUI('Voulez-vous vraiment supprimer l\'exposition N°') + ' ' + post.Exposition_ID + ' ? ', post.Title);
		splite.setIcon('edittrash-48');
		//
		// 
		//
		var box = this.winList.AlertBox;
		
		box.setTitle($MUI('Suppression de l\'exposition')).a(splite).setIcon('delete').setType().show();
		
		
		box.getBtnReset().setIcon('cancel');
		box.getBtnSubmit().setIcon('delete').setText('Supprimer l\'exposition');
				
		box.submit(function(){

			post.remove(function(){
				box.hide();
					
				$S.fire('expo:remove', expo);
				
				//
				// Splite
				//
				var splite = new SpliteIcon($MUI('L\'exposition a bien été supprimé') + '.', $MUI('Exposition N°') + ' ' + post.Exposition_ID);
				splite.getChildLeft().setStyle('background-position:center');
				splite.setIcon('valid-48');
				
				
				box.setTitle($MUI('Confirmation')).setContent(splite).setType('CLOSE').Timer(5).show();
				box.getBtnReset().setIcon('cancel');
				box.setIcon('documentinfo');
				
			}.bind(this));
			
		}.bind(this));
	}
});

Extends.ready(function(){
	System.Exposition.initialize();
});