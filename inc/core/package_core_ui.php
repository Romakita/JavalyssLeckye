<?php
/* section: Core
 * mixin Attributs
 * Cette utilitaire permet d'ajouter le support d'attribut sur les balises HTML.
 **/
abstract class Attributs{
/*
 * Attributs.attributs -> String
 * Liste des attributs enregistrés par une instance fille.
 **/
	private $attributs = array();
/*
 * Attributs.pushAttr(name, value) -> void
 * - name (String): Nom de l'attribut.
 * - value (mixed): Valeur de l'attribut
 *
 * Cette méthode ajoute un attribut à l'instance fille.
 **/
	public function pushAttr($name, $value){
		
		if(@$this->attributs[$name] != ''){
			$this->attributs[$name] .= ' ' . $value; 	
		}else{
			$this->attributs[$name] = $value;
		}
	}
/*
 * Attributs.serializeAttributs() -> String
 *
 * Cette méthode convertit les attributs enregistrés par une instance fille au format HTML.
 **/
	protected final function serializeAttributs(){
		//attributs
		$length = count($this->attributs);
		$str = '';
		
		foreach($this->attributs as $key => $value){
			$str .=  ' '.$key.'="'.str_replace('"','\"', $value).'"';
		}	
		return $str;
	}	
}
/* section: Core
 * class Node < XmlNode
 **/
class Node extends XmlNode{
	public $Name = 		'div';
	public $CDDATA = 	false;
	
	function __construct($name = 'div', $options = NULL, $child = ''){
		$this->Name = $name;
		
		if(is_array($options) || is_object($options)){
			foreach($options as $key => $value){
				$this->pushAttr($key, $value);
			}
		}
		
		if(is_string($child)){
			$this->addChild($child);
		}elseif(is_array($child)){
			foreach($child as $node){
				$this->addChild($node);
			}
		}
	}
	
	public function addChild($child){
		$this->push($child);
	}
}

class ElementNode extends Node{}
/* section: Core
 * class BoxElement < ElementNode
 **/
class BoxElement extends ElementNode{
	
	function __construct(){
		$this->pushAttr('class', 'box-element');
	}
}
/* section: Core
 * class AlertBox
 **/
class AlertBox{
	public $Text = 	'';
	public $Title = '';
	public $Type = 	'';
	public $Timer = '';
	
	function __construct($title = '', $text = '', $type = '', $timer = ''){
		$this->Title = $title;
		$this->Text = $text;
		$this->Type = $type;
		$this->Timer = $timer;
	}
	
	final function __toString(){
		$str = '<script>
					Extends.ready(function(){
						
						$S.AlertBox.setTitle("'.str_replace('"','\"', $this->Title).'");';
						
		if($this->Text instanceof SpliteWait){
			$str .= '$S.AlertBox.a(new SpliteWait("'.str_replace('"', '\"', $this->Text->Text).'"));';
		}elseif($this->Text instanceof SpliteInfo){
			$str .= '$S.AlertBox.a(new SpliteInfo("'.str_replace('"', '\"', $this->Text->Text).'"));';
		}else{
			$str .= '$S.AlertBox.setText("'.str_replace('"', '\"', $this->Text).'");';
		}
						
		$str .= '	$S.AlertBox.setType("'.$this->Type.'")'. ($this->Timer == '' ? '' : '.Timer('.$this->Timer.')') . '.show();
					});
				</script>';
		return $str;
	}
}
/* section: Core
 * class FormConnector
 * includes Attributs
 **/
class FormConnector extends Attributs{
	public $Title =		'';
	public $Text =		'';
	public $Action = 	'#';
	public $Method = 	'post';
	public $Name =		'';
	public $onSubmit = 	'return MinSys.connect(this);';
	public $LinkLost =	'javascript:MinSys.openLost()';
	public $Login =		'Identifiant';
	public $Password = 	'Mot de passe';
	
	function __construct($title = '', $text = ''){
		$this->Text = $text;
		$this->Title = $title;
		$this->pushAttr('class', 'form-connector');
	}
	
	final function __toString(){
		
		$str = '<div'.$this->serializeAttributs().'>
										
					<form action="'.$this->Action.'" method="'.$this->Method.'" name="'.$this->Name.'" '.($this->onSubmit != '' ? 'onsubmit="'.$this->onSubmit.'"' : '').'>
						'. ($this->Title == ''? '' : '<h1>'.$this->Title.'</h1>') .'
						'. ($this->Text == ''? '' : '<p>'.$this->Text.'</p>') .'
						
						<table class="table-data">
							<tbody>
							<tr>
								<th>' . $this->Login .' <span class="double-dot">:</span></th>
								<td class="champ"><input type="text" name="Login" class="box-login" maxlength="130" /></td>
							</tr>
							<tr>
								<th>' . $this->Password . ' <span class="double-dot">:</span></th>
								<td class="champ"><input type="password" name="Password" class="box-password" maxlength="15" /></td>
							</tr>
							</tbody>
						</table>
					
						<div class="form-foot">
							<span class="button"><input type="submit" value="Connexion" class="icon-connect-creating" /></span>
							' . ($this->LinkLost == "" ? "" : '<span class="button"><a href="'.$this->LinkLost.'" class="icon-password">Mot de passe oublié</a></span>').'
						</div>
					</form>
				</div>
		';
		return $str;
	}
}
/* section: Core
 * class SimpleButton
 * includes Attributs
 **/
class SimpleButton extends Attributs{
	public $Text = '';
	public $Icon = '';
	public $Link = '#';
	public $Style = '';
	
	function __construct($link = '', $text = '', $icon = ''){
		$this->Text = $text;
		$this->Link = $link;
		$this->Icon = $icon;
		$this->pushAttr('class', 'box-simple-button');
	}
	
	final function __toString(){
		
		if($this->Style != ''){
			$this->pushAttr('style', $this->Style);
			$this->Style = '';
		}
		
		return '<span '.$this->serializeAttributs().'><a href="'.$this->Link.'" class="'.$this->Icon.'">'.$this->Text.'</a></span>';
	}
}

?>