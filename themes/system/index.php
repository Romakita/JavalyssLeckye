<?php
/*
 * Index Theme : JavalyssLeckye
 * Author : Lenzotti Romain
 */
CoreUI::Create();
CoreUI::$Header->addChild('<link href="'.System::Path('uri').'themes/system/system.index.css" rel="stylesheet" type="text/css" />');
//
// FormConnector
//
$form = new FormConnector();
$form->Title = 'Connexion';
CoreUI::$Body->addChild('

<div class="content html-node carbon-node">
	'. $form .'
</div>

<div class="index-logo">
	<h1>'.NAME_VERSION . ' <span>v' . CODE_VERSION.CODE_SUBVERSION.'</span></h1>
</div>
');
CoreUI::Draw();
?>
