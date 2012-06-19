module('attr');

test('attr exists', function() {
	notStrictEqual(typeof attr, 'undefined', 'the attr object exists');
	strictEqual(typeof attr.get, 'function', 'the get function exists');
	strictEqual(typeof attr.set, 'function', 'the set function exists');
});

test('get existing element with no default', function() {
	var testObj = {
		foo: 'bar'
	};
	strictEqual(attr.get(testObj, 'foo'), 'bar', 'getting foo returns bar');
});

test('get element with no default from non existing object', function() {
	strictEqual(typeof attr.get(undefined, 'foo'), 'undefined',
		'getting from undefined doesn\'t throw');
	strictEqual(typeof attr.get(null, 'foo'), 'undefined',
		'getting from null doesn\'t throw');
})

test('get nested element from object', function() {
	var testObj = {
		foo: {
			bar: [
				'baz'
			]
		}
	};

	strictEqual(attr.get(testObj, ['foo', 'bar', 0]), 'baz',
		'nested objects can be retrieved as well');
});

test('get nested element that doesn\'t exist', function() {
	var testObj = {
		foo: null
	};

	strictEqual(typeof attr.get(testObj, ['foo', 'bar', 0]), 'undefined',
		'getting a nested object from undefined doesn\'t throw');
});

test('get non existent element with default', function() {
	var testObj = {};
	strictEqual(attr.get(testObj, 'foo', 'bar'), 'bar',
		'the default is returned if the attribute doesn\'t exist');
});

test('get nested attribute shorthand', function() {
	var testObj = {
		foo: {
			bar: [
				'baz'
			]
		}
	};
	strictEqual(attr.get(testObj, 'foo.bar.0'), 'baz',
		'shorthand syntax results in the same answer');
});

test('set element', function() {
	var testObj = {
		foo: 'bar'
	};
	attr.set(testObj, 'foo', 'baz');
	strictEqual(testObj.foo, 'baz', 'testObj.foo has changed to baz');
});

test('set non existent element throws', function() {
	raises(function() { attr.set(undefined, 'foo', 'bar') }, TypeError,
		'you can\'t set an attribute on a non existent variable');
});

test('set nested attribute', function() {
	var testObj = {
		foo: {
			bar: 'baz'
		}
	};
	attr.set(testObj, ['foo', 'bar'], 'qux');
	strictEqual(testObj.foo.bar, 'qux',
		'you can set attributes nested inside other objects');
});

test('set nested attribute that doesn\'t exist', function() {
	var testObj = {
		foo: null
	};
	attr.set(testObj, ['foo', 'bar', 'baz'], 'qux');

	strictEqual(testObj.foo.bar.baz, 'qux',
		'attributes that don\'t exist get initialised to an empty object');
});

test('set nested attribute shorthand', function() {
	var testObj = {
		foo: {
			bar: {
				baz: [
					'biz'
				]
			}
		}
	};
	attr.set(testObj, 'foo.bar.baz.0', 'qux');
	strictEqual(testObj.foo.bar.baz[0], 'qux',
		'you can set attributes using the shorthand syntax');
});
