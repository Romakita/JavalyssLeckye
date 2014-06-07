<?php
/** section: MyEvent
 * class MyEventAccount 
 * includes ObjectTools
 *
 * Cette classe permet de gérer les différents événements du logiciel Javalyss pour la mise en place des données de l'extension MyEvent.
 *
 * #### Informations
 *
 * * Auteur : Paul Tabet
 * * Fichier : class_account.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class MyEventAccountAddress extends ObjectTools{
	const PRE_OP =					'myevent.account.address.';
	
	public $Address_ID =			0;
/**
 * MyEventAccountAddress#Name -> String
 * Nom de l'utilisateur
 **/
	public $Name =					"";
/**
 * MyEventAccountAddress#FirstName -> String
 * Prenom de l'utilisateur
 **/
	public $FirstName = 			"";
/**
 * MyEventAccountAddress#Address -> String
 * Adresse de l'utilisateur
 **/
	public $Address =				'';
/**
 * MyEventAccountAddress#Address2 -> String
 * Adresse de l'utilisateur
 **/
	public $Address2 =				'';
/**
 * MyEventAccountAddress#CP -> String
 * Code postal de l'utilisateur
 **/
	public $CP =					'';
/**
 * MyEventAccountAddress#City -> String
 * Ville de l'utilisateur.
 **/
	public $City =					'';
/**
 * MyEventAccountAddress#Country -> String
 * Pays de l'utilisateur.
 **/
	public $Country =				'';	
/**
 * MyEventAccountAddress#Phone -> String
 * Numéro de téléphone de livraison
 **/
	public $Phone =					'';	
/**
 * new MyEventAccountAddress()
 * new MyEventAccountAddress(json)
 * new MyEventAccountAddress(array)
 * new MyEventAccountAddress(obj)
 * new MyEventAccountAddress(id)
 * - json (String): Chaine de caractères JSON équivalente à une instance [[MyEventAccountAddress]].
 * - array (Array): Tableau associatif équivalent à une instance [[MyEventAccountAddress]]. 
 * - obj (Object): Objet équivalent à une instance [[MyEventAccountAddress]].
 * - id (int): Numéro d'identifiant de l'instance. Les informations de l'instance seront récupérées depuis la base de données.
 *
 * Cette méthode créée une nouvelle instance de [[MyEventAccountAddress]].
 **/
	function __construct(){
		$numargs = func_num_args();
		$arg_list = func_get_args();
		
		if($numargs == 1){
			if(is_numeric($arg_list[0])){
				
				$carnet = User::Meta('MYEVENT_ADR_BOOK');
		
				if(empty($carnet)){
					$carnet = new stdClass();
					$carnet->AUTO_INCREMENT = 0;
				}
				
				$this->extend($carnet->{'item-' . ($arg_list[0] - 1)});
				
				
			}elseif(is_string($arg_list[0])) $this->evalJSON($arg_list[0]);
			elseif(is_object($arg_list[0])) $this->setObject($arg_list[0]);
			elseif(is_array($arg_list[0])) $this->setArray($arg_list[0]);

		}
	}
	
	static public function Initialize(){
		System::Observe('myevent:gateway.exec', array('MyEventAccountAddress', 'exec'));	
	}
	
	
/**
 * MyEventAccountAddress#Create() -> void
 *
 * Cette méthode initialise le carnet d'adresse du compte si besoin.
 **/	
	public static function Create(){
		
		$carnet = User::Meta('MYEVENT_ADR_BOOK');
		
		if(empty($carnet)){
			$carnet = new stdClass();
			$carnet->AUTO_INCREMENT = 0;
			
			User::Meta('MYEVENT_ADR_BOOK', $carnet);
			
			if(!empty(User::Get()->Address)){//creation de la première adresse
				$o = new self(User::Get());
				$o->commit();
			}
			
		}
		
		$id = User::Meta('MYEVENT_ADR_DEFAULT');
		
		if(!is_numeric($id)){
			User::Meta('MYEVENT_ADR_DEFAULT', 1);
		}
	}
/**
 * MyEventAccountAddress#commit() -> Boolean
 **/	
	public function commit(){
		
		$carnet = User::Meta('MYEVENT_ADR_BOOK');
		
		if(empty($carnet)){
			$carnet = new stdClass();
			$carnet->AUTO_INCREMENT = 0;
		}
		
		//if(is_array($carnet)){
			
		//}
		
		if($this->Address_ID == 0){
			$carnet->AUTO_INCREMENT++;
			$this->Address_ID = $carnet->AUTO_INCREMENT;
		}
		
		$carnet->{'item-' . ($this->Address_ID-1)} = $this;
		User::Meta('MYEVENT_ADR_BOOK', $carnet);
		
		return true;	
	}
/**
 * MyEventAccountAddress#delete() -> Boolean
 **/	
	public function delete(){
		$carnet = User::Meta('MYEVENT_ADR_BOOK');
		
		if(empty($carnet)){
			$carnet = new stdClass();
			$carnet->AUTO_INCREMENT = 0;
			return;
		}
				
		unset($carnet->{'item-' . ($this->Address_ID-1)});
		
		User::Meta('MYEVENT_ADR_BOOK', $carnet);
		
		return true;
	}
