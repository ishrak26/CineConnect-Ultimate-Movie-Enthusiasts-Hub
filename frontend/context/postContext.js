import { atom } from "recoil";

// Default state for posts, initially empty
const defaultPostState = {
  selectedPost: null, // Initially no post is selected
  posts: [], // Initially there are no posts
  postVotes: [], // Initially no votes are recorded
};

// Atom to manage post state in the application
export const postState = atom({
  key: "postState", // Unique ID (with respect to other atoms/selectors)
  default: defaultPostState, // Default state
});
