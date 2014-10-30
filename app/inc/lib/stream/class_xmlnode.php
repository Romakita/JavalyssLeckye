<?php
/** section: Library
 * class XmlNode
 * 
 * Cette classe représente un noeud XML et permet de créer un arbre complet dans le langage XML.
 * 
 * XmlNode ajoute le support de créer de document XML à la bibliothèque StreamManager.
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_xmlnode.php
 * * Version : 1.0
 * * Statut : STABLE
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
if(!class_exists('XmlNode')):
class XmlNode{
/**
 * XmlNode#Name -> String
 * Nom de noeud XML.
 **/
	public $Name = 			'node';
/**
 * XmlNode#Text -> String
 * Texte dans le corps du noeud XML.
 **/
	public $Text =			'';
/** 
 * XmlNode#Childs -> Array
 * `private` Liste des noeuds enfants du noeud XML.
 **/
	private $Childs = 		array();
/**
 * XmlNode#attributs -> Array
 * `private` Liste des attributs du noeaud XML.
 **/
	private $attributs = 	array();
/**
 * XmlNode#CDDATA -> Boolean
 **/
	public $CDDATA =		true;
/**
 * new XmlNode()
 *
 * Cette méthode créée une nouvelle instance [[XmlNode]].
 **/
	public function __construct($name = 'node'){
		$this->Name = $name;
	}
	
	final static function Encode($data, $replace = 'row'){
		$root = new XmlNode();
		
		if(is_numeric($data)){
			$data = 1 * $data;	
		}
			
		if(empty($replace)){
			$replace = 'row';	
		}
		
		$root->Name = gettype($data);
		$root->pushAttr('type', gettype($data));
		
		switch(gettype($data)){
			case 'boolean':
				$root->push($data ? 'true' : 'false');
				break;
			case 'double':
			case 'integer':
				$root->push($data);
				$root->CDDATA = false;
				break;
				
			case 'string':
				
				$root->push($data);
				break;
			case 'array':
				
				foreach($data as $key => $value){
					$child = 		self::Encode($value);
						
									
					if(preg_match('/{(.*)}/', $replace, $match)){
						$replace = str_replace($match[0], '', $replace);
						
						if(is_numeric($key)) $child->pushAttr($match[1], $key);
					}
					
					if(!is_numeric($key)){
						$root->attributs['type'] = 'object';
					}
					
					$child->Name = 	is_numeric($key)? $replace : $key;
					$root->push($child);
				}				
				
				break;
			case 'object':
				
				if(get_class($data)){
					$root->Name = get_class($data);	
				}
				
				foreach($data as $key => $value){
					
					$child = self::Encode($value);
					$child->Name = $key;
					$root->push($child);
					
				}
				
				break;
			case 'NULL':
				$data->push('null');
				break;
			default:break;	
		}
		
		return $root;
	}
/**
 * XmlNode#push(node) -> void
 * - node (XmlNode): Noeud XML enfant.
 *
 * Cette méthode ajoute un noeud XML à l'instance.
 **/	
	public function push($XmlNode){
		$this->Childs[] = $XmlNode;
	}
/**
 * XmlNode#pushRow(array [, header = null]) -> void
 * - array (array): Tableau de données à convertir en XML.
 * - header (array): Liste de champs à convertir.
 *
 * Cette méthode convertit le tableau associatif `array` au format XML et ajoute les noeuds à l'instance.
 **/	
	public function pushRow($array, $header = ''){
		
		if(!is_array($header)){
			foreach($array as $key => $value){
				if(is_numeric($key)) continue;
				
				$XmlNode = new XmlNode();
				$XmlNode->Name = $key;
				$XmlNode->Text = $value;
				$this->push($XmlNode);
			}
			
		}else{
			$length = count($header);
			
			for($i = 0; $i < $length; $i++){
				
				$XmlNode = new XmlNode();
				$XmlNode->Name = $header[$i];
				$XmlNode->Text = $array[$header[$i]];
				$this->push($XmlNode);
			}
		}
		
	}
/**
 * XmlNode#pushAttr(name, value) -> void
 * - name (String): Nom de l'attribut.
 * - value (mixed): Valeur de l'attribut
 *
 * Cette méthode ajoute un attribut au noeud XML.
 **/
	public function pushAttr($name, $value){
		
		if(empty($this->attributs[$name])){
			$this->attributs[$name] = $value;	
		}else{
			$this->attributs[$name] = ' '.$value;
		}
	}
/**
 * XmlNode#__toString() -> String
 *
 * Cette méthode convertit l'instance au format String.
 **/	
	public function __toString(){
		$node = '';
		if($this->Name != ''){
			$node = 	'<'.$this->Name;
			
			//attributs		
			foreach($this->attributs as $key =>$value){
				$node .=  ' '.$key.'="'.str_replace('"','\"', $value).'"';
			}
			
			$node .= '>';
		}
		
		if(count($this->Childs) > 0){
			$length = count($this->Childs);
			$inner = 	'';
						
			for($i = 0; $i < $length; $i++){
								
				switch(gettype($this->Childs[$i])){
					case 'string':
						if($this->CDDATA) $node .= "<![CDATA[".str_replace(']]>',']]&gt;', $this->Childs[$i]).']]>';
						else $inner .= $this->Childs[$i]."";
						break;
					default:
						$inner .=  $this->Childs[$i]."";
				}
			}
			
			$node .= "".$inner;
		}else{
			
			if($this->CDDATA) $node .= "<![CDATA[".str_replace(']]>',']]&gt;', $this->Text).']]>';
			else $node .= $this->Text;
		}
		
		if($this->Name != ''){
			$node .= 	'</'.$this->Name.'>';	
		}
		
		return $node;	
	}
}
endif;
?>