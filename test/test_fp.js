module('fp');

test('fp exists', function() {
	notStrictEqual(typeof fp, 'undefined', 'the fp object exists');
	strictEqual(typeof fp.partial, 'function', 'there is a partial function');
	strictEqual(typeof fp.compose, 'function', 'there is a compose function');
	strictEqual(typeof fp.nextTick, 'function', 'there is a nextTick function');
	strictEqual(typeof fp.debounce, 'function', 'there is a debounce function');
	strictEqual(typeof fp.throttle, 'function', 'there is a throttle function');
	strictEqual(typeof fp.after, 'function', 'there is a after function');
	strictEqual(typeof fp.zipAfter, 'function', 'there is a zipAfter function');
	strictEqual(typeof fp.wrap, 'function', 'there is a wrap function');
	strictEqual(typeof fp.rPartial, 'function', 'there is a rPartial function');
	strictEqual(typeof fp.memoize, 'function', 'there is a memoize function');
	strictEqual(typeof fp.uncurryThis, 'function', 'there is a uncurryThis function');
	strictEqual(typeof fp.sequence, 'function', 'there is a sequence function');
	strictEqual(typeof fp.promise, 'function', 'there is a promise function');
	strictEqual(typeof fp.flatten, 'function', 'there is a flatten function');
	strictEqual(typeof fp.uniq, 'function', 'there is a uniq function');
	strictEqual(typeof fp.zip, 'function', 'there is a zip function');
});

test('partial expects a function', function() {
	raises(fp.partial, TypeError, 'partial expects at least one argument');
	raises(function() { fp.partial(1); }, TypeError, 'partial expects a function');
	ok(fp.partial(function() {}), 'Passing a function doesn\'t throw');
});

test('partial returns a function', function() {
	strictEqual(typeof fp.partial(function() {}), 'function',
		'partial returns a function');
});

test('partial returns a function that executes the original function',
	function() {
		expect(1);
		function foo(a) {
			ok(a, 'This function is run after passing through partial');
		}
		var fn = fp.partial(foo);
		fn(true);
	});

test('partial caches arguments passed in to it', function() {
	function foo(a, b) {
		expect(2);
		equal(a, true, 'a has been cached by the partial function');
		equal(b, false, 'b has not been cached by the partial function');
	}
	var fn = fp.partial(foo, true);
	fn(false);
});

test('partial passes this arg on as well', function() {
	expect(1);
	var thisArg = {};
	function foo() {
		strictEqual(this, thisArg, 'this arg has been passed through');
	}
	var fn = fp.partial(foo);
	fn.call(thisArg);
});

test('compose expects functions as arguments', function() {
	raises(fp.compose, TypeError, 'compose expects at least one argument');
	raises(function() { fp.compose(1); }, TypeError, 'compose expects a function');
	ok(fp.compose(function() {}), 'Passing a function doesn\'t throw');
});

test('compose returns a function that runs the original function',
	function() {
		expect(1);
		function foo(a) {
			ok(a, 'the original function is run');
		}
		var fn = fp.compose(foo);
		fn(true);
	});

test('compose runs all functions given to it', function() {
	expect(4);
	function foo() {
		ok(true, 'the function foo is run');
	}
	var fn = fp.compose(foo, foo, foo, foo);
	fn();
});

test('compose passes arguments from one function into next', function() {
	var count = 0;
	expect(4);
	function foo(a) {
		strictEqual(count, a,
			'the result from the previous function was passed in as input');
		count++;
		return count;
	}
	var fn = fp.compose(foo, foo, foo, foo);
	fn(count);
});

test('compose passes this arg on to each function', function() {
	var thisArg = {};
	expect(4);
	function foo() {
		strictEqual(this, thisArg, 'the value of this is maintained');
	}
	var fn = fp.compose(foo, foo, foo, foo);
	fn.call(thisArg);
});

test('compose returns the correct result', function() {
	function foo(a) {
		return a + 4;
	}
	var result = fp.compose(foo, foo, foo, foo)(0);
	strictEqual(result, 16, 'the composition returns 16');
});

test('compose composes in the right order', function() {
	function foo(a) {
		return 'foo(' + a + ')';
	}
	function bar(b) {
		return 'bar(' + b + ')';
	}
	var result = fp.compose(foo, bar)(0);
	strictEqual(result, 'foo(bar(0))',
		'the right most function is called first');
});

