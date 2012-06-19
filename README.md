StuffJS
=======

Some stuff, written in JavaScript. Includes 2 libraries that do as little as possible whilst trying to remain useful. The libraries are currently:
  - exemplar.js - provides sugar for declaring function exemplars (i.e. making use of the function + prototype pattern), inheriting and copying properties across.
  - events.js - provides an event emitter/pub-sub library that supports DOM and non-DOM events and supports rudimentary namespacing.

Both libraries try hard to not impose on your own code and work well on their own, or together.

Exemplar
====

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

	emitter.on('foo', function(arg1, arg2));
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