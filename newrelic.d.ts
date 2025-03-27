/* eslint-disable */

declare module "newrelic";

interface Window {
  newrelic?: {
    setPageViewName: (name: string) => void;
    noticePageView: (url: string) => void;
    addPageAction: (name: string, attributes?: Record<string, any>) => void;
    setCustomAttribute: (key: string, value: any) => void;
    noticeError: (
      error: Error | string,
      customAttributes?: Record<string, any>,
    ) => void;
    setUserId: (userId: string) => void;
    interaction: (actionName: string) => void;
    finished: (callback: () => void) => void;
    setErrorHandler: (fn: (error: Error) => void) => void;
    setApplicationVersion: (version: string) => void;
  };
  NREUM?: any;
}
