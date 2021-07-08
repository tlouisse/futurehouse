export class ScopedLightDomController {
    constructor(host, tagNames) {
        (this.host = host).addController(this);
        this.__lightTagNames = tagNames;
    }
    hostConnected() {
        const registry = this.__findClosestParentRegistry();
        // @ts-expect-error
        Object.entries(this.host.constructor.scopedElements).forEach(([tagName, klass]) => {
            if (this.__lightTagNames.includes(tagName)) {
                if (!registry.get(tagName)) {
                    // @ts-expect-error
                    registry.define(tagName, klass);
                }
                else {
                    console.warn(`${tagName} already registered`);
                }
            }
        });
    }
    __findClosestParentRegistry() {
        // @ts-expect-error
        const rootNodeHost = this.host.getRootNode().host;
        // TODO: If I'm right there is no dom tree inheritance.
        // Else, we need to add a while loop that finds nearest ancestor registry
        return (rootNodeHost === null || rootNodeHost === void 0 ? void 0 : rootNodeHost.registry) ? rootNodeHost : window.customElements;
    }
}
//# sourceMappingURL=ScopedLightDomController.js.map