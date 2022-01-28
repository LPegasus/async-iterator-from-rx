import { type Observable } from "rxjs";
export declare function asyncIteratorFromRx<T>($: Observable<T>): AsyncGenerator<T, void, void>;
