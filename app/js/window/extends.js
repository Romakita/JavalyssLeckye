/*
 * ExtWinJS
 *
 *  Extends et Window JS sont deux bibliothèques apportant respectivement des outils pour le développement
 *  d'applications.
 *
 *  #### Extends JS
 *
 *  Cette bibliothèque ajoute toutes les méthodes de bases pour le traitement des données et le support des élements
 *  de base comme la classe [[Node]]. Extends ce découpe en deux sections :
 *
 *  * [[lang]] : Ajout des méthodes de bases au langage Javascript
 *  * [[DOM]] : Ajout élément de base au DOM.
 *
 *  #### Window JS
 *
 *  Cette bibliothèque est un gestionnaire de fenêtre et de formualaire complet. Elle apporte tous les éléments
 *  pour concevoir une application graphique web basé sur des fenêtres et des formulaires. Elle permet donc
 *  de développer rapidement de grosse application professionnel pour le web.
 *
 **/

/**
 * Extends
 * Cette classe est le noyau de la bibliothèque Extends. Elle vérifie la précondition de chargement de la bibliothèque.
 * Cette précondition et la version du prototype requis pour ce lancer (voir `Extends::REQUIRED_PROTOTYPE`).
 * Ces autres fonctions sont de s'occuper du chargement des outils externes à la bibliothèque (comme Window JS) et
 * le chargement du gestionnaire de langage Multilingue.
 **/
