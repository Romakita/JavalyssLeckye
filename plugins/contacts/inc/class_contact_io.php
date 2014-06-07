<?php
/** section: Contacts
 * class ContactIO
 * includes ObjectPrint
 *
 * Cette classe gère les informations liées à un contact
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_contact_io.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class ContactIO extends ObjectPrint{
	static $LABELS = 	array(
		'other'=>'Autre',
		'office'=>'Bureau',
		'home'=>'Domicile',
		'mobile'=>'Portable',
		'fax'=>'Fax'
	);
/**
 * ContactIO.GetDataFromImportedFile() -> void
 *
 * Cette méthode importe le fichier, l'analyse et renvoi un objet de configuration des données.
 **/
	protected static function GetDataFromImportedFile(){
		
		$folder = System::Path('private');
		
		FrameWorker::Start();
		//
		// Importation
		//
		$file = 			FrameWorker::Upload($folder, 'csv;xml;vcf;xls;');
		//
		// Création de l'objet de retour
		//
		$options = 			new stdClass();
		$options->uri = 	File::ToURI($file);
		$options->header = 	new stdClass();
		$options->data = 	Stream::GetData($file);
		
		if(Stream::Extension($file) == 'xml'){
			$options->data = $options->data['contacts']['contact'];
		}
		
		//
		// Detection d'entete de données
		//
		$config = 			self::DataMerge($options->data);
		
		if(Stream::Extension($file) == 'xml'){
			unset($config['@attributes']);	
		}
		
		$haveHeader =		false;
		
		foreach($config as $key => $value){
			
			if(self::IsDate($value)){//Les dates sont ignorés
				continue;	
			}
			
			$o = new stdClass();
			
			if(is_numeric($key)){
				$o->title = 'Champ N°' . $key;
			}else{
				$value = $key;
				
				if($key == 'Tel'){
					$value = 'tel_home';
				}
				
			}
			
			switch(trim(strtolower($value))){
				default://pas de nommage d'entete, on detecte les données
				
					if(self::IsMail($value)){
						
						//création du type de colonne possible
						$o->data = 	array(
							array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
							array('text' => MUI('E-mail (domicile)'), 'value' => 'Email.home'),
							array('text' => MUI('E-mail (bureau)'), 'value' => 'Email.office'),
							array('text' => MUI('E-mail (autre)'), 'value' => 'Email.other')
						);
						
						break;	
					}
					
					if(in_array(substr(trim($value), 6), array('http:/', 'https:'))){						
						//création du type de colonne possible
						
						$o->data = 	array(
							array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
							array('text' => MUI('Adresse web'), 'value' => 'Web')
						);
						
						break;
					}
					
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Civility'), 'value' => 'Civility'),
						array('text' => MUI('Nom'), 'value' => 'Name'),
						array('text' => MUI('Prénom'), 'value' => 'FirstName'),
						array('text' => MUI('Société'), 'value' => 'Company'),
						array('text' => MUI('Catégorie'), 'value' => 'Categories'),
						
						array('text' => MUI('Adresse'), 'value' => 'Address'),
						array('text' => MUI('Code postal'), 'value' => 'CP'),
						array('text' => MUI('Ville'), 'value' => 'City'),
						array('text' => MUI('Pays'), 'value' => 'Countries'),
						
						array('text' => MUI('Téléphone (domicile)'), 'value' => 'Phone.home'),
						array('text' => MUI('Téléphone (bureau)'), 'value' => 'Phone.office'),
						array('text' => MUI('Téléphone (portable)'), 'value' => 'Phone.mobile'),
						array('text' => MUI('Téléphone (autre)'), 'value' => 'Phone.other'),
						array('text' => MUI('Fax'), 'value' => 'Phone.fax'),
						
						array('text' => MUI('Fonction'), 'value' => 'Comment.function'),
						array('text' => MUI('Service'), 'value' => 'Comment.service'),
						array('text' => MUI('Secteur'), 'value' => 'Comment.sector'),
						array('text' => MUI('Remarques'), 'value' => 'Comment.remarque')
					);
					
					System::fire('contact:field.import.create', array(&$o->data, $file));
					
					break;
				
				case 'title':
				case 'rev':
					continue;
				case 'civilite':
				case 'civility':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Civilité'), 'value' => 'Civility', 'selected' => true)
					);
					$haveHeader = true;
					break;	
				case 'nom':
				case 'name':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Nom'), 'value' => 'Name', 'selected' => true)
					);
					$haveHeader = true;
					break;
				case 'org':
				case 'societe':
				case 'company':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Société'), 'value' => 'Company', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
				case 'prenom':
				case 'firstname':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Prénom'), 'value' => 'FirstName', 'selected' => true),
					);
					$haveHeader = true;
					break;
				
				case 'category':
				case 'categorie':
				case 'categories':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Catégorie'), 'value' => 'Categories', 'selected' => true),
					);
					break;
										
				case 'mail':
				case 'email':
				case 'e_mail':
				case 'e-mail':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('E-mail (domicile)'), 'value' => 'Email.home'),
						array('text' => MUI('E-mail (bureau)'), 'value' => 'Email.office'),
						array('text' => MUI('E-mail (autre)'), 'value' => 'Email.other')
					);
					$haveHeader = true;
					break;
				
				case 'email_home':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('E-mail (domicile)'), 'value' => 'Email.home', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
				case 'email_office':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('E-mail (bureau)'), 'value' => 'Email.office', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
				case 'email_other':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('E-mail (autre)'), 'value' => 'Email.other', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
				case 'phone_home':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Téléphone (domicile)'), 'value' => 'Phone.home', 'selected' => true),
					);
					$haveHeader = true;
					break;
				
				case 'phone_office':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Téléphone (bureau)'), 'value' => 'Phone.office', 'selected' => true),
					);
					$haveHeader = true;
					break;
				
				case 'phone_mobile':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Téléphone (portable)'), 'value' => 'Phone.mobile', 'selected' => true),
					);
					$haveHeader = true;
					break;
				
				case 'phone_other':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Téléphone (portable)'), 'value' => 'Phone.other', 'selected' => true),
					);
					$haveHeader = true;
					break;
				
				case 'phone':
				case 'tel':
				case 'telephone':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Téléphone (domicile)'), 'value' => 'Phone.home', 'selected' => true),
						array('text' => MUI('Téléphone (bureau)'), 'value' => 'Phone.office'),
						array('text' => MUI('Téléphone (portable)'), 'value' => 'Phone.mobile'),
						array('text' => MUI('Téléphone (autre)'), 'value' => 'Phone.other')
					);
					$haveHeader = true;
					break;
					
				case 'mobile':
				case 'portable':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Téléphone (domicile)'), 'value' => 'Phone.home'),
						array('text' => MUI('Téléphone (bureau)'), 'value' => 'Phone.office'),
						array('text' => MUI('Téléphone (portable)'), 'value' => 'Phone.mobile', 'selected' => true),
						array('text' => MUI('Téléphone (autre)'), 'value' => 'Phone.other'),
					);
					$haveHeader = true;
					break;
				
				case 'fax':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Fax'), 'value' => 'Phone.fax', 'selected' => true)
					);
					$haveHeader = true;
					break;
					
				case 'ville':
				case 'city':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Ville'), 'value' => 'City', 'selected' => true)
					);
					$haveHeader = true;
					break;
					
				case 'cp':
				case 'code':
				case 'zipcode':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Code postal'), 'value' => 'CP', 'selected' => true)
					);
					$haveHeader = true;
					break;
					
				case 'country':
				case 'pays':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Pays'), 'value' => 'Countries', 'selected' => true)
					);
					$haveHeader = true;
					break;
					
				case 'uri':
				case 'web':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Adresse Web'), 'value' => 'Web', 'selected' => true)
					);
					$haveHeader = true;
					break;
									
				case 'adresse':
				case 'adresse1':
				case 'adresse2':
				case 'address':
				case 'address1':
				case 'address2':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Adresse'), 'value' => 'Address', 'selected' => true)
					);
					$haveHeader = true;
					break;
					
				case 'fonction':
				case 'function':
				case 'metier':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Fonction'), 'value' => 'Comment.function', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
				case 'service':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Service'), 'value' => 'Comment.service', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
				case 'sector':
				case 'secteur':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Secteur'), 'value' => 'Comment.sector', 'selected' => true)
					);
					$haveHeader = true;
					break;
					
				case 'note':
				case 'remarque':
				case 'remarques':
				case 'comment':
				case 'commentaire':
				case 'commentaires':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Remarques'), 'value' => 'Comment.remarque', 'selected' => true)
					);
					$haveHeader = true;
					break;						
			}
			
			$options->header->$key = $o;
		}
		
		if(!$haveHeader){
			$options->data = 	array_merge(array($options->data[0]), array($config), array_splice($options->data, 1, 30));	
		}else{
			$options->data = 	array_splice($options->data, 1, 30);	
		}
		
		
		$options->ExcludeFirstLine = in_array(Stream::Extension($file), array('vcf')) ? false : $haveHeader;
			
		FrameWorker::Stop($options);
	}
