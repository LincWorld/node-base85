/*jshint mocha: true*/
var should = require('should'),
	path = require('path'),
	Base85 = require(path.join(__dirname, '../index.js'));

describe('Base85', function() {
	it("should return 0", function(done) {
		var res = Base85.encode(0);
		res.should.equal("0");
		done();
	});
	
	it("should return Sw?xI", function(done) {
		var res = Base85.encode(1497790883);
		res.should.equal("Sw?xI");
		done();
	});
	
	it("should return |NsC0", function(done) {
		var encoder = Base85.encodeSigned(4);
		var res = encoder(-1);
		res.should.equal("|NsC0");
		done();
	});
	
	it("should return 0", function(done) {
		var encoder = Base85.encodeSigned(4);
		var res = encoder(0);
		res.should.equal("0");
		done();
	});
	
	it("should return fB*mi", function(done) {
		var encoder = Base85.encodeSigned(4);
		var res = encoder(-2147483647);
		res.should.equal("fB*mi");
		done();
	});
	
	it("should return 19936", function(done) {
		var res = Base85.decode("2$k");
		res.should.equal(19936);
		done();
	});
	it("should return 2147483647", function(done) {
		var res = Base85.decode("fB*mg");
		res.should.equal(2147483647);
		done();
	});
	
	it("should return -0", function(done) {
		var decoder = Base85.decodeSigned(4);
		var res = decoder("fB*mh");
		res.should.equal(-0);
		done();
	});
	
	it("should return -1", function(done) {
		var decoder = Base85.decodeSigned(4);
		var res = decoder("|NsC0");
		res.should.equal(-1);
		done();
	});
	
	it("should return 1", function(done) {
		var decoder = Base85.decodeSigned(4);
		var res = decoder("1");
		res.should.equal(1);
		done();
	});
	
	
	it("should return -2147483647", function(done) {
		var decoder = Base85.decodeSigned(4);
		var res = decoder("fB*mi");
		res.should.equal(-2147483647);
		done();
	});
	
	it("should return rmnO - base62 ", function(done) {
		Base85.setCharacterSet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
		var res = Base85.encode(6520900);
		res.should.equal("rmnO");
		done();
	});
	it("should return error ", function(done) {
		should.throws(function() {
			Base85.setCharacterSet("000123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
		}, /You must use unique characters\./, "Did not throw message.");
		done();
	});
});
