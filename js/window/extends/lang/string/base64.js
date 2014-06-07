/** section: lang
 * String.Base64
 * Gestion de l'encodage/décodage des chaines en Base64.
 **/
Import('extends.lang.string.utf8');
String.Base64 = {
	
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
/**
 * String.Base64.encode(string) -> String
 * - string (String): Chaine à encoder.
 *
 * Encode la chaine en base64.
 **/	
	encode: function (input) {
		var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
		
		input = input.utf8encode();
		
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}
		
		return output;
	},
/**
 * String.Base64.decode(string) -> String
 * - string (String): Chaine à décoder.
 *
 * Décode la chaine en base64.
 **/	
	decode: function (input) {
		var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) output = output + String.fromCharCode(chr2);
			if (enc4 != 64) output = output + String.fromCharCode(chr3);
		}
		
		output = output.utf8decode();
		return output;
	}
};

Object.extend(String.prototype,{
/**
 * String#base64encode() -> String
 *
 * Encode la chaine en base64.
 **/	
	base64encode:function(){
		return String.Base64.encode(this);	
	},
/**
 * String#base64encode() -> String
 *
 * Décode la chaine en base64.
 **/	
	base64decode:function(){
		return String.Base64.encode(this);	
	}
});