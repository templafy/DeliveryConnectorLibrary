
type PromiseCallback<T, A> = (resolve: (result: T) => void, reject: (reason?: A) => void) => void;

export function createTimeoutPromise<T, A>(timeoutMessage: string, ms: number, arg: PromiseCallback<T, A>) {
    return new Promise<T>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(timeoutMessage);
        }, ms);
        const handleResolve = (result: T) => {
            resolve(result);
            clearTimeout(timeout);
        };
        arg(handleResolve, reject);
    });
}

export type PromiseResolver<T> = (data: T) => void;

export function getPromiseAndResolver<TResolveMessage>(): [Promise<TResolveMessage>, PromiseResolver<TResolveMessage>] {
    let promiseResolver!: PromiseResolver<TResolveMessage>;
    const promise = new Promise<TResolveMessage>(resolve => {
        promiseResolver = resolve;
    });
    return [promise, promiseResolver];
}

export function getPromiseRejectedAfter<T>(ms: number) {
    return createTimeoutPromise<T, unknown>("", ms, () => {/*no-op*/});
}
