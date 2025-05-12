import { Delta } from "quill-next";
/**
 * Basically written by Gemini.
 */

type DeltaOperation = Delta['ops'];

interface QuillAttributes {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  link?: string;
  color?: string;
  background?: string;
  font?: string; // font-family
  size?: 'small' | 'large' | 'huge' | string; // named or CSS value
  script?: 'sub' | 'super';

  header?: 1 | 2 | 3 | 4 | 5 | 6;
  list?: 'ordered' | 'bullet' | 'checked' | 'unchecked'; // 'checked'/'unchecked' for task lists
  blockquote?: boolean;
  'code-block'?: boolean | string; // true or language string
  indent?: number; // 0-indexed, primarily for list nesting
  align?: 'left' | 'center' | 'right' | 'justify';

  // Embed-specific (e.g., for images)
  width?: string;
  height?: string;
  alt?: string;

  // Allow any other custom attributes
  [key: string]: any;
}

export class DeltaToMarkdown {
  private outputLines: string[];
  private currentLineSegments: { text: string; attributes?: QuillAttributes }[];
  private activeBlockAttributes: QuillAttributes;
  private orderedListCounters: { [level: number]: number }; // Keyed by indent level
  private inCodeBlock: boolean;
  private codeBlockLanguage: string;

  constructor() {
    this.outputLines = [];
    this.currentLineSegments = [];
    this.activeBlockAttributes = {};
    this.orderedListCounters = {};
    this.inCodeBlock = false;
    this.codeBlockLanguage = '';
  }

  private resetLineBuffers(): void {
    this.currentLineSegments = [];
  }

  private initializeConversionState(): void {
    this.outputLines = [];
    this.currentLineSegments = [];
    this.activeBlockAttributes = {};
    this.orderedListCounters = {};
    this.inCodeBlock = false;
    this.codeBlockLanguage = '';
  }

  private _applyInlineFormatting(text: string, attributes: QuillAttributes = {}): string {
    let formattedText = text;

    // 1. Apply HTML tags for styles that require them or for consistency
    const styles: string[] = [];
    if (attributes.color) styles.push(`color: ${attributes.color};`);
    if (attributes.background) styles.push(`background-color: ${attributes.background};`);
    if (attributes.font) styles.push(`font-family: ${attributes.font};`);
    if (attributes.size) {
      const sizeMap: Record<string, string> = { small: '0.8em', large: '1.2em', huge: '1.5em' };
      styles.push(`font-size: ${sizeMap[attributes.size] || attributes.size};`);
    }

    // Group span-based HTML styles
    if (styles.length > 0) {
      formattedText = `<span style="${styles.join(' ')}">${formattedText}</span>`;
    }

    // Other HTML tags (can wrap the span or be standalone)
    if (attributes.underline) formattedText = `<u>${formattedText}</u>`;
    if (attributes.strike) formattedText = `<s>${formattedText}</s>`; // Or <del>
    if (attributes.script === 'sub') formattedText = `<sub>${formattedText}</sub>`;
    if (attributes.script === 'super') formattedText = `<sup>${formattedText}</sup>`;


    // 2. Apply Markdown inline styles (these can wrap the HTML if simple)
    if (attributes['code-block'] === undefined && attributes.code) { // Ensure not in a code-block context for inline code
        formattedText = `\`${formattedText}\``;
    }
    if (attributes.link) {
        // If content is already HTML-ish, prefer HTML link for robustness
        if (formattedText.includes('<') || formattedText.includes('>')) {
            formattedText = `<a href="${attributes.link}">${formattedText}</a>`;
        } else {
            formattedText = `[${formattedText}](${attributes.link})`;
        }
    }
    // Bold and Italic should be outermost for typical Markdown rendering
    if (attributes.italic) formattedText = `*${formattedText}*`;
    if (attributes.bold) formattedText = `**${formattedText}**`;

    return formattedText;
  }

