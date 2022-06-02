import React, { useEffect, useState } from "react";

import { ContactList } from "../functional/ContactList";
import { ContactForm } from "../functional/ContactForm";
import { ServiceInterface, Contact } from "../contacts.service";

interface ContactsContainerProps {
  service: ServiceInterface<Contact>;
}

export const ContactsContainer: React.FC<ContactsContainerProps> = (
  props
): JSX.Element => {
  const { service } = props;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const defaultValue: Contact = { id: "", name: "", details: "" };

  useEffect(() => {
    service.getAll().then((data) => {
      setContacts(data);
    });
  }, [service]);

  const newContact = () => {
    setSelected(defaultValue);
  };

  const onSelect = (contact: Contact) => {
    setSelected(contact);
  };

  const onSubmit = (contact: Contact) => {
    service.save(contact).then(() => {
      service.getAll().then((data) => {
        setContacts(data);
      });
    });
  };

  const onCancel = () => {
    setSelected(null);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1>Contacts</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <ContactList
            contacts={contacts}
            selected={selected}
            onSelect={onSelect}
          />
        </div>
        <div className="col-md-4">
          {selected ? (
            <ContactForm
              contact={selected}
              onChange={onSelect}
              onSubmit={onSubmit}
              onCancel={onCancel}
            />
          ) : (
            <div>
              <button
                id="new-contact"
                onClick={newContact}
                className="btn btn-primary"
              >
                New contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