test('nextTick expects a function as an argument', function() {
	raises(fp.nextTick, TypeError, 'nextTick expects at least one argument');
	raises(function() { fp.nextTick(1); }, TypeError,
		'nextTick expects a function');
	ok(fp.nextTick(function() {}), 'Passing a function doesn\'t throw');
});

test('nextTick runs the function passed in asynchronously', function() {
	var flag = false;
	expect(2);
	function foo() {
		ok(true, 'this function is run');
		flag = true;
		start();
	}
	fp.nextTick(foo);
	strictEqual(flag, false, 'foo hasn\'t been run yet');
	stop();
});

test('debounce runs the function you pass it', function() {
	expect(1);
	fp.debounce(function(a) {
		equal(a, 'foo', 'the function is run');
		start();
	}, 100)('foo');
	stop();
});

test('debounce waits x ms after last being called', function() {
	expect(1);
	var count = 0,
		fn = fp.debounce(function() {
			ok(true, 'the function is called only once');
		}, 100);
	var timer = setInterval(function() {
		count++;
		fn();
		if (count === 10) {
			clearTimeout(timer);
			setTimeout(function() { start(); }, 150);
		}
	}, 50);
	stop();
});

test('throttle runs once every x seconds', function() {
	expect(2);
	var count = 0,
		fn = fp.throttle(function() {
			ok(true, 'the function is called only twice');
		}, 50);
	var timer = setInterval(function() {
		count++;
		fn();
		if (count === 10) {
			clearTimeout(timer);
			setTimeout(function() { start(); }, 150);
		}
	}, 10);
	stop();
});

test('after runs after x calls', function() {
	expect(1);
	var i = 10;
	var fn = fp.after(function() {
		ok(true, 'the function is only called once');
	}, i);
	while (i--) {
		fn();
	}
});

test('after only passes the last set of arguments', function() {
	expect(1);
	var i = 10;
	var fn = fp.after(function(a) {
		strictEqual(a, 0, 'the argument matches the last call only');
	}, i);
	while (i--) {
		fn(i);
	}
});

test('zipAfter runs after x calls', function() {
	expect(1);
	var i = 10;
	var fn = fp.zipAfter(function() {
		ok(true, 'the function is only called once');
	}, i);
	while (i--) {
		fn();
	}
});

test('zipAfter zips all arguments together', function() {
	expect(2);
	var i = 10;
	var fn = fp.zipAfter(function(a, b) {
		strictEqual(a.toString(), '9,8,7,6,5,4,3,2,1',
			'all the arguments have been zipped together');
		strictEqual(b.toString(), '9,8,7,6,5,4,3,2,1',
			'all the arguments have been zipped together');
	}, i);
	while (i--) {
		fn(i, i);
	}
});

test('wrap passes the wrapped function into your function', function() {
	expect(1);
	var wrappedFn = function() {};
	var wrapper = fp.wrap(wrappedFn, function(fn) {
		strictEqual(fn, wrappedFn, 'wrappedFn is passed in');
	});

	wrapper();
});

test('rPartial expects a function', function() {
	raises(fp.rPartial, TypeError, 'rPartial expects at least one argument');
	raises(function() { fp.rPartial(1); }, TypeError, 'rPartial expects a function');
	ok(fp.rPartial(function() {}), 'Passing a function doesn\'t throw');
});

test('rPartial returns a function', function() {
	strictEqual(typeof fp.rPartial(function() {}), 'function',
		'rPartial returns a function');
});

test('rPartial returns a function that executes the original function',
	function() {
		expect(1);
		function foo(a) {
			ok(a, 'This function is run after passing through rPartial');
		}
		var fn = fp.rPartial(foo);
		fn(true);
	});

test('rPartial caches arguments passed in to it from the right', function() {
	expect(2);
	function foo(a, b) {
		equal(a, false, 'a has not been cached by the rPartial function');
		equal(b, true, 'b has been cached by the rPartial function');
	}
	var fn = fp.rPartial(foo, true);
	fn(false);
});

test('rPartial passes this arg on as well', function() {
	expect(1);
	var thisArg = {};
	function foo() {
		strictEqual(this, thisArg, 'this arg has been passed through');
	}
	var fn = fp.rPartial(foo);
	fn.call(thisArg);
});

