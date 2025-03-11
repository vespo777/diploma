import React, { useEffect, useState } from "react";
import "../styles/AncetaPage.css";
import {useNavigate} from "react-router-dom";
import WalkingAssistant from "../components/pixi/Extensions";


const API_URL = 'http://localhost:8080';

const universities = [
    "Al-Farabi Kazakh National University",
    "Abai Kazakh National Pedagogical University",
    "Satbayev University (Kazakh National Research Technical University)",
    "Asfendiyarov Kazakh National Medical University",
    "Kurmagazy Kazakh National Conservatory",
    "KIMEP University",
    "Turan University",
    "Kazakhstan-British Technical University",
    "L.N. Gumilyov Eurasian National University",
    "Astana Medical University",
    "S. Seifullin Kazakh Agrotechnical University",
    "Nazarbayev University"
];

const regions = [
    "Астана city",
    "Алматы city",
    "Шымкент city",
    "Алматы region",
    "Актобе region",
    "Атырау region",
    "Ақмола region",
    "West Kazakhstan region",
    "East Kazakhstan region",
    "Zhambyl region",
    "Karaganda region",
    "Kostanai region",
    "Kyzylorda region",
    "Mangystau region",
    "North Kazakhstan region",
    "Pavlodar region",
    "Turkestan region",
    "Abay region",
    "Zhetysu region",
    "Ulytau region"
];

