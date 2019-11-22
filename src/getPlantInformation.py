import boto3
import json

def getPlantInformation(event, context):
   
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Asagao-growth')
    
    response = table.scan()
    print(response['Count'])
    print(response['Items'])
    body = {
        "message": "success",
        "input": event,
        "items":response['Items']
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

    # Use this code if you don't use the http event with the LAMBDA-PROXY
    # integration
    """
    return {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "event": event
    }
    """