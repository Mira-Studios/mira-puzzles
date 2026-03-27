"use client";

import { useState } from "react";
import { SignInModal } from "./sign-in-modal";

export function SignIn() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary sign-in-btn"
      >
        Sign in
      </button>
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
