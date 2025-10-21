module.exports = function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    errors: [{ msg: err.message || 'Server error' }]
  });
};
