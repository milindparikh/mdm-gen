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

client.hlen("MDM_GEN:LOOKUP:BASE:binned-us-counties-by-population", function (err, value) {
    randomCountyPtr = ~~random(1, value);
    client.hget ("MDM_GEN:LOOKUP:BASE:binned-us-counties-by-population", randomCountyPtr, function (err2, county) {
	client.llen ("MDM_GEN:LIST:BASE:us-county-state-zipcode:"+county, function (err3, numberofzips) {
	    randomZipCodePtr = ~~random(0, numberofzips-1);
	    client.lindex ("MDM_GEN:LIST:BASE:us-county-state-zipcode:"+county, randomZipCodePtr, function (err4, zipcode) {
		console.log (county);
		console.log (zipcode);
		client.quit();
	    })
	})
    })
});

function random (low, high) {
    return Math.random() * (high - low) + low;
}