test('memoize returns the cached value on second call', function() {
	var fnToMemoize = (function() {
		var count = 0;
		return function(a) {
			count++;
			// ensure that the fn always returns a different value
			return count;
		};
	}());

	var testVal = fnToMemoize(1);
	var testVal2 = fnToMemoize(1);
	notEqual(testVal, testVal2,
		'ensure the same input gets a different output');

	var fn = fp.memoize(fnToMemoize);

	var initVal = fn(1);
	var sameAsFirstVal  = fn(1);
	equal(sameAsFirstVal, initVal, 'fn has memoized the function');
});

test('uncurryThis acts like Function.prototype.call', function() {
	var thisArg = {};

	expect(2);
	var fnToUncurry = function(a) {
		strictEqual(this, thisArg,
			'this has been passed in as the first argument');
		ok(a, 'other arguments get passed after this');
	};

	var fn = fp.uncurryThis(fnToUncurry);

	fn(thisArg, true);
});

test('sequence calls a number of functions', function() {
	expect(4);
	function foo() {
		ok(true, 'the function foo is run');
	}
	var fn = fp.sequence(foo, foo, foo, foo);
	fn();
});

test('sequence passes the same arguments into each function', function() {
	var count = 0;
	expect(4);
	function foo(a) {
		strictEqual(0, a,
			'the orginal value was passed in');
		count++;
		return count;
	}
	var fn = fp.sequence(foo, foo, foo, foo);
	fn(count);
});

test('promise accepts a function that gets called with a function', function() {
	expect(1);
	var completer = function(fn) {
		strictEqual(typeof fn, 'function', 'the first parameter is a function');
	};

	var promise = fp.promise(completer);
});

test('promise calls functions with data passed in via the completer',
function() {
	expect(1);
	var testObj = {};
	var completer = function(fn) {
		fn(testObj);
	};

	var promise = fp.promise(completer);
	promise(function(data) {
		strictEqual(data, testObj, 'the callback gets the original result');
	});
});

test('promise works asynchronously',
function() {
	expect(2);
	var testObj = {};
	var completer = function(fn) {
		setTimeout(function() {
			fn(testObj);
		}, 50);
	};

	var promise = fp.promise(completer);
	promise(function(data) {
		strictEqual(data, testObj, 'the callback gets the original result');
	});
	setTimeout(function() {
		promise(function(data) {
			strictEqual(data, testObj, 'the callback gets the original result');
			start();
		});
	}, 100);

	stop();
});

test('flatten returns flattened arrays unchanged', function() {
	var testArray = [1,2,3,4,5,6,7,8,9];
	var flattened = fp.flatten(testArray);
	var toString = JSON.stringify;

	strictEqual(toString(flattened), toString(testArray),
		'the two arrays are the same');
	notStrictEqual(flattened, testArray, 'They are not literally the same');
});

test('flatten flattens nested arrays', function() {
	var testArray = [1,2,3,4,5,[6,[7,8],9]];
	var expectedOutput = [1,2,3,4,5,6,7,8,9];
	var flattened = fp.flatten(testArray);
	var toString = JSON.stringify;

	strictEqual(toString(flattened), toString(expectedOutput),
		'the two arrays are the same');
});

test('uniq returns sets unchanged', function() {
	var testArray = [1,2,3,4,5,6,7,8,9];
	var uniqed = fp.uniq(testArray);
	var toString = JSON.stringify;

	strictEqual(toString(uniqed), toString(testArray),
		'the two arrays are the same');
	notStrictEqual(uniqed, testArray, 'They are not literally the same');
});

test('uniq removes duplicates in arrays', function() {
	var testArray = [1,2,2,'w','w','e',5,6,7,7,7,7,7];
	var expectedOutput = [1,2,'w','e',5,6,7];
	var uniqed = fp.uniq(testArray);
	var toString = JSON.stringify;

	strictEqual(toString(uniqed), toString(expectedOutput),
		'the two arrays are the same');
});

test('zip combines arrays', function() {
	var arr1 = [1,2,3,4,5];
	var arr2 = ['q','w','e','r','t'];
	var arr3 = [9,8,7,6,5];
	var expectedOutput = [[1,'q',9],[2,'w',8],[3,'e',7],[4,'r',6],[5,'t',5]];
	var toString = JSON.stringify;

	var zipped = fp.zip(arr1, arr2, arr3);

	strictEqual(toString(zipped), toString(expectedOutput),
		'all 3 arrays have been combined');
});
