import { useMemo, useRef } from "react";
import Quill, { Link } from "quill-next";
import { BlotConstructor } from "parchment";
import { messages } from "../messages";

export interface ILinkBlotOptions {
  onClick?: (event: MouseEvent) => void;
  onAttach?: (domNode: HTMLElement) => void;
  onDetach?: (domNode: HTMLElement) => void;
}

export function useNextLinkBlot(options?: ILinkBlotOptions): BlotConstructor {
  const { onClick, onAttach, onDetach } = options || {};
  const onClickRef = useRef<((event: MouseEvent) => void) | undefined>(onClick);
  onClickRef.current = useMemo(() => onClick, [onClick]);

  return useMemo((): BlotConstructor => {
    return class extends Link {

      static override create(value: string): HTMLElement {
        const node = super.create(value) as HTMLElement;
        node.setAttribute('href', this.sanitize(value));
        node.setAttribute('rel', 'noopener noreferrer');
        node.setAttribute('target', '_blank');
        node.classList.add('qn-link');
        node.style.cursor = "pointer";
        return node;
      }

      fetchQuill(): Quill | null {
        const container = this.domNode.closest('.ql-editor');
        if (!container) {
          return null;
        }
        return Quill.find(container.parentElement as HTMLElement) as Quill | null;
      }

      #quill: Quill | null = null;

      #handleClick = (event: MouseEvent): void => {
        onClickRef.current?.(event);

        if (event.defaultPrevented) {
          return;
        }
        event.preventDefault();
        
        window.open(this.domNode.getAttribute('href') || '', '_blank');
      }

      #handleMouseEnter = (): void => {
        this.#quill?.emitter.emit(messages.NextLinkMouseEnter, this);
      }

      #handleMouseLeave = (): void => {
        this.#quill?.emitter.emit(messages.NextLinkMouseLeave, this);
      }

      override attach(): void {
        super.attach();
        this.#quill = this.fetchQuill();

        this.domNode.addEventListener('click', this.#handleClick);
        this.domNode.addEventListener('mouseenter', this.#handleMouseEnter);
        this.domNode.addEventListener('mouseleave', this.#handleMouseLeave);

        onAttach?.(this.domNode);
      }

      override detach(): void {
        onDetach?.(this.domNode);

        this.#quill = null;

        super.detach();
        this.domNode.removeEventListener('click', this.#handleClick);
        this.domNode.removeEventListener('mouseenter', this.#handleMouseEnter);
        this.domNode.removeEventListener('mouseleave', this.#handleMouseLeave);
      }

    }
  }, []);
}