/**
 * ContactIO.ImportFile() -> void
 *
 * Cette méthode compte le nombre d'élement dans la table. 
 **/
	protected static function ImportFile($options){
		//CRMPlugin::AddCategory('Importé', 'imported');
		
		$file = File::ToABS($options->File);
		$data = Stream::GetData($file);
		
		if(Stream::Extension($file) == 'xml'){
			$data = $data['contacts']['contact'];
		}
		
		$options->noneAdd = array();
		$options->merged = 	array();
		$options->created = 0;
			
		$header = 	$options->Header;
		$inHeader = array();
		
		for($i = 0; $i < count($options->Header); $i++){
			array_push($inHeader, $options->Header[$i]->field);
		}
		
		$length = count($data);
		
		for($i = $options->ExcludeFirstLine ? 1 : 0; $i < $length; $i++){
			
			$new = self::CreateInstance($data[$i], $header);
			//
			// Vérification d'existance de la fiche en base de données.
			//
			$old = self::DataExists($new);
			
			if($old){//Les données existent
				
				if($options->EraseIfExists){ // Fusion des données
				
					$new->Contact_ID = @$old->Contact_ID;
					
					foreach($old as $key => $value){
						
						switch($key){
							case 'Comment':
								
								foreach($old->Comment as $key2 => $value2){
									if(!in_array($key.'.'.$key2, $inHeader)){
										$new->Comment->$key2 = $value2;	
									}
								}
								continue;
								
							case 'Phone':
								
								foreach($old->Phone as $key2 => $value2){
									if(!in_array($key.'.'.$key2, $inHeader)){
										$new->Phone->$key2 = $value2;	
									}
								}
								continue;
							
							case 'Email':
								
								foreach($old->Email as $key2 => $value2){
									if(!in_array($key.'.'.$key2, $inHeader)){
										$new->Email->$key2 = $value2;	
									}
								}
								continue;
								
							default:
							
								if(!in_array($key, $inHeader)){
									$new->$key = $value;	
								}
						}
					}
					
					if($new->commit()){
						array_push($options->merged, $new);	//On stocke les données comme étant fusionnées.
					}else{
						die(Sql::Current()->getError());	
					}
				}else{
					
					if($options->CreateIfExists){//Création d'une entrée même si les données existent
						if($new->commit()){
							$options->created++;
						}else{
							die(Sql::Current()->getError());	
						}
					}else{//On stock les données non ajoutées
						array_push($options->noneAdd, $new);	
					}
					
				}
				
			}else{
				if($new->commit()){
					$options->created++;
				}else{
					die(Sql::Current()->getError());	
				}
			}
								
		}
		
		return $options;
			
		
	}

