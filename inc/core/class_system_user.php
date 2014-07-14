<?php
/** section: Core
 * class System.User
 * includes ObjectTools, iClass, iSearch
 *
 * Cette classe gère les informations d'un utilisateur du [[System]].
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_user.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
namespace System{
    define('TABLE_USER', '`'.PRE_TABLE.'users`');

    require_once('class_system_user_role.php');

    class User extends \ObjectTools implements \iClass, \iSearch{

        const PRE_OP =				'user.';
        /**
         * System.User.TABLE_NAME -> String
         * Nom de la table gérée par la classe.
         **/
        const TABLE_NAME = 			TABLE_USER;
        /**
         * System.User.PRIMARY_KEY -> String
         * Clef primaire de la table System.User.TABLE_NAME gérée par la classe.
         **/
        const PRIMARY_KEY = 		'User_ID';
        /**
         * System.User.ACCESS_ENABLE -> 0
         *
         * Compte en attente de confirmation.
         **/
        const ACCESS_WAIT = 		0;
        /**
         * System.User.ACCESS_DISABLE -> 1
         *
         * Compte bloqué.
         **/
        const ACCESS_DISABLE = 		1;
        /**
         * System.User.ACCESS_ENABLE -> 2
         *
         * Compte actif.
         **/
        const ACCESS_ENABLE = 		2;
        /**
         * System.User#User_ID -> Number
         * Numéro d'identifiant de l'utilisateur
         **/
        public $User_ID =				0;
        /**
         * System.User#Role_ID -> Number
         * Role de l'utilisateur
         **/
        public $Role_ID = 				3;
        /**
         * System.User#Civility -> String
         * Civilité de l'utilisateur
         **/
        public $Civility;
        /**
         * System.User#Name -> String
         * Nom de l'utilisateur
         **/
        public $Name =					"";
        /**
         * System.User#FirstName -> String
         * Prenom de l'utilisateur
         **/
        public $FirstName = 			"";
        /**
         * System.User#Login -> String
         * Identifiant de connexion au logiciel
         **/
        public $Login = 				NULL;
        /**
         * System.User#Password -> String
         * Mot de passe de connexion de l'utilisateur
         **/
        public $Password =				NULL;
        /**
         * System.User#EMail -> String
         * E-mail de l'utilisateur
         **/
        public $EMail =					'';
        /**
         * System.User#Phone -> String
         * Numéro de téléphone
         **/
        public $Phone =					'';
        /**
         * System.User#Mobile -> String
         * Numéro de mobile
         **/
        public $Mobile =				'';
        /**
         * System.User#Address -> String
         * Adresse de l'utilisateur
         **/
        public $Address =				'';
        /**
         * System.User#CP -> String
         * Code postal de l'utilisateur
         **/
        public $CP =					'';
        /**
         * System.User#City -> String
         * Ville de l'utilisateur.
         **/
        public $City =					'';
        /**
         * System.User#Country -> String
         * Pays de l'utilisateur.
         **/
        public $Country =				'';
        /**
         * System.User#Avatar -> String
         * Image attaché au compte de l'utilisateur.
         **/
        public $Avatar =				'';
        /**
         * System.User#Avatar16 -> String
         * Avatar du compte de l'utilisateur.
         **/
        public $Avatar16 =				'';
        /**
         * System.User#Avatar32 -> String
         * Avatar du compte de l'utilisateur.
         **/
        public $Avatar32 =				'';
        /**
         * System.User#Avatar48 -> String
         * Avatar du compte de l'utilisateur.
         **/
        public $Avatar48 =				'';
        /**
         * System.User#Last_Connexion -> String
         * Derniere connexion enregistré par le logiciel
         **/
        public $Last_Connexion =		'';
        /**
         * System.User#Is_Connect -> String
         * Etat de connexion de l'utilisateur. Si cette valeur vaut 0 alors l'utilisateur est déconnecté du logiciel.
         **/
        protected $Is_Connect = 		0;
        /**
         * System.User#Is_Active -> String
         * Indique si le compte est :
         *
         * * 0 : Le compte est en attente de confirmation.
         * * 1 : Le compte est actif.
         * * 2 : Le compte est bloqué.
         *
         **/
        public $Is_Active =  			0;
        /**
         * System.User#Meta -> String
         * Information complémentaire concernant l'utilisateur. Ces informations sont encodées au format JSON.
         **/
        public $Meta;

        private static $ConnectionChecked = false;
        /**
         * new System.User()
         * new System.User(json)
         * new System.User(array)
         * new System.User(obj)
         * new System.User(userid)
         * new System.User(login, password)
         * - json (String): Chaine de caractères JSON équivalente à une instance [[System.User]].
         * - array (Array): Tableau associatif équivalent à une instance [[System.User]].
         * - obj (Object): Objet équivalent à une instance [[System.User]].
         * - userid (int): Numéro d'identifiant d'un utilisateur. Les informations de l'utilisateur seront récupérées depuis la base de données.
         * - login (String): Pseudo d'identification.
         * - password (String): Mot de passe.
         *
         * Cette méthode créée une nouvelle instance de [[System.User]].
         *
         **/
        function __construct(){
            $numargs = func_num_args();
            $arg_list = func_get_args();

            $this->Meta = new \stdClass();

            switch($numargs){
                case 1:
                    if(is_numeric($arg_list[0])) {

                        $request = 			new \Request();
                        $request->select = 	'U.*, R.`Name` as RoleName, U.User_ID as value, CONCAT(U.Name,\' \',U.FirstName) as text, SUBSTR(U.Name, 1, 1) as Letter, Avatar as icon';
                        $request->from = 	self::TABLE_NAME.' AS U INNER JOIN '. User\Role::TABLE_NAME.' AS R ON U.'.User\Role::PRIMARY_KEY.' = R.'.User\Role::PRIMARY_KEY;
                        $request->where =	'U.' . self::PRIMARY_KEY.' = '.$arg_list[0];

                        $request->observe(array(__CLASS__, 'onGetList'));

                        $u = $request->exec('select');

                        if($u['length']){
                            $this->extend($u[0]);
                        }

                    }
                    elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
                    elseif(is_object($arg_list[0])) $this->extend($arg_list[0]);
                    elseif(is_array($arg_list[0])) $this->extend($arg_list[0]);
                    break;
                case 2:
                    $this->Login = $arg_list[0];
                    $this->Password = $arg_list[1];
                    break;
            }
        }
        /**
         * System.User.Initialize() -> void
         *
         * Cette méthode initialise les événements de la classe.
         **/
        public static function Initialize(){
            \System::Observe('gateway.exec', array(__CLASS__, 'exec'));
            \System::Observe('system.search', array('\System\User', 'Search'));
            \System::Observe('system.search.mail', array('\System\User', 'SearchMail'));

            \HTTP\Route::WhenPost('user/login', function($request, &$response){

                /*$u = new User((int) $request->params->id);

                if($u->User_ID == 0){
                    $response->send(404, 'User not found');
                }else{
                    $response->json($u);
                }*/

            });

            \HTTP\Route::WhenGet('admin/users/:id', function($request, &$response){

                $u = new User((int) $request->params->id);

                if($u->User_ID == 0){
                    $response->send(404, 'User not found');
                }else{
                    $response->json($u);
                }

            });

            \HTTP\Route::WhenDelete('admin/users/:id', function($request, &$response){

                $u = new User((int) $request->params->id);

                if(!\System::HasRight(2, $u)){
                    $response->send(403, 'You don\'t have right to delete this user');
                    exit();
                }

                if($u->User_ID == 0){
                    $response->send(404, 'User not found');
                }else{
                    if($u->delete()){
                        $response->send('Removed');
                    }else{
                        $response->send(500, 'Fatale error when remove user');
                    }
                }

            });

            \HTTP\Route::WhenPost('admin/users', function($request, &$response){

                $u = new User($request->body);

                if(!\System::HasRight(2, $u)){
                    $response->send(403, 'You don\'t have right to create an user');
                    exit();
                }

                if($u->commit()){
                    $response->json($u);
                }else{
                    $response->send(500, 'Fatale error when create user');
                }

            });

            \HTTP\Route::WhenPut('admin/users/:id', function($request, &$response){

                $u = new User($request->params->id);

                if(!\System::HasRight(2, $u)){
                    $response->send(403, 'You don\'t have right to modify an user');
                    exit();
                }

                if($u->User_ID == 0){
                    $response->send(404, 'User not found');
                }else{

                    $u->extend($request->body);

                    if($u->commit()){
                        $response->json($u);
                    }else{
                        $response->send(500, 'Fatale error when modify user');
                    }
                }

            });

            \HTTP\Route::WhenGet('admin/users', function($request, &$response){

                if(!empty($request->body['word'])){
                    if(is_object($request->body['options'])){
                        $request->body['options']->word = 	$request->body['word'];
                    }else{
                        $request->body['options'] =         new \stdClass();
                        $request->body['options']->word = 	$request->body['word'];
                    }
                }

                if(!$tab = User::GetList($request->body['clauses'], $request->body['options'])){
                    $response->send(505, 'Fatale error when get users');
                }else{
                    $response->json($tab);
                }

            });

            \HTTP\Route::WhenGet('admin/users/meta/:id/:key', function($request, &$response){

            });

            \HTTP\Route::WhenPut('admin/users/meta/:id/:key', function($request, &$response){

            });

        }
        /*
         * System.User.AddBanIP() -> void
         *
         * Cette méthode `static` ajoute l'adresse IP de l'utilisateur en cours à la liste des bannies.
         * Si cette adresse existe déjà le nombre de tentative de connexion sera incrémenté.
         **/
        static public function AddBanIP(){}
        /**
         * System.User#createAvatar() -> void
         *
         * Cette méthode créée et met en cache l'avatar du compte utilisateur en différente taille (16, 32 et 48).
         **/
        public function createAvatar($remove = false){

            $folder = \System::Path('publics').'cache/';
            @\Stream::MkDir($folder, 0711);

            if($this->Avatar != ''){
                $avatar48 = $folder . 'u' . $this->User_ID . '-48.' . \Stream::Extension($this->Avatar);
                $avatar32 = $folder . 'u' . $this->User_ID . '-32.' . \Stream::Extension($this->Avatar);
                $avatar16 = $folder . 'u' . $this->User_ID . '-16.' . \Stream::Extension($this->Avatar);

                $avatar = \File::ToABS($this->Avatar);

                if(file_exists($avatar)){

                    if($remove){
                        @\Stream::Delete($avatar48);
                        @\Stream::Delete($avatar32);
                        @\Stream::Delete($avatar16);
                    }

                    if(!file_exists($avatar48)){
                        \Stream::Copy($avatar,  $avatar48);
                        chmod($avatar48, 0775);
                        @\Stream::Resize($avatar48, 48, 48);
                        @\Stream::Resize($avatar48, 48, 48);
                    }

                    if(!file_exists($avatar32)){

                        \Stream::Copy($avatar,  $avatar32);
                        chmod($avatar32, 0775);
                        @\Stream::Resize($avatar32, 32, 32);
                        @\Stream::Resize($avatar32, 32, 32);
                    }

                    if(!file_exists($avatar16)){

                        \Stream::Copy($avatar,  $avatar16);
                        chmod($avatar16, 0775);
                        @\Stream::Resize($avatar16, 16, 16);
                        @\Stream::Resize($avatar16, 16, 16);
                    }
                }

                $this->Avatar48 = \File::ToURI($avatar48);
                $this->Avatar32 = \File::ToURI($avatar32);
                $this->Avatar16 = \File::ToURI($avatar16);
            }
        }
        /**
         * System.User.ByMail(mail) -> User | false
         * - mail (String): Adresse e-mail de l'utilisateur à rechercher.
         *
         * Cette méthode retourne une instance [[User]] en fonction de l'adresse e-mail.
         **/
        static public function ByMail($email){
            $request = 			new \Request();
            $request->select = 	'*';
            $request->from = 	self::TABLE_NAME;
            $request->where = 	"EMail = '".\Sql::EscapeString($email)."'";

            $result = $request->exec('select');

            if($result['length'] > 0){
                return new User($result[0]);
            }
            return false;
        }
        /**
         * System.User.ByLogin(login) -> User | false
         *
         * Cette méthode retourne une instance [[User]] en fonction du login.
         **/
        static public function ByLogin($login){
            $request = 			new \Request();
            $request->select = 	'*';
            $request->from = 	self::TABLE_NAME;
            $request->where = 	"Login = '".\Sql::EscapeString($login)."'";

            $result = $request->exec('select');

            if($result['length'] > 0){
                return new User($result[0]);
            }
            return false;
        }
        /**
         * System.User.ByName(nameAndFirstName) -> User | false
         * - nameAndFirstName (String): Nom et prénom de l'utilisateur à rechercher.
         *
         * Cette méthode retourne une instance [[User]] en fonction du nom et de prénom de l'utilisateur.
         **/
        static public function ByName($name){
            $request = 			new \Request();
            $request->select = 	'*';
            $request->from = 	self::TABLE_NAME;
            $request->where = 	"CONCAT(Name, ' ', FirstName) = '".\Sql::EscapeString($name)."'";

            $result = $request->exec('select');

            if($result['length'] > 0){
                return new User($result[0]);
            }
            return false;
        }
        /**
         * System.User.cDie() -> void
         *
         * Cette méthode émet une erreur de type `system.user.connection.err` et stop le script.
         * Cette erreur indique que la tentative de connexion et d'authentification au logiciel a échoué.
         **/
        public static function cDie(){
            die('system.user.connection.err');
        }
        /**
         * System.User#commit() -> Boolean
         *
         * Cette méthode enregistre les informations de la classe en base de données.
         **/
        public function commit($mail = true){

            $request = 	new \Request();
            $request->from(self::TABLE_NAME);

            if(!is_numeric($this->Role_ID)){
                $role = User\Role::ByName($this->Role_ID);
                $this->Role_ID = $role->Role_ID == 0 ? 3 : $role->Role_ID;
            }

            if($this->User_ID == 0){

                if(self::ByName($this->Name.' '.$this->FirstName)) return false;
                if(self::ByLogin($this->Login)) return false;
                if(self::ByMail($this->EMail)) return false;

                $password =			$this->Password;
                $this->Password = 	self::PasswordEncrypt($password);

                $request->insert(array(
                    'Role_ID' => 		$this->Role_ID,
                    'Civility' =>	 	$this->Civility,
                    'Name' => 			$this->Name,
                    'FirstName' => 		$this->FirstName,
                    'Login' => 			$this->Login,
                    'Password' => 		$this->Password,
                    'EMail' => 			$this->EMail,
                    'Phone' => 			$this->Phone,
                    'Mobile' => 		$this->Mobile,
                    'Address' => 		$this->Address,
                    'CP' => 			$this->CP,
                    'City' => 			$this->City,
                    'Country' => 		$this->Country,
                    'Avatar' => 		$this->Avatar,
                    'Is_Active' => 		$this->Is_Active,
                    'Meta' => 			is_object($this->Meta) ? json_encode($this->Meta) : $this->Meta
                ));

                \System::Fire('user:commit', array(&$this, &$request));

                if(!$request->exec(\Request::INS)) return false;

                $this->User_ID = $request->exec(\Request::LAST);
                $this->createAvatar();

                \System::Fire('user:commit.complete', array(&$this));

                if($mail){

                    //envoi d'un e-mail au nouveau développeur
                    $this->sendMailCreateAcccount($password);

                    if(self::Get()->User_ID == $this->User_ID){
                        self::Set($this);
                    }
                }

                return true;

            }

            $old = 				new User((int) $this->User_ID);

            if($old->Password != $this->Password){
                $this->Password = self::PasswordEncrypt($this->Password);
            }

            $request->update(array(
                'Role_ID' => 		$this->Role_ID,
                'Civility' =>	 	$this->Civility,
                'Name' => 			$this->Name,
                'FirstName' => 		$this->FirstName,
                'Login' => 			$this->Login,
                'Password' => 		$this->Password,
                'EMail' => 			$this->EMail,
                'Phone' => 			$this->Phone,
                'Mobile' => 		$this->Mobile,
                'Address' => 		$this->Address,
                'CP' => 			$this->CP,
                'City' => 			$this->City,
                'Country' => 		$this->Country,
                'Avatar' => 		$this->Avatar,
                'Is_Active' => 		$this->Is_Active,
                'Meta' => 			is_object($this->Meta) ? json_encode($this->Meta) : $this->Meta
            ))
                ->where(self::PRIMARY_KEY." = '".$this->User_ID."'");

            if($old->Avatar != $this->Avatar){
                $this->createAvatar(true);
            }

            \System::Fire('user:commit', array(&$this));

            if($result = $request->exec('update')){

                \System::Fire('user:commit.complete', array(&$this));

                if(((int) $old->Is_Active) == 0 && ((int) $this->Is_Active) == 2){

                    if($mail){
                        $this->sendMailActivateAccount();
                    }
                }

                if(self::Get()->User_ID == $this->User_ID){
                    self::Set($this);
                }

                return true;
            }

            return false;
        }
        /**
         * System.User#sendActivateMail() -> Boolean
         *
         * Cette méthode envoi un e-mail de notification indiquant au titulaire du compte que son compte a été activé par un administrateur.
         **/
        protected function sendMailActivateAccount(){
            $mail = 		new \Mail();

            $mail->setType(\Mail::HTML);

            $owner =		self::Get();

            if(!empty($owner)){
                $mail->From = 	$owner->EMail;
            }else{
                $mail->From = 	"info@" . \Permalink::Host('javalyss.fr');
            }

            $mail->addRecipient($this->EMail);

            $mail->setSubject("Confirmation d\'activation de votre compte");

            $mail->Message = '<html><title>Confirmation d\'activation de votre compte</title></head>
		<body>
			
			<p>Bonjour '.$this->Name.' '. $this->FirstName.',</p>
			<p>Votre compte utilisateur vient d\'être activé. Vous pouvez désormais vous connecter à cette adresse <a href="'.URI_PATH.'">'.URI_PATH.'</a> avec vos informations de connexion fournit dans le précèdent e-mail.</p>
			<p>&nbsp;</p>
			<p>Cordialement,<br />
			L\'équipe informatique</p>
		</body>
		</html>';

            return @$mail->send();
        }
        /**
         * System.User#sendMailCreateAcccount() -> Boolean
         *
         * Cette méthode envoi un e-mail de notification indiquant au titulaire du compte que son compte est en attente de validation par un administrateur.
         * L'administrateur reçoit lui aussi un e-mail de notification le prévenant qu'un compte doit etre validé.
         **/
        protected function sendMailCreateAcccount($password){
            $mail = 		new \Mail();

            $mail->setType(\Mail::HTML);

            $owner =		self::Get();

            if(!empty($owner)){
                $mail->From = 	$owner->EMail;
            }else{
                $mail->From = 	"info@" . \Permalink::Host('javalyss.fr');
            }

            if(!defined('URI_PATH')){
                $dir = 	dirname($_SERVER['SCRIPT_NAME']).'/';
                $uri = 	'http://'.str_replace('//', '/', $_SERVER['SERVER_NAME'].$dir);
                define('URI_PATH', $uri);
            }

            $mail->addMailTo($this->EMail);

            $mail->setSubject("Création de votre compte utilisateur");

            switch((int) $this->Is_Active){
                case 0: $string = 'en attente de validation.<br />Un e-mail de confirmation vous sera envoyé dès que votre compte sera actif';break;
                case 2: $string = 'désormais actif.'; break;
                case 1:	return true;
            }

            $mail->Message = '<html><head><title>Création de votre compte Utilisateur</title></head>
		<body>
			<p>Bonjour '.$this->Name.' '. $this->FirstName.',</p>
			
			<p>Votre compte utilisateur vient d\'être créé sur <a href="'.URI_PATH.'">'.URI_PATH.'</a> et est '. $string .'</p>
			<p>Pour rappel, vos informations de connexion sont les suivantes :</p>
			<p>Identifiant : '. $this->EMail . '</p>
			<p>Mot de passe : '. $password . '</p> 
			<p>&nbsp;</p>					
			<p>Cordialement,<br />
			L\'équipe informatique</p>
		</body>
		</html>';

            return $mail->send();
        }
        /**
         * System.User#SendMailNewPassword() -> Boolean
         *
         * Cette méthode envoi un e-mail à l'utilisateur avec son nouveau mot de passe.
         **/
        protected static function SendMailNewPassword($mail){
            if(!$user = self::ByMail($mail)){
                return 'user.email.err';
            }

            $user->generateAccess();

            $request =			new \Request();
            $request->from = 	self::TABLE_NAME;
            $request->set = 	"Password = '".self::PasswordEncrypt($user->Password)."'";
            $request->where = 	self::PRIMARY_KEY." = '".$user->User_ID."'";

            if($request->exec('update')){

                $mail = 			new \Mail();
                $mail->Subject = 	'Réinitialisation de votre mot de passe';

                $owner =			self::Get();

                if(!empty($owner)){
                    $mail->From = 	$owner->EMail;
                }else{
                    $mail->From = 	"info@" . \Permalink::Host('javalyss.fr');
                }

                $mail->addMailTo($user->EMail);

                $mail->setType(\Mail::HTML);

                $mail->Message = '
			<html><head><title>Réinitialisation de votre mot de passe</title></head>
			<body>
				<p>Bonjour '.$user->Name.' '. $user->FirstName.',</p>
				
				<p>Vous avez demandé le renouvellement de votre mot de passe pour le compte suivant :</p>
				<p>Site internet : <a href="'.URI_PATH.'">'.URI_PATH.'</a></p>
				<p>Identifiant : '. $user->EMail .'</p>
				<p>Mot de passe : '. $user->Password . '</p> 
				<p>&nbsp;</p>					
				<p>Cordialement,<br />
				L\'équipe informatique</p>
			</body>
			</html>';

                $mail->send();

                return true;
            }

            return false;
        }
        /**
         * System.User#connect() -> Boolean
         *
         * Cette méthode connecte l'utilisateur au logiciel. Les attributs [[System.User#Login]] et [[System.User#Password]] doivent être initialisé.
         * La méthode retourne vrai en cas de succès.
         *
         * <p class="note">Cette méthode emet une erreur si System.User#Login et System.User#Password sont NULL.</p>
         *
         * <p class="note">L'utilisateur peut se connecter avec son adresse e-mail à la place son identifiant.</p>
         **/
        public function connect(){
            if($this->Login == NULL && $this->Password == NULL){
                self::cDie();
            }

            $request = new \Request();

            $result = $request->select('U.*')
                ->from(self::TABLE_NAME." as U INNER JOIN ".User\Role::TABLE_NAME." as G ON U.".User\Role::PRIMARY_KEY." = G.".User\Role::PRIMARY_KEY)
                ->where("(LOWER(`Login`) LIKE  LOWER('".\Sql::EscapeString($this->Login)."') OR LOWER(`EMail`) LIKE LOWER('".\Sql::EscapeString($this->Login)."'))",
                    "`Password` LIKE  '".\Sql::EscapeString(self::PasswordEncrypt($this->Password))."'",
                    "(U.Is_Active = '2' AND G.Is_Active = '1')")->exec('select');

            if(!$result){
                \System::Configure();
                $result = $request->exec('select');
            }

            if($result['length'] == 1){

                $this->extend($result[0]);

                $result = true;

                $request->set("`Last_Connexion` = CURRENT_TIMESTAMP", "`Is_Connect` = '1'")
                    ->where(self::PRIMARY_KEY . " = '". $this->User_ID ."'")
                    ->exec('update');

                $this->Last_Connexion = date('Y-m-d H:i:s');
                $this->Is_Connect = 	1;

                $_SESSION['User'] = $this;

            }else $result = false;

            return $result;
        }
        /**
         * System.User.ConnectByPassKey(key) -> Boolean
         *
         * Cette méthode connecte l'utilisateur au logiciel grâce à une clef publique.
         **/
        static function ConnectByPassKey($passkey){

            $passkey = (string) $passkey;

            if(strlen($passkey) != 33){//erreur sur la clef
                return false;
            }

            //récupération de la clef de cryptage
            $crypt = 	1 * substr($passkey, -3);
            $passkey = 	substr($passkey, 0, 30);

            $user = 			new User();

            $request = 			new \Request();
            $result = $request->select('*')
                ->from(self::TABLE_NAME)
                ->where("SUBSTRING(MD5(CONCAT(User_ID, EMail, Login, Password, '". $crypt ."')), 1, 30) = '" . \Sql::EscapeString($passkey) ."'")
                ->exec('select');

            if($result['length'] == 1){
                $user->extend($result[0]);

                $request->set("`Last_Connexion` = CURRENT_TIMESTAMP", "`Is_Connect` = '1'")
                    ->where(self::PRIMARY_KEY . " = '". $user->User_ID ."'")
                    ->exec('update');

                $user->Last_Connexion = date('Y-m-d H:i:s');
                $user->Is_Connect = 	1;

                $_SESSION['User'] = $user;

                return true;
            }

            return false;
        }

        public function getPasskey(){
            $crypt = rand(0, 100);
            return substr(md5($this->User_ID . $this->EMail . $this->Login . $this->Password . $crypt), 0, 30) . substr('00' . $crypt, -3);
        }
        /**
         * System.User.PasswordEncrypt(password) -> String
         * - password (String): Mot de passe à encoder.
         *
         * Cette méthode encode le mot de passe du compte utilisateur.
         **/
        public static function PasswordEncrypt($p){
            return substr(md5($p), 0,15);
        }
        /**
         * System.User#delete() -> Boolean
         *
         * Cette méthode supprime les informations de la classe de la base de données.
         **/
        public function delete(){
            $request = new \Request();

            $request->from(self::TABLE_NAME)->where(self::PRIMARY_KEY." = '".$this->getID()."'");

            if($request->exec('delete')){

                \System::Fire('user:remove', array(&$this));

                return true;
            }

            return false;
        }
        /**
         * System.User#getAlternativeLogin() -> Array
         *
         * Cette méthode liste des logins alternatif pour un utilisateur.
         **/
        public function getAlternativeLogin(){
            $login = 	$this->Login;
            $mail = 	explode('@', $this->EMail);

            $array = array(
                strtolower($this->Name.'.'.$this->FirstName),
                strtolower($this->FirstName.'.'.$this->Name),
                $this->Login,
                strtolower($mail[0])
            );

            $final = array();

            for($i = 0; $i < count($array); $i++){
                $y = 	0;
                $nb = 	false;
                $this->Login = $array[$i];

                while($this->loginExist() && $y < 5){
                    $y++;

                    if(!$nb){
                        $nb = 		\Sql::Count(self::TABLE_NAME, 'Login like "'.$this->Login.'%"');
                        $array[$i] .= (string) $nb;
                    }else{
                        $array[$i] .= (string) $y;
                    }

                    $this->Login = $array[$i];
                }

                if($y < 5){
                    $final[] = $array[$i];
                }
            }

            $this->Login = $login;

            return $final;
        }
        /**
         * System.User.Disconnect() -> void
         *
         * Cette méthode déconnecte l'utilisateur du logiciel et vide la session.
         **/
        static public function Disconnect(){
            if($User = self::IsConnect()){

                $request = new \Request();
                $request->from(self::TABLE_NAME)
                    ->set("`Is_Connect` = '0'")
                    ->where(self::PRIMARY_KEY . " = ". $User->User_ID)
                    ->exec('update');

                $_SESSION['User'] = false;
            }
        }
        /**
         * System.User.exec(op) -> Boolean
         * - op (String): Nom de la commande à exécuter.
         *
         * Cette méthode exécute une commande `op` et affiche un résultat au format JSON de préférence.
         * La méthode peut retourner 0 ou une chaine de caractère pour indiquer une erreur lors de l'exécution d'une commande.
         *
         * #### Liste des commandes gérées par cette méthode
         *
         * Les commandes suivantes doivent avoir un objet [[User]] au format `JSON` dans `$_POST['User']`.
         *
         * * `user.commit`: Enregistre les informations de l'instance en base de données.
         * * `user.login.exist` : Vérifie l'existance du Pseudo en base de données.
         * * `user.email.exist` : Vérifie l'existance de l'e-mail en base de données.
         * * `user.setmeta` : Enregistre les informations supplémentaires lié à l'utilisateur.
         *
         * Les commandes suivantes utilisent des champs spécifiques :
         *
         * * `user.delete` : Supprime un ou plusieurs utilisateurs. La liste doit être détaillé dans le champs `$_POST['data']`.
         * * `user.list` :  Liste les utilisateurs en fonction des objets contenus dans `$_POST['clauses']` et `$_POST['options']`.
         * * `user.list.print`: Créer un fichier PDF de la liste d'utilisateurs en fonction des objets contenus dans `$_POST['clauses']` et `$_POST['options']`.
         *
         **/
        static function exec($op){

            switch($op){

                case self::PRE_OP . 'get':

                    if(empty($_POST['User_ID'])){
                        echo json_encode(self::Get());
                    }else{
                        echo json_encode(new self((int) $_POST['User_ID']));
                    }
                    break;

                //---------------------------------------------------------------------------
                // /!\ Connexion au logiciel-------------------------------------------------
                //---------------------------------------------------------------------------
                case self::PRE_OP . 'connect':

                    if(!isset($_POST['Login'])){
                        session_destroy();
                        \System::eDie('user.connect.login');
                    }
                    if(!isset($_POST['Password'])){
                        session_destroy();
                        \System::eDie('user.connect.password');
                    }

                    $User = new User($_POST['Login'], $_POST['Password']);

                    if(!$User->connect()){
                        @session_destroy();

                        \System::eDie('user.connect.err');
                    }

                    $user = json_encode($User);
                    self::Set();

                    echo json_encode(array('statut' => 'system.connect.ok', 'user' => $user, 'redir' => URI_PATH.'admin/'));
                    break;
                //---------------------------------------------------------------------------
                // /!\ Déconnexion du logiciel-----------------------------------------------
                //---------------------------------------------------------------------------
                case 'system.disconnect':
                    set_time_limit(0);
                    ignore_user_abort(true);
                    self::Disconnect();
                    session_destroy();
                    break;

                case self::PRE_OP . 'commit':

                    $User = new User($_POST['User']);

                    if(!\System::HasRight(2, $User)){
                        die('system.user.noright');
                    }

                    if($User->nameExist() > 0){
                        echo "user.name.exist";
                        break;
                    }

                    if($User->loginExist() > 0){
                        echo "user.login.exist";
                        break;
                    }

                    if($User->emailExist() > 0){
                        echo "user.email.exist";
                        break;
                    }

                    if(!$User->commit()){
                        echo 'user.commit.err';
                        break;
                    }

                    echo json_encode($User);

                    if($User->getID() == self::Get()->getID()){
                        exit(0);
                    }

                    break;

                case self::PRE_OP . 'send.password':
                case self::PRE_OP . 'password.send':

                    if(!self::SendMailNewPassword($_POST['EMail'])){
                        \System::eDie("user.password.update.err");
                    }

                    echo "user.email.send.ok";

                    break;

                case self::PRE_OP . 'exist':
                    $User = new User($_POST['User']);
                    echo json_encode($User->exist());
                    break;

                case self::PRE_OP . 'login.exist':
                    $User = new User($_POST['User']);
                    echo json_encode($User->loginExist());
                    break;

                case self::PRE_OP . 'login.alternative.list':
                    $user = 	new User($_POST['User_ID']);

                    echo json_encode($user->getAlternativeLogin());
                    break;
                case self::PRE_OP . 'email.exist':
                    $User = new User($_POST['User']);
                    echo json_encode($User->emailExist());
                    break;

                case self::PRE_OP . 'delete':

                    if(!empty($_POST['data']) && is_array($_POST['data'])){
                        $i = 0;

                        foreach($_POST['data'] as $o){
                            $User = new User((int) $o->User_ID);

                            if(!\System::HasRight(2, $User)){
                                die('system.user.noright');
                            }

                            if(!$User->delete()){
                                return 'user.delete.err';
                            }
                            $i++;
                        }

                    }else{
                        $User = new self($_POST['User']);

                        if(!\System::HasRight(2, $User)){
                            die('system.user.noright');
                        }

                        if(!$User->delete()){
                            return 'user.delete.err';
                        }
                    }

                    echo json_encode('true');
                    break;

                case self::PRE_OP . 'list.print':

                    $pdf = self::PrintPDFList($_POST['clauses'], $_POST['options']);

                    if(!$pdf){
                        return 'user.list.print';
                    }

                    //chmod(ABS_PATH.PATH_PUBLIC, 0777);

                    $link = PATH_PUBLIC.'liste_utilisateurs_u'.self::Get()->getID().'.pdf';

                    @unlink(ABS_PATH.$link);

                    $pdf->Output(ABS_PATH.$link, 'F');

                    //chmod(ABS_PATH.PATH_PUBLIC, 0755);

                    echo json_encode(URI_PATH.$link);
                    break;

                case self::PRE_OP . 'list':

                    if(!empty($_POST['word'])){
                        if(is_object($_POST['options'])){
                            $_POST['options']->word = 	$_POST['word'];
                        }else{
                            $_POST['options'] = new \stdClass();
                            $_POST['options']->word = 	$_POST['word'];
                        }
                    }

                    if(!$tab = self::GetList($_POST['clauses'], $_POST['options'])){
                        return 'user.list.err';
                    }
                    echo json_encode($tab);
                    break;

                case self::PRE_OP . 'setmeta':
                    $User = new User($_POST['User']);

                    if(!$User->commit()){
                        return 'user.setmeta.err';
                    }

                    if($User->getID() == self::Get()->getID()){
                        $_SESSION['User'] = $User;
                        //exit(0);
                    }

                    echo $User->toJSON();
                    break;
            }

        }
        /**
         * System.User#exists() -> Boolean
         *
         * Cette méthode vérifie que le `Name` et `FirstName` de l'utilisateur n'existe pas en base de données.
         **/
        public function exist(){
            return \Sql::Count(self::TABLE_NAME, "`Name` = '".\Sql::EscapeString($this->getName())."' AND `FirstName` = '".\Sql::EscapeString($this->getFirstName())."'") > 0;
        }
        /**
         * System.User#emailExist() -> boolean
         *
         * Cette méthode permet de vérifier si l'e-mail de l'utilisateur est déjà enregistré en base de données.
         **/
        public function emailExist(){
            return \Sql::Count(self::TABLE_NAME, "EMail like '".\Sql::EscapeString($this->EMail)."' AND User_ID != ".$this->User_ID);
        }
        /**
         * System.User#generateAccess() -> void
         *
         * Cette méthode génère les accès d'un utilisateur à partir de [[System.User#Login]]. Si l'utilisateur ne possède aucun login alors
         * ce dernier sera génèré automatiquement généré à partir de [[System.User#Name]] et [[System.User#FirstName]].
         **/
        public function generateAccess(){

            $this->Login = $this->Login == '' ?
                \Stream::Sanitize(strtolower(substr($this->FirstName, 0, 1).substr($this->Name, 0, 7)))
                : $this->Login;
            $random = 		rand(0, 100);
            $this->Password = substr(md5($this->Login.$random), 0, 7);
        }
        /**
         * System.User.Get() -> User | Boolean
         * System.User.Get(attribut) -> String | Number | Boolean | Object | Array
         * System.User.Get(attribut, value) -> String | Number | Boolean | Object | Array
         *
         * Cette méthode retourne l'instance de l'utilisateur connecté si ce dernier existe sinon la méthode retourne `false`.
         *
         **/
        static public function Get(){
            $User = @unserialize($_SESSION['User']);

            if($User instanceof User){
                if(func_num_args() > 0){
                    if(method_exists($User, func_get_arg(0))) return $User;
                    if(property_exists($User, func_get_arg(0)) && !in_array(func_get_arg(0), array('Meta', 'Is_Connect', 'Is_Active'))){
                        if(func_num_args() == 2){
                            $User->${func_get_arg(0)} = func_get_arg(1);
                        }
                        return $User->${func_get_arg(0)};
                    }

                    if(!in_array(func_get_arg(0), array('Meta', 'Is_Connect', 'Is_Active'))){
                        if(func_get_args() == 2){
                            return $User->setMeta(func_get_arg(0), func_get_arg(1));
                        }

                        return $User->getMeta(func_get_arg(0), func_get_arg(1));
                    }
                }

                $folder = \File::ToURI(\System::Path('publics').'cache/');

                if($User->Avatar != ''){

                    $User->Avatar48 = $folder . 'u' . $User->User_ID . '-48.' . \Stream::Extension($User->Avatar);
                    $User->Avatar32 = $folder . 'u' . $User->User_ID . '-32.' . \Stream::Extension($User->Avatar);
                    $User->Avatar16 = $folder . 'u' . $User->User_ID . '-16.' . \Stream::Extension($User->Avatar);

                    if(!file_exists(str_replace(URI_PATH, ABS_PATH, $User->Avatar48))){
                        $User->createAvatar();
                    }

                }else{
                    $User->Avatar48 = '';
                    $User->Avatar32 = '';
                    $User->Avatar16 = '';
                }

                return $User;
            }

            return false;
        }
        /**
         * System.User.Search(word) -> void
         * - word (String): Mot recherché.
         *
         * Cette méthode permet d'ajouter un résultat à la recherche globale.
         **/
        public static function Search($word){
            $clauses = new \stdClass();
            $clauses->where = $word;

            $result = self::GetList($clauses);

            for($i = 0; $i < $result['length']; $i++){

                $obj = new \SystemSearch($result[$i]);

                $obj->onClick('\System.System.User.open');
                $obj->setAppIcon('system-user');
                $obj->setIcon($result[$i]['Avatar16'] == '' ? 'men-48' : $result[$i]['Avatar16']);
                $obj->setAppName(MUI('Utilisateurs'));

                \SystemSearch::Add($obj);
            }
        }
        /**
         * System.User.SearchMail(word) -> void
         * - word (String): E-mail recherché.
         *
         * Cette méthode permet d'ajouter un résultat à la recherche globale d'adresse e-mail.
         **/
        public static function SearchMail($word){
            $clauses = new \stdClass();
            $clauses->where = $word;
            $options = new \stdClass();
            $options->op = '-mail';

            $result = self::GetList($clauses, $options);

            for($i = 0; $i < $result['length']; $i++){

                $obj = new \SystemSearch($result[$i]);
                $obj->setIcon($result[$i]['Avatar48'] == '' ? 'men-48' : $result[$i]['Avatar48']);

                \SystemSearch::Add($obj);
            }
        }
        /**
         * System.User.GetList([clauses [, options]]) -> Array | Boolean
         * - clauses (Object): Objet de restriction de la liste.
         * - options (Object): Objet de configuration de la liste.
         *
         * Cette méthode liste l'ensemble des données gérées par la classe.
         *
         * #### Le paramètre options
         *
         * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
         *
         * * `options.op` = "-role" : Retourne la liste des utilisateurs d'un rôle indiqué dans `options.value`.
         * * `options.op` = "-statut" : Retourne la liste des utilisateurs actif, en attente ou bloqué en fonction de `options.value`.
         * * `options.op` = "-connected" : Retourne la liste des utilisateurs connecté au logiciel.
         *
         **/
        public static function GetList($clauses = '', $options = ''){

            $request = new \Request();

            $request->select('U.*','R.`Name` as RoleName', 'U.User_ID as value', 'CONCAT(U.Name,\' \',U.FirstName) as text', 'SUBSTR(U.Name, 1, 1) as Letter', 'Avatar as icon')
                ->from(self::TABLE_NAME.' AS U INNER JOIN '.User\Role::TABLE_NAME.' AS R ON U.'.User\Role::PRIMARY_KEY.' = R.'.User\Role::PRIMARY_KEY)
                ->order('U.Name ASC', 'FirstName ASC')
                ->where(' 1 ');

            $request->onexec =	array('User', 'onGetList');

            if(!empty($options->Role_ID)){

                if(!is_numeric($options->Role_ID)){
                    $role = User\Role::ByName($options->Role_ID);
                    $options->Role_ID = $role->Role_ID;
                }

                $request->where($request, ' R.'.User\Role::PRIMARY_KEY.' = "'.\Sql::EscapeString($options->Role_ID).'"');
            }

            if(!empty($options->Roles)){
                if(is_string($options->Roles)){
                    $options->Roles = explode(';', $options->Roles);
                }

                for($i = 0; $i < count($options->Roles); $i++){
                    if(!is_numeric($options->Roles[$i])){
                        $role = User\Role::ByName($options->Roles[$i]);
                        $options->Roles[$i] = $role->Role_ID;
                    }
                }

                $request->where($request, ' U.'.User\Role::PRIMARY_KEY.' IN(' . implode(', ', $options->Roles) . ')');

            }

            if(!empty($options->Users)){
                if(is_string($options->Users)){
                    $options->Users = explode(';', $options->Users);
                }

                $request->where($request, ' U.'.self::PRIMARY_KEY.' IN(' . implode(', ', $options->Users) . ')');
            }


            if(isset($options->Is_Active)){

                switch($options->Is_Active * 1){
                    case 2:
                        $request->where($request, 'U.Is_Active = "2"', 'R.Is_Active = "1"');
                        break;
                    case 1:
                        $request->where($request, '(U.Is_Active = "1" || R.Is_Active = "0")');
                        break;
                    case 0:
                        $request->where($request, '(U.Is_Active = "0" AND R.Is_Active = "1")');
                        break;
                }

            }

            if(isset($options->Is_Connect)){
                $request->where($request, 'Is_Connect = "'.\Sql::EscapeString($options->Is_Connect).'"');
            }

            switch(@$options->op){

                case '-mail':
                    $request->select('U.*', 'CONCAT(U.Name,\' \',U.FirstName) as text', 'EMail as value', 'Avatar as icon')
                        ->where("EMail != ''");

                    $clauses = $options;

                    if(empty($clauses->where)){
                        $clauses->where = @$_POST['word'];
                    }

                    break;
                case '-role':
                case "-r":
                    $request->where('R.'.User\Role::PRIMARY_KEY.' = "'.\Sql::EscapeString($options->value).'"');
                    break;
                case '-statut':
                case "-s":
                    $request->where('U.Is_Active = "'.\Sql::EscapeString($options->value).'"');
                    break;
                case '-connected':
                case "-c":
                    $request->where('Is_Connect = "1"');
                    break;
            }

            if(!empty($options->word)){
                if(empty($clauses)){
                    $clauses = new \stdClass();
                }
                $clauses->where = $options->word;
            }


            if(!empty($clauses)){
                if(!empty($clauses->where)) {

                    $request->where($request, "(
					U.Name like '%". \Sql::EscapeString($clauses->where) . "%' 
					OR U.FirstName like '%". \Sql::EscapeString($clauses->where) ."%' 
					OR U.EMail like '%". \Sql::EscapeString($clauses->where) ."%' 
					OR U.Phone like '%". \Sql::EscapeString($clauses->where) ."%'
					OR R.Name like '%". \Sql::EscapeString($clauses->where) ."%'
					OR CONCAT(U.Name,\" \", U.FirstName) like '%".\Sql::EscapeString($clauses->where)."%' 
					OR CONCAT(U.FirstName,\" \", U.Name) like '%".\Sql::EscapeString($clauses->where)."%'
				)");

                }
                if(!empty($clauses->order)) 	$request->order($clauses->order);
                if(!empty($clauses->limits)) 	$request->limit($clauses->limits);
            }

            //plugins actions
            \System::Fire('system.user.list', array($request));
            //
            // Evenement correct
            //
            \System::Fire('user:list', array(&$request, $options));

            if($request->exec('select')){
                $request['maxLength'] = \Sql::count($request->from, $request->where);

                if(!empty($options->default)){
                    $request->setResult(array_merge(array(array(
                        'text' => is_string($options->default) ? $options->default : MUI('Choisissez'), 'value' => 0
                    )), $request->getResult()));

                    $request['length'] = $request['length']+1;
                }
            }

            //echo $request->query;
            return $request->getResult();

        }
        /**
         * System.User.onGetList(row [,request]) -> void
         * - row (Array): Ligne traité par la requête.
         * - request (Request): Requêt en cours d'exécution.
         *
         * Cette méthode est appelée par un objet [[\Request]] lors de son exécution.
         **/
        public static function onGetList(&$row, &$request){
            $User = new User($row);

            $folder = \File::ToURI(\System::Path('publics').'cache/');

            if($User->Avatar != ''){
                $row['icon'] = $row['Avatar48'] = $folder . 'u' . $User->User_ID . '-48.' . \Stream::Extension($User->Avatar);
                $row['Avatar32'] = $folder . 'u' . $User->User_ID . '-32.' . \Stream::Extension($User->Avatar);
                $row['Avatar16'] = $folder . 'u' . $User->User_ID . '-16.' . \Stream::Extension($User->Avatar);

                if(!file_exists(\File::ToABS($User->Avatar48))){
                    @$User->createAvatar();
                }

            }else{
                $row['Avatar48'] = '';
                $row['Avatar32'] = '';
                $row['Avatar16'] = '';
            }
        }
        /**
         * System.User#getMeta(key) -> String | int
         * - key (String): Nom de la clef.
         *
         * Cette méthode permet de récuperer une information stockée en base de données dans le champ `Meta`.
         **/
        public function getMeta($key){
            $obj = is_object($this->Meta) ? $this->Meta : json_decode($this->Meta);
            return @$obj->$key ? $obj->$key : false;
        }
        /**
         * System.User#getRight() -> int
         *
         * Cette méthode retourne le niveau d'accès au logiciel de l'utilisateur.
         *
         * #### Les niveaux d'accès
         *
         * Les niveaux d'accès vont de 1 à 3 :
         *
         * * Niveau 1 : Compte de type administrateur.
         * * Niveau 2 : Compte de type modérateur.
         * * Niveau 3 : Compte de type utilisateur.
         *
         **/
        public function getRight(){
            if($this->Role_ID <= 2) return $this->Role_ID;

            $role = new User\Role((int) $this->Role_ID);
            return $role->getRoleParent()->getID();
        }
        /**
         * System.User#getRole() -> Role
         *
         * Cette méthode retourne l'instance Rôle de l'utilisateur.
         **/
        public function getRole(){
            return new User\Role((int) $this->Role_ID);
        }
        /**
         * System.User#getRoleParent() -> Role
         *
         * Cette méthode permet de récupérer le rôle parent si ce dernier existe.
         *
         * <p class="note">Les rôles inférieurs au rôle 3 inclut sont des rôles de base du système et ne retourneront qu'eux même au travers de cette méthode.</p>
         *
         * <p class="note">Pour savoir le droit d'accès de l'utilisateur utilisez la méthode [[System.User#getRight]]</p>
         *
         * Pour plus d'information sur les rôles repportez vous à la classe [[Role]].
         **/
        public function getRoleParent(){
            $role = new User\Role((int) $this->Role_ID);
            return $role->getRoleParent();
        }
        /**
         * System.User.IsConnect() -> Boolean
         *
         * Cette méthode teste si le client c'est identifié et est connecté au logiciel.
         **/
        public static function IsConnect(){
            if(self::$ConnectionChecked){
                return self::Get();
            }
            $User = @unserialize($_SESSION['User']);

            if($User instanceof User){//vérification du type d'instance

                if($User->User_ID != 0){//Vérification du l'utilisateur

                    //vérification de l'authenticité de l'utilisateur connecté
                    $request =			new \Request();
                    $request->select = 	'*';
                    $request->from = 	self::TABLE_NAME;
                    $request->where = 	self::PRIMARY_KEY." = ".$User->User_ID;

                    $result = $request->exec('select');

                    if($result['length'] > 0) {

                        if($result[0]['Is_Connect'] == 0) return false;

                        $request->set = 	"`Last_Connexion` = CURRENT_TIMESTAMP(), `Is_Connect` = '1'";
                        $request->where = 	self::PRIMARY_KEY . " = '". $User->User_ID ."'";

                        $request->exec('update');

                        $User->Last_Connexion = date('Y-m-d H:i:s');

                        self::$ConnectionChecked = true;

                        return self::Get();
                    }
                }
            }

            return 	false;
        }
        /**
         * System.User#nameExist() -> Boolean
         *
         * Cette méthode permet de vérifier si le nom et prénom de l'utilisateur est déjà enregistré en base de données.
         **/
        public function nameExist(){

            $u = self::ByName($this->Name.' '.$this->FirstName);
            if($u){
                return $u->User_ID != $this->User_ID;
            }
            return false;
        }
        /**
         * System.User#loginExist() -> Boolean
         *
         * Cette méthode permet de vérifier si le pseudo de l'utilisateur est déjà enregistré en base de données.
         **/
        public function loginExist(){
            return \Sql::count(self::TABLE_NAME, "Login like '".\Sql::EscapeString($this->Login)."' AND User_ID != ".$this->User_ID);
        }
        /**
         * System.User.Meta(key [, value]) -> Mixed
         * - key (String): Nom de la clef attachée à l'utilisateur connecté.
         * - value (String | Number | Object | Array): Valeur à assigner à la clef.
         *
         * Cette méthode retourne la valeur d'une clef attachée à l'utilisateur connecté.
         * Si le paramètre `value` est utilisé alors la valeur de `value` sera assigné à la clef `key` dans les informations attachées à l'utilisateur.
         **/
        static public function Meta($key){
            $User = self::Get();
            $num = func_num_args();

            if($num == 1){
                return $User->getMeta($key);
            }

            if($num == 2){
                if($key == '') return false;
                return $User->setMeta($key, func_get_arg(1));
            }

            return false;
        }
        /**
         * System.User.printPDFList([clauses [, options]]) -> Array | boolean
         * - clauses (Object): Objet de restriction de la liste.
         * - options (Object): Objet de configuration de la liste.
         *
         * Cette méthode liste l'ensemble des utilisateurs du logiciel en fonction des paramètres `clauses` et `options`, et l'exporte vers
         * un fichier PDF.
         *
         * #### Le paramètre options
         *
         * Ce paramètre permet de modifier le resultat de la liste. Voici les différentes options possibles :
         *
         * * `options.op` = "-role" : Retourne les listes des utilisateurs d'un rôle indiqué dans `options.value`.
         * * `options.op` = "-statut" : Retourne la liste des utilisateurs actif, en attente ou bloqué en fonction de `options.value`.
         * * `options.op` = "-connected" : Retourne la liste des utilisateurs connecté au logiciel.
         *
         **/
        public static function PrintPDFList($clauses = '', $options = ''){

            $pdf = 			new \PDFSimpleTable('L','mm','A4');
            $pdf->name = 	'Listing des utilisateurs';
            $pdf->AliasNbPages();
            $pdf->AddPage();
            $pdf->SetLeftMargin(5);
            $pdf->SetRightMargin(5);
            $pdf->SetAutoPageBreak(true, 15);
            $pdf->SetDisplayMode('real');

            //En-têtes listing
            $pdf->SetFont('Arial','B',8);

            $pdf->AddHeader(array(
                'User_ID' => 		array('Title' => 'N°', 'Width'=>'15', 'Align' => 'C', 'BodyAlign' => 'R'),
                'Name' => 			array('Title' => 'Nom', 'Width'=>'25', 'Align' => 'C', 'BodyAlign' => 'L'),
                'FirstName' => 		array('Title' => 'Prénom', 'Width'=>'25', 'Align' => 'C', 'BodyAlign' => 'L'),
                'EMail' => 			array('Title' => 'E-mail', 'Width'=>'55', 'Align' => 'C', 'BodyAlign' => 'L'),
                'Phone' => 			array('Title' => 'Tel.', 'Width'=>'25', 'Align' => 'C', 'BodyAlign' => 'C'),
                'Mobile' => 		array('Title' => 'Port.', 'Width'=>'25', 'Align' => 'C', 'BodyAlign' => 'C'),
                'Address' => 		array('Title' => 'Adresse', 'Width'=>'50', 'Align' => 'C', 'BodyAlign' => 'L'),
                'CP' => 			array('Title' => 'CP', 'Width'=>'12', 'Align' => 'C', 'BodyAlign' => 'C'),
                'City' => 			array('Title' => 'Ville', 'Width'=>'25', 'Align' => 'C', 'BodyAlign' => 'L'),
                'Country' => 		array('Title' => 'Pays', 'Width'=>'25', 'Align' => 'C', 'BodyAlign' => 'L')
            ));

            //Listing
            $pdf->SetFont('Arial','',8);

            if(is_object($clauses)){
                $clauses->limits = '';
            }

            $pdf->addRows(self::GetList($clauses, $options));

            //Sortie PDF
            return $pdf;
        }
        /**
         * System.User.Set() -> void
         *
         * Cette méthode enregistre les informations de l'utilisateur connecté en session.
         **/
        static public function Set($user = NULL){

            if($user instanceof User){
                $_SESSION['User'] = $user;
            }

            if($_SESSION['User'] instanceof User){
                if($_SESSION['User']->Is_Connect == 1 && $_SESSION['User']->User_ID > 0){
                    $_SESSION['User'] = serialize($_SESSION['User']);
                }
            }
        }
        /**
         * System.User#setMeta(key, value) -> Boolean
         * System.User#setMeta(obj) -> Boolean
         * - key (String): clef de la valeur à stocker.
         * - value (String | int): Valeur à stocker.
         * - obj (Object):
         *
         * Cette méthode permet d'assigner une information stockée en base de données dans le champ `Meta`.
         **/
        public function setMeta($key, $value = NULL){

            if(is_object($key)){
                $obj = is_object($this->Meta) ? $this->Meta : json_decode($this->Meta);

                foreach($key as $name => $value){
                    $obj->$name = $value;
                }

            }else{
                $obj = is_object($this->Meta) ? $this->Meta : json_decode($this->Meta);
                $obj->$key = $value;
            }

            if($this->User_ID != 0){

                $request = 			new \Request();
                $request->from = 	self::TABLE_NAME;
                $request->set = 	"Meta = '".\Sql::EscapeString(json_encode($obj))."'";
                $request->where = 	self::PRIMARY_KEY. " = " . $this->User_ID;

                $result = $request->exec('update');

                if(self::IsConnect()){
                    if(self::Get()->User_ID == $this->User_ID){
                        self::Set($this);
                    }
                }

                return $result;
            }

            $this->Meta = json_encode($obj);

            return true;
        }

        public static function GetLang(){
            if(self::IsConnect()){
                $lang = strtolower(self::Meta('LANG') ? self::Meta('LANG') : \Multilingual::GetLang());
            }else{
                $lang = \Multilingual::GetLang();
            }
            return $lang;
        }
        /**
         * System.User.uDie() -> void
         *
         * Cette méthode `static` émet une erreur de type `system.user.unitialized` et stop le script.
         * Cette erreur indique qu'aucun utilisateur n'est connecté au logiciel.
         **/
        final static function uDie(){
            die('system.user.unitialized');
        }
        /*
         * Methode appellée par la fonction de sérialisation
         */
        public function __sleep(){

            $i = 0;
            $array = array();

            foreach($this as $key=>$value){
                if(method_exists($this, $key) && $key != 'Meta') continue;

                $array[$i] = $key;
                $i++;
            }

            return $array;
        }
        /*
         * Methode appellée par la fonction de désérialisation
         */
        public function __wakeup(){}
        /*
         * Methode appelée par la classe SQL lors d'une requête sur la table utilisateur
         * Elle restaure les attributs de la l'objet.
         * @deprecated
         * @param $obj Correspond au tableau associatif de la table Utilisateur.
         */
        public function __setSQLObject($obj){
            $this->setObject($obj);
        }
        /*
         * Retourne la chaine String de l'objet.
         */
        public function __toString(){
            return serialize($this);
        }
        //deprecated
        public function getName(){
            return $this->Name;
        }
        //deprecated
        public function getFirstName(){
            return $this->FirstName;
        }
        //deprecated
        public function getLogin(){
            return $this->Login;
        }
        //deprecated
        public function getPassword(){
            return $this->Password;
        }
        //deprecated
        public function getEMail(){
            return $this->EMail;
        }

        public function getMail(){
            return $this->EMail;
        }
        //deprecated
        public function getPhone(){
            return $this->Phone;
        }
        //deprecated
        public function getMobile(){
            return $this->Mobile;
        }
        //deprecated
        public function setID($id){
            $this->User_ID = $id;
        }
        //deprecated
        public function getID(){
            return $this->User_ID;
        }
        /**
         * System.User#getLastConnexion() -> String
         *
         * Cette méthode retourne la dernière date de connexion de l'utilisateur.
         **/
        public function getLastConnexion(){
            return $this->Last_Connexion;
        }
        /**
         * System.User#getIsConnect() -> boolean
         *
         * Cette méthode indique si l'utilisateur est actuellement connecté à l'administration.
         **/
        public function getIsConnect(){
            return $this->Is_Connect;
        }
    }
}

namespace{
    class User extends \System\User{}
}