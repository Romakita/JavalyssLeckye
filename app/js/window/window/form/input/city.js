/** section: Form
 * class InputCity < InputCompleter
 * Cette classe retourne une liste de ville en fonction du mot saisie. La classe doit être configurer vers une page du serveur contenant une base de données de ville.
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * <li><span>PHP</span></li>
 * </ul>
 * <div>
 * <h4>Exemple 1 :</h4>
 * <p>Cette exemple montre comment créer une instance InputCity en Javascript :</p>
 *
 *     var inputCity = InputCity({parameters:'cmd=getcities', link:'city.php'});
 *     document.body.appendChild(inputCity);
 * 
 * <h4>Exemple 2 :</h4>
 * <p>Une instance InputCity peut être assosiciée à une instance [[InputCP]] grâce à la méthode <code>linkTo</code>. Cette fonctionnalité permet d'assigner automatiquement le Code postal
 * d'une ville recherchée dans une instance InputCity vers une l'instance [[InputCP]] associé.</p>
 * <p>Cette exemple montre comment associer une instance InputCity à une instance [[InputCP]] :</p>
 *
 *     var inputCity = InputCity({parameters:'cmd=getcities', link:'city.php'});
 *     var inputCP = InputCP({parameters:'cmd=getcities.bycp', link:'city.php'});
 *     inputCity.linkTo(InputCP);
 *     document.body.appendChild(inputCity);
 *     document.body.appendChild(inputCP);
 *
 * </div>
 *
 * <div>
 * <h4>Exemple 1 :</h4>
 * <p>Cette exemple montre comment créer une instance InputCity en HTML5 :</p>
 *
 *     <input type="box-city" data-link="city.php" data-parameters="cmd=getcities">
 * 
 * <h4>Exemple 2 :</h4>
 * <p>Une instance InputCity peut être assosicié à une instance [[InputCP]] grâce à l'attribut data <code>data-linkto</code>. Cette fonctionnalité permet d'assigner automatiquement le Code postal
 * d'une ville recherchée dans une instance InputCity vers une l'instance [[InputCP]] associée.</p>
 * <p>Cette exemple montre comment associer une instance InputCity à une instance [[InputCP]] :</p>
 *
 *     <input type="box-city mycity" data-link="city.php" data-parameters="cmd=getcities">
 *     <input type="box-cp" data-link="city.php" data-parameters="cmd=getcities.bycp" data-linkto="mycity">
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment renvoyer la liste des villes vers l'instance InputCity via PHP :</p>
 * 
 *     <?php
 *     $cities = array(
 *          array(
 *               'City_ID'=>'1',
 *               'County'=>'Ain',
 *               'City'=>'L\'Abergement Clémenciat',
 *               'CP'=>'01400'
 *          ),
 *          array(
 *               'City_ID'=>'2',
 *               'County'=>'Ain',
 *               'City'=>'L\'Abergement-de-Varey',
 *               'CP'=>'01640'
 *          ),
 *          array(
 *               'City_ID'=>'3',
 *               'County'=>'Ain',
 *               'City'=>'Amareins',
 *               'CP'=>'01090'
 *          ),
 *          array(
 *               'City_ID'=>'4',
 *               'County'=>'Ain',
 *               'City'=>'Ambérieu-en-Bugey',
 *               'CP'=>'01500'
 *          ),
 *          array(
 *               'City_ID'=>'5',
 *               'County'=>'Ain',
 *               'City'=>'Ambérieux-en-Dombes',
 *               'CP'=>'01330'
 *               ),
 *          );
 *     //
 *     switch($_POST['cmd']){
 *          case 'getcities':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['City'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance InputCity
 *               echo json_encode($final);
 *               break;
 *     
 *          case 'getcities.bycp':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['CP'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance InputCity
 *               echo json_encode($final);
 *               break;
 *          default: echo "erreur de commande";
 *     }
 *     ?>
 *
 * </div>
 * </div>
 *
 * #### Résultat en mode local
 * 
 * <p>Saisissez les premières lettres "AM" pour effectuer une recherche :</p>
 *
 * <input type="text" class="exemple-completer-city" value="" />
 *
 *
 * <p class="note">Pour plus d'explication sur le mode local rendez-vous sur la classe [[InputCompleter]].</p> 
 * 
 **/
