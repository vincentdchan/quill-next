import { describe, it, expect } from "vitest";
import { validateAndNormalizeUrlWithHttps } from "./url";


// // --- Test Cases (TypeScript) ---
// console.log("--- Testing valid URLs (TS) ---");
// console.log(validateAndNormalizeUrlWithHttps("https://www.example.com"));
// console.log(validateAndNormalizeUrlWithHttps("http://example.com/path?query=1"));
// console.log(validateAndNormalizeUrlWithHttps("mailto:test@example.com"));
// console.log(validateAndNormalizeUrlWithHttps("ftp://files.example.com"));


// console.log("\n--- Testing schemeless URLs (TS) ---");
// console.log(validateAndNormalizeUrlWithHttps("google.com"));
// console.log(validateAndNormalizeUrlWithHttps(" www.sub.domain.co.uk/path/page.html?param=value#section "));
// console.log(validateAndNormalizeUrlWithHttps("example.com:8080/test"));
// console.log(validateAndNormalizeUrlWithHttps("nodomain"));
// console.log(validateAndNormalizeUrlWithHttps("google.c"));

// console.log("\n--- Testing invalid and edge case inputs (TS) ---");
// console.log(validateAndNormalizeUrlWithHttps("http:///example.com"));
// console.log(validateAndNormalizeUrlWithHttps("/path/relative"));
// console.log(validateAndNormalizeUrlWithHttps("not a url"));
// console.log(validateAndNormalizeUrlWithHttps(""));
// console.log(validateAndNormalizeUrlWithHttps("  "));
// console.log(validateAndNormalizeUrlWithHttps(null));
// console.log(validateAndNormalizeUrlWithHttps(undefined));
// console.log(validateAndNormalizeUrlWithHttps("javascript:void(0)"));
// console.log(validateAndNormalizeUrlWithHttps("//protocol.relative.com/path"));

describe("validateAndNormalizeUrlWithHttps", () => {
  it("Test valid URLs", () => {
    expect(validateAndNormalizeUrlWithHttps("https://www.example.com")).toEqual({
      finalUrl: "https://www.example.com/",
      isValid: true,
      originalInput: "https://www.example.com",
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps("http://example.com/path?query=1")).toEqual({
      finalUrl: "https://example.com/path?query=1",
      isValid: true,
      originalInput: "http://example.com/path?query=1",
      wasFixed: true,
    });

    expect(validateAndNormalizeUrlWithHttps("mailto:test@example.com")).toEqual({
      finalUrl: "mailto:test@example.com",
      isValid: true,
      originalInput: "mailto:test@example.com",
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps("ftp://files.example.com")).toEqual({
      finalUrl: "ftp://files.example.com/",
      isValid: true,
      originalInput: "ftp://files.example.com",
      wasFixed: false,
    });
  });

  it("Test schemeless URLs", () => {
    expect(validateAndNormalizeUrlWithHttps("google.com")).toEqual({
      finalUrl: "https://google.com/",
      isValid: true,
      originalInput: "google.com",
      wasFixed: true,
    });

    expect(validateAndNormalizeUrlWithHttps(" www.sub.domain.co.uk/path/page.html?param=value#section ")).toEqual({
      finalUrl: "https://www.sub.domain.co.uk/path/page.html?param=value#section",
      isValid: true,
      originalInput: " www.sub.domain.co.uk/path/page.html?param=value#section ",
      wasFixed: true,
    });

    expect(validateAndNormalizeUrlWithHttps("example.com:8080/test")).toEqual({
      finalUrl: "example.com:8080/test",
      isValid: true,
      originalInput: "example.com:8080/test",
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps("nodomain")).toEqual({
      finalUrl: null,
      isValid: false,
      originalInput: "nodomain",
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps("google.c")).toEqual({
      finalUrl: "https://google.c/",
      isValid: true,
      originalInput: "google.c",
      wasFixed: true,
    });
  });

  it("Test invalid and edge case inputs", () => {
    expect(validateAndNormalizeUrlWithHttps("http:///example.com")).toEqual({
      finalUrl: "https://example.com/",
      isValid: true,
      originalInput: "http:///example.com",
      wasFixed: true,
    });

    expect(validateAndNormalizeUrlWithHttps("/path/relative")).toEqual({
      finalUrl: null,
      isValid: false,
      originalInput: "/path/relative",
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps("not a url")).toEqual({
      finalUrl: null,
      isValid: false,
      originalInput: "not a url",
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps("")).toEqual({
      finalUrl: null,
      isValid: false,
      originalInput: "",
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps("  ")).toEqual({
      finalUrl: null,
      isValid: false,
      originalInput: "  ",
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps(null)).toEqual({
      finalUrl: null,
      isValid: false,
      originalInput: null,
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps(undefined)).toEqual({
      finalUrl: null,
      isValid: false,
      originalInput: undefined,
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps("javascript:void(0)")).toEqual({
      finalUrl: null,
      isValid: false,
      originalInput: "javascript:void(0)",
      wasFixed: false,
    });

    expect(validateAndNormalizeUrlWithHttps("//protocol.relative.com/path")).toEqual({
      finalUrl: null,
      isValid: false,
      originalInput: "//protocol.relative.com/path",
      wasFixed: false,
    });
  });
});
