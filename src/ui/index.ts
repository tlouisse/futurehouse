import {customElement, property} from 'lit/decorators.js';
import {css, html, dedupeMixin, PropertyValues} from '@lion/core';
// import {renderToNode} from '@lion/helpers';
import {LionSelectRich, LionSelectInvoker} from '@lion/select-rich';
import {LionOption} from '@lion/listbox';
import {LionInput} from '@lion/input';
import {LionInputAmount} from '@lion/input-amount';
import {LionFieldset} from '@lion/fieldset';
import {LionButton} from '@lion/button';
import {LionForm} from '@lion/form';
import {ScopedLightDomController} from './ScopedLightDomController';

// import {MFormControlMixin} from './types/MFormControlMixinTypes';

export const utilStyles = css`
  :host {
    --spacer-05: 4px;
    --spacer-1: 8px;
    --spacer-2: 16px;

    --w-1: 72px;
    --w-2: 96px;
  }

  .u-w-1 {
    width: var(--w-1);
  }

  .u-w-2 {
    width: var(--w-2);
  }

  .u-w-1\\/5 {
    width: calc(100% / 5);
  }

  .u-w-1\\/3 {
    width: calc(100% / 3);
  }

  .u-w-1\\/12 {
    width: calc(100% / 12);
  }

  .u-w-1\\/8 {
    width: calc(100% / 8);
  }

  .u-w-1\\/6 {
    width: calc(100% / 6);
  }

  .u-m-top-2 {
    margin-top: var(--spacer-2);
  }

  .u-m-right-2 {
    margin-top: var(--spacer-2);
  }
`;

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

    static get styles() {
      return [
        super.styles,
        css`
          .input-group__container {
            height: 32px;
            border-width: 1px;
            border-style: solid;
            border-color: #333;
          }

          .input-group__container
            > .input-group__input
            ::slotted([slot='input']) {
            border: none;
            width: 100%;
            font-family: inherit;
          }
        `,
      ];
    }

    constructor() {
      super();

      this.addEventListener('model-value-changed', (ev) => {
        this.dispatchEvent(new CustomEvent('model', {detail: ev.detail}));
      });
    }

    connectedCallback() {
      super.connectedCallback();

      this._labelNode.title = this.helpText;
    }

    _helpTextTemplate() {
      return '';
    }

    /**
     * TODO: add to lion
     *
     */
    _dispatchInitialModelValueChangedEvent() {
      const detail = /** @type {ModelValueEventDetails} */ {
        formPath: [this],
        isTriggeredByUser: false,
      };

      // Send addition event for newly added controls: notice this will only be true when the form
      // has already rendered
      const isNewlyAddedControl =
        !('choiceValue' in this) &&
        this._parentFormGroup?.__repropagateChildrenInitialized;

      // When we are not a fieldset / choice-group, we don't need to wait for our children
      // to send a unified event
      if (isNewlyAddedControl) {
        detail.isAdded = true;
      } else if (this._repropagationRole !== 'child') {
        detail.initialize = true;
        /** @type {boolean} */
      } else {
        return;
      }
      this.__repropagateChildrenInitialized = true;

      // Initially we don't repropagate model-value-changed events coming
      // from children. On firstUpdated we re-dispatch this event to maintain
      // 'count consistency' (to not confuse the application developer with a
      // large number of initial events). Initially the source field will not
      // be part of the formPath but afterwards it will.
      this.dispatchEvent(
        new CustomEvent('model-value-changed', {
          bubbles: true,
          detail,
        })
      );
    }

    /**
     * @param {CustomEvent} ev
     */
    __repropagateChildrenValues(ev) {
      // Allows sub classes to internally listen to the children change events
      // (before stopImmediatePropagation is called below).
      this._onBeforeRepropagateChildrenValues(ev);
      // Normalize target, we also might get it from 'portals' (rich select)
      const target = (ev.detail && ev.detail.element) || ev.target;

      // Prevent eternal loops after we sent the event below.
      if (target === this) {
        return;
      }

      // A. Stop sibling handlers
      //
      // Make sure our sibling event listeners (added by Application developers) will not get
      // the child model-value-changed event, but the repropagated one at the bottom of this
      // method
      ev.stopImmediatePropagation();

      // B1. Are we still initializing? If so, halt...
      //
      // Stop repropagating children events before firstUpdated and make sure we de not
      // repropagate init events of our children (we already sent our own
      // initial model-value-change event in firstUpdated)
      const isGroup = this._repropagationRole !== 'child'; // => fieldset or choice-group
      const isSelfInitializing =
        isGroup && !this.__repropagateChildrenInitialized;
      const isChildGroupInitializing = ev.detail?.initialize;
      const isAdded = ev.detail?.isAdded;
      console.log(this, {
        isSelfInitializing,
        isChildGroupInitializing,
        isAdded,
      });

      if ((isSelfInitializing || isChildGroupInitializing) && !isAdded) {
        return;
      }

      // B2. Are we a single choice choice-group? If so, halt when target unchecked
      // and something else is checked, meaning we will get
      // another model-value-changed dispatch for the checked target
      //
      // We only send the checked changed up (not the unchecked). In this way a choice group
      // (radio-group, checkbox-group, select/listbox) acts as an 'endpoint' (a single Field)
      // just like the native <select>
      if (!this._repropagationCondition(target)) {
        console.log('target', target);
        return;
      }

      // C1. We are ready to dispatch. Create a formPath
      //
      // Compute the formPath. Choice groups are regarded 'end points'
      let parentFormPath = [];
      const isEndpoint =
        this._isRepropagationEndpoint ||
        this._repropagationRole === 'choice-group';
      if (!isEndpoint) {
        parentFormPath = (ev.detail && ev.detail.formPath) || [target];
      }
      const formPath = [...parentFormPath, this];

      // C2. Finally, redispatch a fresh model-value-changed event from our host, consumable
      // for an Application Developer
      //
      // Since for a11y everything needs to be in lightdom, we don't add 'composed:true'
      this.dispatchEvent(
        new CustomEvent('model-value-changed', {
          bubbles: true,
          detail: /** @type {ModelValueEventDetails} */ {
            formPath,
            isTriggeredByUser: Boolean(ev.detail?.isTriggeredByUser),
            isAdded: ev.detail?.isAdded,
          },
        })
      );
    }
  };