/**
 * ContactIO.CreateInstance() -> void
 *
 * Cette méthode compte le nombre d'élement dans la table. 
 **/	
	protected static function CreateInstance($data, $header){
				
		$o = 			new Contact();
		$o->Comment = 	new stdClass();
		$o->Email = 	new stdClass();
		$o->Phone = 	new stdClass();
		$o->Web = 		array();
						
		for($i = 0; $i < count($header); $i++){
			$fields = 	explode('.', $header[$i]->field);
			$field =	$fields[0];
			
			$key =		$header[$i]->key;
			$value =	trim(is_object($data) ? $data->$key : $data[$key]);
			
			if(empty($value)){
				continue;
			}
			
			switch($field){
				
				default:
					$o->{$field} = $value;
					break;
												
				case 'Address': //concaténation des champs adresses
					$o->{$field} .= $value . " \n";
					break;
					
				case 'Phone':	//Champ JSON
					$value = trim(str_replace(array('#', '.', ' ', '_', '-'), '', $value));
						
				case 'Email':
				case 'Comment': 
					
					$subfield = $fields[1];
								
					$o->{$field}->{$subfield} = $value;
					break;
					
				case 'Web': 	//Stockage des liens web multiple
					array_push($o->Web, $value);
					break;
			}
		}
		//
		// Nettoyage des informations
		//
		$o->Address = 		trim($o->Address);
				
		if($o->Categories == ''){
			$o->Categories =	array('all');
		}else{
			Contact::AddCategory(ucfirst(trim(strtolower($o->Categories))));
			$o->Categories = array(strtolower(trim($o->Categories)));
		}
		
		return $o;
	}
