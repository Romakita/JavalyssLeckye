/** section: MyWallet
 * System.MyWallet.Paypal 
 **/
System.MyWallet.Paypal = {
/**
 * System.MyWallet.Paypal.createForm() -> Node
 **/	
	createForm:function(win, forms){
		
		var card =		win.getData();
		var setting =	win.getData().Content == '' ? {
							User:			'',
							Password:		'',
							Signature: 		'',
							BRANDNAME:		'',
							HDRIMG:			'',
							PAYFLOWCOLOR: 	"FFFFFF",
							HDRBACKCOLOR: 	"FFFFFF",
							HDRBORDERCOLOR:	"FFFFFF"
						} : win.getData().Content;
						
		var node = 		new Panel();
		
		var preview = 	new SimpleButton({text:$MUI('Prévisualiser'), nofill:true});
		//
		// USER
		//
		forms.User = 			new Input({type:'text', maxLength:100, value: setting.User || ''});
		//
		// USER
		//
		forms.Password = 		new Input({type:'password', maxLength:100, value: setting.Password || ''});
		//
		// USER
		//
		forms.Signature = 		new TextArea({type:'text', maxLength:100, value: setting.Signature || ''});
		//forms.Signature.placeholder = '';
		
		//
		// USER
		//
		forms.BRANDNAME = 		new Input({type:'text', maxLength:120, value: setting.BRANDNAME || ''});
		//
		// Logo
		//		
		forms.HDRIMG = new FrameWorker({
			multiple:	false,
			parameters:	'cmd=mywallet.picture.import'
		});
				
		forms.HDRIMG.Value(setting.HDRIMG);
		//
		//
		//
		forms.HDRBORDERCOLOR = 		new InputColor();
		forms.HDRBORDERCOLOR.Value(setting.HDRBORDERCOLOR || "FFFFFF");
		//
		//
		//
		forms.PAYFLOWCOLOR = 		new InputColor();
		forms.PAYFLOWCOLOR.Value(setting.PAYFLOWCOLOR || "FFFFFF");
		//
		//
		//
		forms.HDRBACKCOLOR = 		new InputColor();
		forms.HDRBACKCOLOR.Value(setting.HDRBACKCOLOR || "FFFFFF");		
		//
		//
		//
		node.appendChild(new Node('h4', [$MUI('Information du compte paypal'), preview]));
		
		var table = new TableData();
				
		table.addHead($MUI('Identifiant'), {style:'width:200px'}).addCel(forms.User).addRow();
		table.addHead($MUI('Mot de passe')).addCel(forms.Password).addRow();
		table.addHead($MUI('Signature')).addCel(forms.Signature).addRow();
		
		node.appendChild(table);
		
		node.appendChild(new Node('h4', $MUI('Personnalisation')));
		
		var table = new TableData();
		
		table.addHead($MUI('Nom de marque à afficher'), {style:'width:200px'}).addCel(forms.BRANDNAME).addRow();
		table.addHead($MUI('Logo à afficher')).addCel(forms.HDRIMG).addRow();
		//table2.addHead($MUI('Couleur de fond de l\'entete')).addField(forms.HDRBACKCOLOR).addRow();
		//table2.addHead($MUI('Couleur de bordure de l\'entete')).addField(forms.HDRBORDERCOLOR).addRow();
		table.addHead($MUI('Couleur de fond du cadre')).addCel(forms.PAYFLOWCOLOR).addRow();
		
		node.appendChild(table);
		
		
		//
		// Submit
		//
		
		preview.on('click', function(){
			
			var obj = new System.MyWallet.Card(win.forms.save());
			
			$S.exec('mywallet.paypal.preview', {
				parameters:'MyWalletCardPaypal=' + obj.toJSON(),
				onComplete:function(result){
					if(result.responseText.match(/blogpress.paypal.preview.err/)){
						win.AlertBox.a(new SpliteWait($MUI('Une erreur est survenue lors de la génération de la prévisualisation'))).setType('CLOSE').show();	
					}else{
						try{
							window.open_(result.responseText.evalJSON(), 'paypal');
						}catch(er){
							$S.trace(result.responseText);	
						}
					}
				}
			});
			
			
			/*$S.Meta('PAYPAL', options, function(){
				win.ActiveProgress();
				$S.exec('blogpress.paypal.preview', function(result){
					if(result.responseText.match(/blogpress.paypal.preview.err/)){
						win.AlertBox.a(new SpliteWait($MUI('Une erreur est survenue lors de la génération de la prévisualisation'))).setType('CLOSE').show();	
					}else{
						window.open_(result.responseText.evalJSON(), 'paypal');
					}
				});
			});*/
		});
		
		
		return node;	
	}
};