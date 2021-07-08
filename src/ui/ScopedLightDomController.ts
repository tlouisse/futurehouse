import {ReactiveController, ReactiveControllerHost} from 'lit';

export class ScopedLightDomController implements ReactiveController {
  host: ReactiveControllerHost;
  private __lightTagNames: string[];

  constructor(host: ReactiveControllerHost, tagNames: string[]) {
    (this.host = host).addController(this);
    this.__lightTagNames = tagNames;
  }

  hostConnected() {
    const registry = this.__findClosestParentRegistry();

    // @ts-expect-error
    Object.entries(this.host.constructor.scopedElements).forEach(
      ([tagName, klass]) => {
        if (this.__lightTagNames.includes(tagName)) {
          if (!registry.get(tagName)) {
            // @ts-expect-error
            registry.define(tagName, klass);
          } else {
            console.warn(`${tagName} already registered`);
          }
        }
      }
    );
  }

  private __findClosestParentRegistry(): CustomElementRegistry {
    // @ts-expect-error
    const rootNodeHost = this.host.getRootNode().host;
    // TODO: If I'm right there is no dom tree inheritance.
    // Else, we need to add a while loop that finds nearest ancestor registry
    return rootNodeHost?.registry ? rootNodeHost : window.customElements;
  }
}
