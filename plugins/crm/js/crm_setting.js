/** section: CRM
 * class System.CRM.Setting
 **/
System.CRM.Setting = {
/**
 * System.CRM.Setting.initialize() -> void
 **/
	/*initialize: function(){
		$S.observe('system:open.settings', function(win){
			var button = new SimpleButton({text:'CRM', icon:'crm'});
			
			win.TabControl.Header().appendChild(button);
			button.on('click', function(){
				System.CRM.open('setting');
			});
		});		
	},**/
	
	initialize: function(){
		$S.observe('system:open.settings', function(win){			
			win.TabControl.addPanel($MUI('CRM'), System.CRM.Setting.createPanel(win)).setIcon('crm');
		});
	},
/**
 * System.CRM.Setting.open() -> Window
 **/		
	/*open:function(){
		
		var win = 		$WR.getByName('crm');
		var panel = 	win.Panel;
		var forms = 	win.createForm();
		
		System.CRM.setCurrent('setting');
		panel.Open(true, 650);
		
		panel.PanelSwip.addPanel($MUI('Paramètres'), this.createPanel(win));
		//panel.PanelSwip.addPanel($MUI('Impression'), this.createPanelPrint(win));
		
				
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		
		submit.on('click', function(){
			
			System.CRM.Setting.submit(win);
			
		});
		
		panel.PanelSwip.Footer().appendChild(submit);
		
		$S.fire('crm.setting:open', win);
		
	},*/
/**
 * System.CRM.Setting.createPanel(win) -> Panel
 **/	
	createPanel:function(win){
		var panel = new Panel({style:'width:500px; height:500px'});
		var forms = new Extends.Form();
		
		var splite = new SpliteIcon($MUI('Configuration du CRM'));
		splite.setIcon('crm-48');
		panel.appendChild(splite);
		//
		//
		//
		forms.CRM_GROUP_CALLER = new Select({
			multiple:		true,
			parameters:		'cmd=role.list'
		});
		
		forms.addFilters('CRM_GROUP_CALLER', function(){
			var a = [];
			var values = this.CRM_GROUP_CALLER.Value();
			
			for(var i = 0; i < values.length; i++){
				a.push(values[i].Role_ID);
			}
			
			return a;
		});
		
		forms.CRM_GROUP_CALLER.Value($S.Meta('CRM_GROUP_CALLER') || []);
				
		forms.CRM_GROUP_CALLER.load();
		
		//panel.appendChild(new Node('h4', $MUI('Paramètres')));
		
		var table = new TableData();
		
		table.addHead($MUI('Groupe appellant')).addCel(forms.CRM_GROUP_CALLER).addRow();
		
		panel.appendChild(table);
		
		var submit = new SimpleButton({text:$MUI('Enregistrer')});
		submit.on('click', function(){
					
			var obj = forms.save();
			var box = win.createBox();
			
			System.Meta('CRM_GROUP_CALLER', obj.CRM_GROUP_CALLER);
			
			var splite = new SpliteIcon($MUI('Les paramètres du CRM ont bien été modifié'));
			splite.setIcon('filesave-ok-48');
			
			box.setTheme('flat white liquid');
			box.setIcon('documentinfo').a(splite).ty('CLOSE').Timer(5).show();
			
		});
		
		panel.appendChild(submit);
				
		return panel;
	}
};

System.CRM.Setting.initialize();