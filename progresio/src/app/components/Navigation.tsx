"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { ConfirmModal } from "./ConfirmModal";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navLinks = [
    { href: "/progress", label: "Submit Progress" },
    // { href: "/addParameter", label: "Add Parameter" },
    { href: "/myParameters", label: "My Parameters" },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center">
          {/* Replace with your logo */}
          {/* <img src="/logo.svg" alt="Progresio Logo" className="h-8 w-8 mr-2" /> */}
          <span className="text-2xl font-bold">Progresio</span>
        </Link>
        {isAuthenticated ? (
          <>
            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-200 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={""}
                  className="bg-red-500 hover:bg-red-600 hover:text-gray-200 transition-colors duration-200"
                  onClick={() => setIsModalOpen(true)}
                >
                  Logout
                </Link>
              </li>
            </ul>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
      {isAuthenticated ? (
        <>
          {/* Mobile Menu */}
          {isOpen && (
            <ul className="md:hidden mt-4 space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a
                      className="block text-white hover:text-gray-200 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
              <li>
            <Link
                  href={""}
                  className="bg-red-500 hover:bg-red-600 hover:text-gray-200 transition-colors duration-200"
                  onClick={() => setIsModalOpen(true)}
                >
                  Logout
                </Link>
          </li>
            </ul>
          )}
        </>
      ) : (
        <></>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleLogout}
        message="Are you sure you want to logout?"
      />
    </nav>
  );
}
