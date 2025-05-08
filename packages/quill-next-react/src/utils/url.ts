/**
 * Generate by Gemini
 */

/**
 * Interface for the result of URL validation and normalization.
 */
export interface UrlValidationResult {
  isValid: boolean;
  finalUrl: string | null;
  originalInput: string | null | undefined; // The raw input string passed to the function
  wasFixed: boolean;
}

/**
* Validates a string that might be a URL, including those without a scheme (e.g., "google.com").
* If it's a schemeless web link, it attempts to auto-prefix with "https://".
* If it's an "http://" URL, it attempts to upgrade it to "https://".
*
* @param rawInputString The string to validate and normalize.
* @returns An UrlValidationResult object.
*/
export function validateAndNormalizeUrlWithHttps(rawInputString: string | null | undefined): UrlValidationResult {
  const originalInput = rawInputString;

  if (rawInputString == null || typeof rawInputString !== 'string' || rawInputString.trim() === '') {
      return {
          isValid: false,
          finalUrl: null,
          originalInput,
          wasFixed: false,
      };
  }

  const inputString: string = rawInputString.trim();

  try {
      // Attempt to parse the input string as a URL directly
      const url = new URL(inputString);

      // Forbid javascript: URLs
      if (url.protocol === "javascript:") {
        return {
            isValid: false,
            finalUrl: null,
            originalInput,
            wasFixed: false,
        };
      }

      // URL is structurally valid, now check its protocol
      if (url.protocol === "http:") {
          // Upgrade http to https
          url.protocol = "https:"; // Modifying the protocol property is a standard way to change it
          return {
              isValid: true,
              finalUrl: url.href,
              originalInput,
              wasFixed: true,
          };
      } else if (url.protocol === "https:") {
          return {
              isValid: true,
              finalUrl: url.href,
              originalInput,
              wasFixed: false,
          };
      } else {
          // Valid URL but not http or https (e.g., mailto:, ftp:, file:)
          // We consider it valid but don't attempt to prefix with https
          return {
              isValid: true,
              finalUrl: url.href,
              originalInput,
              wasFixed: false,
          };
      }
  } catch (error: unknown) { // Catch block for the first new URL() attempt
      // The inputString is not a valid absolute URL on its own.
      // Let's check if it looks like a schemeless web link (e.g., "google.com", "example.com/path")

      const looksSchemelessAndWeblike: boolean =
          !inputString.includes("://") &&      // Does not already contain a scheme marker
          !inputString.includes(" ") &&        // Does not contain spaces
          inputString.includes(".") &&         // Contains at least one dot (common for domain names)
          !inputString.startsWith("/") &&      // Is not a relative path starting with a slash
          !inputString.startsWith("#") &&      // Is not just a fragment identifier
          !/^[a-z][a-z0-9+.-]*:/i.test(inputString); // Does not appear to have another scheme (e.g. mailto:, javascript:)

      if (looksSchemelessAndWeblike) {
          const potentialUrl: string = "https://" + inputString;
          try {
              const fixedUrl = new URL(potentialUrl);
              // If new URL(potentialUrl) succeeds, it's a valid URL structure
              return {
                  isValid: true,
                  finalUrl: fixedUrl.href,
                  originalInput,
                  wasFixed: true,
              };
          } catch (fixError: unknown) { // Catch block for the second new URL() attempt
              // Even after prefixing, it's not a valid URL (e.g., "google.c" -> "https://google.c")
              return {
                  isValid: false,
                  finalUrl: null,
                  originalInput,
                  wasFixed: false,
              };
          }
      } else {
          // Does not look like a schemeless domain that we can fix, or failed initial parsing for other reasons
          return {
              isValid: false,
              finalUrl: null,
              originalInput,
              wasFixed: false,
          };
      }
  }
}