/**
 * 
 **/	
	protected static function DataExists($obj){
		$request = new Request();
		
		$request->from = 	Contact::TABLE_NAME;
		$request->where = 	'Name = "' . Sql::EscapeString($obj->Name) . '" 
							AND FirstName = "' . Sql::EscapeString($obj->FirstName) .'"
							AND CP = "' . Sql::EscapeString($obj->CP) .'"' ;
		
		$result = $request->exec('select');
		
		if($result['length'] >= 1){
			return new Contact($result[0]);
		}
		return false;
	}
	
	public static function TypeToLabel($type){
		return empty(self::$LABELS[$type]) ?  '' : 	self::$LABELS[$type];
	}

/**
 * ContactIO.Export(options) -> String
 *
 * Cette méthode permet d'exporter les données.
 **/	
	public static function Export($options = ''){
		set_time_limit(0);
		
		if(empty($options->Format)){
			$format = 'csve';
		}else{
			$format = $options->Format;	
		}
		
		//récupérer la liste
		$obj = 			new stdClass();

		$obj->data = 	Contact::GetList();
		$obj->options = $options;
		
		self::SetOptions($obj);
		
		@Stream::MkDir(System::Path('prints'), 0755);
		$folder = System::Path('prints');
		$file = System::Path('prints') . 'contacts-u' . User::Get()->User_ID;
		
		for($i = 0; $i < $obj->data['length']; $i++){
			$contact = new Contact($obj->data[$i]);
			$contact->Categories = implode(', ', $contact->getCategoriesName());
									
			$contact->Comment = 		is_object($contact->Comment) ? $contact->Comment: json_decode($contact->Comment);	
			$contact->Function = 	'';
			$contact->Sector = 		'';
			$contact->Remarque = 	'';
			$contact->Service = 	'';
			$contact->Phone_Home = 	'';
			$contact->Phone_Office = 	'';
			$contact->Phone_Other = 	'';
			$contact->Phone_Mobile = 	'';
			$contact->Fax = 			'';
			
			$contact->Email_Home = 		'';
			$contact->Email_Office = 	'';
			$contact->Email_Other = 	'';
			
			foreach($contact->Comment as $key =>$value){
				$contact->{ucfirst($key)} = $value;
			}
			
			foreach($contact->Email as $key => $value){
				$contact->{'Email_' . ucfirst($key)} = $value;
			}
			
			foreach($contact->Phone as $key => $value){
				if($key == 'fax'){
					$contact->Fax = str_replace(array('_', '.', '-', ' '), '', $value);
				}else{
					$contact->{'Phone_' . ucfirst($key)} = str_replace(array('_', '.', '-', ' '), '', $value);
				}
			}
			
			unset($contact->Comment, $contact->Medias, $contact->text, $contact->value, $contact->Letter, $contact->Avatar, $contact->Avatar_LD, $contact->Phone, $contact->Email, $contact->State, $contact->County);
			
			$contact->Web = implode("\n", $contact->Web);
			
			$obj->data[$i] = $contact;
			
		}
		
		//exportation au bon format
		switch($format){
			default:
			case 'vcard':
				$vCarnet = new vCarnet();
			
				for($i = 0; $i < $obj->data['length']; $i++){
					$contact = 				$obj->data[$i];
					
					$vCard = new vCard();
					
					$vCard->Name =			$contact->Name;
					$vCard->FirstName =		$contact->FirstName;
					$vCard->Org =			$contact->Company;
					$vCard->Title =			$contact->Function;
					$vCard->Note =			'Catégorie : '.$contact->Categories;
					
					if(!empty($client->Call)){
						$vCard->Note .=	$contact->Call;
					}
					
					$vCard->Tel	=			$contact->Phone_Home;
					$vCard->Mobile	=		$contact->Phone_Mobile;
					$vCard->TelWork	=		$contact->Phone_Office;
					
					$vCard->Fax =			$contact->Fax;
					$vCard->Address =		$contact->Address;
					$vCard->City =			$contact->City;
					$vCard->Code =			$contact->CP;
					$vCard->Country =		$contact->Country;
					$vCard->Email =			empty($contact->Email_Office) ? (empty($contact->Email_Home) ?  $contact->Email_Other : $contact->Email_Home) : $contact->Email_Office;
					
					$vCarnet->push($vCard);
				}
				
				$file = $vCarnet->Package(System::Path('prints'));
				
				break;
				
			case 'xml':
				
				$file = $file.'.xml';
				
				$Node = new XmlNode();
				$Node->Name = 'contacts';
				$Node->pushAttr('size', $obj->data['length']);
				
				for($i = 0; $i < $obj->data['length']; $i++){
					$xml = new XmlNode();
					$xml->Name = 'contact';
					$xml->pushAttr('id', $obj->data[$i]->Contact_ID);
					
					$xml->pushRow($obj->data[$i]);
					
					$Node->push($xml);
				}
				
				Stream::WriteXml($file, $Node, 'Généré par Contacts Javalyss');
				
				$zip = System::Path('prints').'contacts-u'.User::Get()->User_ID.'.xml.zip';
				
				Stream::Package($file, $zip);
				$file = $zip;
				break;
				
			case 'csve':
				$file = $file.'.csv';
				
				Stream::WriteCSV($file, $obj->data, NULL, ';', '"');
				
				break;
				
			case 'csvo':
				$file = $file.'.csv';
				
				$header = array(
					array("Name", 			"Nom"),
					array("FirstName", 		"Prenom"),
					array("Email_Home", 	"Adresse de messagerie"),
					array("Phone_Home", 	"Téléphone personnel"),
					array("Fax", 			"Télécopie personnelle"),
					array("Address",		"Rue (bureau)"),
					array("City",			"Ville (bureau)"),
					array("CP",				"Code postal (bureau)"),
					array("Country",		"Pays/région (bureau)"),
					array("Phone_Office",	"Téléphone professionnel"),
					array("Company", 		"Société"),
					array("Function",		"Fonction"),
					array("Service",		"Service"),
					array("Email_Office",	"Adresse professionnelle"),
					array("Remarques",		"Remarques")
				);
				
				Stream::WriteCSV($file, $obj->data, $header, ',', '"');
				break;
		}
				
		return File::ToURI($file);
	}
