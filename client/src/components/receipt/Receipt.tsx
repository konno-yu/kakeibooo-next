import * as React from 'react';
import { ReceiptBody } from './ReceiptBody';
import { ReceiptFooter } from './ReceiptFooter';
import { ReceiptHeader } from './ReceiptHeader';
import styled from 'styled-components';
import DailyReceiptModel from './model/DailyReceiptModel';
import { useState } from 'react';
import ReceiptModel from './model/ReceiptModel';
import { useAppDispatch, useAppSelector } from '../../store';
import { ChangeEvent } from 'react';
import { useEffect } from 'react';
import { getDay, getWeekOfMonth } from 'date-fns';
import { WeekIndex } from './model/MonthlyReceiptModel';
import * as ReceiptRest from '../../rest/financeRest';
import { causeError } from '../../reducer/householdBookSlice';
import { CommonSnackbar } from '../common/CommonSnackbar';
import { FiCheckCircle } from 'react-icons/fi';
import { ErrorType, ReceiptErrorDialog } from './ReceiptErrorDialog';


export const Receipt: React.FC = () => {
    const dispatch = useAppDispatch();
    const targetDate = useAppSelector(state => state.householdBook.targetDate);
    const monthlyReceipt = useAppSelector(state => state.householdBook.monthlyReceipt);
    const [dailyReceipt, setDailyReceipt] = useState<DailyReceiptModel>(new DailyReceiptModel(targetDate, []));
    const [snackbarStatus, setSnackbarStatus] = useState<{isShow: boolean, message?: string}>({ isShow: false });
    const [errorDialogStatus, setErrorDialogStatus] = useState<{isShow: boolean, type?: ErrorType}>({ isShow: false });

    useEffect(() => {
        const weekIndex = getWeekOfMonth(targetDate) as WeekIndex;
        const dayIndex = getDay(targetDate);
        const targetDateReceipt = monthlyReceipt.receipts[weekIndex][dayIndex];
        if (targetDateReceipt && targetDateReceipt.getDailyTotalCost() > 0) {
            setDailyReceipt(new DailyReceiptModel(targetDate, targetDateReceipt.receipts));
        } else {
            setDailyReceipt(new DailyReceiptModel(targetDate, []));
        }
    }, [targetDate, monthlyReceipt])

    const onAddReceipt = () => {
        const current = dailyReceipt;
        current.add(new ReceiptModel('', 0));
        setDailyReceipt(new DailyReceiptModel(targetDate, current.receipts));
    }

    const onDeleteReceipt = (ordinary: number) => {
        const current = dailyReceipt;
        current.delete(ordinary);
        setDailyReceipt(new DailyReceiptModel(targetDate, current.receipts));
    }

    const onChangeReceipt = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, target: 'store' | 'cost', ordinary: number) => {
        const current = dailyReceipt;
        const inputText = (event.target as HTMLInputElement).value;
        if (target === 'store') {
            current.receipts[ordinary].storeName = inputText;
        } else {
            current.receipts[ordinary].cost = +inputText;
        }
        setDailyReceipt(new DailyReceiptModel(targetDate, current.receipts));
    }

    const validate = () => {
        if (dailyReceipt.isExistEmptyStore()) {
            setErrorDialogStatus({ isShow: true, type: 'exists_empty_store_name' });
            return false;
        }
        if (dailyReceipt.isExistZeroCost()) {
            setErrorDialogStatus({ isShow: true, type: 'exists_zero_receipt' });
            return false;
        }
        if (dailyReceipt.isExistNaNCost()) {
            setErrorDialogStatus({ isShow: true, type: 'exists_invalid_receipt' });
            return false;
        }
        if (dailyReceipt.isDuplicate()) {
            setErrorDialogStatus({ isShow: true, type: 'exists_duplicate_receipt' });
            return false;
        }
        if (dailyReceipt.isExistSameStore()) {
            setErrorDialogStatus({ isShow: true, type: 'exists_same_store_receipt' });
            return false;
        }
        return true;
    }

    const onClickRegister = () => {
        if (!validate()) {
            return;
        }
        const isPost = monthlyReceipt.receipts[getWeekOfMonth(targetDate) as WeekIndex][getDay(targetDate)].receipts[0].cost === null;
        const dailyCost: { storeName: string, cost: number }[] = [...dailyReceipt.receipts.map(r => r.getDailyCost())];
        if (isPost) {
            ReceiptRest.post({ purchaseDate: targetDate, dailyCost }).then(res => {
                if (res.status === 201) {
                    setIsShowSnackbar(true);
                    setTimeout(() => setIsShowSnackbar(false), 1500);
                    const hoge: ReceiptModel[] = res.data.dailyCost.map(d => new ReceiptModel(d.storeName, d.cost));
                } else {
                    alert('追加時に予期しないエラーが発生しました');
                }
            })
        } else {
            ReceiptRest.update({ purchaseDate: targetDate, dailyCost }).then(res => {
                if (res.status === 200) {
                    setIsShowSnackbar(true);
                    setTimeout(() => setIsShowSnackbar(false), 1500);
                } else {
                    alert('更新時に予期しないエラーが発生しました');
                }
            })
        }
    }

    const onClickNoMoneyDay = () => {
        ReceiptRest.post({ purchaseDate: targetDate, dailyCost: [] }).then(res => {
            if (res.status === 201) {
                setIsShowSnackbar(true);
                setTimeout(() => setIsShowSnackbar(false), 2000);
            } else {
                alert("予期しないエラーが発生しました");
            }
        });
    const onDialogClose = () => {
        setErrorDialogStatus({ isShow: false });
    }

    return (
        <SC.ReceiptRoot>
            {
                errorDialogStatus.isShow &&
                    <ReceiptErrorDialog onDialogClose={onDialogClose} type={errorDialogStatus.type}/>
            }
            {
                snackbarStatus.isShow && <CommonSnackbar message={snackbarStatus.message} icon={<FiCheckCircle />}/>
            }
            <ReceiptHeader />
            <ReceiptBody
                dailyReceipt={dailyReceipt}
                onAddReceipt={onAddReceipt}
                onDeleteReceipt={onDeleteReceipt}
                onChangeReceipt={onChangeReceipt}
            />
            <ReceiptFooter
                dailyReceipt={dailyReceipt}
                onClickRegister={onClickRegister}
                onClickNoMoneyDay={onClickNoMoneyDay}
            />
        </SC.ReceiptRoot>
    )
}

const SC = {
    ReceiptRoot: styled.div`
        width: 25%;
        height: calc(100vh - 24px);
        background: #FFFFFF;
        border: 2px solid #FFFFFF;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `
};