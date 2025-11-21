import { LuKey, LuEye, LuCheck, LuX, LuEyeClosed } from "react-icons/lu";
import { useState } from "react";

const PasswordField = ({ login }) => {
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState("");

    // Validation rules
    const rules = {
        length: password.length >= 6,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
    };

    // Strength calculation
    const strengthCount = Object.values(rules).filter(Boolean).length;
    const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-600"];
    const strengthLabel = strengthLabels[strengthCount];
    const strengthColor = strengthColors[strengthCount];

    return (
        <>
            <label className="label text-sm" htmlFor="pass">
                Password
            </label>
            <label className="input input-lg w-full">
                <LuKey className="opacity-50 size-4" />
                {login ? (
                    // Login page no validation
                    <input
                        type={showPass ? "text" : "password"}
                        name="pass"
                        required
                        placeholder="Password"
                    />
                ) : (
                    // Register page with validation rules
                    <input
                        type={showPass ? "text" : "password"}
                        name="pass"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                        minLength={6}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                        title="Must be more than 6 characters, including number, lowercase letter, uppercase letter"
                    />
                )}
                <button type="button" onClick={() => setShowPass((prev) => !prev)}>
                    {showPass ? <LuEyeClosed className="opacity-50" /> : <LuEye className="opacity-50" />}
                </button>
            </label>

            {/* 👉 Validation checklist only for Register */}
            {!login && password.length > 0 && (<>
                {/* Strength meter */}
                <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                        <div
                            className={`h-2 rounded ${strengthColor} transition-all duration-500 ease-in-out`}
                            style={{ width: `${(strengthCount / 4) * 100}%` }}
                        ></div>

                    </div>
                    <p className="text-sm mt-1 font-medium">{strengthLabel}</p>
                </div>
                <ul className="text-sm mt-2">
                    <li
                        className={`flex items-center gap-2 ${rules.length ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {rules.length ? <LuCheck /> : <LuX />} At least 6 characters
                    </li>
                    <li
                        className={`flex items-center gap-2 ${rules.lowercase ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {rules.lowercase ? <LuCheck /> : <LuX />} Contains lowercase letter
                    </li>
                    <li
                        className={`flex items-center gap-2 ${rules.uppercase ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {rules.uppercase ? <LuCheck /> : <LuX />} Contains uppercase letter
                    </li>
                    <li
                        className={`flex items-center gap-2 ${rules.number ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {rules.number ? <LuCheck /> : <LuX />} Contains number
                    </li>
                </ul>

            </>
            )}
        </>
    );
};

export default PasswordField;