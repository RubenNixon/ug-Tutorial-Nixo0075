import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Artificial 1.5s delay so the loading skeletons are visible
    setTimeout(async () => {
      try {
        const products = await Product.find(query);
        res.json(products);
      } catch (error) {
        res.status(500).json({ message: "Server error fetching products." });
      }
    }, 1500);

  } catch (error) {
    res.status(500).json({ message: "Server error fetching products." });
  }
});

router.patch('/:id/like', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Simulated 10% failure rate to test the optimistic rollback
    if (Math.random() < 0.1) {
      return res.status(500).json({ message: "Random simulated network failure" });
    }

    product.likes = !product.likes;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error updating like status." });
  }
});

export default router;
