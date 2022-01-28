# async-iterator-from-rx

A tool to convert RxJS style observable stream asyncGenerator.

## Motivation

RxJS is not so common compare with async/await and it's hard to learn. This tool can help user who is not so familiar with observable to use observables in async/await way.

[![npm version](https://badge.fury.io/js/async-iterator-from-rx.svg)](https://www.npmjs.com/package/async-iterator-from-rx)[![build](https://img.shields.io/circleci/build/github/LPegasus/async-iterator-from-rx/main?style=flat-square)](https://app.circleci.com/pipelines/github/LPegasus/async-iterator-from-rx?branch=main&filter=all)[![coverage](https://img.shields.io/codecov/c/github/LPegasus/async-iterator-from-rx.svg?style=flat-square)](https://codecov.io/gh/LPegasus/async-iterator-from-rx)[![install size](https://packagephobia.now.sh/badge?p=async-iterator-from-rx)](https://packagephobia.now.sh/result?p=async-iterator-from-rx)[![MINIFIED](https://img.shields.io/bundlephobia/minzip/async-iterator-from-rx?style=flat-square)](https://bundlephobia.com/result?p=async-iterator-from-rx)

## Install

`npm i -S rx-from-async-iterator tslib rxjs`

## Example

### Simple usage

For example, we need to collect 10 user touch points when in some case. And we've already have a click stream. Use `asyncIteratorFromRx` to convert stream to asyncIterator so that you can use `for await ... of` syntax to process the stream signal.

```typescript
import { asyncIteratorFromRx } from "async-iterator-from-rx";
import { fromEvent } from "rxjs";

const click$ = fromEvent("pointerdown", document.body); // A click stream.

async function batchCollectByCount(count: number) {
  const clickTrace: Array<[x: number, y: number]> = [];
  const clickIterator = asyncIteratorFromRx(click$); // Convert click stream to an asyncIterator
  for await (const evt of clickIterator) {
    // use `for await ... of` to scan the click stream
    clickTrace.push([evt.x, evt.y]);
    if (clickTrace.length === count) {
      break;
    }
  }
  return clickTrace;
}

batchCollectByCount(10).then(uploadClickTrace);
```
