"use client";
import React from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/app/redux/store";
import SocketInitializer from "./SocketInitializer";


interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <SocketInitializer />
      {children}
    </Provider>
  );
};

export default ClientWrapper;
