"use client";

import Topbar from './Topbar/Topbar';

const ClientLayout = ({ children }) => {
  return (
    <>
      <Topbar />
      <main id="main-content">
        {children}
      </main>
    </>
  );
};

export default ClientLayout; 