import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

onst AncetaPage = () => {

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
            console.log(token, userId);
            console.error("No cdcd
