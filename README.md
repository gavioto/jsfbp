jsfbp
=====

Basic FBP implementation written in JavaScript, using Node-Fibers - https://github.com/laverdet/node-fibers .

General
---

Test cases so far:

- `fbptest1` - 3 processes:
    - `Sender`
    - `Copier`
    - `Recvr`

![JSFBP](https://github.com/jpaulm/jsfbp/blob/master/docs/JSFBP.png "Simple Test Network")

- `fbptest2` - `Sender` replaced with `Reader`
- `fbptest3` - `Sender` and `Reader` both feeding into `Copier.IN`
- `fbptest4` - `Sender` feeding `Repl` which sends 3 copies of input IP (as specified in network), each copy going to a separate element of array port `OUT`; all 3 copies then feeding into `Recvr.IN`
- `fbptest5` - Two copies of `Reader` running concurrently
- `fbptest6` - The output streams of the `Repl` (in `fbptest4`) are fed to an input array port
- `fbptest7` - Creates a deadlock condition - the status of each process is displayed
- `fbptest8` - reads text, reverses it twice and outputs it
 
Components
---

- `concat`  - concatenates all the streams that are sent to its array input port (size determined in network definition) 
- `copier`  - copies its input stream to its output stream
- `reader`  - does an asynchronous read on the file specified by its FILE IIP 
- `recvr`   - receives its incoming stream and displays the contents on the console 
- `repl`    - replicates the incoming IPs to the streams specified by an array output port (it does not handle tree structures)
- `rrmerge` - "round robin" merge 
- `sender`  - sends as many IPs to its output port as are specified by its COUNT IIP (each just contains the current count)

Install & Run
---

Install node.js - see http://nodejs.org/download/

Install node-fibers via npm: just do `npm install fibers`.

Create a folder called `jsfbp` in `node/node_modules/fibers`, and download all the JavaScript files from the JSFBP `script` directory into `jsfbp`.

This network can now be run by positioning at this directory, and entering `node fbptestx.js`, where `fbptestx` is any of the tests listed above.  If tracing is desired, change the value of the `trace` variable at the bottom of fbptest.js to `true`.

Tracing
---

Here is a sample section of the trace output for `fbptest8.js`:
```
Reverse2 recv from Reverse2.IN
Reverse2 recv OK:
 deificeps era snoitcennoc eht erehw ,gnissap egassem yb snoitcennoc denifederp
Reverse2 send to Reverse2.OUT: predefined connections by message passing, where
the connections are specified
Recvr recv OK: applications as networks of "black box" processes, which exchange
 data across
data: applications as networks of "black box" processes, which exchange data acr
oss
Recvr recv from Recvr.IN
Reverse2 send OK
Reverse2 recv from Reverse2.IN
Reverse2 recv OK:
 ylsseldne detcennocer eb nac sessecorp xob kcalb esehT .sessecorp eht ot yllanr
etxe
Reverse2 send to Reverse2.OUT: externally to the processes. These black box proc
esses can be reconnected endlessly
Recvr recv OK: predefined connections by message passing, where the connections
are specified
```

Performance
---

This first test case (Jan. 16, 2015) with 2000 IPs running through three processes takes 200 ms, giving approx. 50 microsecs per send/receive pair.  

