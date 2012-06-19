StuffJS
=======

A small collection of micro-libraries that can be used on their own or together. Each library is totally independent and has no dependencies. Currently includes:
  - exemplar.js - provides sugar for declaring function exemplars (i.e. making use of the function + prototype pattern), inheriting and copying properties across.
  - events.js - provides an event emitter/pub-sub library that supports DOM and non-DOM events and supports rudimentary namespacing.
  - attr.js - provides two functions: attr.get and attr.set that allow easy access to attributes nested inside object without having to check if each sub-attribute exists.


Exemplar
========

	var Foo = Exemplar({
		constructor: function() {
			this.foo = 'foo';
		},
		bar: function() {
			return 'bar';
		}
	});

	var foo = new Foo();
	foo.foo;
	foo.bar();

	var Bar = Foo.extend({
		constructor: function() {
			Foo.call(this);
			this.baz = 'baz';
		}
	});

	var bar = new Bar;
	bar.foo;
	bar.bar();
	bar.baz;


Events
======

	var emitter = new Emitter();

	emitter.on('foo', function(arg1, arg2) {});
	emitter.trigger('foo', arg1, arg2);


	var emitter = new Emitter({
		foo: function(arg1, arg2) {},
		bar: function(arg1, arg2 ,arg3) {}
	});
	emitter.trigger('foo', arg1, arg2);
	emitter.trigger('bar', arg1, arg2, arg3);


	var fooBar = {
		el: document.querySelector('.foo'),
		onClick: function(ev) {},
		onFoo: function() {}
	};
	Emitter.call(fooBar, {
		'el.click': 'onClick',
		foo: 'onFoo'
	});
	fooBar.trigger('el.click', ev);
	fooBar.trigger('foo');


	var emitter = new Emitter();
	emitter.el = document.querySelector('.foo');
	emitter.sub = new Emitter();
	emitter.on('el.click input[type="text"]', function() {});
	emitter.on('sub.foo-bar', function() {});


	var emitter = new Emitter();
	var fn = emitter.on('foo', function(arg1, arg2) {});
	emitter.off('foo', fn);


Attr
====

	var foo = {
		bar: {
			baz: {
				biz: [
					'qux'
				]
			}
		}
	};

	attr.get(foo, 'bar');
	attr.get(foo, ['bar', 'baz', 'biz', 0]);
	attr.get(foo, 'bar.baz.biz.0');
	attr.get(foo, ['bar', 'baz', 'quux'], 'default');
	attr.get(foo, 'bar.baz.quux', 'default');

	attr.set(foo, 'newattr', 'newval');
	attr.set(foo, ['createnewattr', 'subattr'], 'newval');
	attr.set(foo, 'bix.boz', 'foobar');
