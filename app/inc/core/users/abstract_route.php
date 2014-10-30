<?php
/** section: Core
 * class System.User.Route
 * includes ObjectTools, iClass, iSearch
 *
 * Gestion des routes du package User
 *
 * #### Informations
 *
 * * Auteur : Lenzotti Romain
 * * Fichier : class_user.php
 * * Note :	This work is licensed under a Creative Commons Attribution 2.5 Generic License http://creativecommons.org/licenses/by/2.5/
 *
 **/
namespace System\User{

    abstract class Route extends \ObjectTools{

        protected static function Initialize(){

            \HTTP\Route::WhenPost('users/login', function($request, &$response){

                if(!isset($request->body->Login)){
                    session_destroy();
                    return $response->send(401, 'Login is required');
                }

                if(!isset($request->body->Password)){
                    session_destroy();
                    return $response->send(401, 'Password is required');
                }

                $User = new User($request->body->Login, $request->body->Password);

                if(!$User->connect()){
                    @session_destroy();

                    return $response->send(404, 'User not found');
                }

                $user = json_encode($User);
                User::Set();

                $response->json(array('statut' => 'system.connect.ok', 'user' => $user, 'redir' => URI_PATH.'admin/'));

            });

            \HTTP\Route::WhenPost('system/users/logout', function($request, &$response){

                set_time_limit(0);
                ignore_user_abort(true);
                User::Disconnect();
                session_destroy();

            });

            \HTTP\Route::WhenGet('system/users/:id', function($request, &$response){

                $u = new User((int) $request->params->id);

                if($u->User_ID == 0){
                    $response->send(404, 'User not found');
                }else{
                    $response->json($u);
                }

            });

            \HTTP\Route::WhenDelete('system/users/:id', function($request, &$response){

                $u = new User((int) $request->params->id);

                if(!\System::HasRight(2, $u)){
                    $response->send(403, 'You don\'t have right to delete this user');
                    exit();
                }

                if($u->User_ID == 0){
                    $response->send(404, 'User not found');
                }else{
                    if($u->delete()){
                        $response->send('Removed');
                    }else{
                        $response->send(500, 'Fatale error when remove user');
                    }
                }

            });

            \HTTP\Route::WhenPut('system/users/:id', function($request, &$response){

                $u = new User($request->params->id);

                if(!\System::HasRight(2, $u)){
                    $response->send(403, 'You don\'t have right to modify an user');
                    exit();
                }

                if($u->User_ID == 0){
                    $response->send(404, 'User not found');
                }else{

                    $u->extend($request->body);

                    if($u->commit()){
                        $response->json($u);
                    }else{
                        $response->send(500, 'Fatale error when modify user');
                    }
                }

            });

            \HTTP\Route::WhenGet('system/users', function($request, &$response){

                if(!empty($request->body['word'])){
                    if(is_object($request->body['options'])){
                        $request->body['options']->word = 	$request->body['word'];
                    }else{
                        $request->body['options'] =         new \stdClass();
                        $request->body['options']->word = 	$request->body['word'];
                    }
                }

                if(!$tab = User::GetList($request->body['clauses'], $request->body['options'])){
                    $response->send(505, 'Fatale error when get users');
                }else{
                    $response->json($tab);
                }
            });

            \HTTP\Route::WhenGet('system/users/meta/:id/:key', function($request, &$response){

            });

            \HTTP\Route::WhenPut('system/users/meta/:id/:key', function($request, &$response){

            });
        }
    }
}
