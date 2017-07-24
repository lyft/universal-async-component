/// <reference path="./global.d.ts" />

import * as React from 'react';

export interface CaptureChunksProps {
    /** Output of webpack stats when "chunks" filed is enabled */
    statsChunks: Array<{
        id: string;
        modules: Array<{
            name: string;
            id: string;
        }>;
    }>;
    /** Pass an empty array to get required chunks pushed to it */
    additionalChunks: Array<string>;
}

/**
 * Capture additional chunks required to render the children.
 * This works with the SyncImportServer TypeScript transformer and UniversalLazyComponent components
 */
export const CaptureChunks: React.StatelessComponent<CaptureChunksProps> =
({ statsChunks, additionalChunks, children }) => {
    if (typeof global !== 'undefined') {
        global.__webpack_report_dynamic_module__ = (moduleId) => {
            statsChunks.forEach(chunk => {
                chunk.modules.forEach(module => {
                    if (module.id === moduleId) {
                        additionalChunks.push(chunk.id);
                    }
                });
            });
        }
    }
    return React.Children.only(children);
}
