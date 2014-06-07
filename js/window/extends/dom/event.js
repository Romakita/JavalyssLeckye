/** section: DOM
 * class Event
 *
 *  <p class="note">Documentation extrait de http://api.prototypejs.org</p>
 * 	<br>
 *  The namespace for Prototype's event system.
 *
 *  ##### Events: a fine mess
 *
 *  Event management is one of the really sore spots of cross-browser
 *  scripting.
 *
 *  True, the prevalent issue is: everybody does it the W3C way, and MSIE
 *  does it another way altogether. But there are quite a few subtler,
 *  sneakier issues here and there waiting to bite your ankle &mdash; such as the
 *  `keypress`/`keydown` issue with KHTML-based browsers (Konqueror and
 *  Safari). Also, MSIE has a tendency to leak memory when it comes to
 *  discarding event handlers.
 *
 *  ##### Prototype to the rescue
 *
 *  Of course, Prototype smooths it over so well you'll forget these
 *  troubles even exist. Enter the `Event` namespace. It is replete with
 *  methods that help to normalize the information reported by events across
 *  browsers.
 *
 *  `Event` also provides a standardized list of key codes you can use with
 *  keyboard-related events, including `KEY_BACKSPACE`, `KEY_TAB`,
 *  `KEY_RETURN`, `KEY_ESC`, `KEY_LEFT`, `KEY_UP`, `KEY_RIGHT`, `KEY_DOWN`,
 *  `KEY_DELETE`, `KEY_HOME`, `KEY_END`, `KEY_PAGEUP`, `KEY_PAGEDOWN` and
 *  `KEY_INSERT`.
 *
 *  The functions you're most likely to use a lot are `Event.observe`,
 *  `Event.element` and `Event.stop` . If your web app uses custom events,
 *  you'll also get a lot of mileage out of `Event.fire`.
 *  
 *  ##### Instance methods on event objects
 *  As of Prototype 1.6, all methods on the `Event` object are now also 
 *  available as instance methods on the event object itself:
 *  
 *  **Before**
 *  
 *      $('foo').observe('click', respondToClick);
 *      
 *      function respondToClick(event) {
 *        var element = Event.element(event);
 *        element.addClassName('active');
 *      }
 *  
 *  **After**
 *  
 *      $('foo').observe('click', respondToClick);
 *      
 *      function respondToClick(event) {
 *        var element = event.element();
 *        element.addClassName('active');
 *      }
 *  
 *  These methods are added to the event object through `Event.extend`,
 *  in the same way that `Element` methods are added to DOM nodes through 
 *  `Element.extend`. Events are extended automatically when handlers are 
 *  registered with Prototype's `Event.observe` method; if you're using a 
 *  different method of event registration, for whatever reason,you'll need to
 *  extend these events manually with `Event.extend`.
 **/
 
 /**
 *  Event.observe(@element, eventName, handler) -> Element
 *  - element (Element | String): The DOM element to observe, or its ID.
 *  - eventName (String): The name of the event, in all lower case, without
 *    the "on" prefix&nbsp;&mdash; e.g., "click" (not "onclick").
 *  - handler (Function): The function to call when the event occurs.
 *	
 *  Registers an event handler on a DOM element. Aliased as `Element#observe`.
 *  <br>
 *  <br>
 *  <p class="note">Documentation extrait de http://api.prototypejs.org</p>
 *  <br>
 *  <br>
 *  `Event.observe` smooths out a variety of differences between browsers
 *  and provides some handy additional features as well. Key features in brief:
 *  * Several handlers can be registered for the same event on the same element.
 *  * Prototype figures out whether to use `addEventListener` (W3C standard) or
 *    `attachEvent` (MSIE); you don't have to worry about it.
 *  * The handler is passed an _extended_ `Event` object (even on MSIE).
 *  * The handler's context (`this` value) is set to the extended element
 *    being observed (even if the event actually occurred on a descendent
 *    element and bubbled up).
 *  * Prototype handles cleaning up the handler when leaving the page
 *    (important for MSIE memory leak prevention).
 *  * `Event.observe` makes it possible to stop observing the event easily
 *    via `Event.stopObserving`.
 *  * Adds support for `mouseenter` / `mouseleave` events in all browsers.
 *
 *  Although you can use `Event.observe` directly and there are times when
 *  that's the most convenient or direct way, it's more common to use its
 *  alias `Element#observe`. These two statements have the same effect:
 *
 *      Event.observe('foo', 'click', myHandler);
 *      $('foo').observe('click', myHandler);
 *
 *  The examples in this documentation use the `Element#observe` form.
 *
 *  ##### The Handler
 *
 *  Signature:
 *
 *      function handler(event) {
 *        // `this` = the element being observed
 *      }
 *
 *  So for example, this will turn the background of the element 'foo' blue
 *  when it's clicked:
 *
 *      $('foo').observe('click', function(event) {
 *        this.setStyle({backgroundColor: 'blue'});
 *      });
 *
 *  Note that we used `this` to refer to the element, and that we received the
 *  `event` object as a parameter (even on MSIE).
 *
 *  ##### It's All About Timing
 *
 *  One of the most common errors trying to observe events is trying to do it
 *  before the element exists in the DOM. Don't try to observe elements until
 *  after the `document.observe dom:loaded` event or `window` `load` event
 *  has been fired.
 *
 *  ##### Preventing the Default Event Action and Bubbling
 *
 *  If we want to stop the event (e.g., prevent its default action and stop it
 *  bubbling), we can do so with the extended event object's `Event#stop`
 *  method:
 *
 *      $('foo').observe('click', function(event) {
 *        event.stop();
 *      });
 *
 *  ##### Finding the Element Where the Event Occurred
 *
 *  Since most events bubble from descendant elements up through the hierarchy
 *  until they're handled, we can observe an event on a container rather than
 *  individual elements within the container. This is sometimes called "event
 *  delegation". It's particularly handy for tables:
 *
 *      language: html
 *      <table id='records'>
 *        <thead>
 *          <tr><th colspan='2'>No record clicked</th></tr>
 *        </thead>
 *        <tbody>
 *          <tr data-recnum='1'><td>1</td><td>First record</td></tr>
 *          <tr data-recnum='2'><td>2</td><td>Second record</td></tr>
 *          <tr data-recnum='3'><td>3</td><td>Third record</td></tr>
 *        </tbody>
 *      </table>
 *
 *  Instead of observing each cell or row, we can simply observe the table:
 *
 *      $('records').observe('click', function(event) {
 *        var clickedRow = event.findElement('tr');
 *        if (clickedRow) {
 *          this.down('th').update("You clicked record #" + clickedRow.readAttribute("data-recnum"));
 *        }
 *      });
 *
 *  When any row in the table is clicked, we update the table's first header
 *  cell saying which record was clicked. `Event#findElement` finds the row
 *  that was clicked, and `this` refers to the table we were observing.
 *
 *  ##### Stopping Observing the Event
 *
 *  If we don't need to observe the event anymore, we can stop observing it
 *  with `Event.stopObserving` or its `Element#stopObserving` alias.
 *
 *  ##### Using an Instance Method as a Handler
 *
 *  If we want to use an instance method as a handler, we will probably want
 *  to use `Function#bind` to set the handler's context; otherwise, the
 *  context will be lost and `this` won't mean what we expect it to mean
 *  within the handler function. E.g.:
 *
 *      var MyClass = Class.create({
 *        initialize: function(name, element) {
 *          this.name = name;
 *          element = $(element);
 *          if (element) {
 *            element.observe(this.handleClick.bind(this));
 *          }
 *        },
 *        handleClick: function(event) {
 *          alert("My name is " + this.name);
 *        },
 *      });
 *
 *  Without the `Function#bind`, when `handleClick` was triggered by the
 *  event, `this` wouldn't refer to the instance and so the alert wouldn't
 *  show the name. Because we used `Function#bind`, it works correctly. See
 *  `Function#bind` for details. There's also `Function#bindAsEventListener`,
 *  which is handy for certain very specific situations. (Normally,
 *  `Function#bind` is all you need.)
 *
 *  ##### Side Notes
 *
 *  Although Prototype smooths out most of the differences between browsers,
 *  the fundamental behavior of a browser implementation isn't changed. For
 *  example, the timing of the `change` or `blur` events varies a bit from
 *  browser to browser.
 *
 *  ##### Changes in 1.6.x
 *
 *  Prior to Prototype 1.6, `Event.observe` supported a fourth argument
 *  (`useCapture`), a boolean that indicated whether to use the browser's
 *  capturing phase or its bubbling phase. Since MSIE does not support the
 *  capturing phase, we removed this argument from 1.6, lest it give users the
 *  false impression that they can use the capturing phase in all browsers.
 *
 *  1.6 also introduced setting the `this` context to the element being
 *  observed, automatically extending the `Event` object, and the
 *  `Event#findElement` method.
 **/
