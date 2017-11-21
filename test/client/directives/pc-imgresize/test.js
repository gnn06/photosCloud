var assert = require('assert');
var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var test = require('selenium-webdriver/testing');
var liveServer = require('live-server');

function startServer () {
	var params = {
		port: 8080, // Set the server port. Defaults to 8080.
		host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
		root: 'test/client/directives/pc-imgresize/', // Set root directory that's being served. Defaults to cwd.
		open: false, // When false, it won't load your browser by default.
		ignore: 'scss,my/templates', // comma-separated string for paths to ignore
		file: 'landscape.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
		watch: [],
		wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
		mount: [['/client', 'client/']], // Mount a directory to a route.
		logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
		middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
	};
	liveServer.start(params);
}

test.describe('imgresize nominal', function () {

	function elementAssertHeightSetted (element) {
		element.getAttribute('style').then(value => {
			assert.ok(value.indexOf('height') >= 0);
			assert.ok(value.indexOf('width')  == -1);
		});
	}
    
	function elementAssertWidthSetted (element) {
		element.getAttribute('style').then(value => {
			assert.ok(value.indexOf('height') == -1);
			assert.ok(value.indexOf('width')  >= 0);
		});
	}

	this.timeout(60000);
	/**
     *  @type {int}
     */ 
	var driver;

	test.before(function () {
		startServer();
		driver = new webdriver.Builder()
			.forBrowser('chrome')
			.build();
	});

	test.after(function() {
		driver.quit();
		liveServer.shutdown();
	});

	/**
     * img size : 800  533
	 * 
     *    1   1   800  533   
	 *  
     *    1.2 1   960  533   => use height
     *    1   1.2 800  639   => use width
	 * 
     *    1.2 1.5 960  799   => use width,  height at 1.2 = 639.594
     *    1.5 1.2 1200 639   => use height, width  at 1.2 = 959.094
	 * 
     *    0.8 1   640  533   => use width,  height at 0.8 =  426.4
     *    1   0.8 800  426   => use height, width  at 0.8 =  640
     */

	test.describe('when window has origial img size (800x533)', function() {
		test.it('img size should be (800x533), should use width', function () {
			driver.manage().window().setSize(800+16, 533+132);
			driver.get('http://localhost:8080/landscape.html');
			driver.findElement(By.id('picture')).then(element => {
				element.getCssValue('width').then(width => {
					assert.equal(width, '800px');
				});
				element.getCssValue('height').then(height => {
					assert.equal(height, '533px');
				});
				elementAssertHeightSetted(element);
			});
		});
	});

	test.describe('when window has only width bigger (960x533)', function() {
		test.it('img size should be (800x533), height setted', function () {
			driver.manage().window().setSize(960+16, 533+132);
			driver.get('http://localhost:8080/landscape.html');
			driver.findElement(By.id('picture'))
				.then(element => {
					element.getCssValue('width').then(width => {
						assert.equal(width, '800px');
					});
					element.getCssValue('height').then(height => {
						assert.equal(height, '533px'); 
					});
					elementAssertHeightSetted(element);
				});
		});
			
	});

	test.describe('when window has only height bigger (800x639)', function() {
		test.it('img size should be (800x533), width setted', function () {
			driver.manage().window().setSize(800+16, 639+132)
				.then(() => {
					driver.get('http://localhost:8080/landscape.html')
						.then(function () {
							driver.findElement(By.id('picture')).then(element => {
								element.getCssValue('width').then(width => {
									element.getCssValue('height').then(height => {
										assert.equal(width, '800px');
										assert.equal(height, '533px');
									});
								});
								elementAssertWidthSetted(element);
							});
						});
				});
		});
	});

	test.describe('when window is bigger than img with height bigger (960x799)', function() {
		test.it('img size should be (960x639), should use width', function () {
			driver.manage().window().setSize(960+16, 799+132);
			driver.get('http://localhost:8080/landscape.html');
			driver.findElement(By.id('picture')).then(element => {
				element.getCssValue('width').then(width => {
					assert.equal(width, 960 + 'px');
				});
				element.getCssValue('height').then(height => {
					assert.equal(height, 639.594 + 'px');
				});
				elementAssertWidthSetted(element);
			});
		});
	});

	test.describe('when window is bigger than img with height bigger (1200x639.6)', function() {
		test.it('img size should be (959x639), should height', function () {
			driver.manage().window().setSize(1200+16, 639+132);
			driver.get('http://localhost:8080/landscape.html');
			driver.findElement(By.id('picture')).then(element => {
				element.getCssValue('width').then(width => {
					assert.equal(width, 959.094 + 'px');
				});
				element.getCssValue('height').then(height => {
					assert.equal(height, 639 + 'px');
				});
				elementAssertHeightSetted(element);
			});
		});
	});

	test.describe('when window has smaller width than img (640x533)', function() {
		test.it('img size should be (640x426), should use width', function () {
			driver.manage().window().setSize(640+16, 533+132);
			driver.get('http://localhost:8080/landscape.html');
			driver.findElement(By.id('picture')).then(element => {
				element.getCssValue('width').then(width => {
					assert.equal(width,  640     + 'px');
				});
				element.getCssValue('height').then(height => {
					assert.equal(height, 426.391 + 'px');
				});
				elementAssertWidthSetted(element);
			});
		});
	});

	test.describe('when window has smaller height than img (800x426)', function() {
		test.it('img size should be (640x426), should use height', function () {
			driver.manage().window().setSize(800+16, 426+132);
			driver.get('http://localhost:8080/landscape.html');
			driver.findElement(By.id('picture')).then(element => {
				element.getCssValue('width').then(width => {
					assert.equal(width,  639.391     + 'px');
				});
				element.getCssValue('height').then(height => {
					assert.equal(height, 426 + 'px');
				});
				elementAssertHeightSetted(element);
			});
		});
	});
});
