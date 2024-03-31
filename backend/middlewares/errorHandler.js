module.exports.errorHandler=(err,req,res,next)=>{
    err.message ||="Internal server error";
    err.status||=500;

    return res.status(err.status).json({
        success:false,
        message:err.message
    });
};

module.exports.TryCatch=(func)=>{
    return (req,res,next)=>{
        func(req,res,next).catch(next);
    }
}