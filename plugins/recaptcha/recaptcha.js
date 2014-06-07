/** section: Plugins
 * class System.reCaptcha
 *
 * Cet espace de nom gère l'extension reCaptcha.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : recaptcha.js
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
System.reCaptcha = {
/**
 * System.reCaptcha.initialize() -> void
 **/
	initialize: function(){
		$S.observe('blogpress:open', function(){
			if($U().getRight() <= 2){
				win.TabControl.addPanel($MUI('reCaptcha'), System.reCaptcha.createPanel(win)).setIcon('recaptcha');
			}	
		});
		
		$S.observe('system:open.settings', function(win){
			win.TabControl.addPanel($MUI('reCaptcha'), System.reCaptcha.createPanel(win)).setIcon('recaptcha');
		});
	},
/**
 * System.reCaptcha.createPanel() -> Panel
 **/
	createPanel:function(win){
		var panel = 		new Panel({style:'width:500px;min-height:500px;', background: ''});
		panel.addClassName('recaptcha-panel');
		//
		//Splite
		//
		var splite =	new SpliteIcon($MUI('Is a free anti-bot service that helps digitize books'));
		
		var form = 		{};
		
		form.reCaptcha_PUBLIC_KEY = 	new Input({type:'text', value: $S.Meta('reCaptcha_PUBLIC_KEY')});
		form.reCaptcha_PRIVATE_KEY = 	new Input({type:'text', value: $S.Meta('reCaptcha_PRIVATE_KEY')});
		form.reCaptcha_AUTO = 			new ToggleButton();
		form.reCaptcha_AUTO.Value($S.Meta('reCaptcha_AUTO') == 1);
		
		form.reCaptcha_THEME =			new Select();
		form.reCaptcha_THEME.setData([
			{text:'Red', value:'red'},
			{text:'White', value:'white'},
			{text:'Black Glass', value:'blackglass'},
			{text:'Clean', value:'clean'},
			{text:'Custom', value:'custom'}
		]);
		
		form.reCaptcha_THEME.Value($S.Meta('reCaptcha_THEME') || 'red');
		
		form.reCaptcha_CUSTOM_THEME = 	new Input({type:'text', value:$S.Meta('reCaptcha_CUSTOM_THEME'), className:'icon-cell-edit'});
		
		var table = new TableData();
		table.addHead($MUI('Public Key')).addField(form.reCaptcha_PUBLIC_KEY).addRow();
		table.addHead($MUI('Private Key')).addField(form.reCaptcha_PRIVATE_KEY).addRow();
		table.addHead($MUI('Template')).addField(form.reCaptcha_THEME).addRow();
		table.addHead($MUI('CSS template')).addField(form.reCaptcha_CUSTOM_THEME).addRow();
		table.addHead('', {height:9}).addRow();
		table.addHead($MUI('Auto include')).addCel(form.reCaptcha_AUTO);
				
		panel.appendChild(splite);
		panel.appendChild(table);
		
		var html = new HtmlNode();
		var action = "https://www.google.com/recaptcha";
		
		html.append('<h3>' + $MUI('Get API Key') + '</h3>');
		html.append('<p>' + $MUI('Get your own Public Key and Private Key at') + ' <a href="' + action + '">' + $MUI('http://www.google.com/recaptcha') + ".</a></p>");
		
		html.append('<h3>' + $MUI('Include the captcha manually') + '</h3>');
		html.append('<p>' + $MUI('Paste this code for include the Captcha in your form') + ' :</p>');
		html.append('<pre>&lt;form&gt;\n&lt;?php echo new reCaptcha(); ?&gt;\n&lt;/form&gt;</pre>');
		
		panel.appendChild(html);
		
		var submit = new SimpleButton({text:$MUI('Save')});
		panel.appendChild(submit);
		
		
		form.reCaptcha_AUTO.on('mouseover', function(){
			win.Flag.setText('<p class="icon-documentinfo">' + $MUI('Set Yes if you want a BlogPress including the Captcha automaticaly in the form') + '</p>');
			win.Flag.color('grey').show(this, true);
		});
		
		form.reCaptcha_THEME.on('change', function(){
			if(this.Value() == 'custom'){
				form.reCaptcha_CUSTOM_THEME.parentNode.parentNode.show();	
			}else{
				form.reCaptcha_CUSTOM_THEME.parentNode.parentNode.hide();
			}
		});
		
		if(form.reCaptcha_THEME.Value() == 'custom'){
			form.reCaptcha_CUSTOM_THEME.parentNode.parentNode.show();	
		}else{
			form.reCaptcha_CUSTOM_THEME.parentNode.parentNode.hide();
		}
		
		
		submit.on('click', function(){
			$S.Meta('reCaptcha_PUBLIC_KEY', form.reCaptcha_PUBLIC_KEY.Value());
			$S.Meta('reCaptcha_PRIVATE_KEY', form.reCaptcha_PRIVATE_KEY.Value());
			$S.Meta('reCaptcha_THEME', form.reCaptcha_THEME.Value());
			$S.Meta('reCaptcha_CUSTOM_THEME', form.reCaptcha_CUSTOM_THEME.Value());
					
			win.ActiveProgress();
			
			$S.Meta('reCaptcha_AUTO', form.reCaptcha_AUTO.Value() ? 1 : 0);
		});
		
		return panel;
	}
};

MUI.addWords({
	'Save':			'Enregistrer',
	'Public Key': 	'Clef publique',
	'Private Key': 	'Clef privée',
	'Template': 	'Thème',
	'Get API Key':	'Obtenir l\'API Key',
	'Get your own Public Key and Private Key at' : 'Récuperez votre clef publique et votre clef privée sur',
	'Include the captcha manually': 'Inclure le captcha manuellement',
	'Paste this code for include the Captcha in your form':'Collez le code suivant pour inclure le Captcha dans votre formulaire'
}, 'fr');

System.reCaptcha.initialize();