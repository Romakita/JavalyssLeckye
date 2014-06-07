<table cellspacing="0" cellpadding="0" border="0" align="center" style="width:600px; border-collapse:collapse">
<thead>
    <tr style="border-bottom:1px solid #CFCFCF">
        <th style="text-align:center;padding:3px;">Référence</th>
        <th style="text-align:center;padding:3px;">Prix unitaire</th>
        <th style="text-align:center;padding:3px;">Quantité</th>
        <th style="text-align:center;padding:3px;">Prix total</th>
    </tr>
</thead>
<tbody>
<?php
    
    MyStoreCommand::GetProducts();
    
    while(MyStoreCommandProduct::Current()):
    ?>
    <tr>
        <td style="text-align:left;padding:3px;"><?php echo MyStoreCommandProduct::Reference() ?></td>
        <td style="text-align:right;padding:3px;"><?php echo MyStoreCommandProduct::PriceHT(',', ' ') ?></td>
        <td style="text-align:center;padding:3px;"><?php echo MyStoreCommandProduct::Qty() ?></td>
        <td style="text-align:right;padding:3px;"><?php echo MyStoreCommandProduct::AmountHT(',', ' ') ?></td> 
    </tr>
    <?php
        MyStoreCommandProduct::Next();
    endwhile;
?>
</tbody>
<tfoot>
    
    <tr style="border-top:1px solid #BFBFBF">
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('Sous-total') ?> <?php echo MyStore::ModeTVA() != MyStore::TVA_DISABLED ? MUI('HT') : '' ?></th>
        <td style="text-align:right;padding:3px"><?php echo MyStoreCommand::AmountHT(',', ' ')?></td>
    </tr>
    
    <tr style="font-size:11px; color:#666">
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('Eco-taxe') ?></th>
        <td style="text-align:right;padding:3px"><?php echo MyStoreCommand::EcoTax(',', ' ')?></td>
    </tr>
    
    <?php
        switch(MyStore::ModeTVA()){
            case MyStore::TVA_PRINT:
            case MyStore::TVA_USE:
                ?>
    <tr style="font-size:11px; color:#666">
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('TVA') . ' ' . MyStore::TVA() . '%' ?> </th>
        <td style="text-align:right;padding:3px"><?php echo MyStoreCommand::AmountTVA(',', ' '); ?></td>
    </tr>
            <?php
                break;	
        }
    ?>
    
    <?php
     //   if(MyStoreCommand::CostDelivery() != MyStore::NullPrice()):
    ?>
    
    <tr style="font-size:11px; color:#666">                                  
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('Coût de livraison'); ?></th>
        <td style="text-align:right;padding:3px"><?php echo MyStoreCommand::CostDelivery(',', ' '); ?></td>
    </tr>
    
    <?php
   //     endif;
    ?>
    
    <tr style="font-size:13px">
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('Total') ?> <?php echo MyStore::ModeTVA() != MyStore::TVA_DISABLED ? MUI('TTC') : '' ?></th>
        <td style="text-align:right;color:#D24726; font-weight:bold;padding:3px"><?php echo MyStoreCommand::AmountTTC(',', ' ');?></td>
    </tr>
                            
</tfoot>
</table>

<p style="font-size:9px">Récapitulatif non contractuel !</p>

<h2 style="color:#D24726;font-size:11pt">Livraison</h2>
            
<table cellspacing="0" cellpadding="0" border="0" align="center" style="width:600px; border-collapse:collapse">
<thead>
    <tr>
        <th>
            Adresse de livraison
        </th>
        <th style="width:5px"></th>
        <th>
            Adresse de facturation
        </th>
    </tr>
</thead>

<tbody>
    <tr>
    <td style="border:1px solid #CFCFCF;padding:5px;">
        <?php
            echo MyStoreCommand::AddressDelivery();
        ?>
    </td>
    <td style="width:5px"></td>
    <td style="border:1px solid #CFCFCF;padding:5px;">
        <?php
            echo MyStoreCommand::AddressBilling();
        ?>
    </td>
    </tr>
</tbody>
</table>