export const sizeColumns = (minWidth, globalColumnExtensions) =>
  globalColumnExtensions.map(elem => ({
    columnName: elem.columnName,
    width: minWidth * elem.width,
  }));
