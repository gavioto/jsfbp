// testsubstreamsensitivesplitting.js

var fbp = require('..');

// this network is to test interaction between lbal (Load balancer) and substreams - 
// the substreams may be rearranged, but within a substreams the IPs must preserve their 
// number and sequence 

// Warning: given the small connection sizes, this network should deadlock - see comment in javafbp, but
// for some reason, this isn't happening - more research needs to take place!

// --- define network ---
var network = new fbp.Network();

var genss = network.defProc('./examples/components/genss.js');
var lbal = network.defProc('./components/lbal.js');
var passthru0  = network.defProc('./components/delay.js', 'passthru0');
var passthru1  = network.defProc('./components/delay.js', 'passthru1');
var passthru2  = network.defProc('./components/delay.js', 'passthru2');



var makeMergeSubstreamSensitive = true;

network.initialize(genss, 'COUNT', '100');
network.connect(genss, 'OUT', lbal, 'IN', 10);
network.initialize(passthru0, 'INTVL', '400');
network.connect(lbal, 'OUT[0]', passthru0, 'IN', 1);
network.initialize(passthru1, 'INTVL', '400');
network.connect(lbal, 'OUT[1]', passthru1, 'IN', 1);
network.initialize(passthru2, 'INTVL', '400');
network.connect(lbal, 'OUT[2]', passthru2, 'IN', 1);

/*
 * 3 passthru's feeding one port -> pretty mixed up data
 */  
if (!makeMergeSubstreamSensitive) {
	var recvr  = network.defProc('./components/recvr.js');
      network.connect(passthru0, 'OUT', recvr, 'IN', 1);
      network.connect(passthru1, 'OUT', recvr, 'IN', 1);
      network.connect(passthru2, 'OUT', recvr, 'IN', 1);
}
else {
	
/* using substreamsensitivemerge
 *  
 */	
	  
	  var recvr  = network.defProc('./components/recvr.js');
	  var ssmerge  = network.defProc('./components/substreamsensitivemerge.js');
	  //var discard  = network.defProc('./components/discard.js');
	  var csws = network.defProc('./examples/components/checksequencewithinsubstreams.js');
	  
	  network.connect(passthru0, 'OUT', ssmerge, 'IN[0]', 1);
	  network.connect(passthru1, 'OUT', ssmerge, 'IN[1]', 1);
	  network.connect(passthru2, 'OUT', ssmerge, 'IN[2]', 1);	
	  network.connect(ssmerge, 'OUT', csws, 'IN');	
	  network.connect(csws, 'OUT', recvr, 'IN');
	  
}



// --- run ---
var fiberRuntime = new fbp.FiberRuntime();
network.run(fiberRuntime, { trace: false });