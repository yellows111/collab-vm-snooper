# collab-vm-snooper

Snoop a WebSocket address for online VMs running collab-vm-server. (1.x, currently up to the current test/1.3.0 branches, *may* change soon)

## Requires:
Node.js 10 (via dependancy on `ws`)

NPM for downloading the one (1) dependancy this requires (or tar+g(un)zip from downloading the raw package)

An internet connection (Or if a part of your LAN runs collab-vm-server that'll work too)

## What else?
Probably an `npm install` and putting entires in the `mirrors.js` file.

After that just run `node .` or `node index.js` in the current directory.

If done successfully you'll get a result such as:
```
example.com:6004 | online | example | Example Node
```

## Questions

#### Will this support (cosmic's) CollabVM 2.0?
Why would you even ask that?
As of writing, no, `collab-vm-snooper` does not support CVM 2.
