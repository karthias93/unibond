import { apiHandler } from "../../../utils/helpers/api";
import { connectToDatabase } from "lib/mongoose/mongoDB";

const getDashboardData = async (req, res) => {
    const { db } = await connectToDatabase();

    const result = await db.collection("orders").aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }} }
    ]).toArray();

    const audit = await db.collection("orders").aggregate([
        { $match: { serviceName: { $in: ['Audit', 'Marketing'] } } },
        { $group: { _id: '$serviceName', count: { $sum: 1 }} }
    ]).toArray();

    const revenue = await db.collection("orders").aggregate([
        { $group: { _id: '', total: { $sum: { "$toDouble": '$revenue' } } } }
    ]).toArray();
    const response = Object.assign(...result.map((val) => ({[val._id]: val.count})));
    response.totalRevenue = revenue[0].total;
    let finalData = response;
    if (audit.length) {
        const auditdata = Object.assign(...audit.map((val) => ({[val._id]: val.count})));
        finalData = {
            ...finalData,
            ...auditdata
        }
    }
    /**Last week */
    const lastResult = await db.collection("orders").aggregate([
        { $match: { createdAt: { $gte: new Date() - 7 * 60 * 60 * 24 * 1000 } } },
        { $group: { _id: '$status', count: { $sum: 1 }} }
    ]).toArray();
    const lastAudit = await db.collection("orders").aggregate([
        { $match: { serviceName: { $in: ['Audit', 'Marketing'] }, createdAt: { $gte: new Date() - 7 * 60 * 60 * 24 * 1000 } } },
        { $group: { _id: '$serviceName', count: { $sum: 1 }} }
    ]).toArray();

    const lastRevenue = await db.collection("orders").aggregate([
        { $match: { createdAt: { $gte: new Date() - 7 * 60 * 60 * 24 * 1000 } } },
        { $group: { _id: '', total: { $sum: { "$toDouble": '$revenue' } } } }
    ]).toArray();
    const lastResponse = lastResult.length ? Object.assign(...lastResult.map((val) => ({[val._id]: val.count}))) : {};
    lastResponse.totalRevenue = lastRevenue[0].total;
    let lastFinalData = lastResponse;
    if (lastAudit.length) {
        const lastAuditdata = Object.assign(...lastAudit.map((val) => ({[val._id]: val.count})));
        lastFinalData = {
            ...lastFinalData,
            ...lastAuditdata
        }
    }
    return res.status(200).json({all: finalData, lastWeek: lastFinalData});
};

export default apiHandler({
    get: getDashboardData,
});
