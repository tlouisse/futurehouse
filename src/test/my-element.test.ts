/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {MyElement} from '../my-element.js';
import chai from '@esm-bundle/chai';

const assert = chai.assert;

suite('my-element', () => {
  test('is defined', () => {
    const el = document.createElement('my-element');
    assert.instanceOf(el, MyElement);
  });
});
