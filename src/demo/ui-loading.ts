import { createEffect, createStore, sample } from "effector";

const answerFx = createEffect(async () => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.5) {
        resolve("Answer is 42");
      } else {
        reject({ message: "Something went wrong" });
      }
    }, 1000);
  });
});

const $answer = createStore("").on(answerFx.doneData, (_, data) => data);

const $pending = createStore(false)
  .on(answerFx, () => true)
  .on(answerFx.done, () => false)
  .on(answerFx.fail, () => false);

const $error = createStore("")
  .on(answerFx.failData, (_, data) => data.message)
  .reset(answerFx.done);

window.addEventListener("load", async () => {
  const indicatorElement = document.querySelector("#indicator");
  const dataElement = document.querySelector("#data");
  const errorElement = document.querySelector("#error");

  $pending.watch((pending) => {
    indicatorElement.innerHTML = pending ? "LOADING" : "";
  });
  $answer.watch((data) => {
    dataElement.innerHTML = data;
  });
  $error.watch((error) => {
    errorElement.innerHTML = error;
  });

  await answerFx();
});
