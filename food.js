var fs = require('fs');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
var request = require('request');
var unique = require('array-unique');

//~ getFood = function(){
    //~ return new Promise(function(resolve, reject){
        //~ request('http://www.fantasynamegenerators.com/food-names.php#.WrvJ3eZG2xU', function(err, response, body){
            //~ var dom = new JSDOM(body);
            //~ var food = dom.window.document.innerHTML;
            //~ resolve(food);
        //~ });
    //~ });
//~ }


getFood = function(){
    return new Promise(function(resolve, reject){
        request('https://api.jamesoff.net/recipe', function (error, response, recipe) {
          resolve(JSON.parse(recipe));
        })
    });
}   

getFood().then(function(recipe){
    new Promise(function(resolve, reject){
        fs.readFile('meals.txt', function(err, recipiesOnFile){
           resolve(JSON.parse(recipiesOnFile)) 
        })
    }).then(function(recipiesOnFile){
        recipiesOnFile.push(recipe);
        fs.writeFile('meals.txt', JSON.stringify(recipiesOnFile), function(err){
            
        });
    });
});



//fs.writeFileSync()



//~ getFood().then(function(data){
   //~ console.log(data); 
//~ });
