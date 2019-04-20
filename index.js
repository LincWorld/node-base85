module.exports = (function(Base85) {
	let DEFAULT_CHARACTER_SET =
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~";
	let s, val, Base85Chars;

	Base85.encode = function(integer) {
		//Send integer as string if bigger than 2^53
		if (typeof f != "bigint") {
			integer = BigInt(integer);
		}
		s = "";
		while (integer > 0) {
			s = Base85.characterSet[integer % Base85.indexLength] + s;
			integer = integer / Base85.indexLength;
		}
		return s !== "" ? s : "0";
	};

	Base85.encodeSigned = function(bytes) {
		if (bytes % 4 != 0) {
			throw Error("Signed values can only be in multiple of 4 bytes");
		}
		let MSB = "0x80",
			SUB = "0x100";
		for (let b = bytes; b > 1; b--) {
			MSB = MSB + "00";
			SUB = SUB + "00";
		}
		let PAD = SUB;
		SUB = BigInt(SUB);
		MSB = BigInt(MSB);
		return function(integer, padding = true) {
			//Send integer as string if bigger than 2^53
			if (typeof f != "bigint") {
				integer = BigInt(integer);
			}
			if (integer >= MSB) {
				throw Error(`Number too big for ${bytes} bytes.`);
			}
			if (integer <= -MSB) {
				throw Error(`Number too big for ${bytes} bytes.`);
			}
			if (integer < 0) {
				integer = integer + SUB;
			}
			if (padding) {
				let l = (bytes / 4) * 5;
				return (PAD + Base85.encode(integer)).substr(-l, l);
			} else {
				return Base85.encode(integer);
			}
		};
	};

	Base85.decode = function(Base85String) {
		val = BigInt(0);
		Base85Chars = Base85String.split("").reverse();
		Base85Chars.forEach(function(character, index) {
			val +=
				BigInt(Base85.characterSet.indexOf(character)) *
				Base85.indexLength ** BigInt(index);
		});
		return val;
	};

	Base85.decodeSigned = function(bytes) {
		if (bytes % 4 !== 0) {
			throw Error("Signed values can only be in multiple of 4 bytes");
		}
		let MSB = "0x80",
			SUB = "0x100";
		for (let b = bytes; b > 1; b--) {
			MSB = MSB + "00";
			SUB = SUB + "00";
		}
		SUB = BigInt(SUB);
		MSB = BigInt(MSB);
		//let SUB = 0x100 << ((bytes-1)*8);
		return function(Base85String) {
			val = Base85.decode(Base85String);
			//https://stackoverflow.com/a/13468626
			if (val >= SUB) {
				throw Error(`Number too big for ${bytes} bytes.`);
			}
			if (val > MSB) {
				val = val - SUB;
			} else if (val == MSB) {
				return BigInt(-0);
			}
			return val;
		};
	};

	Base85.setCharacterSet = function(chars) {
		let arrayOfChars = chars.split(""),
			uniqueCharacters = [];

		arrayOfChars.forEach(function(char) {
			if (!~uniqueCharacters.indexOf(char)) {
				uniqueCharacters.push(char);
			} else {
				throw Error("You must use unique characters.");
			}
		});
		Base85.indexLength = BigInt(arrayOfChars.length);
		Base85.characterSet = arrayOfChars;
	};

	Base85.setCharacterSet(DEFAULT_CHARACTER_SET);
	return Base85;
}({}));
