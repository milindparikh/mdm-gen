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
