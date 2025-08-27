import { Router } from 'express';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Example route
router.get('/example', (req, res) => {
  res.json({
    success: true,
    message: 'This is an example API endpoint',
    data: {
      example: true,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
