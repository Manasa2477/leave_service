const { connect } = require("../config/sqlserver");
const { DB } = require("../config/dbstoredprocedure");
const sql = require("mssql");
const { checkuserid } = require("../config/checkuserid");

const assignleaves = async (req, res, next) => {
  try {
    const { sickLeave, casualLeave, annualLeave } = req.body;
    const userId = req.headers["x-user-id"];
    const user = await checkuserid(userId);
    if (user.recordset.length == 0) {
      return res.json({ message: "user id no found " });
    }
    if (user.recordset.length > 0) {
      const pool = await connect();
      const result = await pool
        .request()
        .input("sickLeave", sql.Decimal(2, 1), sickLeave)
        .input("casualLeave", sql.Decimal(2, 1), casualLeave)
        .input("annualleave", sql.Int, annualLeave)
        .input("userId", sql.VarChar, user.recordset[0].userId)
        .execute(DB.ASSIGNUSER);
      if (result.rowsAffected[0] === 1) {
        return res.json({
          message: "User created  successfully",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
const getleaves = async (req, res, next) => {
  const userId = req.headers["x-user-id"];

  try {
    const user = await checkuserid(userId);

    if (user.recordset.length === 0) {
      return res.status(404).json({ message: "User ID not found" });
    }

    const pool = await connect();
    const result = await pool
      .request()
      .input("userId", sql.VarChar, userId) // or user.recordset[0].userId if needed
      .execute(DB.GETUSER);

    return res.json({ message: "User details", data: result.recordset[0] });
  } catch (error) {
    next(error);
  }
};

const addleaves = async (req, res, next) => {
  try {
    const { ownerId, days, leaveType, status } = req.body;
    const userId = req.headers["x-user-id"];
    const user = await checkuserid(userId);

    if (user.recordset.length === 0) {
      return res.status(404).json({ message: "User ID not found" });
    }

    const pool = await connect();
    const result = await pool
      .request()
      .input("userId", sql.VarChar, user.recordset[0].userId) // or user.recordset[0].userId if needed
      .execute(DB.ADDLEAVES);
    const leavedata = result.recordset[0];
    console.log(leavedata, "hhjjhvjhvh");

    let availabledata;
    if (leaveType === 1) {
      availabledata = leavedata.casualLeave;
    } else if (leaveType === 2) {
      availabledata = leavedata.sickLeave;
    } else if (leaveType === 3) {
      availabledata = leavedata.annualLeave;
    } else {
      return res.status(400).json({ message: "Invalid leave status" });
    }

    if (availabledata < days) {
      return res.status(400).json({ message: "Not enough leave balance" });
    }

    const ownertableDetails = await pool
      .request()
      .input("ownerId", sql.VarChar(100), ownerId)
      .input("days", sql.Decimal(2, 1), days)
      .input("leaveType", sql.Int, leaveType)
      .input("status", sql.VarChar(50), status)
      .input("userId", sql.VarChar(100), user.recordset[0].userId)
      .execute(DB.ADDLEAVESOWNER);

    if (ownertableDetails.rowsAffected[0] === 1) {
      return res.status(201).json({
        message: "Leave record created successfully",
      });
    } else {
      return res.status(400).json({ message: "No rows were affected" });
    }
  } catch (error) {
    next(error);
  }
};
const approveleave = async (req, res, next) => {
  try {
    const { status, empId } = req.body;
    const userId = req.headers["x-user-id"];
    const user = await checkuserid(userId);
    if (user.recordset.length === 0) {
      return res.status(404).json({ message: "User ID not found" });
    }

    const pool = await connect();
    const result = await pool
      .request()
      .input("userId", sql.VarChar, empId)
      .input("status", sql.VarChar, status)
      .input("ownerId", sql.VarChar, userId)
      .execute(DB.APPROVELEAVES);
    if (result.rowsAffected[0] === 1) {
      return res.status(200).json({ message: "approve leave successfully" });
    } else {
      return res.status(400).json({ message: "approve leave failed" });
    }
  } catch (error) {
    next(error);
  }
};
const assignleavesbyowner = async (req, res, next) => {
  try {
    const { sickLeave, casualLeave, annualLeave, empId } = req.body;
    const userId = req.headers["x-user-id"];
    const user = await checkuserid(userId);
    if (user.recordset.length == 0) {
      return res.json({ message: "user id no found " });
    }
    if (user.recordset.length > 0) {
      const pool = await connect();
      const result = await pool
        .request()
        .input("sickLeave", sql.Decimal(2, 1), sickLeave)
        .input("casualLeave", sql.Decimal(2, 1), casualLeave)
        .input("annualleave", sql.Int, annualLeave)
        .input("userId", sql.VarChar, empId)
        .execute(DB.APPROVELEAVESBYOWNER);
      if (result.rowsAffected[0] === 1) {
        return res.json({
          message: "User created  successfully",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  assignleaves,
  getleaves,
  addleaves,
  approveleave,
  assignleavesbyowner,
};
