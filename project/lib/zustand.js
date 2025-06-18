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
  g_project: "",

  g_setProvince: (province) => {
    set(() => ({ g_province: province }))
  },
  g_setDistrict: (district) => set(() => ({ g_district: district })),
  g_setWard: (ward) => set(() => ({ g_ward: ward })),
  g_setStreet: (street) => set(() => ({ g_street: street })),
  g_setProject: (project) => set(() => ({ g_project: project })),

  g_type: [],
  g_setType: (type) => set(() => ({ g_type: type })),

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

  g_isChatting: false,
  g_setIsChatting: (g_isChatting) => set(() => ({ g_isChatting })),

  g_currentSender: "",
  g_setCurrentSender: (g_currentSender) => set(() => ({ g_currentSender })),
  g_currentReceiver: "",
  g_setCurrentReceiver: (g_currentReceiver) => set(() => ({ g_currentReceiver })),
  g_currentChat: "",
  g_setCurrentChat: (g_currentChat) => set(() => ({ g_currentChat })),

}));


export default useStore;
