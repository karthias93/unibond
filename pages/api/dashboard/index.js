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
        { $group: { _id: '$status', total: { $sum: { "$toDouble": '$revenue' } } } }
    ]).toArray();
    const response = Object.assign(...result.map((val) => ({[val._id]: val.count})));
    if (revenue.length) {
        const revenueObj = Object.assign(...revenue.map((val) => ({[val._id]: val.total})));
        response.pendingRevenue = revenueObj.Approved ? revenueObj.Approved : 0;
        response.totalRevenue = revenueObj.Completed ? revenueObj.Completed : 0;
    }

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
        { $group: { _id: '$status', total: { $sum: { "$toDouble": '$revenue' } } } }
    ]).toArray();
    const lastResponse = lastResult.length ? Object.assign(...lastResult.map((val) => ({[val._id]: val.count}))) : {};
    if (lastRevenue.length) {
        const lasRevenueObj = Object.assign(...lastRevenue.map((val) => ({[val._id]: val.total})));
        lastResponse.pendingRevenue = lasRevenueObj.Approved ? lasRevenueObj.Approved : 0;
        lastResponse.totalRevenue = lasRevenueObj.Completed ? lasRevenueObj.Completed : 0;
    }
    let lastFinalData = lastResponse;
    if (lastAudit.length) {
        const lastAuditdata = Object.assign(...lastAudit.map((val) => ({[val._id]: val.count})));
        lastFinalData = {
            ...lastFinalData,
            ...lastAuditdata
        }
    }
    const recentData = await db.collection("orders").find({status: 'Completed', serviceName: 'Audit'}).sort({ "updatedAt": -1 }).limit(1).toArray();
    const recent = {};
    if (recentData.length) {
        const val = recentData[0];
        recent.lineofcode = val.lineofcode ? val.lineofcode : 0;
        recent.bugges = val.bugges ? val.bugges : 0;
        recent.marketcap = val.marketcap ? val.marketcap : 0;
    }
    return res.status(200).json({all: finalData, lastWeek: lastFinalData, recent});
};

export default apiHandler({
    get: getDashboardData,
});
