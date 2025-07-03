const express=require("express")
const {APIS} = require("../config/constant")
const leavecontroller=require("../controller/leavecontroller")
const router=express.Router()
router.use(APIS.LEAVES.ENDPOINT.GET_LEAVES,leavecontroller.getleaves)
router.use(APIS.LEAVES.ENDPOINT.ASSIGN_LEAVES,leavecontroller.assignleaves)
router.use(APIS.LEAVES.ENDPOINT.ADD_LEAVES,leavecontroller.addleaves)
router.use(APIS.LEAVES.ENDPOINT.APPROVE_LEAVES,leavecontroller.approveleave)
router.use(APIS.LEAVES.ENDPOINT.ASSIGN_LEAVESBYOWNER,leavecontroller.assignleavesbyowner)

module.exports=router