export const MFormControlMixin = dedupeMixin(MFormControlMixinImplementation);

@customElement('m-select-invoker')
export class MSelectInvoker extends LionSelectInvoker {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          gap: 4px;
        }

        ::slotted([slot='after']) {
          font-size: 10px;
        }
      `,
    ];
  }
}

@customElement('m-select-rich')
export class MSelectRich extends MFormControlMixin(LionSelectRich) {
  // TODO: move to Lion
  constructor() {
    super();
    new ScopedLightDomController(this, [
      'lion-validation-feedback',
      'm-select-invoker',
      'lion-options',
    ]);
  }

  static get scopedElements() {
    return {
      ...super.scopedElements,
      'm-select-invoker': MSelectInvoker,
    };
  }

  get slots() {
    return {
      ...super.slots,
      invoker: () => {
        return this.shadowRoot.createElement('m-select-invoker');
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        ::slotted([slot='invoker']) {
          line-height: 1;
          width: 100% !important;
        }

        .input-group__container ::slotted([slot='input'][role='listbox']) {
          border-width: 1px;
          border-color: #333;
          border-style: solid;
          display: block;
          margin-left: -1px;
          margin-right: -1px;
        }
      `,
    ];
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

@customElement('m-fieldset')
// @ts-expect-error
export class MFieldset extends MFormControlMixin(LionFieldset) {
  static get properties() {
    return {inline: {type: Boolean, reflect: true}};
  }

  static get styles() {
    return [
      super.styles,
      utilStyles,
      css`
        :host([inline]) .input-group {
          display: flex;
          gap: var(--spacer-2);
        }

        .form-field__label {
          font-weight: bold;
        }
      `,
    ];
  }
}

@customElement('m-button')
export class MButton extends LionButton {}

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
  interface HTMLElementTagNameMap {
    'm-fieldset': MFieldset;
  }
  interface HTMLElementTagNameMap {
    'm-button': MButton;
  }
}
