/*******************************************************************************************
 * integ.js
 *
 *	Provides integrity checking capabilities.
 *
 *	Created May 2013 by Chris Rider (chris.rider81@gmail.com).
 *
 *	Notable Updates:
 *		2015.05.12 	v1	Initial creation.
 *	
 *******************************************************************************************/
var versionInfoForJavascriptFile_integ = {
	version : "1.1",
	build : "2015.05.13"
	};

/* Example usage...
	var ctx = new Checksum("fnv32", 0);		//fnv32-0 (32bit algorithm)
	ctx.updateStringly("Hello World!!");
	alert(ctx.result.toString(16));
*/

/* Define the base class */
;(function(root) {
    'use strict';
    
    var hasTyped = (function() {
        if(!('Uint8Array' in window)) {
            return false;
        }

        try {
            var a = new window.Uint8Array(10);
            a[0] = 100;
            if(a[0] === 100) {
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }());


    if(!hasTyped) {
        var Uint8Array = Int8Array = Array;
    } else {
        var Uint8Array = window.Uint8Array;
        var Int8Array  = window.Int8Array;
    }

    /**
     * Test if a certain value is of a specific type.
     * see {@link iss iss}, {@link isn isn} and {@link iso iso} for aliases
     * @param   {Mixed}   v any value of any type
     * @param   {String}  t the desired type
     * @returns {Boolean} true when v has type t
     */
    var is = function(v, t) {
        return (typeof(v) === t);
    };

    var iss = function(v) {return is(v, 'string');};
    var isn = function(v) {return is(v, 'number');};
    var iso = function(v) {return is(v, 'object');};
    var isf = function(v) {return is(v, 'function');};

    /**
     * Test if a certain value is an array
     * @param   {Mixed}   v any value of any type
     * @returns {Boolean} true when v is array
     */
    var isa = function(v) {
        return Object.prototype.toString.call(v) === "[object Array]";
    };

    /**
     * Test if a certain value is an 8-bits typed Array.
     * @param   {Mixed}   v any value of any type
     * @returns {Boolean} true when v is an 8-bit typed array (non-clamped)
     */
    var is8 = function(v) {
        return (iso(v) && (v instanceof Uint8Array || v instanceof Int8Array));
    };

    var ca = {};

    /**
     * ChecksumException thrown from Checksum constructor
     * @param {String} message exception description or message
     */
    var ChecksumException = function ChecksumException(message) {
        this.name = "ChecksumException";
        this.message = message;
    }

    /**
     * Checksum constructor, construct a checksum context initialized to be used with a specific algorithm
     * @param {String} name the name of the algorithm that will be used in all calculations within this context.
     */
    var Checksum = function Checksum(name) {
        if(typeof(name) !== "string") {
            throw new TypeError("argument #1 string expected, got " + typeof(name));
        }

        if(typeof(ca[name]) === "undefined") {
            throw new ChecksumException("unknown algorithm '" + name + "'");
        }

        this.c = new ca[name];

        if(this.c.setup) {
            this.c.setup.apply(this.c, Array.prototype.slice.call(arguments, 1));
        }

        this.result = this.c.init;
    };

    /**
     * Update the state with a string-ish value (anything will be converted to a string using toString())
     * The string is converted to an array of bytes, conform to the encoding of each character. 
     * @param {String} v an input value, preferebly a string.
     */
    Checksum.prototype.updateStringly = function(v) {
        if(!this.c.array) throw new ChecksumException("no array checksum function was set for this cipher");
        // convert the string to an array of bytes - unicode taken into account.
        this.result = this.c.array(Checksum.stringToArray(v + ''), this.result);
        return this;
    };

    /**
     * Update the state with an 8-bit typed array (Uint8Array or Int8Array)
     * @param {Array} a an array with numeric values or an ArrayBuffer.
     */
    Checksum.prototype.updateArray8Bit = function(a) {
        // if a is an ArrayBuffer, we can create our own view of it.
        if(a instanceof ArrayBuffer) {
            a = new Uint8Array(a);
        }

        if(!is8(a)) {
            throw new TypeError("argument #1 8-bit typed array expected, got " + typeof(a));
        }

        if(!this.c.array) throw new ChecksumException("no array checksum function was set for this cipher");

        this.result = this.c.array(a, this.result);
        return this;
    };

    /**
     * Update the state with a single byte
     * @param {Number} b the byte
     */
    Checksum.prototype.updateSingle = function(b) {
        if(!isn(b)) {
            throw new TypeError("argument #1 number expected, got " + typeof(b));
        }

        if(!this.c.single) throw new ChecksumException("no single checksum function was set for this cipher");

        this.result = this.c.single(b, this.result);
        return this;
    };

    /**
     * Update the state with a data object
     * @param   {Object}   o any object
     */
    Checksum.prototype.updateObject = function(o) {
        if(!iso(o)) {
            throw new TypeError("argument #1 object expected, got " + typeof(o));
        }

        return this.updateStringly(JSON.stringify(o));
    };

    /**
     * Register a new checksum algorithm to the Checksum object, which then
     * can be used to calculate checksums.
     * @param {String}   name the algorithm name
     * @param {Function} cls  the algorithm class constructor
     */
    Checksum.registerChecksum = function(name, cls) {
        if(!iss(name)) throw new TypeError("argument #1 string expected, got " + typeof(name));
        if(!isf(cls))  throw new TypeError("argument #2 function (class) expected, got " + typeof(cls));

        if(typeof(ca[name]) !== "undefined") {
            throw new ChecksumException("an other algorithm with this name has already been registered.");
        }

        ca[name] = cls;
    };

    /**
     * Retrieve a list of names of all the checksum algorithms available.
     * @returns {Array} a list of names
     */
    Checksum.getChecksumList = function() {
        var list = [];
        for(var i in ca) {
            if(ca.hasOwnProperty(i)) {
                list.push(i);
            }
        }

        return list;
    };
    
    /**
     * Convert a unicode or ascii string to an array.
     * http://stackoverflow.com/a/18729931/2047576 - amazing code found here
     * @param {String} str the string to be split into an array
     * @returns {Array} a list of characters
     */
    Checksum.stringToArray = function(str) {
        var utf8 = [];
        for (var i=0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 
                          0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 
                          0x80 | ((charcode>>6) & 0x3f), 
                          0x80 | (charcode & 0x3f));
            } else { // surrogate pair
                i++;
                /**
                 * UTF-16 encodes 0x10000-0x10FFFF by
                 * subtracting 0x10000 and splitting the
                 * 20 bits of 0x0-0xFFFFF into two halves
                 */
                charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                                      | (str.charCodeAt(i) & 0x3ff))
                utf8.push(0xf0 | (charcode >>18), 
                          0x80 | ((charcode>>12) & 0x3f), 
                          0x80 | ((charcode>>6) & 0x3f), 
                          0x80 | (charcode & 0x3f));
            }
        }
        
        if(hasTyped) {
            return new Uint8Array(utf8);
        }
        
        return utf8;
    };

    root.ChecksumException = ChecksumException;
    root.Checksum = Checksum;
}(window));

