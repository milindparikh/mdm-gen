var redis = require("redis"),
    client = redis.createClient();



var prefix = "MDM_GEN:LOOKUP";

var lookUpTables = {
    "CLASS_TO_RANK":
    {
	"A": 1,
	"B": 2,
	"C": 3
    }
}



if (process.argv[3]) {
    if (lookUpTables[process.argv[3]]) {
	var totalKey = prefix+":"+process.argv[3];

	
	if (process.argv[2] == "CREATE")  {
	    
	    obj = lookUpTables[process.argv[3]];
	    var numkeys = Object.keys(obj).length;
	    var totalKeysSoFar = 0;

	    function processedKeys() {
		totalKeysSoFar++;
		if (totalKeysSoFar == numkeys) {
		    client.quit();
		}
	    }

	    Object.keys(obj).forEach(function(field) {
		var value = obj[field];

		
		client.hset(totalKey, field, value, function (err, value) {
		    processedKeys();
		});
		   
	    });
	}
	else {
	    if (process.argv[2] == "LIST") {

		
		client.hgetall(totalKey, function (err, value){
		    console.log(value);
		    client.quit();
		});
		
	    }
	    else {
		if (process.argv[2] == "DELETE") {
		    client.hkeys(totalKey, function (err, hshKeys) {
			var numkeys = Object.keys(hshKeys).length;
			var totalKeysSoFar = 0;
			function processedKeys() {
			    totalKeysSoFar++;
			    if (totalKeysSoFar == numkeys) {
				client.quit();
			    }
			}
		
			
			Object.keys(hshKeys).forEach( function (field) {
//			    console.log("Now deleting " + hshKeys[field] + " in " + totalKey);
			    
			    client.hdel(totalKey, hshKeys[field], function (err, value) {
				console.log(err);
				console.log(value);
				
				processedKeys();
			    });
			});
		    });
		}
		else {
		    client.quit();
		}
	    }
	}
    }
    else {
	client.quit();
    }
    
}
