declare module NodeJS {
    export interface Global {
        /** Report a dynamic module is being required and sent in sync instead */
        __webpack_report_dynamic_module__?: (moduleId: string | number) => void;
    }
}
