<?php
/** section: Core
 * class SystemIO
 * includes SystemIncluder
 * Cette classe gère l'écriture et lecture de flux.
 **/
require_once('abstract_system_includer.php');

abstract class SystemIO extends SystemIncluder{
    /**
     * System.sDie() -> void
     *
     * Emet une erreur si le mode d'installation n'est pas initialisé lors de l'utilisation de cette méthode.
     **/
    public static function sDie(){
        if(defined('MODE_INSTALL')){
            if(!MODE_INSTALL){
                self::eDie('system.install.write.config.err');
            }
        }else {
            self::eDie('system.install.write.config.err');
        }
    }
    /**
     * System.Compile(filename, version [, options]) -> String
     *
     * Cette méthode créée une archive du logiciel.
     *
     * #### Les options
     *
     * * -noicon : Créée une archive sans les icônes. Les icônes seront téléchargées automatiquement depuis le serveur Javalyss.
     * * -icon : Créée une archive avec les icônes.
     *
     **/
    public static function Compile($file, $version, $options = '-noicon'){
        $tmp = self::Path(). '/compile/';
        @Stream::MkDir($tmp);

        switch(@$options){
            case '-all':
                Stream::Copy(ABS_PATH, $tmp, '/^\.svn|\.yaml$|\.bak$|\.git$|\.SyncTrach$|\.SyncID$|\.SyncIgnore$|\.ini$|zipsys|compile|old|archives$|private$|psd$|\.db$|_notes|\.sxmllog$|sitemap\.xml|doc\/php$|doc\/js$/');
                break;
            case '-icon':
            case '-c':
                Stream::Copy(ABS_PATH, $tmp, '/^\.svn|\.yaml$|\.bak$|\.git$|\.SyncTrach$|\.SyncID$|\.SyncIgnore$|zipsys|compile|private$|public$|plugins$|psd$|\.db$|_notes$|themes$|doc\/php$|doc\/js$/');
                Stream::Delete($tmp.'inc/conf/conf.soft.php');
                Stream::Delete($tmp.'inc/conf/conf.db.php');
                Stream::Delete($tmp.'inc/conf/conf.file.php');
                break;
            default:
            case '-noicon':
            case '-ic':
                Stream::Copy(ABS_PATH, $tmp, '/^\.svn|\.yaml$|\.bak$|\.git$|\.SyncTrach$|\.SyncID$|\.SyncIgnore$|\.ini$|zipsys|compile|old|archives$|private$|public$|plugins$|psd$|sitemap\.xml|doc\/php$|\.db$|_notes$|themes$|doc\/js$/');
                Stream::Delete($tmp.'inc/conf/conf.soft.php');
                Stream::Delete($tmp.'inc/conf/conf.db.php');
                Stream::Delete($tmp.'inc/conf/conf.file.php');
                break;
        }

        $flag = '/^\.svn|\.yaml$|\.bak$|\.git$|\.SyncTrach$|\.SyncID$|\.SyncIgnore$|\.ini$|zipsys|compile|old|archives$|private$|public$|plugins$|psd$|\.db$|_notes$|sitemap\.xml|doc\/php$|doc\/js$/';

        @Stream::Delete($tmp.'.htaccess');
        @Stream::Delete($tmp.'robots.txt');

        Stream::Copy(self::Path('js').'tiny_mce/plugins/', $tmp.'js/tiny_mce/plugins/');
        Stream::Copy(self::Path('js').'window/plugins/', $tmp.'js/window/plugins/');

        @Stream::MkDir($tmp.'themes/', 0751);
        @Stream::MkDir($tmp.'themes/window/', 0751);
        @Stream::MkDir($tmp.'themes/plugins/', 0751);

        Stream::Copy(self::Path('themes').'window/plugins/', $tmp.'themes/window/plugins/');

        Stream::Copy(self::Path('themes').'window/', $tmp.'themes/window/', $flag);
        Stream::Copy(self::Path('themes').'system/', $tmp.'themes/system/', $flag);
        Stream::Copy(self::Path('themes').'system.min.css', $tmp.'themes/system.min.css', $flag);

        //
        // Intégration des packets complémentaires.
        //
        @Stream::MkDir($tmp.'plugins/', 0751);
        Stream::Copy(self::Path('plugins').'javalyssmarket/', $tmp.'plugins/javalyssmarket/', '/^\.svn|\.yaml$|\.bak$|\.git$|\.ini$|zipsys|compile|old|archives$|private$|public$|plugins$|psd$|\.db$|_notes|\.sxmllog$|\.zip$|sitemap\.xml/');

        if($version){

            $subversion = 	substr($version, 3, strlen($version) -1);
            $version =		substr($version, 0, 3);

            $str = Stream::Read(self::Path('conf').'/default/conf.schemes.php');

            $str = str_replace(array(
                    '#NAME_VERSION',
                    '#CORE_BASENAME',
                    '#NAME_CLIENT',
                    '#CODE_VERSION',
                    '#CODE_SUBVERSION',
                    '#DATE_VERSION'
                ),
                array(
                    CORE_BASENAME,
                    CORE_BASENAME,
                    '',
                    $version,
                    $subversion,
                    date('Y-m-d')
                ), $str);

            Stream::Write($tmp.'inc/conf/default/conf.install.php', $str);
        }

        Stream::Package($tmp, $file = self::Path('publics').$file.'_'.date('Y-m-d').'.zip');
        Stream::Delete($tmp);

        return $file;
    }
    /**
     * System.GetCMD() -> String
     *
     * Cette méthode retourne la valeur du champs `cmd` stocké dans POST.
     **/
    static public function GetCMD(){
        if(empty($_POST['cmd'])){
            $_POST['cmd'] = '';

            if(!empty($_GET['cmd'])){
                foreach($_GET as $key => $value){
                    $_POST[$key] = $value;
                }

            }elseif(!empty($_GET['op'])){
                $_POST['op'] = $_GET['op'];
            }elseif(!empty($_POST['op'])){
                $_POST['cmd'] = $_POST['op'];
            }
        }
        return 	@$_POST['cmd'] ? $_POST['cmd'] : '';
    }
    /**
     * System.DecodeFields() -> void
     * Cette méthode décode les champs POST, GET, COOKIE et REQUEST.
     **/
    public static function DecodeFields(){

        //post
        foreach($_POST as $key => $value){

            switch($key){
                default:
                    $_POST[$key] = ObjectTools::RawUrlDecode($_POST[$key]);
                    break;

                case 'word':
                    if(!empty($_POST[$key])){
                        $_POST[$key] = ObjectTools::RawUrlDecode($_POST[$key]);
                    }
                    break;

                case 'options':
                    if($_POST[$key] == 'undefined'){
                        $_POST[$key] = '';
                    }else{

                        $_POST[$key] = ObjectTools::DecodeJSON($_POST[$key]);

                        if(is_string($_POST[$key])) {
                            $o = new stdClass();
                            $o->op = $_POST[$key];
                            $_POST[$key] = $o;
                        }
                    }
                    break;

                case 'clauses':
                case 'meta':
                    if($_POST[$key] == 'undefined'){
                        $_POST[$key] = '';
                    }else{
                        //var_dump($_POST[$key]);
                        $_POST[$key] = ObjectTools::DecodeJSON($_POST[$key]);
                    }
                    break;
            }
        }

        if(empty($_POST['clauses'])){
            $_POST['clauses'] ='';
        }


        if(empty($_POST['options'])){
            $_POST['options'] = 		new stdClass();
            $_POST['options']->op = 	'';
        }

        if(empty($_POST['meta'])){
            $_POST['meta'] = '';
        }

        //GET
        foreach($_GET as $key => $value){
            switch($key){
                default:
                    $_GET[$key] = ObjectTools::RawUrlDecode($_GET[$key]);
                    break;

                case 'word':
                    if(!empty($_GET[$key])){
                        $_GET[$key] = ObjectTools::RawUrlDecode($_GET[$key]);
                    }
                    break;

                case 'options':
                    if($_GET[$key] == 'undefined'){
                        $_GET[$key] = '';
                    }else{
                        $_GET[$key] = ObjectTools::DecodeJSON($_GET[$key]);

                        if(is_string($_POST[$key])) {
                            $o->op = $_POST[$key];
                            $_POST[$key] = $o;
                        }
                    }
                    break;

                case 'clauses':
                case 'meta':
                    if($_GET[$key] == 'undefined'){
                        $_GET[$key] = '';
                    }else{
                        $_GET[$key] = ObjectTools::DecodeJSON($_GET[$key]);
                    }
                    break;
            }
        }

        if(empty($_GET['clauses'])){
            $_GET['clauses'] ='';
        }

        if(empty($_GET['options'])){
            $_GET['options'] = 		new stdClass();
            $_GET['options']->op = 	'';
        }

        if(empty($_GET['meta'])){
            $_GET['meta'] = '';
        }

        //COOKIE
        foreach($_COOKIE as $key => $value) $_COOKIE[$key] = ObjectTools::RawUrlDecode($value);
        //REQUEST
        foreach($_REQUEST as $key => $value) $_REQUEST[$key] = ObjectTools::RawUrlDecode($value);

    }
    /**
     * System.Download(url) -> String | Number | Object | Array
     * - url (String): Lien du fichier à récupérer depuis un serveur distant.
     *
     * Cette méthode télécharge un fichier et le stocke dans le dossier public
     **/
    public static function Download($url){
        return Stream::Download($url, self::Path());
    }
    /**
     * System.Dump() -> String
     *
     * Cette méthode sauvegarde la base de données du logiciel dans un fichier `.sql`.
     **/
    public static function Dump($list = NULL){

        $request = 	new Request();
        $str = 		$request->exec(Request::DUMP, $list);

        if(!$str) return false;

        $filename = self::Path('private').'bck_db_'.date("Y_m_d_H_i_s").'.sql';

        Stream::Write($filename, $str);

        return $filename;
    }
    /**
     * System.Import() -> void
     *
     * Cette méthode importe une sauvegarde de la base de données.
     **/
    protected static function Import(){
        self::iDie();

        FrameWorker::Start();

        //récupération du fichier
        FrameWorker::Draw('upload -o="'.self::Path('private').'"');

        $file = FrameWorker::Upload(self::Path('private'), System::Meta('EXT_FILE_AUTH'), System::Meta('EXT_FILE_EXCLUDE'));

        FrameWorker::Draw('sql dump database');
        //sauvegarde préalable de la base de données.
        self::Dump();

        //vérification du fichier, suppression des anciennes entrées et importation des données.
        switch(Stream::Extension($file)){
            case 'zip':
                Stream::Depackage($file, ABS_PATH.PATH_PLUGIN);
                $file = str_replace('.zip', '.sql', $file);

            case 'sql':

                $request = 	new Request();
                $result = 	System::ShowTable();

                FrameWorker::Draw('sql show table');
                /*
                for($i = 0; $i < $result['length']; $i++){
                    $request->query = 'TRUNCATE TABLE '.$result[$i]['text'];

                    FrameWorker::Draw('sql truncate -t='.$result[$i]['text']);

                    if(!$request->exec('query')){
                        FrameWorker::Draw($request->getError());
                    }
                }*/

                echo Stream::ParseSQL($file);

                break;
        }

        FrameWorker::Stop();
        return 0;
    }
    /**
     * System.Export(list [, dumpfile]) -> void
     *
     * Cette méthode crée une sauvegarde de la base de données et l'envoi vers le poste client.
     **/
    protected static function Export($list, $dumpfile = 0){
        self::HasRight(1);

        switch($fl = self::Dump($list)){
            case 'system.initerr':
            case 'system.usernoright':
            case 'system.file.export.err':
                return false;
        }

        $tmp = self::Path('publics').'compile/';
        Stream::MkDir($tmp, 0700);

        @Stream::Delete($tmp.'backup_db.sql');

        Stream::Copy($fl, $tmp.'backup_db.sql');

        if(!empty($dumpfile)){
            $file = self::Compile('javalyss_leckye_'.CODE_VERSION.CODE_SUBVERSION, CODE_VERSION.CODE_SUBVERSION);
        }else{
            $file = self::Path('publics').'backup_db_'.date('Y-m-d').'.sql.zip';
            Stream::Package($tmp, $file);
            @Stream::Delete($tmp);
        }

        return $file;
    }
    /**
     * System.ParseSXML(file) -> Boolean
     * - file (String): Nom du fichier SXML à parser.
     *
     * Cette méthode parse et execute un fichier SXML.
     **/
    public static function ParseSXML($file, $db = ''){
        if(!file_exists($file)){
            return;
        }
        $request = 	new Request($db);
        $array = 	Stream::ParseXML($file);

        $querylog = new XmlNode();
        $querylog->Name = 'sql';

        $ok = new XmlNode();
        $ok->Name = 'ok';

        $warning = new XmlNode();
        $warning->Name = 'warning';

        $fail = new XmlNode();
        $fail->Name = 'fail';

        if(empty($array)) return true;
        if(empty($array['sql'])) return true;
        if(empty($array['sql']['query'])) return true;

        if(is_string($array['sql']['query'])){
            $array['sql']['query'] = array($array['sql']['query']);
        }

        foreach($array['sql']['query'] as $query){
            $query = trim(str_replace('#PRE_TABLE', PRE_TABLE, $query));
            if(empty($query)) continue;
            if(preg_match_all('/\[\[(.*)\]\]/', $query, $matches)){
                for($i = 0, $len = count($matches[0]); $i < $len; $i++){
                    if(defined($matches[1][$i])){
                        $query = str_replace($matches[0][$i], constant($matches[1][$i]), $query);
                    }
                }
            }

            if(preg_match_all('/\[serialize\[(.*)\]\]/', $query, $matches)){
                for($i = 0, $len = count($matches[0]); $i < $len; $i++){
                    if(defined($matches[1][$i])){
                        $query = str_replace($matches[0][$i], serialize(Sql::EscapeString(constant($matches[1][$i]))), $query);
                    }
                }
            }

            $request->query = $query;

            if(preg_match('/(TRY )/i', $request->query, $match)){//indique que la requête ne doit pas bloquer le script
                $request->query = str_replace($match[1], '', $request->query);

                if(!$request->exec('query')){
                    $o = new XmlNode('query');
                    $o->Text = $request->getError();
                    $warning->push($o);

                }else{
                    $o = new XmlNode('query');
                    $o->Text = $request->query;

                    $ok->push($o);
                }

            }else{

                if(!$request->exec('query')){

                    $o = new XmlNode('query');
                    $o->Text = $request->getError();
                    $fail->push($o);

                    $querylog->push($ok);
                    $querylog->push($warning);
                    $querylog->push($fail);

                    Stream::WriteXML($file.'log', $querylog);

                    return false;
                }else{
                    $o = new XmlNode('query');
                    $o->Text = $request->query;

                    $ok->push($o);
                }
            }
        }

        //écriture du fichier log
        $querylog->push($ok);
        $querylog->push($warning);
        $querylog->push($fail);

        Stream::WriteXML($file.'log', $querylog);

        return true;
    }
    /**
     * System.ShowTable() -> Mixed
     * - eventName (String): Nom de l'événement à écouter.
     *
     * Cette méthode stop l'événement `eventName`.
     **/
    public static function ShowTable(){
        $request = new Request();
        return $request->exec(Request::SHOWTAB, array('System', 'onShowTable'));
    }