function InputCity(obj){
	
	var options = {
		parameters: 'cmd=city.list',
		button:		false
	};
	
	if(!Object.isUndefined(obj)){
		Object.extend(options, obj);	
	}
	
	var inp = new InputCompleter(options);
	
	inp.on('draw', function(line){
		var name = 		Object.isUndefined(line.data.Nom) ? line.data.City : line.data.Nom;
		var county = 	Object.isUndefined(line.data.Departement) ? line.data.County : line.data.Departement;
		line.setText(name + ', ' + line.data.CP + ' (<i>'  + county + '</i>)');
	});
	
	inp.on('change', function(value, line){
		this.Value(Object.isUndefined(line.data.Nom) ? line.data.City : line.data.Nom);
	});
/** related to: InputCP
 * InputCity#linkTo(inputCP) -> void
 * - inputCP (InputCP): Instance à associer.
 * 
 * Cette méthode permet de créer une association entre deux instances [[InputCity]] et [[InputCP]].
 **/	
	inp.linkTo = inp.setInputCP = function(input){
		this.on('change', function(value, line){
			input.Value(line.data.CP);
		});
		input.on('change', function(value, line){
			inp.Value(Object.isUndefined(line.data.Nom) ? line.data.City : line.data.Nom);
		})
	};
	return inp;
};
/** section: Form
 * class InputCP < InputCompleter
 * Cette classe recherche une liste de ville à partir du code postal saisie par l'utilisateur dans le champ de saisie.
 *
 * #### Exemple
 *
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * <li><span>PHP</span></li>
 * </ul>
 * <div>
 * <h4>Exemple 1 :</h4>
 * <p>Cette exemple montre comment créer une instance InputCP en Javascript :</p>
 *
 *     var InputCP = InputCP({parameters:'cmd=getcities.bycp', link:'city.php'});
 *     document.body.appendChild(InputCP);
 * 
 * <h4>Exemple 2 :</h4>
 * <p>Une instance InputCP peut être assosiciée à une instance [[InputCP]] grâce à la méthode <code>linkTo</code>. Cette fonctionnalité permet d'assigner automatiquement le Code postal
 * d'une ville recherchée dans une instance InputCity vers une l'instance [[InputCP]] associé.</p>
 * <p>Cette exemple montre comment associer une instance InputCity à une instance [[InputCP]] :</p>
 *
 *     var inputCity = InputCity({parameters:'cmd=getcities', link:'city.php'});
 *     var inputCP = InputCP({parameters:'cmd=getcities.bycp', link:'city.php'});
 *     inputCity.linkTo(InputCP);
 *     document.body.appendChild(inputCity);
 *     document.body.appendChild(inputCP);
 *
 * </div>
 *
 * <div>
 * <h4>Exemple 1 :</h4>
 * <p>Cette exemple montre comment créer une instance InputCity en HTML5 :</p>
 *
 *     <input type="box-cp" data-link="city.php" data-parameters="cmd=getcities">
 * 
 * <h4>Exemple 2 :</h4>
 * <p>Une instance InputCity peut être assosicié à une instance [[InputCP]] grâce à l'attribut data <code>data-linkto</code>. Cette fonctionnalité permet d'assigner automatiquement le Code postal
 * d'une ville recherchée dans une instance InputCity vers une l'instance [[InputCP]] associée.</p>
 * <p>Cette exemple montre comment associer une instance InputCity à une instance [[InputCP]] :</p>
 *
 *     <input type="box-city mycity" data-link="city.php" data-parameters="cmd=getcities">
 *     <input type="box-cp" data-link="city.php" data-parameters="cmd=getcities.bycp" data-linkto="mycity">
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment renvoyer la liste des villes vers l'instance InputCity via PHP :</p>
 * 
 *     <?php
 *     $cities = array(
 *          array(
 *               'City_ID'=>'1',
 *               'County'=>'Ain',
 *               'City'=>'L\'Abergement Clémenciat',
 *               'CP'=>'01400'
 *          ),
 *          array(
 *               'City_ID'=>'2',
 *               'County'=>'Ain',
 *               'City'=>'L\'Abergement-de-Varey',
 *               'CP'=>'01640'
 *          ),
 *          array(
 *               'City_ID'=>'3',
 *               'County'=>'Ain',
 *               'City'=>'Amareins',
 *               'CP'=>'01090'
 *          ),
 *          array(
 *               'City_ID'=>'4',
 *               'County'=>'Ain',
 *               'City'=>'Ambérieu-en-Bugey',
 *               'CP'=>'01500'
 *          ),
 *          array(
 *               'City_ID'=>'5',
 *               'County'=>'Ain',
 *               'City'=>'Ambérieux-en-Dombes',
 *               'CP'=>'01330'
 *               ),
 *          );
 *     //
 *     switch($_POST['cmd']){
 *          case 'getcities':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['City'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance InputCity
 *               echo json_encode($final);
 *               break;
 *     
 *          case 'getcities.bycp':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['CP'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance InputCity
 *               echo json_encode($final);
 *               break;
 *          default: echo "erreur de commande";
 *     }
 *     ?>
 *
 * </div>
 * </div>
 *
 * #### Résultat en mode local
 * 
 * <p>Saisissez les premiers chiffres "01" pour effectuer une recherche :</p>
 * <input type="text" class="exemple-completer-cp" value="" />
 *
 *
 * <p class="note">Pour plus d'explication sur le mode local rendez-vous sur la classe [[InputCompleter]].</p> 
 *
 **/
