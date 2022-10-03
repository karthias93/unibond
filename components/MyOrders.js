import React, { Fragment, useEffect, useState } from "react";
import styles from "scss/components/MyOrders.module.scss";
import toast from "./Toast";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ordersState } from "reduxState/slices/ordersSlice";
import { useTable } from 'react-table';
import { toggleState as toggleLoaderState } from "reduxState/slices/loaderSlice";
import RevenuePopup from "./RevenuePopup";
import ModalPopup from "./ModalPopup";

function MyOrders() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authState);
    const { orders } = useSelector((state) => state.ordersState);

    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});

    const getOrders = () => {
        axios.get(`/api/orders/${user.id}`, {
            params: {
                isMember: user.isAdmin
            },
            headers: {
                Authorization: `bearer ${user.token}`,
            }
        }).then(({ data }) => {
            dispatch(ordersState({ orders: data }));
        });
    }

    useEffect(() => {
        if (user.id) {
            getOrders();
        }
    }, [user]);

    const submitOrder = (fields, id) => {
        dispatch(toggleLoaderState(true));
        fields.updatedBy = user.id;
        axios.patch(`/api/orders/${id}`, fields, {
            headers: {
                Authorization: `bearer ${user.token}`,
            }
        }).then(() => {
            dispatch(toggleLoaderState(false));
            getOrders();
        })
    }

    const submitHandler = (values, status = 'Approved') => {
        let fields = {
            status,
            revenue: values.revenue,
            ...(selectedRow.serviceName === 'Audit') ? { lineofcode: values.lineofcode } : {}
        }
        if (status === 'Completed') {
            fields.bugges = values.bugges;
            fields.marketcap = values.marketcap;
        }
        submitOrder(fields, selectedRow._id);
        setShow(false);
        setShowModal(false);
    }
    const handleClickEditRow = (e, row) => {
        if (e.target.value === 'Approved') {
            setShow(true);
            setSelectedRow(row.original);
        } else if (e.target.value === 'Completed' && row.original.serviceName === 'Audit') {
            setShowModal(true);
            setSelectedRow(row.original);
        } else {
            const fields = {
                status: e.target.value
            }
            submitOrder(fields, row.original._id);
        }

    }

    const columns = React.useMemo(() => [
        {
            Header: 'S No',
            Cell: (cellObj) => <span className="fs-18px">{cellObj.row.index + 1}.</span>
        },
        {
            Header: 'Username',
            accessor: 'username',
            Cell: (cellObj) => {
                return (
                    <Fragment>
                        <div className="fs-18px">{cellObj.row.values.username}</div>
                        <div className="text-[#1e1e1e] weight-4 fs-12px">{cellObj.row.values.email}</div>
                    </Fragment>
                )
            }
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
            accessor: 'serviceName',
            Cell: (cellObj) => <span className="weight-7">{cellObj.row.values.serviceName}</span>
        },
        {
            Header: 'Details',
            accessor: 'details',
            Cell: (cellObj) => <span className="weight-7">{cellObj.row.values.details}</span>
        },
        {
            Header: 'Status',
            accessor: 'status',
            ...(user.isAdmin) ? {
                Cell: (cellObj) => {
                    return (
                        <select id="lang" onChange={(e) => handleClickEditRow(e, cellObj.row)} value={cellObj.row.values.status} className={`p-2 rounded weight-7 ${styles[cellObj.row.values.status.toLowerCase()]}`}>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Completed">Completed</option>
                        </select>
                    )
                }
            } : {}
        },
    ], [user]);

    const initialState = { hiddenColumns: ['email'] };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: orders, initialState })

    return (
        <Fragment>
            <h3 className={`${styles.heading} text-4xl font-bold mb-1 black`}>My <span className="yellow">Orders</span></h3>
            <p className="text-base font-normal black mb-6">
                Welcome back! Take a look at your profile here.
            </p>
            <div className={styles.tableContainer}>
                <table {...getTableProps()} className="min-w-full leading-normal">
                    <thead>
                        {headerGroups.map((headerGroup, headerIndex) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={headerIndex}>
                                {headerGroup.headers.map((column, index) => (
                                    <th
                                        {...column.getHeaderProps()}
                                        className="px-5 py-3 border-b-2  text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                                        key={index}
                                    >
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()} key={i}>
                                    {row.cells.map((cell, cellIndex) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className="px-5 py-5 border-b  text-sm"
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
            {show && <RevenuePopup selectedRow={selectedRow} setShowPopup={setShow} submitHandler={submitHandler} />}
            {showModal && <ModalPopup selectedRow={selectedRow} setShowPopup={setShowModal} submitHandler={submitHandler} />}
        </Fragment>
    );
}

export default MyOrders;
