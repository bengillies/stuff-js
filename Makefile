.PHONY: test upload

upload:
	tsupload sandben *.js
	tsupload sandben demo.html

test:
	qunit test/index.html

