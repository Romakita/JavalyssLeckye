<?php
/**
 * == Core ==
 * Cette section est dédié à la documentation du noyau du logiciel.
 * Le noyau gère tous les accès entre les fonctionnalités critiques du logiciel et l'interface.
 *
 * Les fonctionnalités du noyau sont les suivantes :
 *
 * * Gestion des utilisateurs,
 * * Gestion des rôles,
 * * Gestion des extensions,
 * * Gestion des mises à jours,
 * * Gestion des sauvegardes,
 * * Gestion d'impression,
 * * Gestion de connexion au logiciel,
 * * Configuration du logiciel,
 * * Configuration des tâches planifiés.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Version : 2.0
 * * Date :	13/07/2014
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 * #### Convention de nommage
 *
 * Toutes les méthodes du noyau de Javalyss suivent une convention de nommage précise. En voici les détails :
 *
 * * Les méthodes de classe `public` et `private` sont écrites en minuscule. Exemple : System.getUserRight().
 * * Les méthodes de classe `static` commence toujours par une lettre Majuscule, la suite des caractères étant écrit en minuscule. Ex : System.AddScript().
 * * Les méthode [[System.uDie]] et [[System.sDie]] sont les seules exceptions.
 *
 * PHP etant insensible à la case les méthodes peuvent être appellé sans respecter ces conventions.
 **/

/**
 * == Plugins ==
 *
 * Les plugins sont des micros applications développées pour Javalyss. Cette section document les différentes extensions du logiciel.
 * Attention toutefois, la disponibilité des classes et méthodes ne sont effectives que lorsque l'extension est activée via Javalyss Market.
 **/

/** section: Core
 * class System
 * includes SystemIncluder
 * Cette classe gère l'ensemble du logiciel. Elle assure la gestion notamment des mises à jours du logiciel et la connexion d'un utilisateur au système de données.
 **/

require_once('abstract_system_term.php');
require_once('abstract_system_buffer.php');
require_once('abstract_system_cache.php');
require_once('class_system_plugin.php');
require_once('class_system_search.php');
require_once('class_system_user.php');

abstract class System extends \System\Term{
    /**
     * System.VERSION -> String
     * Version du système.
     **/
    const VERSION =			'2.0';
    /**
     * System.SAFE -> String
     **/
    const SAFE = 			'safe';
    /**
     * System.CNT -> String
     **/
    const CNT =				'connected';

