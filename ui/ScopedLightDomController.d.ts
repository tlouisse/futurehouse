import { ReactiveController, ReactiveControllerHost } from 'lit';
export declare class ScopedLightDomController implements ReactiveController {
    host: ReactiveControllerHost;
    private __lightTagNames;
    constructor(host: ReactiveControllerHost, tagNames: string[]);
    hostConnected(): void;
    private __findClosestParentRegistry;
}
//# sourceMappingURL=ScopedLightDomController.d.ts.map