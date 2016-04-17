var fs = require('fs');
var uuid = require('node-uuid');
var faker = require('faker');

var redis = require("redis"),
    client = redis.createClient();

async = require("async");

var limit = 1;

if (process.argv[3]) {
    limit = process.argv[3];
}






fs.readFile(process.argv[2], 'utf8', function (err, data) {

    var paths;
    
    if (err) throw err;
    tree = JSON.parse(data);
    paths = tree.paths;
    entities = tree.entities;
    var startPath = "/";
    var countSoFar = 0;
    
    function processEachUberCount () {
	countSoFar ++ ;
	if (countSoFar = limit) {
	    client.quit();
	}
    }
    
    for (uberCount = 0; uberCount < limit; uberCount++ ) {

	var obj = {};
	var baseObject;
	
	var dispFuncs = {"name.firstName":
			 function (item, doneCallback, obj) {
			     var firstName = faker.name.firstName();
			     obj[item] = firstName;
			     return doneCallback(null, firstName);
			 },
			 "name.lastName":
			 function (item, doneCallback, obj) {
			     var lastName = faker.name.lastName();
			     obj[item] = lastName;
			     return doneCallback(null, lastName);
			 },
			 "address.streetAddress":
			 function (item, doneCallback, obj) {
			     var streetAddress = faker.address.streetAddress();
			     obj[item] = streetAddress;
			     return doneCallback(null, streetAddress );
			 },
			 "address.zipCode":
			 function (item, doneCallback, obj) {
			     var zipCode = faker.address.zipCode();
			     obj[item] = zipCode;
			     return doneCallback(null, zipCode);
			 },
			 "company.companyName":
			 function (item, doneCallback, obj) {
			     var companyName = faker.company.companyName();
			     obj[item] = companyName;
			     return doneCallback(null, companyName);
			 },
			 "notimplemented":
			 function (item, doneCallback, obj) {
			     obj[item] = "not implemented";
			     return doneCallback(null, companyName);
			 },

			 
			 "async.lookup":
			 function (item, doneCallback, obj) {
			     client.get("abc", function (err, val) {
				 obj[item] = val;
				 return doneCallback(null, val);
			     });
			     
			 },
			 

			 "address.stateForZipCode":
			 function (item, doneCallback, obj, zipcode) {
			     obj[item] = zipCode;
			     return doneCallback(null, zipCode);
			 },

			 "random.valueFromRange":
			 function(item, doneCallback, obj, range) {
			     var value;
			     if (range) {
				 var index = ~~random(0, range.length) ;
				 value = range[index];
			     }
			     obj[item] = value;
			     return doneCallback(null, value);
			 },

			 "testRangeIndex":
			 function(item, doneCallback, obj, range) {
			     var value = range[range[0]];
			     obj[item] = value;
			     return doneCallback(null, value);
			 },
			 "random.integerInRange":
			 function(item, doneCallback, obj, range) {
			     
			     var number = 0;
			     var max = 0;
			     var min = 0;
			     
			     if (range) {
				 if (range.length == 1 ) {
				     
				     max = parseInt(range[0]);
				 }
				 else {
				     if (range.length == 2) {
					 min = parseInt(range[0]);
					 max = parseInt(range[1]);
				     }
				 }
			     }
			     
			     if (min == max) {
				 number = min;
			     }
			     else {
				 number = random(min, max);
			     }
			     
			     obj[item] = ~~number;
			     return doneCallback(null, number);
			 },
			 
			 "random.number":
			 function(item, doneCallback, obj) {
			     var number = faker.random.number();
			     obj[item] = number;
			     return doneCallback(null, number);
			 },
			 "random.uuid":
			 function(item, doneCallback, obj) {
			     var uuid = faker.random.uuid();
			     obj[item] = uuid;
 			     return doneCallback(null, uuid);
			 },

			 "random.word":
			 function(item, doneCallback, obj) {
			     var word = faker.random.word();
			     obj[item] = word;
 			     return doneCallback(null, word);
			 },
			 
			 "self":
			 function (item, doneCallback, obj, arg) {
			     obj[item] = arg;
			     return doneCallback(null, arg);

			 }
			};

	function done(level, obj) {
	    if (level == 1) {

		var cpyObject = {};
		cpyObject[paths[0]["entityName"]] = obj;
		


		transformToES(cpyObject[paths[0]["entityName"]], {}, 0);
		processEachUberCount ();
		
	    }
	    if (level == 0) {
		//	    Object.keys(obj).forEach (function (key) {



//		client.quit();
		//		transformToES(obj[key], {}, 0);
		//	    });
		
	    }
	}


	function doneTransformToES (newObj, level) {
	    if (level == 0) {
		console.log(JSON.stringify(newObj));

	    }
	}
	
	

	function transformToES (obj, newObj, level) {


	    if (level != 0) {
		newObj.push({});
		newObj = newObj[newObj.length -1];
	    }
	    
	    Object.keys(obj[0]).forEach (function (key) {
		if (key == "id") {
		}
		else {
		    newObj[key] = obj[0][key];
		}
	    });

	    var groupObjs = {};
	    
	    for (var cnt = 1; cnt < obj.length; cnt++) {
		Object.keys(obj[cnt]).forEach (function (key) {
		    groupObjs[key] = 1;
		});
	    }

	    Object.keys(groupObjs).forEach (function (key) {
		for (var cnt = 1; cnt < obj.length; cnt++) {
	            if (obj[cnt][key]) {
			if (newObj[key]) {
			    transformToES (obj[cnt][key], newObj[key], level+1);
			}
			else {
			    newObj[key] = [];
			    transformToES (obj[cnt][key], newObj[key], level+1);
			}
			
		    }
		}
	    });

	    doneTransformToES(newObj, level);
	    
	}
	
	

	function buildObj(loc, path, whendone, level, execPath) {

	    var processedPaths = 0;

	    function pushExecPath(loc, path, whendone, level, execPath, entityName, id, doneCallbackz) {
		var newExecPath = execPath.slice();
		
		newExecPath.push(entityName);
		newExecPath.push(id);
		
		buildObj(loc, path, whendone, level, newExecPath);
		return doneCallbackz(null, true);
	    }
	    
	    
	    if (path === "/") {

		var processChild = function (item, doneCallback2) {

		    if (item.path === path) {
			var entityName = item.entityName;
			loc[entityName] = [];
			var id = uuid.v4();
			loc[entityName].push ({"id": id });
			
			var processEntity = function (item2, doneCallback3) {
			    if (item2.entity == entityName) {
				generateEntity(entityName,item2.fields, loc[entityName][0], obj, execPath, doneCallback3);
			    }
			    else {
			        return doneCallback3(null, true);
			    }
			}
			async.map(entities, processEntity,
				  function (e, r) {

				      pushExecPath(loc[entityName], "/"+entityName, whendone, level+1, execPath, entityName, id, doneCallback2);
				      
				  });
		    }
		    else {
			return doneCallback2(null, true);
		    }
		}
		async.map(paths, processChild,
			  function (e, r) {
			      whendone(level, loc);
			  });
	    }
	    else {


		var processChild2 = function (item, doneCallback9) {

		    
		    if (item.path === path) {

			var entityName = item.entityName;

			var min = item.min;
			var max = item.max;
			var diff = 0;
			
			if (min == max) {
			    diff = min;
			}
			else {
			    diff = random(min, max);
			}

			var arry = Array(diff);
			
			
			var processIter = function (item, doneCallback) {
			    var newobj = {};
			    newobj[entityName] = [];
			    
			    var id = uuid.v4();
			    newobj[entityName].push ({"id": id });

			    
			    var processEntity = function (item, doneCallback5) {
				if (item.entity == entityName) {
				    generateEntity(entityName,item.fields, newobj[entityName][0], obj, execPath, doneCallback5);
				}
				else {
			            return doneCallback5(null, true);
				}
			    }

			    async.map(entities, processEntity,
				      function (e, r) {

					  loc.push(newobj);
					  //				      console.log(JSON.stringify(loc));
					  pushExecPath(newobj[entityName], path+"/"+entityName, whendone, level+1, execPath, entityName, id, doneCallback);

				      });

			}

			async.map(arry, processIter, function (e,r) {
			    //			console.log("ok");

			    return doneCallback9(null, true);
			});

		    }
		    else {
			return doneCallback9(null, true);
		    }
		}


		async.map(paths, processChild2,
			  function (e, r) {
			      //	  console.log(level);
			      //	  console.log(loc);
			      whendone(level, loc);
			  });
		

		
	    }
	    
	}
	


	function generateEntity(entityName, fields, obj, curObj, execPath, doneCallbackx) {
	    var execDispFunc = function (item, doneCallback) {
		var regexFunctionName = /(.*)\((.*)\)/;
		var realFunctionName = item.fieldFunction.match(regexFunctionName)[1];
		var refFunctionArg = item.fieldFunction.match(regexFunctionName)[2];
		var realFunctionArg = null;
		var regexArray = /\[(.*)\]/;
		

		function argRefToValue (refFunctionArg) {
		    var realFunctionArg2 = null;
		    if (refFunctionArg != "") {
			var regexFunctionArgThis = /this\.(.*)/;
			var regexFunctionArgPath = /^\./;
			if (refFunctionArg.match(regexFunctionArgThis)) {
			    realFunctionArg2 = refFunctionArg.match(regexFunctionArgThis)[1];
			    return ( obj[realFunctionArg2]);
			}
			else {
			    if (refFunctionArg.match(regexFunctionArgPath)) {
				var loc = curObj[execPath[0]];
				var regexAttrib = /.*\/(.*)$/;
				var regexCountIndirection = /\.\./g;
				var extractAttrib = refFunctionArg.match(regexAttrib)[1];
				var countIndirection = ( refFunctionArg.match(regexCountIndirection) || []).length;
				countIndirection = (countIndirection - 1) * 2;
				
				for (var cnt = 2; cnt < execPath.length - countIndirection; cnt+=2) {
				    var entity = execPath[cnt];
				    var entityId = execPath[cnt+1];
				    for (var cnt2 = 1; cnt2 < loc.length; cnt2++) {
					if (entityId == loc[cnt2][entity][0]["id"] ) {
					    loc = loc[cnt2][entity];
					}
				    }
				}
				return( loc[0][extractAttrib]);
			    }
			    else {
				return refFunctionArg;
			    }
			}
		    }
		    else {
			return null
		    }
		}
		


		if (refFunctionArg.match(regexArray) ) {
		    var rawArray = refFunctionArg.match(regexArray)[1];
		    realFunctionArg = rawArray.split(",").map (function (obj) {
			return argRefToValue(obj);
		    });
		}
		else {
		    realFunctionArg = argRefToValue(refFunctionArg);
		}

		
		if (realFunctionName in dispFuncs) {
		    if (realFunctionArg) {
			return dispFuncs[realFunctionName](item.field, doneCallback, obj, realFunctionArg);
		    }
		    else {
			return dispFuncs[realFunctionName](item.field, doneCallback, obj);
		    }
		}
		else {
		    return dispFuncs["notimplemented"](item.field, doneCallback, obj);
		}
	    }
	    async.map(fields, execDispFunc, function (e, r) {
		return doneCallbackx(null, true);
	    });
	}

	Array.prototype.subarray=function(start,end){
	    if(!end){ end=-1;} 
	    return this.slice(start, this.length+1-(end*-1));
	}
	
	function random (low, high) {
	    return Math.random() * (high - low) + low;
	}

	buildObj(obj, startPath, done, 0, []) ;

    }
});
