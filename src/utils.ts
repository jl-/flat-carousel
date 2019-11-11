interface EventListenerOptions {
    passive?: boolean;
    capture?: boolean;
}

export const isPassiveEventSupported = (() => {
    let isSupported = false;
    try {
        // @ts-ignore
        window.addEventListener('passive', null, {
            get passive() {
                // eslint-disable-next-line no-return-assign
                return (isSupported = true);
            }
        });
    } catch (err) {
        //
    }
    return () => isSupported;
})();

export function coerceEventOptions(options: EventListenerOptions = {}) {
    const passive = isPassiveEventSupported();
    return passive ? options : Boolean(options.capture);
}

export function on(
    el: HTMLElement,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: EventListenerOptions
) {
    el.addEventListener(eventName, handler, coerceEventOptions(options));
}

export function off(
    el: HTMLElement,
    eventName: string,
    handler: EventListenerOrEventListenerObject,
    options?: EventListenerOptions
) {
    el.removeEventListener(eventName, handler, coerceEventOptions(options));
}