var Extends = {
    /**
     * Extends.Version -> String
     * Indique la version de la bibliothèque extends (read-only)
     **/
    Version: 			'5.0',
    /**
     * Extends.REQUIRED_VERSION -> String
     * Indique la version minimal de protype.js
     **/
    REQUIRED_PROTOTYPE: '1.7',
    /**
     * Extends.URL -> String
     * Url de la page en cours d'éxécution
     **/
    URL: 				'',
    /**
     * Extends.PATH -> String
     * Lien du dossier de la bibliothèque extends (accessible après chargement de la bibliothèque)
     **/
    PATH:				'',
    callbacks:			{},
    imported:			[],
    globals:            {},
    /**
     * Extends.setGlobals(key, value) -> WindowRegister
     * - key (String): Nom de la clef à stocker.
     * - value (Mixed): Valeur de la clef.
     *
     * Cette méthode permet de stocker des données globales.
     **/
    setGlobals:function(key, value){
        if(this.globals){
            switch(key){
                default:
                    this.globals[key] = value;
                    break;
                case 'link':
                    this.globals.link = value;
                    break;
                case 'parameters':
                    if(Object.isString(value)){
                        var explode = value.split('&');
                        var obj = {};
                        for(var i = 0; i < explode.length; i++){
                            var param = explode.split('=');
                            obj[param[0]] = param[1];
                        }

                        value = obj;
                    }

                    Object.extend(this.globals.parameters, value);

                    this.STRING_POST_PHP = this.getGlobals('parameters');

                    break;
            }
        }

        return this;
    },
    /**
     * Extends.getGlobals(key) -> Mixed
     * - key (String): Nom de la clef stockée.
     *
     * Cette méthode permet récuperer une valeur en fonction du paramètre [[key]].
     **/
    getGlobals:function(k, bool){

        if(k == 'parameters' && !bool){
            var parameters = '';
            var f = true;
            for(var key in this.globals.parameters){
                if(f){
                    f = false;
                }else{
                    parameters += '&';
                }

                parameters += key + '=' + this.globals.parameters[key];
            }
            return parameters;
        }

        return this.globals[k];
    },
    /**
     * Extends.fire(eventName) -> void
     * - eventName (String): Nom de l'événement à exécuter.
     *
     * Execute un nom d'événement enregistré dans le gestion des événements d'Extends.
     **/
    fire: function(eventName){

        if(!Object.isUndefined(this.callbacks[eventName])){

            var properties = 	$A(arguments);
            var args = 			[];

            for(var i = 1, len = properties.length; i < len; i++){
                args.push(properties[i]);
            }

            this.callbacks[eventName].each(function(callback){
                if(Object.isFunction(callback)){
                    try{
                        callback.apply('', args);
                    }catch(er){console.log(er)}
                }
            });
        }
    },
    /**
     * Extends.fontAvailable(fontName [, fakefont]) -> void
     * - fontName (String): Nom de la police à tester.
     *
     * Choississez une police standard à tester. La méthode vérifiera si l'élément sera bien rendu dans la police standard ou non.
     *
     * #### Exemple
     *
     * Nous souhaitons savoir si la police Segeo UI existe sur le poste client.
     * L'élément `span` possède les propriétés suivantes `span{font-family:'Segeo UI', verdana;}`
     *
     * On teste donc la police `verdana` pour savoir si `Segeo UI` est bien chargé.
     *
     **/
    fontAvailable: function(fontName, fakeFont) {
        var dimension1;

        if(Object.isUndefined(fakeFont)) fakeFont = '__FAKEFONT__';

        // prepare element, and append to DOM
        var element = new Node('span', {style:'visibility:hidden; position:absolute;top:-10000px;left:-10000px;'}, 'abcdefghijklmnopqrstuvwxyz');
        $Body.appendChild(element);

        // get the width/height of element after applying a fake font
        element.setStyle('font-family:' + fakeFont);
        dimension1 = element.getDimensions();
        // set test font
        element.setStyle('font-family:' + fontName);
        dimension2 = element.getDimensions();

        return dimension1.width !== dimension2.width || dimension1.height !== dimension2.height;
    },
    /**
     * Extends.fixScroll() -> void
     *
     * Cette méthode permet de fixer l'arrière plan du site pour les interfaces Tactiles.
     **/
    fixScroll: function(){
        if(document.navigator.touchevent){

            document.observe('touchstart', function(event){
                document.HasScrolled = false;
            });

            document.observe('touchmove', function(event){

                var c = event.target;

                while(!Object.isUndefined(c)){
                    if(c.className.match(/iscroll/)){
                        document.HasScrolled = true;
                        return;
                    }
                    if(c.parentNode){
                        c = c.parentNode;
                    }else{
                        break;
                    }
                }

                Event.stop(event);

                return false;
            });

            // Scroll to top and set viewport dimensions. Useful tips from http://24ways.org/2011/raising-the-bar-on-mobile
            var supportOrientation = typeof window.orientation != 'undefined',
                getScrollTop = function(){
                    return window.pageYOffset || document.compatMode === 'CSS1Compat' && document.documentElement.scrollTop || document.body.scrollTop || 0;
                },
                scrollTop = function(){
                    if (!supportOrientation) return;
                    document.body.style.height = screen.height + 'px';
                    setTimeout(function(){
                        window.scrollTo(0, 1);
                        var top = getScrollTop();
                        window.scrollTo(0, top === 1 ? 0 : 1);
                        document.body.style.height = window.innerHeight + 'px';
                    }, 1);
                };

            if (supportOrientation){
                window.onorientationchange = scrollTop;
            }

            scrollTop();
        }
    },
    /**
     * Extends.fixDragnDrop() -> void
     *
     * Cette méthode permet de bloquer la redirection de la page lors d'un drag'n'drop de fichier dans la fenetre.
     **/
    fixDragnDrop: function(){
        if(!document.navigator.touchevent){
            Event.observe(window, 'dragover', function (e) {
                e.stop();
                Extends.fire('dragover', e);
                return false;
            });

            Event.observe(window, 'drop', function (e) {
                e.stop();
                Extends.fire('drop', e);
            });
        }
    },
    /**
     * Extends.load( ) -> void
     * Charge la bibliothèque Extends et les bibliothèques externes.
     **/
    load: function() {

        document.HasScrolled = false;

        this.VERSION = this.Version;

        //récupération de l'URL
        Extends.URL = ((""+window.location).split('#')[0]).split('?')[0];

        var file = window.location.pathname.split("/");
        Extends.URL = Extends.URL.replace(file[file.length - 1], '');

        //Création de la fonction permettant de comparer deux numéros de versions.
        function convertVersionString(versionString){
            var r = versionString.split('.');
            return parseInt(r[0])*100000 + parseInt(r[1])*1000 + parseInt(r[2]);
        }

        //vérification de la version de prototype
        if(		(typeof Prototype=='undefined')
            || 	(typeof Element == 'undefined')
            || 	(typeof Element.Methods=='undefined')
            || 	(convertVersionString(Prototype.Version) <  convertVersionString(Extends.REQUIRED_PROTOTYPE))){

            throw("Extends requires the Prototype JavaScript framework >= " + Extends.REQUIRED_PROTOTYPE);
        }

        if(Prototype.Version >= '1.7'){
            Extends.toJSON_ = Object.toJSON;
            Object.toJSON = function(e){
                var str = Extends.toJSON_(e);
                if(Object.isString(str)){
                    if(str.match(/^"{/)){
                        return str.evalJSON();
                    }
                }
                return  str;
            };
        }

        //récupération des scripts
        document.findScript('extends').each(function(s) {

            var path = 		s.src.replace(/extends\.js(\?.*)?$/,'');
            var mod = 		s.src.match(/\?.*package=([a-z,]*)/);
            var wparam =	s.src.match(/\?.*wparam=([a-z,]*)/);
            var includes = 	s.src.match(/\?.*import=([a-z,]*)/);
            var lang = 		s.src.match(/\?.*lang=([a-z,]*)/);

            Extends.PATH = path;
            //
            //Importation des librairies minimales
            //

            Import("extends.lang.class", !Object.isUndefined(Class.from));
            Import("extends.lang.promise", !Object.isUndefined($.Promise));
            Import("extends.lang.http", !Object.isUndefined($.http));
            Import("extends.lang.date", !Object.isUndefined(Date.format));
            Import("extends.lang.number", !Object.isUndefined(Number.format));
            Import("extends.lang.observer", !Object.isUndefined($.Observer));
            Import("extends.lang.string", !Object.isUndefined(String.format));
            Import("extends.lang.timer", !Object.isUndefined($.Timer));
            Import("extends.lang.form", !Object.isUndefined($.Form));

            Import("extends.dom.*");

            if(mod){
                if(mod) mod[1].split(',').each(
                    function(p) {
                        Import('extends.' + p);
                    }
                );
            }

            //chargement des bibliothèques externes
            if(includes) includes[1].split(',').each(
                function(include) {

                    if(include == 'window' && wparam){
                        document.include(path+include+'.js?import=' + wparam[1]);
                    }else{
                        document.include(path+include+'.js');
                    }
                }
            );

            if(lang =='' || lang == null) lang = "fr";
            else lang = lang[1];

            MUI.setLang(lang);
        });
        //récupération des scripts
        document.findScript('extends\.min').each(function(s) {

            var path = 		s.src.replace(/extends\.min\.js(\?.*)?$/,'');
            var mod = 		s.src.match(/\?.*package=([a-z,]*)/);
            var wparam =	s.src.match(/\?.*wparam=([a-z,]*)/);
            var includes = 	s.src.match(/\?.*import=([a-z,]*)/);
            var lang = 		s.src.match(/\?.*lang=([a-z,]*)/);

            Extends.PATH = 		path;
            Extends.Minified = 	true;
            //
            //Importation des librairies minimales
            //
            if(mod){
                if(mod) mod[1].split(',').each(
                    function(p) {
                        Import('extends.' + p);
                    }
                );
            }

            //chargement des bibliothèques externes
            if(includes) includes[1].split(',').each(
                function(include) {

                    if(include == 'window' && wparam){
                        document.include(path+include+'.js?import=' + wparam[1]);
                    }else{
                        document.include(path+include+'.js');
                    }
                }
            );

            if(lang =='' || lang == null) lang = "fr";
            else lang = lang[1];

            MUI.setLang(lang);
        });
    },
    /**
     * Extends.onDomLoaded() -> void
     *
     * Cette méthode est appellée une fois le DOM complètement chargé.
     **/
    onDomLoaded: function(evt){

        //lancement de la detection
        document.navigator.initialize();
        document.navigator.parseGet();

        //chargement du dictionnaire en fonction de la langue
        $Body = document.stage.body = document.body;
        document.stage.getDimensions();

        document.body.getDimensions = 	document.stage.getDimensions.bind(document.stage);
        document.body.getStageHeight =	function(){return document.stage.stageHeight};
        document.body.getStageWidth =	function(){return document.stage.stageWidth};

        document.navigator.writeClass();

        window['on' + $EV('resize')] = function(evt){
            document.stage.getDimensions(evt);
            Extends.fire('resize', evt);
        };

        Extends.fire('dom:loaded', evt);
    },
    /**
     * Extends.observe(eventName, callback) -> undefined
     * - eventName (String): Nom de l'événement.
     * - callback (Function): Fonction lié au nom de l'événement.
     *
     * Enregistre une fonction lié à un nom d'événement dans le gestionnaire d'événement.
     * Cette fonction sera appellé lors du déclenchement de l'événement via `Extends.fire()`.
     *
     **/
    observe: function(eventName, callback){
        if(!Object.isArray(this.callbacks[eventName])){
            this.callbacks[eventName] = [];
        }
        this.callbacks[eventName].push(callback);
    },
    /**
     * Extends.stopObserving(eventName, callback) -> undefined
     * - eventName (String): Nom de l'événement à stopper.
     *
     * Stop un nom d'événement. Toutes les fonctions liées au nom ne seront plus appellés.
     *
     **/
    stopObserving: function(eventName, callback){
        if(Object.isUndefined(this.callbacks[eventName])){
            return;
        }
        var array = this.callbacks[eventName];
        this.callbacks[eventName] = [];

        array.each(function(callback_){
            if(callback_ != callback){
                this.callback[eventName].push(callback_);
            }
        }.bind(this));
    },
    /**
     * Extends.ready(callback) -> void
     * - callback (Function): Fonction lié au nom de l'événement.
     *
     * Cette méthode enregistre un écouteur et sera appellé lorsque la biliothèque JQuery, Extends et le Dom seront complétement chargé.
     *
     **/
    ready: function(callback){
        this.observe('dom:loaded', callback);
    },
    /**
     * Extends.Import(strimport) -> void
     *
     * Cette méthode importe une classe ou un package de la librairie `Extends` en fonction du paramètre `strimport`.
     *
     * #### Exemple
     *
     * Pour importer la librairie `extends.geom` saisissez dans votre script `Import('extends.geom.*')`.
     *
     * Pour importer une classe dans `extends.geom` saisissez dans votre script `Import('extends.geom.point')`.
     *
     * <p class="note">La méthode s'occupe de gérer les doublons d'importations de package ou fichier !</p>
     **/
    Import:function(theimport, bool){

        if(theimport.match(/extends/) && Extends.Minified){
            return;
        }

        if(this.imported.indexOf(theimport) == -1){
            //ajout l'import à la liste des imports
            this.imported.push(theimport);
            //résolution de la chaine et inclusion
            if(!bool || Object.isUndefined(bool)) include(Extends.PATH + theimport.toLowerCase().replace('.*', '').replace(/\./gi, "/") + ".js");
        }
    },
    /**
     * Extends.Imported() -> Array
     *
     * Cette méthode retourne la liste des bibliothèques chargées par [[Extends.Import]].
     **/
    Imported: function(){
        var array = this.imported.clone().sort();
        //var hash = 	this.imported.clone().sort();


        function prioritize(a){
            if(a.length == 0) return false;

            var o = 		[];
            var pattern = 	a[0].split('.')[0];
            var options =	[];

            if(Object.isUndefined(pattern)) return false;

            for(var y = 0; y < a.length; y++){

                if(a[y].match(/\./)){//il y a un point
                    var key =		a[y].split('.')[0];

                    if(pattern == key){//on a un pattern

                        var e = a[y].replace(key + '.', '');
                        if(e == '*'){
                            continue;
                        }

                        options.push(e);
                    }else{	//pas de pattern
                        var obj = {title:pattern, options: options};
                        o.push(obj);

                        obj.options = prioritize(obj.options);

                        options = [];
                        pattern = key;

                        y--;
                    }
                }else{
                    o.push(a[y]);
                }
            }

            if(options.length){
                var obj = {title:pattern, options: options};
                o.push(obj);

                obj.options = prioritize(obj.options);
            }

            return o;
        };

        array = prioritize(array);

        function toHtml(node, level){

            var str = '';

            for(var i = 0; i < node.length; i++){

                switch(typeof node[i]){
                    case 'object':
                        str += '<p class="json-key">' + level + ' ' + node[i].title + '</p>';
                        str += '<ul class="code-pre">' + toHtml(node[i].options, level + '-') + '</ul>';
                        break;
                    case 'string':
                        str += '<li class="code-line">' + level + ' ' + node[i] + '</li>';
                        break;
                }

            }

            return str;
        }

        return toHtml(array, '');
    },
    /*
     * Extends.include(libraryName) -> undefined
     * - libraryName (String): Lien du script JS à inclure.
     *
     * Inclut le fichier JS.
     *
     **/
    include: function(libraryName) {return document.include(libraryName);},
    /**
     * Extends.Path([package]) -> String
     *
     * Cette méthode retourne le dossier d'extends. Si le paramètre `package` contient un nom de dossier alors le lien retourné sera celui du package demandé.
     **/
    Path:function(p){
        switch(p){
            default:			return Extends.PATH;
            case 'external':	return Extends.PATH.replace('window/', '');
        }
    }
};
/** section: DOM, alias of: document.include
 * include(libraryName) -> undefined
 * - libraryName (String): Lien du script JS à inclure.
 *
 * Cette fonction inclut un script JS au DOM.
 **/
function include(libraryName){
    return document.include(libraryName);
}
/** section: DOM, alias of: Extends.Import
 * Import(strimport) -> void
 *
 * Cette méthode importe une classe ou un package de la librairie `Extends` en fonction du paramètre `strimport`.
 *
 * #### Exemple
 *
 * Pour importer la librairie `extends.geom` saisissez dans votre script `Import('extends.geom.*')`.
 *
 * Pour importer une classe dans `extends.geom` saisissez dans votre script `Import('extends.geom.point')`.
 *
 * <p class="note">La méthode s'occupe de gérer les doublons d'importations de package ou fichier !</p>
 **/
function Import(o, b){return Extends.Import(o, b)}
/**
 * MUI
 * Ce module met à disposition un outil simple de traduction de langue. Ce module ce base sur un fichier de traduction et
 * un tableau associatif de mots qui seront remplacé par leurs traductions équivalentes.
 **/
var MUI = {
    /**
     * MUI.lang -> String
     * Indique la langue actuellement chargé par le traducteur.
     **/
    lang:'',
    /**
     * MUI.month -> Object
     * Contient un tableau associatif des langues. Pour chaque langue on associe un tableau de mois qui serviront
     * à la traduction.
     **/
    month:	{
        /*
         * MUI.month.fr -> Array
         * Description des mois dans la langue française.
         **/
        fr:	['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        /*
         * MUI.month.eng -> Array
         * Description des mois dans la langue anglaise.
         **/
        en:['January', 'February', 'Marsh', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    /**
     * MUI.days -> Object
     * Contient un tableau associatif des langues. Pour chaque langue on associe un tableau de jour qui serviront
     * à la traduction.
     **/
    days: 	{
        /*
         * MUI.days.fr -> Array
         * Description des jours dans la langue française.
         **/
        fr:	['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        /*
         * MUI.days.eng -> Array
         * Description des jours dans la langue anglaise.
         **/
        en:['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    /**
     * MUI.text -> Object
     * Contient un tableau associatif des langues. L'objet text contient une liste de mot écrit dans l'application
     * cible et associe leur traduction.
     **/
    text:	{fr:{}, en:{}},
    /**
     * MUI.addWord(key, word, lang) -> void
     * - key (String): Mot clef de l'application cible.
     * - word (String): Traduction du mot clef dans la langue cible.
     * - lang (String): Langue associée à la traduction.
     *
     * Cette méthode ajoute une traduction d'un mot au dictionnaire de mot.
     **/
    addWord:function(key, wordtrad, lang){
        if(Object.isUndefined(lang)){
            lang = this.lang;
        }

        if(Object.isUndefined(this.text[lang])){
            this.text[lang]  = {};
        }

        this.text[lang][key.toLowerCase()] = wordtrad;
    },
    /**
     * MUI.addWords(obj, lang) -> void
     * - obj (Object): Dictionnaire de mot à ajouter.
     * - lang (String): Langue associée à la traduction.
     *
     * Cette méthode ajoute un dictionnaire de mot au dictionnaire courrant.
     *
     * ##### Description du paramètre obj
     *
     * Le paramètre obj doit être décrit de la façon suivante :
     *
     *     var obj = {
 *         'mot cible': 'mot traduit',
 *         'mot cible2': 'mot traduit 2',
 *         //etc...
 *     }
     *
     *
     **/
    addWords: function(obj, lang){
        lang = lang.slice(0,2);

        for(var key in obj){
            this.addWord(key, obj[key], lang);
        }
    },
    /**
     * MUI.translate(word) -> String
     * - word (String): Mot à traduire.
     *
     * Traduit le mot à partir de langue par défaut et de son dictionnaire associé.
     *
     * ##### Exemple
     *
     * Voici un exemple simple d'utilisation :
     *
     *     MUI.addWord('bonjour le monde', 'hello world', 'eng');
     *
     *     MUI.lang = 'eng';
     *     alert(MUI.translate('bonjour le monde')); //hello world
     *     //autre fonction plus rapide à écrire
     *     alert($MUI('bonjour le monde')); //hello world
     *
     **/
    translate: function(text){
        if(this.lang == '' || text == '' || text == null) return text;

        var value = this.text[this.lang][text];

        if(value =='' || Object.isUndefined(value))	{
            value = this.text[this.lang][text.toLowerCase()];
            if(value =='' || Object.isUndefined(value)) return text;
        }
        return value;
    },
    /**
     * MUI.getMonth(it) -> String
     * - it (Number): Numéro du mois.
     *
     * Cette méthode prend en paramètre le numéro du mois entre 0 et 11, et retourne la traduction
     * du mois en fonction de la langue. Si la traduction du mois n'existe pas dans la langue
     * choisie, la méthode retournera la traduction de langue par défaut (Anglais).
     **/
    getMonth: function(i){

        if(!Object.isUndefined(this.month[this.lang])){
            if(i >= 0 && i < 12){
                return this.month[this.lang][i];
            }
        }

        return this.month['en'][i];
    },
    //ignore


    getMonths: function(i){
        return this.month[this.lang].clone();
    },
    /**
     * MUI.getDay(it) -> String
     * - it (Number): Numéro du jour.
     *
     * Cette méthode prend en paramètre le numéro du jours entre 0 et 6, et retourne sa traduction
     * en fonction de la langue. Si la traduction du jour n'existe pas dans la langue
     * choisie, la méthode retournera la traduction de langue par défaut (Anglais).
     **/
    getDay: function(i){

        if(!Object.isUndefined(this.days[this.lang])){
            if(i >= 0 && i < 7){
                return this.days[this.lang][i];
            }
        }

        return this.days['en'][i];
    },

    getDays: function(i){
        return this.days[this.lang].clone();
    },
    /**
     * MUI.setLang(lang) -> void
     * - lang (lang): Langue du dictionnaire.
     *
     * Cette méthode change la langue par défaut du dictionnaire de mot et charge le
     * fichier de traduction associé à la langue dans le dossier de référence
     * (/MUI/LANG_lang.js).
     *
     * Si lang est fr alors le fichier chargé sera FR_fr.js. En théorie le fichier
     * multilingue doit contenir l'ensemble des mots de traduction de l'application
     * cible.
     *
     **/
    setLang: function(lang){
        this.lang = lang.toLowerCase().slice(0,2);
    }
};
/** alias of: MUI.translate, section: lang
 * $MUI(text) -> String
 *
 * Cette fonction permet la traduction de mot vers une langue cible.
 * Cette langue cible est définie par la classe [[MUI]].
 *
 * ##### Exemple
 *
 * Voici un exemple simple d'utilisation :
 *
 *     MUI.addWord('bonjour le monde', 'hello world', 'en');
 *     MUI.lang = 'en';
 *     alert(MUI.translate('bonjour le monde')); //hello world
 *     //autre fonction plus rapide à écrire
 *     alert($MUI('bonjour le monde')); //hello world
 **/
function $MUI(text){
    return MUI.translate(text);
}
/*
 * $_GET
 * Tableau des paramètres GET du script en cours d'execution.
 * var get = $_GET['op'];
 **/
var $_GET = [];
/*
 * $Body
 **/
var $Body = null;

if(!Object.isUndefined(window['jQuery'])){
    /**
     * $J() -> jQuery
     *
     * Alias de la bibliothèque jQuery.
     **/
    $J = $.jQuery = $.noConflict();
}

/**
 * document.findScript(scriptname) -> Array
 * - scriptname (String): Nom du script Javascript à rechercher.
 *
 * Cette méthode rechercher toutes les balises script du DOM ayant comme script JS source `scriptname`.
 **/
document.findScript = function(scriptname){
    var reg = new RegExp(scriptname + "\\.js(\\?.*)?$");

    return $A(this.getElementsByTagName("script")).findAll(
        function(s) {
            return (s.src && s.src.match(reg));
        }
    );
};
/**
 * document.include(libraryName) -> undefined
 * - libraryName (String): Lien du script JS à inclure.
 *
 * Inclut le fichier JS.
 *
 **/
document.include = function(libraryName) {
    // inserting via DOM fails in Safari 2.0, so brute force approach
    this.write('<script type="text/javascript" src="'+libraryName+'"><\/script>');
};
//#pragma Import

//#pragma end
//Chargement d'Extends
$.Extends = Extends;
Extends.load();

document.observe('dom:loaded', Extends.onDomLoaded.bind(Extends));