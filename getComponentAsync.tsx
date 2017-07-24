import * as  React from 'react';

export type ModuleNamespace<T> = any; // TODO

/** Props passed to the loading component */
export interface LoadingProps {
    isLoading: boolean;
    error: any;
    timedOut: boolean;
}

export interface GetComponentAsyncConfiguration<T> {
    /** A function that returns promise of a module namespace or a module namespace */
    loader: () => Promise<ModuleNamespace<T>> & { resolvedValue?: ModuleNamespace<T> };
    /** Props to pass to loaded component */
    props?: T;
    /** Loading component */
    loading?: React.ComponentType<LoadingProps>;
    /** Exported member of module returned by the loader function */
    exportKey?: string;
    /** Timeout to give up loading (in milliseconds) */
    timeout?: number;
}

/**
 * Get a component asynchronously by providing a loader function that resolves to the module that contains
 * the component.
 */
export function getComponentAsync<T>(getComponentAsyncProps: GetComponentAsyncConfiguration<T>) {

    return class AsyncComponent extends React.Component<{}, { ResultComponent: React.ComponentType<T> }> {
        state = { ResultComponent: null as any };

        componentWillMount() {
            const exportKey = getComponentAsyncProps.exportKey || 'default';
            const loaderResult = getComponentAsyncProps.loader();
            if (loaderResult.resolvedValue) {
                this.setState({ ResultComponent: loaderResult.resolvedValue[exportKey] });
            } else {
                loaderResult.then(result => {
                    this.setState({ ResultComponent: result[exportKey] });
                });
            }
        }

        render() {
            // TODO: Timeout
            if (this.state.ResultComponent) {
                return <this.state.ResultComponent />
            }
            if (getComponentAsyncProps.loading) {
                return <getComponentAsyncProps.loading isLoading={true} error={null} timedOut={false} />
            }
            return null;
        }
    }
}

