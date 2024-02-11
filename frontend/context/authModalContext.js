import { atom } from "recoil";

// Default state of the authentication modal
const defaultModalState = {
  open: false,
  view: "login", // "login", "signup", or "resetPassword"
};

// Atom for the authentication modal state
export const authModalState = atom({
  key: "authModalState", // unique identifier for this atom
  default: defaultModalState, // default state of the atom
});
