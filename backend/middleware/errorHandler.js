export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      status: 404,
      message: 'Endpoint not found'
    }
  });
};
