const { assignleavesbyowner } = require("../controller/leavecontroller")

const APIS ={
   LEAVES : {
        SERVICE_NAME :"/leaves",
        ENDPOINT :{
            GET_LEAVES:"/getleaves",
            ASSIGN_LEAVES:"/assignleaves",
             APPROVE_LEAVES:"/approveleave",
             ADD_LEAVES:"/addleaves",
             ASSIGN_LEAVESBYOWNER:"/assignleavesbyowner"
        }
    }
    
}
module.exports ={
    APIS
}