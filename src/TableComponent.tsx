import React from 'react';
import clsx from 'clsx';
import {createStyles, lighten, makeStyles, Theme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {Condition} from "./Admin";

interface Data {
  rateConditionKey: string;
  targetType: string;
  loanLocationType: string;
  loanPeriodMin: number;
  loanPeriodMax: number;
  loanSizeMin: number;
  loanSizeMax: number;
  standard: number;
  preferred: number;
  priority: number;
  top_priority: number;
}

function createData(
    rateConditionKey: string,
    targetType: string,
    loanLocationType: string,
    loanPeriodMin: number,
    loanPeriodMax: number,
    loanSizeMin: number,
    loanSizeMax: number,
    standard: number,
    preferred: number,
    priority: number,
    top_priority: number,
): Data {
  return {
    rateConditionKey,
    targetType,
    loanLocationType,
    loanPeriodMin,
    loanPeriodMax,
    loanSizeMin,
    loanSizeMax,
    standard,
    preferred,
    priority,
    top_priority
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {id: 'targetType', numeric: false, disablePadding: true, label: '종목 '},
  {id: 'loanLocationType', numeric: true, disablePadding: false, label: '장소'},
  {id: 'loanPeriodMin', numeric: true, disablePadding: false, label: '기간 최소'},
  {id: 'loanPeriodMax', numeric: true, disablePadding: false, label: '기간 최대'},
  {id: 'loanSizeMin', numeric: true, disablePadding: false, label: '금액 최소'},
  {id: 'loanSizeMax', numeric: true, disablePadding: false, label: '금액 최대'},
  {id: 'standard', numeric: true, disablePadding: false, label: 'STANDARD'},
  {id: 'preferred', numeric: true, disablePadding: false, label: 'PREFERRED'},
  {id: 'priority', numeric: true, disablePadding: false, label: 'PRIORITY'},
  {id: 'top_priority', numeric: true, disablePadding: false, label: 'TOP_PRIORITY'},
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;

}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{'aria-label': 'select all desserts'}}
            />
          </TableCell>
          {headCells.map((headCell) => (
              <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
          ))}
        </TableRow>
      </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
      },
      highlight:
          theme.palette.type === 'light'
              ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
              }
              : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
              },
      title: {
        flex: '1 1 100%',
      },
    }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {numSelected} = props;
  const deleteButton = () => {
    console.log('delete')
  }
  return (
      <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0,
          })}
      >
        {numSelected > 0 ? (
            <Tooltip title="Delete">

              <IconButton aria-label="delete" onClick={deleteButton}>

                <DeleteIcon/>
              </IconButton>
            </Tooltip>
        ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="filter list">
                <FilterListIcon/>
              </IconButton>
            </Tooltip>
        )}
      </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        width: '100%',
      },
      paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
      },
      table: {
        minWidth: 750,
      },
      visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
      },
    }),
);
interface EnhancedTableProp {
  conditions: Condition[];
}
interface GradeType{
  STANDARD : number,
  PREFERRED: number,
  PRIORITY: number,
  TOP_PRIORITY: number
}
export default function EnhancedTable(props: EnhancedTableProp) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('standard');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const arr:Data[] = [];
  props.conditions.forEach(con => {
    const grade :GradeType = {STANDARD : 0, PREFERRED: 0, PRIORITY:0,TOP_PRIORITY: 0};
    // @ts-ignore
    con.rates.forEach(rate => grade[rate.grade] = rate.rate)
    arr.push(
        createData(
            con.rateConditionKey, con.targetType, con.loanLocationType,
            con.minPeriod, con.maxPeriod, con.minSize, con.maxSize,
            grade.STANDARD,
            grade.PREFERRED,
            grade.PRIORITY,
            grade.TOP_PRIORITY))
  })
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = arr.map((n) => n.targetType);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, arr.length - page * rowsPerPage);

  return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length}/>
          <TableContainer>
            <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={'small'}
                aria-label="enhanced table"
            >
              <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={arr.length}
              />
              <TableBody>
                {stableSort(arr, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.rateConditionKey);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                      <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.rateConditionKey)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.rateConditionKey}
                          selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                              checked={isItemSelected}
                              inputProps={{'aria-labelledby': labelId}}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.targetType}
                        </TableCell>
                        <TableCell align="right">{row.loanLocationType}</TableCell>
                        <TableCell align="right">{row.loanPeriodMin}</TableCell>
                        <TableCell align="right">{row.loanPeriodMax}</TableCell>
                        <TableCell align="right">{row.loanSizeMin}</TableCell>
                        <TableCell align="right">{row.loanSizeMax}</TableCell>
                        <TableCell align="right">{row.standard}</TableCell>
                        <TableCell align="right">{row.preferred}</TableCell>
                        <TableCell align="right">{row.priority}</TableCell>
                        <TableCell align="right">{row.top_priority}</TableCell>
                      </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                    <TableRow style={{height: (33) * emptyRows}}>
                      <TableCell colSpan={6}/>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={arr.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

      </div>
  );
}
