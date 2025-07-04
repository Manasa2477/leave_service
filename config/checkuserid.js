const { connect, sql } = require("./sqlserver");

 const checkuserid=async(userId)=>{
    const pool = await connect();
    const userDetails = await pool
      .request()
      .input("userId", sql.VarChar, userId)
      .execute(DB.GETCHECKUSER)
    return userDetails;
}
module.exports={checkuserid};