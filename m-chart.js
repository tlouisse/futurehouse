var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';
import './ui/index.js';
import { model } from './ui/utils/ModelDirective';
/**
 */
let MyElement = class MyElement extends LitElement {
    constructor() {
        super(...arguments);
        this._interest = 0;
        this._mortgageType = 'annuiteiten';
        this._inflation = 0;
        /**
         * Percentage of house price, measured from today, based on selected predictionStrategy
         */
        this.housePrice = 0;
        /**
         * Can be 'monetarist' or 'keynesian'
         * Depending on strategy chosen, a different inflation rate and house price will be chosen
         */
        this.school = 'keynesian';
        this.refs = {
            form: createRef(),
        };
        this.__schools = ['keynesian', 'monetarist'];
        this.__durations = [20, 30];
        this._model = {
            housePrice: 350000,
            currentRent: 10000,
            mortgageDuration: 30,
            economicSchool: 'monetarist',
            interest: 1.51,
        };
    }
    render() {
        return html `
      <m-form ${ref(this.refs.form)} ${model(this._model)}>
        <form style="display: flex;">
          <m-input-amount
            step="1000"
            label="House Price"
            name="housePrice"
            help-text="What's the price of the house that you want to buy?"
          ></m-input-amount>

          <m-input-amount
            step="10"
            label="Current Rent"
            name="currentRent"
            help-text="How much rent do you pay monthly for your current residence?"
          ></m-input-amount>

          <m-input-number
            step="0.01"
            label="Interest Rate Mortgage"
            name="interest"
            help-text="What's the interest rate belonging to your mortgage?"
          ></m-input-number>

          <m-select-rich
            label="Mortgage Duration (years)"
            name="mortgageDuration"
            >${this.__durations.map((duration) => html `
                <m-option .choiceValue="${duration}">${duration}</m-option>
              `)}
          </m-select-rich>

          <m-select-rich label="Economic School" name="economicSchool">
            ${this.__schools.map((school) => html `
                <m-option .choiceValue="${school}">${school}</m-option>
              `)}
          </m-select-rich>
        </form>
      </m-form>
      ${JSON.stringify(this._model)}
      <m-chart></m-chart>
    `;
    }
};
MyElement.styles = css `
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;
__decorate([
    state()
], MyElement.prototype, "_interest", void 0);
__decorate([
    state()
], MyElement.prototype, "_mortgageType", void 0);
__decorate([
    state()
], MyElement.prototype, "_inflation", void 0);
__decorate([
    property({ type: Number })
], MyElement.prototype, "housePrice", void 0);
__decorate([
    property()
], MyElement.prototype, "school", void 0);
__decorate([
    state()
], MyElement.prototype, "_model", void 0);
MyElement = __decorate([
    customElement('my-element')
], MyElement);
export { MyElement };
//# sourceMappingURL=m-chart.js.map