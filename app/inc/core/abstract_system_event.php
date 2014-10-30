<?php
/** section: Core
 * System.Event
 * includes System.IO
 * Cette classe gère les événements du system.
 **/

namespace System;

require_once('abstract_system_io.php');

abstract class Event extends IO{
    private static $listeners = array();
    private static $stopped =   false;
    /**
     * System.Event.Observe(eventName, callback) -> void
     * - eventName (String): Nom de l'événement à écouter.
     * - callback (Array | String): Nom de la fonction ou tableau de noms => array(className, methodName).
     *
     * Cette méthode observe un nom d'événement `eventName`. La fonctions associée à `eventName` sera executé par la méthode [[System.Fire]].
     **/
    public static function Observe($eventName, $callback){
        
        if(!@self::$listeners[$eventName]){
            self::$listeners[$eventName] = array();
        }

        array_push(self::$listeners[$eventName], $callback);
    }
    /**
     * System.Event.Fire(eventName, args) -> Mixed
     * - eventName (String): Nom de l'événement à déclencher.
     * - args (Array): Tableau d'argument à passer aux méthodes enregistrées sur l'événement.
     *
     * Cette méthode déclenche un nom d'événement `eventName`. Toutes les fonctions associées à `eventName` seront executés.
     **/
    public static function Fire($eventName, $args = array()){
        self::$stopped = false;

        $error = false;
        $event = @self::$listeners[$eventName];

        if(!is_array($args)){
            $args = array($args);
        }

        if(!empty($event)){
            foreach($event as $value){

                if(is_callable($value)){
                    if(!$error = call_user_func_array($value, $args)){
                        continue;
                    }else return $error;
                }
            }
        }
        return 0;
    }
    /**
     * System.Event.StopEvent() -> void
     *
     * Cette méthode stop l'événement déclenché par la méthode [[System.Fire]].
     **/
    public static function StopEvent(){
        self::$stopped = true;
        return self::$stopped;
    }

    public static function IsStopEvent(){
        return self::$stopped;
    }
    /**
     * System.Event.StopObserving(eventName) -> Mixed
     * - eventName (String): Nom de l'événement à écouter.
     *
     * Cette méthode stop l'événement `eventName`.
     **/
    public static function StopObserving($eventName){
        self::$listeners[$eventName] = array();
    }

    public static function ClearEvents(){
        self::$listeners = array();
    }
} 