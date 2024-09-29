import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

const TABLE_NAME = process.env.TABLE_NAME || '';

const db = DynamoDBDocument.from(new DynamoDB());

export const handler = async (): Promise<any> => {

    const params = {
        TableName: TABLE_NAME
    };

    try {
        const response = await db.scan(params);
        return {
            statusCode: 200, body: JSON.stringify(response.Items), headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
            },
        };
    } catch (dbError) {
        return { statusCode: 500, body: JSON.stringify(dbError) };
    }
};