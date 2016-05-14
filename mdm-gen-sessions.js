/*
Copyright [2016] [Milind Parikh]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
  
*/

// Few things
// 

var uuid = require('node-uuid');

var redis = require("redis"),
    client = redis.createClient();
var moment = require('moment');

//  create -- create sessionId
//  list -- list all sessions
// delete -- delete session id

var command = "list";
var param1 = null;
var param2 = null;
var param3 = null;


if (process.argv[2]) {
    command = process.argv[2];
}

if (process.argv[3]) {
    param1 = process.argv[3];
}
if (process.argv[4]) {
    param2 = process.argv[4];
}
if (process.argv[5]) {
    param3 = process.argv[5];
}


if (command == "list") {
    client.llen("MDM_GEN:LIST:SESSIONS", function (err, noOfSessions) {
	if (!err) {
	    for (var cnt = 0; cnt < noOfSessions; cnt++) {
		client.lindex("MDM_GEN:LIST:SESSIONS", cnt, function (err2, sessionId) {
		    if (!err) {
			client.hget("MDM_GEN:LOOKUP:SESSION:"+sessionId+":METADATA", "DATE_CREATED", function (err3, dateCreated) {
			    if (!err3) {
				client.hkeys("MDM_GEN:LOOKUP:SESSION:"+sessionId+":ATTRIBUTES", function (err4, attribs) {
				    console.log(sessionId+"   -->  " + dateCreated);
				    console.log("     "+ attribs);
				    console.log("");
				    
				    attribs.forEach(function (key) {
					client.llen("MDM_GEN:LIST:SESSION:"+sessionId+":"+key, function (err, retVal) {
					    console.log(sessionId+"-->         count("+key+") = "+retVal);
					});
				    });
				});
			    }
			});
		    }
		});
	    }
	}
    });
}


if (command == "create") {

    var i = uuid.v4();
    var regExpShort = /([\d\w]*)-.*/;
    var sessionId = i.match(regExpShort)[1];
    
    
    client.rpush("MDM_GEN:LIST:SESSIONS", sessionId, function (err, retVal) {
	if (!err) {
	    
	    var momentintime = new moment();

	    client.hset("MDM_GEN:LOOKUP:SESSION:"+sessionId+":METADATA", "DATE_CREATED",  momentintime.format("YYYY-MM-DDTHH:mm:ss"), function (err2, retVal) {
		if (!err2) {
		    console.log("ok");
		}
	    });
	}
    });
    
}

if (command == "createdefault") {

    var sessionId = "default";
    client.rpush("MDM_GEN:LIST:SESSIONS", sessionId, function (err, retVal) {
	if (!err) {
	    var momentintime = new moment();
	    client.hset("MDM_GEN:LOOKUP:SESSION:"+sessionId+":METADATA", "DATE_CREATED",  momentintime.format("YYYY-MM-DDTHH:mm:ss"), function (err2, retVal) {
		if (!err2) {
		    console.log("ok");
		    client.quit();
		}
	    });
	}
    });
}

if (command == "clear") {
    if (param1) {
	client.hkeys("MDM_GEN:LOOKUP:SESSION:"+param1+":ATTRIBUTES", function (err, attribs) {
	    var count = 0;
	    function addListDelete() {
		count++;
		if (count == attribs.length) {
		    client.del("MDM_GEN:LOOKUP:SESSION:"+param1+":ATTRIBUTES", function (err, retVal2) {
			console.log("ok");
			client.quit();
		    });
		}
	    }
	    attribs.forEach(function (attrib) {
		client.del("MDM_GEN:LIST:SESSION:"+param1+":"+attrib, function (err2, retVal) {
		    addListDelete();
		});
	    });
	});
    }
    else {
	console.log("Usage: mdm-gen-sessions.js clear <sessionId>");
    }
}



if (command == "delete") {
    if (param1) {
	client.hkeys("MDM_GEN:LOOKUP:SESSION:"+param1+":ATTRIBUTES", function (err, attribs) {
	    var count = 0;
	    function addListDelete() {
		count++;
		if (count == attribs.length) {
		    client.del("MDM_GEN:LOOKUP:SESSION:"+param1+":ATTRIBUTES", function (err, retVal2) {
			client.hdel("MDM_GEN:LOOKUP:SESSION:"+param1+":METADATA", "DATE_CREATED", function (err, retVal) {
			    if (!err) {
				client.lrem("MDM_GEN:LIST:SESSIONS", 1, param1, function (err, retVal) {
				    if (!err) {
					console.log("ok");
				    }
				});
			    }
			});
		    });
		}
	    }


	    
	    attribs.forEach(function (attrib) {
		client.del("MDM_GEN:LIST:SESSION:"+param1+":"+attrib, function (err2, retVal) {
		    addListDelete();
		});
	    });
	});
    }
    else {
	console.log("Usage: mdm-gen-sessions.js delete <sessionId>");
    }
}



if (command == "_push" ) {
    if (param1) {
	if (param2) {
	    if (param3) {
		client.hset("MDM_GEN:LOOKUP:SESSION:"+param1+":ATTRIBUTES",  param2, "1", function (err, retV1) {
		    if (!err) {
			client.rpush("MDM_GEN:LIST:SESSION:"+param1+":"+param2, param3, function (err2, retV2) {
			    console.log("ok");
			});
		    }
		});
	    }
	    else {
		console.log("Usage: mdm-gen-sessions.js _push <sessionId> <attrib> <value>");
	    }
	}
	else {
	    console.log("Usage: mdm-gen-sessions.js _push <sessionId> <attrib> <value>");
	}
    }
    else {
	console.log("Usage: mdm-gen-sessions.js _push <sessionId> <attrib> <value>");
    }
}

if (command == "_getrandom" ) {
    if (param1) {
	if (param2) {
	    client.llen("MDM_GEN:LIST:SESSION:"+param1+":"+param2, function (err, len) {
		var number = ~~random(0, len);
		client.lindex("MDM_GEN:LIST:SESSION:"+param1+":"+param2, number, function (err2, item) {
		    console.log(item);
		});
	    });
	}
	else {
	    console.log("Usage: mdm-gen-sessions.js _getrandom <sessionId> <attrib>");
	}
    }
    else {
	console.log("Usage: mdm-gen-sessions.js _getrandom <sessionId> <attrib>");
    }
}

if (command == "listvalues" ) {
    if (param1) {
	if (param2) {
	    client.llen("MDM_GEN:LIST:SESSION:"+param1+":"+param2, function (err, len) {
		for (var number = 0; number < len; number++) {
		    
		    client.lindex("MDM_GEN:LIST:SESSION:"+param1+":"+param2, number, function (err2, item) {
			console.log(item);
		    });
		}
	    });
	}
	else {
	    console.log("Usage: mdm-gen-sessions.js listvalues <sessionId> <attrib>");
	}
    }
    else {
	console.log("Usage: mdm-gen-sessions.js listvalues <sessionId> <attrib>");
    }
}





function random (low, high) {
    return Math.random() * (high - low) + low;
}
