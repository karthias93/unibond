import React, {Fragment, useEffect, useState} from "react";
import styles from "scss/components/MyOrders.module.scss";
import toast from "./Toast";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ordersState } from "reduxState/slices/ordersSlice";
import { useTable } from 'react-table';
import { isMember } from "../utils/helpers/member";
import { toggleState as toggleLoaderState } from "reduxState/slices/loaderSlice";

function MyOrders() {
    const dispatch = useDispatch();
    const user = useSelector((state)=> state.authState);
    const { orders } = useSelector((state)=> state.ordersState);
    const [member, setMember] = useState(false);

    useEffect(()=>{
        if (user.id) {
            setMember(isMember(user.email));
            axios.get(`/api/orders/${user.id}`, {
                params: {
                    isMember: member
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
    
    const columns = React.useMemo(() => {
        const col = []
        if (orders?.length) {
            for (const prop in orders[0]) {
                col.push({
                    Header: prop,
                    accessor: prop,
                    ...prop==='status' && member ? {Cell: (cellObj) => {
                        return (
                            <select id="lang" onChange={(e) => handleClickEditRow(e, cellObj.row)} value={cellObj.row.values.status}>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Completed">Completed</option>
                            </select>
                        )
                    }
                } : {}
                });
            }
        }
        return col;
    }, [orders]);

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
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
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
                                    className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
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
