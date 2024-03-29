const rows = [
  // { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'tags', numeric: false, disablePadding: false, label: 'Tags' },
  { id: 'assetCount', numeric: true, disablePadding: false, label: 'Asset Count'},
  { id: 'annotatedCount', numeric: true, disablePadding: false, label: 'Annotated'},
  { id: 'assetClassesCount', numeric: true, disablePadding: false, label: 'Classes'},
  { id: 'distribution', numeric: false, disablePadding: true, label: 'Stats'},
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Created' },
  { id: 'edit', numeric: false, disablePadding: false, label: 'Action' },
];

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

export {
  rows,
  desc,
  stableSort,
  getSorting,
};
