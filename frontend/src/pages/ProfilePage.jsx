import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingRabbit from '../components/pixi/Loading';
import "../styles/ProfilePage.css"

const API_URL = 'http://localhost:8080';

const regions = [
  "Astana city",
  "Almaty city",
  "Shymkent city",
  "Almaty region",
  "Aktobe region",
  "Atyrau region",
  "Akmola region",
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

const interests = [
  "Drawing and painting",
  "Photography",
  "Video creation and editing",
  "Playing musical instruments",
  "Singing and vocals",
  "Writing and literature",
  "Calligraphy",
  "Sculpting and ceramics",
  "Wood carving",
  "Graphic design",
  "Jewelry making",
  "Sewing and tailoring",
  "Knitting",
  "Embroidery",
  "Quilling",
  "Scrapbooking",
  "Decoupage",
  "Floristry",
  "Soap making",
  "Candle making",

  // Physical Activities and Sports
  "Running",
  "Swimming",
  "Yoga",
  "Dancing (ballroom, contemporary, folk)",
  "Cycling",
  "Hiking",
  "Mountaineering and rock climbing",
  "Team sports (football, basketball, volleyball)",
  "Tennis",
  "Martial arts",
  "Fitness",
  "Golf",
  "Snowboarding/Skiing",
  "Surfing",
  "Parkour",
  "Equestrian sports",
  "Rowing",
  "Archery",
  "Fencing",
  "Fishing",

  // Intellectual Hobbies
  "Reading",
  "Chess/Checkers",
  "Learning foreign languages",
  "Programming",
  "Solving puzzles and crosswords",
  "Board games",
  "Collecting (stamps, coins, books)",
  "Astronomy",
  "History and archaeology",
  "Philosophy",
  "Psychology",
  "Science and experiments",
  "Mathematics and logic puzzles",
  "Robotics",
  "Genealogy and family history research",

  // Culinary Hobbies
  "Cooking",
  "Baking",
  "BBQ and grilling",
  "Wine tasting",
  "Cocktail making",
  "Cheese making",
  "Brewing",
  "Canning and preserving",
  "Chocolate making",
  "Fruit and vegetable carving",

  // Technology and Digital Hobbies
  "Video gaming",
  "3D modeling and printing",
  "Mobile app development",
  "Blogging and social media",
  "Podcasting",
  "Web design",
  "Electronics construction",
  "Computer simulation",
  "Drone piloting",
  "VR/AR development",

  // Nature and Environment
  "Gardening",
  "Indoor plant care",
  "Birdwatching",
  "Geocaching",
  "Tourism",
  "Camping",
  "Environmental activism",
  "Meteorology",
  "Geology",
  "Astrophotography",

  // Social and Community Interests
  "Volunteering",
  "Charity work",
  "Participation in public organizations",
  "Political activism",
  "Public speaking and debates",
  "Mental health and meditation",
  "Spiritual practices",
  "Teaching and mentoring",
  "Event organization",
  "Joining hobby clubs",

  // Unique and Niche Hobbies
  "Amateur radio communication",
  "Magic tricks and illusionism",
  "Paranormal investigations",
  "Miniature creation",
  "Cynology and dog training",
  "Historical reenactment",
  "Numismatics",
  "Philately",
  "Model building (ships, planes)",
  "Diorama creation",
  "Survivalism",
  "Costume play and cosplay",
  "Genealogy",
  "Pilgrimage",
  "Restoration of antique items",
  "Learning programming languages",
  "Treasure hunting with a metal detector",
  "Stargazing",
  "Comic book creation",
  "Extreme sports"
];

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
const ProfilePage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Personality test states
  const [personalityTestCompleted, setPersonalityTestCompleted] = useState(null);
  const [personalityData, setPersonalityData] = useState(null);
  const [loadingPersonality, setLoadingPersonality] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;

    setLoading(true);

    fetch(`${API_URL}/profile/${user.userId}`, {
      method: 'GET',
      headers: {
        'Authorization': ` ${localStorage.getItem('token')}`
      }
    })
        .then(res => res.ok ? res.json() : Promise.reject('Failed to load profile'))
        .then(data => {
          setUserData(data);
        })
        .catch(err => {
          console.error("Error fetching profile:", err);
          setError(err);
        })
        .finally(() => setLoading(false));

  }, [user]);

  // Personality test status check
  useEffect(() => {
    if (!user?.userId) return;

    setLoadingPersonality(true);

    fetch(`${API_URL}/check-ml-questions?userId=${user.userId}`, {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    })
        .then(res => res.ok ? res.json() : Promise.reject('Failed to check personality test status'))
        .then(completed => {
          setPersonalityTestCompleted(completed);
          if (completed) {
            return fetch(`${API_URL}/user/get-personality-type?userId=${user.userId}`, {
              headers: {
                'Authorization': `${localStorage.getItem('token')}`
              }
            });
          }
          return null;
        })
        .then(res => res ? (res.ok ? res.json() : Promise.reject('Failed to load personality data')) : null)
        .then(data => {
          if (data) {
            setPersonalityData(data);
          }
        })
        .catch(err => {
          console.error("Error fetching personality data:", err);
        })
        .finally(() => setLoadingPersonality(false));
  }, [user]);

  const handleChange = (section, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/profile/${user.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      alert('Profile updated successfully');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInterestsChange = (interest) => {
    setUserData((prev) => {
      const currentInterests = prev.socialDetails.interests;
      return {
        ...prev,
        socialDetails: {
          ...prev.socialDetails,
          interests: currentInterests.includes(interest)
              ? currentInterests.filter((i) => i !== interest)
              : [...currentInterests, interest]
        }
      };
    });
  };

  const formatTime = (time) => (time ? time + ":00" : "");

  const handleTimeChange = (key, value) => {
    setUserData((prev) => ({
      ...prev,
      roommatePreferences: {
        ...prev.roommatePreferences,
        [key]: formatTime(value),
      },
    }));
  };

  const renderPersonalitySection = () => {
    if (loadingPersonality) {
      return <div className="personality-loading">Loading personality information...</div>;
    }

    if (personalityTestCompleted === null) {
      return null;
    }

    if (personalityTestCompleted === false) {
      return (
          <div className="personality-not-completed">
            <p>You haven't completed the personality assessment yet.</p>
            <p>Taking this assessment will help us find better roommate matches for you!</p>
            <Link to="/ml-questions" className="take-test-button">
              Take Personality Test
            </Link>
          </div>
      );
    }

    return (
        <div className="personality-results">
          {personalityData !== null ? (
              <>
                <div className="personality-score-container">
                  <div className="personality-score">
                    <div className="score-circle">
                      <span className="score-value">{personalityData}</span>
                    </div>
                  </div>
                  <div className="score-info">
                    <p className="score-description">
                      {getScoreDescription(personalityData)}
                    </p>
                    <p className="score-explanation">
                      This score represents your personality compatibility value. Higher scores indicate better compatibility potential with roommates.
                    </p>
                    <Link to="/ml-questions" className="retake-test-button">
                      Retake Test
                    </Link>
                  </div>
                </div>
              </>
          ) : (
              <p>Your personality assessment is completed, but results are still processing.</p>
          )}
        </div>
    );
  };

  const getScoreDescription = (score) => {
    if (score === 5) return "Excellent compatibility potential";
    if (score === 4) return "Very good compatibility potential";
    if (score === 3) return "Good compatibility potential";
    if (score === 2) return "Average compatibility potential";
    if (score === 1) return "Below average compatibility potential";
    return "Cannot find your type in Database";
  };

  const renderTeamSection = () => {
    if (!userData?.team) {
      return (
          <div className="team-section">
            <h3>Team</h3>
            <p>You're not part of any team yet.</p>
            <Link to="/create-team" className="create-team-button">
              Create Team
            </Link>
          </div>
      );
    }

    return (
        <div className="team-section">
          <h3>Team: {userData.team.name}</h3>
          <div className="team-members">
            <h4>Members:</h4>
            <ul>
              {userData.team.members.map((memberId, index) => {
                // In a real app, you would fetch member details based on memberId
                const isOwner = memberId === userData.team.owner.userId;
                const isCurrentUser = memberId === user.userId;
                return (
                    <li key={index} className={`member ${isCurrentUser ? 'current-user' : ''}`}>
                      {isCurrentUser ? 'You' : `Member ${memberId}`}
                      {isOwner && ' (Team Leader)'}
                    </li>
                );
              })}
            </ul>
          </div>
          <button className="leave-team-button">Leave Team</button>
        </div>
    );
  };

  if (loading) return < LoadingRabbit/>;
  if (error) return <p>Error: {error}</p>;
  if (!userData) return <p>No user data found</p>;

  return (
      <div className="profile-container">
        <h2>Your Profile</h2>
        <form className="profile-content" onSubmit={handleSubmit}>
          {/* Personal Info Section */}
          <div className="profile-section">
            <h3>Personal Info</h3>
            <input type="text" value={userData.personalInfo.name} onChange={(e) => handleChange('personalInfo', 'name', e.target.value)}/>
            <input type="text" value={userData.personalInfo.surname} onChange={(e) => handleChange('personalInfo', 'surname', e.target.value)} />
            <input type="date" value={userData.personalInfo.birthDate} onChange={(e) => handleChange('personalInfo', 'birthDate', e.target.value)} />
            <select value={userData.personalInfo.gender} onChange={(e) => handleChange('personalInfo', 'gender', e.target.value)}>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
            <select value={userData.personalInfo.religion} onChange={(e) => handleChange('personalInfo', 'religion', e.target.value)}>
              <option value="Islam">Islam</option>
              <option value="Christian">Christian</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Don't care">Don't care</option>
            </select>
          </div>

          {/* Personality Section */}
          <div className="profile-section">
            <h3>Personality type</h3>
            {renderPersonalitySection()}
          </div>

          {/* Social Details Section */}
          <div className="profile-section">
            <h3>Social Details</h3>
            <input type="text" placeholder="School Name" value={userData.socialDetails.schoolName} onChange={(e) => handleChange('socialDetails', 'schoolName', e.target.value)} />
            <select
                name="socialDetails.universityName"
                value={userData.socialDetails.universityName}
                onChange={(e) => handleChange('socialDetails', 'universityName', e.target.value)}
                required
            >
              {universities.map((universityName, index) => (
                  <option key={index} value={universityName}>
                    {universityName}
                  </option>
              ))}
            </select>
            <input type="text" placeholder="University Speciality" value={userData.socialDetails.universitySpecialty ?? ""} onChange={(e) => handleChange('socialDetails', 'universitySpecialty', e.target.value)} />
            <input type="text" placeholder="Company" value={userData.socialDetails.company ?? ""} onChange={(e) => handleChange('socialDetails', 'company', e.target.value)} />
            <select
                name="socialDetails.profession"
                value={userData.socialDetails.profession}
                onChange={(e) => handleChange('socialDetails', 'profession', e.target.value)}
                required
            >
              {professions.map((profession, index) => (
                  <option key={index} value={profession}>
                    {profession}
                  </option>
              ))}
            </select>
            <label>
              Smoking
              <input
                  type="checkbox"
                  name="socialDetails.smoking"
                  checked={userData.socialDetails.smoking}
                  onChange={(e) => handleChange('socialDetails', 'smoking', e.target.checked)}
              />
            </label>
            <label>
              Drinking
              <input
                  type="checkbox"
                  name="socialDetails.drinking"
                  checked={userData.socialDetails.drinking}
                  onChange={(e) => handleChange('socialDetails', 'drinking', e.target.checked)}
              />
            </label>
            <button type="button" className="save-button-interests" onClick={() => setIsModalOpen(true)}>Select Interests</button>
            <p>Selected Interests: {userData.socialDetails.interests.join(", ")}</p>

            {isModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <h4>Select Your Interests</h4>
                    {interests.map((interest, index) => (
                        <label key={index}>
                          <input
                              type="checkbox"
                              checked={userData.socialDetails.interests.includes(interest)}
                              onChange={() => handleInterestsChange(interest)}
                          />
                          {interest}
                        </label>
                    ))}
                    <button type="button" onClick={() => setIsModalOpen(false)}>Save</button>
                  </div>
                </div>
            )}
          </div>

          {/* Roommate Search Section */}
          <div className="profile-section">
            <h3>Roommate Search</h3>
            <input type="number" value={userData.roommateSearch.budgetMin ?? 15000} onChange={(e) => handleChange('roommateSearch', 'budgetMin', Number(e.target.value))} />
            <input type="number" value={userData.roommateSearch.budgetMax ?? 450000} onChange={(e) => handleChange('roommateSearch', 'budgetMax', Number(e.target.value))} />
            <label>Search Status</label>
            <select value={userData.roommateSearch.searchStatus} onChange={(e) => handleChange('roommateSearch', 'searchStatus', e.target.value)}>
              <option value="1">I am roommate and I don't have an apartment</option>
              <option value="2">I am roommate and I have an apartment</option>
              <option value="3">Not searching</option>
            </select>
          </div>

          {/* Roommate Preferences Section */}
          <div className="profile-section">
            <h3>Roommate Preferences</h3>
            <label>Wake up time</label>
            <input
                type="time"
                value={userData.roommatePreferences.wakeTime}
                onChange={(e) => handleTimeChange('wakeTime', e.target.value)}
            />
            <label>Sleep Time</label>
            <input
                type="time"
                value={userData.roommatePreferences.sleepTime}
                onChange={(e) => handleTimeChange('sleepTime', e.target.value)}
            />
            <label>Pets:</label>
            <select name="roommate_search.pets" value={userData.roommatePreferences.pets} onChange={(e) => handleChange('roommatePreferences', 'pets', e.target.value)} required>
              <option value="dont_have_dont_want">I dont have & dont want</option>
              <option value="dont_have_doesnt_matter">I dont have & doesn't matter</option>
              <option value="have_cat">I have a cat</option>
              <option value="have_dog">I have a dog</option>
              <option value="other_animal">Other animal</option>
            </select>
          </div>

          {/* Location Details Section */}
          <div className="profile-section">
            <h3>LocationDetails</h3>
            <label>Current City:</label>
            <select value={userData.locationDetails.currentCity} onChange={(e) => handleChange('locationDetails', 'currentCity', e.target.value)}>
              <option value="Almaty">Almaty</option>
              <option value="Nur-Sultan">Nur-Sultan</option>
            </select>

            <label>Region From:</label>
            <select
                name="location_details.regionFrom"
                value={userData.locationDetails.regionFrom}
                onChange={(e) => handleChange('locationDetails', 'regionFrom', e.target.value)}
            >
              <option value="">Select Region</option>
              {regions.map((region, index) => (
                  <option key={index} value={region}>
                    {region}
                  </option>
              ))}
            </select>
          </div>

          {/* Contacts Section */}
          <div className="profile-section">
            <h3>Contacts</h3>
            <input type="text" placeholder="Phone number" value={userData.contacts.callNumber} onChange={(e) => handleChange('contacts', 'callNumber', e.target.value)} />
            <label>
              Is your phone number visible?
              <input
                  type="checkbox"
                  name="contacts.numberVisible"
                  checked={userData.contacts.numberVisible}
                  onChange={(e) => handleChange('contacts', 'numberVisible', e.target.checked)}
              />
            </label>
            <input type="text" placeholder="Telegram nickname" value={userData.contacts.telegramNickname} onChange={(e) => handleChange('contacts', 'telegramNickname', e.target.value)} />
          </div>

          {/* Team Section */}
          {renderTeamSection()}

          <button className="save-button" type="submit">Save</button>
        </form>
      </div>
  );
};

export default ProfilePage;
