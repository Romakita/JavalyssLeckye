$.Http = $.http = function(url, options){

    if(!Object.isUndefined(options.data)){
        options.parameters = options.data;
    }

    var ajax = null;
    var promise = new $.Promise(function(fulfill, reject){

        options.onSuccess = function(response){

            switch(response.getHeader('Content-Type')){
                default:
                    var data = response.responseText;
                    break;

                case 'application/json':
                case 'text/json':
                    var data = response.responseText.evalJSON();
                    break;
            }

            fulfill(data);
        };

        options.onFailure = function(response){
            reject(response);
        };

        if(url.slice(0,1) == '/'){
            url = $.Extends.getGlobals('origin') + url.slice(1, url.length);
        }

        /*if(!url.indexOf('http://') || !url.indexOf('https://')){
            if($.Extends.getGlobals('link')){
                url = $.Extends.getGlobals('link') + url;
            }
        }*/

        ajax = new Ajax.Request(url, options);

    });

    promise.ajax =      ajax;
    promise.success =   promise.then;
    promise.error =     promise.catch;console.log(promise.catch)

    if(Object.isFunction(options.onComplete)){
        promise.success(options.onComplete);
    }

    if(Object.isFunction(options.success)){
        promise.success(options.success);
    }

    if(Object.isFunction(options.error)){
        promise.error(options.error);
    }

    return promise;
};

Object.extend($.http, {
    /**
     *
     *
     */
    get:function(url, params, success, error){
        return $.http(url, {
            method:     'get',
            success:    success,
            error:      error,
            parameters: params
        });
    },

    post: function(url, params, success, error){

        return $.http(url, {
            method:     'post',
            success:    success,
            error:      error,
            parameters: params
        });
    },

    put:function(url, params, success, error){

        return $.http(url, {
            method:     'put',
            success:    success,
            error:      error,
            parameters: params
        });
    },

    delete:function(url, params, success, error){
        return $.http(url, {
            method:     'delete',
            success:    success,
            error:      error,
            parameters: params
        });
    },

    remove:function(url, params, success, error){
        return  this.delete(url, params, success, error);
    },

    error:function(callback){
        Ajax.Responders.register({onFailure:callback});
        return this;
    },

    success:function(callback){
        Ajax.Responders.register({onSuccess:callback});
        return this;
    }
});
//override Request
Object.extend(Ajax.Request.prototype, {

    
    request: function(url) {
        this.url = url;

        this.method = this.options.method;
        var params = Object.isString(this.options.parameters) ?
            this.options.parameters :
            Object.toQueryString(this.options.parameters);

        if (!['get', 'post', 'put', 'delete'].include(this.method)) {
            params += (params ? '&' : '') + "_method=" + this.method;
            this.method = 'post';
        }

        if (params && this.method === 'get') {
            this.url += (this.url.include('?') ? '&' : '?') + params;
        }

        this.parameters = params.toQueryParams();

        try {
            var response = new Ajax.Response(this);
            if (this.options.onCreate) this.options.onCreate(response);
            Ajax.Responders.dispatch('onCreate', this, response);

            this.transport.open(this.method.toUpperCase(), this.url,
                this.options.asynchronous);

            if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();

            this.body = this.method != 'get' ? (this.options.postBody || params) : null;
            this.transport.send(this.body);

            /* Force Firefox to handle ready state 4 for synchronous requests */
            if (!this.options.asynchronous && this.transport.overrideMimeType)
                this.onStateChange();

        }
        catch (e) {
            this.dispatchException(e);
        }
    }
});