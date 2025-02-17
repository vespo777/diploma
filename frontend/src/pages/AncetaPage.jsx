import React, { useEffect, useState } from "react";
import "../styles/AncetaPage.css";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

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

const AncetaPage = ({userId}) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    let integer_min = 0;
    let integer_max = 450000;
    const [step, setStep] = useState(1);


    const [formData, setFormData] = useState({
        personal_info:{
            birthDate: "",
            gender: "",
            name: "",
            nationality: "",
            surname: "",
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
            email: "",
            phone: "",
            facebook: "",
            instagram: "",
            linkedin: "",
            isPhoneVisible: false,
        },
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
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

        const sectionKey = Object.keys(formData)[step - 1];
        const sectionData = formData[sectionKey];

        try {
            const response = await fetch(`http://localhost:8080/user/personal-info/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(sectionData)
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.json();
            console.log("Персональная информация успешно обновлена:", data);
            setStep(step + 1);

        } catch (error) {
            console.error("Ошибка при обновлении анкеты:", error.message);
        }
    };



    return (
        <div className={"anceta-card-wrapper"}>
            <h1>Profile Form</h1>
            {/*<form onSubmit={handleSubmit}>*/}
            {/*    <div>*/}
            {/*        <label>Birth Date:</label>*/}
            {/*        <input*/}
            {/*            type="date"*/}
            {/*            name="birthDate"*/}
            {/*            value={formData.personal_info.birthDate}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Gender:</label>*/}
            {/*        <select*/}
            {/*            name="gender"*/}
            {/*            value={formData.personal_info.gender}*/}
            {/*            onChange={handleChange}*/}
            {/*        >*/}
            {/*            <option value="">Select Gender</option>*/}
            {/*            <option value="Male">Male</option>*/}
            {/*            <option value="Female">Female</option>*/}
            {/*            <option value="Other">Other</option>*/}
            {/*        </select>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>School Name:</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="schoolName"*/}
            {/*            value={formData.schoolName}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>School Region:</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="schoolRegion"*/}
            {/*            value={formData.schoolRegion}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>University Name:</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="universityName"*/}
            {/*            value={formData.universityName}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Speciality:</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="speciality"*/}
            {/*            value={formData.speciality}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>City Current:</label>*/}
            {/*        <select*/}
            {/*            name="cityCurrent"*/}
            {/*            value={formData.cityCurrent}*/}
            {/*            onChange={handleChange}*/}
            {/*        >*/}
            {/*            <option value="">Select City</option>*/}
            {/*            <option value="Almaty">Almaty</option>*/}
            {/*            <option value="Nur-Sultan">Nur-Sultan</option>*/}
            {/*        </select>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Region From:</label>*/}
            {/*        <select*/}
            {/*            name="regionFrom"*/}
            {/*            value={formData.regionFrom}*/}
            {/*            onChange={handleChange}*/}
            {/*        >*/}
            {/*            <option value="">Select Region</option>*/}
            {/*            {regions.map((region, index) => (*/}
            {/*                <option key={index} value={region}>*/}
            {/*                    {region}*/}
            {/*                </option>*/}
            {/*            ))}*/}
            {/*        </select>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Wake Up Time:</label>*/}
            {/*        <input*/}
            {/*            type="time"*/}
            {/*            name="wakeUpTime"*/}
            {/*            value={formData.wakeUpTime}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Sleep Time:</label>*/}
            {/*        <input*/}
            {/*            type="time"*/}
            {/*            name="sleepTime"*/}
            {/*            value={formData.sleepTime}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Interests:</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="interests"*/}
            {/*            value={formData.interests}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Status:</label>*/}
            {/*        <select*/}
            {/*            name="status"*/}
            {/*            value={formData.status}*/}
            {/*            onChange={handleChange}*/}
            {/*        >*/}
            {/*            <option value="">Select Status</option>*/}
            {/*            <option value="1">*/}
            {/*                I am roommate and I don't have an apartment*/}
            {/*            </option>*/}
            {/*            <option value="2">I am roommate and I have an apartment</option>*/}
            {/*            <option value="3">Not searching</option>*/}
            {/*        </select>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Pets:</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="pets"*/}
            {/*            value={formData.pets}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <h2>Private Information</h2>*/}
            {/*        <label>Religion:</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="religion"*/}
            {/*            value={formData.religion}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Nation:</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="nation"*/}
            {/*            value={formData.nation}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>Telegram Nickname:</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            name="telegramNickname"*/}
            {/*            value={formData.telegramNickname}*/}
            {/*            onChange={handleChange}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <label>*/}
            {/*            Is your phone number visible:*/}
            {/*            <input*/}
            {/*                type="checkbox"*/}
            {/*                name="isPhoneVisible"*/}
            {/*                checked={formData.isPhoneVisible}*/}
            {/*                onChange={handleChange}*/}
            {/*            />*/}
            {/*        </label>*/}
            {/*    </div>*/}
            {/*    <button type="submit">Submit</button>*/}
            {/*</form>*/}


            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <>
                        <h2>Персональная информация</h2>
                        <input type="text" name="personal_info.name" value={formData.personal_info.name} onChange={handleChange} placeholder="Имя"/>
                        <input type="text" name="personal_info.surname" value={formData.personal_info.surname} onChange={handleChange} placeholder="Фамилия"/>
                        <input type="date" name="personal_info.birthDate" value={formData.personal_info.birthDate} onChange={handleChange} />
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2>Социальная информация</h2>
                        <input type="text" name="social_info.schoolName" value={formData.social_info.schoolName} onChange={handleChange} placeholder="Школа"/>
                        <input type="text" name="social_info.universityName" value={formData.social_info.universityName} onChange={handleChange} placeholder="Университет"/>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2>Characteristic for searching roommate</h2>
                        <input type="text" name="social_info.schoolName" value={formData.social_info.schoolName} onChange={handleChange} placeholder="Школа"/>
                        <input type="text" name="social_info.universityName" value={formData.social_info.universityName} onChange={handleChange} placeholder="Университет"/>
                    </>
                )}

                <button type="button" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</button>
                <button type="submit">{step < 6 ? "Save and next Page" : "Завершить"}</button>
            </form>

        </div>


    );
};

export default AncetaPage;
