import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import useUserStore from "./userStore";

const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurentUserBlocked: false,
  isReceiverBloced: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurentUserBlocked: true,
        isReceiverBloced: false,
      });
    } else if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: user,
        isCurentUserBlocked: false,
        isReceiverBloced: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurentUserBlocked: false,
        isReceiverBloced: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBloced: !state.isReceiverBloced }));
  },
}));

export default useChatStore;
