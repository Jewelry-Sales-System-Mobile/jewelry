import { create } from 'zustand'

export const useRoleStore = create((set) => ({
  isSignedIn: true,
  role: 0, // Assuming default role is 'user'
  token: null, // Initial token state
  setIsSignedIn: (isSignedIn) => set(() => ({ isSignedIn })),
  setRole: (role) => set(() => ({ role })),
  setToken: (token) => set(() => ({ token })), // Setter for token
}));
