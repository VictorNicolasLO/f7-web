import { useCallback, useState } from "react";

export const useInput = (initialValue: string = '') => {
    const [value, setValue] = useState(initialValue);

    const onValueChange = useCallback((val: string | undefined) => {
        setValue(val || '');
    }, [setValue]);

    const reset = useCallback( () => {
        setValue(initialValue);
    }, [initialValue, setValue]);

    return {
        value,
        onValueChange,
        reset,
    };
}