  private _renderCurrentLine(): void {
    if (!this.currentLineSegments.length && !this.activeBlockAttributes.list) { // Allow empty list items
        if (this.inCodeBlock) { // Handle blank line in code block
            this.outputLines.push('');
        }
      return;
    }

    const lineContent = this.currentLineSegments
      .map(segment => this._applyInlineFormatting(segment.text, segment.attributes))
      .join('');
    this.resetLineBuffers();

    // Handle code block content directly
    if (this.inCodeBlock) {
      this.outputLines.push(lineContent);
      return;
    }

    let prefix = '';
    const suffix = '';
    let lineWrapperTag: { open: string; close: string } | null = null;

    const blockAttrs = this.activeBlockAttributes;

    // Block-level HTML styling (e.g., alignment)
    const blockStyles: string[] = [];
    if (blockAttrs.align && blockAttrs.align !== 'left') { // 'left' is default
      blockStyles.push(`text-align: ${blockAttrs.align};`);
    }

    // Indentation for non-list blocks (paragraphs, headers)
    // List indentation is handled by Markdown prefix spacing
    if (blockAttrs.indent && blockAttrs.indent > 0 && !blockAttrs.list) {
        blockStyles.push(`padding-left: ${blockAttrs.indent * 2}em;`); // Example: 2em per indent level
    }


    if (blockAttrs.list) {
      const indentLevel = blockAttrs.indent || 0;
      const indentSpaces = '  '.repeat(indentLevel); // 2 spaces per indent level

      switch (blockAttrs.list) {
        case 'ordered':
          this.orderedListCounters[indentLevel] = (this.orderedListCounters[indentLevel] || 0) + 1;
          prefix = `${indentSpaces}${this.orderedListCounters[indentLevel]}. `;
          break;
        case 'bullet':
          prefix = `${indentSpaces}* `;
          break;
        case 'checked':
          prefix = `${indentSpaces}- [x] `;
          break;
        case 'unchecked':
          prefix = `${indentSpaces}- [ ] `;
          break;
      }
      // If lineContent is empty for a list item, Markdown needs something (like a space, but prefix handles it)
      // For nested lists, if indentLevel > 0 and previous line was not this list, might need blank line above.
    } else if (blockAttrs.blockquote) {
      prefix = '> ';
      // Reset ordered list counters if transitioning out of a list into a blockquote
      this.orderedListCounters = {};
    } else if (blockAttrs.header) {
      // If block styles (like alignment) are present, header must be HTML
      if (blockStyles.length > 0) {
          lineWrapperTag = { open: `<h${blockAttrs.header} style="${blockStyles.join(' ')}">`, close: `</h${blockAttrs.header}>`};
          blockStyles.length = 0; // Styles consumed
      } else {
          prefix = '#'.repeat(blockAttrs.header) + ' ';
      }
      this.orderedListCounters = {}; // Reset list counters
    } else {
      // Default to paragraph, reset list counters
      this.orderedListCounters = {};
    }

    // Apply generic block styling (e.g., div for alignment) if not consumed by specific HTML tag
    if (blockStyles.length > 0 && !lineWrapperTag) {
        lineWrapperTag = { open: `<div style="${blockStyles.join(' ')}">`, close: '</div>'};
    }


    if (lineWrapperTag) {
        this.outputLines.push(`${lineWrapperTag.open}${prefix}${lineContent}${suffix}${lineWrapperTag.close}`);
    } else {
        this.outputLines.push(`${prefix}${lineContent}${suffix}`);
    }
  }

  private _processEmbed(embedData: Record<string, any>, attributes: QuillAttributes = {}): void {
    // Render any pending line before the embed
    if (this.currentLineSegments.length > 0) {
      this._renderCurrentLine();
    }
     // Embeds often reset block context or are blocks themselves
    this.activeBlockAttributes = {}; // Or set to attributes of the embed if it defines a block style


    if (embedData.image) {
      const src = embedData.image as string;
      const alt = attributes.alt || 'Image';
      const width = attributes.width;
      const height = attributes.height;
      const align = attributes.align; // For custom alignment

      let style = '';
      if (align === 'center') style = 'display: block; margin-left: auto; margin-right: auto;';
      else if (align === 'right') style = 'float: right; margin-left: 1em;';
      else if (align === 'left') style = 'float: left; margin-right: 1em;';


      if (width || height || style) {
        const widthAttr = width ? `width="${width}"` : '';
        const heightAttr = height ? `height="${height}"` : '';
        const styleAttr = style ? `style="${style}"` : '';
        this.outputLines.push(`<img src="${src}" alt="${alt}" ${widthAttr} ${heightAttr} ${styleAttr}>`);
        if (style.includes('float:')) { // Basic clearfix after float
            this.outputLines.push('<br style="clear: both;" />');
        }
      } else {
        this.outputLines.push(`![${alt}](${src})`);
      }
    } else if (embedData.video) {
      const src = embedData.video as string;
      const width = attributes.width || '560';
      const height = attributes.height || '315';
      this.outputLines.push(
        `<iframe src="${src}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`
      );
    } else {
      // Fallback for unknown embeds
      this.outputLines.push(``);
    }
    // After an embed, typically reset block attributes for the next line unless embed itself carries them
    this.activeBlockAttributes = {};
    this.orderedListCounters = {}; // Reset list counters
  }

