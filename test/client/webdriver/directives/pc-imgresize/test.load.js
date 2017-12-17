var assert = require('assert');
var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var test = require('selenium-webdriver/testing');
var liveServer = require('live-server');

test.describe('imgresize loading', function () {
    
	this.timeout(60000);
	var driver;

	test.before(function () {
		var params = {
			port: 8080, // Set the server port. Defaults to 8080.
			host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
			root: 'test/client/webdriver/directives/pc-imgresize/', // Set root directory that's being served. Defaults to cwd.
			file: 'landscape.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
			mount: [['/client', 'client/'], ['/media', 'test/media']], // Mount a directory to a route.
			open: false, // When false, it won't load your browser by default.
			ignore: 'scss,my/templates', // comma-separated string for paths to ignore
			watch: [],
			wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
			logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
			middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
		};
		liveServer.start(params);

		driver = new webdriver.Builder()
			.forBrowser('chrome')
			.build();
	});

	test.after(function() {
		driver.quit();
		liveServer.shutdown();
	});

	/**
	 * pourrait être refactoré  sur le principe d'un mock pour vérifier que la function de resize
	 * est appelé
	 */

	/**
	 * describe('when image is static, is already tested')
	 */

	test.describe('when image is dynamic (src with expression) and long to download', function() {
		test.it('should size the image when it is loaded via onload', function () {
			/**
			 * use an portait image before testing to make sure, the width
			 * attribute was setted by the click
			 * use big images to make doanload slow and make $observe
			 * quicker than onload
			 */
			driver.manage().window().setSize(800+16-100, 533+132)
				.then(() => {
					driver.get('http://127.0.0.1:8080/landscape-notloaded.html')
						.then(function () {
							driver.findElement(By.id('bouton')).click()
								.then(() => {
									driver.sleep(5000)
										.then(() => {
											driver.findElement(By.id('picture'))
												.then(element => {
													// element.getCssValue('width').then(width => {
													element.getAttribute('width').then(width => {
														assert.equal(width, '700');
													});
												});
										});
								});
						});
				});
		});
	});

});
