import { useState } from 'react';

const useKeyboardNavigation = ({
    itemCount,
    isDropdownVisible,
    onEnter,
    onEscape
}) => {
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const handleKeyDown = (e) => {
        if (!isDropdownVisible || itemCount === 0) return;

        const { key } = e;
        if (key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex(prev => prev < itemCount - 1 ? prev + 1 : prev);
        } else if (key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex(prev => prev > 0 ? prev - 1 : 0);
        } else if (key === "Escape") {
            e.preventDefault();
            onEscape();
            setFocusedIndex(-1);
        } else if (key === "Enter" && focusedIndex !== -1) {
            e.preventDefault();
            onEnter(focusedIndex);
        }
    };

    return { focusedIndex, handleKeyDown };
};

export default useKeyboardNavigation;
