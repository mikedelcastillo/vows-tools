export interface RouterGuardOptions {
    vuexModule?: string;
    keepInKey?: string;
    keepOutKey?: string;
}
export declare const createVueRouterGuard: (store: any, keepIn: Function, keepOut: Function, options?: RouterGuardOptions) => (to: any, from: any, next: any) => any;
