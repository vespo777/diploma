import { useState } from "react";

export default function ToggleSwitchNumberVisible() {
    const [isOn, setIsOn] = useState(false);

    return (
        <div
            className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition duration-300 ${isOn ? "bg-blue-500" : "bg-gray-400"}`}
            onClick={() => setIsOn(!isOn)}
        >
            <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOn ? "translate-x-6" : "translate-x-0"}`}
            />
        </div>
    );
}
