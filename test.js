async = require("async");

var val = null;

function foo(param) {
    function emitFunction(param) {
	
	if (param == 1) {
	    return function (callback) {
		var _param = param;
		console.log("called special function with stuff " + _param);
		return callback (null, true);
	    };
	}
	else {
	    return function (callback) {
		var _param = param*param;
		console.log("called special function with stuff " + _param);
		return callback (null, true);
	    };
	}	    
    }
   return  emitFunction(param);
}


var a = foo(1);
var b = foo(2);


var c = [a,b];
var d = [];
c.forEach(function (item) {
    d.push(item);
});


async.series(d,  function (err, result) {
    console.log("cool");
});



		
