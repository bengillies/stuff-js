/*
 * Define an object for getting and setting attributes that my not exist
 */
(function(exports) {
	"use strict";

	/* turn shorthand string syntax into an array specifying which sttribute to
	 * target
	 */
	function split(args) {
		return args.split('.');
	}

	/* Get the attribute from obj specified by args and return it.
	 * If it doesn't exist (i.e. it is undefined or null), return def instead
	 * args must be an array, or a string with . separating each attribute
	 */
	function get(obj, args, def) {
		var res = obj;
		args = (typeof args.forEach === 'function') ? args : split(args);

		args.forEach(function(arg) {
			res = (res == null || res[arg] == null) ? def : res[arg];
		});

		return res;
	}

	/* set the attribute specified by args to the value val
	 * obj must exist, but if args aren't in obj, they will be created
	 * args must be an array, or a string with . separating each attribute
	 */
	function set(obj, args, val) {
		var target = obj,
			arg,
			i = 0;
		args = (typeof args.forEach === 'function') ? args : split(args);

		while (i < args.length - 1) {
			arg = args[i];
			target = (target[arg] == null) ? (target[arg] = {}) : target[arg];
			i++;
		}
		target[args[i]] = val;
	}

	exports.attr = {
		get: get,
		set: set
	}

}(window));
