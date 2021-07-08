import {Constructor} from '@open-wc/dedupe-mixin';
import {LitElement} from '@lion/core';

export declare class MFormControlMixinHost {}

export declare function MFormControlMixinImplementation<
  T extends Constructor<LitElement>
>(
  superclass: T
): T &
  Constructor<MFormControlMixinHost> &
  Pick<typeof MFormControlMixinHost, keyof typeof MFormControlMixinHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type MFormControlMixin = typeof MFormControlMixinImplementation;
