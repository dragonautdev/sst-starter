import { z } from "zod/v4";

export const ErrorResponse = z.object({
  type: z.enum([
    'validation',
    'authentication',
    'forbidden',
    'not_found',
    'internal',
  ]).describe('The error type category'),
  code: z.string().describe('Machine-readable error code'),
  message: z.string().describe('Human-readable error message'),
  param: z.string().optional().describe('The parameter that caused the error (if applicable)'),
  details: z.any().optional().describe('Additional error context information')
})

export type ErrorResponseType = z.infer<typeof ErrorResponse>;

/**
 * Standardized error codes for the API
 */
export const ErrorCodes = {
  Validation: {
    INVALID_PARAMETER: 'invalid_parameter',
    MISSING_REQUIRED_FIELD: "missing_required_field",
    INVALID_FORMAT: "invalid_format",
    ALREADY_EXISTS: "already_exists",
    IN_USE: "resource_in_use",
    INVALID_STATE: "invalid_state",
  },
  Authentication: {
    UNAUTHORIZED: "unauthorized",
    INVALID_CREDENTIALS: "invalid_credentials",
    EXPIRED_TOKEN: "expired_token",
    INVALID_TOKEN: "invalid_token",
    
  },
  // Permission errors (403)
  Permission: {
    FORBIDDEN: "forbidden",
    INSUFFICIENT_PERMISSIONS: "insufficient_permissions",
    ACCOUNT_RESTRICTED: "account_restricted",
  },

  // Resource not found errors (404)
  NotFound: {
    RESOURCE_NOT_FOUND: "resource_not_found",
  },

  // Server errors (500)
  Server: {
    INTERNAL_ERROR: "internal_error",
    SERVICE_UNAVAILABLE: "service_unavailable",
    DEPENDENCY_FAILURE: "dependency_failure",
  },
}

/**
 * Standard error that will be exposed to clients through API responses
 */
export class VisibleError extends Error {
  constructor(
    public type: ErrorResponseType["type"],
    public code: string,
    public message: string,
    public param?: string,
    public details?: any,
  ) {
    super(message);
  }

  /**
   * Convert this error to an HTTP status code
   */
  public statusCode(): number {
    switch (this.type) {
      case "validation":
        return 400;
      case "authentication":
        return 401;
      case "forbidden":
        return 403;
      case "not_found":
        return 404;
      case "internal":
        return 500;
    }
  }

  /**
   * Convert this error to a standard response object
   */
  public toResponse(): ErrorResponseType {
    const response: ErrorResponseType = {
      type: this.type,
      code: this.code,
      message: this.message,
    };

    if (this.param) response.param = this.param;
    if (this.details) response.details = this.details;

    return response;
  }
}