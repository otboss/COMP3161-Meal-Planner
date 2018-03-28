/*
 * DATABASE POLULATOR
 * 
 * USE THE COMMAND 
 *      
 *      "node populator.js > tables.sql"
 * 
 * IN THE LINUX TERMINAL TO CREATE OUTPUT THE RESULTS TO AN SQL FILE
 * */

var faker = require('faker');
var sha256 = require('sha256');
var fs = require('fs');
//var jsdom = require('jsdom');
//const { JSDOM } = jsdom;
var request = require('request');
var unique = require('array-unique');

generateRecords = function(accountTable, recipeTable, numberOfAccounts, numberOfRecipies){
    return new Promise(function(resolve, reject){
        formatDate = function(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
            return [year, month, day].join('-');
        }            
        emails = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "mailinator.com"
        ]
        diets = [
            "healthy",
            "vegeterian",
            "vegan" 
        ]      
        accountSql = "INSERT INTO "+accountTable+" (aid, email, password, salt, fname, lname, dob, diet) VALUES"; 
        name = "";
        salt = "";
        for(var i=0; i < numberOfAccounts; i++) {
            name = faker.name.firstName()+" "+faker.name.lastName();
            name = name.replace("'","")
            salt = sha256(faker.name.firstName()).slice(0, 10);
            accountSql += "\n("+i+", ";
            accountSql += "'"+name.split(" ")[0]+"_"+name.split(" ")[1]+"@"+emails[Math.floor((Math.random() * 4) + 0)]+"', ";
            accountSql += "'"+sha256(faker.address.city())+"',"
            accountSql += "'"+salt+"', ";
            accountSql += "'"+name.split(" ")[0]+"',";
            accountSql += "'"+name.split(" ").slice(1, name.length)+"',";
            accountSql += "'"+formatDate(faker.date.between('1960-09-31','2018-02-28'))+"',";
            accountSql += "'"+diets[Math.floor((Math.random() * 3) + 0)]+"')";
            if(i == numberOfAccounts - 1)
                accountSql += ";";
            else
                accountSql += ",";
        }
        
        
        //meals = fs.readFileSync('meals.txt').split("\n");
        getFood = function(){
            return new Promise(function(resolve, reject){
                request('https://api.jamesoff.net/recipe', function (error, response, recipe) {
                  resolve(JSON.parse(recipe));
                })
            });
        }   
        
        getFood().then(function(data){
            console.log(data);
        })
        
        generateAllMeals = function(){
            return new Promise(function(resolve, reject){
                var meals = []
                for(var x = 0; x < numberOfRecipies; x++){
                    getFood().then(function(data){
                        meals.push(data);
                    })
                }
                resolve(meals);
            });
        }
        
        
        new Promise(function(resolve, reject){
            generateAllMeals().then(function(recipies){
                fs.writeFile('meals.txt', JSON.stringify(recipies), function(err){
                    
                });
                recipeSql = "INSERT INTO "+recipeTable+" (rid, rname, servings) VALUES";
                console.log(recipies)
                for(var i = 0; i < recipies.length; i++){
                    recipeSql += "\n("+i+",";
                    recipeSql += "'"+recipies[i]["title"]+"',";
                    recipeSql += "'"+recipies[i]["serves"]+"',";
                    if(i == recipies.length - 1)
                        recipeSql += ";";
                    else
                        recipeSql += ",";
                }
                resolve(recipeSql);         
            }) 
        }).then(function(recipeSql){
            //FINAL RESEOLVE
            resolve(accountSql+"\n\n"+recipeSql);
        });
    });
}

generateRecords("yes", "no", 100000, 3).then(function(data){
    console.log(data)
});