/* Provides a 32-bit algorithm to the base class above */
;(function() {
    'use strict';

    if(typeof(window.Checksum) === "undefined") {
        throw "The Checksum class is required for this code.";
    }

    var prime = 0x01000193;

    /**
     * Initialize anything you want in the constructor, such as setting up a lookup
     * table of bytes. Make sure to cache your calculations, so they only have to be
     * done once.
     */
    var FNV32 = function FNV32() {
        this.init = 2166136261; // fnv-1!
    };

    /**
     * The setup method which will be called when new Checksum("fletcher", ...) is called.
     * This method is supposed to initialize the checksum cipher and to recieve parameters
     * from the constructor.
     *
     * @param {Number} mode the FNV32 mode (FNV-1 (defualt) or FNV-0)
     */
    FNV32.prototype.setup = function(mode) {
        if(mode === 0) {
            this.init = 0; // fnv-0.
        }
    };

    FNV32.prototype.array = function(a, p) {
        var len = a.length,
            fnv = p || this.init;

        for(var i = 0; i < len; i++) {
            fnv = (fnv + (((fnv << 1) + (fnv << 4) + (fnv << 7) + (fnv << 8) + (fnv << 24)) >>> 0)) ^ (a[i] & 0xff);
        }

        return fnv >>> 0;
    };

    FNV32.prototype.single = function(b, p) {
        var fnv = p || this.init;
        return ((fnv + (((fnv << 1) + (fnv << 4) + (fnv << 7) + (fnv << 8) + (fnv << 24)) >>> 0)) ^ (b & 0xff)) >>> 0;
    };

    Checksum.registerChecksum("fnv32", FNV32);
}());

/* Provides the BSD checksum algorithm to the base class above */
;(function() {
    'use strict';

    if(typeof(window.Checksum) === "undefined") {
        throw "The Checksum class is required for this code.";
    }

    /**
     * Initialize anything you want in the constructor, such as setting up a lookup
     * table of bytes. Make sure to cache your calculations, so they only have to be
     * done once.
     */
    var BSD16 = function BSD16() {
        this.init = 0;
    };

    /**
     * bsd16 for arrays, each value must be numeric and will be bound to 8-bits (Int8Array or Uint8Array works best!)
     * @param   {Array}  a input (8-bit array)
     * @param   {Number} p previous checksum state
     * @returns {Number} new checksum state
     */
    BSD16.prototype.array = function(a, p) {
        var c = p || 0, i = 0, l = a.length;
        for(; i < l; i++) c = (((((c >>> 1) + ((c & 1) << 15)) | 0) + (a[i] & 0xff)) & 0xffff) | 0;
        return c;
    };

    /**
     * bsd16 for a single value, update a checksum with a new byte
     * @param   {Number} b byte (0-255)
     * @param   {Number} p previous checksum state
     * @returns {Number} new checksum state
     */
    BSD16.prototype.single = function(b, p) {
        var c = p || 0;
        return (((((c >>> 1) + ((c & 1) << 15)) | 0) + (b & 0xff)) & 0xffff) | 0;
    };

    Checksum.registerChecksum("bsd16", BSD16);
}());