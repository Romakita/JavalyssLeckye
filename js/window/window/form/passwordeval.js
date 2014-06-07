/** section: UI
 * class PasswordEval < Element
 * Cette classe créée un affichage par niveau de la sécurité d'un mot de passe.
 **/
var PasswordEval = Class.createSprite('span');

PasswordEval.prototype = {
	/** @ignore */
	className: 'wobject password-eval',
/**
 * PasswordEval.minLength -> Number
 * Taille minimal du mot de passe.
 **/
	minLength:	7,
/**
 * new PasswordEval()
 *
 * Cette méthode créée une nouvelle instance
 **/
	initialize:function(){
		
		this.Level1 = new Node('span', $MUI('Faible'));
		this.Level2 = new Node('span', $MUI('Moyen'));
		this.Level3 = new Node('span', $MUI('Fort'));
		
		this.appendChilds([this.Level1, this.Level2, this.Level3]);
		
	},
/**
 * PasswordEval.eval(pass) -> void
 *
 * Evalue une mot de passe et affiche le niveau de sécurité.
 **/
	eval: function(pass){
		var i = 0;
	
		if(pass.length >= 3){
			i++;
			
			if(pass.search("[A-Z]") != -1){
				i++;
			}
			
			if(pass.search("[0-9]") != -1){
				i++;
			}
			
			if (pass.length >= this.minLength || pass.search("[\x20-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]") != -1){
				i++;
			}
		}
		
		switch(i){
			case 0:
				this.Level1.className = '';
				this.Level2.className = '';
				this.Level3.className = '';
				break;
			case 1:
				this.Level1.className = 'color-low';
				this.Level2.className = '';
				this.Level3.className = '';
				break;
			case 2:
				this.Level1.className = 'color-average';
				this.Level2.className = 'color-average';
				this.Level3.className = '';
				break;
			case 3:
				this.Level1.className = 'color-hight';
				this.Level2.className = 'color-hight';
				this.Level3.className = 'color-hight';
				break;
		}
		
	}
};