const itemRepository = require("../repositories/item.repository");
const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");
const cloudinary = require("../utils/cloudinary.util");

exports.createItem = async (req, res) => {
    const store = await storeRepository.getStoreById(req.body.store_id);
    if (!req.body.name || !req.body.price || !req.body.store_id || !req.file || !req.body.stock) {
        return baseResponse(res, false, 400, "Missing item name, price, store_id, image, or stock", null);
    }
    else if (!store) {
        return baseResponse(res, false, 404, "Store doesn't exist", null);
    }

    try {
        let image_url = null;
        if (req.file) {
            image_url = await cloudinary.uploadImage(req.file, "items");
        }
        
        const itemData = {
            name: req.body.name,
            price: req.body.price,
            store_id: req.body.store_id,
            stock: req.body.stock,
            image_url: image_url
        };
        
        const item = await itemRepository.createItem(itemData);
        baseResponse(res, true, 201, "Item created", item);
    } catch (error) {
        console.log(error);
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        baseResponse(res, true, 200, "Items found", items);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving items", error);
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await itemRepository.getItemById(req.params.id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        baseResponse(res, true, 200, "Item found", item);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving item", error);
    }
}

exports.getItemByStoreId = async (req, res) => {
    try {
        const store = await storeRepository.getStoreById(req.params.store_id);
        const items = await itemRepository.getItemByStoreId(req.params.store_id);
        if (!store) {
            return baseResponse(res, false, 404, "Store doesn't exist", null);
        }
        else if (!items) {
            return baseResponse(res, false, 404, "Items not found", null);
        }
        baseResponse(res, true, 200, "Items found", items);
    }
    catch (error) {
        baseResponse(res, false, 500, "Error retrieving items", error);
    }
}

exports.updateItem = async (req, res) => {
    if (!req.body.name || !req.body.price || !req.body.store_id || !req.body.id || !req.body.stock) {
        return baseResponse(res, false, 400, "Missing item id, name, price, store_id, or stock", null);
    }
    try {
        let image_url = null;
        if (req.file) {
            image_url = await cloudinary.uploadImage(req.file, "items");
        }
        
        const itemData = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            store_id: req.body.store_id,
            stock: req.body.stock,
            image: image_url || req.body.image_url // Use existing URL if no new file
        };
        
        const item = await itemRepository.updateItem(itemData);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        baseResponse(res, true, 200, "Item updated", item);
    } catch (error) {
        baseResponse(res, false, 500, "Error updating item", error);
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const deleted = await itemRepository.deleteItem(req.params.id);
        if (!deleted) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        baseResponse(res, true, 200, "Item deleted", deleted);
    } catch (error) {
        baseResponse(res, false, 500, "Error deleting item", error);
    }
}