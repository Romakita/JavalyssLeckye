/** section: lang
 * class String
 *
 * L'objet `String` permet de manipuler les chaines de caractère facilement en javascript.
 * La bibliothèque Extends ajoute un certain nombre de méthode à la classe `String`
 * en plus de celle déjà ajouté par Prototype.
 * 
 * #### Qu'en est-il de ces méthodes ? 
 * 
 * La majorité des méthodes décrite par Extends sont tirés du langage PHP
 * dans leur version Objet, afin de faciliter la transition pour le développeur entre PHP et Javascript.
 *
 **/
Object.extend(String.prototype, (function(){
/**
 * String#toDate() -> Date
 *
 * Analyse la chaine de caractère et tente une conversion de type String vers Date.
 *
 * ##### Exemple 
 *
 * Dans cette exemple nous allons convertir une chaine de caractère de date au format français vers
 * sont équivalent Date :
 *
 *     var madate = "10/12/2010";
 *     alert(typeof madata); //String
 *     madate = madate.toDate(); 
 *     alert(typeof madata); //object Date
 *
 * <p class="note">Cette méthode ne génère pas d'erreur si la chaine de caractère est invalide</p>
 **/
	function toDate(){
		var d = 		new Date();		
		var string = 	this.split(' ');
		
		if(string.length > 1){
			
			var h = string[1].split(':');
			
			if(h.length > 0){
				d.setHours(h[0]);
				d.setMinutes(h[1]);
				d.setSeconds(h[2]);
			}
		}
	
		string = string[0];
	
		if(string.substr(4,1) == "-") {
			
			string = string.split('-');
			
			d.setFullYear(string[0]);
			d.setMonth(new Number(string[1]) -1, string[2]);
		}
		else {
		
			string = string.split('/');

			d.setFullYear(string[2]);
			d.setMonth(new Number(string[1]) -1, string[0]);
		}
			
		return d;
	}
/**
 * String#htmlEntities() -> String
 *
 * Convertie tous les caractères éligibles en entités HTML.
 **/
	function htmlEntities(){
		/*
		 * @ignore
		 */
		function convert(char){

			var htmlentities = {' ':'nbsp','¡':'iexcl','¢':'cent','£':'pound','¤':'curren','¥':'yen','¦':'brvbar','§':'sect','¨':'uml','©':'copy','ª':'ordf','«':'laquo','¬':'not','­':'shy','®':'reg','¯':'macr','°':'deg','±':'plusmn','²':'sup2','³':'sup3','´':'acute','µ':'micro','¶':'para','·':'middot','¸':'cedil','¹':'sup1','º':'ordm','»':'raquo','¼':'frac14','½':'frac12','¾':'frac34','¿':'iquest','×':'times','÷':'divide','ƒ':'fnof','•':'bull','…':'hellip','′':'prime','″':'Prime','‾':'oline','⁄':'frasl','℘':'weierp','ℑ':'image','ℜ':'real','™':'trade','ℵ':'alefsym','←':'larr','↑':'uarr','→':'rarr','↓':'darr','↔':'harr','↵':'crarr','⇐':'lArr','⇑':'uArr','⇒':'rArr','⇓':'dArr','⇔':'hArr','∀':'forall','∂':'part','∃':'exist','∅':'empty','∇':'nabla','∈':'isin','∉':'notin','∋':'ni','∏':'prod','∑':'sum','−':'minus','∗':'lowast','√':'radic','∝':'prop','∞':'infin','∠':'ang','∧':'and','∨':'or','∩':'cap','∪':'cup','∫':'int','∴':'there4','∼':'sim','≅':'cong','≈':'asymp','≠':'ne','≡':'equiv','≤':'le','≥':'ge','⊂':'sub','⊃':'sup','⊄':'nsub','⊆':'sube','⊇':'supe','⊕':'oplus','⊗':'otimes','⊥':'perp','⋅':'sdot','\u2308':'lceil','\u2309':'rceil','\u230a':'lfloor','\u230b':'rfloor','\u2329':'lang','\u232a':'rang','◊':'loz','♠':'spades','♣':'clubs','♥':'hearts','♦':'diams','"':'quot','>':'gt','ˆ':'circ','˜':'tilde',' ':'ensp',' ':'emsp',' ':'thinsp','‌':'zwnj','‍':'zwj','‎':'lrm','‏':'rlm','–':'ndash','—':'mdash','‘':'lsquo','’':'rsquo','‚':'sbquo','“':'ldquo','”':'rdquo','„':'bdquo','†':'dagger','‡':'Dagger','‰':'permil','‹':'lsaquo','›':'rsaquo','€':'euro',' ':'nbsp','¡':'iexcl','¢':'cent','£':'pound','¤':'curren','¥':'yen','¦':'brvbar','§':'sect','¨':'uml','©':'copy','ª':'ordf','«':'laquo','¬':'not','­':'shy','®':'reg','¯':'macr','°':'deg','±':'plusmn','²':'sup2','³':'sup3','´':'acute','µ':'micro','¶':'para','·':'middot','¸':'cedil','¹':'sup1','º':'ordm','»':'raquo','¼':'frac14','½':'frac12','¾':'frac34','¿':'iquest','×':'times','÷':'divide','ƒ':'fnof','•':'bull','…':'hellip','′':'prime','″':'Prime','‾':'oline','⁄':'frasl','℘':'weierp','ℑ':'image','ℜ':'real','™':'trade','ℵ':'alefsym','←':'larr','↑':'uarr','→':'rarr','↓':'darr','↔':'harr','↵':'crarr','⇐':'lArr','⇑':'uArr','⇒':'rArr','⇓':'dArr','⇔':'hArr','∀':'forall','∂':'part','∃':'exist','∅':'empty','∇':'nabla','∈':'isin','∉':'notin','∋':'ni','∏':'prod','∑':'sum','−':'minus','∗':'lowast','√':'radic','∝':'prop','∞':'infin','∠':'ang','∧':'and','∨':'or','∩':'cap','∪':'cup','∫':'int','∴':'there4','∼':'sim','≅':'cong','≈':'asymp','≠':'ne','≡':'equiv','≤':'le','≥':'ge','⊂':'sub','⊃':'sup','⊄':'nsub','⊆':'sube','⊇':'supe','⊕':'oplus','⊗':'otimes','⊥':'perp','⋅':'sdot','\u2308':'lceil','\u2309':'rceil','\u230a':'lfloor','\u230b':'rfloor','\u2329':'lang','\u232a':'rang','◊':'loz','♠':'spades','♣':'clubs','♥':'hearts','♦':'diams','"':'quot','>':'gt','ˆ':'circ','˜':'tilde',' ':'ensp',' ':'emsp',' ':'thinsp','‌':'zwnj','‍':'zwj','‎':'lrm','‏':'rlm','–':'ndash','—':'mdash','‘':'lsquo','’':'rsquo','‚':'sbquo','“':'ldquo','”':'rdquo','„':'bdquo','†':'dagger','‡':'Dagger','‰':'permil','‹':'lsaquo','›':'rsaquo','€':'euro', 'À':'Agrave','Á':'Aacute','Â':'Acirc','Ã':'Atilde','Ä':'Auml','Å':'Aring','Æ':'AElig','Ç':'Ccedil','È':'Egrave','É':'Eacute','Ê':'Ecirc','Ë':'Euml','Ì':'Igrave','Í':'Iacute','Î':'Icirc','Ï':'Iuml','Ð':'ETH','Ñ':'Ntilde','Ò':'Ograve','Ó':'Oacute','Ô':'Ocirc','Õ':'Otilde','Ö':'Ouml','Ø':'Oslash','Ù':'Ugrave','Ú':'Uacute','Û':'Ucirc','Ü':'Uuml','Ý':'Yacute','Þ':'THORN','ß':'szlig','à':'agrave','á':'aacute','â':'acirc','ã':'atilde','ä':'auml','å':'aring','æ':'aelig','ç':'ccedil','è':'egrave','é':'eacute','ê':'ecirc','ë':'euml','ì':'igrave','í':'iacute','î':'icirc','ï':'iuml','ð':'eth','ñ':'ntilde','ò':'ograve','ó':'oacute','ô':'ocirc','õ':'otilde','ö':'ouml','ø':'oslash','ù':'ugrave','ú':'uacute','û':'ucirc','ü':'uuml','ý':'yacute','þ':'thorn','ÿ':'yuml','Œ':'OElig','œ':'oelig','Š':'Scaron','š':'scaron','Ÿ':'Yuml', 'Α':'Alpha','Β':'Beta','Γ':'Gamma','Δ':'Delta','Ε':'Epsilon','Ζ':'Zeta','Η':'Eta','Θ':'Theta','Ι':'Iota','Κ':'Kappa','Λ':'Lambda','Μ':'Mu','Ν':'Nu','Ξ':'Xi','Ο':'Omicron','Π':'Pi','Ρ':'Rho','Σ':'Sigma','Τ':'Tau','Υ':'Upsilon','Φ':'Phi','Χ':'Chi','Ψ':'Psi','Ω':'Omega','α':'alpha','β':'beta','γ':'gamma','δ':'delta','ε':'epsilon','ζ':'zeta','η':'eta','θ':'theta','ι':'iota','κ':'kappa','λ':'lambda','μ':'mu','ν':'nu','ξ':'xi','ο':'omicron','π':'pi','ρ':'rho','ς':'sigmaf','σ':'sigma','τ':'tau','υ':'upsilon','φ':'phi','χ':'chi','ψ':'psi','ω':'omega','\u03d1':'thetasym','\u03d2':'upsih','\u03d6':'piv'};
			
			if(!Object.isUndefined(htmlentities[char])) return "&"+htmlentities[char]+";";
			return char;
		}
		var tmp = '';
		for(var i = 0; i < this.length; i++){
			tmp += convert(this.substr(i,1));
		}
		return tmp;
	}
/**
 * String#html_entity_decode(quotestyle) -> String
 * - quotestyle (String): Le paramètre optionnel quote_style vous permet de définir ce qu'il adviendra des guillemets simples et doubles. 
 *
 * `html_entity_decode()` est la fonction contraire de [[String#htmlEntities]] : elle convertit les entités HTML de la chaîne string en caractères normaux. 
 *
 * #### Conversion prise en charge :
 *
 * Le paramètre `quotestyle` peut prendre les valeurs suivantes :
 *
 * * `HTML_SPECIALCHARS`.
 * * `HTML_ENTITIES`.
 * * `ENT_NOQUOTES` : Ne convertit aucun guillemet.
 * * `ENT_COMPAT` : Convertit les guillemets doubles et ignore les guillemets simples.
 * * `ENT_QUOTES` : Convertit les guillemets doubles et les guillemets simples.
 *
 *
 * #### Rendons à César ce qui est à César !
 *
 * L'auteur original de cette méthode John, <a href="http://www.jd-tech.net">http://www.jd-tech.net</a>. 
 * Donc merci à John pour cette superbe méthode.
 *
 **/
	function html_entity_decode(quote_style) {
		var string = this;
		//if(quote_style == undefined) quote_style = 'HTML_SPECIALCHARS';
 
		var hash_map = {}, symbol = '', tmp_str = '', entity = '';
		tmp_str = string.toString();
		
		if (false === (hash_map = document.get_html_translation_table('HTML_ENTITIES', quote_style))) {
			return false;
		}
	 
		for (symbol in hash_map) {
			entity = hash_map[symbol];
			tmp_str = tmp_str.split(entity).join(symbol);
		}
		tmp_str = tmp_str.split('&#039;').join("'");
		
		return tmp_str;
	}
/**
 * String#isMail() -> Boolean
 *
 * Analyse et vérifie la syntaxe de l'e-mail. Si il y a correspondance, la méthode retoune true.
 **/
	function isMail(){
		var reg = new RegExp("([@]([a-z0-9]+)[\-]?([a-z0-9]+)[\.](([a-z]+)[\.]?([a-z]+)))");
		return reg.exec(this.toLowerCase().replace(/[_\\-]/g, ''));
	}
/**
 * String#isDate() -> Boolean
 *
 * Analyse et vérifie la syntaxe de la date au format String. Si il y a correspondance, la méthode retoune true.
 **/
	function isDate(){
		var regdate = new RegExp("^([0-9]{2})/([0-9]{2})/([0-9]{4})");
		var tab;
		var tMonth;
		
		if(this == '0000-00-00' || this == '0000-00-00 00:00:00'){
			return false;	
		}
		
		if(regdate.exec(this)) {
			tab = this.split("/");
			tMonth = (new Date(tab[2], 0, 1)).getArrayDaysByMonth();
			if(tab[1] > 12) return false;
			if(tab[0] < 0 && tab[0] > tMonth[tab[1] - 1]) return false;
			return true;
		}
		regdate = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})");
		if(regdate.exec(this)){
			tab = this.split("-");
			tMonth = (new Date(tab[0], 0, 1)).getArrayDaysByMonth();
			if(tab[1] > 12) return false;
			if(tab[2] < 0 && tab[2] > tMonth[tab[1] - 1]) return false;
			return true;
		}
		return false;
	}
/**
 * String#isTel() -> Boolean
 *
 * Analyse et vérifie la syntaxe du numéro de téléphone. Si il y a correspondance, la méthode retoune true.
 * Les numéros pris en charge sont les numéros français, allant du 01 au 09 en préfixe.
 **/
	function isTel(){
		var regtel = new RegExp("^(01|02|03|04|05|06|07|08|09)[0-9]{8}");
		return regtel.test(this);
	}
/**
 * String#isNumber() -> Boolean
 *
 * Analyse et vérifie la syntaxe du nombre au format String. Si il y a correspondance, la méthode retoune true.
 * Les numéros pris en charge sont les numéros français, allant du 01 au 09 en préfixe.
 **/
	function isNumber(){
		return !isNaN(this);
	}
/**
 * String#isIP() -> Boolean
 *
 * Analyse et vérifie la syntaxe de l'adresse IP.
 *
 * <p class="note">Source : http://jsfiddle.net/DanielD/8S4nq/</p>
 **/
	function isIP(){
		var reg = new RegExp('^\s*((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\s*$');
		return reg.test(this);
	}
/**
 * String#isIPv6() -> Boolean
 *
 * Analyse et vérifie la syntaxe de l'adresse IP.
 *
 * <p class="note">Source : http://jsfiddle.net/DanielD/8S4nq/</p>
 **/	
	function isIPv6(){
		var reg = new RegExp("^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$");
		
		return reg.test(this);	
	}
/**
 * String#isHostName() -> Boolean
 *
 * Analyse et vérifie la syntaxe du domaine selon la norme RFC 1123.
 *
 * <p class="note">Source : http://jsfiddle.net/DanielD/8S4nq/</p>
 **/
	function isHostName(){
		var reg = new RegExp('^\s*((?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*\.?)\s*$');
		return reg.test(this);	
	}
/**
 * String#toNumber() -> Number
 *
 * Cette methode tente la conversion du type [[String]] vers le type [[Number]].
 **/
	function toNumber(){
		if(this.isNumber) return 1 * this;
		return false;
	}
/**
 * String#isCodePostal() -> Boolean
 *
 * Analyse et vérifie la syntaxe du code postal. Si il y a correspondance, la méthode retoune true.
 **/
	function isCodePostal(){
		var sp = this.substr(0,2);
		
		var reg = new RegExp("^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$", 'g');
		
		return reg.test(this);
	}
/**
 * String#isSiret() -> Boolean
 *
 * Analyse et vérifie la syntaxe du numero de siret. Si il y a correspondance, la méthode retoune true.
 **/
	function isSiret(){

		var somme = 0;
		var tmp;
		//temporairement
		if ((this.length != 14) || (isNaN(this)) ) return false;

		 // Donc le SIRET est un numérique à 14 chiffres
		 // Les 9 premiers chiffres sont ceux du SIREN (ou RCS), les 4 suivants
		 // correspondent au numéro d'établissement
		 // et enfin le dernier chiffre est une clef de LUHN.
		 
		 for (var cpt = 0; cpt < this.length; cpt++) {
			if ((cpt % 2) == 0) { // Les positions impaires : 1er, 3è, 5è, etc...
					tmp = this.charAt(cpt) * 2; // On le multiplie par 2
					if (tmp > 9) tmp -= 9; // Si le résultat est supérieur à 9, on lui soustrait 9
			}
			else tmp = this.charAt(cpt);
			somme += parseInt(tmp);
		 }
		 
		 if ((somme % 10) == 0) return true; // Si la somme est un multiple de 10 alors le SIRET est valide
		 return false;
	}
/**
 * String#isSiren() -> Boolean
 *
 * Analyse et vérifie la syntaxe du numero de siren. Si il y a correspondance, la méthode retoune true.
 **/
	function isSiren(){

		var somme = 0;
		var tmp;
		if((this.length != 9) || (isNaN(this)))return false;

		// Donc le SIREN est un numérique à 9 chiffres
		for (var cpt = 0; cpt < this.length; cpt++){
			if((cpt % 2) == 1){ // Les positions paires : 2ème, 4ème, 6ème et 8ème chiffre
				tmp = this.charAt(cpt) * 2; // On le multiplie par 2
				if (tmp > 9) tmp -= 9; // Si le résultat est supérieur à 9, on lui soustrait 9
			}
			else tmp = this.charAt(cpt);
			somme += parseInt(tmp);
		}
		if ((somme % 10) == 0) return true; // Si la somme est un multiple de 10 alors le SIREN est valide
		return false;

	}	
	/*
	 * Déspécialise les caractères spéciaux du string courant
	 * @returns {String}
	 */
/**
 * String#addslashes() -> String
 *
 * Retourne la chaîne str, après avoir échappé tous les caractères qui doivent l'être, pour être utilisée dans une requête de base de données. 
 * Ces caractères sont les guillemets simples * ('), guillemets doubles ("), antislash (\) et NUL (le caractère NULL).
 *
 * Un exemple d'utilisation d'addslashes() est lorsque vous entrez des données dans une base de données. Par exemple, pour insérer le nom O'reilly dans la base, 
 * vous aurez besoin de le protéger. 
 * 
 * ##### Exemple
 * 
 *    var str = "Votre nom est-il O'reilly ?";
 *    // Affiche : Votre nom est-il O\'reilly ?
 *    alert(str.addslashes());
 *
 **/
	function addslashes(){
		return this.replace(/("|'|\\)/g, "\\$1");
	}
/**
 * String#stripslashes() -> String
 *
 * Supprime les antislashs d'une chaîne.
 * 
 * ##### Exemple
 * 
 *    var str = "Votre nom est-il O\'reilly ?";
 *    // Affiche : Votre nom est-il O'reilly ?
 *    alert(str.addslashes());
 *
 **/
	function stripslashes(){
		return this.replace(/\\("|'|\\)/g, "$1"); 
	}	
/**
 * String#format(mask) -> String
 * - mask (String): Masque pour le formatage.
 *
 * Formate la chaine de caractère en fonction d'un masque de saisie.
 * Cette méthode est similaire à [[Element.createMask]].
 * 
 * ##### Exemple
 * 
 *     var str = "0164214200";
 *     alert(str.format('## ## ## ## ##'); //01 64 21 42 00
 *
 **/
	function format(mask){
						
		var str = 		'';

		for(var i = 0, y = 0; y < this.length && i < mask.length; i += 1){
			
			var char = mask.slice(i,i+1);
		
			if(char == "#"){
				str += this.slice(y,y+1);
				y++;
			}else{
				str += char;
			}
		}
		
		return str;
	}
/**
 * String#unformat(mask) -> String
 * - mask (String): Masque pour le formatage.
 *
 * Cette méthode est l'inverse de [[String#format]]. Elle restitue une chaine non formaté.
 * 
 * ##### Exemple
 * 
 *    var str = "01 64 21 42 00";
 *    alert(str.unformat('## ## ## ## ##'); //0164214200
 *
 **/
	function unformat(mask){
		var str = 		'';

		for(var i = 0; i < mask.length && i < this.length; i += 1){
			
			var char = mask[i];
		
			if(char == "#"){
				str += this[i];
			}
		}
		
		return str;
	}
/** 
 * String#insert(intIndex, strChar) -> String
 * - intIndex (Number): Position d'index de l'insertion.
 * - strChar (String): Chaine à inserer.
 *
 * Insère une instance spécifiée de String au point d'index indiqué dans cette instance.
 **/
	function insert(intIndex, strChar){
 		if(isNaN(intIndex))	return this;
 		if(intIndex < 0)	return this;
 
 		if(!strChar) return this;
		strChar += '';
 		intIndex = parseInt(intIndex, 10);
 		return (this.substr(0, intIndex) + strChar + this.substr(intIndex, this.length));
	}
	
	function addSlash(){
		var ret = "";
		for(var i=0;i < this.length;i++){
			if("\\^$+{}[]:!=|-,/".indexOf(this.charAt(i))!=-1){
				ret +="\\"+this.charAt(i);
			}else{
				ret +=this.charAt(i);
			}
		}
		return ret;
	}
/**
 * String#parseBBCodes([pattern]) -> String
 * - pattern (Object): Liste des bbtag -> htmltag
 *
 * Cette méthode analyse l'instance à la recherche de balise BBCode pour les convertir en balise HTML.
 **/
 	 function parseBBCodes(obj){
	
		var options = {
			'[b]':					'<strong>',
			'[/b]':					'</strong>',
			'[u]':					'<span style="text-decoration: underline;">',
			'[/u]':					'</span>',
			'[i]':					'<em>',
			'[/i]':					'</em>',
			'[s]':					'<s>',
			'[/s]':					'<\/s>',
			'[color="?(.*?)"?]':	'<span style="color:$1">', 
			'[/color]':				'</span>',
			'[br]':					'<br \/>', 
			'[hr]':					'<hr \/>',
			'[size="?(.*?)"?]':		'<span style="font-size:$1">',
			'[/size]':				'</span>',
			'[font="?(.*?)"?]':		'<span style="font-family:$1">',
			'[/font]':				'</span>',
			
			'[align="?(.*?)"?]':	'<div style="text-align:$1">',
			'[/align]':				'</div>',
			
			'[center]':				'<div style="text-align:center">',
			'[/center]':			'</div>',
			'[quote]':				'<blockquote>',
			'[quote="?(.*?)"?]':	'<blockquote><strong>$1 a &eacute;crit :</strong>',
			'[/quote]':				'</blockquote>',
			
			'[code]':				'<code>',
			'[/code]':				'</code>',
			
			'[pre]':							'<pre>',
			'[/pre]':							'<\/pre>',
			
			'[url](.*?)[/url]':					'<a href="$1">$1</a>',
			'[url="?(.*?)"?](.*?)[/url]':		'<a href="$1">$2</a>',
			
			'[email](.*?)[/email]':				'<a href="mailto:$1">$1</a>',
			'[email="?(.*?)"?](.*?)[/email]':	'<a href="mailto:$1">$2</a>',
			
			'[img](.*?)[/img]':					'<img src="$1" />',
			
			'[youtube](.*?)[/youtube]':			'<object width="480" height="360"><param value="http://www.youtube.com/v/{param}" name="movie"><embed width="480" height="360" type="application/x-shockwave-flash" src="http://www.youtube.com/v/$1"></object>',
			'[gvideo](.*?)[/gvideo]':			'<embed src="http://video.google.com/googleplayer.swf?docId=$1&amp;hl=en" type="application/x-shockwave-flash" id="VideoPlayback" style="width:480px; height:360px;">',
			'[dailymotion](.*?)[/dailymotion]':	'<object width="480" height="360"><param name="movie" value="http://www.dailymotion.com/swf/video/$1"></param><param name="allowFullScreen" value="true"></param><param name="allowScriptAccess" value="always"></param><param name="wmode" value="transparent"></param><embed type="application/x-shockwave-flash" src="http://www.dailymotion.com/swf/video/$1" width="480" height="360" wmode="transparent" allowfullscreen="true" allowscriptaccess="always"></embed></object>',
			'[table]':				'<table>',
			'[/table]':				'<\/table>',
			'[tr]':					'<tr>',
			'[/tr]':				'<\/tr>',
			'[td]':					'<td>',
			'[/td]':				'<\/td>'
		};
		
		if(!Object.isUndefined(obj)){
			Object.extend(options, obj);
		}
		
		var string = this;
		for(var key in options){
			var re = 	eval("/"+ key.addSlash() +"/gi");
			string = 	string.replace(re, options[key]);	
		}
		
		return string;
	}
/**
 * String#padLeft(totalWidth, paddingChar) -> String
 * - totalWidth (Number): Nombre de caractères dans la chaîne qui en résulte, égal au nombre de caractères d'origine plus tout caractère de remplissage supplémentaire. 
 * - paddingChar (String): Caractère Unicode de remplissage. 
 *
 * Aligne les caractères de cette instance à droite et, à gauche, remplit en ajoutant des espaces ou un caractère Unicode spécifié pour une longueur totale spécifiée.
 **/
	function padLeft(){
 		if(arguments.length == 0 || (arguments.length >= 1 && isNaN(arguments[0])) || arguments[0] < 0) return this;
 
 		var strThis = this, intLength = parseInt(arguments[0], 10), strChar = String.fromCharCode(32);
 		
		if(arguments.length == 2) 	strChar = '' + arguments[1];
 		while (strThis.length < intLength) strThis = strChar + strThis;
		
 		return strThis;
	}
/**
 * String#padRight(totalWidth, paddingChar) -> String
 * - totalWidth (Number): Nombre de caractères dans la chaîne qui en résulte, égal au nombre de caractères d'origine plus tout caractère de remplissage supplémentaire. 
 * - paddingChar (String): Caractère Unicode de remplissage. 
 *
 * Aligne les caractères de cette chaîne à gauche et remplit à droite en ajoutant un caractère Unicode spécifié pour une longueur totale spécifiée.
 **/
	function padRight(){
 		if(arguments.length == 0 || (arguments.length >= 1 && isNaN(arguments[0])) || arguments[0] < 0) return this;
	
		var strThis = this, intLength = parseInt(arguments[0], 10), strChar = String.fromCharCode(32);
 		if(arguments.length == 2) strChar = '' + arguments[1];
		
 		while (strThis.length < intLength) strThis = strThis + strChar;
 		return strThis;
	}
/**
 * String#remove(intIndex, intLength) -> String
 * - intIndex(Number): Supprime de la chaîne tous les caractères en commençant à la position spécifiée et en continuant jusqu'à la dernière position.
 * - intLength(Number): Supprime un nombre spécifié de caractères de cette instance en commençant à une position définie.
 *
 * Retourne une nouvelle chaîne dans laquelle un nombre spécifié de caractères de cette instance est supprimé.
 **/
	function remove(intIndex, intLength){
 		if(isNaN(intIndex) || isNaN(intLength) || intIndex < 0 || intLength < 0) return this;

 		intIndex = parseInt(intIndex, 10);
		intLength = parseInt(intLength, 10);
 		return (this.substr(0, intIndex) + this.substr(intIndex + intLength, this.length));
	}
/**
 * String#trim() -> String
 *
 * Supprime toutes les occurrences d'un jeu de caractères spécifié à partir du début et de la fin de cette instance. 
 **/
	function trim(){
 		return this.replace(/(^\s*)|(\s*$)/g, '');
	}
/**
 * String#rtrim() -> String
 *
 * Supprime toutes les occurrences d'un jeu de caractères spécifié à partir du début et de la fin de cette instance. 
 **/
	function rtrim(){
 		return this.replace(/\s*$/g, '');
	}
/**
 * String#ltrim() -> String
 *
 * Supprime toutes les occurrences d'un jeu de caractères spécifié à partir du début et de la fin de cette instance. 
 **/
	function ltrim(){
 		return this.replace(/^\s*/g, '');
	}
/**
 * String#sanitize(charReplace) -> String
 * - charReplace (String): Caractère de remplacement des caractères spéciaux n'ayant pas d'équivalent.
 *
 * Supprime tous les caractères accentués de la chaine et les remplaces par leurs équivalent non accentués.
 **/
	function sanitize(charRemplacement){
		
		if(Object.isUndefined(charRemplacement)) charRemplacement = "-";
		
		var string = this.trim().replace(/ /g, charRemplacement);
		string = encodeURIComponent(string);
		string = string.replace(/(%C3%A9)|(%C3%A8)|(%C3%AA)|(%C3%AB)/g,'e');
		string = string.replace(/(%C3%A0)|(%C3%A4)|(%C3%A2)/g,'a');
		string = string.replace(/(%C3%B9)|(%C3%BC)|(%C3%BB)/g,'u');
		string = string.replace(/(%C3%BF)/g,'y');
		string = string.replace(/(%C3%B2)|(%C3%B6)|(%C3%B4)/g,'o');
		string = string.replace(/(%C3%A7)/g,'c');
		string = string.replace(/%[A-F0-9]{0,2}/g, '');
		
		var reg = new RegExp('/\\\\|\\/|\\||\\:|\\?|\\*|"|<|>|[[:cntrl:]]/','g');
		string = string.replace(reg, charRemplacement);
		string = string.replace(/[~'!\.]/g, '');
		
		string = string.replace(/--/g, '-');
		
		return string;
	}
/**
 * String#toMoney() -> String
 *
 * Transforme la chaine au format Money pour l'affichage de feuille de Calcul.
 **/
	function toMoney(){
		var prix = this.split('.');
		if(prix[0] == '' || prix[0] == '0') prix[0] = '0';
		else{
			var prix_ = '';
			var nb = prix[0].length -1;
			
			for(var i = nb; i >= 0; i -= 1) {				
				if((nb - i) % 3 == 2) prix_ = " " + prix[0][i] + prix_;
				else prix_ = prix[0][i] + prix_;
			}
			
			prix[0] = prix_;
		}
		if(Object.isUndefined(prix[1])) prix[1] = '00';
		else{
			prix[1] = Math.round(prix[1] * 100) / 100;	
		}

		if(prix.length == 2) return prix[0] + "," + (prix[1]+"0").slice(0, 2);
		return prix[0] + ",00";
	}
/** alias of: $MUI
 * String#mui() -> String
 **/
	function mui(){
		return $MUI(this);
	}
/**
 * String#isHexa() -> Boolean
 *
 * Analyse et vérifie la syntaxe de la chaine Hexadecimal. Si il y a correspondance, la méthode retoune true.
 **/
	function isHexa(){
		var regDec = /^[a-fA-F\d]+$/;
		if (!regDec.test(this)) return false;
		return true;
	}
/**
 * String#toDecimal() -> Number
 *
 * Cette méthode tente de convertire une chaine hexadecimal en nombre décimal.
 **/
	function toDecimal(){
		var oHex = this;
		// Vérif condition mini ok
		if (!this.isHexa()) return false;
		var result = parseInt(oHex,16);
		return result;
	}
/**
 * String#toHexa() -> String
 *
 * Cette méthode tente de convertire une chaine décimal en héxadecimal.
 **/
	function toHexa(){
		var oDec = this;
		if(oDec == undefined) return false;
		
		var regDec = /^\d+$/;
	
		if (!regDec.test(oDec)) return false;
		
		return parseInt(oDec,10).toString(16).toUpperCase();
	}
/**
 * String#replaceAll(search, replace) -> String
 * - search (String): La valeur à chercher, autrement connue comme le masque. Le masque peut être une expression régulière.
 *
 * Remplace toutes les occurrences dans une chaîne.
 * String#replaceAll retourne une chaîne, dont toutes les occurrences de search dans subject ont été remplacées par replace.
 **/
	function replaceAll($search, $replace){
		if(Object.isString($search)){
			return this.replace(new RegExp($search, 'g'), $replace);
		}
	}
	
	return	{	
				addslashes:				addslashes,
				addSlash:				addSlash,
				format:					format,
				html_entity_decode : 	html_entity_decode,
				htmlEntities: 			htmlEntities,
				insert:					insert,
				isCodePostal:			isCodePostal,
				isDate:					isDate,
				isHexa:					isHexa,
				isMail:					isMail,
				isIP:					isIP,
				isIPv6:					isIPv6,
				isHostName:				isHostName,
				isNumber:				isNumber,
				isSiret:				isSiret,
				isSiren:				isSiren,
				isTel:					isTel,
				ltrim:					ltrim,
				padLeft:				padLeft,
				padRight:				padRight,
				parseBBCodes:			parseBBCodes,
				replaceAll:				replaceAll,
				remove:					remove,
				rtrim:					rtrim,
				sanitize:				sanitize,
				stripslashes: 			stripslashes,
				mui:					mui,
				trim:					trim,
				toDate:					toDate,
				toDecimal:				toDecimal,
				toHexa:					toHexa,
				toMoney:				toMoney,
				toNumber:				toNumber,
				unformat:				unformat
			};
})());