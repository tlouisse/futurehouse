import {customElement, property} from 'lit/decorators.js';
import {html, dedupeMixin, PropertyValues} from '@lion/core';
// import {renderToNode} from '@lion/helpers';
import {LionSelectRich} from '@lion/select-rich';
import {LionOption} from '@lion/listbox';
import {LionInput} from '@lion/input';
import {LionInputAmount} from '@lion/input-amount';

import {LionForm} from '@lion/form';
import {ScopedLightDomController} from './ScopedLightDomController';
import {superset} from 'd3-array';

// import {MFormControlMixin} from './types/MFormControlMixinTypes';

export type MFormControlMixin =
  typeof import('./types/MFormControlMixinTypes').MFormControlMixinImplementation;

/**
 * These styles are hardcoded for now. They should be derived from a transformation processs of
 * a style library's output (.css) file like Material Design, Bootstrap etc.
 * The transformation process should be annotated, so the following can be transformated:
 *
 * - host to :host selectors. Annotated via:
 *   @lion-style-adapter({ host: '.mdc-text-field' })
 * - class based states to 'Lion states' (attributes). Annotated via:
 *   @lion-style-adapter({ states: { '[shows-feedback-for~="error"]': '.mdc-text-field--invalid' } })
 * - light dom to ::slotted selectors
 *   @lion-style-adapter({ slots: { label: '.mdc-floating-label' } })
 */
// const formControlStyles = css``;

const MFormControlMixinImplementation: MFormControlMixin = (superClass) =>
  // @ts-expect-error
  class MFormControl extends superClass {
    // /**
    //  * @override Here we completely override the templates defined in FormControlMixin.
    //  * This means we are in control of all the html and all _subTemplate functions (like _labelTemplate) can be ignored.
    //  * Whenever such a template is overridden in a Lion class or Mixin, it will have no effect anymore and, if needed functionality wise
    //  * (for instance for adding an overlay), it should be overridden again.
    //  *
    //  * Note that we need to incorporate all functional hooks (slots and refs) as exposed by Lion's FormControlMixin
    //  * @returns {TemplateResult}
    //  */
    // render() {
    //   return this._mainTemplate();
    // }

    // _mainTemplate() {
    //   return html` <div class="mdc-text-field ">
    //     <span class="mdc-text-field__ripple"></span>
    //     <slot name="label"></slot>
    //     <slot name="prefix"></slot>
    //     ${this._inputTemplate()}
    //     <slot name="suffix"></slot>
    //     <span class="mdc-line-ripple"></span>
    //     <slot name="help-text"></slot>
    //     <slot name="validation-feedback"></slot>
    //   </div>`;
    // }

    // _inputTemplate() {
    //   return html`<slot name="input"></slot>`;
    // }

    constructor() {
      super();

      this.addEventListener('model-value-changed', (ev) => {
        this.dispatchEvent(new CustomEvent('model', {detail: ev.detail}));
      });
    }
  };

export const MFormControlMixin = dedupeMixin(MFormControlMixinImplementation);

@customElement('m-select-rich')
export class MSelectRich extends MFormControlMixin(LionSelectRich) {
  // TODO: move to Lion
  constructor() {
    super();
    new ScopedLightDomController(this, [
      'lion-validation-feedback',
      'lion-select-invoker',
      'lion-options',
    ]);
  }

  /**
   * TODO: add refs via param
   * @returns {TemplateResult}
   */
  _inputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="invoker"></slot>
        <div id="overlay-content-node-wrapper">
          <slot name="input"></slot>
          <slot id="options-outlet"></slot>
        </div>
      </div>
    `;
  }
}

@customElement('m-option')
export class MOption extends LionOption {}

@customElement('m-form')
export class MForm extends MFormControlMixin(LionForm) {}

@customElement('m-input')
export class MInput extends MFormControlMixin(LionInput) {}

const parseNumberString = (viewValue: string) => Number(viewValue);
const formatNumber = (modelValue: number) => `${modelValue}`;
export class LionInputNumber extends LionInput {
  @property({type: Number})
  step = NaN;

  @property({type: Number})
  min = NaN;

  @property({type: Number})
  max = NaN;

  constructor() {
    super();
    this.type = 'number';
    this.parser = parseNumberString;
    this.deserializer = parseNumberString;
    this.serializer = formatNumber;
    this.formatter = formatNumber;
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('step')) {
      // @ts-expect-error fix in LionInput
      this._inputNode.step = `${this.step}`;
    }
    if (changedProperties.has('min')) {
      // @ts-expect-error fix in LionInput
      this._inputNode.min = `${this.min}`;
    }
    if (changedProperties.has('max')) {
      // @ts-expect-error fix in LionInput
      this._inputNode.max = `${this.max}`;
    }
  }
}

@customElement('m-input-number')
export class MInputNumber extends MFormControlMixin(LionInputNumber) {}

@customElement('m-input-amount')
export class MInputAmount extends MFormControlMixin(LionInputAmount) {
  @property({type: Number})
  step = NaN;

  @property({type: Number})
  min = NaN;

  @property({type: Number})
  max = NaN;

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('step')) {
      // @ts-expect-error fix in LionInput
      this._inputNode.step = `${this.step}`;
    }
    if (changedProperties.has('min')) {
      // @ts-expect-error fix in LionInput
      this._inputNode.min = `${this.min}`;
    }
    if (changedProperties.has('max')) {
      // @ts-expect-error fix in LionInput
      this._inputNode.max = `${this.max}`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'm-select-rich': MSelectRich;
  }
  interface HTMLElementTagNameMap {
    'm-option': MOption;
  }
  interface HTMLElementTagNameMap {
    'm-form': MForm;
  }
}
