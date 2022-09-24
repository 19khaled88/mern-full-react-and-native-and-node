const express = require('express')
// const {createUser,getUsers,loginUser,fortgetPassword,logout,resetPassword,} = require('../controller/UserController')
const user = require('../controller/UserController')
const { isAuthenticatedUser, isAuthorized } = require('../middleware/auth')
const { route } = require('./OrderRoute')
const router = express.Router()

router.route('/list').get(user.getUsers)
router.route('/registration').post(user.createUser)
router.route('/login').post(user.loginUser)
router.route('/logout').get(user.logout)
router.route('/password/forgot').post(isAuthenticatedUser, user.fortgetPassword)
router
  .route('/password/reset/:token')
  .patch(isAuthenticatedUser, user.resetPassword)
router.route('/password/update').patch(isAuthenticatedUser, user.updatePassword)
router.route('/details').get(isAuthenticatedUser, user.userDetails)
router
  .route('/updateProfile/:id')
  .patch(isAuthenticatedUser, user.updateProfile)
router
  .route('/updateRole')
  .patch(isAuthenticatedUser, isAuthorized('admin'), user.updateUserRole)
router.route('/getsingleuser/:id').get(isAuthenticatedUser, user.getSingleUser)
router
  .route('/getusers')
  .get(isAuthenticatedUser, isAuthorized('admin'), user.getAllUsers)
router.route('/delete/:id').delete(isAuthenticatedUser, user.deleteUser)
module.exports = router
