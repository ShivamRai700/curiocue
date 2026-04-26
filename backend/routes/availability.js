import express from 'express';

const router = express.Router();

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      options: {
        subscription: [
          { name: "Netflix", url: "https://www.netflix.com" },
          { name: "Amazon Prime", url: "https://www.primevideo.com" }
        ],
        free: [],
        freeWithAds: [],
        buyOrRent: []
      },
      disclaimer: "Check official platforms for availability."
    }
  });
});

export default router;