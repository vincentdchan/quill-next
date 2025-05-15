import { useMemo, useRef } from "react";
import Quill, { BlockEmbed, Delta } from "quill-next";
import { BlotConstructor, Root } from "parchment";
import { createRoot, Root as ReactRoot } from "react-dom/client";
import { QuillContext } from "../context/quill-context";

export interface IRenderOptions {
  value: unknown;
  attributes?: Record<string, unknown>;
  getBlotIndex(): number;
}

export type RenderFunc = (optoins: IRenderOptions) => React.ReactNode;

export interface IUseBlockEmbedBlotOptions {
  blotName: string;
  tagName?: string;
  className?: string;
  create?: (value?: unknown) => HTMLElement;
  onAttach?: (domNode: HTMLElement) => void;
  render: RenderFunc;
}

export function useBlockEmbedBlot(
  options: IUseBlockEmbedBlotOptions
): BlotConstructor {
  const { blotName, tagName, className, create, onAttach, render } = options;

  const renderFuncRef = useRef<RenderFunc>(render);
  renderFuncRef.current = useMemo(() => render, [render]);

  return useMemo(() => {
    return class extends BlockEmbed {
      static override blotName: string = blotName;
      static override tagName = tagName || "div";
      static override className = className;

      static override create(value?: unknown): HTMLElement {
        if (create) {
          return create(value) as HTMLElement;
        }
        const s = super.create(value) as HTMLElement;
        s.setAttribute("contenteditable", "false");
        s.setAttribute("data-blot-name", blotName);
        return s;
      }

      private root: ReactRoot | null;
      #value: unknown = undefined;
      #attributes: Record<string, unknown> = {};

      constructor(scroll: Root, domNode: Node, value?: unknown) {
        super(scroll, domNode);
        if (value) {
          this.#value = value;
        }
      }

      override delta(): Delta {
        return new Delta().insert(this.#value as any, {
          ...this.#attributes,
        });
      }

      override attach(): void {
        if (onAttach) {
          onAttach(this.domNode as HTMLElement);
        }

        this.root = createRoot(this.domNode as HTMLElement);
        this.render();
      }

      override detach(): void {
        if (this.root) {
          const root = this.root;
          this.root = null;
          requestAnimationFrame(() => {
            root.unmount();
          });
        }
      }

      override value(): unknown {
        return {
          [blotName]: this.#value,
        };
      }

      override format(name: string, value: string): void {
        this.#attributes[name] = value;
        this.render();
      }

      private _getBlotIndex = (): number => {
        const quill = this._getQuill();
        if (!quill) {
          return -1;
        }
        return quill.getIndex(this);
      }

      private _getQuill(): Quill | null {
        if (!this.scroll?.domNode?.parentNode) {
          return null;
        }
    
        return Quill.find(this.scroll.domNode.parentNode) as Quill | null;
      }

      render(): void {
        this.root.render(
          <QuillContext.Provider value={this._getQuill()}>
            {renderFuncRef.current({
              value: this.#value,
              attributes: this.#attributes,
              getBlotIndex: this._getBlotIndex,
            })}
          </QuillContext.Provider>
        );
      }
    };
  }, [blotName, tagName, className]);
}