    private static $Error =		0;
    /*
     * System.DB_VERSION -> Array
     * Liste des configurations d'accès des plannings.
     **/
    static $DB_VERSION =		NULL;
    /**
     * System.Initialize() -> void
     *
     * Cette méthode initialize le gestionnaire System.
     **/
    public static function Initialize(){
        global $__ERR__, $PM, $FM, $FMPLUG;

        parent::Initialize();

        date_default_timezone_set('UTC');
        /**
         * Global.PM -> PluginManager
         * Instance du gestionnaire des extensions.
         **/
        $PM = 		Plugin::Initialize();
        /**
         * Global.SQL -> Sql
         * Instance du gestionnaire de requête [[Sql]].
         **/
        if(!defined('DB_TYPE')) define('DB_TYPE', 'MySQL');

        switch(DB_TYPE){
            default:
                $type = DB_TYPE;
                break;
            case 'mysql':
                $type = 'MySQL';
                break;
            case 'mssql':
                $type = 'MsSQL';
                break;
        }

        Sql::Create(array(
            'login' => 		DB_LOGIN,
            'password' => 	DB_PASS,
            'host' => 		DB_HOST,
            'db' => 		DB_NAME,
            'type' =>		$type
        ));

        Sql::Connect();

        System::Observe('gateway.exec', array(__CLASS__, 'exec'));
        //
        // Inclusion des classes
        //
        require_once('class_filemanager.php');
        require_once('class_model_pdf.php');
        //
        //gestion du NullByte
        //
        $_POST =    Stream::CleanNullByte($_POST);
        $_GET =     Stream::CleanNullByte($_GET);
        $_COOKIE =  Stream::CleanNullByte($_COOKIE);
        $_REQUEST = Stream::CleanNullByte($_REQUEST);
        //
        // Creation de la tache cron
        //
        Cron::Path(System::Path('private'));
        Cron::Uri(System::Path('uri'));
        /**
         * Global.__ERR__ -> Number
         * Numéro d'erreur généré par le système ou les extensions lors de leurs éxécution.
         **/
        $__ERR__ = 	0;

        /**
         * Global.FM -> FileManager
         * Instance du gestionnaire des médias de l'utilisateur.
         **/
        $FM =		new FileManager();
        /**
         * Global.FMPLUG -> FileManager
         * Instance du gestionnaire des extensions via l'explorateur [[FileManager]].
         **/
        $FMPLUG =	new FileManager('plugin');
        //
        // Definition des constantes
        //
        self::Define();

        if(defined('MEMORY_MAX_LIMIT')){
            Stream::$MEMORY_MAX_LIMIT = MEMORY_MAX_LIMIT;
        }
        //
        // Evenements
        //
        System::Observe('gateway.exec', array(&$FM, 'exec'));
        System::Observe('gateway.exec', array(&$FMPLUG, 'exec'));

        register_shutdown_function(array(__CLASS__, 'onShutDown'));

        if(file_exists(System::Path('plugins').'javalyssmarket/market.php')){
            include_once(System::Path('plugins').'javalyssmarket/market.php');
        }
        //
        // Requete CRON
        //
        if(Cron::HaveProcess()){
            Plugin::Import();
            Cron::ExecProcess();
            exit();
        }

        self::DecodeFields();
        //
        // ROUTES
        //
        \HTTP\Route::UseMiddleware('/admin', function($request, &$response){
            if(!\System\User::IsConnect()){//utilisateur déconnecté
                $response->location(System::Path('uri') . 'admin?redir=' . rawurlencode(Permalink::Get()));
                return true;
            }
        });

        \HTTP\Route::When('themes/compile/:arg1/:arg2?/:arg3?', function($request, &$response){
            System::CompileCSS();
            exit();
        });

        \HTTP\Route::When('ajax/connected', function($request, &$response){
            if(!\System\User::IsConnect()){//utilisateur déconnecté

                $response->send(401, 'API require user authentified');

                return true;
            }

            if(@System::GetCMD() == ''){
                $response->send(403, 'Command unitialized');
                return true;
            }

            System::Ajax(System::CNT, $request, $response);
        });

        \HTTP\Route::When('adminajax/', function($request, &$response){
            if(!\System\User::IsConnect()){//utilisateur déconnecté

                $response->send(401, 'API require user authentified');

                return true;
            }

            if(@System::GetCMD() == ''){
                $response->send(403, 'Command unitialized');
                return true;
            }

            System::Ajax(System::CNT, $request, $response);
        });

        \HTTP\Route::When('ajax', function($request, &$response){

            if(@System::GetCMD() == ''){
                $response->send(403, 'Command unitialized');
                return true;
            }

            System::Ajax(System::SAFE, $request, $response);
        });

        //\HTTP\Route::When('admin/account', array('System', 'onRouteAccount'));

        //Interface ROUTE
        \HTTP\Route::WhenGet('admin/system/info', function($request, &$response){
            System::iDie();
            $response->json(System::Get());
        });

        \HTTP\Route::WhenPost('admin/system/cron/start', function($request, &$response){
            Cron::Path(System::Path('private'));

            if(!Cron::IsStarted()){
                Cron::Start();

            }

            System::Fire('system:cron.start');

            $response->send(200, "Cron started");
        });

        \HTTP\Route::WhenPost('admin/system/cron/stop', function($request, &$response){
            Cron::Stop();

            $response->send(200, "Cron stopped");
        });

        \HTTP\Route::WhenGet('admin/system/cron/info', function($request, &$response){
            $response->json(Cron::GetInfo());
        });

        \HTTP\Route::WhenGet('admin/system/cron/tasks', function($request, &$response){
            $response->json(Cron::GetTask());
        });

        \HTTP\Route::WhenGet('admin/system/cron/statut', function($request, &$response){
            if(Cron::IsStarted()){
                $response->send("started");
            }else{
                $response->send("stopped");
            }
        });

        \HTTP\Route::WhenPut('admin/system/meta/:key', function($request, &$response){
            $response->json(200, System::Meta($request->params->key, $request->body['value']));
        });

        \HTTP\Route::WhenGet('admin/system/meta', function($request, &$response){
            $response->json(200, System::Meta($request->params->key));
        });

        \HTTP\Route::WhenGet('admin/system/update', function($request, &$response){
            System::Configure();
            $response->json(200, 'Updated');
        });

        \System\User::Initialize();
        \System\User\Role::Initialize();
        \System\Search::Initialize();
        //
        // Inclusion des plugins
        //
        Plugin::Import();

        \HTTP\Route::Otherwise(array('System', 'Otherwise'));
    }

