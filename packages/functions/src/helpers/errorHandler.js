export class UserFriendlyError extends Error {
  constructor(message, code = 'INTERNAL_ERROR', details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.status = 500;
  }
}

export function handleError(ctx, error) {
  console.error('API Error:', error);
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.message || 'Something went wrong';
  ctx.status = error.status || 500;
  ctx.body = {
    error: {
      code,
      message,
      details: error.details || {}
    }
  };
}
