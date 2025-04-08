// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// const useUserImageStore = create(
//   persist(
//     (set) => ({
//       images: {}, // Object to store images by userId
//       setImage: (userId, img) => set((state) => ({ 
//         images: { ...state.images, [userId]: img } 
//       })),
//       clearImage: (userId) => set((state) => {
//         const updatedImages = { ...state.images };
//         delete updatedImages[userId]; // Remove image by userId
//         return { images: updatedImages };
//       }),
//     }),
//     {
//       name: 'user-images-storage', // localStorage key
//       getStorage: () => localStorage, // default is localStorage
//     }
//   )
// );

// export default useUserImageStore;
