
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={onClose}>✕</button>
          </div>
          <div className="overflow-y-auto flex-grow">
            {children}
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t dark:border-gray-700 pt-4">
            <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={onClose}>Cancelar</button>
            <button onClick={onConfirm} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Salvar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