    public static function onShowTable(&$row){
        $row['text'] = $row['value'] = current($row);
    }
    /**
     * System.Upload(file) -> String
     * - file (FILES): Tableau de données du fichier envoyé et stocké dans `$_FILE['nomchamp']`.
     *
     * Cette méthode charge un fichier en provenance du formulaire client.
     **/
    public static function Upload($FILES){
        return Stream::Upload($FILES, self::Path(), self::Meta('EXT_FILE_AUTH'), self::Meta('EXT_FILE_EXCLUDE'));
    }
    /**
     * System.ReadHTACCESS() -> void
     *
     * Cette méthode écrit les règles dans le fichier .htaccess du dossier racine. Si le fichier n'existe pas il sera créé.
     **/
    public static function ReadHTACCESS(){
        $home = str_replace('http://'.$_SERVER['SERVER_NAME'], '', URI_PATH);
        $file = self::Path('self').'.htaccess';

        if($home == '') $home = '/';
        $rules  = '';

        if(file_exists($file)){
            $rules = Stream::Read(ABS_PATH.'.htaccess') ."\n";
        }

        return $rules;
    }
    /**
     * System.WriteHTACCESS(str) -> void
     *
     * Cette méthode écrit les règles dans le fichier .htaccess du dossier racine. Si le fichier n'existe pas il sera créé.
     **/
    public static function WriteHTACCESS($str = NULL){

        if(!empty($str)){
            Stream::Write(ABS_PATH.'.htaccess', $str);
            return;
        }

        $rules = $oldRules = self::ReadHTACCESS();

        //expiration des fichiers
        if(!(strpos($rules, 'mod_expires.c') !== false)){
            $rules .= "\n# BEGIN Expire headers\n";
            $rules .= "<IfModule mod_expires.c>\n";
            $rules .= "ExpiresActive On\n";
            $rules .= "ExpiresDefault \"access plus 1 seconds\"\n";
            $rules .= "ExpiresByType text/css \"access plus 1 seconds\"\n";
            $rules .= "ExpiresByType text/javascript \"access plus 1 seconds\"\n";
            $rules .= "ExpiresByType text/html \"access plus 1 seconds\"\n";
            $rules .= "ExpiresByType application/xhtml+xml \"access plus 1 seconds\"\n";
            $rules .= "ExpiresByType application/javascript \"access plus 1 seconds\"\n";
            $rules .= "</IfModule>\n";
            $rules .= "# END Expire headers\n\n";
        }
        //réécriture des url
        if(!(strpos($rules, 'mod_rewrite.c') !== false)){
            $http = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
            $base = $http.str_replace('//', '/', $_SERVER['SERVER_NAME']);

            $home = str_replace($base, '', URI_PATH);
            if($home == '') $home = '/';

            $rules .= "\n# BEGIN BlogPress\n";
            $rules .= "<IfModule mod_rewrite.c>\n";
            $rules .= "RewriteEngine On\n";
            $rules .= "RewriteBase ".$home."\n";
            $rules .= "RewriteRule ^index\.php$ - [L]\n";
            $rules .= "RewriteCond %{REQUEST_FILENAME} !-f\n";
            $rules .= "RewriteCond %{REQUEST_FILENAME} !-d\n";
            $rules .= "RewriteRule . ".$home."index.php [L]\n";
            $rules .= "</IfModule>\n";
            $rules .= "# END BlogPress\n\n";
        }

        if($rules != $oldRules){
            Stream::Write(ABS_PATH.'.htaccess', trim($rules));
        }

        System::Fire('system:htaccess.write', array($rules));
    }
    /**
     * System.WriteConfig(login, pass, host, db [, pre]) -> void
     * - login (String): Identifiant de la base de données.
     * - pass (String): Mot de passe de connexion à la base de données.
     * - host (String): Nom d'hôte de la base de données.
     * - db (String): Nom de la base de données.
     *
     * Cette méthode crée le fichier de configuration du logiciel.
     **/
    public static function WriteConfig($login, $pass, $host, $db, $type, $pre = ""){

        self::sDie();

        if(!is_writable(ABS_PATH)) 				die('minsys.dir.unwritable');
        if(!is_writable(ABS_PATH.'inc/conf/')) 	die('minsys.conf.unwritable');

        //ouverture du fichier modèle
        $str = Stream::Read(ABS_PATH.'inc/conf/default/conf.db.php');

        //remplacement des chaines
        $str = str_replace('#DB_NAME', $db, $str);
        $str = str_replace('#DB_LOGIN', $login, $str);
        $str = str_replace('#DB_PASS', $pass, $str);
        $str = str_replace('#DB_HOST', $host, $str);
        $str = str_replace('#DB_TYPE', $type, $str);
        $str = str_replace('#PRE_TABLE', $pre, $str);

        Stream::Write(ABS_PATH.'inc/conf/conf.db.php', $str) or die('minsys.config.write.err');

        @Stream::MkDir(ABS_PATH.PATH_PUBLIC, 0711);
        @Stream::MkDir(ABS_PATH.PATH_PRIVATE, 0700);
        @Stream::MkDir(ABS_PATH.PATH_PLUGIN, 0751);
        @Stream::Copy(ABS_PATH.'inc/conf/default/conf.soft.php', ABS_PATH.'inc/conf/conf.soft.php');
        @Stream::Copy(ABS_PATH.'inc/conf/default/conf.cron.php', ABS_PATH.'inc/conf/conf.cron.php');
        @Stream::Copy(ABS_PATH.'inc/conf/default/conf.file.php', ABS_PATH.'inc/conf/conf.file.php');
    }
    /**
     * System.WriteDatabase() -> void
     *
     * Cette méthode installe la base de données.
     *
     * <p class="note">Cette méthode utilise le fichier install.sxml présent dans le dossier inc/conf/default pour installer le logiciel.</p>
     **/
    public static function WriteDatabase(){
        self::sDie();
        if(!self::ParseSXML(System::Path('conf').'/default/install.sxml')){
            return "query.error ".Sql::Current()->getError();
        }
        return false;
    }

}