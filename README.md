# readWords

 node readword.js // to executre the Script

  Program to get Find occurrences count of word in document
  The then Program then Find out syn and POS for each words and if the SYn already present into the top 10 Words occurance List 
  the Object for each word document will modeify and  added syn & pos on to the existing JSON Object.
  
  
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
