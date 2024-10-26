import { createStore, createEffect, sample } from "effector";

const getUserIdsFx = createEffect(async () => [1, 2, 3]);

const getPostsByUserIdsFx = createEffect((ids: number[]) => {
  return Promise.all(
    ids.map(async (id) => {
      debugger;
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
      const posts = await res.json();
      return { id, posts };
    })
  );
});

sample({
  clock: getUserIdsFx.doneData,
  target: getPostsByUserIdsFx,
  fn: (data) => {
    debugger;
    return data;
  }
});

const postGroups = createStore([]).on(getPostsByUserIdsFx.doneData, (list, result) => {
  debugger;
  return [...list, ...result];
});

const main = async () => {
  postGroups.watch((list) => {
    debugger;
    console.log(list);
  });
  await getUserIdsFx();
};

main();
