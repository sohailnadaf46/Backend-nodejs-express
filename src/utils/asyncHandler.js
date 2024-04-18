const asyncHandler = (requesthandler) =>{
  (req, res, next) =>{
    Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err))
  }

}
export default asyncHandler;


//above and below code are same 1 with promises and one with asyn await
// const asyncHandler =  (fn) => async(req, res, next) =>{
//     try {
//       await fn(req, res, next)
      
//     } catch (error) {
//       res.status(err.code || 500).json({
//         success:false,
//         message:err.message
//       })
      
//     }
// } 
