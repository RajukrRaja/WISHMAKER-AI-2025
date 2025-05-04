exports.validateTribute = [
    check('friend_name').notEmpty().withMessage('Friend name is required'),
    check('memory').notEmpty().withMessage('Memory is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      next();
    },
  ];