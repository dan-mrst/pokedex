export class Vector {
  private _norm: number;
  private _elevation: number;

  constructor(public readonly x: number, public readonly y: number) {
    this._elevation = Math.atan2(this.y, this.x);
    this._norm = Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get norm() {
    return this._norm;
  }
  get elevation() {
    return this._elevation;
  }

  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y);
  }
  sub(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y);
  }
  mult(t: number) {
    return new Vector(t * this.x, t * this.y);
  }
  dot(v: Vector) {
    return this.x * v.x + this.y * v.y;
  }

  normalize() {
    return this.norm > 0 ? this.mult(1 / this.norm) : new Vector(0, 0);
  }
  scale(s: number) {
    return this.normalize().mult(s);
  }
}
