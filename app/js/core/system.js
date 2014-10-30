/**
 * == Core ==
 * Cette section est dédiée au noyau du logiciel Javalyss. Il gère tous les traitements de base du logiciel.
 *
 * Ces gestions de base sont :
 *
 * * Gestion des modules statiques et dynamique
 * * Lancement de l'interface
 * * Gestion des clefs, constantes, utilisateurs du système.
 *
 **/
Import('extends.lang.string.md5');

Import('extends.lang.*');
/** section: Core
 * System
 * Cet espace de nom gère tous les paramètres du système Javalyss. Sa tâche est d'assurer la communication
 * entre Javascript et PHP via AJAX de façon sécurisé.
 **/
var System = {
    /**
     * System.link -> String
     * Lien de la passerelle PHP.
     **/
    link:				'',
    REQUIRED_WINDOW: 	'4.7',
    /**
     * System.VERSION -> String
     * Code de la distribution du logiciel.
     **/
    version: 			'',
    VERSION:			'',
    /**
     * System.PATH -> String
     * Dossier de référence des fichiers JS de la version en cours.
     **/
    PATH:				'',
    /**
     * System.NAME_VERSION -> String
     * Nom de la version du logiciel.
     **/
    NAME_VERSION:	'',
    /**
     * System.NAME_CLIENT -> String
     * Nom du propriétaire de la version en cours.
     **/
    NAME_CLIENT:	'',
    /**
     * System.DATE_VERSION -> String
     * Date de la version de la build.
     **/
    DATE_VERSION:	'',
    /**
     * System.LICENCE_VERSION -> String
     * Type de licence sous lequel s'execute le logiciel.
     **/
    LICENCE_VERSION:'',
    /**
     * System.CONSTRIBUTORS -> String
     * Nom des contributeurs au développement de la distribution.
     **/
    CONSTRIBUTORS: 	'',

    CRON_STARTED: 	false,
    /**
     * System.LINK_DOC_CORE -> String
     * Lien de la documentation du noyau Javalyss côté Javascript.
     **/
    LINK_DOC_CORE:		'http://www.javalyss.fr/wiki/',
    /**
     * System.LINK_DOC_CORE_PHP -> String
     * Lien de la documentation du noyau Javalyss côté PHP.
     **/
    LINK_DOC_CORE_PHP:	'http://www.javalyss.fr/wikiphp/',
    /**
     * System.LINK_DOC_EXTENDS -> String
     * Lien de la documentation de la bibliothèque Extends.
     **/
    LINK_DOC_EXTENDS:	'http://window.javalyss.fr/extends/',
    /**
     * System.LINK_DOC_WINDOW -> String
     * Lien de la documentation de la bibliothèque Window.
     **/
    LINK_DOC_WINDOW:	'http://window.javalyss.fr/window/',
    /**
     * System.AlertBox -> AlertBox
     * Instance de la boite de dialogue principale du système.
     **/
    Alert:		null,
    AlertBox:	null,
    /**
     * System.LightBox -> AlertBox
     * Instance le diaporama principale du système.
     **/
    LightBox:	null,
    /**
     * System.DropMenu -> DropMenu
     * Instance principale du menu.
     **/
    DropMenu:	null,
    /*
     * System.Observer -> Observer
     * Instance du gestionnaire d'événement.
     **/
    Observer:	null,
    /*
     * System.Widgets -> Array
     * Liste des widgets pouvant être ajouté au tableau de bord.
     **/
    Widgets:	null,
    /**
     * @type Boolean
     */
    isInit:		false,
    /**
     * @type Number
     */
    NbNotify:	0,

    URI_PATH:   '',
    /**
     * System.initialize() -> void
     * Cette méthode initialise le système.
     **/
    initialize: function(){

        //#pragma region Instance
        //----------------------------
        //----------------------------
        //----------------------------
        this.Observer = 				new Observer();
        this.Observer.bind(this);
        //
        // Terminal
        //
        this.Terminal = 	new Terminal();
        /**
         * System.trace(message) -> void
         * - message (String): Message à afficher.
         *
         * Affiche un message dans le terminal.
         * Le terminal permet de débugguer un programme s'éxécutant dans le logiciel.
         **/
        this.trace = function(){
            if(this.Meta('MODE_DEBUG')){
                this.Terminal.trace.apply(this.Terminal, $A(arguments));
            }
        }.bind(this);
        //----------------------------
        //----------------------------
        //----------------------------
        this.AlertBox = this.Alert = 	new AlertBox();
        this.AlertBox.box.createFlag();

        this.Flag = 		new Flag();
        this.LightBox = 	new LightBox();
        //#pragma endregion Instance

        //#pragma region Def Function
        try{

            /**
             * System.fire(eventName [, args]) -> void
             * - eventName (String): Nom de l'événement à déclencher.
             * - args (Mixed): Argument à passer au fonction écoutant l'événement.
             *
             * Execute un événement. L'ensemble des écouteurs enregistrés sur le nom de l'événement
             * via la methode [[System.observe]] seront éxécutés.
             *
             **/
            this.fire = 	this.Observer.fire.bind(this.Observer);
            /**
             * System.observe(eventName, callback) -> void
             * - eventName (String): Nom de l'événement à écouter.
             * - callback (Function): Fonction écoutant l'événement.
             *
             * Ajoute un écouteur sur un nom d'événement.
             **/
            this.observe =  this.Observer.observe.bind(this.Observer);
            /**
             * System.observePattern(pattern, callback) -> void
             * - pattern (String): Motif des événéments à écouter.
             * - callback (Function): Fonction écoutant l'événement.
             *
             * Cette méthode observe tous les noms d'événements personnalisés ressemblant au motif `pattern`. La fonction enregistré sera appellé lors de l'utilisation
             * de la méthode [[Observer.fire]] avec comme paramètre le même nom d'événement proche du `pattern`.
             **/
            this.observePattern =  this.Observer.observePattern.bind(this.Observer);
            /** alias of: System.observe
             * System.on(eventName, callback) -> void
             * - eventName (String): Nom de l'événement à écouter.
             * - callback (Function): Fonction écoutant l'événement.
             *
             * Ajoute un écouteur sur un nom d'événement.
             **/
            this.on =		this.Observer.observe.bind(this.Observer);
            /**
             * System.stopObserving(eventName, callback) -> void
             * - eventName (String): Nom de l'événement à stopper.
             * - callback (Function): Fonction écoutant l'événement.
             *
             * Supprime un écouteur sur un nom d'événement.
             **/
            this.stopObserving =  this.Observer.stopObserving.bind(this.Observer);


            //#pragma endregion Def Function

            //lancement de la première action du systeme. Chargement des données.
            Extends.observe('dom:loaded', this.start.bind(System));

        }catch(er){}

        //copie de la methode open et remplacement de cette derniere par la méthode System.open
        window.open_ = window.open;
        window.open = $S.open;

        this.unload = true;

        document.stage.resize(function(){
            //document.stage.getDimensions();
            $WR.setConstraint({left:this.DropMenu.getWidth(), bottom: -1, right:-1});

            //redimensionnement des fenêtres affichées en plein écran
            $WR.updateSize();

        }.bind(this));

        document.observe('keydown', function(evt){
            var code = Event.getKeyCode(evt);
            if(code == 116){
                this.unload = false;
            }
        }.bind(this));

        /*window.onbeforeunload = function(evt){
         if(this.unload){
         this.close();
         }
         this.unload = true;

         }.bind(this);*/
    },
    /**
     * System.close() -> void
     * Ferme le système.
     **/
    close: function(){

        $.http.post('/system/users/logout')
            .success(function(){
                window.location.reload();
            });

    },
    /**
     * System.connect() -> void
     *
     * Cette méthode gère la connexion de l'utilisateur au logiciel.
     **/
    connect: function(action){

        var box = $S.AlertBox;
        box.box.Flag.hide();

        if(box.PasswordSecurity.value == ''){
            //evt.stop();
            box.box.Flag.setText($MUI('Le mot de passe saisie est incorrect') + '.').color('red').setType(FLAG.RIGHT).show(box.PasswordSecurity, true);
            return true;
        }

        if(box.PasswordSecurity.value.md5(15) != $U().Password){
            //evt.stop();
            box.box.Flag.setText($MUI('Le mot de passe saisie est incorrect') + '.').color('red').setType(FLAG.RIGHT).show(box.PasswordSecurity, true);
            return true;
        }

        box.wait();
        //box.setTitle($MUI('Connexion en cours'));

        $.http.post('/system/users/login',{
            parameters:	{
                Login:      $U().Login,
                Password:   box.PasswordSecurity.value
            }
        })
            .success(function(result){

            })

            .catch(function(result){

            });

        $S.exec('system.connect', {

            onComplete: function(result){

                box.hide();

                try{
                    var obj = result.responseText.evalJSON();

                    if(obj.error == 'user.connect.err'){
                        this.Flag.setText($MUI('L\'identifiant et/ou le mot de passe saisis sont incorrects'));
                        this.Flag.show(box.form.Login);
                        return;
                    }

                    if(obj.error == 'user.connect.login'){
                        this.Flag.setText($MUI('L\'identifiant et/ou le mot de passe saisis sont incorrects'));
                        this.Flag.show(box.form.Login);
                        return;
                    }

                    if(obj.error == 'user.connect.password'){
                        this.Flag.setText($MUI('Le mot de passe saisi est incorrect'));
                        this.Flag.show(box.form.Password);
                        return;
                    }

                    if(obj.statut == 'system.connect.ok'){
                        try{
                            //$S.GATEWAY_KEY = 		obj.GATEWAY_KEY;
                            //$WR().setGlobals('parameters', {GATEWAY_KEY:this.GATEWAY_KEY});

                            //on execute l'action une nouvelle fois
                            if(action) {
                                //action.options.parameters.GATEWAY_KEY = $S.GATEWAY_KEY;
                                new Ajax.Request($S.link, action.options);
                            }

                        }catch(er){
                            this.Flag.setText('<p class="icon-documentinfo">' + $MUI('Vous devez accepter les pop-up pour l\'utilisation du logiciel') + '.</p>').setType(FLAG.LB).color('grey');
                            this.Flag.show($WR.TaskBar());
                            this.Flag.decalTo(-40, -$WR.TaskBar().getHeight());
                            this.Flag.setStyle('z-index:10000');
                        }

                        return;
                    }

                }catch(er){
                    if(result.responseText.match(/sql\.connect\.err/) || result.responseText.match(/sql\.select\.db\.err/)){
                        var splite = SpliteWait($MUI('Une erreur est survenue lors de la connexion à la base de données.<br />Si le problème persiste, veuillez contacter l\'administrateur du logiciel. (code:' + result.responseText+')'));

                        this.Alert.setTitle($MUI('La connexion a échoué')).a(splite).setType('CLOSE').show();
                        return;
                    }
                }

                var splite = 	new SpliteWait($MUI('Une erreur est survenue lors de la tentative de connexion au logiciel') + '.');
                var node = 		new Node('div', result.responseText);
                this.AlertBox.ti($MUI('Erreur')+'...').a(splite).a(node).ty('CLOSE').show();
            }.bind(this)
        });

        return false;
    },
    /**
     * System.exec(cmd [, options]) -> Ajax.Request
     * System.exec(cmd [, callback]) -> Ajax.Request
     * - cmd (String): Nom de la commande à executer.
     * - options (Object): Object de configuration de requête AJAX.
     * - callback (Function): Fonction executée une fois que la méthode est terminée.
     *
     * Cette méthode envoie une commande vers le fichier `gateway.php`. Le script analysera et traitera la commande.
     *
     * <p class="note">Cette méthode assure une communication sécurisé entre le fichier <code>gateway.php</code> et Javascript.</p>
     *
     * <p class="note">Cette méthode offre les mêmes options que la méthode <code>Ajax.Request</code> de <a href="http://api.prototypejs.org/ajax/Ajax/Request/">prototypejs</a>.</p>
     *
     * #### Paramètres options
     *
     * Le paramètre options possède plusieurs attributs permettant de configurer la connexion AJAX.
     *
     * - `parameters` (String | Object): Paramètres à envoyer au script PHP.
     * - `link` (String): Lien du script PHP. Par défaut link vaut "gateway.php".
     * - `method` (String): POST ou GET.
     *
     * Et tous les événements du cycle de vie d'une requête AJAX.
     *
     * #### Exemple
     *
     * Ci-après un exemple d'utilisation de la méthode :
     *
     *     System.exec('user.list', function(result){
 *          try{
 *               var obj = result.responseText.evalJSON();
 *          }catch(er){
 *               System.trace(result.responseText);
 *               return;
 *          }
 *          //suite des instructions
 *     });
     *
     * Ci-après un autre exemple d'utilisation de la méthode en envoyant des paramètres :
     *
     *     System.exec('user.list', {
 *          parameters:'options=active&param2=toto',
 *          onComplete:function(result){ 
 *                try{
 *                    var obj = result.responseText.evalJSON();
 *               }catch(er){
 *                    System.trace(result.responseText);
 *                    return;
 *               }
 *               //suite des instructions
 *          }
 *     });
     *
     * #### Cycle de vie de la requête (extrait prototype.js)
     *
     * Underneath our nice requester objects lies, of course, `XMLHttpRequest`. The defined life-cycle is as follows:
     *
     * * Created
     * * Initialized
     * * Request sent
     * * Response being received (can occur many times, as packets come in)
     * * Response received, request complete
     *
     * As you can see under the "Ajax options" heading of the Ajax, Prototype's AJAX objects define a whole slew of callbacks, which are triggered in the following order:
     *
     * * `onCreate` (this is actually a callback reserved to Ajax.Responders)
     * * `onUninitialized` (maps on Created)
     * * `onLoading` (maps on Initialized)
     * * `onLoaded` (maps on Request sent)
     * * `onInteractive` (maps on Response being received)
     * * `onXYZ` (numerical response status code), onSuccess or onFailure (see below)
     * * `onComplete`
     *
     * The two last steps both map on Response received, in that order. If a status-specific callback is defined, it gets invoked. Otherwise, if onSuccess is defined and the response is deemed a success (see below),
     * it is invoked. Otherwise, if onFailure is defined and the response is not deemed a sucess, it is invoked. Only after that potential first callback is onComplete called.
     *
     * <p class="related-to">Pour en savoir plus sur la méthode Ajax.Request rendez-vous sur cette <a href="http://api.prototypejs.org/ajax/Ajax/Request/">page</a>.</p>
     *
     **/
    exec: function(cmd, obj){

        if(Object.isUndefined(cmd)) throw('Error System::exec : arg[0] is undefined');

        var options = {
            method:		'post',
            parameters: '',
            trace:		true,
            onComplete:	new Function(),
            link:		$S.link
        };

        if(Object.isFunction(obj)){
            options.onComplete = obj;
        }else{
            if(!Object.isUndefined(obj)){
                Object.extend(options, obj);
            }
        }

        var callback = 		options.onComplete;
        $S.activedTrace = 	options.trace;

        options.onComplete = function(result){
            if(Object.isFunction(callback)) return callback.call(this, result);
        }.bind(this);

        if(typeof options.parameters == 'object'){
            options.parameters = Object.toQueryString(options.parameters);
        }

        options.parameters += 	options.parameters != '' ?
            '&' + $WR().getGlobals('parameters') + '&cmd='+cmd :
            $WR().getGlobals('parameters') + '&cmd='+cmd;

        var ajax = new Ajax.Request(this.URI_PATH +  'ajax/connected', options);

        return ajax;
    },
    /*
     * System.getWindow(id) -> Window
     * - id (Number): Numéro d'identifiant de l'instance Window.
     *
     * Cette méthode retourne une instance de Window en fonction de son numéro d'identification.
     **/
    getWindow: function(id){
        return $WR.getWindow(id);
    },
    /**
     * System.Meta(key [, value [, callback]]) -> Mixed
     * - key (String): Nom de la clef méta à utiliser.
     * - value (Mixed): Valeur à affecter.
     * - callback (Function): Fonction appelée après sauvegarde des données.
     *
     * Cette méthode retourne une valeur stocké en fonction du paramètre `key` dans la table `software_meta`.
     * Si le paramètre `value` est mentionné alors la méthode enregistrera cette valeur dans la table au nom de clef indiqué `key`.
     *
     * <p class="note">Si la clef n'existe pas et que `value` n'est pas mentionné la méthode retournera NULL.</p>
     *
     * Cette méthode gère les clefs du système. Une clef est une information ou méta donnée
     * stocké en base de données. Elle peut être utilisé par n'importe quel module pour
     * stocker des informations. Les clefs enregistrés sont automatiquements sauvegardé et
     * restauré au lancement du logiciel.
     *
     * Les clefs système sont des clefs sensibles puisqu'elles contiennent les valeurs de configuration
     * du système même. Il est conseillé pour un module dynamique d'utiliser les clefs de stockage
     * du module PluginManager si les informations sont relatives au plugin plutot qu'au système.
     **/
    meta: function(key, value, callback){
        //clef protégé
        var key_reserved = ['link', 'Observer', 'themes', 'plugins', 'roles', 'users', 'tools', 'notify', 'isInit', 'NbNotify', 'files'];

        if(key_reserved.indexOf(key) != -1) throw('System:meta.key.exception (La clef demandé ne peut être ni lu ni écrite)');

        if(Object.isUndefined(value)){
            if(Object.isUndefined(this[key])) return null;
            if(Object.isFunction(this[key])) throw('System:meta.function.exception (La clef demandé ne peut être ni lu ni écrite)');
            if(Object.isElement(this[key])) throw('System:meta.element.exception (La clef demandé ne peut être ni lu ni écrite)');

            return this[key];
        }

        if(Object.isFunction(this[key])) throw('System:meta.function.exception (La clef demandé ne peut être ni lu ni écrite)');
        if(Object.isElement(this[key])) throw('System:meta.element.exception (La clef demandé ne peut être ni lu ni écrite)');

        this[key] = value;

        var obj = {key:key, value:value};

        $.http.put('admin/system/meta/' + key, {value: value});

        return value;
    },

    Meta: function(key, value, callback){return this.meta(key, value, callback);},
    /*
     * System.onEval(evt, argv) -> void
     * - evt (StopEvent): Objet d'événement personnalisé.
     * - argv (Array): Liste des arguments de la commande.
     *
     * Cette méthode évalue les commandes du terminal.
     **/
    onEval: function(evt, argv){
        if(argv.length == 0) return;

        var original = argv[0];

        switch(argv[0]){
            case 'help':
                evt.stop();

                var help = 	'<table style="padding-bottom:20px">';
                help += 	'<tr><td width=100><code>clear</code></td><td>Vide la fenêtre du terminal.</td></tr>';
                help += 	'<tr><td><a onclick="$S.Terminal.eval(\'configure\')"><code>configure</code></a></td><td>Force la reconfiguration des applications. Cette méthode permet de régler certains problèmes suite à une mise à jour fait manuellement.</td></tr>';
                help += 	'<tr><td><a onclick="$S.Terminal.eval(\'exec -h\')"><code>exec</code></a></td><td>Execute une commande AJAX.</td></tr>';
                help += 	'<tr><td width=100><code>disconnect</code></td><td>Ferme le logiciel javalyss.</td></tr>';
                help += 	'<tr><td><a onclick="$S.Terminal.eval(\'meta -h\')"><code>meta</code></a></td><td>Retourne la valeur de System.Meta(key).</td></tr>';

                help += 	'<tr><td><a onclick="$S.Terminal.eval(\'compile -h\')"><code>compile</code></a></td><td>Créer une archive du logiciel.</td></tr>';
                help += 	'<tr><td><code>whoimy</code></td><td>Affiche le nom de l\'utilisateur connecté.</td></tr>';
                help +=		'</table><p>Pour plus d\'information sur la commande tapez le nom de la commande suivi du flag <code>-h</code>';

                return help;

            case 'cron':
                evt.stop();

                switch(argv[1]){
                    case 'start':
                        $.http.post('/system/cron/start');
                        return;

                    case 'stop':
                        $.http.post('/system/cron/stop');
                        return;
                    default:
                    case 'info':
                        $.http.get('/system/cron/statut');
                        return;

                    case 'list':
                        $.http.get('/system/cron/tasks');
                        return;
                }


                break;

            case 'update':
            case 'configure':
                evt.stop();
                $.http.post('/system/update');
                return;

            case 'disconnect':
                evt.stop();
                $.http.post('/system/users/logout');
                break;

            case "whoimy":
                evt.stop();
                return 'whoimy > ' + $U().Name + ' ' + $U().FirstName;

            case "meta":
                evt.stop();

                if(argv[1] == '-h'){
                    var help = 	'<code>usage: meta &lt;key&gt;</code><p></p>';
                    help += 	'Retourne la valeur de System.Meta(key).';
                    return help;
                }

                return 'System:Meta[' + argv[1] +'] > ' + $S.Meta(argv[1]);

            case "exec":
                evt.stop();

                if(argv[1] == '-h'){
                    var help = 	'<code>usage: exec &lt;command&gt;</code><p></p>';
                    help += 	'Execute une commande AJAX.';
                    return help;
                }

                var parameters = {cmd: argv[1]};
                break;

            case "test":
                evt.stop();

                $.http.get(System.URI_PATH +'/test/abtract_junittest.php').success(function(data){
                    $S.trace(data);
                });
                return;

            case "compile":
            case 'zipsys'://création d'une archive du logiciel.
                evt.stop();

                if(argv[1] == '-h'){

                    var help = 	'<code>usage: compile [options] &lt;filename&gt;</code><p></p><code>usage 2: zipsys [options] &lt;-v=version&gt;</code><br />';
                    help += 	'Créer une archive du logiciel et la stocke dans votre dossier public au nom indiqué par filename.<br /><br />';
                    help += 	'Par défaut l\'archivage du logiciel sera complet. La liste des options suivantes permet de modifier l\'archive construite :<br /><table>';
                    help += 	'<tr><td width=30><code>-i</code></td><td>Archivage sans le dossiers des icônes.</td></tr>';
                    help += 	'<tr><td><code>-c</code></td><td>Archivage sans les fichiers de configuration.</td></tr></table>';
                    return help;
                }

                //création de la commande
                argv = $S.parseArgs(argv);

                var parameters = {cmd: 'system.create.archive', options:{op:argv.flag(), value:''}};
                parameters.options.version = !Object.isUndefined(argv.get('v')) ? argv.get('v') : false;



                if(argv.length > 0) {
                    parameters.options.value = argv.get(0);
                }
                else{
                    if(!parameters.options.version){
                        return $MUI('compile > Erreur de syntaxe sur la commande, utilisez l\'option -h pour avoir les détails de la commande.');
                    }

                    parameters.options.value = $S.CORE_BASENAME.replace(/ /g, '_').toLowerCase() + '_' + parameters.options.version;
                }

                break;

        }

        if(evt.stopped){

            $S.trace(evt.text);
            $S.Terminal.setTag(original + ' > ');

            $S.exec(parameters.cmd, {
                parameters: 'options=' + escape(Object.toJSON(parameters.options)),
                trace:		false,

                onLoading:	function(){
                    $S.trace('wait...');
                },

                onComplete:	function(result){
                    var str = result.responseText;
                    $S.trace(str == '' ? 'Aucune réponse' : str);
                    $S.Terminal.unTag();
                }
            });
        }
    },
    /**
     * System.onInit(result) -> void
     * - result (Object): Objet retourné par AJAX.
     *
     * Cette méthode est appellé automatiquement après le lancement du logiciel via la méthode [[System.start]].
     * Elle analyse les informations retournés par AJAX suite à la commande `system.init`.
     **/
    onInit: function(obj){

        this.AlertBox.setProgress(50, 100, $MUI('Importation des préférences'));

        this.users.setConnectingUser(obj.User);
        this.roles.setObject(obj.Roles);
        this.plugins.setObject(obj.Plugins);

        $S.trace('system > whoimy');
        $S.trace('whoimy > ' + $U().Name + ' ' + $U().FirstName);


        new $.fThread(function(){

            this.SYSTEM_INIT = true;
            this.startInterface();


            if(1 * $U().getRight() == 1){
                //vérification de mise à jour
                var array = $S.Meta('UPDATE_STORY');
                if(array != null) {
                    for(var i = 0; i < array.length; i++){

                        if(array[i].Date.toDate().toString_('date') == (new Date()).toString_('date')){

                            $NM().addNotify({
                                title:$MUI('Votre logiciel a été mis à jour') + '.',
                                icon:'interact',
                                date: array[i].Date.toDate()
                            }).on('click',function(){$S.openUpdate(1)});

                            break;
                        }
                    }

                    //vérification safe_mode
                    if($S.PHP_SAFE_MODE){
                        $NM().addNotify({
                            title:$MUI('Le safemode de PHP est activé. Certaines fonctionnalités du logiciel risque de ne pas fonctionner correctement') + '.',
                            icon:'alert',
                            date: new Date()
                        });
                    }
                }
            }

            ///observation des événements des événements de suppression
            if($S.Meta('USE_SECURITY')){
                $S.observePattern('remove.open', this.onOpenRemoveItem.bind(this));
                $S.observePattern('remove.submit', this.onSubmitRemoveItem.bind(this));
            }

            this.AlertBox.setProgress(100, 100, $MUI('Chargemement de l\'interface'));

            new Timer(function(){

                this.AlertBox.hide();
                this.AlertBox.removeClassName('javalyss');

                $S.trace('system > fireEvent <span style="color:#069">system:loaded</span>');
                this.fire('system:loaded', obj);

                $S.trace('system > ready !');

            }.bind(this), 1, 1).start();


        }.bind(this), 0.1);

        $S.trace('loadPreferences > imported !');

    },
    /*
     * System.onOpenRemoveItem(box) -> void
     * - box (AlertBox): Instance de la boite de dialogue.
     *
     * Cette méthode crée un formulaire de vérification de mot de passe lorsque l'utilisateur tente de supprimer une ressource du logiciel.
     **/
    onOpenRemoveItem: function(box){
        var flag = box.box.createFlag();
        box.PasswordSecurity = new Input({type:'password', style:'width:99%'});
        box.PasswordSecurity.Large(true);
        box.PasswordSecurity.placeholder = $MUI('Saisissez votre mot de passe');

        box.PasswordSecurity.keyupenter(function(){
            box.submit();
        });

        box.a(new Node('h4', $MUI('Sécurité - Vérification de votre mot de passe')));
        box.a(box.PasswordSecurity);

        box.PasswordSecurity.focus();
        box.PasswordSecurity.select();

        flag.add(box.PasswordSecurity, {
            text:			$MUI('Pour valider cette action, merci de saisir le mot de passe de votre compte utilisateur'),
            orientation:	Flag.RIGHT,
            color:			'grey'
        });

    },
    /*
     * System.onSubmitRemoveItem(evt) -> void
     *
     * Cette méthode vérifie le mot de passe lorsque le formulaire de suppression d'une ressource du logiciel est validé.
     **/
    onSubmitRemoveItem:function(evt){
        evt.target.box.Flag.hide();
        if(evt.target.PasswordSecurity.value == ''){
            evt.stop();
            evt.target.box.Flag.setText($MUI('Le mot de passe saisie est incorrect') + '.').color('red').setType(FLAG.RIGHT).show(evt.target.PasswordSecurity, true);
            return true;
        }

        if(evt.target.PasswordSecurity.value.md5(15) != $U().Password){
            evt.stop();
            evt.target.box.Flag.setText($MUI('Le mot de passe saisie est incorrect') + '.').color('red').setType(FLAG.RIGHT).show(evt.target.PasswordSecurity, true);
            return true;
        }

    },
    /*
     * System.parseArgs() -> Object
     **/
    parseArgs: function empileFlag(argv){
        var str = '';
        var argv_ = {};
        argv_.length = 0;

        for(var i = 1; i < argv.length; i++){

            if(argv[i].slice(0, 1) == '-'){
                if(!argv[i].match(/=/)){//verification d'une option avec égalité
                    str += argv[i].replace(/-/g, '');
                }else{

                    var arg = argv[i].split('=');
                    argv_[arg[0].replace(/-/g, '')] = arg[1];
                    continue;
                }
                continue;
            }

            argv_[argv_.length] = argv[i];
            argv_.length++;
        }

        return {
            options:	argv_,
            value:		str,
            length:		argv_.length * 1,

            get: function(key){
                if(!Object.isUndefined(key)) return this.options[key];
                return this.options;
            },

            flag: function(){
                return this.value != '' ? '-' + this.value : ''
            }
        }
    },
    /**
     * System.reload() -> void
     * Cette méthode redémarre le logiciel.
     **/
    reload: function(){
        window.onbeforeunload = function(){};
        window.location.reload();
    },
    /**
     * System.serialize(value) -> String
     * - value (String | Number | Object | Date): Valeur à sérialiser.
     *
     * Cette méthode sérialize le paramètre `value` en vue d'être envoyé via AJAX.
     **/
    serialize: function(value){

        switch(typeof value){
            case "function":
                return false;
            case "boolean":
            case "number":
            case "string":
                value = encodeURIComponent(value);
                break;
            case "object":
                if(value === null){
                    break;
                }

                if(Object.isDate(value)){
                    value = encodeURIComponent(value.format('Y-m-d h:i:s'));
                    break;
                }

                value = Object.encodeURIComponent(value);
                break;
        };

        return value;
    },
    /**
     * System.open(link, name [, options]) -> Window
     * - link (String): Lien de la page à ouvrir.
     * - name (String): Nom à afficher pour l'instance Window.
     * - options (Object): Objet de configuration de l'instance Window.
     *
     * Ouvre une fenêtre `Iframe` pour afficher une page externe au logiciel.
     * Cette méthode remplace la méthode `window.open` afin d'éviter l'ouverture de `popup` supplémentaire.
     *
     * <img src="http://www.javalyss.fr/sources/system-open.png" />
     **/
    open: function(link, name, obj){

        var win = new Window();

        win.IFrame = new Node('iframe', {src:link, style:'height:100%; width:100%; position:absolute;'});
        win.IFrame.on('click', function(){win.focus()});
        win.setTitle(name).setIcon('browser-alt').appendChild(win.IFrame);

        document.body.appendChild(win);

        var options = {
            fullScreen: true,
            width:		0,
            height:		0,
            left:		0,
            top:		0,
            toolbar:	false
        };

        if(Object.isString(obj)){
            obj = obj.split(',');
            var obj_ = {};

            for(var i = 0; i < obj.length; i+=1){

                var t = obj[i].split('=');

                if(t.length ==1){
                    obj_[t[0]] = true;
                }else{
                    obj_[t[0]] = t[1];
                }
            }
            obj = obj_;
        }

        Object.extend(options, obj || {});

        options.fullScreen =  options.width == 0 && options.height == 0;

        if(options.toolbar){

            //
            // Location
            //
            win.Location = new InputButton({sync:true, icon:'reload'});
            win.Location.setStyle('position: absolute; right: 0px; left: 0px; width: auto; top: 0px;');
            win.DropMenu.appendChild(win.Location);
            win.Location.Value(link);

            win.Location.on('change', function(){
                win.IFrame.src = win.Location.Value();
            });

            win.Location.SimpleButton.on('click', function(){
                win.IFrame.src = '';
                win.IFrame.src = win.Location.Value();
            });
        }

        win.Body().setStyle('min-height:300px; min-width:400px');

        if(options.fullScreen){
            win.fullscreen();
        }else{
            win.resizeTo(options.width ? options.width : document.stage.stageWidth, options.height ? options.height : document.stage.stageWidth);
        }

        win.moveTo(options.left, options.top);

        //overide methode iframe
        //win.IFrame.contentWindow.close = win.close.bind(win);

        $S.fire('system:external.open', win, obj);

        return win;
    },
    /**
     * System.openInfo() -> void
     *
     * Cette méthode ouvre le panneau d'information. Vous y trouverez toutes les documentations du logiciel Javalyss
     * et des Framework Extends et Window.
     *
     * <img src="http://www.javalyss.fr/sources/form-info.png" />
     **/
    openInfo: function(){
        try{
            $UM().openMyPreferences(6);
        }catch(er){
            $S.trace(er);
        }
    },
    /**
     * System.openPDF(link) -> Window
     * - link (String): Lien du fichier pdf à ouvrir.
     *
     * Cette méthode est conçue pour l'ouverture de fichier PDF au sein du logiciel.
     **/
    openPDF:function(uri){
        var win = new Window();

        win.IFrame = new Node('object', {style:'height:100%; width:100%; position:absolute; top:0px; left:0px;margin:0px', type:'application/pdf', data:uri});

        //win.IFrame.innerHTML = 'alt : <a href="'+ uri +'">'+uri+'</a>';

        win.setTitle(name).setIcon('acroread').appendChild(win.IFrame);
        document.body.appendChild(win);
        win.Fullscreen(true);

        return win;
    },
    /**
     * System.openObject(data, type) -> Window
     * - data (String): Lien data de la balise Object.
     * - type (String): Type de l'application à ouvrir.
     *
     * Cette méthode permet l'ouverture de document quelconque (sous condition que le navigateur le prenne en charge)
     * dans une fenêtre du logiciel.
     **/
    openObject:function(data, type){
        var win = new Window();

        win.Object = new Node('object', {style:'height:100%; width:100%; position:absolute; top:0px; left:0px;margin:0px', type:type, data:data});

        win.setTitle(name).setIcon('object').appendChild(win.Object);
        document.body.appendChild(win);
        win.Fullscreen(true);

        return win;
    },
    /**
     * System.openPicture(file, array) -> Window
     * - file (String): Lien de l'image à afficher
     * - array (String): Liste des images pour la diaporama
     *
     * Cette méthode permet l'ouverture de photo dans l'instance LightBox.
     **/
    openPicture: function(file, array){
        var index = 0;
        var i = 0;

        if(array){
            if(array.length){
                array.each(function(e){

                    if(e.src == file.uri || e.src == file || e.src == file.src){
                        index = i;
                    }
                    i++;
                });
                this.LightBox.setData(array);
                this.LightBox.selectedIndex(index);
            }else{
                this.LightBox.setData([file]);
            }

        }else{
            this.LightBox.setData([{src: file, title:''}]);
        }

        this.LightBox.show();
    },
    /**
     * System.ready(fn) -> System
     * - fn (Function): Fonction à appeller
     *
     * Cette méthode enregistre une fonction qui sera appelée après le chargement complet de Javalyss.
     **/
    ready:function(fn){
        this.observe('system:loaded', fn);
        return this;
    },

    openConnect:function(){
        var box = 	$S.AlertBox;

        box.hide();

        try{
            //
            //
            //
            var flag = 	box.box.createFlag();
            box.PasswordSecurity = new Input({type:'password', style:'width:99%'});
            box.PasswordSecurity.Large(true);
            //
            //
            //
            //var widget = 	new Widget();
            var table = 	new TableData();
            table.setStyle('width:100%');

            table.addHead($MUI('Mot de passe') + ' : ', {width:120}).addCel(box.PasswordSecurity);

            box.PasswordSecurity.on('mouseover', function(){
                flag.setText('<p class="icon-locked">' +  $MUI('Pour valider cette action, merci de saisir le mot de passe de votre compte utilisateur') + '.</p>').color('grey').setType(FLAG.RIGHT).show(this, true);
            });
            //
            // Splite
            //
            var splite = new SpliteIcon($MUI('Votre compte est déconnecté'), $MUI('Votre compte est resté trop longtemps inactif. Merci de saisir votre mot de passe pour vous reconnecter !'));
            splite.setIcon('system-connect-48');

            box.setTheme('flat liquid black');
            box.a(splite).a(table).setType().show();

            box.PasswordSecurity.focus();

            box.PasswordSecurity.keyupenter(function(){
                box.submit();
            });

            box.submit({
                text: $MUI('Me connecter'),
                click:function(){
                    return $S.connect(result);
                }.bind(this)
            });

            box.reset({
                text:$MUI('Quitter l\'application'),

                click: function(){
                    window.location = '../../index.php';
                }
            });
        }catch(er){$S.trace(er)}
    },

    openNoRight:function(){
        var box = 	$S.AlertBox;
        box.hide();
        var splite = new SpliteIcon($MUI('Vos privilèges sont insuffisants pour effectuer cette action'), $MUI('Merci de vous connecter avec un compte ayant les privilèges suffisants') + ' !');
        splite.setIcon('alert-48');
        splite.setStyle('width:400px');
        box.a(splite).setType('CLOSE').Timer(5).show();
    },
    /**
     * System.start() -> void
     *
     * Initialise le système et charge les composants du logiciel.
     **/
    start: function(){

        this.link = (System.URI_PATH + '/ajax/connected').replace('index_admin.php', '');

        $S.trace('system > start');

        document.body.appendChild(this.Alert);
        document.body.appendChild(this.Flag);
        document.body.appendChild(this.LightBox);

        $.Extends.setGlobals('link', this.link);
        $.Extends.setGlobals('origin', this.URI_PATH);

        $.http
            .error(function(response){
                if (response.status === 401) {//non authentifié
                    System.openConnect();
                }

                if (response.status === 403) {//non authorisé
                    System.openNoRight();
                }

                if (response.status === 419 || response.status === 440) {//timeout
                    System.openConnect();
                }
            })

            .success(function(response){

                if(response.responseText.match(/{"error":/) || response.responseText.match(/{<b>Fatal error<\/b>/gi)){

                    try{
                        var error = text.evalJSON();
                        var str = 	'<strong>Commande : <span style="color:#069">' + (error.cmd ? error.cmd : 'null') + '</span></strong>';
                        str += 		'<br>Code d\'erreur : <span style="color:red">' +  error.error + '</span>';

                        if(error.queryError){
                            str += 		'<br>Requête SQL : <pre class="sql"><code>' +  error.query + '</code></pre>';
                            str += 		'<br>Erreur SQL : <pre class="sql"><code>' +  error.queryError + '</code></pre>';
                        }

                        if(error.options){
                            str += '<br>Données : ' + Object.isString(error.options) ? error.options : Object.toJSON(error.options);
                        }

                        $S.trace(str);

                        response.transport.responseText = 'Une erreur est survenue lors du traitement de votre requête, ouvrez le terminal pour afficher l\'erreur';

                    }catch(er){

                        $S.trace(response.responseText);
                        response.transport.responseText = 'Erreur du parser JSON, ouvrez le terminal pour afficher l\'erreur';
                    }

                }
            });

        //Ajax.Responders.register({onComplete:this.onCompleteAjax.bind(this)});

        var splite = new Node('div', {className:'loading-logo'},
            new Node('div', [
                new Node('b', this.NAME_VERSION.split(' ')[1]), ' version ' + this.VERSION
            ])
        );

        this.AlertBox.progressBar(25, 100, $MUI('Initialisation'));
        this.AlertBox.a(splite);
        this.AlertBox.addClassName('javalyss');
        this.AlertBox.show();
        $S.trace('<h1 class="system-welcom-msg">Bienvenue sur <span class="name">'+ this.NAME_VERSION +'</span> <span class="version">v' + this.version + '</span></h1>');


        this.SYSTEM_INIT = false;

        $S.trace('system > loadPreferences');
        
        $.http.get('/system/info').success(this.onInit.bind(this));
        //démarrage du CRON

        if(!this.CRON_STARTED){
            var p = null;

            p = $.http.post('/system/cron/start').success(function(){
                new fThread(function(){
                    try{
                        p.ajax.transport.abort();
                    }catch(er){}
                }, 1);
            });
        }

        if(System.Meta('MODE_DEBUG')){
            document.observe('keydown', function(evt){
                var code = (!document.all)? evt.which : evt.button;

                if(code == 121 || code == 120){
                    if(this.Terminal.opened){
                        try{
                            this.Terminal.window.close();
                        }catch(er){}
                        this.Terminal.opened = false;
                    }else{
                        this.Terminal.open();
                        this.Terminal.opened = true;
                    }
                }
            }.bind(this));
        }

        //mise à jour de la constante de la taille des fichiers de FrameWorker
        FrameWorker.prototype.maxSize = 	$S.UPLOAD_MAX_FILESIZE;
        DropFile.prototype.maxSize = 		$S.UPLOAD_MAX_FILESIZE;

        FrameWorker.prototype.parameters = 	'cmd=frameworker.default.import';
        DropFile.prototype.parameters = 	'cmd=frameworker.default.import';

    },
    /**
     * System.startInterface() -> void
     *
     * Initialise l'interface d'administration en fonction de l'utilisateur courant.
     **/
    startInterface:function(){
        $S.trace('system > startInterface');

        Extends.fixScroll();

        this.AlertBox.setProgress(75, 100, $MUI('Chargement de l\'interface...'));
        try{

            this.ButtonUser = this.createButtonUser();
            //
            //TaskBar
            //
            $WR.createTaskBar({
                title:		'',
                systray:	true,
                hide:		false,
                effect:		false,
                instance:	'AppButton',
                parameters:	[
                    this.ButtonUser,
                    'MinWin',
                    //'ClockCalendar',
                    System.Search.create(),
                    'Systray'
                ]
            });

            this.TaskBar =			$WR.TaskBar();
            //
            //DropMenu
            //
            this.DropMenu = new DropMenu();

            this.DropMenu.setType(document.navigator.mobile ? DROP.BOTTOM : DROP.LEFT);
            this.DropMenu.addClassName('system-menu');
            //	this.DropMenu.addClassName('iscroll');
            //
            // WidgetContainer
            //
            this.WidgetContainer = new WidgetContainer({drop:false, number:$U('WIDGET_NUMBER') || 2});
            this.WidgetContainer.addClassName('system-widgets');

            document.body.appendChild(this.Background = new Node('div', {className:'system-background system-panel'}));
            //
            // Ajout de la gestion des bureaux
            //
            this.SectionMenu = new SimpleSection($MUI('Menu'));
            this.SectionMenu.addClassName('section-desktop-menu');

            this.DropMenu.appendChild(this.SectionMenu);

            var btnDesktop = this.addPanel($MUI('Bureau'), this.WidgetContainer);
            document.body.appendChild(this.DropMenu);

            if(!Object.isUndefined($U('BACKGROUND')) && $U('BACKGROUND') != ''){
                this.Background.setStyle('background-image:url("'+ $U('BACKGROUND') +'");');
            }
            //
            // Gestion des accès
            //
            this.DropMenu.addMenu_ = this.DropMenu.addMenu;

            this.DropMenu.addMenu = function(name, options){
                var appName = !Object.isUndefined(options.appName) ? options.appName : name;

                if(!System.plugins.haveAccess(appName)){
                    options = Object.isUndefined(options) ? {} : options;
                    options.text = name;

                    var line = new SimpleMenu(options);

                }else{
                    var line = this.addMenu_(name, options);
                }

                return line;
            };

        }catch(er){
            this.trace(er);
            console.log(er);
        };

        try{
            //
            //Section Configuration
            //
            this.Directory.startInterface();
            this.Role.startInterface();
            this.files.startInterface();

            try{
                this.Market.startInterface();
            }catch(er){}

            this.plugins.startInterface();

            //menu système
            switch($U().getRight()){
                case 1:
                    this.DropMenu.addMenu($MUI('Configuration'), {icon:'system-setting'}).on('click', function(){this.Settings.open(0)}.bind(this));
                    break;
                case 2:
                case 3:
                    break;
            }

            //this.notify.startInterface();

        }catch(er){
            this.trace(er);
            console.log(er);
        }

        this.DropMenu.appendChild(new SimpleSection($MUI('Apps')));

        $S.trace('system > fireEvent <span style="color:#069">system:startinterface</span>');
        this.fire('system:startinterface');

        if(this.DropMenu.select('.btn-panel.selected').length == 0){
            btnDesktop.click();
        }


        if(this.Meta('MODE_DEBUG')) {
            var button = this.TaskBar.Systray.addMenu($MUI('Terminal'), {icon:'terminal'});

            button.on('click', function(){
                this.Terminal.open(button).MinWin.css('display', 'none');
            }.bind(this));

            this.Terminal.observe('eval', this.onEval.bind(this));
            this.Terminal.observe('open', function(win){
                win.DropMenu.addMenu($MUI('ZipSys'), {icon:'zip'}).on('click', function(){
                    var code =  ((this.CODE_VERSION * 10 + 1 * (this.CODE_SUBVERSION * 1 + 0.1).toFixed(1))  / 10).toFixed(2);
                    code =		code.split('.');
                    code =		code[0] + '.' + code[1].slice(0,1) + '.' + code[1].slice(1,2);
                    this.Terminal.eval('zipsys -v=' + code);
                }.bind(this));

                win.DropMenu.addMenu($MUI('Manuel'), {icon:'documentinfo'}).on('click', function(){
                    this.Terminal.eval('help');
                }.bind(this));
            }.bind(this));
        }

        //this.TaskBar.addLine($MUI('A propos'), function(){this.openInfo(5)}.bind(this), {icon:'documentinfo-32', isSection:true});

        this.DropMenu.appendChild(new SimpleSection(''));

        //this.DropMenu.addMenu($MUI('Déconnexion'), {icon:'exit'}).on('click', function(){this.close();}.bind(this));

        var self = this;
        var dw = $U('DASHBOARD_WIDTH') || 0;

        if(1 * dw != 0){
            //this.DropMenu.addClassName('system-menu-mini');
            document.body.addClassName('system-full');

            if(!document.navigator.mobile){
                $WR.setConstraint({left:30, bottom: -1, right:-1});
            }
        }else{
            if(!document.navigator.mobile){
                $WR.setConstraint({left:self.DropMenu.getWidth(), bottom: -1, right:-1});
            }
        }

        if(!document.navigator.mobile){
            var btn = this.DropMenu.addMenu($MUI('Réduire le menu'), {icon: (1 * dw) == 0 ? '1left-mini-blue' : '1right-mini-blue', className:'system-toggle-menu'});
            btn.value = dw;

            btn.on('click', function(){

                //self.DropMenu.removeClassName('system-menu-mini');
                document.body.removeClassName('system-full');

                if(1 * this.value == 0){
                    this.setIcon('1right-mini-blue');

                    document.body.addClassName('system-full');
                    this.value = 1;
                }else{
                    this.setIcon('1left-mini-blue');
                    this.value = 0;
                }

                self.DropMenu.addClassName('system-menu-transition');

                new Timer(function(){
                    self.DropMenu.removeClassName('system-menu-transition');
                    $U('DASHBOARD_WIDTH', btn.value);
                    if(!document.navigator.mobile){
                        $WR.setConstraint({left:self.DropMenu.getWidth(), bottom: -1, right:-1});
                    }

                    Extends.fire('resize');

                }, 0.5, 1).start();
            });

            this.DropMenu.appendChild(new Node('div', {className:'system-menu-shadow'}));

        }else{
            this.DropMenu.select('.section').each(function(e){
                this.DropMenu.removeChild(e);
            }.bind(this));

            this.DropMenu.select('.simple-menu').each(function(e){
                e.SimpleButton.setIcon(e.SimpleButton.getIcon().trim() + ' icon-'+e.SimpleButton.getIcon().trim()  + '-32');
            });
        }

        $S.trace('startInterface > ready !');

    },
    /** deprecated
     * System.timeExceded(uri) -> void
     *
     * Informe l'utilisateur qu'il est rester trop longtemps inactif et que la fenêtre va se fermer.
     **/
    timeExceded:function(){},
    /**
     * System.addWidget(name, node) -> void
     * - name (String): Nom unique du widget pour son positionnement sur le tableau de bord.
     * - node (Widget | Node): Element à ajouter au tableau de bord.
     *
     * Cette méthode ajoute un widget au tableau de bord de Javalyss.
     **/
    addWidget: function(appName, node){
        this.WidgetContainer.appendChild(node);
    },
    /**
     * System.addMenu(title, options) -> SimpleMenu
     * - title (String): Titre du menu
     * - options (Object): Options de configuration.
     *
     * Cette méthode ajoute un menu.
     *
     **/
    addMenu:function(title, options){
        return this.DropMenu.addMenu(title, options);
    },
    /**
     * System.addPanel(title, panel) -> SimpleButton
     * - title (String): Titre du panneau
     * - panel (Element | Panel): Element contenant votre panneau.
     * - options (Object): Options de configuration.
     *
     * Cette méthode ajoute un panneau aux gestionnaires d'onglet et retourne l'instance [[SimpleButton]] générée par la méthode.
     **/
    addPanel: function(title, elem, options){

        options = options || {};

        var self = 	this;
        //
        // Btn
        //
        var btn = 		new SimpleButton({text:title});
        btn.addClassName('btn-panel');

        btn.friend = 	elem;

        btn.getFriend = function(){
            return this.friend;
        };

        btn.on('click', function(){

            self.DropMenu.select('.btn-panel').each(function(e){
                e.friend.removeClassName('show');
                e.Selected(false);
            });

            this.friend.addClassName('show');
            this.Selected(true);

            $U('DEFAULT_PANEL', this.getText());
        });

        if(this.DropMenu.select('.btn-panel').length > 0){
            this.DropMenu.addClassName('multi-panel');
        }

        //this.draw();
        try{
            var appName = !Object.isUndefined(options.appName) ? options.appName : name;

            if(System.plugins.haveAccess(appName)){
                this.DropMenu.insertBefore(btn, this.SectionMenu);

                if(Object.isElement(elem)){

                    elem.addClassName('system-panels');

                    document.body.appendChild(elem);

                    if($U('DEFAULT_PANEL') == title){
                        btn.click();
                    }
                }

            }
        }catch(er){$S.trace(er)}

        return btn;
    },

    createButtonUser:function(){
        //
        // Gestion de l'affichage du compte utilisateur
        //
        var button = new System.User.Button();

        if(!document.navigator.mobile){
            button.SpanText.on('click', function(evt){$S.users.openMyPreferences()});
        }

        button.appendChild(new Node('p', {className:'wrap-name'}, [$U().Name + ' ' + $U().FirstName, new Node('span', {className:'wrap-mail'}, $U().EMail)]));

        button.appendChild(new SimpleButton({icon:'system-account', text:$MUI('Mon compte')}).on('click', function(evt){$S.users.openMyPreferences(); button.hide();}));/*
         button.appendChild(new SimpleButton({icon:'system-account-template', text:$MUI('Thème')}).on('click', function(evt){$S.users.openMyPreferences(1); button.hide();}));
         button.appendChild(new SimpleButton({icon:'system-account-background', text:$MUI('Fond d\'écran')}).on('click', function(evt){$S.users.openMyPreferences(2); button.hide();}));*/
        button.appendChild(new SimpleButton({icon:'system-account-security', text:$MUI('Sécurité')}).on('click', function(evt){$S.users.openMyPreferences(1); button.hide();}));

        if($U().getRight() <= 2){
            button.appendChild(new SimpleButton({icon:'system-account-print', text:$MUI('Impression')}).on('click', function(evt){$S.users.openMyPreferences(2); button.hide();}));
        }

        var help = new SimpleButton({icon:'system-info'}).on('click', function(evt){$S.users.openMyPreferences(4)})
        help.addClassName('help');

        button.appendChild(help);

        button.appendChild(new SimpleButton({icon:'system-exit', text:$MUI('Déconnexion')}).on('click', function(){$S.close()}));

        return button;
    },
    /**
     * System.getUserRight() -> Number
     *
     * Retourne le niveau d'accès de l'utilisateur courant.
     **/
    getUserRight: function(){
        return $U().getRight();
    },
    /**
     * System.getUserRole() -> Role
     *
     * Retourne les informations du role de l'utilisateur courant.
     **/
    getUserRole:function(){
        return $U().getRole();
    },
    /**
     * System.getRoles() -> Array
     *
     * Retourne la liste des roles.
     **/
    getRoles: function(){
        return $RM().getArray();
    },
    /**
     * System.getRolesAcces() -> Array
     *
     * Retourne la liste des roles inférieur au role de l'utilisateur courant.
     **/
    getRolesAcces: function(){
        var t = 	$RM().getArray();
        var array =	[];

        for(var i = 0; i < t.length; i+=1){

            if(t[i].Parent_ID >= $S.getUserRight()){
                array.push(t[i]);
            }
        }
        return array;
    },
    /**
     * System.getRole(it) -> Role
     * - it (Number): Numéro du role.
     *
     * Cette méthode retourne le role en fonction d'`it`.
     **/
    getRole: function(it){
        return $RM().getRole(it);
    }
};

var $S = System;
//lancement du system
System.initialize();