    public static function Otherwise($request, &$response){
        if(self::IsAjaxRequest()){
            self::Ajax(self::AjaxType(), $request, $response);
            return;
        }

        self::Fire('system:admin');
        //new event
        self::Fire('system:startinterface');

        if(!self::IsStopEvent()){ //préparation de la page ADMIN

            if(!\System\User::IsConnect()){
                self::Fire('system:connexion');

                if(!self::IsStopEvent()){
                    include('themes/system/index.php');
                }
                exit();
            }

            $mode = System::Meta('MODE_DEBUG');

            self::EnqueueScript('prototype');

            if(\System\User::IsConnect() && $mode){

                self::EnqueueScript('extends', '$path/window/extends.js', 'lang='.strtolower(self::GetLang()));
                self::EnqueueScript('window', '$path/window/window.js');

            }else{
                self::EnqueueScript('extends', '', 'lang='.strtolower(self::GetLang()));
                self::EnqueueScript('window');
            }

            self::EnqueueScript('window.filemanager');
            self::EnqueueScript('jquery');

            include('themes/system/admin.php');
        }

        exit();
    }

    static public function StartInterface(){

        self::Update();

        \HTTP\Route::Fire();

        //
        //vérification de la requête
        //
        //if(self::IsAjaxRequest()){
        //    self::Ajax(self::AjaxType());
        //    return;
        //}
        //
        //routine de mise à jour
        //
       /* self::Update();
        //
        // Detection des ressources CSS à compiler.
        //
        if(self::IsCompileCSSRequest()){
            self::CompileCSS();
            return;
        }

        if(!self::IsAdminPageRequest()){

            self::fire('system:index');

            if(self::IsStopEvent()){
                exit();
            }
        }

        //deprecated
        self::fire('system:admin');
        //new event
        self::Fire('system:startinterface');

        if(!self::IsStopEvent()){ //préparation de la page ADMIN

            if(!\System\User::IsConnect()){
                self::Fire('system:connexion');

                if(!self::IsStopEvent()){
                    include('themes/system/index.php');
                }
                exit();
            }

            $mode = System::Meta('MODE_DEBUG');

            self::EnqueueScript('prototype');

            if(\System\User::IsConnect() && $mode){

                self::EnqueueScript('extends', '$path/window/extends.js', 'lang='.strtolower(self::GetLang()));
                self::EnqueueScript('window', '$path/window/window.js');

            }else{
                self::EnqueueScript('extends', '', 'lang='.strtolower(self::GetLang()));
                self::EnqueueScript('window');
            }

            self::EnqueueScript('window.filemanager');
            self::EnqueueScript('jquery');

            include('themes/system/admin.php');
        }*/
    }
    /**
     * System.Header() -> void
     * Cette méthode créee l'entête du Blog.
     * fires planning:header
     *
     * Cette méthode construit l'entête de la page.
     **/
    static public function Header(){

        echo "\n<!-- plugins:css -->\n"
            . self::PrintCSS()
            . "<!-- endplugins:css -->\n"
            . "\n<!-- lib:js -->\n"
            . self::PrintLibrairiesScript(self::$Script)
            . "<!-- endlib:js -->\n"
            . "\n<!-- system:js -->\n"
            .  self::PrintSystemScript()
            . "<!-- endsystem:js -->\n"
            . "\n<!-- plugins:js -->\n"
            . self::PrintExternalScript(self::$Script)
            . "<!-- endplugins:js -->\n"
            . "\n<!-- raw -->\n";

        self::Fire('system:header');

        echo "\n<!-- endraw -->\n";
    }
    /**
     * System.Get() -> void
     * Cette méthode créee l'entête du Blog.
     * fires planning:header
     *
     * Cette méthode construit l'entête de la page.
     **/
    public static function Get(){

        $options =			new stdClass();
        $options->User = 	\System\User::Get()->toObject();
        $options->Roles = 	\System\User\Role::GetList();
        $options->Plugins = Plugin::GetList();

        return $options;
    }

