import { EmbedBlot } from 'parchment';

export const SOFT_BREAK_CHARACTER = '\u2028';

export default class SoftBreak extends EmbedBlot {
  static override tagName = 'BR';
  static override blotName: string = 'soft-break';
  static override className: string = 'soft-break';

  override length(): number {
    return 1;
  }

  override value(): string {
    return SOFT_BREAK_CHARACTER;
  }

  override optimize(): void {
    return;
  }
}
