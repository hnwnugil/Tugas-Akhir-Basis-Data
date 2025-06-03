// Input validation middleware for Among Us API
import { body, param, validationResult } from 'express-validator';

// Middleware to check validation results
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};

// Player validation rules
export const validateCreatePlayer = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    handleValidationErrors
];

export const validateUpdatePlayer = [
    param('id')
        .isMongoId()
        .withMessage('Invalid player ID format'),
    
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    handleValidationErrors
];

export const validateUpdateCosmetics = [
    param('id')
        .isMongoId()
        .withMessage('Invalid player ID format'),
    
    body('cosmetics.hat')
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Hat name must be between 2 and 30 characters'),
    
    body('cosmetics.color')
        .optional()
        .isIn(['red', 'blue', 'green', 'pink', 'orange', 'yellow', 'black', 'white', 'purple', 'brown', 'cyan', 'lime'])
        .withMessage('Invalid color selection'),
    
    handleValidationErrors
];

// Game validation rules
export const validateCreateGame = [
    body('mapId')
        .isMongoId()
        .withMessage('Invalid map ID format'),
    
    body('hostId')
        .isMongoId()
        .withMessage('Invalid host player ID format'),
    
    handleValidationErrors
];

export const validateUpdateGame = [
    param('gameId')
        .isMongoId()
        .withMessage('Invalid game ID format'),
    
    handleValidationErrors
];

// Map validation rules
export const validateCreateMap = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Map name must be between 2 and 50 characters'),
    
    handleValidationErrors
];

export const validateUpdateMap = [
    param('mapId')
        .isMongoId()
        .withMessage('Invalid map ID format'),
    
    handleValidationErrors
];

// Task validation rules
export const validateCreateTask = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Task name must be between 2 and 100 characters'),
    
    body('mapId')
        .isMongoId()
        .withMessage('Invalid map ID format'),
    
    handleValidationErrors
];

export const validateUpdateTask = [
    param('taskId')
        .isMongoId()
        .withMessage('Invalid task ID format'),
    
    handleValidationErrors
];

// Kill validation rules
export const validateCreateKill = [
    body('gameId')
        .isMongoId()
        .withMessage('Invalid game ID format'),
    
    body('killerId')
        .isMongoId()
        .withMessage('Invalid killer player ID format'),
    
    body('victimId')
        .isMongoId()
        .withMessage('Invalid victim player ID format'),
    
    handleValidationErrors
];

// Sabotage validation rules
export const validateCreateSabotage = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Sabotage name must be between 2 and 100 characters'),
    
    body('mapId')
        .isMongoId()
        .withMessage('Invalid map ID format'),
    
    handleValidationErrors
];

export const validateUpdateSabotage = [
    param('id')
        .isMongoId()
        .withMessage('Invalid sabotage ID format'),
    
    handleValidationErrors
];

export const validateTriggerSabotage = [
    body('gameId')
        .isMongoId()
        .withMessage('Invalid game ID format'),
    
    body('sabotageId')
        .isMongoId()
        .withMessage('Invalid sabotage ID format'),
    
    body('triggeredBy')
        .isMongoId()
        .withMessage('Invalid player ID format'),
    
    handleValidationErrors
];

// Meeting validation rules
export const validateCreateMeeting = [
    body('gameId')
        .isMongoId()
        .withMessage('Invalid game ID format'),
    
    body('calledBy')
        .isMongoId()
        .withMessage('Invalid caller player ID format'),
    
    handleValidationErrors
];

// Vote validation rules
export const validateCreateVote = [
    body('meetingId')
        .isMongoId()
        .withMessage('Invalid meeting ID format'),
    
    body('voterId')
        .isMongoId()
        .withMessage('Invalid voter player ID format'),
    
    handleValidationErrors
];

// Report validation rules
export const validateCreateReport = [
    body('gameId')
        .isMongoId()
        .withMessage('Invalid game ID format'),
    
    body('reporterId')
        .isMongoId()
        .withMessage('Invalid reporter ID format'),
    
    handleValidationErrors
];

// Player Tasks validation rules
export const validateAssignTasks = [
    param('gameId')
        .isMongoId()
        .withMessage('Invalid game ID format'),
    
    handleValidationErrors
];

export const validateUpdateTaskStatus = [
    param('taskId')
        .isMongoId()
        .withMessage('Invalid task ID format'),
    
    handleValidationErrors
];

// MongoDB ObjectId validation
export const validateObjectId = (paramName) => [
    param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName} format`),
    
    handleValidationErrors
];

// Common validation rules
export const validatePagination = [
    body('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    body('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    handleValidationErrors
];
