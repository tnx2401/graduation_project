import { create } from "zustand";

const useStore = create((set) => ({

  //User
  uid: "",
  username: "",
  profileImage: "",

  setUid: (uid) => set(() => ({ uid })),
  setUsername: (username) => set(() => ({ username })), // Fix parameter handling
  setProfileImage: (profileImage) => set(() => ({ profileImage })),


  //Location
  g_province: "",
  g_district: "",
  g_ward: "",
  g_street: "",

  g_setProvince: (province) => {
    console.log("Setting g_province to:", province);
    set(() => ({ g_province: province }))
  },
  g_setDistrict: (district) => set(() => ({ g_district: district })),
  g_setWard: (ward) => set(() => ({ g_ward: ward })),
  g_setStreet: (street) => set(() => ({ g_street: street })),


  //Search Query
  g_searchQuery: {
    demand: "Tìm mua",
    type: [],
    address: [],
    price: "",
    area: "",
    bedroom: "",
    houseDirection: [],
    balconyDirection: [],
  },
  g_setSearchQuery: (newQuery) => set({ g_searchQuery: newQuery }),


  g_houseType: [],
  g_setHouseType: (houseType) => set(() => ({ g_houseType: houseType })),
}));


export default useStore;
