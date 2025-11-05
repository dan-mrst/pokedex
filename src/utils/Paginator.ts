/**
 * ページネーション情報
 */
export interface PaginationInfo {
  currentPage: number;
  totalCount: number;
  perPage: number;
}

/**
 * ページネーション情報を元にページネーションの適正判定など現在の状態を提供
 */
export class Paginator {
  private _currentPage!: number;
  private _perPage!: number;
  private _totalCount!: number;
  readonly _totalPages!: number;
  constructor(init: PaginationInfo) {
    Object.assign(this, init);
    this._totalPages = Math.ceil(this._totalCount / this._perPage);
  }

  get currentPage() {
    return this._currentPage;
  }
  get perPage() {
    return this._perPage;
  }
  get totalCount() {
    return this._totalCount;
  }
  get totalPages() {
    return this._totalPages;
  }

  set currentPage(_currentPage) {
    this._currentPage = _currentPage;
  }
  set perPage(_perPage) {
    this._perPage = _perPage;
  }
  set totalCount(_totalCount) {
    this._totalCount = _totalCount;
  }

  hasNext = () => this._currentPage + 1 <= this._totalPages;

  hasPrev = () => this._currentPage > 1;

  shouldPaginate = () => this._totalCount > 0;

  isCorrectPage = () =>
    this._totalCount > 0 &&
    this._currentPage > 0 &&
    this._currentPage <= this._totalPages;

  firstItemOfCurrentPage = () => this._perPage * (this._currentPage - 1) + 1;

  lastItemOfCurrentPage = () =>
    Math.min(this._totalCount, this._perPage * this._currentPage);

  /**
   * ページネーションされている全アイテムの番号から現在のページに含まれるか判定
   */
  isItemInCurrentPage = (itemIndex: number) =>
    this._perPage * (this._currentPage - 1) - 1 < itemIndex &&
    itemIndex < this._perPage * this._currentPage;

  /**
   * クエリパラメータpageがなければ1に、数字ならそのまま、NaNなら0に正規化する
   * @param pageParam
   * @returns number
   */
  static getPageByParam = (pageParam: string | undefined) =>
    typeof pageParam === "undefined"
      ? 1
      : isNaN(Number(pageParam))
      ? 0
      : Number(pageParam);
}

/**
 * ページネーション情報と表示範囲の大きさを指定し、ページネーションコンポーネントのボタン省略をコントロール
 */
export class PaginationOmitter extends Paginator {
  private leftBoundary: number;
  private rightBoundary: number;
  constructor(init: PaginationInfo, private range: number) {
    super(init);
    this.leftBoundary = 3; //左端の1 + オフセットの2
    this.rightBoundary = this._totalPages - 2; //右端 - オフセットの2
  }

  /**
   * 左を省略して表示
   */
  shouldShowOmittedLeft = () =>
    this.currentPage - this.range > this.leftBoundary;
  /**
   * 1 … 3 4のような省略は無意味なので左範囲をすべて表示
   * <=> 現在のページの周辺範囲左端がleftBoundary以下にあるとき、p=leftBoundary未満は省略しない
   */
  shouldShowPageInLeft = (p: number) =>
    this.currentPage - this.range <= this.leftBoundary && p < this.leftBoundary;

  /**
   * 基本の表示範囲
   * 現在のページを中心に左右へrange分表示
   */
  isPageWithinRange = (p: number) =>
    p >= this.currentPage - this.range && p <= this.currentPage + this.range;

  /**
   * 7 8 … 10のような省略は無意味なので右範囲をすべて表示
   *  <=> 現在のページの周辺範囲右端がrightBoundary以上にあるとき、p=leftBoundaryより上は省略しない
   */
  shouldShowPageInRight = (p: number) =>
    this.currentPage + this.range >= this.rightBoundary &&
    p > this.rightBoundary;

  /**
   * 右を省略して表示
   */
  shouldShowOmittedRight = () =>
    this.currentPage + this.range < this.rightBoundary;
}
