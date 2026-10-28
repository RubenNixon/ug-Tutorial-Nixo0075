import Item from '../models/Item.js';

const createItem = async (req, res) => {
    try {
        const newItem = await Item.create({
            name: req.body.name,
            description: req.body.description,
            user: req.user.id
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getItems = async (req, res) => {
    try {
        const items = await Item.find({ user: req.user.id });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found or unauthorised' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { name: req.body.name, description: req.body.description },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found or unauthorised' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { createItem, getItems, deleteItem, updateItem };
