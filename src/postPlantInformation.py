import json
import boto3


def postPlantInformation(event, context):
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    #水やりがtrue AWSIotにpublishしメールを送信し水を上げる
    #TODO:水やりtopicにpublish
    if event['isWater']:
        response = boto3.client('lambda').invoke(
            FunctionName='sns-e-mail',
            InvocationType='RequestResponse'
        )

    item={
        'datetime':	"2015-12-21T17:42:45Z",
        'isWater':event['isWater'],
        'pictureURL':"fff",
        'studentId_plantId':event['studentId']+"_"+str(event['plantId'])
    }
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