function InputCP(obj){
	var options = {
		parameters: 'cmd=city.list',
		button:		false
	};
	
	if(!Object.isUndefined(obj)){
		Object.extend(options, obj);	
	}
	
	var inp = new InputCompleter(options);
	
	inp.on('draw', function(line){
		var name = 		Object.isUndefined(line.data.Nom) ? line.data.City : line.data.Nom;
		var county = 	Object.isUndefined(line.data.Departement) ? line.data.County : line.data.Departement;
		line.setText(line.data.CP + ', ' + name + ' (<i>'  + county + '</i>)');
	});
	
	inp.on('change', function(value, line){
		this.Value(line.data.CP);
	});
/** related to: InputCity
 * InputCP#linkTo(inputCity) -> void
 * - InputCity (InputCity): Instance à associer.
 * 
 * Cette méthode permet de créer une association entre deux instances [[InputCity]] et [[InputCP]].
 **/
	inp.linkTo = inp.setInputCity = function(input){
		this.on('change', function(value, line){
			input.Value(Object.isUndefined(line.data.Nom) ? line.data.City : line.data.Nom);
		});
		input.on('change', function(value, line){
			inp.Value(line.data.CP);
		})
	};
	
	return inp;
};
/**
 * InputCity.Transform(node) -> Select
 * InputCity.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance InputCity.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[InputCity]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * <li><span>PHP</span></li>
 * </ul>
 * <div>
 * <h4>Exemple 1 :</h4>
 * <p>Cette exemple montre comment créer une instance InputCity en Javascript :</p>
 *
 *     var inputCity = InputCity({parameters:'cmd=getcities', link:'city.php'});
 *     document.body.appendChild(inputCity);
 * 
 * <h4>Exemple 2 :</h4>
 * <p>Une instance InputCity peut être assosiciée à une instance [[InputCP]] grâce à la méthode <code>linkTo</code>. Cette fonctionnalité permet d'assigner automatiquement le Code postal
 * d'une ville recherchée dans une instance InputCity vers une l'instance [[InputCP]] associé.</p>
 * <p>Cette exemple montre comment associer une instance InputCity à une instance [[InputCP]] :</p>
 *
 *     var inputCity = InputCity({parameters:'cmd=getcities', link:'city.php'});
 *     var inputCP = InputCP({parameters:'cmd=getcities.bycp', link:'city.php'});
 *     inputCity.linkTo(InputCP);
 *     document.body.appendChild(inputCity);
 *     document.body.appendChild(inputCP);
 *
 * </div>
 *
 * <div>
 * <h4>Exemple 1 :</h4>
 * <p>Cette exemple montre comment créer une instance InputCity en HTML5 :</p>
 *
 *     <input type="box-city" data-link="city.php" data-parameters="cmd=getcities">
 * 
 * <h4>Exemple 2 :</h4>
 * <p>Une instance InputCity peut être assosicié à une instance [[InputCP]] grâce à l'attribut data <code>data-linkto</code>. Cette fonctionnalité permet d'assigner automatiquement le Code postal
 * d'une ville recherchée dans une instance InputCity vers une l'instance [[InputCP]] associée.</p>
 * <p>Cette exemple montre comment associer une instance InputCity à une instance [[InputCP]] :</p>
 *
 *     <input type="box-city mycity" data-link="city.php" data-parameters="cmd=getcities">
 *     <input type="box-cp" data-link="city.php" data-parameters="cmd=getcities.bycp" data-linkto="mycity">
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment renvoyer la liste des villes vers l'instance InputCity via PHP :</p>
 * 
 *     <?php
 *     $cities = array(
 *          array(
 *               'City_ID'=>'1',
 *               'County'=>'Ain',
 *               'City'=>'L\'Abergement Clémenciat',
 *               'CP'=>'01400'
 *          ),
 *          array(
 *               'City_ID'=>'2',
 *               'County'=>'Ain',
 *               'City'=>'L\'Abergement-de-Varey',
 *               'CP'=>'01640'
 *          ),
 *          array(
 *               'City_ID'=>'3',
 *               'County'=>'Ain',
 *               'City'=>'Amareins',
 *               'CP'=>'01090'
 *          ),
 *          array(
 *               'City_ID'=>'4',
 *               'County'=>'Ain',
 *               'City'=>'Ambérieu-en-Bugey',
 *               'CP'=>'01500'
 *          ),
 *          array(
 *               'City_ID'=>'5',
 *               'County'=>'Ain',
 *               'City'=>'Ambérieux-en-Dombes',
 *               'CP'=>'01330'
 *               ),
 *          );
 *     //
 *     switch($_POST['cmd']){
 *          case 'getcities':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['City'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance InputCity
 *               echo json_encode($final);
 *               break;
 *     
 *          case 'getcities.bycp':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['CP'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance InputCity
 *               echo json_encode($final);
 *               break;
 *          default: echo "erreur de commande";
 *     }
 *     ?>
 *
 * </div>
 * </div>
 *
 * #### Résultat en mode local
 * 
 * <p>Saisissez les premières lettres "AM" pour effectuer une recherche :</p>
 *
 * <input type="text" class="exemple-completer-city" value="" />
 *
 *
 * <p class="note">Pour plus d'explication sur le mode local rendez-vous sur la classe [[InputCompleter]].</p> 
 *
 **/
