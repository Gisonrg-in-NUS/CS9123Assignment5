from __future__ import print_function

import json
import smtplib
import boto3
print('Loading function')
import datetime
import time

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))
    # generate email
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('githubvisual')
    emailListFile = bucket.Object("EmailList")
    emailList = emailListFile.get()['Body'].read()
    print (emailList)
    emails = emailList.split(" ")
    print (emails)
    timeFile = bucket.Object("Timestamp")
    timestamp = timeFile.get()['Body'].read()
    print (timestamp)
    currentTime = int(time.time())
    print (currentTime)
    differences = currentTime - int(timestamp);
    diffH = differences / 3600
    differences %= 3600
    diffM = differences /60
    differences %= 60
    diffS = differences
    message = "Reminder from GithubVisual Team: It has been "+ str(diffH) + " hours "+ str(diffM) + " minutes " + str(diffS) + "seconds since you last use GithubVisual."
    sender = "cszznbbb@gmail.com"
    title = "Reminder from GithubVisual Team"
    pswd = "123789bcby"
    for receivers in emails:
        msg = "From: %s\nTo: %s\nSubject: %s\n\n%s" % ( sender, receivers, title, message )
    
        # connect to gmail through smtp
        smtp = smtplib.SMTP('smtp.gmail.com:587')
    
        smtp.ehlo()
        
        # make a connection
        
        smtp.starttls()
        
        # log in
        
        smtp.login(sender, pswd)
        
        # send the email
        
        # sender, receivers format: string
        #print("test")
        smtp.sendmail(sender, receivers, msg)
        
        smtp.quit()
    return {"result":0, "message":"Succeed"}  # Echo back the first key value
    #raise Exception('Something went wrong')
