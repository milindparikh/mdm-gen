var fs = require('fs');
var uuid = require('node-uuid');
var faker = require('faker');
var moment = require('moment');
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
    optional = tree.optional;
    
    var startPath = "/";
    var countSoFar = 0;
    var delay = 0;
    var md_type = "normal";
    var event_start = "now";
    var event_end = null;
    var event_interval = "1";
    var event_interval_type = "seconds";
    var momentintime = new moment();
    var momentstarttime = null;
    var momentendtime = null;
    var glbObj = {};
    var    intervalId; 
    

    if (optional) {
	optional.forEach (function (key) {
	    if (key['event-generation-interval-in-milliseconds']) {
		delay = key['event-generation-interval-in-milliseconds'];
	    }
	    if (key['event-start']) {
		event_start = key['event-start'];
	    }
	    if (key['event-end']) {
		event_end = key['event-end'];
	    }
	    if (key['event-interval-type']) {
		event_interval_type = key['event-interval-type'];
	    }

	    if (key['event-interval']) {
		event_interval = key['event-interval'];
	    }
	});
    }

    if (event_start == 'now') {
	momentintime = new moment();
	momentstarttime = new moment(momentintime);
	
    }
    else {
	momentintime = new moment(event_start);
	momentstarttime = new moment(momentintime);
    }

    glbObj['momentintime'] = momentintime;
    glbObj['uberCount'] = 0;


    if (event_end) {
	momentendtime = new moment(event_end);
    }

    
    function processEachUberCount () {
	countSoFar ++ ;
	glbObj['momentintime'].add(event_interval, event_interval_type);
	glbObj['uberCount'] = countSoFar;
	
	if (countSoFar == limit) {
	    clearInterval(intervalId);
	    client.quit();
	}
    }



	
    intervalId = setInterval (function() {
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

			 "address.randomuszipcode":
			 function (item, doneCallback, obj) {
			     client.llen("MDM_GEN:LIST:BASE:us-zipcode", function (err, numberOfZips) {
				 if (err)  {
				     obj[item] = "A";
				     return doneCallback(null, "null");
				 }
				 else {
				     rz = ~~random(1, numberOfZips);
				     client.lindex ("MDM_GEN:LIST:BASE:us-zipcode", rz, function (err2, uszipcode) {
					 if (err2){
					     obj[item] = "B";
					     return doneCallback(null, "null");
					 }
					 else {
					     obj[item] = uszipcode;
					     return doneCallback(null, uszipcode);
					 }
				     });
				 }
			     });
			 },


			 "address.randomusstate":
			 function (item, doneCallback, obj) {
			     client.llen("MDM_GEN:LIST:BASE:us-state", function (err, numberOfStates) {
				 if (err)  {
				     obj[item] = "A";
				     return doneCallback(null, "null");
				 }
				 else {
				     rs = ~~random(1, numberOfStates);

				     
				     client.lindex ("MDM_GEN:LIST:BASE:us-state", rs, function (err2, usstate) {
					 if (err2){
					     obj[item] = "B";
					     return doneCallback(null, "null");
					 }
					 else {
					     obj[item] = usstate;
					     return doneCallback(null, usstate);
					 }
				     });
				 }
			     });
			 },

			 "address.randomuszipcodeforstate":
			 function (item, doneCallback, obj, usstate) {
			     client.llen("MDM_GEN:LIST:BASE:us-state-zipcode:"+usstate, function (err, numberOfZips) {
				 if (err)  {
				     obj[item] = "A";
				     return doneCallback(null, "null");
				 }
				 else {
				     rz = ~~random(1, numberOfZips);

				     
				     client.lindex ("MDM_GEN:LIST:BASE:us-state-zipcode:"+usstate, rz, function (err2, uszipcode) {
					 if (err2){
					     obj[item] = "B";
					     return doneCallback(null, "null");
					 }
					 else {
					     obj[item] = uszipcode;
					     return doneCallback(null, uszipcode);
					 }
				     });
				 }
			     });
			 },



			 
			 
			 "address.uscityforzipcode":
			 function (item, doneCallback, obj, uszipcode) {
			     client.hget("MDM_GEN:LOOKUP:BASE:us-zipcode-city", uszipcode, function (err, uscity) {
				 if (err) return doneCallback(null, null);				    
				 obj[item] = uscity;
				 return doneCallback(null, uscity);				     
			     });
			     
			 },
			 

			 "address.usstateforzipcode":
			 function (item, doneCallback, obj, uszipcode) {
			     client.hget("MDM_GEN:LOOKUP:BASE:us-zipcode-state", uszipcode, function (err, usstate) {
				 if (err) return doneCallback(null, null);				    
				 obj[item] = usstate;
				 return doneCallback(null, usstate);				     
			     });
			     
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
			     return doneCallback(null, "notimplemented");
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

			 },
			 "globaltime":
			 function (item, doneCallback, obj, arg) {
			     obj[item] = glbObj['momentintime'].format(arg);
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
			    diff = ~~random(min, max);
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
	    var execDispFunc = function (pitem) {

		return function (doneCallback) {
		    var item = pitem
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
	    }
	    var functionsForFields = [];
	    
	    fields.forEach (function (field) {
		functionsForFields.push(execDispFunc(field));
	    });


	    async.series (functionsForFields, function (e, r) {
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


	if (countSoFar < limit) {
	    buildObj(obj, startPath, done, 0, []) ;
	}
    }, delay);


});
