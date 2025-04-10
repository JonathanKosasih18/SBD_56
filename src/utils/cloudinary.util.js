require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (image, folder) => {
    return new Promise((resolve, reject) => {
        if (!image) {
            return resolve(null);
        }
        const base64 = Buffer.from(image.buffer).toString("base64");
        const url = `data:${image.mimetype};base64,${base64}`;
        cloudinary.uploader.upload(url, { folder }, (error, result) => {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(result.secure_url);
            }
        });
    });
}

module.exports = {
    uploadImage,
    ...cloudinary
};