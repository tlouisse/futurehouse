import { Directive } from 'lit/directive.js';
import { ElementPart } from '@lion/core';
declare type ModelObj = {
    [key: string]: any;
};
/**
 * Directive that introduces two way binding to Lion forms.
 *
 * @example
 * ```js
 * const myModel = {
 *  myAmount: 1234.56,
 *  fields: {
 *   emailAddress: 'a@b.c',
 *  },
 * };
 * ```
 * ```html
 * <lion-input-amount name="myAmount" ${model(myModel)}></lion-input-amount>
 * <lion-fieldset name="fields">
 *   <lion-input-email name="myEmail" ${model(myModel.fields, 'emailAddress')}></lion-input-email>
 * </lion-fieldset>
 *```
 * ```html
 * <lion-form ${model(myModel)}>
 *   <lion-input-amount name="myAmount"></lion-input-amount>
 *   <lion-fieldset name="fields">
 *     <lion-input-email name="emailAddress"></lion-input-email>
 *   </lion-fieldset>
 * </lion-form>
 *```
 * @param {object} modelObj will be used to store reference to attribute names like #myElement
 */
export declare const model: (_modelObj: ModelObj, _objKey?: string | undefined) => import("lit/directive").DirectiveResult<{
    new (_partInfo: import("lit/directive").PartInfo): {
        render(_modelObj: ModelObj, _objKey?: string | undefined): symbol;
        update(part: ElementPart, [modelObj, objKey]: [ModelObj, (string | undefined)?]): symbol;
        __part: import("lit/directive").Part;
        __attributeIndex: number | undefined;
        __directive?: Directive | undefined;
        _$parent: import("lit").Disconnectable;
        _$disconnectableChildren?: Set<import("lit").Disconnectable> | undefined;
        _$setDirectiveConnected?(isConnected: boolean): void;
        _$initialize(part: import("lit/directive").Part, parent: import("lit").Disconnectable, attributeIndex: number | undefined): void;
        _$resolve(part: import("lit/directive").Part, props: unknown[]): unknown;
    };
}>;
export {};
//# sourceMappingURL=ModelDirective.d.ts.map