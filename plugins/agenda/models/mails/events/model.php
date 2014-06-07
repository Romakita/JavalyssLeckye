<?php
/*
Model Name: Rappel rendez-vous
Description:
Author: Lenzotti Romain
Version: 1.0
Meta: Mail, Agenda

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
?>
<div style="text-align:center; background:rgb(255,255,255);min-width:800px">
<br>
<br>

<table cellspacing="0" cellpadding="0" border="0" align="center" style="width:650px;color:rgb(122,118,111);line-height:23px;font-family:arial,helvetica,sans-serif;font-size:15px; border:1px solid #DFDFDF">

<thead>
<tr>
<td style="color:rgb(255,255,255);background:#9f04ca;line-height:25px;font-family:Segoe UI, helvetica,sans-serif;font-size:30px;text-align:left;padding:15px;padding-top:35px; font-weight:normal">
<span><?php echo Mail::TAG_SUBJECT; ?></span>
</td>
</tr>
</thead>

<tbody>
<tr>
<td style="background:rgb(255,255,255)">

<!-- body -->
<table cellspacing="0" cellpadding="0" border="0" align="center" style="width:600px">
<tbody>
<tr>
<td style="text-align:left;color:rgb(67,71,76);font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px; padding:25px 20px;">

<?php echo Mail::TAG_MESSAGE; ?>

</td>
</tr>
</tbody>
</table>
<!-- body -->

</td>
</tr>
</tbody>

<foot>
<tr>
<td style="background:#999;color:white;font-family:arial,helvetica,sans-serif;font-size:9px;text-align:center;padding:10px;">
<span>Généré par Javalyss Agenda</span>
</td>
</tr>
</tfoot>
</table>

</div>