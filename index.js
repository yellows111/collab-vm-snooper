const websocket = require('ws');
const gu = require("./guacutils.js");
var mirrors;
try {
	mirrors = require("./mirrors.js");
} catch(e) {
	console.error("You do not have a mirrors.js file containing CollabVM Host IPs.\nAn example of this can be found in the \"mirrors.default.js\" file.");
	mirrors = require("./mirrors.default.js");
}
const options = {
	showOnline: true, // Parse online VMs/hosts
	showOffline: true, // Parse offline VMs/hosts
	showInvalid: true, // Parse invalid websockets/hosts
	splitLessThan: true // Split at <'s for names to prevent long strings
}
Object.values(mirrors).forEach(type => (type.forEach(vmip => { //Not only is this disgusting, it's worse than you'd think
const wss = vmip.startsWith("!") ? "wss://" : "ws://";
if (wss == "wss://") {
vmip = vmip.split('!')[1];
}
const ws = new websocket(wss+vmip, "guacamole", {origin: "computernewb.com", headers: {"User-Agent": "Mozilla/5.0 (collab-vm-snooper; yellows111; x86_64)"} });
ws.on('error', function(err) {
msg = err.message;
if (msg.startsWith("Unexpected server response") == 1) {
	if (options.showInvalid == false) {return}
	code = msg.split(": ")[1];
	parse([vmip, "invalid", "EUNEXPECTEDRESPONSE", code]);
} else {
if (options.showOffline == false) {return}
parse([vmip, "offline", err.code, err.errno])
}});
ws.on('open', function() {
	if (options.showOnline == false) {ws.close();return}
	ws.send("4.list;");
	ws.on('message', function(message) {
		smessage = message.toString();
		if (smessage === "3.nop;") {
		ws.close();
		return;
		}
		args = (gu.decodeResponse(smessage));
		if (args[0] != "list") {
			return;
		}
		if (smessage == "4.list;") {
			parse([vmip, "online", "This IP has no nodes.", ""]);
		}
		for (let i = 1; i < args.length; i += 3) {
			const name = options.splitLessThan ? args[i+1].split('<')[0] : args[i+1];
			parse([vmip, "online", args[i], name]);
		}
	});
})
})));
function parse(i) {
s = " | ";
console.log(i[0]+s+i[1]+s+i[2]+s+i[3])
}