import React from 'react';
import { usePopper } from 'react-popper';
import CheckIcon from '@mui/icons-material/Check';

interface StatusPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  currentStatus: string;
  referenceElement: HTMLElement | null;
  statusOptions?: Array<{ value: string; label: string; color: string }>;
}

export default function StatusPopover({
  isOpen,
  onClose,
  onStatusChange,
  currentStatus,
  referenceElement,
  statusOptions = [
    { value: 'PENDING', label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'APPROVED', label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
    { value: 'REJECTED', label: 'Từ chối', color: 'bg-red-100 text-red-800' },
  ],
}: StatusPopoverProps) {
  const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-48"
      >
        <div className="py-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onStatusChange(option.value);
                onClose();
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${option.color.split(' ')[0]}`} />
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
              {currentStatus === option.value && (
                <CheckIcon className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
} 