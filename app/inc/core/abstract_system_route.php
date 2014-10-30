<?php
/** section: Core
 * class SystemRoute
 * includes SystemIncluder
 *
 **/
namespace System;

require_once('abstract_system_term.php');

abstract class Route extends Term{

    public static function Initialize(){

        \HTTP\Route::UseMiddleware('/admin', function($request, &$response){
            if(!User::IsConnect()){//utilisateur déconnecté
                $response->location(self::Path('uri') . 'admin?redir=' . rawurlencode(\Permalink::Get()));
                return true;
            }
        });

        \HTTP\Route::When('themes/compile/:arg1/:arg2?/:arg3?', function($request, &$response){
            self::CompileCSS();
            exit();
        });

        \HTTP\Route::When('ajax/connected', function($request, &$response){
            if(!User::IsConnect()){//utilisateur déconnecté

                $response->send(401, 'API require user authentified');

                return true;
            }

            if(@self::GetCMD() == ''){
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

            if(@self::GetCMD() == ''){
                $response->send(403, 'Command unitialized');
                return true;
            }

            \System::Ajax(\System::CNT, $request, $response);
        });

        \HTTP\Route::When('ajax', function($request, &$response){

            if(@self::GetCMD() == ''){
                $response->send(403, 'Command unitialized');
                return true;
            }

            \System::Ajax(\System::SAFE, $request, $response);
        });

        //\HTTP\Route::When('admin/account', array('System', 'onRouteAccount'));

        //Interface ROUTE
        \HTTP\Route::WhenGet('admin/system/info', function($request, &$response){
            \System::iDie();
            $response->json(System::Get());
        });

        \HTTP\Route::WhenPost('admin/system/cron/start', function($request, &$response){
            \Cron::Path(System::Path('private'));

            if(!\Cron::IsStarted()){
                \Cron::Start();

            }

            \System::Fire('system:cron.start');

            $response->send(200, "Cron started");
        });

        \HTTP\Route::WhenPost('admin/system/cron/stop', function($request, &$response){
            \Cron::Stop();

            $response->send(200, "Cron stopped");
        });

        \HTTP\Route::WhenGet('admin/system/cron/info', function($request, &$response){
            $response->json(\Cron::GetInfo());
        });

        \HTTP\Route::WhenGet('admin/system/cron/tasks', function($request, &$response){
            $response->json(\Cron::GetTask());
        });

        \HTTP\Route::WhenGet('admin/system/cron/statut', function($request, &$response){
            if(\Cron::IsStarted()){
                $response->send("started");
            }else{
                $response->send("stopped");
            }
        });

        \HTTP\Route::WhenPut('admin/system/meta/:key', function($request, &$response){
            $response->json(200, \System::Meta($request->params->key, $request->body['value']));
        });

        \HTTP\Route::WhenGet('admin/system/meta', function($request, &$response){
            $response->json(200, \System::Meta($request->params->key));
        });

        \HTTP\Route::WhenGet('admin/system/update', function($request, &$response){
            \System::Configure();
            $response->json(200, 'Updated');
        });
    }
}