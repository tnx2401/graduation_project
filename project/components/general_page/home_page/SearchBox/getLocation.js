import data from "@/public/local.json";

const getLocation = (searchValue) => {
  const query = searchValue.toLowerCase().trim();
  if (!query) return [];

  let results = [];

  if (query.length < 3) {
    return [];
  }
  data.forEach((province) => {
    if (province.name.toLowerCase().includes(query)) {
      results.push({ type: "province", name: province.name });
    }

    province.districts.forEach((district) => {
      if (district.name.toLowerCase().includes(query)) {
        results.push({ type: "district", name: district.name, province: province.name });
      }

      district.wards.forEach((ward) => {
        if (ward.name.toLowerCase().includes(query)) {
          results.push({ type: "ward", prefix: ward.prefix, name: ward.name, district: district.name, province: province.name });
        }
      });

      district.streets.forEach((street) => {
        if (street.name.toLowerCase().includes(query)) {
          results.push({ type: "street", prefix: street.prefix, name: street.name, district: district.name, province: province.name });
        }
      });
    });
  });

  return results;
};

export default getLocation;
