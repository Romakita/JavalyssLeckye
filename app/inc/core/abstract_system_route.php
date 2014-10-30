<?php
/** section: Core
 * class SystemRoute
 * includes SystemIncluder
 *
 **/
namespace System;

require_once('abstract_system_term.php');

abstract class Route extends Term{
    /**
     * System.SAFE -> String
     **/
    const SAFE = 			'safe';
    /**
     * System.CNT -> String
     **/
    const CNT =				'connected';

    private static $Error =		0;
    /**
     * System.Error() -> String
     * System.Error(err) -> String
     **/
    public static function Error($err = NULL){

        if($err != NULL){
            self::$Error = $err;
        }

        return self::$Error;
    }
    /**
     *
     **/
    protected static function Route(){

        //protection des routes admin
        \HTTP\Route::UseMiddleware('/admin', function($request, &$response){
            if(!User::IsConnect()){//utilisateur déconnecté
                $response->location(\System::Path('uri') . 'admin?redir=' . rawurlencode(\Permalink::Get()));
                return true;
            }
        });

        //protection des requetes system
        \HTTP\Route::UseMiddleware('/system', function($request, &$response){
            if(!User::IsConnect()){//utilisateur déconnecté
                $response->send(401, 'Cannot access to ' . $request->getRoute());
                return true;
            }
        });
        //page d'index
        \HTTP\Route::WhenGet('/', array('System', 'onRoute'));
        \HTTP\Route::WhenGet('admin', array('System', 'onRoute'));
        \HTTP\Route::WhenGet('system', array('System', 'printRoute'));

        //compilation du theme
        \HTTP\Route::When('themes/compile/:arg1/:arg2?/:arg3?', function($request, &$response){
            \System::CompileCSS();
            exit();
        });

        //Compatibilité ancien mode AJAX
        \HTTP\Route::When('ajax/connected', function($request, &$response){
            if(!User::IsConnect()){//utilisateur déconnecté

                $response->send(401, 'API require user authentified');

                return true;
            }

            if(@\System::GetCMD() == ''){
                $response->send(403, 'Command unitialized');
                return true;
            }

            \System::Ajax(\System::CNT, $request, $response);
        });

        \HTTP\Route::When('adminajax/', function($request, &$response){
            if(!User::IsConnect()){//utilisateur déconnecté

                $response->send(401, 'API require user authentified');

                return true;
            }

            if(@\System::GetCMD() == ''){
                $response->send(403, 'Command unitialized');
                return true;
            }

            \System::Ajax(\System::CNT, $request, $response);
        });

        \HTTP\Route::When('ajax', function($request, &$response){

            if(@\System::GetCMD() == ''){
                $response->send(403, 'Command unitialized');
                return true;
            }

            \System::Ajax(\System::SAFE, $request, $response);
        });

        //Interface ROUTE
        \HTTP\Route::WhenGet('system/info', function($request, &$response){
            $response->json(\System::Get());
        });

        \HTTP\Route::WhenPost('system/cron/start', function($request, &$response){
            \Cron::Path(\System::Path('private'));

            if(!\Cron::IsStarted()){
                \Cron::Start();
            }

            \System::Fire('system:cron.start');

            $response->send(200, "Cron started");
        });

        \HTTP\Route::WhenPost('system/cron/stop', function($request, &$response){
            \Cron::Stop();
            $response->send(200, "Cron stopped");
        });

        \HTTP\Route::WhenGet('system/cron/info', function($request, &$response){
            $response->json(\Cron::GetInfo());
        });

        \HTTP\Route::WhenGet('system/cron/tasks', function($request, &$response){
            $response->json(\Cron::GetTask());
        });

        \HTTP\Route::WhenGet('system/cron/statut', function($request, &$response){
            if(\Cron::IsStarted()){
                $response->send("started");
            }else{
                $response->send("stopped");
            }
        });

        \HTTP\Route::WhenGet('system/meta/:key', function($request, &$response){
            $response->json(200, \System::Meta($request->params->key));
        });

        \HTTP\Route::WhenPut('system/meta/:key', function($request, &$response){
            $response->json(200, \System::Meta($request->params->key, $request->body->value));
        });

        \HTTP\Route::WhenGet('system/update', function($request, &$response){
            \System::Configure();
            $response->json(200, 'Updated');
        });

    }

