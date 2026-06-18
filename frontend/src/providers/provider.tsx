"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";

interface Props {
  children: React.ReactNode;
}

export default function AppProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
