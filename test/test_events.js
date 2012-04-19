module('events', {
	setup: function() {
		$('<div id="bar"><a class="foo">foo</a><a class="baz">baz</a></div>').appendTo(document.body);
		foo = Object.create({
			foo: function(a, callback) {
				callback.call(this, a)
			},
		});
		global = {
			foo: foo
		};
	},
	teardown: function() {
		$('#bar').remove();
	}
});

test('Emitter creates new object', function() {
	var e = new Emitter;
	strictEqual(typeof e.on === 'function', true, 'there is an on function');
	strictEqual(typeof e.off === 'function', true, 'there is an off function');
	strictEqual(typeof e.trigger === 'function', true, 'there is a trigger function');
	strictEqual(Object.getOwnPropertyDescriptor(e, 'on').enumerable, false, 'on is not enumerable');
	strictEqual(Object.getOwnPropertyDescriptor(e, 'off').enumerable, false, 'off is not enumerable');
	strictEqual(Object.getOwnPropertyDescriptor(e, 'trigger').enumerable, false, 'trigger is not enumerable');
});

test('Emitter works without new', function() {
	var e = Emitter();
	strictEqual(typeof e.on === 'function', true, 'there is an on function');
	strictEqual(typeof e.off === 'function', true, 'there is an off function');
	strictEqual(typeof e.trigger === 'function', true, 'there is a trigger function');
	strictEqual(Object.getOwnPropertyDescriptor(e, 'on').enumerable, false, 'on is not enumerable');
	strictEqual(Object.getOwnPropertyDescriptor(e, 'off').enumerable, false, 'off is not enumerable');
	strictEqual(Object.getOwnPropertyDescriptor(e, 'trigger').enumerable, false, 'trigger is not enumerable');
});

test('Emitter can be used as a mixin', function() {
	foo.biz = 'foo';
	Emitter.call(foo);
	strictEqual(typeof foo.on === 'function', true, 'there is an on function');
	strictEqual(typeof foo.off === 'function', true, 'there is an off function');
	strictEqual(typeof foo.trigger === 'function', true, 'there is a trigger function');
	strictEqual(Object.getOwnPropertyDescriptor(foo, 'on').enumerable, false, 'on is not enumerable');
	strictEqual(Object.getOwnPropertyDescriptor(foo, 'off').enumerable, false, 'off is not enumerable');
	strictEqual(Object.getOwnPropertyDescriptor(foo, 'trigger').enumerable, false, 'trigger is not enumerable');
	strictEqual(foo.biz, 'foo', 'foo.biz hasn\'t been overwritten');
	strictEqual(typeof foo.foo === 'function', true, 'foo\'s prototype is still intact');
});

test('on and trigger', function() {
	Emitter.call(foo);
	var fn = foo.on('foo', foo.foo);
	strictEqual(fn, foo.foo, 'on returns the callback registered');

	var asyncFlag = false;
	foo.trigger('foo', 'foo', function(a) {
		strictEqual(a, 'foo', 'foo.foo was called');
		strictEqual(this, foo, 'the thisArg is foo');
		asyncFlag = true;
		start();
	});
	strictEqual(asyncFlag, false, 'the trigger function works asynchronously');
	stop();
});

test('off all', function() {
	Emitter.call(foo);
	foo.on('foo', foo.foo);

	expect(1, 'only 1 event triggers');
	foo.trigger('foo', 'foo', function(a) {
		strictEqual(a, 'foo', 'foo.foo was called');
		foo.off('foo');
		foo.trigger('foo', 'foo', function(a) {
			ok(false, 'foo should no longer trigger');
		});
		setTimeout(start, 50);
	});

	stop();
});

test('off named function', function() {
	Emitter.call(foo);
	var fn = foo.on('foo', foo.foo);
	foo.on('foo', function() {
		ok('This handler should still be called');
		start();
	});
	foo.off('foo', fn);
	stop();
});

test('multiple calls', function() {
	Emitter.call(foo);
	expect(2, 'foo.foo should be called twice');
	foo.on('foo', foo.foo);
	foo.on('foo', foo.foo);
	var count = 0;
	foo.trigger('foo', 'foo', function(a) {
		count++;
		strictEqual(a, 'foo', 'foo.foo was called');
		if (count === 2) {
			start();
		}
	});
	stop();
});

test('namespacing', function() {
	var emitter = new Emitter();
	Emitter.call(foo);
	emitter.foo = foo;
	foo.on('foo', foo.foo);
	expect(1, 'foo.foo should be called');
	emitter.trigger('foo.foo', 'foo', function() {
		strictEqual(this, foo, 'emitter delegated to foo, which set the thisArg correctly');
		start();
	});
	stop();
});

test('Emitter initialisation with object', function() {
	Emitter.call(foo, {
		foo: 'foo'
	});
	expect(1, 'foo.foo should be called');
	foo.trigger('foo', 'foo', function(a) {
		strictEqual(a, 'foo', 'foo.foo was successfully bound to the foo event');
		start();
	});
	stop();
});

test('DOM Events', function() {
	foo.el = $('.foo')[0];
	expect(1, 'the click handler should fire once');
	foo.bar = function(ev) {
		ok(true, 'the DOM element click event fired');
	};
	Emitter.call(foo, {
		'el.click': 'bar'
	});
	var ev = document.createEvent('Event');
	ev.initEvent('click', true, true);
	$('.foo')[0].dispatchEvent(ev);
});

test('DOM sub element', function() {
	foo.el = $('#bar')[0];
	expect(1, 'the click handler should fire once');
	foo.bar = function(ev) {
		strictEqual(ev.target, $('.foo')[0], 'foo is the target');
	};
	Emitter.call(foo, {
		'el.click .foo': 'bar'
	});
	var ev = document.createEvent('Event');
	ev.initEvent('click', true, true);
	$('.foo')[0].dispatchEvent(ev);

	ev = document.createEvent('Event');
	ev.initEvent('click', true, true);
	$('.baz')[0].dispatchEvent(ev);
});
