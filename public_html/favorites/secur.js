/*******************************************************************************************
 * integ.js
 *
 *	Provides security capabilities.
 *
 *	Created May 2013 by Chris Rider (chris.rider81@gmail.com).
 *
 *	Notable Updates:
 *		2015.05.12 	v1	Initial creation.
 *	
 *******************************************************************************************/
var versionInfoForJavascriptFile_secur = {
	version : "1.0",
	build : "2015.05.13"
	};
	

/* Vigenère cipher */
function vig_isUppercase(c) {
    return c >= 65 && c <= 90;  // 65 is the character code for 'A'. 90 is for 'Z'.
}
function vig_isLowercase(c) {
    return c >= 97 && c <= 122;  // 97 is the character code for 'a'. 122 is for 'z'.
}
function vig_convertKey(key) {
	var result = [];
	function isLetter(c) {
		return vig_isUppercase(c) || vig_isLowercase(c);
	}
	for(var i=0; i<key.length; i++) {
		var c = key.charCodeAt(i);
		if(isLetter(c)) {
			result.push((c - 65) % 32);
		}
	}
	return result;
}
function vig_crypt(input, obj_key) {
	var output = "";
	var j = 0;
	for(var i=0; i<input.length; i++) {
		var c = input.charCodeAt(i);
		if(vig_isUppercase(c)) {
			output += String.fromCharCode((c - 65 + obj_key[j % obj_key.length]) % 26 + 65);
			j++;
		} else if(vig_isLowercase(c)) {
			output += String.fromCharCode((c - 97 + obj_key[j % obj_key.length]) % 26 + 97);
			j++;
		} else {
			output += input.charAt(i);
		}
	}
	return output;
}
function vig_decrypt(input, obj_key) {
	for(var i=0; i<obj_key.length; i++) {
		obj_key[i] = (26 - obj_key[i]) % 26;
	}
	return vig_crypt(input, obj_key);
}