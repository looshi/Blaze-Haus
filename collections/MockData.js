/*
MockData
Set of default data for each collection.
Written to the db on startup, on a restore routine every hour, and when any user clicks 'restore defaults';
*/

MockHTML = "<h2>Default Template</h2>\n\nToday is : {{currentDate}}\n\n{{#each this}}\n<div class='nm' style='background:{{color}}'>\n{{name}}\n</div>\n{{/each}}";

MockCSS = "body{\n  background-color:#fff;\n  transition : all 1.0s ease-out;\n}\n\nh2{\n  font-family:Arial;\n  text-decoration:underline;\n}\n\n.nm{\n  margin:0;\n  padding:2px;\n  text-align:center;\n  font-family:Arial;\n  transition : all 1.0s ease-out;\n}\n.nm:hover{\n  background-color:#fff !important;\n}";

MockJS = "helpers = {\n  currentDate : function(){\n    return new Date();\n   }\n }"

MockPeople = [
{"country":"Japan","date":"1/4/2015","city":"Ōmuta","company":"Trunyx","name":"Billy","color":"#dff2d8"},
{"country":"Cambodia","date":"10/3/2014","city":"Koh Kong","company":"Topdrive","name":"Nancy","color":"#c6dea6"},
{"country":"China","date":"8/3/2014","city":"Dabu","company":"Gabspot","name":"Jeremy","color":"#7ebdc3"},
{"country":"China","date":"3/20/2014","city":"Zhuozishan","company":"Yamia","name":"Doris","color":"#deb887"},
{"country":"Russia","date":"3/10/2015","city":"Pavlovskaya","company":"Yoveo","name":"Joe","color":"#ced097"},
{"country":"Indonesia","date":"3/2/2015","city":"Rote","company":"Dynabox","name":"Joshua","color":"#334433"},
{"country":"Philippines","date":"3/6/2014","city":"Lipa City","company":"Skilith","name":"Johnny","color":"#88aaaa"},
{"country":"Portugal","date":"9/16/2014","city":"Vista Alegre","company":"Devpoint","name":"Ann","color":"#447799"},
{"country":"Czech Republic","date":"10/26/2014","city":"Loučeň","company":"Yotz","name":"Maria","color":"#aacccc"},
{"country":"Philippines","date":"10/2/2014","city":"Pasacao","company":"Fanoodle","name":"Russell","color":"#007aa5"},
{"country":"China","date":"2/10/2015","city":"Huangsha","company":"Voonte","name":"Sharon","color":"#dff2d8"},
{"country":"China","date":"7/20/2014","city":"Saparbay","company":"Brainlounge","name":"Patricia","color":"#c6dea6"},
{"country":"China","date":"6/28/2014","city":"Lianhe","company":"Tazz","name":"Jennifer","color":"#7ebdc3"},
{"country":"South Africa","date":"11/26/2014","city":"Volksrust","company":"Vimbo","name":"Larry","color":"#91a3b0"},
{"country":"Portugal","date":"3/26/2014","city":"Vilarinho","company":"Meetz","name":"Kathryn","color":"#006b3c"},
{"country":"Indonesia","date":"7/3/2014","city":"Nanganumba","company":"Skyble","name":"Susan","color":"#ed872d"},
{"country":"North Korea","date":"10/19/2014","city":"Anbyŏn-ŭp","company":"Zoomzone","name":"Jason","color":"#6699aa"},
{"country":"Morocco","date":"3/19/2014","city":"Tazarine","company":"Quire","name":"Joe","color":"#447799"},
{"country":"Brazil","date":"9/5/2014","city":"Esteio","company":"Fivebridge","name":"Earl","color":"#334433"},
{"country":"France","date":"2/28/2015","city":"Cran-Gevrier","company":"Mydeo","name":"Chris","color":"#4b3621"},
{"country":"China","date":"11/17/2014","city":"Jinji","company":"Jabbersphere","name":"Kimberly","color":"#ced097"},
{"country":"Sweden","date":"3/8/2014","city":"Danderyd","company":"Jetpulse","name":"Eric","color":"#7ebdc3"},
{"country":"South Africa","date":"1/8/2015","city":"Burgersdorp","company":"Edgewire","name":"Lori","color":"#c19a6b"},
{"country":"Guinea","date":"12/16/2014","city":"Koubia","company":"Shufflebeat","name":"Phyllis","color":"#78866b"},
{"country":"China","date":"9/11/2014","city":"Bijia","company":"Skajo","name":"Kathy","color":"#88aaaa"},
{"country":"Portugal","date":"3/18/2014","city":"Amadora","company":"Skidoo","name":"Eric","color":"#88aaaa"},
{"country":"Indonesia","date":"3/12/2015","city":"Karangsari","company":"Feedmix","name":"Dorothy","color":"#c6dea6"},
{"country":"Israel","date":"6/29/2014","city":"Bu‘eina","company":"Kwideo","name":"Ralph","color":"#e4717a"},
{"country":"Indonesia","date":"10/29/2014","city":"Pulorejo","company":"Oyondu","name":"Virginia","color":"#dff2d8"},
{"country":"United Arab Emirates","date":"3/10/2014","city":"Ras al-Khaimah","company":"Devcast","name":"Gary","color":"#447799"},
{"country":"Malaysia","date":"10/29/2014","city":"Kuala Lumpur","company":"Zooxo","name":"Terry","color":"#88aaaa"},
{"country":"Finland","date":"10/14/2014","city":"Kaavi","company":"Trupe","name":"Joan","color":"#7a6263"},
{"country":"China","date":"5/10/2014","city":"Xiangdian","company":"Demivee","name":"Harold","color":"#c6dea6"},
{"country":"Ireland","date":"5/17/2014","city":"Kill","company":"Divape","name":"Mildred","color":"#88aaaa"},
{"country":"Indonesia","date":"4/17/2014","city":"Pangatikan","company":"Mycat","name":"Lillian","color":"#dff2d8"},
{"country":"Indonesia","date":"2/1/2015","city":"Poteran","company":"Quatz","name":"Nicole","color":"#88aaaa"},
{"country":"Russia","date":"10/18/2014","city":"Nyurba","company":"Einti","name":"Pamela","color":"#7a6263"},
{"country":"China","date":"4/3/2014","city":"Ning’er","company":"Voonyx","name":"Jane","color":"#99badd"},
{"country":"Indonesia","date":"8/12/2014","city":"Jenang Selatan","company":"Tazzy","name":"Frances","color":"#ed9121"}
];

