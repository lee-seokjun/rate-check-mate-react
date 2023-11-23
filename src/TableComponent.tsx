import React from 'react';
import clsx from 'clsx';
import {createStyles, lighten, makeStyles, Theme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@mui/icons-material/Check';
import {pink} from "@mui/material/colors";

export interface Data {
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
  topPriority: number;
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
  {id: 'targetType', numeric: false, disablePadding: false, label: '종목 '},
  {id: 'loanLocationType', numeric: false, disablePadding: false, label: '장소'},
  {id: 'loanPeriodMin', numeric: true, disablePadding: false, label: '기간 최소'},
  {id: 'loanPeriodMax', numeric: true, disablePadding: false, label: '기간 최대'},
  {id: 'loanSizeMin', numeric: true, disablePadding: false, label: '금액 최소'},
  {id: 'loanSizeMax', numeric: true, disablePadding: false, label: '금액 최대'},
  {id: 'standard', numeric: true, disablePadding: false, label: 'STANDARD'},
  {id: 'preferred', numeric: true, disablePadding: false, label: 'PREFERRED'},
  {id: 'priority', numeric: true, disablePadding: false, label: 'PRIORITY'},
  {id: 'topPriority', numeric: true, disablePadding: false, label: 'TOP_PRIORITY'},
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
  numSelected: Data[];
  setData: (value: Data[]) => void;
  register: (value: Data[]) => void;
  remove: (value: string) => void;
  data: Data[];
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {numSelected} = props;
  const deleteButton = () => {
    numSelected.forEach(numSelected => props.remove(numSelected.rateConditionKey));
  }
  const copyButton = () => {
    props.register(numSelected);
  }
  return (
      <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: numSelected.length > 0,
          })}
      >
        {numSelected.length > 0 && (
            <div>
              <Tooltip title="Delete">

                <IconButton aria-label="delete" onClick={deleteButton}>
                  <DeleteIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="copy">

                <IconButton aria-label="copy" onClick={copyButton}>
                  <ContentCopyIcon/>
                </IconButton>
              </Tooltip>
            </div>
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
  data: Data[];
  setData: (value: Data[]) => void;
  register: (value: Data[]) => void;
  remove: (value: string) => void;
  companyId: string;
  update: (value: Data[]) => void;
}

export default function EnhancedTable(props: EnhancedTableProp) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('standard');
  const [selected, setSelected] = React.useState<Data[]>([]);
  const [now, setNow] = React.useState(0);
  const [nowFocus, setNowFocus] = React.useState('');
  const data = props.data;

  if (selected.length > 0) {
    if (data.findIndex(d => d.rateConditionKey === selected[0].rateConditionKey) === -1) {
      setSelected([]);
    }
  }


  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.findIndex(v => v.rateConditionKey === name);
    const dataIndex = data.findIndex(v => v.rateConditionKey === name);
    let newSelected: Data[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, data[dataIndex]);
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


  // const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const isSelected = (name: string) => selected.findIndex(v => v.rateConditionKey === name) !== -1;


  const onChangeValue = (e: any) => {
    const target = e.target.name.split('_');
    const index = data.findIndex(v => v.rateConditionKey === target[0]);
    if (e.target.value > 999999999999999) {
      return;
    }
    setNow(e.target.value);
    setNowFocus(e.target.name);

    switch (target[1]) {
      case 'targetType':
        data[index].targetType = e.target.value;
        break;
      case 'loanLocationType':
        data[index].loanLocationType = e.target.value;
        break;
      case 'loanPeriodMin':
        data[index].loanPeriodMin = e.target.value;
        break;
      case 'loanPeriodMax':
        data[index].loanPeriodMax = e.target.value;
        break;
      case 'loanSizeMin':
        data[index].loanSizeMin = e.target.value;
        break;
      case 'loanSizeMax':
        data[index].loanSizeMax = e.target.value;
        break;
      case 'standard':
        data[index].standard = e.target.value;
        break;
      case 'preferred':
        data[index].preferred = e.target.value;
        break;
      case 'priority':
        data[index].priority = e.target.value;
        break;
      case 'topPriority':
        data[index].topPriority = e.target.value;
        break;
    }
    props.setData(data);
  }
  const isFocus = (key: string) => {
    return nowFocus !== key
  }
  const addButtonClick = () => {
    props.register([]);
  }
  const updateClick = () => {
    props.update(data);
  }

  return (
      <div className={classes.root}>
        <EnhancedTableToolbar numSelected={selected} setData={props.setData} data={data}
                              register={props.register} remove={props.remove}/>
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
                rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
              .map((row, index) => {
                const isItemSelected = isSelected(row.rateConditionKey);
                const labelId = `enhanced-table-checkbox-${index}`;
                const idx = data.findIndex(v => v.rateConditionKey === row.rateConditionKey)
                return (
                    <TableRow
                        hover
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
                            onClick={(event) => handleClick(event, row.rateConditionKey)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Select
                            sx={{
                              width: 100,
                              height: 30,
                            }}
                            value={data[idx].targetType}
                            onChange={onChangeValue}
                            name={`${row.rateConditionKey}_targetType`}
                        >
                          <MenuItem key={'STOCK'} value={'STOCK'}> 주식 </MenuItem>
                          <MenuItem key={'FUND'} value={'FUND'}> 펀드 </MenuItem>
                          <MenuItem key={'BOND3'} value={'BOND'}> 채권 </MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="right"> <Select
                          sx={{
                            width: 150,
                            height: 30,
                          }}
                          onChange={onChangeValue}
                          value={data[idx].loanLocationType}
                          name={`${row.rateConditionKey}_loanLocationType`}
                      >
                        <MenuItem key={'OFFICE'} value={'OFFICE'}> 지점 </MenuItem>
                        <MenuItem key={'ONLINE'} value={'ONLINE'}> 온라인 </MenuItem>
                        <MenuItem key={'ALL'} value={'ALL'}> 상관 없음 </MenuItem>
                      </Select></TableCell>
                      <TableCell align="right">
                        <TextField type="number" style={{width: 50}}
                                   value={!isFocus(row.rateConditionKey + '_loanPeriodMin') ? now : data[idx].loanPeriodMin}
                                   name={`${row.rateConditionKey}_loanPeriodMin`}
                                   onChange={onChangeValue}/>
                      </TableCell>
                      <TableCell align="right">
                        <TextField type="number" style={{width: 150}}
                                   value={!isFocus(row.rateConditionKey + '_loanPeriodMax') ? now : data[idx].loanPeriodMax}
                                   name={`${row.rateConditionKey}_loanPeriodMax`}
                                   onChange={onChangeValue}/></TableCell>
                      <TableCell align="right">
                        <TextField type="number" style={{width: 50}}
                                   value={!isFocus(row.rateConditionKey + '_loanSizeMin') ? now : data[idx].loanSizeMin}
                                   name={`${row.rateConditionKey}_loanSizeMin`}
                                   onChange={onChangeValue}/></TableCell>
                      <TableCell align="right">
                        <TextField type="number" style={{width: 100}}
                                   value={!isFocus(row.rateConditionKey + '_loanSizeMax') ? now : data[idx].loanSizeMax}
                                   name={`${row.rateConditionKey}_loanSizeMax`}
                                   onChange={onChangeValue}/></TableCell>
                      <TableCell align="right">
                        <TextField type="number" style={{width: 50}}
                                   value={!isFocus(row.rateConditionKey + '_standard') ? now : data[idx].standard}
                                   inputProps={{step: "0.01"}}
                                   name={`${row.rateConditionKey}_standard`}
                                   onChange={onChangeValue}/></TableCell>
                      <TableCell align="right">
                        <TextField type="number" style={{width: 50}}
                                   value={!isFocus(row.rateConditionKey + '_preferred') ? now : data[idx].preferred}
                                   inputProps={{step: "0.01"}}
                                   name={`${row.rateConditionKey}_preferred`}
                                   onChange={onChangeValue}/></TableCell>
                      <TableCell align="right">
                        <TextField type="number" style={{width: 50}}
                                   value={!isFocus(row.rateConditionKey + '_priority') ? now : data[idx].priority}
                                   inputProps={{step: "0.01"}}
                                   name={`${row.rateConditionKey}_priority`}
                                   onChange={onChangeValue}/></TableCell>
                      <TableCell align="right">
                        <TextField type="number" style={{width: 50}}
                                   value={!isFocus(row.rateConditionKey + '_topPriority') ? now : data[idx].topPriority}
                                   inputProps={{step: "0.01"}}
                                   name={`${row.rateConditionKey}_topPriority`}
                                   onChange={onChangeValue}/></TableCell>
                    </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <IconButton aria-label="add" onClick={addButtonClick}>
                    <AddIcon sx={{color: pink[500]}}/>
                  </IconButton>
                </TableCell>

              </TableRow>
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <IconButton aria-label="add" onClick={updateClick}>
                    <CheckIcon color={'success'}/>
                  </IconButton>
                </TableCell>

              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

      </div>
  );
}
