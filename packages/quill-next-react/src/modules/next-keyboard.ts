import Quill, { Keyboard, type KeyboardOptions, type Binding, type BindingObject } from "quill-next";
import { cloneDeep } from 'lodash-es';

const SHORTKEY = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';

function normalize(binding: Binding): BindingObject | null {
  if (typeof binding === 'string' || typeof binding === 'number') {
    binding = { key: binding };
  } else if (typeof binding === 'object') {
    binding = cloneDeep(binding);
  } else {
    return null;
  }
  if (binding.shortKey) {
    binding[SHORTKEY] = binding.shortKey;
    delete binding.shortKey;
  }
  return binding;
}

export class NextKeyboard extends Keyboard {
  constructor(quill: Quill, options: Partial<KeyboardOptions>) {
    super(quill, options);
  }

  override addBinding(
    keyBinding: Binding,
    context:
      | Required<BindingObject['handler']>
      | Partial<Omit<BindingObject, 'key' | 'handler'>> = {},
    handler:
      | Required<BindingObject['handler']>
      | Partial<Omit<BindingObject, 'key' | 'handler'>> = {},
  ): () => void {
    const binding = normalize(keyBinding);
    if (binding == null) {
      return;
    }
    if (typeof context === 'function') {
      context = { handler: context };
    }
    if (typeof handler === 'function') {
      handler = { handler };
    }
    const disposables: (() => void)[] = [];
    const keys = Array.isArray(binding.key) ? binding.key : [binding.key];
    keys.forEach((key) => {
      const singleBinding = {
        ...binding,
        key,
        ...context,
        ...handler,
      };
      this.bindings[singleBinding.key] = this.bindings[singleBinding.key] || [];
      this.bindings[singleBinding.key].push(singleBinding);

      disposables.push(() => {
        const index = this.bindings[singleBinding.key].indexOf(singleBinding);
        if (index !== -1) {
          this.bindings[singleBinding.key].splice(index, 1);
        }
      });
    });

    return () => {
      disposables.forEach((dispose) => dispose());
    };
  }
}
