import { create } from "zustand";

const useLikeStore = create((set) => ({
    likedPosts: [],
    toggleLike: (post) =>
        set((state) => {
            const exists = state.likedPosts.some((p) => p.post_id === post.post_id);
            return {
                likedPosts: exists
                    ? state.likedPosts.filter((p) => p.post_id !== post.post_id)
                    : [...state.likedPosts, post],
            };
        }),
    setLike: (post, liked) =>
        set((state) => {
            const exists = state.likedPosts.some((p) => p.post_id === post.post_id);
            if (liked && !exists) {
                return { likedPosts: [...state.likedPosts, post] };
            }
            if (!liked && exists) {
                return {
                    likedPosts: state.likedPosts.filter(
                        (p) => p.post_id !== post.post_id
                    ),
                };
            }
            return state;
        }),
}));
export default useLikeStore;
