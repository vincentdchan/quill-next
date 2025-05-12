import { describe, it, expect } from "vitest";
import { Delta } from "quill-next";
import { DeltaToMarkdown } from "./delta-to-markdown.class";

describe("DeltaToMarkdown", () => {
  const delta = new Delta()
    .insert("Hello, world!\n")
    .insert("This is a test\n", { bold: true })
    .insert("This is another test\n", { italic: true })
    .insert("This is a test\n", { bold: true, italic: true })
    .insert("This is another test\n", { bold: true, italic: true })
    .insert("This is a test\n", { bold: true, italic: true })
    .insert("This is another test", { bold: true, italic: true })
  const expected = `Hello, world!

**This is a test**

*This is another test*

***This is a test***

***This is another test***

***This is a test***

***This is another test***`;

  it("should convert a delta to markdown", () => {
    const deltaToMarkdown = new DeltaToMarkdown();
    const markdown = deltaToMarkdown.convert(delta.ops);
    expect(markdown).toBe(expected);
  });
});