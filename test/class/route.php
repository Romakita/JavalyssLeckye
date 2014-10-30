<?php
/**
 * Created by PhpStorm.
 * User: romak_000
 * Date: 05/07/14
 * Time: 16:53
 */

namespace jUnitTest;

class Route extends \jUnitTest {

    function __construct(){
        \HTTP\Route::Initialize();
    }

    function requestMethodAccept(){
        $_SERVER['REQUEST_METHOD'] = 'GET';

        $request = new \HTTP\Route\Request('rest/appsme', array(
            'method' => "all"
        ));

        self::AssertTrue($request->methodAccept(), 'methodAccept 1');

        $request->setMethod('GET');
        self::AssertTrue($request->methodAccept(), 'methodAccept 2');

        $request->setMethod('GET;POST');

        self::AssertTrue($request->methodAccept(), 'methodAccept 3');

        $request->setMethod('get;POST');
        self::AssertTrue($request->methodAccept(), 'methodAccept 3');

        $request->setMethod('POST');
        self::AssertFalse($request->methodAccept(), 'methodAccept 4');
    }

    function requestProtocolAccept(){
        $request = new \HTTP\Route\Request('rest/appsme', array(
            'protocol' => "all"
        ));

        self::AssertTrue($request->protocolAccept(), 'protocolAccept 1');

        $request->setProtocol('https');

        self::AssertFalse($request->protocolAccept(), 'protocolAccept 2');
    }

    function requestIPAccept(){
        $request = new \HTTP\Route\Request('rest/appsme', array(
            'ip' => "all"
        ));

        self::AssertTrue($request->ipAccept(), 'protocolAccept 1');

        $request->setIP('127.0.0.1');

        self::AssertTrue($request->ipAccept(), 'protocolAccept 2');

        $request->setIP('84.102.1.25');

        self::AssertFalse($request->ipAccept(), 'protocolAccept 2');
    }

    function permalink(){
        $link = new \Permalink('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/1.1.1');

        self::AssertTrue($link->https(), 'Détection du protocole HTTPS');

        self::AssertTrue($link->getMetaLink() != 'https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/1.1.1', 'Comparaison du permalien et d l\'hote ' .  $link->getMetaLink());

        self::AssertTrue(count($link->getParameters()) == 6, 'Invalide parameters ' . json_encode($link->getParameters()));

        $link = new \Permalink('http://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/1.1.1');
        self::AssertFalse($link->https(), 'Détection du protocole HTTPS');

    }

    function requestStaticRoute(){
        $request = new \HTTP\Route\Request('rest/appsme/2.0/apps');

        self::AssertTrue($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/'), 'La route ne correspond pas');
        self::AssertFalse($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/'), 'Unroute 1');
        self::AssertFalse($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsMME/2.0/apps/javalyssleckye/'), 'Unroute 2');
        self::AssertFalse($request->match('https://127.0.0.1/JavalyssLeckye/'), 'Unroute 3');
        self::AssertFalse($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/1.1.0/toto'), 'Unroute 4');
    }

    function requestDynamicRoute(){

        $request = new \HTTP\Route\Request('rest/appsme/2.0/apps/:appname/:appversion');

        self::AssertTrue($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/1.1.1'), 'La route ne correspond pas');
        self::AssertTrue($request->params->appname == 'javalyssleckye' && $request->params->appversion == '1.1.1', 'Wrong parameters ' . json_encode($request->params));

        self::AssertFalse($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/'), 'Unroutable 1');
        self::AssertFalse($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsMME/2.0/apps/javalyssleckye/'), 'Unroutable 2');
        self::AssertFalse($request->match('https://127.0.0.1/JavalyssLeckye/'), 'Unroutable 3');
        self::AssertFalse($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/1.1.0/toto'), 'Unroutable 4');
    }

    function requestOptionalParameters(){
        $request = new \HTTP\Route\Request('rest/appsme/2.0/apps/:appname/:appversion?');

        self::AssertTrue($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/1.1.1'), 'La route ne correspond pas');

        self::AssertTrue($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/'), 'La route ne correspond pas');
        self::AssertTrue($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye'), 'La route ne correspond pas');

        self::AssertFalse($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/1.1.1/HI'), 'Unroutable 1');

    }



    function route(){

        \HTTP\Route::When('rest/appsme/2.0/apps', array(

        ));

        //$request = new \HTTP\Route\Request('rest/appsme/2.0/apps/:appname/:appversion');

        //self::AssertTrue($request->match('https://127.0.0.1/JavalyssLeckye/rest/appsme/2.0/apps/javalyssleckye/1.1.1'), 'La route ne correspond pas');
    }

}