/**
 * Création de champ pour rechercher une ville
 **/
function InputVille(){
	
	var inp = new InputCompleter({
		link: 		$S.link,
		parameters: 'cmd=ville.france.search',
		button:		false
	});
	
	inp.on('draw', function(line){
		line.setText(line.data.Ville_Nom + ', ' + line.data.Ville_CP + ' (<i>'  + line.data.Ville_Dep + '</i>)');
	});
	
	inp.on('change', function(value, line){
		this.Value(line.data.Ville_Nom);
	});
	
	inp.setInputCP = function(input){
		this.on('change', function(value, line){
			input.Value(line.data.Ville_CP);
		});
		input.on('change', function(value, line){
			inp.Value(line.data.Ville_Nom);
		})
	};
	return inp;
}

function InputCP(){
	
	var inp = new InputCompleter({
		link: 		$S.link,
		parameters: 'cmd=ville.france.search',
		button:		false
	});
	
	inp.on('draw', function(line){
		line.setText(line.data.Ville_CP + ', ' + line.data.Ville_Nom + ' (<i>'  + line.data.Ville_Dep + '</i>)');
	});
	
	inp.on('change', function(value, line){
		this.Value(line.data.Ville_CP);
	});
	
	inp.setInputVille = function(input){
		this.on('change', function(value, line){
			input.Value(line.data.Ville_Nom);
		});
		input.on('change', function(value, line){
			inp.Value(line.data.Ville_CP);
		})
	};
	
	return inp;
}