Object.extend(Event, {
/**
 * Event#KEY_F5 -> Number
 * Code clavier de la touche F5.
 **/
	KEY_F5:	116,
/**
 * Event#KEY_F6 -> Number 
 * Code clavier de la touche F6.
 **/
	KEY_F6:	117,
/**
 * Event#KEY_F7 -> Number 
 * Code clavier de la touche F7.
 **/
	KEY_F7:	118,
/**
 * Event#KEY_F8 -> Number 
 * Code clavier de la touche F8.
 **/
	KEY_F8:	119,
/**
 * Event#KEY_F9 -> Number 
 * Code clavier de la touche F9.
 **/
	KEY_F9:	120,
/**
 * Event#KEY_F10 -> Number 
 * Code clavier de la touche F10.
 **/
	KEY_F10:121,
/**
 * Event#KEY_F11 -> Number 
 * Code clavier de la touche F11.
 **/
	KEY_F11:122,
/**
 * Event#KEY_F12 -> Number 
 * Code clavier de la touche F12.
 **/
	KEY_F12:123,
/**
 * Event#wheel(event) -> Number
 * - event (Event): Evenement généré par le navigateur.
 *
 * Ajoute le support de l'evenement MouseWheel à l'objet Event
 *
 **/
	wheel:function (event){
		var delta = 0;
		if (!event) event = window.event;
		if (event.wheelDelta) {
			delta = event.wheelDelta/120; 
			if (window.opera) delta = -delta;
		} else if (event.detail) { delta = -event.detail/3;	}
		
		return delta; //Safari Round
	},
/**
 * Event#getKeyCode(event) -> Number
 * - event (Event) -> Evenement généré par le navigator.
 *
 * Extrait et retourne le code du clavier de l'événement.
 **/
	getKeyCode: function(event){
		return (!document.all) ? event.which : event.keyCode;	
	},
/**
 * Event#getChar(event) -> Number
 * - event (Event) -> Evenement généré par le navigator.
 *
 * Cette méthode retourne le caractère saisie au clavier.
 **/
	getChar: function(event){
		var char = this.getKeyCode(event);
		
		if(event.type == 'keypress'){
			return String.fromCharCode(event.which);
		}else{
			if(char < 48) return false;
			if(char <= 57){
				return (char - 48) + '';	
			}
			
			if(65 <= char && char <= 90){
				return String.fromCharCode(char);		
			}
			
			if(96 <= char && char <= 105){
				return (char - 96) + '';
			}
		}
		
		return false;
	}
});