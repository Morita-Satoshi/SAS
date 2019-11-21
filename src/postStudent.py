import json
import boto3 


def postStudent(event, context):
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    
    item={
        'studentId':event['studentId'],
        'plantId':0,
        'studentName':event['studentName']
    }
    dynamo = boto3.resource('dynamodb')
    table = dynamo.Table('Asagao-manage')
    table.put_item(Item=item)
    
    
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
