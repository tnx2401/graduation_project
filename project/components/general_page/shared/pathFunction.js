import pathConfig from "./pathConfig";

const getBasePath = (path) => {
    let basePath = "";

    Object.keys(pathConfig).forEach((key) => {
        if (path.startsWith(key) && key.length > basePath.length) {
            basePath = key;
        }
    });

    return basePath;
}
const convertToSlug = (text) => {
    return text
        .toLowerCase()
        .normalize("NFD") // Normalize Vietnamese characters
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/đ/g, "d") // Convert "đ" to "d"
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .trim()
        .replace(/\s+/g, "-"); // Replace spaces with dashes
};


export default { getBasePath, convertToSlug };