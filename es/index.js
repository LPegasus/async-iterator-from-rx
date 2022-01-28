import { Subject, asyncScheduler, observeOn, takeUntil, } from "rxjs";
export function asyncIteratorFromRx($) {
    const killer$ = new Subject();
    const ctx = {
        p: null,
        resolve: null,
        reject: null,
        g: null,
        generatorState: "suspended",
    };
    async function* gen() {
        while (ctx.generatorState !== "closed") {
            ctx.p = new Promise((_r, _j) => {
                ctx.resolve = _r;
                ctx.reject = _j;
            });
            try {
                const result = await ctx.p;
                if (ctx.generatorState === "closed") {
                    return;
                }
                yield result;
            }
            catch (e) {
                ctx.generatorState = "closed";
                throw e;
            }
        }
    }
    $.pipe(observeOn(asyncScheduler), takeUntil(killer$)).subscribe({
        next: (v) => {
            ctx.resolve(v);
        },
        error: (err) => {
            ctx.reject(err);
        },
        complete: () => {
            ctx.generatorState = "closed";
            ctx.resolve();
        },
    });
    const g = gen();
    const _originNext = g.next;
    const _originThrow = g.throw;
    g.next = async () => {
        const v = await _originNext.call(g);
        return v;
    };
    g.return = () => {
        killer$.next();
        killer$.complete();
        ctx.generatorState = "closed";
        return Promise.resolve({ done: true, value: undefined });
    };
    return g;
}
//# sourceMappingURL=index.js.map