<?php
/** section: CRM
 * class AgendaEventIO
 * includes ObjectPrint
 *
 * Cette classe gère les informations liées à un contact
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_agenda_event_io.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
class AgendaEventIO extends ObjectPrint{
/**
 * AgendaEventIO.GetDataFromImportedFile() -> void
 *
 * Cette méthode importe le fichier, l'analyse et renvoi un objet de configuration des données.
 **/
	protected static function GetDataFromImportedFile(){
		
		$folder = System::Path('private');
		
		FrameWorker::Start();
		
		$file = FrameWorker::Upload($folder, 'csv;xml;vcard;');
		//récupération du fichier
		
		$options = 			new stdClass();
		$options->uri = 	File::ToURI($file);
		$options->header = 	new stdClass();
		$options->data = 	Stream::GetData($file);
		
		//
		// Detection d'entete
		//
		$config = 			self::DataMerge($options->data);
		$haveHeader =		false;
				
		foreach($config as $key => $value){
			
			if(self::IsDate($value)){//Les dates sont ignorés
				continue;	
			}
			
			$o = new stdClass();
			$o->title = 'Champ N°' + $key;
			
			switch(trim(strtolower($value))){
				default:
						
					if(in_array(substr(trim($value), 0, 6), array('http:/', 'https:'))){
												
						//création du type de colonne possible
						
						$o->data = 	array(
							array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
							array('text' => MUI('Adresse web'), 'value' => 'Web')
						);
						
						break;
					}
			
					if(self::IsMail($value)){//Les dates sont ignorés
						
						//création du type de colonne possible
						
						$o->data = 	array(
							array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
							array('text' => MUI('E-mail'), 'value' => 'Email'),
							array('text' => MUI('E-mail (autre)'), 'value' => 'Comment.email')
						);
						
						$options->header->$key = $o;
						continue;	
					}
					
			
					// les autres champs	
					$o = new stdClass();
					$o->title = 'Champ N°' + $key;
					
					//création du type de colonne possible
					
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('ID'), 'value' => 'Comment.id'),
						array('text' => MUI('Société'), 'value' => 'Company'),
						array('text' => MUI('Raison sociale'), 'value' => 'CompanyName'),
						array('text' => MUI('Catégorie'), 'value' => 'Categories'),
						
						array('text' => MUI('Adresse'), 'value' => 'Address'),
						array('text' => MUI('Code postal'), 'value' => 'CP'),
						array('text' => MUI('Ville'), 'value' => 'City'),
						array('text' => MUI('Pays'), 'value' => 'Countries'),
						
						array('text' => MUI('Téléphone'), 'value' => 'Phone'),
						array('text' => MUI('Fax'), 'value' => 'Fax'),
										
						array('text' => MUI('Activité'), 'value' => 'Comment.activity'),
						
						array('text' => MUI('N° RCS'), 'value' => 'Comment.rcs'),
						array('text' => MUI('N° Siren'), 'value' => 'Comment.siren'),
						array('text' => MUI('N° Siret'), 'value' => 'Comment.siret'),
						array('text' => MUI('N° TVA Intra'), 'value' => 'Comment.tvaintra'),
						array('text' => MUI('Taille société'), 'value' => 'Comment.sizeofcompany'),
						array('text' => MUI('Remarques'), 'value' => 'Comment.remarques')
					);
					
					break;
					
				case 'id':
				case 'client_id':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('ID'), 'value' => 'Comment.id', 'selected' => true)
					);
					$haveHeader = true;
					break;
									
				case 'societe':
				case 'company':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Société'), 'value' => 'Company', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
				case 'raison_social':
				case 'raison':
				case 'companyname':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Raison sociale'), 'value' => 'CompanyName', 'selected' => true)
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
					$haveHeader = true;
					break;
										
				case 'mail':
				case 'email':
				case 'e_mail':
				case 'e-mail':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('E-mail'), 'value' => 'Email'),
						array('text' => MUI('E-mail (autre)'), 'value' => 'Comment.email')
					);
					$haveHeader = true;
					break;
				
				case 'phone':
				case 'tel':
				case 'telephone':
				case 'mobile':
				case 'portable':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Téléphone'), 'value' => 'Phone', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
				case 'fax':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Fax'), 'value' => 'Fax', 'selected' => true)
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
				case 'activity':
				case 'activite':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Activité'), 'value' => 'Comment.activity', 'selected' => true)
					);
					$haveHeader = true;
					break;	
					
				case 'rcs':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('N° RCS'), 'value' => 'Comment.rcs', 'selected' => true)
					);
					$haveHeader = true;
					break;
				case 'siren':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('N° Siren'), 'value' => 'Comment.siren', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
				case 'siret':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('N° Siret'), 'value' => 'Comment.siret', 'selected' => true)
					);
					$haveHeader = true;
					break;
					
				case 'tva_intra':
				case 'tva-intra':
				case 'tvaintra':
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('N° TVA Intra'), 'value' => 'Comment.tvaintra', 'selected' => true)
					);
					$haveHeader = true;
					break;
					
				case 'taille':
				case 'size':
				
					$o->data = 	array(
						array('text' => ' - ' . MUI('Choississez') . ' - ', 'value' => ''),
						array('text' => MUI('Taille société'), 'value' => 'Comment.sizeofcompany', 'selected' => true)
					);
					$haveHeader = true;
					break;
				
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
		
		$options->ExcludeFirstLine = $haveHeader;
				
		FrameWorker::Stop($options);
	}
