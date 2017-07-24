const replace =
`/* import($1) */(function() {
    var __module_id__ = require.resolveWeak($1)
    var __module_sync__
    if (__webpack_modules__ && __webpack_modules__[__module_id__]) {
        if (typeof global !== "undefined" && typeof global.__webpack_report_dynamic_module__ === "function") {
            global.__webpack_report_dynamic_module__(__module_id__)
        }
        __module_sync__ = __webpack_require__(__module_id__);
    }
    var __promise__ = import($1)
    if (__module_sync__) { __promise__.resolvedValue = __module_sync__; }
    return __promise__;

})()`;

/** Provide this option object to "string-replace-loader" */
export const stringReplaceLoaderOptions =  {
    // This is a big hack until this issue is resolved:
    // https://github.com/webpack/webpack/issues/5344
    search: /import\((.*)\)/,
    replace,
};
