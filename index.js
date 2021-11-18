const websocket = require('ws');
const gu = require("./guacutils.js");
const mirrors = {
	mainvms:[], // put main vms here
	uservms:[], // put current user-vm additionalNodes here
	externalvms:[] // put any third party collab-vm instances (not on main or user) here
}
const options = {
	showOnline: true, // Parse online VMs/hosts
	showOffline: true, // Parse offline VMs/hosts
	showInvalid: true // Parse invalid websockets/hosts
}
Object.values(mirrors).forEach(type => (type.forEach(vmip => { //Not only is this disgusting, it's worse than you'd think
const ws = new websocket("ws://"+vmip, "guacamole", {origin: "computernewb.com"});
ws.on('error', function(err) {
msg = err.message;
if (msg.startsWith("Unexpected server response") == 1) {
	if (options.showInvalid == false) {return}
	code = msg.split(": ")[1];
	parse([vmip, "invalid", "EUNEXPECTEDRESPONSE", code]);
} else {
if (options.showOffline == false) {return}
parse([vmip, "offline", err.code])
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
		if (args[0] !== "list") {
			return;
		}
		for (let i = 1; i < args.length; i += 3) {
			parse([vmip, "online", args[i], args[i+1]]);
		}
	});
})
})));
function parse(i) {
s = " | ";
console.log(i[0]+s+i[1]+s+i[2]/*+s+i[3]*/)
}