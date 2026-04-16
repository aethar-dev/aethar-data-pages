/** Error code catalog — shared with console-web/lib/error-descriptions.ts */

export interface ErrorDoc {
  code: string;
  category: string;
  description: string;
  httpStatus: number;
  example?: { request: string; response: string };
  fixSteps?: string[];
}

export const ERROR_CATALOG: ErrorDoc[] = [
  // Authentication & Authorization
  {
    code: "MISSING_API_KEY",
    category: "Authentication",
    httpStatus: 401,
    description: "API key is missing. The X-API-Key header is required on every request.",
    example: {
      request: `curl https://salary.wageapi.com/api/v1/salary?job_title=Software+Developer`,
      response: `{\n  "error": {\n    "code": "MISSING_API_KEY",\n    "message": "API key is required.",\n    "status": 401\n  }\n}`,
    },
    fixSteps: [
      "Generate a free API key at https://console.aethar.dev/keys",
      "Include `X-API-Key: <your_key>` in every request header",
    ],
  },
  {
    code: "INVALID_API_KEY",
    category: "Authentication",
    httpStatus: 401,
    description: "API key is invalid or malformed. Check for typos — keys have prefixes like wa_, cl_, sk_, ei_, eu_.",
    fixSteps: [
      "Copy the key again from console.aethar.dev — avoid trailing whitespace",
      "Confirm the key prefix matches the API you're calling (wa_ = WageAPI, cl_ = CostAPI, etc.)",
    ],
  },
  {
    code: "DEACTIVATED_KEY",
    category: "Authentication",
    httpStatus: 401,
    description: "API key has been deactivated. Generate a new key in console.aethar.dev.",
    fixSteps: ["Create a new key at console.aethar.dev/keys and update your integration"],
  },
  {
    code: "EXPIRED_KEY",
    category: "Authentication",
    httpStatus: 401,
    description: "API key has expired. Generate a new key to continue.",
    fixSteps: ["Generate a new key at console.aethar.dev/keys"],
  },
  {
    code: "SCOPE_DENIED",
    category: "Authorization",
    httpStatus: 403,
    description: "Your API key lacks permission for this endpoint. Compliance endpoints require Growth tier or higher.",
    fixSteps: [
      "Check the endpoint's required scope in the API reference",
      "Upgrade your plan at console.aethar.dev/billing",
    ],
  },
  {
    code: "RATE_LIMIT_EXCEEDED",
    category: "Rate limiting",
    httpStatus: 429,
    description: "Daily request limit exceeded. Free tier is 100 req/day, resets at midnight UTC.",
    fixSteps: [
      "Wait until midnight UTC for your quota to reset",
      "Upgrade your plan for higher limits (console.aethar.dev/billing)",
    ],
  },
  {
    code: "SERVICE_UNAVAILABLE",
    category: "Infrastructure",
    httpStatus: 503,
    description: "Service is temporarily unavailable. Retry with exponential backoff.",
    fixSteps: ["Retry after a few seconds", "Check status.aethar.dev for ongoing incidents"],
  },

  // Validation & Framework
  {
    code: "VALIDATION_ERROR",
    category: "Validation",
    httpStatus: 422,
    description: "Request parameters failed validation. Response body includes an `errors` array with per-field detail.",
    example: {
      request: `GET /v1/purchasing-power?salary=abc&to=Germany`,
      response: `{\n  "error": {\n    "code": "VALIDATION_ERROR",\n    "message": "Request validation failed...",\n    "errors": [\n      { "field": "salary", "message": "Input should be a valid number", "type": "float_parsing" }\n    ]\n  }\n}`,
    },
    fixSteps: [
      "Inspect the `errors` array in the response for per-field error details",
      "Fix the offending parameters and retry",
    ],
  },
  {
    code: "INTERNAL_ERROR",
    category: "Infrastructure",
    httpStatus: 500,
    description: "Unexpected server error. This shouldn't happen — please report it.",
    fixSteps: [
      "Retry the request",
      "If the problem persists, check status.aethar.dev or contact support@aethar.dev with the request_id",
    ],
  },

  // Salary API
  {
    code: "LOCATION_NOT_FOUND",
    category: "Salary (WageAPI)",
    httpStatus: 400,
    description: "Location could not be resolved. Use a BLS metro area (e.g. 'Austin, TX'), EU country name, or ISO code.",
    fixSteps: [
      "For US: use 'City, ST' format (e.g. 'Austin, TX', 'San Francisco, CA')",
      "For EU: use ISO country code (DE, FR, PL) or English country name (Germany, Poland)",
    ],
  },
  {
    code: "NO_SALARY_DATA",
    category: "Salary (WageAPI)",
    httpStatus: 404,
    description: "No salary data available for the requested job/location combination.",
    fixSteps: [
      "Try a broader location (drop the city, use national)",
      "Check GET /v1/jobs/search?query=... for valid job titles",
    ],
  },
  {
    code: "NO_BENCHMARK_DATA",
    category: "Salary (WageAPI)",
    httpStatus: 404,
    description: "No salary benchmark for this job/country combination yet.",
    fixSteps: ["Try a more common occupation or different country"],
  },
  {
    code: "DIRECTIVE_NOT_TRANSPOSED",
    category: "Compliance (WageAPI)",
    httpStatus: 200,
    description: "Warning: Country has not yet transposed EU Directive 2023/970 on pay transparency — response uses directive defaults.",
  },
  {
    code: "RANGE_MISSING",
    category: "Compliance (WageAPI)",
    httpStatus: 400,
    description: "Invalid salary range. `min_salary` must be positive and less than `max_salary`.",
  },
  {
    code: "BELOW_MINIMUM_WAGE",
    category: "Compliance (WageAPI)",
    httpStatus: 400,
    description: "Minimum salary is below the national minimum wage for this country.",
  },
  {
    code: "BELOW_MARKET",
    category: "Compliance (WageAPI)",
    httpStatus: 400,
    description: "Entire salary range is below the 25th percentile benchmark.",
  },
  {
    code: "ABOVE_MARKET",
    category: "Compliance (WageAPI)",
    httpStatus: 400,
    description: "Entire salary range is above the 75th percentile benchmark.",
  },
  {
    code: "RANGE_TOO_WIDE",
    category: "Compliance (WageAPI)",
    httpStatus: 400,
    description: "Salary range exceeds 100% of the benchmark mean. Narrow it for a realistic posting.",
  },

  // Cost API
  {
    code: "COUNTRY_NOT_FOUND",
    category: "Cost of Living (CostAPI)",
    httpStatus: 404,
    description: "No data for the specified country. Use ISO 3166-1 alpha-2 code or English country name.",
    fixSteps: [
      "Valid: DE, FR, PL, Germany, Poland",
      "Invalid: DEU, DEUT, germany (case-sensitive)",
    ],
  },
  {
    code: "NO_CPI_DATA",
    category: "Cost of Living (CostAPI)",
    httpStatus: 404,
    description: "No CPI data available for the requested country. Check supported countries list.",
    fixSteps: ["GET /v1/cpi/countries for the full supported list"],
  },

  // Skills API
  {
    code: "OCCUPATION_NOT_FOUND",
    category: "Skills (SkillsAPI)",
    httpStatus: 404,
    description: "Occupation SOC code not found in the taxonomy.",
    fixSteps: [
      "Use GET /v1/occupations/search?q=<keyword> to find valid SOC codes",
      "SOC codes follow the format '11-1021' or '11-1021.00'",
    ],
  },
  {
    code: "SKILL_NOT_FOUND",
    category: "Skills (SkillsAPI)",
    httpStatus: 404,
    description: "Skill ID not found.",
    fixSteps: ["Use GET /v1/skills/search?q=<keyword> to find valid skill IDs"],
  },

  // EInvoice API
  {
    code: "UNSUPPORTED_FORMAT",
    category: "E-Invoicing (EInvoiceAPI)",
    httpStatus: 400,
    description: "Invoice format not supported.",
    fixSteps: ["Supported formats: UBL 2.1, CII D16B, Factur-X, XRechnung, FatturaPA"],
  },
  {
    code: "CONVERSION_FAILED",
    category: "E-Invoicing (EInvoiceAPI)",
    httpStatus: 400,
    description: "Invoice conversion failed. Source document likely missing EN 16931 required fields.",
  },
  {
    code: "SCHEMATRON_FAILED",
    category: "E-Invoicing (EInvoiceAPI)",
    httpStatus: 400,
    description: "Invoice failed regulatory validation (Schematron rules). Response includes the failing rule.",
  },
  {
    code: "UNANONYMIZED_PII_DETECTED",
    category: "E-Invoicing (EInvoiceAPI)",
    httpStatus: 400,
    description: "Residual PII detected after anonymization step. Manually redact before submitting.",
  },
  {
    code: "ANONYMIZATION_INTEGRITY_ERROR",
    category: "E-Invoicing (EInvoiceAPI)",
    httpStatus: 500,
    description: "AI output failed deanonymization integrity check. Retry the request.",
  },
  {
    code: "AI_SERVICE_ERROR",
    category: "E-Invoicing (EInvoiceAPI)",
    httpStatus: 503,
    description: "AI service unavailable. Retry after a few seconds.",
  },
  {
    code: "NOT_FOUND",
    category: "E-Invoicing (EInvoiceAPI)",
    httpStatus: 404,
    description: "Document not found or expired. Converted documents have a 24-hour TTL.",
    fixSteps: ["Re-run the conversion to get a fresh download ID"],
  },

  // Eurostat API
  {
    code: "DATASET_NOT_FOUND",
    category: "Eurostat (EurostatAPI)",
    httpStatus: 404,
    description: "Dataset code not found in Eurostat.",
    fixSteps: ["Use GET /v1/datasets for the full list of supported dataset codes"],
  },
  {
    code: "NO_GDP_DATA",
    category: "Eurostat (EurostatAPI)",
    httpStatus: 404,
    description: "No GDP data for the requested country. EurostatAPI covers EU/EEA members only.",
  },
];

export function getErrorDoc(code: string): ErrorDoc | null {
  return ERROR_CATALOG.find((e) => e.code === code) ?? null;
}
