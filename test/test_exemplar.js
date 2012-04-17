module('exemplar', {
	setup: function() {
		Foo = Exemplar({
			constructor: function() {
				this.foo = 'foo';
			},
			bar: function(a) {
				return a + 'foo';
			}
		});
		baz = {
			baz: function(a) {
				return a + 'bar';
			}
		};
	}
});

test('check correct exemplar', function() {
	strictEqual(typeof Foo === 'function', true, 'Foo is a constructor function');
	strictEqual(typeof Foo.prototype.bar === 'function', true, 'bar is on the prototype');
	strictEqual(Foo, Foo.prototype.constructor, 'Foo is the same as .prototype.constructor');
	strictEqual(typeof Foo.extend === 'function', true, 'Foo has an extend function');
	for (var k in Foo) {
		notStrictEqual(k, 'extend', 'extend is not enumerable');
	}
});

test('new instance', function() {
	var foo = new Foo;
	strictEqual(foo.foo, 'foo', 'the constructor function ran correctly');
	strictEqual(foo.bar('foo'), 'foofoo', 'foo has a bar function');
	strictEqual(foo.hasOwnProperty('bar'), false, 'bar is on the prototype');
	strictEqual(foo instanceof Foo, true, 'foo is a Foo');
	strictEqual(foo instanceof Object, true, 'foo is an Object');
});

test('inheritance creates correct exemplar', function() {
	var Bar = Foo.extend(baz);

	strictEqual(typeof Bar === 'function', true, 'Bar is a constructor function');
	strictEqual(typeof Bar.prototype.bar === 'function', true, 'bar is on the prototype');
	strictEqual(typeof Bar.prototype.baz === 'function', true, 'baz is on the prototype');
	strictEqual(Bar, Bar.prototype.constructor, 'Bar is the same as .prototype.constructor');
	strictEqual(typeof Bar.extend === 'function', true, 'Bar has an extend function');
	for (var k in Bar) {
		notStrictEqual(k, 'extend', 'extend is not enumerable');
	}

	notStrictEqual(Bar, Foo, 'Bar isn\'t the same as Foo, even though it inherits the same constructor function');
});

test('inheritance instance', function() {
	var Bar = Foo.extend(baz);
	var bar = new Bar;

	strictEqual(bar.foo, 'foo', 'the constructor function ran correctly');
	strictEqual(bar.bar('foo'), 'foofoo', 'bar has a bar function');
	strictEqual(bar.baz('foo'), 'foobar', 'bar has a baz function');
	strictEqual(bar.hasOwnProperty('bar'), false, 'bar is on the prototype');
	strictEqual(bar instanceof Foo, true, 'bar is a Foo');
	strictEqual(bar instanceof Bar, true, 'bar is a Bar');
	strictEqual(bar instanceof Object, true, 'bar is an Object');

});

module('extend', {
	setup: function() {
		source = Object.create(Object.prototype, {
			foo: {
				enumerable: false,
				value: 'foo'
			}
		});
		source.bar = 'bar';
	}
});

test('extend', function() {
	var target = extend({}, source);
	strictEqual(target.bar, 'bar', 'bar was copied across');
	strictEqual(target.foo, 'foo', 'foo was copied across');
	strictEqual(Object.getOwnPropertyDescriptor(target, 'foo').enumerable, false, 'foo was copied with it\'s descriptor intact');
});
