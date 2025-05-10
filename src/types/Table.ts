export interface Column {
    header: string;
    accessor: string;
    render?: (value: any, row: any, index?: number) => React.ReactNode;
  }