    /**
     * System.eDie(error [, options]) -> void
     * - error (String): Code de l'erreur.
     * - options (Object): Données à transmettre.
     *
     * Cette méthode affiche un rapport d'erreur vers le buffer et arrête la propagation du système.
     **/
    public static function eDie($errCode, $options = NULL){

        $obj = 			new stdClass();
        $obj->error = 	$errCode;
        $obj->cmd =		self::GetCMD();
        $obj->options =	$options;
        $obj->parameters =	$_POST;

        $err = 			utf8_encode(Sql::Current()->getError());

        if($err){
            $obj->query = 		Sql::Current()->getRequest();
            $obj->queryError = 	"".$err;
        }

        if(empty($_REQUEST['callback'])){
            die(json_encode($obj));
        }else{
            die(@$_REQUEST['callback'].'('.json_encode($obj).')');
        }
    }
    /**
     * System.Ajax([mode]) -> void
     *
     * Cette méthode execute les procedures en provenance d'AJAX.
     **/
    public static function Ajax($mode = System::SAFE, $request = '', &$response = ''){

        SystemBuffer::Start("ob_gzhandler");

        self::$Error = 0;
        //Vérification de la commande


        //Exception de vérification d'instance
        switch(self::GetCMD()){
            case 'user.demo.connect':
                \System\User::exec('user.demo.connect');
                break;
            case 'user.connect':
            case 'system.connect':
                \System\User::exec('user.connect');
                break;
            case 'user.disconnect':
            case 'system.disconnect':
                \System\User::exec('system.disconnect');
                break;
            case 'user.send.password':
            case 'user.password.send':
                \System\User::exec('user.send.password');
                break;
            default:

                switch($mode){
                    case self::SAFE:
                        self::Error(self::Fire('gateway.safe.exec', array(self::GetCMD())));
                        break;
                    case self::CNT:

                        self::Error(self::Fire('gateway.exec', array(self::GetCMD())));

                        \System\User::Set();
                        break;
                }

                //traitement d'erreur éventuelle
                if("". self::Error() != "0"){
                    $str = \System\Buffer::GetClean();
                    \System\Buffer::Start("ob_gzhandler");
                    self::eDie(self::Error(), str_replace("\n", '<br>', $str));
                }
        }

        if(empty($_REQUEST['callback'])){
            $response->send(200, \System\Buffer::GetClean());
        }else{//retour JSONP

            $str = \System\Buffer::GetClean();

            if(!is_numeric($str) && !preg_match('/^["\[{]/', $str)){
                $str = '"'.$str.'"';
            }

            \System\Buffer::Start("ob_gzhandler");

            echo @$_REQUEST['callback'].'('.$str.')';

            $response->end();

            \System\Buffer::EndFlush();
        }
    }
    /**
     * System.Configure() -> void
     *
     * Cette méthode configure et effectue la mise à jour de la base de données.
     *
     * <p class="note">Cette méthode utilise le fichier update.sxml présent dans le dossier inc/conf/default pour mettre à jour la base de données.</p>
     **/
    public static function Configure(){
        self::ParseSXML(System::Path('conf').'/default/update.sxml');
        System::fire('plugin.configure');
        return true;
    }
    /**
     * System.onSelectDB(sql) -> Boolean
     *
     * Cette méthode permet de selectionner une base de données à partir de son nom.
     **/
    public static function onDBSelect($sql){

        if(is_array($sql->getDatabase())){
            $dbinfo = $sql->getDatabase();
        }else{
            $dbinfo = self::$DB_VERSION[$sql->getDatabase()];
        }

        $sql->setLogin($dbinfo['login']);
        $sql->setPassword($dbinfo['pass']);
        $sql->setHost($dbinfo['host']);
        $sql->setDatabase($dbinfo['db'], false);

        if(self::$DB_VERSION['Clients Master']['host'] == self::$DB_VERSION[NAME_VERSION]['host']){
            return false;
        }

        $sql->connect();

        return true;
    }

