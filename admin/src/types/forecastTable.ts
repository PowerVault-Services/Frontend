export interface TableColumn {
  key: string;
  label: string;
}

export interface ForecastTableConfig {
  fixedColumn: TableColumn;
  columns: TableColumn[];
  rows: string[];
}
