import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Operation } from '@/types/sharp';
import { applyTransformations } from '@/services/sharp';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // TODO
};
