/** section: jGalery
 * System.jGalery.Libraries
 *
 **/
System.jGalery.Libraries = {
/**
 * System.jGalery.Libraries.options -> Array
 **/	
	options:[
		{text:$MUI('jCarousel 0.2.8'), value:'jcarousel', type:'free', link:'http://sorgalla.com/jcarousel/'},
		{text:$MUI('Brick Array'), value:'brickarray', type:'free', link:'http://javalyss.fr/'},
		{text:$MUI('Nivo Slider'), value:'nivoslider', type:'free', link:'http://dev7studios.com/nivo-slider/'}
	],
/**
 * System.jGalery.Libraries.draw(win, forms, galery) -> TableData
 **/	
	draw: function(win, forms, galery, htmlNode){
		
		var options = this.options;
		
		for(var i = 0; i < options.length; i++){
			forms[options[i].value] = {};
			
			switch(options[i].value){
				case 'jcarousel':
					forms[options[i].value].Table = this.createFormjCarousel(win, forms[options[i].value], galery.Settings);
					break;
										
				case 'nivoslider':
					forms[options[i].value].Table = this.createFormNivoSlider(win, forms[options[i].value], galery.Settings);
					break;
				
				case 'brickarray':
					forms[options[i].value].Table = this.createFormBrickArray(win, forms[options[i].value], galery.Settings);
					break;
			}
			
			if(galery.Type != options[i].value){
				forms[options[i].value].Table.hide();
			}
			
			forms[options[i].value].Table.addClassName('setting-library');
			htmlNode.appendChild(forms[options[i].value].Table);
		}
	},
/**
 * System.jGalery.Libraries.createFormjCarousel(win, forms, setting) -> TableData
 **/
	createFormjCarousel:function(win, forms, setting){
		var flag = win.createFlag();
		
		var o = {
			theme:			'tango',
			"className":	"",
			"vertical":		false,
			"scroll":		"1",
			"start":		"1",
			"animation":	"800",
			"auto":			"10"
		};
		Object.extend(o, setting || {});
		
		forms.theme = 		new Select();
		forms.theme.setData([
			{text:$MUI('Tango'), value:'tango'},
			{text:$MUI('IE7'), value:'ie7'},
			{text:$MUI('Custom'), value:'custom'}
		]);
		
		forms.theme.Value(o.theme);
		
		forms.theme.on('change', function(){
			if(this.Value() == 'custom'){
				forms.className.parentNode.parentNode.show();
			}else{
				forms.className.parentNode.parentNode.hide();
			}
		});
		//
		//
		//
		forms.className = 		new Input({value:o.className || "", maxLength:100, type:'text', style:'width:200px'});
		//
		//
		//
		forms.start = 			new Input({value:o.start, maxLength:3, type:'text', style:'width:50px; text-align:right'});
		//
		//
		//
		forms.scroll = 			new Input({value:o.scroll, maxLength:3, type:'text', style:'width:50px; text-align:right'});
		//
		//
		//
		forms.animation = 		new Input({value:o.animation, maxLength:6, type:'text', style:'width:50px; text-align:right'});
		//
		//
		//
		forms.auto = 			new Input({value:o.auto, maxLength:6, type:'text', style:'width:50px; text-align:right'});
		//
		//
		//
		forms.vertical = 	new ToggleButton({yes:'Ver', no:'Hor'});
		forms.vertical.Value(o.vertical);
		
		var table = new TableData();
		table.addHead($MUI('Thème') + ' : ').addCel(forms.theme, {width:200}).addRow();
		table.addHead($MUI('Saississez le nom du thème') + ' : ').addCel(forms.className, {width:200}).addRow();
		table.addHead($MUI('Orientation') + ' : ').addCel(forms.vertical).addRow();
		table.addHead($MUI('Image de départ') + ' : ').addCel(forms.start).addRow();
		table.addHead($MUI('Nombre d\'image par slide') + ' : ').addCel(forms.scroll).addRow();
		table.addHead($MUI('Rapidité de l\'animation (ms)') + ' : ').addCel(forms.animation).addRow();
		table.addHead($MUI('Temporisation (s)') + ' : ').addCel(forms.auto).addRow();
		
		if(forms.theme.Value() != 'custom'){
			forms.className.parentNode.parentNode.hide();	
		}
		
		flag.add(forms.className, {
			orientation:	Flag.TOP,
			text:			$MUI('Saisissez un nom de classe CSS pour la mise en forme de votre carrousel sur votre site'),
			icon:			'documentinfo',
			color:			'grey'
		});
		
		flag.add(forms.vertical, {
			orientation:	Flag.RIGHT,
			text:			$MUI('Choisissez la direction de défilement des images (Horizontal ou Vertical)'),
			icon:			'documentinfo',
			color:			'grey'
		});
		
		flag.add(forms.start, {
			orientation:	Flag.RIGHT,
			text:			$MUI('Choisissez le numéro de la photo de départ'),
			icon:			'documentinfo',
			color:			'grey'
		});
		
		flag.add(forms.scroll, {
			orientation:	Flag.RIGHT,
			text:			$MUI('Saisissez le nombre d\'image à afficher par slide'),
			icon:			'documentinfo',
			color:			'grey'
		});
		
		flag.add(forms.animation, {
			orientation:	Flag.RIGHT,
			text:			$MUI('Saisissez la rapidité de défilement de l\'animation'),
			icon:			'documentinfo',
			color:			'grey'
		});
		
		flag.add(forms.auto, {
			orientation:	Flag.RIGHT,
			text:			$MUI('Saisissez le temps de pause entre chaque défilement'),
			icon:			'documentinfo',
			color:			'grey'
		});
		
		return table;
	},
/**
 * System.jGalery.Libraries.createFormNivoSlider(win, forms, setting) -> TableData
 **/	
	createFormNivoSlider: function(win, forms, setting){
		var o = {
			themeNS: 			'default', // Specify sets like: 'fold,fade,sliceDown'
       	 	effect: 			'random', // Specify sets like: 'fold,fade,sliceDown'
       	 	slices: 			15, // For slice animations
       	 	boxCols: 			8, // For box animations
       	 	boxRows: 			4, // For box animations
       	 	animSpeed: 			500, // Slide transition speed
       	 	pauseTime: 			3000, // How long each slide will show
       	 	startSlide: 		0, // Set starting Slide (0 index)
       	 	directionNav: 		true, // Next & Prev navigation
        	controlNav: 		true, // 1,2,3... navigation
       		controlNavThumbs: 	false, // Use thumbnails for Control Nav
        	pauseOnHover: 		false, // Stop animation while hovering
			manualAdvance: 		false, // Force manual transitions
        	prevText: 			'Prev', // Prev directionNav text
        	nextText: 			'Next', // Next directionNav text
        	randomStart: 		false // Start on a random slide
    	};
		
		Object.extend(o, setting || {});
		//
		//
		//
		forms.themeNS = 		new Select();
		forms.themeNS.setData([
			{text:$MUI('Défaut'), value:'default'},
			{text:$MUI('Noir'), value:'dark'},
			{text:$MUI('Light'), value:'light'},
			{text:$MUI('Bar'), value:'bar'},
			{text:$MUI('Custom'), value:'custom'}
		]);
		
		forms.themeNS.Value(o.themeNS);
		
		forms.themeNS.on('change', function(){
			if(this.Value() == 'custom'){
				forms.className.parentNode.parentNode.show();
			}else{
				forms.className.parentNode.parentNode.hide();
			}
		});
		
		forms.className = 	new Input({value:o.className || "", maxLength:100, type:'text', style:'width:200px'});
		//
		//
		//
		forms.effect = 			new Select();
		forms.effect.setData([
		    {value:'sliceDown', text:'sliceDown'},
			{value:'sliceDownLeft', text:'sliceDownLeft'},
			{value:'sliceUp', text:'sliceUp'},
			{value:'sliceUpLeft', text:'sliceUpLeft'},
			{value:'sliceUpDown', text:'sliceUpDown'},
			{value:'sliceUpDownLeft', text:'sliceUpDownLeft'},
			{value:'fold', text:'fold'},
			{value:'fade', text:'fade'},
			{value:'random', text:'random'},
			{value:'slideInRight', text:'slideInRight'},
			{value:'slideInLeft', text:'slideInLeft'},
			{value:'boxRandom', text:'boxRandom'},
			{value:'boxRain', text:'boxRain'},
			{value:'boxRainReverse', text:'boxRainReverse'},
			{value:'boxRainGrow', text:'boxRainGrow'},
			{value:'boxRainGrowReverse', text:'boxRainGrowReverse'}
		]);
		
		forms.effect.Value(o.effect);
		//
		//
		//
		forms.slices = 			new Input({value:o.slices, maxLength:3, type:'number', style:'width:50px; text-align:right', decimal:0});
		//
		//
		//
		forms.boxCols = 		new Input({value:o.boxCols, maxLength:3, type:'number', style:'width:50px; text-align:right', decimal:0});
		//
		//
		//
		forms.boxRows = 		new Input({value:o.boxRows, maxLength:3, type:'number', style:'width:50px; text-align:right', decimal:0});
		//
		//
		//
		forms.animSpeed = 		new Input({value:o.animSpeed, maxLength:10, type:'number', style:'width:50px; text-align:right', decimal:0});
		//
		//
		//
		forms.pauseTime = 		new Input({value:o.pauseTime, maxLength:10, type:'number', style:'width:50px; text-align:right', decimal:0});
		//
		//
		//
		forms.startSlide = 		new Input({value:o.startSlide, maxLength:5, type:'number', style:'width:50px; text-align:right', decimal:0});//
		//
		//
		//
		forms.prevText = 		new Input({value:o.prevText, maxLength:100, type:'text'});
		//
		//
		//
		forms.nextText = 		new Input({value:o.nextText, maxLength:100, type:'text'});
		//
		//
		//
		forms.directionNav = 	new ToggleButton();
		forms.directionNav.Value(o.directionNav);
		//
		//
		//
		forms.controlNav = 	new ToggleButton();
		forms.controlNav.Value(o.controlNav);
		//
		//
		//
		forms.controlNavThumbs = 	new ToggleButton();
		forms.controlNavThumbs.Value(o.controlNavThumbs);
		//
		//
		//
		forms.pauseOnHover = 	new ToggleButton();
		forms.pauseOnHover.Value(o.pauseOnHover);
		//
		//
		//
		forms.manualAdvance = 	new ToggleButton();
		forms.manualAdvance.Value(o.manualAdvance);
		//
		//
		//
		forms.randomStart = 	new ToggleButton();
		forms.randomStart.Value(o.randomStart);
		
		var table = new TableData();
		table.addHead($MUI('Thème') + ' : ').addCel(forms.themeNS, {width:200}).addRow();
		table.addHead($MUI('Saississez le nom du thème') + ' : ').addCel(forms.className, {width:200}).addRow();
		
		table.addHead($MUI('Effet de transition') + ' : ').addCel(forms.effect).addRow();
		table.addHead($MUI('Nombre de colonne') + ' : ').addCel(forms.boxCols).addRow();
		table.addHead($MUI('Nombre de ligne') + ' : ').addCel(forms.boxRows).addRow();
		table.addHead($MUI('Rapidité de l\'animation (ms)') + ' : ').addCel(forms.animSpeed).addRow();
		table.addHead($MUI('Temporisation (ms)') + ' : ').addCel(forms.pauseTime).addRow();
		table.addHead($MUI('Pause au survol') + ' : ').addCel(forms.pauseOnHover).addRow();
		
		table.addHead($MUI('Image de départ aléatoire') + ' : ').addCel(forms.randomStart).addRow();
		table.addHead($MUI('Image de départ') + ' : ').addCel(forms.startSlide).addRow();
		
		table.addHead($MUI('Boutons de navigation') + ' : ').addCel(forms.controlNav).addRow();
		table.addHead($MUI('Boutons avec image') + ' : ').addCel(forms.controlNavThumbs).addRow();
		
		table.addHead($MUI('Boutons précèdent & suivant') + ' : ').addCel(forms.directionNav).addRow();
		table.addHead($MUI('Texte bouton précèdent') + ' : ').addCel(forms.prevText).addRow();
		table.addHead($MUI('Texte bouton suivant') + ' : ').addCel(forms.nextText).addRow();
		
		if(forms.themeNS.Value() != 'custom'){
			forms.className.parentNode.parentNode.hide();	
		}
		
		return table;
	},
/**
 * System.jGalery.Libraries.createFormBrickArray(win, forms, setting) -> TableData
 **/	
	createFormBrickArray:function(win, forms, setting){
		
		var o = {
			themeBA:			'white',
			themeLightBox:		'white',
			fixedWidth:			false,
       	 	maxHeight: 			300, // Specify sets like: 'fold,fade,sliceDown'
       	 	maxWidth: 			250, // For slice animations
    	};
		
		Object.extend(o, setting || {});
		
		forms.themeBA = 		new Select();
		forms.themeBA.setData([
			{text:$MUI('Blanc'), value:'white'},
			{text:$MUI('Noir'), value:'black'},
			{text:$MUI('Custom'), value:'custom'}
		]);
		
		forms.themeBA.Value(o.themeBA);
		
		forms.themeBA.on('change', function(){
			if(this.Value() == 'custom'){
				forms.className.parentNode.parentNode.show();
			}else{
				forms.className.parentNode.parentNode.hide();
			}
		});
		
		forms.themeLightBox = 		new Select();
		forms.themeLightBox.setData([
			{text:$MUI('Blanc'), value:'white'},
			{text:$MUI('Noir'), value:'black'}
		]);
		
		forms.themeLightBox.Value(o.themeLightBox);
		
		forms.className = 	new Input({value:o.className || "", maxLength:100, type:'text', style:'width:200px'});
		forms.maxHeight = 	new Input({value:o.maxHeight, maxLength:3, type:'text', style:'width:50px; text-align:right'});
		forms.maxWidth = 	new Input({value:o.maxWidth, maxLength:3, type:'text', style:'width:50px; text-align:right'});
		forms.fixedWidth = 	new ToggleButton();
		forms.fixedWidth.Value(o.fixedWidth);
		
		var table = new TableData();
		table.addHead($MUI('Thème') + ' : ').addCel(forms.themeBA, {width:200}).addRow();
		table.addHead($MUI('Classe CSS') + ' : ').addCel(forms.className, {width:200}).addRow();
		table.addHead($MUI('Thème LightBox') + ' : ').addCel(forms.themeLightBox, {width:200}).addRow();
		table.addHead(' ', {height:9}).addRow();
		table.addHead($MUI('Taille fixe') + ' : ').addCel(forms.fixedWidth).addRow();
		table.addHead($MUI('Hauteur max.') + ' : ').addCel(forms.maxHeight).addRow();
		table.addHead($MUI('Largeur max.') + ' : ').addCel(forms.maxWidth).addRow();
		
		if(forms.themeBA.Value() != 'custom'){
			forms.className.parentNode.parentNode.hide();	
		}
		
		return table;
	}
};