// AncetaPage.jsx
import React, { useState } from "react";

const regions = [
    "Almaty Region",
    "Nur-Sultan Region",
    "Shymkent Region",
    "East-Kazakhstan Region",
    "West-Kazakhstan Region",
    "South-Kazakhstan Region",
    "North-Kazakhstan Region",
    "Karaganda Region",
    "Atyrau Region",
    "Aktobe Region",
    "Kostanay Region",
    "Pavlodar Region",
    "Mangystau Region",
    "Kyzylorda Region",
    "Akmola Region",
    // Добавить остальные регионы здесь
];

const AncetaPage = () => {
    const [formData, setFormData] = useState({
        birthDate: "",
        gender: "",
        schoolName: "",
        schoolRegion: "",
        universityName: "",
        speciality: "",
        cityCurrent: "",
        regionFrom: "",
        wakeUpTime: "",
        sleepTime: "",
        interests: "",
        status: "",
        pets: "",
        religion: "",
        nation: "",
        telegramNickname: "",
        isPhoneVisible: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        // Отправка данных на сервер
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Profile Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Birth Date:</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Gender:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label>School Name:</label>
                    <input
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>School Region:</label>
                    <input
                        type="text"
                        name="schoolRegion"
                        value={formData.schoolRegion}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>University Name:</label>
                    <input
                        type="text"
                        name="universityName"
                        value={formData.universityName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Speciality:</label>
                    <input
                        type="text"
                        name="speciality"
                        value={formData.speciality}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>City Current:</label>
                    <select
                        name="cityCurrent"
                        value={formData.cityCurrent}
                        onChange={handleChange}
                    >
                        <option value="">Select City</option>
                        <option value="Almaty">Almaty</option>
                        <option value="Nur-Sultan">Nur-Sultan</option>
                    </select>
                </div>
                <div>
                    <label>Region From:</label>
                    <select
                        name="regionFrom"
                        value={formData.regionFrom}
                        onChange={handleChange}
                    >
                        <option value="">Select Region</option>
                        {regions.map((region, index) => (
                            <option key={index} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Wake Up Time:</label>
                    <input
                        type="time"
                        name="wakeUpTime"
                        value={formData.wakeUpTime}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Sleep Time:</label>
                    <input
                        type="time"
                        name="sleepTime"
                        value={formData.sleepTime}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Interests:</label>
                    <input
                        type="text"
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="">Select Status</option>
                        <option value="1">
                            I am roommate and I don't have an apartment
                        </option>
                        <option value="2">I am roommate and I have an apartment</option>
                        <option value="3">Not searching</option>
                    </select>
                </div>
                <div>
                    <label>Pets:</label>
                    <input
                        type="text"
                        name="pets"
                        value={formData.pets}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <h2>Private Information</h2>
                    <label>Religion:</label>
                    <input
                        type="text"
                        name="religion"
                        value={formData.religion}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Nation:</label>
                    <input
                        type="text"
                        name="nation"
                        value={formData.nation}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Telegram Nickname:</label>
                    <input
                        type="text"
                        name="telegramNickname"
                        value={formData.telegramNickname}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>
                        Is your phone number visible:
                        <input
                            type="checkbox"
                            name="isPhoneVisible"
                            checked={formData.isPhoneVisible}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

// <div className="input-group">
//     <label className="date-label">Date of birth</label>
//     <input
//         type="date"
//         name="birthDate"
//         className="auth-input"
//         value={formData.birthDate}
//         onChange={handleChange}
//         required
//     />
// </div>

export default AncetaPage;
