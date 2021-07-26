/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import '@lion/form/define';
import '@lion/fieldset/define';
import '@lion/input/define';
import chai from '@esm-bundle/chai';

import {LionForm} from '@lion/form';
import {model} from '../../../../dist/ui/utils/ModelDirective.js';
import {fixture, aTimeout} from '@open-wc/testing';
import {html} from '@lion/core';

const assert = chai.assert;

suite('ModelDirective', () => {
  suite('On form level', () => {
    test('syncs from model to form', async () => {
      const myModel = {a: 'test'};
      const el: LionForm = await fixture(html`
        <lion-form ${model(myModel)}>
          <form>
            <lion-input name="a"></lion-input>
          </form>
        </lion-form>
      `);
      assert.equal(el.formElements.a.modelValue, 'test');
    });

    test('syncs from form to model', async () => {
      const myModel = {a: 'test'};
      const el: LionForm = await fixture(html`
        <lion-form ${model(myModel)}>
          <form>
            <lion-input name="a"></lion-input>
          </form>
        </lion-form>
      `);
      await el.registrationComplete;
      el.formElements.a.modelValue = 'changed';
      assert.equal(myModel.a, 'changed');
    });

    suite('Fieldsets', () => {
      test('syncs from model to form', async () => {
        const myModel = {groupA: {a: 'testA', groupB: {b: 'testB'}}};

        await fixture(html`
          <lion-form ${model(myModel)}>
            <form>
              <lion-fieldset name="groupA">
                <lion-input name="a"></lion-input>
                <lion-fieldset name="groupB">
                  <lion-input name="b"></lion-input>
                </lion-fieldset>
              </lion-fieldset>
            </form>
          </lion-form>
        `);
        assert.equal(myModel.groupA.a, 'testA');
        assert.equal(myModel.groupA.groupB.b, 'testB');
      });

      test('syncs from form to model', async () => {
        const myModel = {groupA: {a: 'testA', groupB: {b: 'testB'}}};

        const el: LionForm = await fixture(html`
          <lion-form ${model(myModel)}>
            <form>
              <lion-fieldset name="groupA">
                <lion-input name="a"></lion-input>
                <lion-fieldset name="groupB">
                  <lion-input name="b"></lion-input>
                </lion-fieldset>
              </lion-fieldset>
            </form>
          </lion-form>
        `);
        await el.registrationComplete;
        el.formElements.groupA.formElements.a.modelValue = 'changedA';
        await aTimeout(0);
        assert.equal(myModel.groupA.a, 'changedA');
        el.formElements.groupA.formElements.groupB.formElements.b.modelValue =
          'changedB';
        assert.equal(myModel.groupA.groupB.b, 'changedB');
      });
    });

    suite('Newly created FormControls', () => {
      test('syncs from model to form when fields already exist in model', async () => {
        const myModel = {a: 'test'};

        const el: LionForm = await fixture(html`
          <lion-form ${model(myModel)}> <form></form> </lion-form>
        `);
        const fieldEl = await fixture(html`
          <lion-input name="a"> </lion-input>
        `);
        await el.registrationComplete;

        el._formNode.appendChild(fieldEl);
        await el.registrationComplete;

        // Note this functionality comes from the form system, not the driective
        assert.equal(el.formElements.a.modelValue, 'test');
      });

      test.only('adopts newly created controls inside model', async () => {
        const myModel = {};
        const el: LionForm = await fixture(html`
          <lion-form ${model(myModel)}>
            <form>
              <lion-fieldset name="group"></lion-fieldset>
            </form>
          </lion-form>
        `);
        const fieldEl = await fixture(html`
          <lion-input name="a" .modelValue="${'test'}"> </lion-input>
        `);
        await el.registrationComplete;

        el.formElements.group.appendChild(fieldEl);
        await el.registrationComplete;

        // @ts-expect-error
        assert.equal(myModel.group.a, 'test');
      });
    });
  });

  // On Field level... (similar to ng-model)
});
