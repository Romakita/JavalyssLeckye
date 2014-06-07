/** section: Plugins
 * System.MyStore.Command.User
 *
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : mystore_command_user.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.MyStore.Command.User = {
/**
 * System.MyStore.Command.User.initialize() - > void
 **/	
	initialize:function(){
		
		System.observe('system:startinterface', function(){
			if(System.plugins.haveAccess('MyStore')){
				
				System.observe('user:open', function(win){
					win.TabControl.addPanel($MUI('Commandes'), System.MyStore.Command.User.createPanel(win)).setIcon('mystore');
				});	
			}
		});
	},
/**
 * System.MyStore.Command.User.createPanel(win) - > Panel
 **/	
	createPanel:function(win){
		var panel = new Panel({style:'padding:0;width: 800px; min-height: 500px;'});
		
		var widget = new WidgetTable({
			range1:		30,
			range2:		50,
			range3:		100,
			parameters: 'cmd=mystore.command.list&options=' + Object.EncodeJSON({User_ID:win.getData().User_ID, Statut:['created manually', 'paid', 'confirmed', 'prepared', 'delivery']}),
			readOnly:	true,
			groupBy:	'Statut'
		});
		
		widget.css('height', '500px');
		
		widget.addHeader({
			Action:					{title:' ', type:'action', style:'text-align:center; width:30px;', sort:false},
			Command_NB: 			{title:$MUI('N°'), style:'width:60px; text-align:center', order:'desc'},
			Mode_Delivery:			{title:$MUI('Mode de livraison')},
			Date_Create:			{title:$MUI('Créée le'), style:'text-align:center;width:130px'},
			Date_Payment:			{title:$MUI('Payé le'), style:'text-align:center;width:130px'},
			Amount_TTC:				{title:$MUI('Montant TTC'), style:'text-align:center;width:130px'}	
		});
		
		widget.addFilters(['Date_Create', 'Date_Payment'], function(e, cel, data){
			if(e == '0000-00-00 00:00:00'){
				return '';	
			}
			
			return e.toDate().format('d/m/Y à h\\hi');
		});
		
		widget.Table.onWriteName = function(e, cel, data){
			switch(e){
				case 'created manually':
					return $MUI('En attente de paiement <small>(créée manuellement)</small>');
				case 'paid':
					return $MUI('Payée <small>(en attende de confirmation)</small>');
					
				case 'confirmed':
					return $MUI('Confirmée <small>(en attente de préparation)</small>');
				
				case 'prepared':
					return $MUI('Préparée <small>(en attente de distribution)</small>');
					
				case 'delivery':
					return $MUI('Livraison en cours');
				
				case 'finish':
					return $MUI('Terminée');
					
				case 'created':
					return $MUI('Créée');
			}
		};
		
		widget.addFilters('Action', function(e){
			e.remove.hide();
			return e;
		});
		
		widget.addFilters('Amount_TTC', function(e, cel){
			cel.css('text-align', 'right');
			return (e *1).toFixed(2) + ' ' + System.MyStore.Currency(); 
		});
		
		widget.on('remove', function(evt, data){
			System.MyStore.Command.remove(data, win.createBox());
		});
		
		widget.on('open', function(evt, data){
			System.MyStore.Command.open(data);
		});
			
		panel.appendChild(widget);
		
		widget.load();
		
		return panel;
	}
};

System.MyStore.Command.User.initialize();