/**
 * ContactIO#printPDF([options]) -> void
 **/
	public function printPDF($options = ''){
		
		if(empty($options->Model)){
			$model = 'default';
		}else{
			$model = $options->Model;	
		}
		
		//
		// References
		//
		@Stream::MkDir(System::Path('prints'), 0755);
		
		//
		// Configuration
		//
		self::Set($this);
		self::SetOptions($options);
		self::SetLink(System::Path('prints').'crm-contacts-'.User::Get()->User_ID.'.pdf');
		//
		// Libération des ressources
		// 
		@unlink(self::GetLink());	
		
		$models = new ModelPDF(CRM_PATH . 'models/prints/contacts/', System::Path('self'));
		
		include($models->link($model));
		//
		// Gestion des nouveaux modèles d'impression
		//		
		$pdf =	self::GetPDF();
		
		if(!empty($pdf)){
			$pdf = self::GetPDF();
			$pdf->AddPage();
			$pdf->draw();
			$pdf->Output(self::GetLink(), 'F');
		}
		
		//
		// Envoi du lien
		//		
		return File::ToURI(self::GetLink());
	}
/**
 * ContactIO#PrintList([clauses [, options]]) -> void
 **/	
	public static function PrintList($clauses = '', $options = ''){
		set_time_limit(0);
		
		if(empty($options->Model)){
			$model = 'default';
		}else{
			$model = $options->Model;	
		}
		
		$obj = 			new stdClass();

		$obj->data = 	Contact::GetList($clauses, $options);
		$obj->clauses = $clauses;
		$obj->options = $options;
		
		self::SetOptions($obj);
		//
		//
		//
		self::SetLink(System::Path('prints').'listing-contacts-'.User::Get()->User_ID.'.pdf');
		//
		// Libération des ressources
		// 
		@unlink(self::GetLink());	
		
		$models = new ModelPDF(CONTACT_PATH . 'models/prints/listing/contacts/', System::Path('self'));
		
		include($models->link($model));
		//
		// Gestion des nouveaux modèles d'impression
		//		
		$pdf =	self::GetPDF();
		
		if(!empty($pdf)){
			$pdf = self::GetPDF();
			$pdf->Output(self::GetLink(), 'F');
		}
		//
		// Envoi du lien
		//	
		return File::ToURI(self::GetLink());
	}


}