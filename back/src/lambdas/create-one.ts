import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';


const TABLE_NAME = process.env.TABLE_NAME || '';

const db = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event: any = {}): Promise<any> => {

    if (!event.body) return { statusCode: 500, body: 'invalid request, you are missing the parameter body' };

    const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    item['date'] = Date.now()

    if (!item.name || !item.state) { return { statusCode: 500, body: 'Wrong parameters' }; }
    const params = {
        TableName: TABLE_NAME,
        Item: item
    };


    try {
        await db.put(params);
        return {
            statusCode: 201, body: 'success !', headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
            },
        };
    } catch (dbError) { return { statusCode: 500, body: dbError }; }

};
