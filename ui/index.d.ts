import { PropertyValues } from '@lion/core';
import { LionSelectRich } from '@lion/select-rich';
import { LionOption } from '@lion/listbox';
import { LionInput } from '@lion/input';
import { LionInputAmount } from '@lion/input-amount';
import { LionForm } from '@lion/form';
export declare type MFormControlMixin = typeof import('./types/MFormControlMixinTypes').MFormControlMixinImplementation;
export declare const MFormControlMixin: typeof import("./types/MFormControlMixinTypes").MFormControlMixinImplementation;
declare const MSelectRich_base: typeof LionSelectRich & import("@open-wc/dedupe-mixin").Constructor<import("./types/MFormControlMixinTypes").MFormControlMixinHost> & Pick<typeof import("./types/MFormControlMixinTypes").MFormControlMixinHost, "prototype"> & Pick<typeof import("lit-element/lit-element").LitElement, "prototype" | "properties" | "styles" | "_$litElement$" | "enabledWarnings" | "enableWarning" | "disableWarning" | "addInitializer" | "_initializers" | "elementProperties" | "elementStyles" | "observedAttributes" | "createProperty" | "shadowRootOptions">;
export declare class MSelectRich extends MSelectRich_base {
    constructor();
    /**
     * TODO: add refs via param
     * @returns {TemplateResult}
     */
    _inputTemplate(): import("@lion/core").TemplateResult<1>;
}
export declare class MOption extends LionOption {
}
export declare class MForm extends LionForm {
}
export declare class MInput extends LionInput {
}
export declare class LionInputNumber extends LionInput {
    step: number;
    min: number;
    max: number;
    constructor();
    updated(changedProperties: PropertyValues): void;
}
export declare class MInputNumber extends LionInputNumber {
}
export declare class MInputAmount extends LionInputAmount {
    step: number;
    min: number;
    max: number;
    updated(changedProperties: PropertyValues): void;
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
export {};
//# sourceMappingURL=index.d.ts.map