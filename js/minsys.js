/**
 * == MinCore ==
 * Cette section traite uniquement du noyau minimal du logiciel. Ce noyau est optimisé pour la gestion de connexion au logiciel
 * et de son installation. Ce noyau intègre donc les méthodes de base afin de gérer toutes ses transactions.
 **/

/** section: MinCore
 * MinSys
 * Cette classe singleton est le gestionnaire d'installation et de connexion au logiciel.
 **/
var System;
var MinSys = System ={
    /**
     * MinSys.link -> String
     * Lien de la passerelle pour la connexion au logiciel.
     **/
    link:				(window.location.href.split('?')[0] + '/ajax/connected').replace('index_admin.php', ''),
    /**
     * MinSys.AlertBox -> AlertBox
     **/
    AlertBox:				null,
    /**
     * MinSys.Flag -> Flag
     **/
    Flag:				null,
    childWin:			null,
    /**
     * @type String
     */
    current:			'',
    /**
     * MinSys.initialize() -> void
     *
     **/
    initialize: function(){
    },
    /**
     * MinSys.openLost() -> void
     *
     * Cette méthode ouvre le formulaire de récupération de mot de passe depuis l'adresse e-mail.
     **/
    openLost: function(){
        //
        // Splite
        //
        var splite = new SpliteIcon($MUI('Réinitialisation de votre mot de passe'), $MUI('Merci de saisir votre adresse de messagerie. Un e-mail contenant votre nouveau mot de passe vous sera envoyé à cette adresse') + '.');
        splite.setStyle('width:500px');
        splite.setIcon('password-48');
        //
        // Email
        //
        var email = new Input({type:'text', placeholder:'Saisissez votre adresse e-mail', className:"input forgot-email"});
        email.Large(true);

        var box = this.AlertBox;
        var flag = box.box.createFlag();

        box.box.createHandler('Envoi du message en cours', true);
        box.setTheme('flat liquid white');
        box.a(splite).a(email).setType().show();

        box.submit({
            text: $MUI('Générer un mot de passe'),
            click:function(){

                if(!email.value.isMail()){
                    flag.setText($MUI('Veuillez saisir une adresse e-mail correcte')).setType(FLAG.RIGHT).show(email, true);
                    return true;
                }

                box.box.ActiveProgress();

                $S.exec('user.password.send', {
                    parameters:	'EMail=' + email.value,
                    onComplete: function(result){


                        switch(result.responseText){
                            case 'user.email.send.ok':
                                box.hide();

                                var splite2 = new SpliteIcon($MUI('Votre mot de passe vient d\'être envoyé sur votre adresse e-mail'));
                                splite2.setIcon('valid-48');

                                box.ti($MUI('Erreur')+'...').a(splite2).ty('CLOSE').Timer(5).show();
                                break;
                            case 'user.email.err':
                                flag.setText('<p class="icon-documentinfo">' + $MUI('L\'adresse e-mail saisie n\'existe pas') + '</p>');
                                flag.color('grey').setType(FLAG.RIGHT).show(email, true);
                                break;
                            default:
                                box.hide();

                                var splite2 = new SpliteWait($MUI('Une erreur est survenue lors de la tentative d\'envoi de votre mot de passe') + '.');
                                var node = new Node('div', result.responseText);
                                box.ti($MUI('Erreur')+'...').a(splite2).a(node).ty('CLOSE').show();
                                break;
                        }


                    }.bind(this)
                });

                return true;
            }.bind(this)
        });

    },
    /**
     * MinSys.connect() -> void
     *
     * Cette méthode prépare la connexion au logiciel. Si l'utilisateur est bien identifié par le logiciel
     * ce dernier sera redirigé vers l'administration du logiciel. L'ensemble de ses informations et préférence
     * seront chargées.
     **/
    connect: function(form){

        this.Flag.hide();

        if(form.Login.value == '' || (form.Login.value.length < 3)){
            this.Flag.setText('<p class="icon-documentinfo">' + $MUI('Votre <b>identifiant</b> saisie doit comporter au moins <b>3 caractères</b>.') + '</p>').setType(FLAG.RIGHT).color('grey');
            this.Flag.show(form.Login);
            return false;
        }

        if(form.Password.value == '' || (form.Password.value.length < 6 && form.Password.value.length > 15)){
            this.Flag.setText('<p class="icon-documentinfo">' + $MUI('Votre <b>mot de passe</b> doit comporter au moins <b>6 caractères</b>.') + '</p>').setType(FLAG.RIGHT).color('grey');
            this.Flag.show(form.Password);
            return false;
        }

        this.AlertBox.wait();

        $S.exec('system.connect', {
            parameters:	'Login='+ form.Login.value + '&Password=' + form.Password.value,
            onComplete: function(result){

                this.AlertBox.hide();

                try{
                    var obj = result.responseText.evalJSON();

                    if(obj.error == 'user.connect.err'){
                        this.Flag.setText($MUI('L\'identifiant et/ou le mot de passe saisis sont incorrects'));
                        this.Flag.show(form.Login);
                        return;
                    }

                    if(obj.error == 'user.connect.login'){
                        this.Flag.setText($MUI('L\'identifiant et/ou le mot de passe saisis sont incorrects'));
                        this.Flag.show(form.Login);
                        return;
                    }

                    if(obj.error == 'user.connect.password'){
                        this.Flag.setText($MUI('Le mot de passe saisi est incorrect'));
                        this.Flag.show(form.Password);
                        return;
                    }

                    if(obj.statut == 'system.connect.ok'){
                        var $user = obj.user.evalJSON();

                        function setcookie(name,value,days) {
                            if (days) {
                                var date = new Date();
                                date.setTime(date.getTime()+(days*24*60*60*1000));
                                var expires = "; expires="+date.toGMTString();
                            }
                            else var expires = "";
                            document.cookie = name+"="+value+expires+"; path=/";
                        }

                        setcookie("lastuserconnected", $user.Login + "^" + $user.Avatar);

                        try{
                            window.location.reload();
                        }catch(er){
                            this.Flag.setText('<p class="icon-documentinfo">' + $MUI('Vous devez accepter les pop-up pour l\'utilisation du logiciel') + '.</p>').setType(FLAG.LB).color('grey');
                            this.Flag.show($WR.TaskBar());
                            this.Flag.decalTo(-40, -$WR.TaskBar().getHeight());
                            this.Flag.setStyle('z-index:10000');
                        }

                        return;
                    }

                }catch(er){
                    if(result.responseText.match(/sql\.connect\.err/) || result.responseText.match(/sql\.select\.db\.err/)){
                        var splite = SpliteWait($MUI('Une erreur est survenue lors de la connexion à la base de données.<br />Si le problème persiste, veuillez contacter l\'administrateur du logiciel. (code:' + result.responseText+')'));

                        this.Alert.setTitle($MUI('La connexion a échoué')).a(splite).setType('CLOSE').show();
                        return;
                    }
                }

                var splite = 	new SpliteWait($MUI('Une erreur est survenue lors de la tentative de connexion au logiciel') + '.');
                var node = 		new Node('div', result.responseText);
                this.AlertBox.ti($MUI('Erreur')+'...').a(splite).a(node).ty('CLOSE').show();
                return;

            }.bind(this)
        });

        return false;
    },
    /**
     * MinSys.disconnect() -> void
     *
     * Cette méthode informe le logiciel que l'utilisateur c'est déconnecté du logiciel et affiche un message de confirmation à l'utlisateur.
     **/
    disconnect: function(){
        try{

            $S.exec('system.disconnect', function(result){
                this.AlertBox.hide();

                var splite = new SpliteInfo($MUI('Vous avez été deconnecté du logiciel') + '.');
                this.AlertBox.ti($MUI('Message d\'information')).a(splite).ty('CLOSE').show();
            }.bind(this));

        }catch(er){}
    },
    /**
     * MinSys.timeExceded() -> void
     *
     * Cette méthode informe l'utilisateur que son délais de connexion est dépassé.
     **/
    timeExceded: function(){
        try{
            var splite = new SpliteInfo($MUI('Votre session est arrivé à expiration. Veuillez-vous reconnecter.') + '.');

            this.AlertBox.ti($MUI('Message d\'information')).a(splite).ty('CLOSE').show();

            $S.exec('system.disconnect');

        }catch(er){}
    },
    /**
     * MinSys.exec(cmd , obj) -> void
     * - cmd (String): Nom de la commande.
     * - obj (Object): Soit il s'agit d'une fonction qui sera appellé après traitement de la commande
     * par le serveur. Soit Object tel que {parameters => String, onComplete => Function}.
     *
     * Envoi une commande vers la passerelle PHP. Cette dernière analysera, traitera la commande et renvoiera un résultat.
     **/
    exec: function(cmd, obj){

        if(Object.isUndefined(cmd)) throw('Error System::exec : arg[0] is undefined');

        if(Object.isUndefined(obj)){
            obj = {
                parameters: ''
            };
        }

        if(Object.isFunction(obj)){
            var callback = obj;

            obj = {
                parameters: '',
                onComplete:function(result){

                    try{
                        var str = result.responseText.evalJSON();
                    }catch(er){}

                    callback.call(this, result);

                }.bind(this)
            };
        }else{
            if(Object.isFunction(obj.onComplete)){
                var callback = obj.onComplete;

                obj.onComplete = function(result){

                    try{
                        var str = result.responseText.evalJSON();
                    }catch(er){}

                    callback.call(this, result);
                }.bind(this);
            }else{
                obj.onComplete = function(result){

                    try{
                        var str = result.responseText.evalJSON();
                    }catch(er){}

                }.bind(this);
            }
        }

        obj.method = 		'post';

        obj.parameters += 	obj.parameters !='' ? '&cmd=' + cmd : 'cmd=' + cmd;

        try{
            new Ajax.Request(this.link, obj);
        }catch(er){}

    },
    /**
     * MinSys.startInterface() -> void
     *
     * Cette méthode initialise l'interface minimal.
     **/
    startInterface:function(){
        try{
            //Creation des objects---------------------------------------------
            this.AlertBox = this.Alert = new AlertBox();
            this.Flag = 		new Flag(Flag.RIGHT);

            $WR.ALERT_USE_STRING = true;

            $Body.appendChild(this.Alert);
            $Body.appendChild(this.Flag);

            $Body.css('height', document.stage.stageHeight);
            //$WR.Constraint({left:0, bottom: document.stage.stageHeight, right:document.stage.stageWidth, top:0});

            Extends.fire('minsys:startinterface');

            //
            // Login
            //
            options = document.getElementsByClassName('box-login');

            for(var i = 0; i < options.length; i++){
                options[i].on('focus', function(){
                    MinSys.Flag.setType(FLAG.RIGHT).color('grey').setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici l\'identifiant ou l\'adresse e-mail de votre compte utilisateur') + '.</p>').show(this);
                    return false;
                });

                options[i].on('blur', function(){MinSys.Flag.hide()});
            }
            //
            // Password
            //
            options = document.getElementsByClassName('box-password');

            for(var i = 0; i < options.length; i++){
                options[i].on('focus', function(){
                    MinSys.Flag.setType(FLAG.RIGHT).color('grey').setText('<p class="icon-documentinfo">' + $MUI('Saisissez ici le mot de passe de votre compte utilisateur') +'.</p>').show(this);
                    return false;
                });

                options[i].on('blur', function(){MinSys.Flag.hide()});
            }



        }catch(er){if(window['console']){console.log(er)}};

    }
};
$S = MinSys; 