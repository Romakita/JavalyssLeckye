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
    <script type="text/javascript" src="<?php echo System::Path('uri') ?>js/window/extends.min.js?lang=fr"></script>
    <script type="text/javascript" src="<?php echo System::Path('uri') ?>js/window/window.min.js"></script>
    <script type="text/javascript" src="<?php echo System::Path('uri') ?>js/minsys.js"></script>

    <script>

        MinSys.version =	'<?php echo System::Meta('CODE_VERSION'). System::Meta('CODE_SUBVERSION'); ?>';
        MinSys.PHPSESSID = 	'<?php echo session_id(); ?>';

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


<div class="content html-node carbon-node">
    <div class="form-connector">

        <form action="#" method="post" name="" onsubmit="return MinSys.connect(this);">
            <h1><?php echo MUI('Connexion'); ?></h1>


            <table class="table-data">
                <tbody>
                <tr>
                    <th><?php echo MUI('Identifiant'); ?> <span class="double-dot">:</span></th>
                    <td class="champ"><input type="text" name="Login" class="box-login" maxlength="130" /></td>
                </tr>
                <tr>
                    <th><?php echo MUI('Mot de passe'); ?> <span class="double-dot">:</span></th>
                    <td class="champ"><input type="password" name="Password" class="box-password" maxlength="15" /></td>
                </tr>
                </tbody>
            </table>

            <div class="form-foot">
                <span class="button"><input type="submit" value="Connexion" /></span>
                <span class="button"><a href="javascript:MinSys.openLost()"><?php echo MUI('Mot de passe oublié'); ?></a></span>
            </div>
        </form>

    </div>
</div>

<div class="index-logo">
    <h1><?php echo NAME_VERSION ?> <span><?php echo CODE_VERSION.CODE_SUBVERSION ?></span></h1>
</div>
</body>
</html>