/** section: BlogPress
 * class AccountInfo
 * 
 **/
var AccountInfo = Class.create();
AccountInfo.prototype = {
/**
 * new AccountInfo()
 *
 **/
	initialize: function(form){
		this.form = form;
		var self = this;	
		//this.AlertBox = new AlertBox();
		//$Body.appendChild(this.AlertBox);
		
		this.form.on('submit', this.submit.bind(this));
		
		if(this.form.ShowPassword){
			this.form.ShowPassword.getInstance().on('change', function(){
				self.form.NewPassword.type = this.Checked() ? 'text' : 'password';
			});
		}
		
		if(this.form.ChangePassword){
			
			this.form.select('.row-pass').invoke('hide');
			this.form.select('.row-show-pass').invoke('hide');
			
			this.form.ChangePassword.getInstance().on('change', function(){
				if(this.Checked()){
					self.form.select('.row-pass').invoke('show');
					self.form.select('.row-show-pass').invoke('show');
				}else{
					self.form.select('.row-pass').invoke('hide');
					self.form.select('.row-show-pass').invoke('hide');
				}
			});
		}
		
		if(this.form.LoginAlternate){
			$A(this.form.LoginAlternate).each(function(e){
				e.getInstance().on('change', function(){
					self.form.Login.value = e.value;
				});
			});
		}
		
		if(this.form.TypeAccount){
			try{
				this.form.TypeAccount.getInstance().on('change', this.onChangeTypeAccount.bind(this));
				this.onChangeTypeAccount();
			}catch(er){}
		}
		
		if(this.form.Siret){
			this.form.Siret.on('change', function(){
				if(this.value != ''){
					if(!this.value.isSiret()){
						$WR.Flag.setText($MUI('Vous devez saisir un numéro de Siret valide')).setType(FLAG.TOP).show(this.form.Siret, true);
					}
				}
			});
		}
	},
/**
 * AccountInfo.onChangeType() -> void
 **/	
	onChangeTypeAccount:function(){
		try{
			
		switch(this.form.TypeAccount.getInstance().Value()){
			case '0':
				
				this.form.select('.type-pro').invoke('hide');
				break;
			case '1':
				this.form.select('.type-pro').invoke('show');
				break;
		}
		}catch(er){alert(er)}
	},
/**
 * AccountInfo.submit() -> void
 **/	
	submit:function(evt){
		try{
		if(this.form.Name.value == ''){
			$WR.Flag.setText($MUI('Merci de saisir votre nom pour la création de votre compte')).setType(FLAG.TOP).show(this.form.Name, true);
			this.form.Name.focus();
			this.form.Name.select();
			evt.stop();
			return false;
		}
		
		if(this.form.FirstName.value == ''){
			$WR.Flag.setText($MUI('Merci de saisir votre prénom pour la création de votre compte')).setType(FLAG.TOP).show(this.form.FirstName, true);
			this.form.FirstName.focus();
			this.form.FirstName.select();
			evt.stop();
			return false;
		}
		
		if(this.form.EMail.value == ''){
			$WR.Flag.setText($MUI('Merci de saisir votre adresse e-mail pour la création de votre compte')).setType(FLAG.TOP).show(this.form.EMail, true);
			this.form.EMail.focus();
			this.form.EMail.select();
			evt.stop();
			return false;
		}
		
		if(this.form.Login.value == ''){
			$WR.Flag.setText($MUI('Merci de saisir votre pseudo pour la création de votre compte')).setType(FLAG.TOP).show(this.form.Login, true);
			this.form.Login.focus();
			this.form.Login.select();
			evt.stop();
			return false;
		}
		
		if(this.form.NewPassword){
			if(this.form.ChangePassword.getInstance().Checked()){
				if(this.form.OldPassword.value == ''){
					$WR.Flag.setText($MUI('Merci de saisir votre mot de passe pour la création de votre compte')).setType(FLAG.TOP).show(this.form.OldPassword, true);
					this.form.OldPassword.focus();
					this.form.OldPassword.select();
					evt.stop();
					return false;
				}
				
				
				if(this.form.OldPassword.value.length < 6){
					$WR.Flag.setText($MUI('Votre <b>mot de passe</b> doit comporter au moins <b>6 caractères</b>')).setType(FLAG.TOP).show(this.form.OldPassword, true);
					this.form.OldPassword.focus();
					this.form.OldPassword.select();
					evt.stop();
					return false;
				}
				
				if(this.form.NewPassword.value == ''){
					$WR.Flag.setText($MUI('Merci de saisir votre mot de passe pour la création de votre compte')).setType(FLAG.TOP).show(this.form.NewPassword, true);
					this.form.NewPassword.focus();
					this.form.NewPassword.select();
					evt.stop();
					return false;
				}
				
				
				if(this.form.NewPassword.value.length < 6){
					$WR.Flag.setText($MUI('Votre <b>mot de passe</b> doit comporter au moins <b>6 caractères</b>')).setType(FLAG.TOP).show(this.form.NewPassword, true);
					this.form.NewPassword.focus();
					this.form.NewPassword.select();
					evt.stop();
					return false;
				}
			}
		}
		
		if(this.form.TypeAccount && this.form.TypeAccount.getInstance().Value() == 1){//gestion des comptes pro
			
			if(this.form.Company.value == ''){
				$WR.Flag.setText($MUI('Vous devez saisir le nom de votre société')).setType(FLAG.TOP).show(this.form.Company, true);
				this.form.Company.focus();
				this.form.Company.select();
				evt.stop();
				return false;	
			}
			
			if(this.form.Siret.value != ''){
				if(!this.form.Siret.isSiret()){
					$WR.Flag.setText($MUI('Vous devez saisir un numéro de Siret valide')).setType(FLAG.TOP).show(this.form.Siret, true);
					this.form.Siret.focus();
					this.form.Siret.select();
					evt.stop();
					return false;
				}
			}
		
			if(this.form.Phone){
				if(this.form.Phone.value == ''){
					$WR.Flag.setText($MUI('Vous devez saisir un numéro de téléphone')).setType(FLAG.TOP).show(this.form.Phone, true);
					this.form.Phone.focus();
					this.form.Phone.select();
					evt.stop();
					return false;
				}
			}
			
		}
		
		}catch(er){alert(er)}
	}
};

Extends.after(function(){
	$$('.form-account-info').each(function(form){
		try{
		new AccountInfo(form);
		}catch(er){if(window['console']){console.log(er)}}
	});
});