  private _processNewline(opAttributes: QuillAttributes): void {
    // Attributes on the newline op define the block style of the line *just ended*.
    // However, currentLineSegments have their own inline attributes.
    // So, opAttributes here primarily define the *block type* of the line formed by currentLineSegments.

    // If currently in a code block and this newline doesn't continue it, close it.
    if (this.inCodeBlock && !opAttributes['code-block']) {
      this.outputLines.push('```');
      this.inCodeBlock = false;
      this.codeBlockLanguage = '';
    }

    // // Merge opAttributes with existing activeBlockAttributes if opAttributes are only partial
    // // or opAttributes takes precedence for block definition.
    // // For simplicity, assume opAttributes on a newline *define* the block.
    // const lineBlockAttributes = { ...this.activeBlockAttributes, ...opAttributes };
    
    // Update activeBlockAttributes for *subsequent* lines based on this newline op.
    // If opAttributes is empty, it implies a default paragraph style for the next line.
    this.activeBlockAttributes = { ...opAttributes };


    // If the new block is NOT a list, reset indent-specific counters for ordered lists.
    // More fine-grained reset: if list type changes or indent level changes.
    if (!this.activeBlockAttributes.list) {
        this.orderedListCounters = {};
    } else {
        // If it IS a list, but the indent level from opAttributes is different from what was implied
        // by a previous line's indent, we might need to adjust.
        // For now, rely on `indent` in `opAttributes` to correctly key `orderedListCounters`.
        // If opAttributes.list exists, but opAttributes.indent is undefined, assume indent 0 for list counter.
        const currentIndent = opAttributes.indent || 0;
        // Ensure counters for deeper levels are cleared if we "outdent"
        Object.keys(this.orderedListCounters).forEach(levelStr => {
            const level = parseInt(levelStr, 10);
            if (level > currentIndent) {
                delete this.orderedListCounters[level];
            }
        });
    }


    this._renderCurrentLine(); // Renders based on this.activeBlockAttributes NOW (which was just updated)

    // If this newline op starts a code block
    if (!this.inCodeBlock && this.activeBlockAttributes['code-block']) {
      this.inCodeBlock = true;
      this.codeBlockLanguage = typeof this.activeBlockAttributes['code-block'] === 'string'
        ? this.activeBlockAttributes['code-block'] as string
        : '';
      this.outputLines.push(`\`\`\`${this.codeBlockLanguage}`);
    }
  }

  convert(deltaOps: DeltaOperation): string {
    this.initializeConversionState();

    for (const op of deltaOps) {
      if (op.insert === undefined || op.insert === null) continue; // Skip delete/retain ops

      const attributes = op.attributes || {};

      if (typeof op.insert === 'string') {
        const text = op.insert;
        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const lineText = lines[i];
          if (lineText) {
            this.currentLineSegments.push({ text: lineText, attributes });
          }

          if (i < lines.length - 1) { // This is a newline character
            this._processNewline(attributes); // Attributes of op containing \n define block style
          }
        }
      } else if (typeof op.insert === 'object') { // Embed
        this._processEmbed(op.insert, attributes);
      }
    }

    // Render any remaining line segments
    if (this.currentLineSegments.length > 0) {
      this._processNewline(this.activeBlockAttributes); // Process with current block attributes
    }

    // Close any open code block at the very end
    if (this.inCodeBlock) {
      this.outputLines.push('```');
      this.inCodeBlock = false;
    }

    // Post-processing: ensure blank lines between distinct block elements for readability
    // and typical Markdown paragraph separation.
    const result = this.outputLines.join('\n\n');
    // // Consolidate multiple blank lines into a maximum of one blank line (two newlines)
    // result = result.replace(/\n(\s*\n)+/g, '\n\n');
    // Ensure no leading/trailing multiple newlines beyond what's standard.
    return result.trim(); 
  }
}
