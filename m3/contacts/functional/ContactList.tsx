import React from "react";
import { Contact } from "../contacts.service";

interface ContactListProps {
  contacts: Contact[];
  selected: Contact | null;
  onSelect: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = (props): JSX.Element | null => {
  const { contacts, selected, onSelect } = props;

  if (contacts.length === 0) {
    return null;
  }

  return (
    <div className="list-group">
      {contacts.map((contact) => (
        <button
          key={contact.id}
          data-testid={`button-${contact.id}`}
          onClick={(e) => onSelect(contact)}
          className={`list-group-item ${
            selected && selected.id === contact.id ? "active" : ""
          }`}
        >
          {contact.name}
        </button>
      ))}
    </div>
  );
};
