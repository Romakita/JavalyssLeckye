<?php
/*
Model Name: Fiches clients + appels
Description: 
Author: Lenzotti Romain
Version: 0.1
Meta: Client, Appels

Copyright 2010  Javalyss

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

*/
$link = str_replace('models\prints\listing\clients', 'models\prints\clients', dirname(__FILE__).'\model.php');

require_once($link);

$pdf =	CRMClient::GetPDF();
$list = CRMClient::GetOptions()->data;

for($i = 0; $i < $list['length']; $i++){
	
	$o = new CRMClient($list[$i]);
	
	self::Set($o);
		
	$pdf->addSection();			
	$pdf->draw();
}

?>