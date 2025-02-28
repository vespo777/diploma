import React, { useEffect, useState } from "react";
import "../styles/AncetaPage.css";
import {useNavigate} from "react-router-dom";



const API_URL = 'http://localhost:8080';

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
];

const AncetaPage = () => {

    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const integer_min = 0;
    const integer_max = 450000;
    const [step, setStep] = useState(1);


    const [formData, setFormData] = useState({
        personal_info:{
            birthDate: "",
            gender: "",
            nationality: "",
            religion: "",
        },
        social_info:{
            schoolName: "",
            universityName: "",
            speciality: "",
            smoking: false,
            drinking: false,
            company: "",
            profession: "",
        },
        roommate_search:{
            budget_min: integer_min,
            budget_max: integer_max,
            status: "",
        },
        roommate_preferences:{
            wakeUpTime: "",
            sleepTime: "",
            pets: "",
        },
        location_info:{
            cityCurrent: "",
            regionFrom: "",
        },
        contacts_info:{
            callNumber: "",
            telegramNickname: "",
            isPhoneVisible: false,
        },
    });
    // Section key mapping updated to match backend endpoints
    const sectionKeyMapping = {
        1: "personal-info",
        2: "social-info",
        3: "roommate-search",
        4: "roommate-preferences",
        5: "location-details",
        6: "contacts"
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const section = name.split('.')[0];
        const key = name.split('.')[1];

        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: type === "checkbox" ? checked : value,
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sectionKey = sectionKeyMapping[step];
        if (!sectionKey) {
            console.error("Invalid step: sectionKey is undefined");
            return;
        }

        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const number = user ? user.userId : null;
        const userId = number.toString();


        if (!token || !userId) {
            console.log(token, userId);
            console.error("No token or userId found");
            return;
        }

        const sectionDataKey = sectionKey.replace("-", "_");
        let sectionData = { ...formData[sectionDataKey] };

        if (sectionKey === 'personal-info') {
            sectionData = {
                gender: sectionData.gender,
                birthDate: sectionData.birthDate,
                nationality: sectionData.nationality,
                religion: sectionData.religion
            };
        }

        try {
            const authToken = `${token}`;

            const response = await fetch(`${API_URL}/user/${sectionKey}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': authToken,
                    "Accept": "application/json",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sectionData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Ошибка обновления:", errorText);
                throw new Error(`Ошибка: ${response.status} - ${errorText}`);
            }


            const data = await response.json();
            console.log('Success response:', data);

            if (step < 6) {
                setStep(step + 1);
            } else {
                localStorage.removeItem('confirmCode')
                navigate('/');
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={"anceta-card-wrapper"}>
            <form onSubmit={handleSubmit} className="anceta-form">
                {step === 1 && (
                    <>
                        <h2>Personal Information</h2>
                        <select
                            name="personal_info.gender"
                            value={formData.personal_info.gender}
                            onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                        </select>
                        <input type="text" name="personal_info.religion" value={formData.personal_info.religion} onChange={handleChange} placeholder="Religion"/>
                        <input type="text" name="personal_info.nationality" value={formData.personal_info.nationality} onChange={handleChange} placeholder="Nationality"/>
                        <h3>Date of Birth</h3>
                        <input type="date" name="personal_info.birthDate" value={formData.personal_info.birthDate} onChange={handleChange} />
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2>Social Information</h2>
                        <div>
                            <label>School Name:</label>
                            <input
                                type="text"
                                name="social_info.schoolName"
                                value={formData.social_info.schoolName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>University Name:</label>
                            <input
                                type="text"
                                name="social_info.universityName"
                                value={formData.social_info.universityName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Speciality:</label>
                            <input
                                type="text"
                                name="social_info.speciality"
                                value={formData.social_info.speciality}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>
                                Smoking:
                                <input
                                    type="checkbox"
                                    name="social_info.smoking"
                                    checked={formData.social_info.smoking}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Drinking:
                                <input
                                    type="checkbox"
                                    name="social_info.drinking"
                                    checked={formData.social_info.drinking}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2>Characteristic for searching roommate</h2>
                            <label>Min budget:</label>
                            <input
                                type="number"
                                name="roommate_search.budget_min"
                                value={formData.roommate_search.budget_min}
                                onChange={handleChange}
                                required
                            />

                            <label>Max budget:</label>
                            <input
                                type="number"
                                name="roommate_search.budget_max"
                                value={formData.roommate_search.budget_max}
                                onChange={handleChange}
                                required
                            />

                            <label>Search Status</label>
                            <select name="roommate_search.status" value={formData.roommate_search.status} onChange={handleChange}>
                                <option value="1">I am roommate and I don't have an apartment</option>
                                <option value="2">I am roommate and I have an apartment</option>
                                <option value="3">Not searching</option>
                            </select>

                        </>
                )}

                {step === 4 && (
                    <>
                        <h2>Location Information</h2>
                        <div>
                            <label>City Current:</label>
                            <select
                                name="location_info.cityCurrent"
                                value={formData.location_info.cityCurrent}
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
                                name="location_info.regionFrom"
                                value={formData.location_info.regionFrom}
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
                    </>
                )}
                {step === 5 && (
                    <>
                        <h2>Roommate Preferences</h2>
                    <div>
                        <label>Wake Up Time:</label>
                        <input
                            type="time"
                            name="roommate_preferences.wakeUpTime"
                            value={formData.roommate_preferences.wakeUpTime}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Sleep Time:</label>
                        <input
                            type="time"
                            name="roommate_preferences.sleepTime"
                            value={formData.roommate_preferences.sleepTime}
                            onChange={handleChange}
                        />
                    </div>
                        <div>
                            <label>Pets:</label>
                            <input
                                type="text"
                                name="roommate_preferences.pets"
                                value={formData.roommate_preferences.pets}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {step === 6 && (
                    <>
                        <h2>Contacts Information</h2>
                        <div>
                            <label>Call Number:</label>
                            <input
                                type="text"
                                name="contacts_info.callNumber"
                                value={formData.contacts_info.callNumber}
                                onChange={handleChange}
                            />
                            <label>Telegram nickname:</label>
                            <input
                                type="text"
                                name="contacts_info.telegramNickname"
                                value={formData.contacts_info.telegramNickname}
                                onChange={handleChange}
                                placeholder="Telegram nickname"></input>
                        </div>
                            <div>
                                <label>
                                    Is your phone number visible:
                                    <input
                                        type="checkbox"
                                        name="contacts_info.isPhoneVisible"
                                        checked={formData.contacts_info.isPhoneVisible}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>

                    </>

                )}

                <button type="button" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</button>
                <button type="submit">{step < 6 ? "Save and next Page" : "Finish"}</button>
            </form>
        </div>
    );
};

export default AncetaPage;
