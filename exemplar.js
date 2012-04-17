(function(exports) {
	"use strict";
	/*
	 * Shallow copy properties in source to target
	 */
	function extend(target, source) {
		Object.getOwnPropertyNames(source).forEach(function(key) {
			Object.defineProperty(target, key,
				Object.getOwnPropertyDescriptor(source, key));
		});
		return target;
	}

	/*
	 * Turn proto into a function exemplar, and add a function to allow easy
	 * subclassing of it.
	 */
	function Exemplar(proto) {
		// define a function for subclassing existing classes
		function _extend(_proto) {
			return function(obj) {
				var _myClass = obj.hasOwnProperty('constructor') ?
					obj.constructor : function() {
						_proto.constructor.apply(this, arguments);
					};
				_myClass.prototype = Object.create(_proto);
				_myClass.prototype.constructor = _myClass;
				extend(_myClass.prototype, obj);

				// allow the subclass to be subclassed
				Object.defineProperty(_myClass, 'extend', {
					value: _extend(_myClass.prototype),
					enumerable: false
				});

				return _myClass;
			};
		}

		// use it to subclass Object
		return _extend(Object.prototype)(proto);
	}

	exports.Exemplar = Exemplar;
	exports.extend = extend;

}(window));
