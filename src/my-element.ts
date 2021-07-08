import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {ref, createRef, RefOrCallback} from 'lit/directives/ref.js';
import {MForm} from './ui/index.js';
import './ui/index.js';
import {model} from './ui/utils/ModelDirective';
import './m-chart';

function debounce(func, duration = 0) {
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
  @state()
  private __chartData: Array<{time: number; value: number}> = [];

  protected refs: {[key: string]: RefOrCallback} = {
    form: createRef<MForm>(),
  };

  private __schools = ['keynesian', 'monetarist'];
  private __durations = [20, 30];
  private __mortgageTypes = ['linear']; // add annuiteiten etc,

  @state()
  protected _model = {
    mortgageAmount: 250000,
    interest: 1.51,
    mortgageType: 'linear', // TODO: also add 'annuiteiten'
    currentRent: 10000,
    mortgageDuration: 30,
    economicSchool: 'monetarist',
  };

  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  render() {
    return html`
      <m-form
        ${ref(this.refs.form)}
        ${model(this._model)}
        @model="${debounce(this.__computeChartData)}"
      >
        <form style="display: flex;">
          <m-input-amount
            step="1000"
            label="Mortgage Amount"
            name="mortgageAmount"
            help-text="How much do you want to borrow from the bank?"
          ></m-input-amount>

          <m-input-number
            step="0.01"
            label="Interest Rate Mortgage"
            name="interest"
            help-text="What's the interest rate belonging to your mortgage?"
          ></m-input-number>

          <m-input-amount
            step="10"
            label="Current Rent"
            name="currentRent"
            help-text="How much rent do you pay monthly for your current residence?"
          ></m-input-amount>

          <m-select-rich label="Mortgage Type" name="mortgageType"
            >${this.__mortgageTypes.map(
              (type) => html`
                <m-option .choiceValue="${type}">${type}</m-option>
              `
            )}
          </m-select-rich>

          <m-select-rich
            label="Mortgage Duration (years)"
            name="mortgageDuration"
            >${this.__durations.map(
              (duration) => html`
                <m-option .choiceValue="${duration}">${duration}</m-option>
              `
            )}
          </m-select-rich>

          <m-select-rich label="Economic School" name="economicSchool">
            ${this.__schools.map(
              (school) => html`
                <m-option .choiceValue="${school}">${school}</m-option>
              `
            )}
          </m-select-rich>
        </form>
      </m-form>

      <m-chart .data="${this.__chartData}"></m-chart>
    `;
  }

  private __computeChartData(ev) {
    console.log('__computeChartData', ev);
    const resultData = [];
    const mortgage = this._model.mortgageAmount;
    const years = this._model.mortgageDuration;
    const interest = this._model.interest;

    for (let i = 1; i <= years; i += 1) {
      // linear
      resultData.push({
        time: `${i}`,
        value: (mortgage / years) * (1 + interest / 100) * i,
      });
    }

    this.__chartData = resultData;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
