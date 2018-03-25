from faker import Faker
import random
import hashlib
import os

def generateRecords(accountTableName, recipeTableName, numberOfAccounts, numberOfRecipies):
    
    accountSql = "INSERT INTO "+accountTableName+" (id, email, password, salt, fname, lname, dob, diet) VALUES"#
    
    fake = Faker()
    
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
    
    salt = ""
    name = ""
    for i in range(numberOfAccounts):
        salt =  hashlib.md5(fake.text()[:50].replace("\n"," ").encode('utf-8')).hexdigest()
        name = fake.name()
        accountSql += "\n("+str(i)+", "
        accountSql += "'"+name.replace(" ", "_")+"@"+emails[random.randint(0,3)]+"', "
        accountSql += "'"+hashlib.sha256(fake.text()[:50].replace('\n'," ").encode('utf-8')).hexdigest()+"', "
        accountSql += "'"+salt+"', "
        accountSql += "'"+name.split(" ")[0]+"', "
        accountSql += "'"+name.split(" ")[1]+"', "
        accountSql += "'"+str(fake.date_between(start_date="-50y", end_date="-13y"))+"', "
        accountSql += "'"+diets[random.randint(0,2)]+"')"
        if i < numberOfAccounts - 1:
            accountSql += ";"
        else:
            accountSql += ","
    
    return accountSql

print(generateRecords("yes", "no", 100000, 20))