/**
 * AgendaEventIO.ImportFile() -> void
 *
 * Cette méthode compte le nombre d'élement dans la table. 
 **/
	protected static function ImportFile($options){
		//CRMPlugin::AddCategory('Importé', 'imported');
		
		$file = File::ToABS($options->File);
		$data = Stream::GetData($file);
		
		$options->noneAdd = array();
		$options->merged = 	array();
		$options->created = 0;
		
		switch(Stream::Extension($file)){
			case 'csv':
				
				$header = 	$options->Header;
				$inHeader = array();
				
				for($i = 0; $i < count($options->Header); $i++){
					array_push($inHeader, $options->Header[$i]);
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
						
							$new->Client_ID = $old->Client_ID;
							
							foreach($old as $key => $value){
								if($key == 'Comment') {
									foreach($old->Comment as $key2 => $value2){
										if(!in_array($key2, $inHeader)){
											$new->Comment->$key2 = $value2;	
										}
									}
									continue;
								}
								
								if(!in_array($key, $inHeader)){
									$new->$key = $value;	
								}
							}
							
							if($new->commit()){
								array_push($options->merged, $new);	//On stocke les données comme étant fusionnées.
							}else{
								die(Sql::Current()->getError());	
							}
							array_push($options->merged, $new);	//On stocke les données comme étant fusionnées.
							
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
		
	}
/**
 * AgendaEventIO.CreateInstance() -> AgendaEventIO
 **/	
	protected static function CreateInstance($data, $header){
		
		$sizeTypes = 	array('0', '0-9', '10-19', '20-49', '50-249', '250 et plus');
		
		$o = 			new AgendaEvent();
		$o->Comment = 	new stdClass();
		$o->Web = 		array();
						
		for($i = 0; $i < count($header); $i++){
			$fields = 	explode('.', $header[$i]->field);
			$field =	$fields[0];
			
			$key =		$header[$i]->key;
			$value =	trim($data[$key]);
			
			if(empty($value)){
				continue;
			}
			
			switch($field){
				
				default:
					$o->{$field} = $value;
					break;
												
				case 'Address':  //concaténation des champs adresses
					$o->{$field} .= $value . " \n";
					break;
				
				case 'Comment': //Champ JSON
					$subfield = $fields[1];
					
					if($subfield == 'sizeofcompany'){
						$size = 1 * $value;
						if($size <= 5){
							$value = $sizeTypes[$size];
						}
					}
										
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
		$o->Fax = 			trim(str_replace(array('#', '.', ' ', '_', '-'), '', $o->Fax));
		$o->Phone = 		trim(str_replace(array('#', '.', ' ', '_', '-'), '', $o->Phone));
		
		if($o->Categories == ''){
			$o->Categories =	array('all');
		}else{
			CRMPlugin::AddCategory(ucfirst(trim(strtolower($o->Categories))));
			$o->Categories = array(strtolower(trim($o->Categories)));
		}
		
		return $o;
	}
/**
 * AgendaEventIO.DataExists() -> void
 **/	
	protected static function DataExists($obj){
		$request = new Request();
		
		$request->from = 	AgendaEvent::TABLE_NAME;
		$request->where = 	'Company = "' . Sql::EscapeString($obj->Company) . '" AND CP = "' . Sql::EscapeString($obj->CP) .'"' ;
		
		$result = $request->exec('select');
		
		if($result['length'] >= 1){
			return new AgendaEvent($result[0]);
		}
		return false;
	}
/**
 * Client.Export(extension [, clauses [, options]) -> String
 *
 * Cette méthode permet d'exporter les données.
 **/	
	public static function Export($clauses = '', $options = ''){
		set_time_limit(0);
		
		if(empty($options->Format)){
			$format = 'csve';
		}else{
			$format = $options->Format;	
		}
		
		//récupérer la liste
		$obj = 			new stdClass();

		$obj->data = 	AgendaEvent::GetList($clauses, $options);
		$obj->clauses = $clauses;
		$obj->options = $options;
		
		self::SetOptions($obj);
		
		@Stream::MkDir(System::Path('prints'), 0755);
		$folder = System::Path('prints');
		$file = System::Path('prints') . 'clients-u' . User::Get()->User_ID;
		
		for($i = 0; $i < $obj->data['length']; $i++){
			$client = new AgendaEvent($obj->data[$i]);
			$client->Categories = implode(', ', $client->getCategoriesName());
			
			if(!empty($client->Call)){
				$str = '';
				
				if(!empty($client->Call->Date_Call)){
					$str .= MUI('Dernier appel') . ' : ' . ObjectTools::DateFormat($client->Call->Date_Call, "%d/%m/%Y %H:%M") . "\n";	
				}
				
				$str = MUI('Conclusion') . ' : ' . $client->Call->Conclusion . "\n";
				
				if(!empty($e->Date_Recall)){
					$str .= MUI('Prochain appel') . ' : ' . ObjectTools::DateFormat($client->Call->Date_Recall, "%d/%m/%Y") . "\n";
				} 
				
				$client->Call =	$str;
			}
						
			$client->Comment = 		is_object($client->Comment) ? $client->Comment: json_decode($client->Comment);	
			$client->Activity = 	'';
			$client->Size = 		'';
			$client->Remarque = 	'';
			$client->Siren = 		'';
			$client->Siret = 		'';
			$client->TVA_Intra = 	'';
			
			foreach($client->Comment as $key =>$value){
				switch($key){
					case 'activity':
						$client->Activity = $value;
						break;	
					case 'sizeofcompany':
						$client->Size = $value;
						break;
					
					case 'remarque':
						$client->Remarque = $value;
						break;
					
					case 'siren':
						$client->Siren = $value;
						break;	
					
					case 'siret':
						$clients->Siret = $value;
						break;	
					
					case 'tvaintra':
						$client->TVA_Intra = $value;
						break;	
				}
			}
			
			unset($client->Comment, $client->Medias, $client->text, $client->value, $client->Letter, $client->Avatar, $client->Avatar_LD);
			
			$client->Web = implode("\n", $client->Web);			
			$obj->data[$i] = $client;
			
			
		}
		
		//exportation au bon format
		switch($format){
			default:
			case 'vcard':
				$vCarnet = new vCarnet();
			
				for($i = 0; $i < $obj->data['length']; $i++){
					
					$vCard = new vCard();
					
					$vCard->Name =			$client->Company;
					$vCard->Org =			$client->CompanyName.' '.$client->Company;
					$vCard->Title =			$client->Activity;
					$vCard->Note =			'Catégorie : '.$client->Categories;
					
					if(!empty($client->Call)){
						$vCard->Note .=	$client->Call;
					}
					
					$vCard->TelWork	=		$client->Phone;
					$vCard->Fax =			$client->Fax;
					$vCard->Address =		$client->Address;
					$vCard->City =			$client->City;
					$vCard->Code =			$client->CP;
					$vCard->Country =		$client->Country;
					$vCard->Email =			$client->Email;
					
					$vCarnet->push($vCard);
				}
				
				$file = $vCarnet->Package(System::Path('prints'));
				
				break;
				
			case 'xml':
				
				$file = $file.'.xml';
				
				$Node = new XmlNode();
				$Node->Name = 'clients';
				$Node->pushAttr('size', $obj->data['length']);
				
				for($i = 0; $i < $obj->data['length']; $i++){
					$client = new XmlNode();
					$client->Name = 'client';
					$client->pushAttr('id', $obj->data[$i]->Client_ID);
					
					$client->pushRow($obj->data[$i]);
					
					$Node->push($client);
				}
				
				Stream::WriteXml($file, $Node, 'Généré par CRM Master v'.CODE_VERSION.CODE_SUBVERSION);
				
				$zip = System::Path('prints').'clients-u'.User::Get()->User_ID.'.xml.zip';
				
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
					array("Societe", 		"Nom"),
					array("Email", 			"Adresse de messagerie"),
					array("Tel", 			"Téléphone personnel"),
					array("Fax", 			"Télécopie personnelle"),
					array("Adresse",		"Rue (bureau)"),
					array("Ville",			"Ville (bureau)"),
					array("CP",				"Code postal (bureau)"),
					array("Pays",			"Pays/région (bureau)"),
					array("Tel",			"Téléphone professionnel"),
					array("Fax",			"Télécopie professionnelle"),
					array("Societe",		"Société"),
					array("Activite",		"Fonction"),
					array("Service",		"Service"),
					array("Email",			"Adresse professionnelle"),
					array("Remarques",		"Remarques")
				);
				
				Stream::WriteCSV($file, $obj->data, $header, ',', '"');
				break;
				
			/*case 'pdf':
				$pdf = self::PrintList($_POST['clauses'], $_POST["options"]);
				@Stream::MkDir(System::Path('prints'), 0777);
				$file = System::Path('prints') . 'clients_user_'.User::Get()->User_ID.'.pdf';
				@unlink($file);
				$pdf->Output($file, 'F');
				
				$zip = $folder.'clients_user_'.User::Get()->User_ID.'.pdf.zip';
				
				Stream::Package($file, $zip);
				$file = $zip;
				break;*/
		}
				
		return File::ToURI($file);
	}
/**
 * AgendaEvent#printPDF([options]) -> void
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
		self::SetLink(System::Path('prints').'agenda-'.User::Get()->User_ID.'.pdf');
		//
		// Libération des ressources
		// 
		@unlink(self::GetLink());	
		
		$models = new ModelPDF(AGENDA_PATH . 'models/prints/events/', System::Path('self'));
		
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
 * AgendaEvent#PrintList([clauses [, options]]) -> void
 **/	
	public static function PrintList($clauses = '', $options = ''){
		set_time_limit(0);
		
		if(empty($options->Model)){
			$model = 'default';
		}else{
			$model = $options->Model;	
		}
		
		$obj = 			new stdClass();

		$obj->data = 	AgendaEvent::GetList($clauses, $options);
		$obj->clauses = $clauses;
		$obj->options = $options;
		
		self::SetOptions($obj);
		//
		//
		//
		self::SetLink(System::Path('prints').'agenda-listing-'.User::Get()->User_ID.'.pdf');
		//
		// Libération des ressources
		// 
		@unlink(self::GetLink());	
		
		$models = new ModelPDF(AGENDA_PATH . 'models/prints/listing/', System::Path('self'));
		
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
?>