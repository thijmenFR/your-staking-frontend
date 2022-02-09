export const formatAddress = (address: string) => {
  return address.length >= 10 ? `${address.slice(0, 5)}...${address.slice(-4)}` : address;
};

export const userLogged = true;
