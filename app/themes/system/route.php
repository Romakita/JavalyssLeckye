<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <title>Routes :: <?php echo System::Meta('NAME_VERSION') ?></title>

    <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0" />
</head>
<body>

<table>
    <thead>
    <tr>
        <th>Method</th>
        <th>Route</th>
    </tr>
    </thead>
    <?php
    foreach($routes as $route):
        ?>
        <tr>
            <td style="padding:3px 10px;"><?php echo $route->getMethod() ?></td><td><a href="<?php echo System::Path('uri') . $route->getRoute() ?>"><?php echo $route->getRoute() ?></a></td>
        </tr>
    <?php
    endforeach;
    ?>

</table>

</body>
</html>