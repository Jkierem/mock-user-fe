export class Iso<S, A> {
  private constructor(public view: (s: S) => A, public review: (a: A) => S) {}

  static make<S, A>(view: (s: S) => A, review: (a: A) => S): Iso<S, A> {
    return new Iso(view, review)
  }

  static id<A, S>() {
    return new Iso<A, S>(
      (x) => x as unknown as S,
      (x) => x as unknown as A,
    )
  }

  /**
   * Terse operator of through.
   * Combine Iso<A,B> and Iso<B,C> into a new Iso<A,C>
   * @param other
   */
  ['>>']<B>(other: Iso<A, B>): Iso<S, B> {
    return this.through(other)
  }

  /**
   * Combine Iso<A,B> and Iso<B,C> into a new Iso<A,C>
   * @param other
   */
  through<B>(other: Iso<A, B>): Iso<S, B> {
    return new Iso(
      (s: S) => other.view(this.view(s)),
      (b: B) => this.review(other.review(b)),
    )
  }
}