/**
 * MyEventAccount.exec() -> void
 *
 * Cette méthode génère le contenu de la page.
 **/	
	public static function exec($op){
		switch($op){
			
			case self::PRE_OP . 'commit':
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->commit()){
					return $op.'err';
				}
				
				echo json_encode($o);
				
				break;
			
			case self::PRE_OP . 'delete':
				$o = new self($_POST[__CLASS__]);
				
				if(!$o->delete()){
					return $op.'err';
				}
				
				echo json_encode($o);
				
				break;
				
			case self::PRE_OP . 'default':
				self::SetDefault($_POST['Address_ID']);
				break;
		}
	}
	
	public static function SetDefault($id){
		if(is_numeric($id)){
			User::Meta('MYEVENT_ADR_DEFAULT', $id);
		}
	}
/**
 * MyEventAccount.onStartPage() -> void
 *
 * Cette méthode génère le contenu de la page Compte
 **/	
	public static function Draw(){
		
		$carnet = User::Meta('MYEVENT_ADR_BOOK');
		
		if(empty($carnet)){
			$carnet = array('AUTO_INCREMENT' => 0);
		}
		?>
        <div class="myevent-address">
            <p>
                <b>
                    <?php echo MUI('Important : Toute modification de votre adresse de livraison dans cette section n\'est pas prise en compte pour vos commandes en cours.'); ?><br>
                    <?php echo MUI('Pour modifier l\'adresse de livraison de commandes en cours, rendez-vous sur la page'); ?> <a href="<?php MyEvent::Info('command'); ?>"><?php echo MUI('Mes commandes') ?></a>. 
                </b>
            </p>
            
            <div class="toolbar gradient">
                <p><?php echo MUI('Cliquez ici pour ajouter une nouvelle adresse') ?></p>
                <span class="box-simple-button button-add-address">
                	<a href="#"><!-- Note : button-add-address est important pour la gestion d'ajout d'une adresse via JS -->
                    	<?php echo MUI('Ajouter une nouvelle adresse') ?> »
                	</a>
                </span>
            </div>
            
            <div class="content-address">
            <?php
				
				$id = User::Meta('MYEVENT_ADR_DEFAULT');
				
				foreach($carnet as $key => $address):
					
					if(!is_object($address)) continue;
					
					
			?>
				<div class="box-address<?php echo $id == $address->Address_ID ? ' selected': ''; ?>" data-id="<?php echo $address->Address_ID ?>" data-name="<?php echo addslashes($address->Name) ?>" data-firstname="<?php echo addslashes($address->FirstName) ?>" data-address="<?php echo addslashes($address->Address) ?>" data-address2="<?php echo addslashes($address->Address2) ?>" data-city="<?php echo addslashes($address->City) ?>" data-cp="<?php echo addslashes($address->CP) ?>" data-country="<?php echo addslashes($address->Country) ?>" data-phone="<?php echo addslashes($address->Phone) ?>">
                	<div class="wrap-default">
                    	<input type="radio" name="AddressDefault" class="box-checkbox checkbox-set-default" <?php echo $id == $address->Address_ID ? ' checked=checked': ''; ?>/>
                    </div>
                	
                    <div class="wrap-content">
                    	<p class="wrap-name"><?php echo $address->FirstName . ' ' . $address->Name; ?></p>
                        <p class="wrap-address"><?php echo $address->Address . ' ' . $address->Address2; ?></p>
                        <p class="wrap-city"><?php echo $address->CP . ' ' . $address->City . ' ' . $address->Country; ?></p>
                        <p class="wrap-phone"><?php echo MUI('Téléphone') . ' : ' . $address->Phone; ?></p>
                    </div>
                    
                    <ul class="wrap-actions">
                    	<li><span class="box-simple-button button-edit-address"><a href="#"><?php echo MUI('Modifier'); ?></a></span></li>
                        <li><span class="box-simple-button button-remove-address"><a href="#"><?php echo MUI('Supprimer'); ?></a></span></li>
                    </ul>
                </div>
			<?php	
				endforeach;
			?>
            	<div class="clear"></div>
            </div>
        
        </div>
        <?php
		//User::Meta('MYEVENT_ADR_BOOK', $obj);
	}
/**
 * MyEventAccountAddress.GetList() -> Array
 *
 * Cette méthode retourne la liste des adresses.
 **/	
	public static function GetList(){
		$carnet = User::Meta('MYEVENT_ADR_BOOK');
		
		if(empty($carnet)){
			$carnet = array('AUTO_INCREMENT' => 0);
		}
		
		return $carnet;
	}
	
	public function __toString(){
		return 	$this->FirstName . ' ' . $this->Name . "\n" . $this->Address . ' ' . @$this->Address2 ."\n" . $this->CP . ' ' . $this->City . ' ' . $this->Country . "\n" . $this->Phone;
	}
}


MyEventAccountAddress::Initialize();
?>