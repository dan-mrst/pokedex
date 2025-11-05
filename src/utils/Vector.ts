/**
 * 2次元ベクトル演算用の簡易的なベクトルクラス
 */
export class Vector {
  private _norm: number;
  private _elevation: number;

  /**
   * 2次元ベクトル空間の基底
   */
  static basis = [new Vector(1, 0), new Vector(0, 1)];

  constructor(public readonly x: number, public readonly y: number) {
    this._elevation = Math.atan2(this.y, this.x);
    this._norm = Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * ノルム（絶対値）
   */
  get norm() {
    return this._norm;
  }

  /**
   * 仰角（水平線からの角度）
   */
  get elevation() {
    return this._elevation;
  }

  /**
   * ベクトル加法
   */
  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y);
  }
  /**
   * ベクトル減法
   */
  sub(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y);
  }
  /**
   * スカラ倍
   */
  mult(t: number) {
    return new Vector(t * this.x, t * this.y);
  }
  /**
   * 内積
   */
  dot(v: Vector) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 正規化
   */
  normalize() {
    return this.norm > 0 ? this.mult(1 / this.norm) : new Vector(0, 0);
  }

  /**
   * 指定の大きさにする
   */
  scale(s: number) {
    return this.normalize().mult(s);
  }
}
