declare module 'flv.js' {
  interface flvObj {
    attachMediaElement(value: any): void;
    [P: string]: any;
  }

  interface flvApi {
    createPlayer(mediaSouce: any, option: any): flvObj;
    [P: string]: any;
  }

  declare const flvJs: flvApi;
  export default flvJs;
}
