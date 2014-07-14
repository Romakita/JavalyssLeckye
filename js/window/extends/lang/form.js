/**
 * Extends.Form
 * Cette classe gère les formulaires créée par la librairie Window JS. Elle permet de sérialiser rapidement les données du formulaire contenant les champs spécifiques à cette librairie vers un objet.
 **/
$.Form = Extends.Form = Class.create({
/**
 * new Extends.Form([object])
 * 
 * Cette méthode créée une nouvelle instance [[Extends.Form]].
 **/	
	initialize:function(o){
		
		for(var key in Extends.Form.Methods){
			this[key] = (function(key){	
				return function(){
					var args = [this].concat($A(arguments));
					return Extends.Form.Methods[key].apply(this, args);
				};
			})(key);
		}
		
		Object.extend(this, o || {});
		
	}	
});

Extends.Form.Methods = {};

Object.extend(Extends.Form.Methods, {
/**
 * Extends.Form.addFilters(@form, key, fn) -> Extends.Form
 * - form (Extends.Form): Formulaire JS.
 * - key (String): Nom du champ à filtrer.
 * - fn (String | Function): Nom de la méthode à utiliser ou fonction. 
 * 
 * Cette méthode ajoute un filtre de sauvegarde d'un champ.
 **/	
	addFilters:function(form, key, fn){
		
		if(Object.isUndefined(form[key])){
			form[key] = null;	
		}
		
		if(Object.isUndefined(form.filters)){
			form.filters = {};
		}
		
		form.filters[key] = fn;
		
		return form;
	},
/**
 * Extends.Form.exclude(@form, field) -> Extends.Form
 * - form (Extends.Form): Formulaire JS.
 * - field (String): Nom du champ.
 * 
 * Cette méthode ajoute un nom de champ à ignorer lors de la comparaison avec la méthode [[Extends.Form.checkChange]].
 **/	
	exclude:function(form, field){
		
		if(Object.isUndefined(form._exclude)){
			form._exclude = [];
		}
		
		form._exclude.push(field);
		
		return form;
	},
/**
 * Extends.Form.checkChange(@form, source) -> Boolean
 * - form (Extends.Form): Formulaire JS.
 * - source (Object): Objet d'origine à comparer.
 * 
 * Cette méthode compare l'objet source aux données stockées dans le formulaire.
 **/	
	checkChange: function(form, o){
		
		for(var key in form){
			var lastValue = null, newValue = null;
			
			if(Object.isFunction(form[key])){
				continue;
			}
			
			if(Object.isUndefined(o[key])){
				continue;
			}
			
			if(!Object.isUndefined(form._exclude)){
				if(form._exclude.indexOf(key)!= -1){
					continue;	
				}
			}
			
			try{
			
			if(Object.isElement(form[key])){
				
				if(!Object.isUndefined(form.filters)){
					if(!Object.isUndefined(form.filters[key])){
						
						var fn = form.filters[key];
						
						if(Object.isString(fn)){
							if(Object.isFunction(form[key][fn])){
								newValue = form[key][fn].call(form[key]);
								
							}
						}else{
							if(Object.isFunction(fn)){
								newValue = fn.call(form, o);
							}
						}
					}
				}
				
				if(newValue == null){
					if(Object.isFunction(form[key].Value)){
						newValue = form[key].Value();	
						
						if(newValue === ''){//possible que le champ soit de type Text
							if(Object.isFunction(form[key].Text)){
								newValue = form[key].Text();	
							}
						}
						
					}else{
						if(!Object.isUndefined(form[key].value)){
							newValue = form[key].value;
						}
					}
				}
								
			}else{
				
				if(!Object.isUndefined(form.filters)){
					var fn = form.filters[key];
											
					if(!Object.isUndefined(form.filters[key])){
						var fn = form.filters[key];
						
						if(Object.isFunction(fn)){
							newValue = fn.call(form, o);
						}
						
					}
				}
			}
			
			if(Object.isUndefined(newValue) || newValue == null){
				continue;
			}
			
			lastValue = o[key];
							
			if(!Extends.Form.compare(lastValue, newValue)){
				
				if(Object.isFunction(form.onChange)){
					form.onChange.call(form, key, lastValue, newValue);	
				}
				return true;	
			}
			
			}catch(er){
				console.log(er);
				console.log(key);
			}
		}
		
		return false;
	},
/**
 * Extends.Form.save(@form [, source]) -> Boolean
 * - form (Extends.Form): Formulaire JS.
 * - source (Object): Objet d'origine à sauvegarder.
 * 
 * Cette méthode sauvegarde les données du formulaire vers l'objet source ou retourne un objet contenant les données du formulaire.
 **/		
	save:function(form, o){
		o = o || {};
		
		for(var key in form){
			
			if(Object.isFunction(form[key])){
				continue;
			}
						
			if(Object.isElement(form[key])){
				
				if(!Object.isUndefined(form.filters)){
					if(!Object.isUndefined(form.filters[key])){
						var fn = form.filters[key];
						
						if(Object.isString(fn)){
							if(Object.isFunction(form[key][fn])){
								o[key] = form[key][fn].call(form[key]);
								continue;
							}
						}else{
							if(Object.isFunction(fn)){
								o[key] = fn.call(form, o);
								continue;
							}
						}
					}
				}
				
				if(Object.isFunction(form[key].Value)){
					o[key] = form[key].Value();	
					
					if(o[key] === ''){//possible que le champ soit de type Text
						if(Object.isFunction(form[key].Text)){
							o[key] = form[key].Text();	
						}
					}
				}else{
					if(!Object.isUndefined(form[key].value)){
						o[key] = form[key].value;
					}
				}
								
			}else{
				if(!Object.isUndefined(form.filters)){
					
					if(Object.isFunction(form.filters[key])){
						o[key] = form.filters[key].call(form, o);
						continue;
					}
					
				}
			}
		}
		
		return o;
	}
});

Object.extend(Extends.Form, Extends.Form.Methods);

Extends.Form.compare = function(o, n){
	var type = typeof n;
							
	switch(type){
		case 'function':break;
			
		default:
		case 'boolean':
			return o == n;
			
		case 'number':
			return 1 * o == 1 * n;
			
		case 'string':
			
			if(Object.isDate(o)){
				return o.format('Y-m-d h:i:s') == n;	
			}
			
			if(!isNaN(1 * o) && !isNaN(1 * n)){
				return 1 * o == 1 * n;
			}
			
			return o == n;
			
		case 'object':
			if(n === null){
				return o == n;	
			}
			
			if(Object.isDate(n)){
				
				if(Object.isString(o)){
					return o == n.format('Y-m-d h:i:s');	
				}
				
				return o.format('Ymdhis') == n.format('Ymdhis');	
			}
			
			if(Object.isArray(n)){
				return Object.toJSON(o) == Object.toJSON(n);
			}
						
			return Object.toJSON(o) == Object.toJSON(n);
	}
				
};

$.Form = Extends.form