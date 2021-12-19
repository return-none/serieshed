export const debounce = (fn: () => void, delay: number) => {
  let timeout: any = -1;

  return (...args: any[]) => {
    if (timeout !== -1) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(fn, delay, ...args);
  };
};
