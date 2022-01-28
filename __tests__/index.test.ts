import { finalize, first, interval, map, Subject, take, takeUntil } from "rxjs";
import { asyncIteratorFromRx } from "../src/index";

it("convert stream and run until complete", async () => {
  const timer$ = interval(50).pipe(take(10));

  let index = 0;
  for await (const i of asyncIteratorFromRx(timer$)) {
    expect(i).toBe(index++);
  }
  expect(index).toBe(10);
});

it("convert stream with error", async () => {
  const errInstance = new Error("Over 5 is not allowed");
  const timer$ = interval(50).pipe(
    map((i) => {
      if (i <= 5) {
        return i;
      }
      throw errInstance;
    })
  );

  const results: number[] = [];
  try {
    for await (const i of asyncIteratorFromRx(timer$)) {
      results.push(i);
    }
    throw new Error("Should not run this statement.");
  } catch (e: any) {
    expect(results).toEqual([0, 1, 2, 3, 4, 5]);
    expect(e).toBe(errInstance);
  }
});

it("convert stream with interrupt and run success", async () => {
  const killer$ = new Subject<void>();
  const timer$ = interval(50).pipe(takeUntil(killer$.pipe(first())));

  setTimeout(() => {
    killer$.next();
  }, 180);

  const results: number[] = [];

  for await (const i of asyncIteratorFromRx(timer$)) {
    results.push(i);
  }

  expect(results).toEqual([0, 1, 2]);
});

it("convert stream and run with interrupt, stream should closed as unsubscribe", async () => {
  let streamClosed = false;
  const timer$ = interval(50).pipe(
    finalize(() => {
      streamClosed = true;
    })
  );

  const results: number[] = [];
  for await (const i of asyncIteratorFromRx(timer$)) {
    if (i >= 5) {
      break;
    }
    results.push(i);
  }
  expect(streamClosed).toBe(true);
  expect(results).toEqual([0, 1, 2, 3, 4]);
});