    /**
     * System.Error() -> String
     * System.Error(err) -> String
     **/
    public static function Error($err = NULL){

        if($err != NULL){
            self::$Error = $err;
        }

        return self::$Error;
    }
    /**
     * System.FixRight([folder]) -> void
     *
     * Cette méthode fixe les problèmes de droits d'accès aux dossiers et fichiers.
     **/
    public static function FixRight($folder = ABS_PATH){

        $list = new StreamList($folder, NULL, NULL, array());

        if(!$list->current()){
            return;
        }

        do{
            $file = new File($folder . $list->current());
            if($file->equals(ABS_PATH)) continue;
            if($file->contain('old')) continue;

            if($file->isDir()){
                //if($file->contain('public')){
                chmod($file, 0711);
                echo '<strong>chmod</strong> <span style="color:red">'.$file ."</span> <strong style=\"color:#069\">0711</strong><br>";
                //}else{
                //	chmod($file, 0775);
                //	echo '<strong>chmod</strong> <span style="color:red">'.$file ."</span> <strong style=\"color:#069\">0775</strong><br>";
                //}

                self::FixRight($file.'/');

            }//else{
            //	chmod($file, 0664);
            //	echo '<strong>chmod</strong> <span style="color:red">'.$file ."</span> <strong style=\"color:#069\">0664</strong><br>";
            //}

        }while($list->next());
    }
    /**
     * System.HasRight() -> void
     *
     * Cette méthode teste le niveau de droit d'accès de l'utilisateur connecté. Si l'utilisateur
     * ne dispose pas des privilères suffisant la méthode émettera une erreur de type `die()` et ayant pour valeur `system.user.noright`.
     **/
    static public function HasRight($lvl, $user = NULL){
        System::iDie();

        if($user != NULL){
            if(\System\User::Get()->getID() == $user->User_ID) return true;

            if(\System\User::Get()->getRoleParent()->getID() > $user->getRoleParent()->getID()) {
                return false;
            }
        }

        if(\System\User::Get()->getRoleParent()->getID() > $lvl) {
            return false;
        }

        return true;
    }
    /**
     * System.IsAjaxRequest() -> Boolean
     *
     * Cette méthode si il s'agit de requête AJAX.
     **/
    public static function IsAjaxRequest(){
        $link = new Permalink();
        return $link->strEnd('/ajax') || $link->strEnd('/ajax/connected') || $link->strEnd('/adminajax') || $link->strStart('gateway.php', false) || $link->strStart('gateway.safe.php', false);
    }
    /**
     * System.AjaxType() -> String
     *
     * Cette méthode détecte le type de connexion AJAX souhaitée.
     **/
    public static function AjaxType(){
        $link = new Permalink();
        return $link->strEnd('/ajax/connected') || $link->strStart('gateway.php', false) ? self::CNT : self::SAFE;
    }
    /**
     * System.IsCompileCSSRequest() -> Boolean
     *
     * Cette méthode indique si il s'agit d'une demande de récupération du fichier des icônes.
     **/
    public static function IsCompileCSSRequest(){
        $link = new Permalink();

        if($link->strStart('themes/window.css.php', false)){
            $path = '';
            $theme = empty($_GET['themes']) ? 'system' : $_GET['themes'];

            if(strpos($theme, '/') !== false){
                $theme = 	'custom';
                $path = 	str_replace('../', '', $_GET['themes']);
            }

            header('Location:'.URI_PATH.'themes/compile/' . $theme . '/window/minified/' . $path);
            exit();
        }

        return $link->strStart('themes/compile', false);
    }
    /**
     * System.IsAdminPageRequest() -> Boolean
     *
     * Cette méthode indique si il s'agit d'une requête de lancement de la page d'administration du logiciel.
     **/
    public static function IsAdminPageRequest(){
        $link = new Permalink();

        return $link->strStart('admin', false) || $link->strStart('index_admin.php', false);
    }
    /**
     * System.OnShutDown() -> void
     **/
    public static function OnShutDown(){
        @session_start();
        if(!is_string(@$_SESSION['User'])){
            $_SESSION['User'] = @serialize($_SESSION['User']);
        }
        session_commit();
    }
    /**
     * System.Update() -> Boolean
     *
     * Cette méthode lance la routine de mise à jour du système. Si la méthode retourne `true`, cela indique
     * que la routine a effectué une mise à jour du logiciel.
     **/
    public static function Update(){

        if(CODE_VERSION.CODE_SUBVERSION > System::Meta('CODE_VERSION').System::Meta('CODE_SUBVERSION')) {
            //
            // Configuration de la base de données.
            //
            self::Configure();

            if(System::Meta('LINK_MARKET') == 'http://server.javalyss.fr/gateway.safe.php' || System::Meta('LINK_MARKET') == 'http://javalyss.fr/gateway.safe.php'){
                System::Meta('LINK_MARKET', 'http://javalyss.fr/ajax/');
            }
            //
            // Mise à jour du numéro de version, de la date de mise à jour et de l'historique des mises à jour.
            //
            self::Meta('UPDATE_STORY', '');
            self::Meta('CODE_VERSION', CODE_VERSION);
            self::Meta('CODE_SUBVERSION', CODE_SUBVERSION);
            self::Meta('DATE_VERSION', DATE_VERSION);

            return true;
        }
        //
        // Création des fichiers nécessaires à Javalyss
        //
        self::WriteHTACCESS();

        return false;
    }
    /**
     * System.CronStart() -> void
     * Cette méthode lance le gestionnaire des tâches périodique.
     **/
    public static function CronStart(){
        Cron::Path(self::Path('private'));

        if(!Cron::IsStarted()){
            Cron::Start();

        }

        self::Fire('system:cron.start');
    }
    /**
     * System.exec(command) -> int
     * - command (String): Commande à exécuter.
     *
     * Cette méthode `static` exécute une commande envoyée par l'interface du logiciel.
     *
     * #### Liste des commandes gérées par cette méthode
     *
     * Les commandes suivantes utilisent des champs spécifiques :
     *
     * * `system.init` : Initialise le système et renvoi les informations vers l'interface.
     * * `system.connect` : Etablie une connexion avec un utilisateur. Les champs `$_POST['Login']` et `$_POST['Password']` doivent être utilisé.
     * * `system.disconnect` : Déconnecte l'utilisateur du logiciel.
     * * `system.feed.get` : Récupère un flux RSS d'un serveur distant. Mentionnez l'addresse du flux dans `$_POST['Uri']`.
     *
     * Les commandes suivantes utilisent le champs `$_POST['meta']` :
     *
     * * `system.metas.commit` : Enregistre les informations méta du système.
     * * `system.meta.commit` : Enregistre une information méta.
     *
     **/
    public static function exec($cmd){

        switch($cmd){
            //---------------------------------------------------------------------------
            //Gestion System-------------------------------------------------------------
            //---------------------------------------------------------------------------
            case 'system.fix.right':
                self::HasRight(1);
                self::FixRight();
                chmod(System::Path('publics'), 0751);
                chmod(System::Path('publics').'cache/', 0711);
                chmod(System::Path('self').'inc/', 0711);
                chmod(System::Path('themes').'inc/', 0711);
                chmod(System::Path('js').'inc/', 0711);
                chmod(System::Path('private'), 0700);

                break;
            //---------------------------------------------------------------------------
            // /!\ Gestion des flux RSS--------------------------------------------------
            //---------------------------------------------------------------------------
            case 'system.feed.get':
                echo json_encode(Stream::Feed(rawurldecode($_POST['Uri'])));
                break;
            //---------------------------------------------------------------------------
            // /!\ Gestion sauvegarde----------------------------------------------------
            //---------------------------------------------------------------------------
            case 'system.table.list':
                self::HasRight(1);
                echo json_encode(self::ShowTable());
                break;

            case 'system.file.import':
                return self::Import();

            case 'system.file.export':
                set_time_limit(0);
                ignore_user_abort(true);

                $file = self::Export(ObjectTools::DecodeJSON($_POST['List']), @$_POST['Compile']);

                if(!$file){
                    return 'system.file.export.err';
                }

                echo json_encode(File::ToURI($file));

                break;

            case 'system.create.archive':
                self::HasRight(1);
                set_time_limit(0);
                ignore_user_abort(true);

                $datedep = microtime(true);

                self::Compile($_POST['options']->value, $_POST['options']->version, $_POST['options']->op);

                $dateret = microtime(true);
                $diff = round(($dateret - $datedep) * 100) / 100;

                echo "Archive créée en ". $diff ." secondes dans votre dossier \"public\".";

                break;
            //---------------------------------------------------------------------------
            // /!\ Gestion Application---------------------------------------------------
            //---------------------------------------------------------------------------
            //envoi d'un rapport d'erreur vers le serveur Javalyss.
            /*case 'system.crash.send':
                $crash = $_POST['CrashRepport'];

                echo Stream::Post(LINK_MARKET, array(
                    'cmd'=> 				'depot.crash.add',
                    'Name' => 				CORE_BASENAME,
                    'Version' => 			CODE_VERSION.CODE_SUBVERSION,
                    'CrashRepport' => 		json_encode($_POST['CrashRepport'])
                ));

                break;*/

            //Récupération d'une page du guide utilisateur.
            /*case 'system.manuel.get':
                //var_dump($_POST['Man_ID']);
                //var_dump(CORE_BASENAME);
                echo Stream::Post(LINK_MARKET, array(
                    'cmd'=> 				'depo.manuel.get',
                    'Name' => 				CORE_BASENAME,
                    'Version' => 			CODE_VERSION.CODE_SUBVERSION,
                    'Man_ID' => 			$_POST['Man_ID'],
                    'options' =>			json_encode($_POST['options'])
                ));

                break;*/
        }


        return 0;
    }
}