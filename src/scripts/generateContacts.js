import { createFakeContact } from "../utils/createFakeContact.js";
import { readContacts } from "../utils/readContacts.js";
import { writeContacts  } from "../utils/writeContacts.js";

const generateContacts = async (number) => {
    const contacts = await readContacts();
    const newContacts = Array(number).fill(0).map(createFakeContact);
    const result = [... contacts, ...newContacts];
    await writeContacts (result);

};

generateContacts(5);
