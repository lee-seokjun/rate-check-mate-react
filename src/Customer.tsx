import React, {useState} from 'react';
import './App.css';
import {
    Select,
    MenuItem,
    Box,
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField, styled, Typography, Modal
} from '@mui/material';
import RateCalculator from "./RateCalculator";
import SearchIcon from '@mui/icons-material/Search';
import instance from "./AxiosModule";
import {GradeType} from './Admin';

const UpBox = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

interface moreInfo {
    companyName: string;
    loanLocationType: string;
    rates: GradeType[];
}

function CustomerPage() {
    const [selectedLocation, setSelectedLocation] = useState('ALL');
    const [value, setValue] = React.useState<Collateral | null>(null);
    const [maxLoan, setMaxLoan] = React.useState(0);
    const [loanSize, setLoanSize] = React.useState(0);
    const [loanDay, setLoanDay] = React.useState(0);
    const [searchList, setSearchList] = React.useState<ResponseRateConditionList[]>([]);
    const [modalTitle, setModalStr] = React.useState('');
    const [modalGrade, setModalGrade] = React.useState<GradeType>();

    async function search() { // async, await을 사용하는 경우
        try {
            if (value != null) {
                const response = await instance.get(`/condition?size=${loanSize}&day=${loanDay}&targetCode=${value.code}&loanLocationType=${selectedLocation}`);
                setSearchList(response.data);
            }
        } catch (e) {
            // 실패 시 처리
        }
    }

    async function moreInfo(name: string) { // async, await을 사용하는 경우
        try {
            if (value != null) {
                const response = await instance.get(`/condition/${name}`);
                const grade: GradeType = {STANDARD: 0, PREFERRED: 0, PRIORITY: 0, TOP_PRIORITY: 0};
                // @ts-ignore
                response.data.rates.forEach(rate => grade[rate.grade] = rate.rate)
                const location = response.data.loanLocationType === 'ALL' ? '' : response.data.loanLocationType === 'ONLINE' ? '(온라인)' : '(지점)';
                setModalStr(response.data.companyName + location);
                setModalGrade(grade);
            }
        } catch (e) {
            // 실패 시 처리
        }
    }

    const changeTarget = (target: Collateral | null) => {
        setValue(target);
    }
    const reset = () => {
        setMaxLoan(0);
        setLoanSize(0);
        setLoanDay(0);
        setSearchList([]);
    }
    const changeLocation = (event: any) => {
        setSelectedLocation(event.target.value);
    }
    const changeLoanSize = (event: any) => {
        if (event.target.value > Number(maxLoan)) {
            return;
        }
        setLoanSize(event.target.value);
    }
    const changeLoanDay = (event: any) => {
        setLoanDay(event.target.value);
    }
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = (e: any) => {
        moreInfo(e.target.name).then(() => setOpen(true));
    }
    const handleClose = () => setOpen(false);

    return (
        <div style={{width: '100%'}}>
            <header>

            </header>
            <body>
            <Stack
                direction="column"
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
                width={"100%"}
                marginTop={5}
            >
                <UpBox>
                    <Box><RateCalculator selectedValue={value}
                                         setValue={changeTarget}
                                         maxLoan={maxLoan}
                                         setMaxLoan={setMaxLoan}
                                         reset={reset}

                    /></Box>
                </UpBox>
                {maxLoan !== 0 && <UpBox style={{marginTop: 50}}>
                    <Box>Step2 금리 비교하기
                        <Stack spacing={2} sx={{width: 350}}>
                            <TextField type={"number"} sx={{
                                width: 350,
                            }} label={"대출 금액"}
                                       value={loanSize} onChange={changeLoanSize}/>
                            <TextField type={"number"} sx={{
                                width: 350,
                            }} label={"대출 기간 (일) "}
                                       value={loanDay} onChange={changeLoanDay}/>
                            <Select
                                sx={{
                                    width: 350,
                                    height: 40,
                                }}
                                value={selectedLocation}
                                onChange={changeLocation}
                            >
                                <MenuItem key={'ALL'}
                                          value={'ALL'}
                                >지점, 모바일</MenuItem>
                                <MenuItem key={'OFFICE'}
                                          value={'OFFICE'}
                                >지점</MenuItem>
                                <MenuItem key={'ONLINE'}
                                          value={'ONLINE'}
                                >온라인</MenuItem>
                            </Select>
                        </Stack>
                        <Button
                            style={{
                                width: 350,
                                marginTop: 10
                            }}
                            color={'inherit'} variant={'outlined'}
                            onClick={search}>
                            조회하기 <SearchIcon/></Button>
                    </Box>
                    <Box>
                        <TableContainer component={Paper} style={{marginTop: 50}}>
                            <Table sx={{width: 350}} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow sx={{width: 350}}>
                                        <TableCell>증권사 </TableCell>
                                        <TableCell align="right">금리</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchList.length > 0 &&
                                        searchList.map((v, i) => <>
                                            {v.list.map((v2, i2) =>
                                                <TableRow
                                                    key={v2.rateConditionKey}
                                                    sx={{'&:last-child td, &:last-child th': {border: 0}, width: 400}}

                                                >

                                                    <TableCell component="th">
                                                        <Button onClick={handleOpen} name={v2.rateConditionKey}>
                                                            {v2.companyName} {v2.loanLocationType === 'ALL' ? '' : v2.loanLocationType === 'ONLINE' ? '(온라인)' : '(지점)'}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align="right">{v2.rate}%</TableCell>
                                                </TableRow>
                                            )}</>)
                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Box>
                    <br/>
                </UpBox>}

            </Stack>


            <div>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {modalTitle}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            등급에 따라 다를 수 있음.
                            {modalGrade?.STANDARD !==0 && <div>STANDARD : {modalGrade?.STANDARD} </div>}
                            {modalGrade?.PREFERRED !==0 && <div>PREFERRED : {modalGrade?.PREFERRED} </div>}
                            {modalGrade?.PRIORITY !==0 && <div>PRIORITY : {modalGrade?.PRIORITY} </div>}
                            {modalGrade?.TOP_PRIORITY !==0 && <div>TOP_PRIORITY : {modalGrade?.TOP_PRIORITY} </div>}

                        </Typography>
                    </Box>
                </Modal>
            </div>


            </body>
        </div>
    );
}

export interface ResponseRateCondition {
  companyId: string;
  companyName: string;
  loanLocationType: string;
  rate: number;
  rateConditionKey: string;
  targetType: string;
}

interface ResponseRateConditionList {
  list: ResponseRateCondition[];
}

export interface Collateral {
  collateralKey: string;
  targetType: string;
  targetName: string;
  code: string;
}

export default CustomerPage;
