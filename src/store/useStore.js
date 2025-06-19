import { create } from 'zustand'

const useStore = create((set) => ({
  user: {
    address: null,
    profile: {
      name: '',
      bio: '',
      avatar: '',
      isArtist: false,
    },
    nfts: [],
  },
  
  setUserAddress: (address) => set((state) => ({
    user: { ...state.user, address }
  })),
  
  setUserProfile: (profile) => set((state) => ({
    user: { ...state.user, profile: { ...state.user.profile, ...profile } }
  })),
  
  setUserNFTs: (nfts) => set((state) => ({
    user: { ...state.user, nfts }
  })),
  
  clearUser: () => set({
    user: {
      address: null,
      profile: { name: '', bio: '', avatar: '', isArtist: false },
      nfts: [],
    }
  }),
}))

export default useStore