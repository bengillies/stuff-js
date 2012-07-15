(function(global) {
	"use strict";

	var hasOwn = Object.prototype.hasOwnProperty,
		define = Object.defineProperty,
		slice = Array.prototype.slice,
		hideFn = function(fn) { return { enumerable: false, value: fn }; };

	/*
	 * Run the given function asynchronously. This ensures that all events are
	 * asynchronous, rather than a mixture of both, which can get confusing.
	 */
	var makeAsync = ('postMessage' in window) ? function(fn) {
		var secret = Math.random(),
			origin = window.location.origin ||
				window.location.protocol + '//' + window.location.host ||
				'*';
		function _callback(ev) {
			if (ev.data === secret) {
				window.removeEventListener('message', _callback);
				fn();
			}
		}
		window.addEventListener('message', _callback);
		window.postMessage(secret, origin);
	} : function(fn) {
		window.setTimeout(fn, 0);
	};

	function Emitter(eventsObject) {
		var self = (this === global || typeof this === 'undefined') ? {} : this,
			events = {};

		/*
		 * create a function that can be used to bind to DOM elements and
		 * delegate to sub DOM elements. Set thisArg to self;
		 */
		function createEventListener(evObj, callback) {
			return function(e) {
				var el = e.target,
					nodes = evObj.subDOM ? slice.call(evObj.el
						.querySelectorAll(evObj.subDOM)) : [el];

				for(;el && !~nodes.indexOf(el); el = el.parentNode || null);
				if (el) callback.call(self, e);
			};
		}

		/*
		 * take an event string and split it into it's component parts
		 */
		function parseEventString(str) {
			var split = /([^\.]+)\.?(([^\s]+)?\s?(.+)?)?/.exec(str),
				el = split[2] ? self[split[1]] : undefined;

			return {
				el: el, // the sub-emitter if it exists
				ev: el ? split[2] : split[1], // the whole event name
				isDOM: el && el instanceof HTMLElement? true : false,
				subDOM: split[4], // e.g. #foo.bar in 'el.click #foo.bar'
				DOMEv: split[3] // e.g. click in 'el.click #foo.bar'
			};
		}

		/*
		 * Call all functions bound to the given event with the given arguments
		 * delegate to a sub emitter if necessary
		 */
		define(self, 'trigger', hideFn(function(ev/*, ...args*/) {
			var args = slice.call(arguments, 1),
				evObj = parseEventString(ev);
			if (evObj.el && !evObj.isDOM) {
				args.unshift(evObj.ev);
				evObj.el.trigger.apply(evObj.el, args);
			} else if (evObj.el && evObj.isDOM) {
				ev = document.createEvent('Event');
				ev.initEvent(evObj.DOMEv, true, true);
				evObj.el.dispatchEvent(ev);
			} else if (hasOwn.call(events, ev)) {
				events[ev].forEach(function(fn) {
					makeAsync(function() { fn.apply(self, args); });
				});
			}
		}));

		/*
		 * bind a function to the event
		 * delegate to a sub-emitter if called
		 */
		define(self, 'on', hideFn(function(ev, callback) {
			var evObj = parseEventString(ev), fn;
			if (evObj.el && evObj.isDOM) {
				fn = createEventListener(evObj, callback);
				evObj.el.addEventListener(evObj.DOMEv, fn);
				return fn;
			} else if (evObj.el) {
				evObj.el.on(ev, callback);
			} else if (hasOwn.call(events, ev)) {
				events[ev].push(callback);
			} else {
				events[ev] = [callback];
			}
			return callback;
		}));

		/*
		 * unbind + unbind from a sub-emitter if called for
		 */
		define(self, 'off', hideFn(function(ev, fn) {
			var evObj = parseEventString(ev);
			if (evObj.el && evObj.isDOM) {
				evObj.el.removeEventListener(evObj.DOMEv, fn);
			} else if (evObj.el) {
				evObj.el.off(ev, fn);
			} else if (!fn) {
				delete events[evObj.ev];
			} else if (hasOwn.call(events, evObj.ev)) {
				events[evObj.ev] = events[evObj.ev]
					.filter(function(handler) {
						return fn === handler ? false : true;
					});
			}
		}));

		/*
		 * parse and bind everything in the given object at once
		 */
		function loadEventsObject(ev) {
			for (var key in ev) if (hasOwn.call(ev, key)) {
				self.on(key, (typeof ev[key] === 'function') ?
					ev[key] : self[ev[key]]);
			}
		}

		loadEventsObject(eventsObject);

		return self;
	}

	global.Emitter = Emitter;
}(window));
