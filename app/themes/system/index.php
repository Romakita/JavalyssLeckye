<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <title><?php echo MUI('Connexion'); ?> :: <?php echo System::Meta('NAME_VERSION') ?></title>

    <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0" />

    <link rel="shortcut icon" href="<?php echo System::Path('uri') ?>themes/system/images/favicon.ico" type="image/x-icon">
    <link rel="icon" href="<?php echo System::Path('uri') ?>themes/system/images/favicon.ico" type="image/x-icon">

    <link type="text/css" rel="stylesheet" href="<?php echo System::Path('uri') ?>themes/compile/default/system/" media="screen" />
    <link type="text/css" rel="stylesheet" href="<?php echo System::Path('uri') ?>themes/system/system.index.css" media="screen" />

    <script type="text/javascript" src="<?php echo System::Path('uri') ?>js/prototype/prototype.1.7.2.js"></script>
    <script type="text/javascript" src="<?php echo System::Path('uri') ?>js/window/extends.js?lang=fr"></script>
    <script type="text/javascript" src="<?php echo System::Path('uri') ?>js/window/window.js"></script>
    <script type="text/javascript" src="<?php echo System::Path('uri') ?>js/minsys.js"></script>

    <script>

        MinSys.version =	'<?php echo System::Meta('CODE_VERSION'). System::Meta('CODE_SUBVERSION'); ?>';
        MinSys.PHPSESSID = 	'<?php echo session_id(); ?>';
        MinSys.URI_PATH =   '<?php echo System::Path('uri'); ?>';

        Object.extend(MinSys, '<?php echo addslashes(json_encode(System::getMetas())); ?>'.evalJSON());

        Extends.ready(function(){
            try{
                MinSys.startInterface();
                if($_GET['action'] == 'disconnect') MinSys.disconnect();
            }catch(er){if(window['console']){console.log(er)}}
        });
    </script>


</head>
<body>

<?php

if(!empty($_COOKIE["lastuserconnected"])){
    $infos = explode('^', $_COOKIE["lastuserconnected"]);
    $login = $infos[0];
    $avatar = $infos[1];
}
?>
<div class="content html-node carbon-node">
    <div class="form-connector">

        <form action="#" method="post" name="" onsubmit="return MinSys.connect(this);">
            <h1><?php echo MUI('Connexion'); ?></h1>

            <div class="form-body">

                <input type="text" name="Login" class="box-login" maxlength="130" placeholder="<?php echo MUI('Identifiant'); ?>"  value="<?php echo empty($login) ? '' : $login; ?>"/>

                <input type="password" name="Password" class="box-password" maxlength="15" placeholder="<?php echo MUI('Mot de passe'); ?>" />
                <input type="submit" value=" " />

                <div class="wrap-picture-login"<?php echo (!empty($avatar) ? ' style="background-image:url(' . $avatar.')"': ''); ?>></div>


            </div>
            <a class="forgotten" href="javascript:MinSys.openLost()"><?php echo MUI('Mot de passe oublié'); ?></a>
        </form>

    </div>
</div>

<div class="index-logo">
    <h1><?php echo NAME_VERSION ?> <span><?php echo CODE_VERSION.CODE_SUBVERSION ?></span></h1>
</div>
</body>
</html>