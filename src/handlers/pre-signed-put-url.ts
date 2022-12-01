import type { APIGatewayProxyResult } from 'aws-lambda';
import { generate } from 'shortid';
import { getPreSignedPUTUploadUrl } from '../services/s3/pre-sign';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const name = generate();
    const ext = 'jpg'; // TODO get from request
    const filename = `${name}.${ext}`;
    const url = await getPreSignedPUTUploadUrl(filename);

    return {
      statusCode: 200,
      body: JSON.stringify({ url, filename }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