    public static function onRoute($request, &$response){

        \System::Fire('system:admin');

        if(!\System::IsStopEvent()){ //préparation de la page ADMIN

            if(!User::IsConnect()){
                self::Fire('system:connexion');

                if(!\System::IsStopEvent()){
                    $response->render('themes/system/index.php');
                }
                exit();
            }

            $mode = \System::Meta('MODE_DEBUG');

            \System::EnqueueScript('prototype');

            if(User::IsConnect() && $mode){

                \System::EnqueueScript('extends', '$path/window/extends.js', 'lang='.strtolower(\System::GetLang()));
                \System::EnqueueScript('window', '$path/window/window.js');

            }else{
                \System::EnqueueScript('extends', '', 'lang='.strtolower(\System::GetLang()));
                \System::EnqueueScript('window');
            }

            \System::EnqueueScript('window.filemanager');
            \System::EnqueueScript('jquery');

            $response->render('themes/system/admin.php');
        }
    }

    public static function printRoute($request, &$response){
        $routes = \HTTP\Route::GetRoutes();

        usort($routes, function($a, $b){
            if ($a->getRoute() == $b->getRoute()) {
                return 0;
            }
            return ($a->getRoute() < $b->getRoute()) ? -1 : 1;
        });

        $response->render('themes/system/route.php', array('routes' => $routes));
    }

    public static function Otherwise($request, &$response){
         //
         //
         //
         if(self::IsAjaxRequest()){
             self::Ajax(self::AjaxType(), $request, $response);
             return;
         }

         \System::Fire('system:startinterface');
/*
         self::Fire('system:admin');
         //new event
         self::Fire('system:startinterface');

         if(!self::IsStopEvent()){ //préparation de la page ADMIN

             if(!User::IsConnect()){
                 self::Fire('system:connexion');

                 if(!self::IsStopEvent()){
                     include('themes/system/index.php');
                 }
                 exit();
             }

             $mode = System::Meta('MODE_DEBUG');

             self::EnqueueScript('prototype');

             if(User::IsConnect() && $mode){

                 self::EnqueueScript('extends', '$path/window/extends.js', 'lang='.strtolower(self::GetLang()));
                 self::EnqueueScript('window', '$path/window/window.js');

             }else{
                 self::EnqueueScript('extends', '', 'lang='.strtolower(self::GetLang()));
                 self::EnqueueScript('window');
             }

             self::EnqueueScript('window.filemanager');
             self::EnqueueScript('jquery');

             include('themes/system/admin.php');
         }
 */

        exit();
    }
    /**
     * System.IsAjaxRequest() -> Boolean
     *
     * Cette méthode si il s'agit de requête AJAX.
     **/
    public static function IsAjaxRequest(){
        $link = new \Permalink();
        return $link->strEnd('/ajax') || $link->strEnd('/ajax/connected') || $link->strEnd('/adminajax') || $link->strStart('gateway.php', false) || $link->strStart('gateway.safe.php', false);
    }
    /**
     * System.AjaxType() -> String
     *
     * Cette méthode détecte le type de connexion AJAX souhaitée.
     **/
    public static function AjaxType(){
        $link = new \Permalink();
        return $link->strEnd('/ajax/connected') || $link->strStart('gateway.php', false) ? self::CNT : self::SAFE;
    }
    /**
     * System.Ajax([mode]) -> void
     *
     * Cette méthode execute les procedures en provenance d'AJAX.
     **/
    public static function Ajax($mode = System::SAFE, $request = '', &$response = ''){

        Buffer::Start("ob_gzhandler");

        self::$Error = 0;
        //Vérification de la commande


        //Exception de vérification d'instance
       /* switch(self::GetCMD()){
            case 'user.demo.connect':
                User::exec('user.demo.connect');
                break;
            case 'user.connect':
            case 'system.connect':
                User::exec('user.connect');
                break;
            case 'user.disconnect':
            case 'system.disconnect':
                User::exec('system.disconnect');
                break;
            case 'user.send.password':
            case 'user.password.send':
                User::exec('user.send.password');
                break;
            default:*/

                switch($mode){
                    case \System::SAFE:
                        \System::Error(\Sytem::Fire('gateway.safe.exec', array(\System::GetCMD())));
                        break;
                    case \System::CNT:

                        \System::Error(\System::Fire('gateway.exec', array(\System::GetCMD())));

                        User::Set();
                        break;
                }

                //traitement d'erreur éventuelle
                if("". self::Error() != "0"){
                    $str = Buffer::GetClean();
                    Buffer::Start("ob_gzhandler");
                    self::eDie(self::Error(), str_replace("\n", '<br>', $str));
                }
        //}

        if(empty($_REQUEST['callback'])){
            $response->send(200, Buffer::GetClean());
        }else{//retour JSONP

            $str = Buffer::GetClean();

            if(!is_numeric($str) && !preg_match('/^["\[{]/', $str)){
                $str = '"'.$str.'"';
            }

            Buffer::Start("ob_gzhandler");

            echo @$_REQUEST['callback'].'('.$str.')';

            $response->end();

            Buffer::EndFlush();
        }
    }
}