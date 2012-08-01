/*
 * Define an interface to let you bind JS objects to DOM elements and have the
 * DOM update when the JS obj changes.
 */

(function(exports) {
	"use strict";

	/*
	 * update the target with obj (defaults to target.textContent)
	 * when an attribute in obj changes, update the target
	 * mappings are given by hashMap in the format:
	 *     attr
	 *     // === obj[attr] --> target
	 *     {
	 *         attr: selector
	 *     }
	 *     //  === obj[attr] --> target > selector
	 *
	 *     {
	 *         attr: { el: selector, prop: prop }
	 *     }
	 *     // === obj[attr] --> (target > selector).prop
	 *     // (el and prop are optional)
	 */
	function bind(obj, target, hashMap) {
		var attr, setter;
		target = target || document;

		if (typeof hashMap === 'string') {
			setter = setValue(target, 'text');
			setter(obj[hashMap]);
			setSetter(obj, hashMap, setter);
		} else {
			for (attr in hashMap) if (hashMap.hasOwnProperty(attr)) {
				(function() {
					var opts = (typeof hashMap[attr] === 'string') ?
							{ el: hashMap[attr] } : hashMap[attr],
						els = (opts.el) ?
							target.querySelectorAll(opts.el) : [target],
						setter = setValue(els, opts.prop);
					setter(obj[attr]);
					setSetter(obj, attr, setter);
				}());
			}
		}
	}

	/*
	 * return the correct property name given the element and intended name
	 * e.g. class --> className, text --> textContent, etc
	 */
	function getPropName(el, prop) {
		if (el[prop]) {
			return prop;
		} else {
			switch (prop) {
				case 'class': return 'className';
				case undefined:
				case 'text': return 'textContent';
				default: return 'setAttribute';
			}
		}
	}

	/*
	 * give all the elements in els the provided value
	 */
	function setValue(els, prop) {
		return function(value) {
			var i, l, propName, el;
			for (i = 0, l = els.length; i < l; i++) {
				el = els[i];
				propName = getPropName(el, prop);
				if (typeof el[propName] === 'function') {
					el[propName](prop, value);
				} else {
					el[propName] = value;
				}
			}
		};
	}

	/*
	 * set a listener on obj[attr] that fires fn when obj[attr] changes
	 */
	function setSetter(obj, attr, fn) {
		var descriptor, descriptorValue, _set;

		descriptor = Object.getOwnPropertyDescriptor(obj, attr);
		descriptorValue = descriptor.value;
		delete descriptor.writable;
		delete descriptor.value;
		descriptor.set = setter;
		descriptor.get = function() { return descriptorValue; }
		Object.defineProperty(obj, attr, descriptor);

		function setter(value) {
			if (value !== descriptorValue) {
				fn(value);
				descriptorValue = value;
			}
			return value;
		}
	}

	exports.domb = {
		bind: bind
	};

}(window));
