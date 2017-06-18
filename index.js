module.exports = (function(Base85) {
	var DEFAULT_CHARACTER_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~";
	var s, val, Base85Chars;

	Base85.encode = function(integer) {
		s = '';
		while (integer > 0) {
			s = Base85.characterSet[integer % Base85.indexLength] + s;
			integer = Math.floor(integer / Base85.indexLength);
		}
		return s !== '' ? s : '0';
	};
	
	
	Base85.encodeSigned = function(bytes){
		var MSB = "0x80",  SUB="0x100";
		for(bytes;bytes>1;bytes--){
			MSB = MSB + "00";
			SUB = SUB + "00";
		}
		SUB = parseInt(SUB);
		MSB = parseInt(MSB);
		return function(integer) {
			if(integer < 0){
				integer=integer+SUB;
			}
			return Base85.encode(integer);
		};
	}
	
	Base85.decode = function(Base85String) {
		val = 0;
		Base85Chars = Base85String.split("").reverse();
		Base85Chars.forEach(function(character, index) {
			val += Base85.characterSet.indexOf(character) * Math.pow(Base85.indexLength, index);
		});
		return val;
	};

	Base85.decodeSigned = function(bytes){
		var MSB = "0x80",  SUB="0x100";
		for(bytes;bytes>1;bytes--){
			MSB = MSB + "00";
			SUB = SUB + "00";
		}
		SUB = parseInt(SUB);
		MSB = parseInt(MSB);

		//var SUB = 0x100 << ((bytes-1)*8);
		return function(Base85String) {
			val = Base85.decode(Base85String);
			//https://stackoverflow.com/a/13468626
			if (val > MSB) {
				val = val - SUB;
			}else if(val === MSB){
				return -0;
			}
			return val;
		};
	}

	Base85.setCharacterSet = function(chars) {
		var arrayOfChars = chars.split(""),
			uniqueCharacters = [];

		arrayOfChars.forEach(function(char) {
			if (!~uniqueCharacters.indexOf(char)) {
				uniqueCharacters.push(char);
			} else {
				throw Error("You must use unique characters.");
			}
		});
		Base85.indexLength = arrayOfChars.length;
		Base85.characterSet = arrayOfChars;
	};

	Base85.setCharacterSet(DEFAULT_CHARACTER_SET);
	return Base85;
}({}));
