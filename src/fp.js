/*
 * Provide some useful FP style functions
 */

(function(exports) {
	"use strict";

	if (typeof Function.prototype.bind === 'undefined') {
		Function.prototype.bind = function(thisArg) {
			var self = this;
			return function() {
				return self.apply(thisArg, arguments);
			};
		};
	}

	function assertFunction(fn) {
		if (typeof fn !== 'function') {
			throw new
				TypeError('function expected but ' + typeof fn + ' found.');
		}
		return true;
	}

	function partial(fn/*, ...args*/) {
		var cachedArgs = [].slice.call(arguments, 1);
		assertFunction(fn);
		return function() {
			var args = cachedArgs.concat([].slice.call(arguments));
			fn.apply(this, args);
		};
	}

	function compose() {
		var fns = [].filter.call(arguments, assertFunction);
		if (!fns.length) { throw new TypeError('function expected'); }
		return function() {
			var args = arguments,
				i = fns.length;
			while (--i >= 0) {
				args = [fns[i].apply(this, args)];
			}
			return args[0];
		};
	}

	var nextTick = (window && window.location && window.location.origin &&
			!/^file:\/\//.test(window.location.origin) && window.postMessage) ?
		function(fn) {
			var secret = Math.random();
			assertFunction(fn);
			function callback(ev) {
				if (ev.data === secret) {
					window.removeEventListener('message', callback);
					fn();
				}
			}
			window.addEventListener('message', callback);
			window.postMessage(secret, window.location.origin);
			return fn;
		} :
		function(fn) {
			assertFunction(fn);
			setTimeout(fn, 0);
			return fn;
		}

	function debounce(fn, timeout) {
		var timer;
		return function() {
			var self = this,
				args = arguments;
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			timer = setTimeout(function() {
				fn.apply(self, args);
				timer = null;
			}, timeout);
		};
	}

	function throttle(fn, timeout) {
		var timer;
		return function() {
			var self = this,
				args = arguments;
			if (!timer) {
				timer = setTimeout(function() {
					fn.apply(self, args);
					timer = null;
				}, timeout);
			}
		};
	}

	function after(fn, count) {
		var runs = 0;
		return function() {
			if (++runs === count) {
				return fn.apply(this, arguments);
			}
		};
	}

	function zipAfter(fn, count) {
		var runs = 0,
			args = [];
		return function() {
			if (++runs === count) {
				return fn.apply(this, zip.apply(this, args));
			} else {
				args.push(arguments);
			}
		}
	}

	function wrap(fn, wrapper) {
		return partial(wrapper, fn);
	}

	function rPartial(fn/*, ...args*/) {
		var cachedArgs = [].slice.call(arguments, 1);
		assertFunction(fn);
		return function() {
			var args = [].slice.call(arguments).concat(cachedArgs);
			fn.apply(this, args);
		};
	}

	function memoize(fn, hashFn) {
		var map = Object.create(null);
		hashFn = hashFn || function(id) { return id; };
		return function() {
			var id = hashFn(arguments[0]);
			return (id in map === false) ?
				(map[id] = fn.apply(this, arguments)) : map[id];
		};
	}

	function uncurryThis(fn) {
		return fn.call.bind(fn);
	}

	function sequence(/*...fns*/) {
		var fns = [].slice.call(arguments);
		return function() {
			var args = arguments,
				self = this;
			fns.forEach(function(fn) {
				fn.apply(self, args);
			});
		}
	}

	function promise(completeFn) {
		var res = null,
			self = undefined,
			fns = [];
		completeFn(function() {
			self = this;
			res = arguments;
			fns = fns.filter(function(fn) {
				fn.apply(self, res);
			});
		});
		return function addCallback(fn) {
			if (!res) {
				fns.push(fn);
			} else {
				fn.apply(self, res);
			}
			return addCallback;
		}
	}

	/*
	 * Functions to operate on arrays
	 */

	function flatten(list) {
		return list.reduce(function(acc, el) {
			acc.push.apply(acc, Array.isArray(el) ? flatten(el) : [el]);
			return acc;
		}, []);
	}

	function uniq(list, testFn) {
		var res = [];
		testFn = testFn || function(a, b) { return a === b; };
		list.forEach(function(el) {
			var i = 0;
			while (res.length > i && !testFn(el, res[i])) {
				i++;
			}
			if (i === res.length) {
				res.push(el);
			}
		});

		return res;
	}

	function zip(/*...lists*/) {
		var lists = [].slice.call(arguments),
			res = [],
			i = 0,
			el = [],
			max = lists.reduce(function(max, list) {
				return list.length > max ? list.length : max;
			}, 0);

		for (i = 0; i < max; i++) {
			lists.forEach(function(list) {
				el.push(list[i]);
			});
			res.push(el);
			el = [];
		}
		return res;
	}

	exports.fp = {
		partial: partial,
		compose: compose,
		nextTick: nextTick,
		debounce: debounce,
		throttle: throttle,
		after: after,
		zipAfter: zipAfter,
		wrap: wrap,
		rPartial: rPartial,
		memoize: memoize,
		uncurryThis: uncurryThis,
		sequence: sequence,
		promise: promise,
		flatten: flatten,
		uniq: uniq,
		zip: zip,
	};
}(window));
