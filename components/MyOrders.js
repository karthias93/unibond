import React, {Fragment, useEffect, useState} from "react";
import styles from "scss/components/MyOrders.module.scss";
import toast from "./Toast";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ordersState } from "reduxState/slices/ordersSlice";
import { useTable } from 'react-table';
import { toggleState as toggleLoaderState } from "reduxState/slices/loaderSlice";

function MyOrders() {
    const dispatch = useDispatch();
    const user = useSelector((state)=> state.authState);
    const { orders } = useSelector((state)=> state.ordersState);

    useEffect(()=>{
        if (user.id) {
            axios.get(`/api/orders/${user.id}`, {
                params: {
                    isMember: user.isAdmin
                },
                headers: {
                    Authorization: `bearer ${user.token}`,
                }
            }).then(({data})=> {
                dispatch(ordersState({orders: data}));
            });
        }
    }, [user, dispatch]);

    const handleClickEditRow = (e, row) => {
        dispatch(toggleLoaderState(true));
        axios.patch(`/api/orders/${row.values._id}`, {
            status: e.target.value
        },{
            headers: {
                Authorization: `bearer ${user.token}`,
            }
        }).then(()=>{
            dispatch(toggleLoaderState(false));
        })
    }

    const columns = React.useMemo(() => [
        {
            Header: 'S No',
            Cell: (cellObj) => cellObj.row.index+1
        },
        {
            Header: 'Username',
            accessor: 'username',
        },
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Phone',
            accessor: 'phone',
        },
        {
            Header: 'Telegram',
            accessor: 'telegram',
        },
        {
            Header: 'Service',
            accessor: 'serviceName'
        },
        {
            Header: 'Details',
            accessor: 'details',
        },
        {
            Header: 'Status',
            accessor: 'status',
            ...(user.isAdmin) ? {Cell: (cellObj) => {
                return (
                    <select id="lang" onChange={(e) => handleClickEditRow(e, cellObj.row)} value={cellObj.row.values.status} className="p-2 rounded">
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                    </select>
                )
            }
            } : {}
        },
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: orders })

    return (
        <Fragment>
            <h3 className={styles.heading}>My Orders</h3>
            <div className={styles.tableContainer}>
                <table {...getTableProps()} className="min-w-full leading-normal">
                    <thead>
                        {headerGroups.map((headerGroup, headerIndex) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={headerIndex}>
                            {headerGroup.headers.map((column, index) => (
                            <th
                                {...column.getHeaderProps()}
                                className="px-5 py-3 border-b-2 border-yellow-200 bg-yellow-500 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                key={index}
                            >
                                {column.render('Header')}
                            </th>
                            ))}
                        </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row,i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()} key={i}>
                            {row.cells.map((cell, cellIndex) => {
                                return (
                                <td
                                    {...cell.getCellProps()}
                                    className="px-5 py-5 border-b border-yellow-200 bg-yellow-100 text-sm"
                                    key={cellIndex}
                                >
                                    {cell.render('Cell')}
                                </td>
                                )
                            })}
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}

export default MyOrders;
