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

	it("should return d*-h_{Y}sg", function(done) {
		var res = Base85.encode("9223372036854775807");
		res.should.equal("d*-h_{Y}sg");
		done();
	});

	it("should return error ", function(done) {
		should.throws(function() {
			var encoder = Base85.encodeSigned(8);
			encoder("9223372036854775808");
		}, /Number too big for/, "Did not throw message.");
		done();
	});

	it("should return error ", function(done) {
		should.throws(function() {
			var encoder = Base85.encodeSigned(8);
			encoder("-9223372036854775808");
		}, /Number too big for/, "Did not throw message.");
		done();
	});

	it("should return K&@H;m", function(done) {
		var res = Base85.encode(92233720368);
		res.should.equal("K&@H;m");
		done();
	});

	it("should return 0000K&@H;m", function(done) {
		var encoder = Base85.encodeSigned(8);
		var res = encoder(92233720368);
		res.should.equal("0000K&@H;m");
		done();
	});

	it("should return _sv#aG}{?@", function(done) {
		var encoder = Base85.encodeSigned(8);
		var res = encoder("-9223372036854");
		res.should.equal("_sv#aG}{?@");
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
		res.should.equal("00000");
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
		res.should.equal(BigInt(19936));
		done();
	});
	it("should return 2147483647", function(done) {
		var res = Base85.decode("fB*mg");
		res.should.equal(BigInt(2147483647));
		done();
	});

	it("should return -0", function(done) {
		var decoder = Base85.decodeSigned(4);
		var res = decoder("fB*mh");
		res.should.equal(BigInt(-0));
		done();
	});

	it("should return -1", function(done) {
		var decoder = Base85.decodeSigned(4);
		var res = decoder("|NsC0");
		res.should.equal(BigInt(-1));
		done();
	});

	it("should return 1", function(done) {
		var decoder = Base85.decodeSigned(4);
		var res = decoder("1");
		res.should.equal(BigInt(1));
		done();
	});

	it("should return -2147483647", function(done) {
		var decoder = Base85.decodeSigned(4);
		var res = decoder("fB*mi");
		res.should.equal(BigInt(-2147483647));
		done();
	});

	it("should return 9223372036854775807", function(done) {
		var decoder = Base85.decodeSigned(8);
		var res = decoder("d*-h_{Y}sg");
		res.should.equal(BigInt("9223372036854775807"));
		done();
	});

	it("should return -9223372036854775807", function(done) {
		var decoder = Base85.decodeSigned(8);
		var res = decoder("d*-h_{Y}si");
		res.should.equal(BigInt("-9223372036854775807"));
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
