'use strict';

// substreamsensitivemerge.js

var Utils = require('../core/Utils');
var IP = require('../core/IP')

module.exports = function substreamsensitivemerge() {

	var inportArray = this.openInputPortArray('IN');
	var outport = this.openOutputPort('OUT');
	var substream_level = 0;
	
	var ip;
	var elemno = -1;

	while (true) {
		if (substream_level != 0) {
			ip = inportArray[elemno].receive();
			if (ip == null)
				break;
		} else {
			while (true) {
				elemno = Utils.findInputPortElementWithData(inportArray);
				// console.log("Merge elemno:" + elemno);
				if (elemno == -1) // all elements drained
					return;
				ip = inportArray[elemno].receive();
				if (ip != null)
					break;
			}
		}

		if (ip.type == IP.OPEN)
			substream_level++;
		else if (ip.type == IP.CLOSE)
			substream_level--;

		outport.send(ip);
	}
}
