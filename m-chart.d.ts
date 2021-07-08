import { LitElement } from 'lit';
import { RefOrCallback } from 'lit/directives/ref.js';
import './ui/index.js';
/**
 */
export declare class MyElement extends LitElement {
    protected _interest: number;
    protected _mortgageType: string;
    protected _inflation: number;
    /**
     * Percentage of house price, measured from today, based on selected predictionStrategy
     */
    housePrice: number;
    /**
     * Can be 'monetarist' or 'keynesian'
     * Depending on strategy chosen, a different inflation rate and house price will be chosen
     */
    school: string;
    protected refs: {
        [key: string]: RefOrCallback;
    };
    private __schools;
    private __durations;
    static styles: import("lit").CSSResultGroup;
    protected _model: {
        housePrice: number;
        currentRent: number;
        mortgageDuration: number;
        economicSchool: string;
        interest: number;
    };
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'my-element': MyElement;
    }
}
//# sourceMappingURL=m-chart.d.ts.map