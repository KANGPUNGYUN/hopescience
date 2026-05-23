import React, { useEffect, useId, useRef, useState } from "react";
import PropTypes from "prop-types";
import { QnAWriteChevronIcon } from "./QnAWriteIcons";

const QnAWriteCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path
      d="M5 10L8.5 13.5L15 7"
      stroke="#1e3a6d"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const QnAWriteCategorySelect = ({
  value,
  onChange,
  options,
  error,
  placeholder = "카테고리를 선택해주세요",
}) => {
  const listId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selected = options.find((item) => item.value === value);
  const displayLabel = selected?.label ?? placeholder;
  const hasValue = Boolean(value);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`qna-write-category${open ? " qna-write-category--open" : ""}${
        error ? " qna-write-category--error" : ""
      }`}
    >
      <button
        type="button"
        id={`${listId}-trigger`}
        className="qna-write-category__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${listId}-list`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={`qna-write-category__value${
            hasValue ? "" : " qna-write-category__value--placeholder"
          }`}
        >
          {displayLabel}
        </span>
        <span className="qna-write-category__chevron" aria-hidden>
          <QnAWriteChevronIcon />
        </span>
      </button>

      {open && (
        <ul
          id={`${listId}-list`}
          className="qna-write-category__list"
          role="listbox"
          aria-labelledby={`${listId}-trigger`}
        >
          {options.map((item) => {
            const isSelected = item.value === value;
            return (
              <li key={item.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`qna-write-category__option${
                    isSelected ? " qna-write-category__option--selected" : ""
                  }`}
                  onClick={() => handleSelect(item.value)}
                >
                  <span>{item.label}</span>
                  {isSelected && (
                    <span className="qna-write-category__check" aria-hidden>
                      <QnAWriteCheckIcon />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="qna-write-form__error">{error}</p>}
    </div>
  );
};

QnAWriteCategorySelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
};
