import { Transform, TransformCallback, TransformOptions } from "stream";
export default class HeaderHostTransformer extends Transform {
  private replaced: boolean = false;
  private host: string;
  constructor(opts: TransformOptions & { host?: string }) {
    super(opts);
    this.host = opts.host || "localhost";
    this.replaced = false;
  }

  _transform(data: any, _encoding: BufferEncoding, callback: TransformCallback) {
    callback(
      null,
      this.replaced // after replacing the first instance of the Host header we just become a regular passthrough
        ? data
        : data.toString().replace(/(\r\n[Hh]ost: )\S+/, (_match: string, $1: string) => {
            this.replaced = true;
            return $1 + this.host;
          })
    );
  }
}
