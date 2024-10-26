import { createStore, createEvent, createDomain, forward, fork, allSettled } from "effector";

const main = async () => {
  const domain = createDomain();
  const inc = domain.createEvent();
  const dec = domain.createEvent();
  const $counter = domain
    .createStore(0)
    .on(inc, (value: number) => value + 1)
    .on(dec, (value: number) => value - 1);

  const scopeA = fork(domain);
  const scopeB = fork(domain);

  await allSettled(inc, { scope: scopeA });
  await allSettled(dec, { scope: scopeB });

  console.log($counter.getState()); // => 0
  console.log(scopeA.getState($counter)); // => 1
  console.log(scopeB.getState($counter)); // => -1
};

main();
