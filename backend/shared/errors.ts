// 统一错误处理

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 未知错误
  console.error('Unexpected error:', error);
  return new Response(
    JSON.stringify({
      error: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function notFoundResponse(message = 'Not Found'): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function validationError(message: string): ApiError {
  return new ApiError(400, message, 'VALIDATION_ERROR');
}

export function unauthorizedError(message = 'Unauthorized'): ApiError {
  return new ApiError(401, message, 'UNAUTHORIZED');
}

