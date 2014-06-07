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
    
    MyEventCommand::GetProducts();
    
    while(MyEventCommandProduct::Current()):
    ?>
    <tr>
        <td style="text-align:left;padding:3px;"><?php echo MyEventCommandProduct::Reference() ?></td>
        <td style="text-align:right;padding:3px;"><?php echo MyEventCommandProduct::Price(',', ' ') ?></td>
        <td style="text-align:center;padding:3px;"><?php echo MyEventCommandProduct::Qty() ?></td>
        <td style="text-align:right;padding:3px;"><?php echo MyEventCommandProduct::Amount(',', ' ') ?></td> 
    </tr>
    <?php
        MyEventCommandProduct::Next();
    endwhile;
?>
</tbody>
<tfoot>
    
    <tr style="border-top:1px solid #BFBFBF">
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('Sous-total') ?> <?php MyEvent::ModeTVA() != MyEvent::TVA_DISABLED ? MUI('HT') : '' ?></th>
        <td style="text-align:right;padding:3px"><?php echo MyEventCommand::AmountHT(',', ' ')?></td>
    </tr>
    
    <tr style="font-size:11px; color:#666">
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('Dont éco-taxe') ?></th>
        <td style="text-align:right;padding:3px"><?php echo MyEventCommand::EcoTax(',', ' ')?></td>
    </tr>
    
    <?php
        switch(MyEvent::ModeTVA()){
            case MyEvent::TVA_PRINT:
            ?>
    <tr style="font-size:11px; color:#666">
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('Dont TVA') . ' ' . MyEvent::TVA() . '%' ?> </th>
        <td style="text-align:right;padding:3px"><?php echo MyEventCommand::AmountTVA(',', ' '); ?></td>
    </tr>
            <?php
                break;
            case MyEvent::TVA_USE:
                ?>
    <tr style="font-size:11px; color:#666">
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('TVA') . ' ' . MyEvent::TVA() . '%' ?> </th>
        <td style="text-align:right;padding:3px"><?php echo MyEventCommand::AmountTVA(',', ' '); ?></td>
    </tr>
            <?php
                break;	
        }
    ?>
    
    <?php
        if(MyEventCommand::CostDelivery() != MyEvent::NullPrice()):
    ?>
    
    <tr style="font-size:11px; color:#666">
        <td colspan="2">* <?php echo MUI('Sur la base d\'une livraison standard'); ?></td>                                           
        <th style="text-align:right;padding:3px">* <?php echo MUI('Coût de livraison standard'); ?></th>
        <td style="text-align:right;padding:3px"><?php echo MyEventCommand::CostDelivery(',', ' '); ?></td>
    </tr>
    
    <?php
        endif;
    ?>
    
    <tr style="font-size:13px">
        <th colspan="3" style="text-align:right;padding:3px"><?php echo MUI('Total') ?> <?php MyEvent::ModeTVA() != MyEvent::TVA_DISABLED ? MUI('TTC') : '' ?></th>
        <td style="text-align:right;color:#D24726; font-weight:bold;padding:3px"><?php echo MyEventCommand::Amount(',', ' ');?></td>
    </tr>
                            
</tfoot>
</table>

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
            echo MyEventCommand::AddressDelivery();
        ?>
    </td>
    <td style="width:5px"></td>
    <td style="border:1px solid #CFCFCF;padding:5px;">
        <?php
            echo MyEventCommand::AddressBilling();
        ?>
    </td>
    </tr>
</tbody>
</table>