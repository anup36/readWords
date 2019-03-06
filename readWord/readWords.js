

const fs = require("fs");
const https = require("https");
const file = fs.createWriteStream("data.txt");
const request = require("request");
const _ = require("underscore");
const async = require("async");	

// create map for word counts
var wordsMap = {};
// sort by count in descending order
var finalWordsArray = [];





console.log("\n\n Hold On Reading File, We'll Get back to you \n\n");

function getFileContent(){

	https.get("https://norvig.com/big.txt", response => {

		response.on("data", function(data){
			
			/*converting buffer to string data */
			var data = data.toString('utf8');
			/*remove all spacs,tabs from an document*/
			var wordsArray = splitByWords(data);
			/*Hashmap for all the documents and number of time it's reapeated*/
			var wordsMap = createWordMap(wordsArray);
			
		});

		response.on("end", function(){
			console.log("done");
			/* get top 10 words according to occurance */
			var finalWordsArray = sortByCount(wordsMap);
			finalJson(finalWordsArray);

		});	

	});
}




function splitByWords (text) {
  // split string by spaces (including spaces, tabs, and newlines)
  var wordsArray = text.split(/\s+/);
  return wordsArray;
}


function createWordMap (wordsArray) {
  // console.log("wordsArray", wordsArray);

  wordsArray.forEach(function (key) {
    if (wordsMap.hasOwnProperty(key)) {
    	// console.log("key", key);
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;

}


function sortByCount (wordsMap) {
	// console.log("finalWordsArray -->", wordsMap);
  finalWordsArray = Object.keys(wordsMap).map(function(key) {
    return {
      name: key,
      total: wordsMap[key]
    };
  });

  finalWordsArray.sort(function(a, b) {
    return b.total - a.total;
  });

  return finalWordsArray.slice(0, 10);

}


function wordSynPartofSpech(text){

	var options = { method: 'GET',
	  url: 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup',
	  qs: 
	   { key: 'dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf',
	     lang: 'en-ru',
	     text: text }
	 };

	return new Promise(function(resolve, reject){

		request(options, function (error, response, body) {
		  	if (error) return reject(err);

			try {
			    // JSON.parse() can throw an exception if not valid JSON
			    resolve(JSON.parse(body));
			} catch(e) {
			    reject(e);
			}
		});

	})


}


function finalJson(finalWordsArray){
		var parllellTaskArray = [];

		/* Adding top words syn and part of speect finding  as a task for Async parllel */
		finalWordsArray.map(function(wordObj){
			parllellTaskArray.push(
				function(cb){
					/* Http call to lookup web api's*/
					wordSynPartofSpech(wordObj)
					.then((result)=>{
						/*
							Get all syn fromo Lookup Json
						*/
						let synonyms = _.compact(_.flatten(_.pluck(_.flatten(_.chain(result.def).pluck("tr").value()), "syn")));

						/* For current Word Find the sysnmos present into top 10 Wrods list or not */
						synonyms.map(function(synObj){
							finalWordsArray.find((obj, i)=>{
								if(obj.name == synObj){
									wordObj['lookup'] = syn;
									return true;
								}
							})
						})
						/* Return new object with pos and syn*/
						cb(null, wordObj);
					})
					.catch((err)=>{
						console.log("err", err);
						cb(err);
					})					
				}
			);
		});

		async.parallel(parllellTaskArray, function(err, results){
			if(err){
				console.log("err-->", err);
			}else{
				/* IF there are any syn or pos  the result object will have syn and pos as key for particualr document */
				console.log("result", results);
				/*example
					[ { name: 'the', total: 71716 },
					  { name: 'of', total: 39157 },
					  { name: 'and', total: 35949 },
					  { name: 'to', total: 27889 },
					  { name: 'a', total: 19840 },
					  { name: 'in', total: 19515 },
					  { name: 'that', total: 11205 },
					  { name: 'was', total: 11128 },
					  { name: 'his', total: 9558 },
					  { name: 'he', total: 9374 } ]

				*/

				/*example
					[ { name: 'the', total: 71716,                     
						"pos": "adjective",
                   		 "syn": 
                            { 
                            "text": "грустный",
                            "pos": "adjective"
                       		},
					  { name: 'of', total: 39157 },
					  { name: 'and', total: 35949 },
					  { name: 'to', total: 27889 },
					  { name: 'a', total: 19840 },
					  { name: 'in', total: 19515 },
					  { name: 'that', total: 11205 },
					  { name: 'was', total: 11128 },
					  { name: 'his', total: 9558 },
					  { name: 'he', total: 9374 } ]

				*/

			}
		});
}




getFileContent()