import { readContacts } from "../utils/readContacts.js";

export const getAllContacts = ()=> readContacts();

console.log(await getAllContacts());