const professions = [
    "Civil Engineer",
    "Architect",
    "Electrical Engineer",
    "Mechanical Engineer",
    "Chemical Engineer",
    "Aerospace Engineer",
    "Petroleum Engineer",
    "Mining Engineer",
    "Process Engineer",
    "Telecommunications Engineer",

    "Programmer",
    "Software Developer",
    "Web Developer",
    "System Administrator",
    "Cybersecurity Specialist",
    "Database Administrator",
    "UX/UI Designer",
    "DevOps Engineer",
    "Data Scientist",
    "QA Engineer (Tester)",

    "General Practitioner",
    "Surgeon",
    "Pediatrician",
    "Dentist",
    "Nurse",
    "Pharmacist",
    "Psychiatrist",
    "Veterinarian",
    "Physiotherapist",
    "Radiologist",

    "Teacher",
    "University Lecturer",
    "Researcher",
    "Kindergarten Teacher",
    "Coach/Instructor",
    "Librarian",
    "Educational Psychologist",
    "Social Educator",
    "Speech Therapist",
    "Methodologist",

    "Accountant",
    "Financial Analyst",
    "Auditor",
    "Bank Employee",
    "Economist",
    "Sales Manager",
    "Marketing Specialist",
    "HR Specialist",
    "Business Analyst",
    "Management Consultant",

    "Lawyer",
    "Attorney",
    "Judge",
    "Prosecutor",
    "Notary",
    "Police Officer",
    "Firefighter",
    "Military Serviceman",
    "Customs Officer",
    "Diplomat",

    "Pilot",
    "Train Operator",
    "Driver",
    "Logistics Specialist",
    "Dispatcher",
    "Sailor",
    "Flight Attendant",
    "Vehicle Mechanic",
    "Crane Operator",
    "Freight Specialist",

    "Chef",
    "Waiter",
    "Bartender",
    "Hairdresser",
    "Cosmetologist",
    "Hotel Administrator",
    "Travel Agent",
    "Fitness Trainer",
    "Massage Therapist",
    "Animator",

    "Artist",
    "Musician",
    "Actor",
    "Director",
    "Designer",
    "Photographer",
    "Journalist",
    "Writer",
    "Dancer",
    "Fashion Designer",

    "Agronomist",
    "Farmer",
    "Ecologist",
    "Zootechnician",
    "Forester",
    "Gardener",
    "Fish Farmer",
    "Meteorologist",
    "Geologist",
    "Hydrologist",

    "Blockchain Developer",
    "AI Specialist",
    "Digital Marketing Expert",
    "VR/AR Developer",
    "Additive Manufacturing Specialist",
    "Bioengineer",
    "Geneticist",
    "Renewable Energy Engineer",
    "Robotics Engineer",
    "Nanotechnology Specialist"
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
        social_details:{
            schoolName: "",
            universityName: "",
            universitySpecialty: "",
            smoking: false,
            drinking: false,
            company: "",
            profession: "",
        },
        roommate_search:{
            budgetMin: integer_min,
            budgetMax: integer_max,
            searchStatus: 3,
            scoreTest: 0

        },
        roommate_preferences:{
            wakeTime: "",
            sleepTime: "",
            pets: "",
        },
        location_details:{
            currentCity: "",
            regionFrom: "",
        },
        contacts:{
            callNumber: "",
            telegramNickname: "",
        },
    });
    // Section key mapping updated to match backend endpoints
    const sectionKeyMapping = {
        1: "personal-info",
        2: "social-details",
        3: "roommate-search",
        5: "roommate-preferences",
        4: "location-details",
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
            console.error("No token or userId found");
            return;
        }

        const sectionDataKey = sectionKey.replace("-", "_");
        let sectionData = { ...formData[sectionDataKey] };


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
            <WalkingAssistant />
            <form onSubmit={handleSubmit} className="anceta-form">
                {step === 1 && (
                    <>
                        <h2>Personal Information</h2>
                        <input type="text" name="personal_info.nationality" value={formData.personal_info.nationality} onChange={handleChange} placeholder="Nationality" required/>
                        <h3>Date of Birth</h3>
                        <input type="date" name="personal_info.birthDate" value={formData.personal_info.birthDate} onChange={handleChange} required/>
                        <select className="selector"
                                name="personal_info.gender"
                                value={formData.personal_info.gender}
                                onChange={handleChange}
                                required
                        >
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                        </select>
                        <select className="selector"
                                name="personal_info.religion"
                                value={formData.personal_info.religion}
                                onChange={handleChange}
                                required
                        >
                            <option value="">Select Religion</option>
                            <option value="Islam">Islam</option>
                            <option value="Christian">Christian</option>
                            <option value="Buddhism">Buddhism</option>
                            <option value="Don't care">Don't care</option>
                        </select>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2>Social Information</h2>
                        <div>
                            <label>School Name:</label>
                            <input
                                type="text"
                                name="social_details.schoolName"
                                value={formData.social_details.schoolName}
                                onChange={handleChange}
                                placeholder="type name of your school . . ."
                                required
                            />
                        </div>
                        <div>
                            <label>University:</label>
                            <select
                            name="social_details.universityName"
                            value={formData.social_details.universityName}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select University</option>
                            {universities.map((universityName, index) => (
                                <option key={index} value={universityName}>
                                    {universityName}
                                </option>
                            ))}
                        </select>
                        </div>
                        <div>
                            <label>University Speciality:</label>
                            <input
                                type="text"
                                name="social_details.universitySpecialty"
                                value={formData.social_details.universitySpecialty}
                                onChange={handleChange}
                                placeholder="type your university speciality . . ."
                                required
                            />
                        </div> <div>
                            <label>Prefession:</label>
                            <select
                                name="social_details.profession"
                                value={formData.social_details.profession}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Profession</option>
                                {professions.map((profession, index) => (
                                    <option key={index} value={profession}>
                                        {profession}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Company</label>
                            <input
                                type="text"
                                name="social_details.company"
                                value={formData.social_details.company}
                                placeholder="type company name where you working . . ."
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>
                                Smoking
                                <input
                                    type="checkbox"
                                    name="social_details.smoking"
                                    checked={formData.social_details.smoking}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Drinking
                                <input
                                    type="checkbox"
                                    name="social_details.drinking"
                                    checked={formData.social_details.drinking}
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
                                name="roommate_search.budgetMin"
                                value={formData.roommate_search.budgetMin}
                                onChange={handleChange}
                                required
                            />

                            <label>Max budget:</label>
                            <input
                                type="number"
                                name="roommate_search.budgetMax"
                                value={formData.roommate_search.budgetMax}
                                onChange={handleChange}
                                required
                            />

                            <label>Search Status</label>
                            <select name="roommate_search.searchStatus" value={formData.roommate_search.searchStatus} onChange={handleChange} required>
                                <option value="1">I am roommate and I don't have an apartment</option>
                                <option value="2">I am roommate and I have an apartment</option>
                                <option value="3">Not searching</option>
                            </select>
                        </>
                )}

                {step === 5 && (
                    <>
                        <h2>Roommate Preferences</h2>
                        <div>
                            <label>Wake Up Time:</label>
                            <input
                                type="time"
                                name="roommate_preferences.wakeTime"
                                value={formData.roommate_preferences.wakeTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Sleep Time:</label>
                            <input
                                type="time"
                                name="roommate_preferences.sleepTime"
                                value={formData.roommate_preferences.sleepTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Pets:</label>
                            <select name="roommate_search.pets" value={formData.roommate_search.pets} onChange={handleChange} required>
                                <option value="dont_have_dont_want">I dont have & dont want</option>
                                <option value="dont_have_doesnt_matter">I dont have & doesn't matter</option>
                                <option value="have_cat">I have a cat</option>
                                <option value="have_dog">I have a dog</option>
                                <option value="other_animal">Other animal</option>
                            </select>
                        </div>
                    </>
                )}

                {step === 4 && (
                    <>
                        <h2>Location Information</h2>
                        <div>
                            <label>City Current:</label>
                            <select
                                name="location_details.currentCity"
                                value={formData.location_details.currentCity}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select City</option>
                                <option value="Almaty">Almaty</option>
                                <option value="Nur-Sultan">Nur-Sultan</option>
                            </select>
                        </div>
                        <div>
                            <label>Region From:</label>
                            <select
                                name="location_details.regionFrom"
                                value={formData.location_details.regionFrom}
                                onChange={handleChange}
                                required
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

                {step === 6 && (
                    <>
                        <h2>Contacts Information</h2>
                        <div>
                            <label>Call Number:</label>
                            <input
                                type="text"
                                name="contacts.callNumber"
                                value={formData.contacts.callNumber}
                                onChange={handleChange}
                                placeholder="type your call number . . ."
                                required
                            />
                            <label>Telegram nickname:</label>
                            <input
                                type="text"
                                name="contacts.telegramNickname"
                                value={formData.contacts.telegramNickname}
                                onChange={handleChange}
                                placeholder="type your telegram nickname . . . "
                                required
                            />

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
