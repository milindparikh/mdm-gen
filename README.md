# mdm-gen
Master Data Generator -- Nestable, Customizable and Scalable

mdm-gen is the result of years of frustration in not being able to experience data in the user context. 

Every user has a different story.

      Why shoud the variety of data be a limiting factor (minus doing a six month POC)?
      
      Why should that variety not be realistic ?
      
        For example,
	
          If the random zipcode (94086) is randonly chosen, why should the state not be automatically be California?

	  If I choose a state of California, why shouldnt all the zipcodes randomly generated under that state be in California?
	  
          Why, when I create a stream of events, should those events be not directly relatable to the Master Data?
	
      Why shouldn't that variety be extensible ?
      
	  Why can I not provide a simple cut-n-paste functionality that would enable thousands of users experience their data their way?
	
          Even if I cannot imagine all the variety of data being generated,
	
          Why shouldn't the plumbing be provided so that to extend the porcelin to account for that variety?
...

If this is remotely interesting, read on...

Fundamentally mdm-gen operates on a json file to produce json data. You need nodejs and redis on your Linux machine to run these examples.

HelloWorld of mdm-gen.js
       examples/helloworld/company.json
	    is likely the simplest example. (It actually has more instructions than the data it produces)

	    company.json content:
	 	      {
		          "paths": 
      		     	     [
	  		          {"path": "/", "entityName": "company"}
      			     ],
    			     "entities":
    			     [
				 {"entity": "company", "fields":
		 	  	 	    [
						{"field": "company_name", "fieldFunction": "company.companyName()"}
		 	  		    ]
		      	          }	
    			      ]
                         }
			 
             nodejs mdm-gen.js examples/helloworld/company.json
	                    produces
     	          {"company_name":"Keebler - Sipes"}

With repeatibility in mind

             nodejs mdm-gen.js examples/helloworld/company.json 3
	     	          produces
		  {"company_name":"Oberbrunner, Treutel and Hilll"}
		  {"company_name":"Crist - Hansen"}
		  {"company_name":"Orn, Bins and Wuckert"}

		  company_name is randomly generated

	     *.json is the instruction file of how to produce entities (potentially nested).
	          company.json reads like this
		  	       1. Produce a entity called company at root level ({"path":"/"})
			       2. The entity company has one field called "company_name" and is satisfied by a magic-o-function called company.companyName()
With nestability in mind

	examples/helloworld/company-with-nesting.json
	     mimked after a  file-system -- not to be taken literally
	          / --> company
		  /company --> addresss

             	  nodejs mdm-gen.js examples/helloworld/company-with-nesting.json
		  
		  company-with-nesting.json content
		  
			{
				 "paths": 
      				 	  [
						{"path": "/", "entityName": "company"},
	 					{"path": "/company", "entityName": "address", "min": 1, "max":3, "distribution": "random"}
      					  ],
    				"entities":
					  [				
					  	{"entity": "company", "fields":
		 					   [
								{"field": "company_name", "fieldFunction": "company.companyName()"}
		 					   ]
					        },
						{"entity": "address", "fields":
		 					   [
								{"field": "streetAddress", "fieldFunction": "address.streetAddress()"},
		     						{"field": "zipCode", "fieldFunction": "address.zipCode()"}
		 					   ]
						}
    					]
			}

                produces a random number (between min: 1 and max:3) of addresses for a company.

			 {
				"company_name":"Kub - Hilll",
				"address":[
						{"streetAddress":"76836 Brandt Spring","zipCode":"77377-3723"},
						{"streetAddress":"16669 Cydney Forge","zipCode":"62540-6315"}
					  ]
			}

		