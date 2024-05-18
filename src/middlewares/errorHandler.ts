const errorHandler = (err, req, res, next) => {
    res.status(500).json({
        success: false,
        error : err.message || 'Something went wrong! Please try again later.',
    });
  }

export {
    errorHandler,
}