InputCity.Transform = function(e){
	
	if(Object.isElement(e)){
				
		var node = 	new InputCity({
			link:		e.data('link') == null ? $WR().getGlobals('link') : e.data('link'),
			parameters: e.data('parameters') == null ? 'cmd=city.list' : e.data('parameters'),
			delay:		0
		});
		
		if(e.data('linkto') != null) {
			var friend = $$('.'+e.data('linkto'));
			if(friend.length){
				node.linkTo(friend[0]);
			}
		}
		
		node.id = 			e.id;
		node.Input.name = 	e.name;
		node.Input.value =	e.value;
		node.title = 		e.title;
		
		if(e.maxLength > 0){
			node.Input.maxLength = 	e.maxLength;
		}
		
		node.addClassName(e.className);
		e.className = '';
		
		node.removeClassName('box-city');
		
		node.Value(node.Input.value);
			
		e.replaceBy(node);	
		
		return node;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(InputCity.Transform(e));
	});
	
	return options;
};
/**
 * InputCP.Transform(node) -> Select
 * InputCP.Transform(selector) -> void
 * - node (Element): Element HTML à convertir en instance InputCP.
 * - selector (String): Selecteur CSS.
 *
 * Cette méthode convertie toutes les balises répondant au critère de `selector` en instance [[InputCP]].
 *
 * #### Exemple
 *
 * <div class="box-tab-control">
 * <ul>
 * <li><span>JavaScript</span></li>
 * <li><span>HTML</span></li>
 * <li><span>PHP</span></li>
 * </ul>
 * <div>
 * <h4>Exemple 1 :</h4>
 * <p>Cette exemple montre comment créer une instance InputCP en Javascript :</p>
 *
 *     var InputCP = InputCP({parameters:'cmd=getcities.bycp', link:'city.php'});
 *     document.body.appendChild(InputCP);
 * 
 * <h4>Exemple 2 :</h4>
 * <p>Une instance InputCP peut être assosiciée à une instance [[InputCP]] grâce à la méthode <code>linkTo</code>. Cette fonctionnalité permet d'assigner automatiquement le Code postal
 * d'une ville recherchée dans une instance InputCity vers une l'instance [[InputCP]] associé.</p>
 * <p>Cette exemple montre comment associer une instance InputCity à une instance [[InputCP]] :</p>
 *
 *     var inputCity = InputCity({parameters:'cmd=getcities', link:'city.php'});
 *     var inputCP = InputCP({parameters:'cmd=getcities.bycp', link:'city.php'});
 *     inputCity.linkTo(InputCP);
 *     document.body.appendChild(inputCity);
 *     document.body.appendChild(inputCP);
 *
 * </div>
 *
 * <div>
 * <h4>Exemple 1 :</h4>
 * <p>Cette exemple montre comment créer une instance InputCity en HTML5 :</p>
 *
 *     <input type="box-cp" data-link="city.php" data-parameters="cmd=getcities">
 * 
 * <h4>Exemple 2 :</h4>
 * <p>Une instance InputCity peut être assosicié à une instance [[InputCP]] grâce à l'attribut data <code>data-linkto</code>. Cette fonctionnalité permet d'assigner automatiquement le Code postal
 * d'une ville recherchée dans une instance InputCity vers une l'instance [[InputCP]] associée.</p>
 * <p>Cette exemple montre comment associer une instance InputCity à une instance [[InputCP]] :</p>
 *
 *     <input type="box-city mycity" data-link="city.php" data-parameters="cmd=getcities">
 *     <input type="box-cp" data-link="city.php" data-parameters="cmd=getcities.bycp" data-linkto="mycity">
 *
 * </div>
 *
 * <div>
 * <p>Cette exemple montre comment renvoyer la liste des villes vers l'instance InputCity via PHP :</p>
 * 
 *     <?php
 *     $cities = array(
 *          array(
 *               'City_ID'=>'1',
 *               'County'=>'Ain',
 *               'City'=>'L\'Abergement Clémenciat',
 *               'CP'=>'01400'
 *          ),
 *          array(
 *               'City_ID'=>'2',
 *               'County'=>'Ain',
 *               'City'=>'L\'Abergement-de-Varey',
 *               'CP'=>'01640'
 *          ),
 *          array(
 *               'City_ID'=>'3',
 *               'County'=>'Ain',
 *               'City'=>'Amareins',
 *               'CP'=>'01090'
 *          ),
 *          array(
 *               'City_ID'=>'4',
 *               'County'=>'Ain',
 *               'City'=>'Ambérieu-en-Bugey',
 *               'CP'=>'01500'
 *          ),
 *          array(
 *               'City_ID'=>'5',
 *               'County'=>'Ain',
 *               'City'=>'Ambérieux-en-Dombes',
 *               'CP'=>'01330'
 *               ),
 *          );
 *     //
 *     switch($_POST['cmd']){
 *          case 'getcities':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['City'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance InputCity
 *               echo json_encode($final);
 *               break;
 *     
 *          case 'getcities.bycp':
 *               $final = array();
 *               foreach($cities as $value){
 *                    if(strpos($value['CP'], $_POST['word']) !== true){
 *                         array_push($final, $value);
 *                    }
 *               }
 *               //
 *               //la liste des villes est encodé au format JSON et est renvoyée vers l'instance InputCity
 *               echo json_encode($final);
 *               break;
 *          default: echo "erreur de commande";
 *     }
 *     ?>
 *
 * </div>
 * </div>
 *
 * #### Résultat en mode local
 * 
 * <p>Saisissez les premiers chiffres "01" pour effectuer une recherche :</p>
 * <input type="text" class="exemple-completer-cp" value="" />
 *
 *
 * <p class="note">Pour plus d'explication sur le mode local rendez-vous sur la classe [[InputCompleter]].</p> 
 *
 **/
InputCP.Transform = function(e){
	
	if(Object.isElement(e)){
				
		var node = 	new InputCP({
			link:		e.data('link') == null ? $WR().getGlobals('link') : e.data('link'),
			parameters: e.data('parameters') == null ? 'cmd=city.list' : e.data('parameters'),
			delay:		0
		});
		
		if(e.data('linkto') != null) {
			var friend = $$('.'+e.data('linkto'));
			if(friend.length){
				node.linkTo(friend[0]);
			}
		}
		
		node.id = 			e.id;
		node.Input.name = 	e.name;
		node.Input.value =	e.value;
		node.title = 		e.title;
		
		if(e.maxLength > 0){
			node.Input.maxLength = 	e.maxLength;
		}
		
		node.addClassName(e.className);
		e.className = '';
		
		node.removeClassName('box-cp');
		
		node.Value(node.Input.value);
			
		e.replaceBy(node);	
		
		return node;
	}
	
	var options = [];
	$$(e).each(function(e){
		options.push(InputCP.Transform(e));
	});
	
	return options;
};