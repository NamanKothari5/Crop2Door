module.exports.getCoordinates = async (address, pincode) => {
    const baseURl = process.env.MAPBOX_BASE_URL;
    const token = process.env.MAPBOX_TOKEN;
    const response = await fetch(`${baseURl}/geocoding/v5/mapbox.places/${address + "," + pincode}.json?limit=1&access_token=${token}`);

    if (response.ok) {
        const jsonData = await response.json();
        return jsonData.features[0].center;
    }
    else
        throw Error("Error retrieving coordinates")
}

