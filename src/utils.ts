export const transpose = <T>(array: T[][]) => {
  const firstRow = array[0];

  if (!firstRow) {
    return array;
  }

  return firstRow.map((_, i) =>
    array.map((row) => {
      const cell = row[i];

      if (cell === undefined) {
        throw new Error('Row is too short');
      }

      return cell;
    }),
  );
};

/* eslint-disable no-console */
export const print = (message: string): void => {
  console.log(message);
};
/* eslint-enable no-console */
