import json
import boto3


def postPlantInformation(event, context):
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    #水やりがtrue AWSIotにpublishしメールを送信し水を上げる
    #TODO:水やりtopicにpublish
    response = boto3.client('lambda').invoke(
        FunctionName='sns-e-mail',
        InvocationType='RequestResponse'
    )

    item={
        'datetime':	event['datetime'],
        'pictureURL':"test",
        'studentId_plantId':event['pathParameters']['studentId']+"_"+str(event['pathParameters']['plantId'])
    }
    print("item",item)
    dynamo = boto3.resource('dynamodb')
    table = dynamo.Table('Asagao-growth')
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