<?php
/*
Model Name: E-mail de paiement accepté
Description: Confirmation de commande envoyé aux clients.
Author: Lenzotti Romain
Version: 1.0

*/
?>
<div style="text-align:center; background:rgb(255,255,255);min-width:800px">
<style>
	a{
		color:#E38800;
	}
	a:hover{
		color:#069;
	}
</style>
<br>
<br>
<table cellspacing="0" cellpadding="0" border="0" align="center" style="width:650px;color:rgb(122,118,111);line-height:23px;font-family:arial,helvetica,sans-serif;font-size:15px; border:1px solid #DFDFDF">
<thead>
<tr>
<td style="color:rgb(255,255,255);background:#F90;line-height:25px;font-family:arial,helvetica,sans-serif;font-size:25px;text-align:left;padding:10px;">
	
    <strong>
    <span>
        <?php Blog::Info('name'); ?> 
    </span>
    </strong>
    	
</td>
</tr>
<tr>
<td style="text-align:left;color:#D24726;font-family:arial,helvetica,sans-serif; background:#F6F6F6;padding:5px 10px;">
	
    <strong>
    <span style="font-size:12pt;">
        
        Paiement accepté          
        
    </span>
    </strong>
        
</td>
</tr>

</thead>
<tbody>
	<tr>
	<td style="background:rgb(255,255,255)">
		
		<table cellspacing="0" cellpadding="0" border="0" align="center" style="width:600px">
		<tbody>
		<tr>
		<td style="text-align:left;color:rgb(67,71,76);font-family:arial,helvetica,sans-serif;font-size:12px;line-height:20px">
			<br>
				<p>Bonjour <?php $user = MyStoreCommand::GetUser(); echo $user->Name . ' ' . $user->FirstName ?>,</p>
           		<p>Le paiement pour votre commande a été accepté.</p>
                <p>Merci d'avoir commandé chez <a href="<?php Blog::Info('uri'); ?>"><?php Blog::Info('name') ?></a> !</p>
                
                <h2 style="color:#D24726;font-size:11pt">Détails de la commande</h2>
                
                <p><strong>Commande N° :</strong> <?php echo MyStoreCommand::NB(); ?> passée le <?php echo MyStoreCommand::DateCreate('%A %e %B %Y %H:%M'); ?></p>
                
                <?php include('fragment-billing.php'); ?>
                
                <p>Vous pouvez accéder au suivi de votre commande et télécharger votre facture dans <a href="<?php Blog::Info('page:compte/commandes') ?>">"Mes commandes"</a> de la rubrique <a href="<?php Blog::Info('page:compte');?>">"Mon compte"</a> sur notre site.</p>
                
			<br>
            
		</td>
		</tr>
		</table>
	</td>
	</tr>
<tbody>

</table>
<p style="color:#999; font-size:10px">Modèle généré par MyStore !</p>
<br>
<br>
</div>