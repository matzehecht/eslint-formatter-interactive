import { COLUMN_PADDING } from './constants.js';
import { transpose } from './utils.js';

type BaseHeaderDefinitions<Columns extends string> = readonly {
  key: Columns;
  label: string;
}[];

type BaseTableData<Columns extends string> = Record<Columns, string>[];

export const formatTable = <Columns extends string>(
  headerDefinitions: BaseHeaderDefinitions<Columns>,
  tableData: BaseTableData<Columns>,
) => {
  const columns = headerDefinitions.map(({ key, label }) => [label, ...tableData.map((row) => row[key])]);
  const alignedColumns = columns.map((column) => {
    const longest = Math.max(...column.map((value) => value.length));
    return column.map((value) => value.padEnd(longest + COLUMN_PADDING));
  });

  const rows = transpose(alignedColumns);

  return rows.map((row) => row.join(''));
};
