module('domb', {
	teardown: function() {
		$('#sandbox').html('');
	}
});

test('simple init set', function() {
	var obj = {
		foo: 'Foo'
	};
	var el = $('<div/>').appendTo('#sandbox');

	domb.bind(obj, el[0], 'foo');

	strictEqual(el.text(), 'Foo', 'el text has been set to obj');
});

test('prop init set', function() {
	var obj = {
		foo: 'Foo'
	};
	var el = $('<div/>').appendTo('#sandbox');

	domb.bind(obj, el[0], { foo: { prop: 'data-foo' } });

	strictEqual(el.attr('data-foo'), 'Foo', 'the data-foo property is set');
});

test('sub el shorthand init set', function() {
	var obj = {
		foo: 'Foo'
	};
	var el = $('<div><div class="foo"></div></div>').appendTo('#sandbox');

	domb.bind(obj, el[0], { foo: '.foo' });

	strictEqual(el.find('.foo').text(), 'Foo',
		'the text of the sub element has been set');
});

test('sub el longhand init set', function() {
	var obj = {
		foo: 'Foo'
	};
	var el = $('<div><div class="foo"></div></div>').appendTo('#sandbox');

	domb.bind(obj, el[0], { foo: { el: '.foo' } });

	strictEqual(el.find('.foo').text(), 'Foo',
		'the text of the sub element has been set');
});

test('sub el prop init set', function() {
	var obj = {
		foo: 'Foo'
	};
	var el = $('<div><div class="foo"></div></div>').appendTo('#sandbox');

	domb.bind(obj, el[0], { foo: { el: '.foo', prop: 'data-foo' } });

	strictEqual(el.find('.foo').attr('data-foo'), 'Foo',
		'the data-foo property of the sub element has been set');
});

test('multiple attr init set', function() {
	var obj = {
		foo: 'Foo',
		bar: 'Bar'
	};
	var el = $('<div><div class="foo"></div><div class="bar"></div></div>')
		.appendTo('#sandbox');

	domb.bind(obj, el[0], { 'foo': '.foo', 'bar': '.bar' });

	strictEqual(el.find('.foo').text(), 'Foo',
		'foo sub element has been set to Foo');
	strictEqual(el.find('.bar').text(), 'Bar',
		'bar sub element has been set to bar');
});

test('change attr', function() {
	var obj = {
		foo: 'Bar'
	};

	var el = $('<div/>').appendTo('#sandbox');

	domb.bind(obj, el[0], 'foo');

	strictEqual(el.text(), 'Bar', 'el is set to Bar initially');

	obj.foo = 'Foo';

	strictEqual(el.text(), 'Foo', 'changing obj.foo changes el');
});
