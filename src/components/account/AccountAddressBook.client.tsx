import {useState, useMemo, MouseEventHandler} from 'react';

import {Text, Button} from '~/components/elements';
import {Modal} from '../index';
import {AccountAddressEdit, AccountDeleteAddress} from '../index';

export function AccountAddressBook({
  addresses,
  defaultAddress,
}: {
  addresses: any[];
  defaultAddress: any;
}) {
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);

  const {fullDefaultAddress, addressesWithoutDefault} = useMemo(() => {
    const defaultAddressIndex = addresses.findIndex(
      (address) => address.id === defaultAddress,
    );
    return {
      addressesWithoutDefault: [
        ...addresses.slice(0, defaultAddressIndex),
        ...addresses.slice(defaultAddressIndex + 1, addresses.length),
      ],
      fullDefaultAddress: addresses[defaultAddressIndex],
    };
  }, [addresses, defaultAddress]);

  function close() {
    setEditingAddress(null);
    setDeletingAddress(null);
  }

  function editAddress(address: any) {
    setEditingAddress(address);
  }

  return (
    <>
      {deletingAddress ? (
        <Modal close={close}>
          <AccountDeleteAddress addressId={deletingAddress} close={close} />
        </Modal>
      ) : null}
      {editingAddress ? (
        <Modal close={close}>
          <AccountAddressEdit
            address={editingAddress}
            defaultAddress={fullDefaultAddress === editingAddress}
            close={close}
          />
        </Modal>
      ) : null}
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="text-lead font-bold">Address Book</h3>
        <div>
          {!addresses?.length ? (
            <Text className="mb-1" width="narrow" as="p" size="copy">
              You haven&apos;t saved any addresses yet.
            </Text>
          ) : null}
          <div className="w-48">
            <Button
              className="mt-2 mb-6 w-full text-sm"
              onClick={() => {
                editAddress({
                  /** empty address */
                });
              }}
              variant="secondary"
            >
              Add an Address
            </Button>
          </div>
          {addresses?.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {fullDefaultAddress ? (
                <Address
                  address={fullDefaultAddress}
                  defaultAddress
                  setDeletingAddress={setDeletingAddress.bind(
                    null,
                    fullDefaultAddress.originalId,
                  )}
                  editAddress={editAddress}
                />
              ) : null}
              {addressesWithoutDefault.map((address) => (
                <Address
                  key={address.id}
                  address={address}
                  setDeletingAddress={setDeletingAddress.bind(
                    null,
                    address.originalId,
                  )}
                  editAddress={editAddress}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function Address({
  address,
  defaultAddress,
  editAddress,
  setDeletingAddress,
}: {
  address: any;
  defaultAddress?: boolean;
  editAddress: (address: any) => void;
  setDeletingAddress: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div className="flex flex-col rounded border border-gray-200 p-6 lg:p-8">
      {defaultAddress ? (
        <div className="mb-3 flex flex-row">
          <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary/50">
            Default
          </span>
        </div>
      ) : null}
      <ul className="flex-1 flex-row">
        {address.firstName || address.lastName ? (
          <li>
            {(address.firstName && address.firstName + ' ') + address.lastName}
          </li>
        ) : (
          <></>
        )}
        {address.formatted ? (
          address.formatted.map((line: string) => <li key={line}>{line}</li>)
        ) : (
          <></>
        )}
      </ul>

      <div className="mt-6 flex flex-row font-medium">
        <button
          onClick={() => {
            editAddress(address);
          }}
          className="text-left text-sm underline"
        >
          Edit
        </button>
        <button
          onClick={setDeletingAddress}
          className="ml-6 text-left text-sm text-primary/50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
