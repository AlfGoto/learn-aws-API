import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    try {
        // Exemple de lecture d'un élément à partir de DynamoDB
        if (event.httpMethod === 'GET' && event.pathParameters) {
            const id = event.pathParameters.id;

            const result = await dynamoDb.get({
                TableName: TABLE_NAME,
                Key: { id },
            }).promise();

            if (!result.Item) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'Item not found' }),
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify(result.Item),
            };
        }

        // Exemple de création d'un nouvel élément dans DynamoDB
        if (event.httpMethod === 'POST') {
            const data = JSON.parse(event.body!);

            const params = {
                TableName: TABLE_NAME,
                Item: {
                    id: data.id,
                    name: data.name,
                    // Ajoute d'autres attributs si nécessaire
                },
            };

            await dynamoDb.put(params).promise();

            return {
                statusCode: 201,
                body: JSON.stringify(params.Item),
            };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Unsupported method' }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing request' }),
        };
    }
};