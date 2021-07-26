import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {ref, createRef, RefOrCallback} from 'lit/directives/ref.js';
import {MForm, utilStyles} from './ui/index.js';
// import './ui/index.js';
import {model} from './ui/utils/ModelDirective';
import './m-chart';
import {ChartResult, ChartResultEntry} from './m-chart';

function debounce(func: Function, duration = 0) {
  let timeout;
  return function (...args) {
    const effect = () => {
      timeout = null;
      return func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(effect, duration);
  };
}

/**
 */
@customElement('my-element')
export class MyElement extends LitElement {
  protected refs: {[key: string]: RefOrCallback} = {
    form: createRef<MForm>(),
  };

  private __scenarios = ['inflation-monetarist', 'inflation-keynesian'];
  private __durations = [20, 30];
  private __mortgageTypes = [
    {type: 'linear', label: 'lineair'},
    {type: 'annuity', label: 'annuïteit'},
  ]; // add annuiteiten etc,

  @state()
  __activeRows: string[] = [];

  @state()
  protected _model = {
    context: {
      currentRent: 550,
      economicScenario: 'inflation-monetarist',
      mortgagesToCompare: ['default', 'nogIets'],
      yearlyInflation: 2,
    },
    // mortgageAmount: 325000,
    // interest: 1.4,
    // mortgageType: 'annuity',
    // mortgageDuration: 30,
    // yearlyIncome: 50000,
    // housePrice: 410000,
  };

  @state()
  private __chartData: Array<ChartResult> = [];

  static styles = [
    utilStyles,
    css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
      }

      .form-row {
        display: flex;
        margin-bottom: 16px;
      }
    `,
  ];

  // TODO: get rid of the debounce by makings sure mv-changed fires once in Lion
  render() {
    // TODO: use native spread directive for refProps when directive available: https://github.com/lit/lit/issues/923
    return this._mainTemplate({chartData: this.__chartData, refs: this.refs});
  }

  _mainTemplate({
    chartData,
    refs,
  }: {
    chartData: ChartResult[];
    refs: {[key: string]: RefOrCallback};
  }) {
    return html`
      <m-form
        ${ref(refs.form)}
        ${model(this._model)}
        @model="${debounce(this.__computeChartData)}"
      >
        <form>
          <m-fieldset name="context" label="Context" inline>
            <m-input-amount
              step="10"
              label="Current Rent"
              name="currentRent"
              help-text="How much rent do you pay monthly for your current residence?"
              .modelValue="${550}"
            ></m-input-amount>

            <m-select-rich label="Economic Scenario" name="economicScenario">
              ${this.__scenarios.map(
                (scenario) => html`
                  <m-option .choiceValue="${scenario}">${scenario}</m-option>
                `
              )}
            </m-select-rich>

            <m-input-number
              class="u-w-form-1"
              label="Looptijd"
              name="period"
              help-text="Wat is de totale looptijd?"
              .modelValue="${30}"
            ></m-input-number>
          </m-fieldset>
          ${this.__activeRows.map(
            (mortgageName, index) => html`
              ${this._mortagegeRowTemplate({mortgageName, index})}
            `
          )}
          <m-button @click="${() => this.__addRow()}">+ Add mortgage</m-button>
        </form>
      </m-form>

      <m-chart .data="${chartData}"></m-chart>
    `;
  }

  _mortagegeRowTemplate({
    mortgageName,
    index,
  }: {
    mortgageName: string;
    index: number;
  }) {
    return html`
      <m-fieldset
        class="u-m-top-2"
        inline
        .name="${mortgageName}"
        label="Hypotheek ${index.toString(16)}"
      >
        <m-input-amount
          step="1000"
          label="Bedrag"
          name="mortgageAmount"
          help-text="Hoeveel wil je lenen bij de bank?"
          .modelValue="${350000}"
        ></m-input-amount>

        <m-input-number
          class="u-w-1/12"
          step="0.01"
          label="Rente"
          name="interest"
          help-text="What's the interest rate belonging to your mortgage?"
          .modelValue="${1.5}"
        ></m-input-number>

        <m-select-rich
          class="u-w-1/6"
          label="Type"
          name="mortgageType"
          .modelValue="${'annuity'}"
          >${this.__mortgageTypes.map(
            ({type, label}) => html`
              <m-option .choiceValue="${type}">${label}</m-option>
            `
          )}
        </m-select-rich>

        <m-select-rich label="Duur (in jaren)" name="mortgageDuration"
          >${this.__durations.map(
            (duration) => html`
              <m-option .choiceValue="${duration}">${duration}</m-option>
            `
          )}
        </m-select-rich>

        <m-button @click="${() => this.__deleteRow({mortgageName})}"
          >X</m-button
        >
      </m-fieldset>
    `;
  }

  private __addRow() {
    this.__activeRows.push(`mortgage${this.__activeRows.length}`);
    this.__activeRows = [...this.__activeRows];
  }

  private __deleteRow({mortgageName}: {mortgageName: string}) {
    this.__activeRows.splice(this.__activeRows.indexOf(mortgageName), 1);
    this.__activeRows = [...this.__activeRows];
  }

  private __calculateCurrentRent({
    mortgageDuration,
    currentRent,
  }: {
    mortgageDuration: number;
    currentRent: number;
  }): ChartResultEntry[] {
    const resultData = [];
    for (let i = 1; i <= mortgageDuration; i += 1) {
      resultData.push({
        time: `${i}`,
        value: currentRent * 12 * i,
      });
    }
    return resultData;
  }

  private __calculateLinear({
    mortgageDuration,
    mortgageAmount,
    interest,
  }: {
    mortgageDuration: number;
    mortgageAmount: number;
    interest: number;
  }): ChartResultEntry[] {
    let mortgageRemaining = mortgageAmount;
    const monthlyRedemption = mortgageAmount / mortgageDuration;

    const resultData = [];
    for (let i = 1; i <= mortgageDuration; i += 1) {
      // TODO: monthly determined (or should it be yearly)
      const monthlyInterestAmount =
        (mortgageRemaining * (1 + interest) - mortgageRemaining) / 100;
      const previousValue: number = resultData[i - 2]?.value || 0;
      resultData.push({
        time: `${i}`,
        value: previousValue + monthlyRedemption + monthlyInterestAmount,
        monthlyInterestAmount,
        monthlyRedemption,
      });
      mortgageRemaining -= monthlyRedemption;
    }
    return resultData;
  }

  private __calculateAnnuity({
    interest,
    mortgageDuration,
    mortgageAmount,
  }: {
    interest: number;
    mortgageDuration: number;
    mortgageAmount: number;
  }): ChartResultEntry[] {
    const monthlyInterest = Math.pow(1 + interest / 100, 1 / 12) - 1; // interest / 12 / 100;
    const periods = mortgageDuration * 12;
    const annuity =
      (monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -periods))) *
      mortgageAmount;

    const yearlyAnnuity = annuity * 12;
    /** @type {ChartResult[]} */
    const resultData = [];
    for (let i = 1; i <= mortgageDuration; i += 1) {
      const monthResults = [];
      // Loop over months
      for (let j = 1; j <= 12; j += 1) {
        const paidForInterestInMonth = mortgageAmount * monthlyInterest;
        monthResults.push({
          monthlyInterest: paidForInterestInMonth,
          monthlyRedemption: annuity - paidForInterestInMonth,
        });
      }

      let yearlyInterest = 0;
      let yearlyRedemption = 0;
      monthResults.forEach((entry) => {
        yearlyInterest += entry.monthlyInterest;
        yearlyRedemption += entry.monthlyRedemption;
      });

      resultData.push({
        time: `${i}`,
        value: yearlyAnnuity * i,
        yearlyInterest,
        yearlyRedemption,
      });
    }
    return resultData;
  }

  private __computeChartData() {
    const {
      context: {currentRent},
    } = this._model;

    /** @type {ChartResult[]} */
    const resultData = [];

    this.__activeRows.forEach((mortgageName) => {
      const {mortgageAmount, interest, mortgageType, mortgageDuration} =
        this._model[mortgageName];

      console.log(mortgageName, {
        mortgageAmount,
        interest,
        mortgageType,
        mortgageDuration,
      });

      const form = this.refs.form.value;
      const label = form.formElements[mortgageName].label;

      if (mortgageType === 'linear') {
        resultData.push({
          name: label,
          values: this.__calculateLinear({
            mortgageDuration,
            mortgageAmount,
            interest,
          }),
        });
      } else {
        // if (mortgageType === 'annuity'){
        resultData.push({
          name: label,
          values: this.__calculateAnnuity({
            mortgageDuration,
            interest,
            mortgageAmount,
          }),
        });
      }
    });

    const mortgageDuration = 30;
    resultData.push({
      name: 'currentRent',
      values: this.__calculateCurrentRent({mortgageDuration, currentRent}),
    });

    this.__chartData = resultData;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
