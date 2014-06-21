<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <title><?php echo MUI('Administration') ?> :: <?php echo NAME_VERSION; ?></title>

    <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0" />

    <link rel="shortcut icon" href="<?php echo System::Path('uri'); ?>themes/system/images/favicon.ico" type="image/x-icon">
    <link rel="icon" href="<?php echo System::Path('uri'); ?>themes/system/images/favicon.ico" type="image/x-icon">

    <?php
        if(System::Meta('MODE_DEBUG')):
    ?>
    <link type="text/css" rel="stylesheet" href="<?php echo System::Path('uri').'themes/compile/default/system/'; ?>">
    <?php
        else:
    ?>
    <link type="text/css" rel="stylesheet" href="<?php echo System::Path('uri').'themes/system.min.css'; ?>">
    <?php
        endif;

        System::Header();
    ?>

</head>
<body>

</body>
</html>