import { createEffect, createStore } from "effector";

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

const $answer = createStore({
  data: "",
  pending: false,
  error: ""
})
  .on(answerFx, (state) => ({
    ...state,
    pending: true
  }))
  .on(answerFx.doneData, (state, data) => ({
    data,
    pending: false,
    error: ""
  }))
  .on(answerFx.failData, (state, error) => ({
    data: "",
    pending: false,
    error: error.message
  }));

window.addEventListener("load", async () => {
  const indicatorElement = document.querySelector("#indicator");
  const dataElement = document.querySelector("#data");
  const errorElement = document.querySelector("#error");

  $answer.watch(({ data, pending, error }) => {
    indicatorElement.innerHTML = pending ? "LOADING" : "";
    dataElement.innerHTML = data;
    errorElement.innerHTML = error;
  });

  await answerFx();
});
