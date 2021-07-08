var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from 'lit/decorators.js';
import { html, dedupeMixin } from '@lion/core';
// import {renderToNode} from '@lion/helpers';
import { LionSelectRich } from '@lion/select-rich';
import { LionOption } from '@lion/listbox';
import { LionInput } from '@lion/input';
import { LionInputAmount } from '@lion/input-amount';
import { LionForm } from '@lion/form';
import { ScopedLightDomController } from './ScopedLightDomController';
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
const MFormControlMixinImplementation = (superClass) => 
// @ts-expect-error
class MFormControl extends superClass {
    /**
     * @override Here we completely override the templates defined in FormControlMixin.
     * This means we are in control of all the html and all _subTemplate functions (like _labelTemplate) can be ignored.
     * Whenever such a template is overridden in a Lion class or Mixin, it will have no effect anymore and, if needed functionality wise
     * (for instance for adding an overlay), it should be overridden again.
     *
     * Note that we need to incorporate all functional hooks (slots and refs) as exposed by Lion's FormControlMixin
     * @returns {TemplateResult}
     */
    render() {
        return this._mainTemplate();
    }
    _mainTemplate() {
        return html ` <div class="mdc-text-field ">
        <span class="mdc-text-field__ripple"></span>
        <slot name="label"></slot>
        <slot name="prefix"></slot>
        ${this._inputTemplate()}
        <slot name="suffix"></slot>
        <span class="mdc-line-ripple"></span>
        <slot name="help-text"></slot>
        <slot name="validation-feedback"></slot>
      </div>`;
    }
    _inputTemplate() {
        return html `<slot name="input"></slot>`;
    }
};
export const MFormControlMixin = dedupeMixin(MFormControlMixinImplementation);
let MSelectRich = class MSelectRich extends MFormControlMixin(LionSelectRich) {
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
        return html `
      <div class="input-group__input">
        <slot name="invoker"></slot>
        <div id="overlay-content-node-wrapper">
          <slot name="input"></slot>
          <slot id="options-outlet"></slot>
        </div>
      </div>
    `;
    }
};
MSelectRich = __decorate([
    customElement('m-select-rich')
], MSelectRich);
export { MSelectRich };
let MOption = class MOption extends LionOption {
};
MOption = __decorate([
    customElement('m-option')
], MOption);
export { MOption };
let MForm = class MForm extends LionForm {
};
MForm = __decorate([
    customElement('m-form')
], MForm);
export { MForm };
let MInput = class MInput extends LionInput {
};
MInput = __decorate([
    customElement('m-input')
], MInput);
export { MInput };
const parseNumberString = (viewValue) => Number(viewValue);
const formatNumber = (modelValue) => `${modelValue}`;
export class LionInputNumber extends LionInput {
    constructor() {
        super();
        this.step = NaN;
        this.min = NaN;
        this.max = NaN;
        this.type = 'number';
        this.parser = parseNumberString;
        this.deserializer = parseNumberString;
        this.serializer = formatNumber;
        this.formatter = formatNumber;
    }
    updated(changedProperties) {
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
__decorate([
    property({ type: Number })
], LionInputNumber.prototype, "step", void 0);
__decorate([
    property({ type: Number })
], LionInputNumber.prototype, "min", void 0);
__decorate([
    property({ type: Number })
], LionInputNumber.prototype, "max", void 0);
let MInputNumber = class MInputNumber extends LionInputNumber {
};
MInputNumber = __decorate([
    customElement('m-input-number')
], MInputNumber);
export { MInputNumber };
let MInputAmount = class MInputAmount extends LionInputAmount {
    constructor() {
        super(...arguments);
        this.step = NaN;
        this.min = NaN;
        this.max = NaN;
    }
    updated(changedProperties) {
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
};
__decorate([
    property({ type: Number })
], MInputAmount.prototype, "step", void 0);
__decorate([
    property({ type: Number })
], MInputAmount.prototype, "min", void 0);
__decorate([
    property({ type: Number })
], MInputAmount.prototype, "max", void 0);
MInputAmount = __decorate([
    customElement('m-input-amount')
], MInputAmount);
export { MInputAmount };
//# sourceMappingURL=index.js.map