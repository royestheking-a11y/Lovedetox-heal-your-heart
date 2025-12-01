import { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        // Allow only last entered character
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Trigger onComplete if all fields are filled
        const combinedOtp = newOtp.join('');
        if (combinedOtp.length === length) {
            onComplete(combinedOtp);
        }

        // Move to next input if value is entered
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleClick = (index: number) => {
        inputRefs.current[index]?.setSelectionRange(1, 1);

        // Optional: if previous field is empty, focus that instead
        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf('')]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, length);

        if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < length) newOtp[i] = char;
        });
        setOtp(newOtp);

        const combinedOtp = newOtp.join('');
        if (combinedOtp.length === length) {
            onComplete(combinedOtp);
            inputRefs.current[length - 1]?.focus();
        } else {
            inputRefs.current[pastedData.length]?.focus();
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((value, index) => (
                <input
                    key={index}
                    ref={(ref) => { inputRefs.current[index] = ref }}
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onClick={() => handleClick(index)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-10 h-12 text-center text-xl font-bold border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-[#6366F1] focus:outline-none bg-white dark:bg-gray-800 dark:text-white transition-all"
                    maxLength={1}
                />
            ))}
        </div>
    );
}
