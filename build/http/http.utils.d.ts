export declare const postRequest: <T>(url: string, requestBody?: Record<string, unknown> | undefined, token?: string | undefined, headers?: Record<string, unknown>) => Promise<T>;
export declare const getRequest: <T>(url: string, token?: string | undefined, headers?: Record<string, unknown>) => Promise<T>;
export declare const promiseAny: <T>(iterable: Array<Promise<any>>) => Promise<T>;
