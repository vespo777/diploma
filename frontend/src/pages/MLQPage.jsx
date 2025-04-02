import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/PersonalityTestPage.css';

// Вопросы по категориям
const ext_questions = {
  'EXT1': 'I am the life of the party',
  'EXT2': 'I dont talk a lot',
  'EXT3': 'I feel comfortable around people',
  'EXT4': 'I keep in the background',
  'EXT5': 'I start conversations',
  'EXT6': 'I have little to say',
  'EXT7': 'I talk to a lot of different people at parties',
  'EXT8': 'I dont like to draw attention to myself',
  'EXT9': 'I dont mind being the center of attention',
  'EXT10': 'I am quiet around strangers'
};

const est_questions = {
  'EST1': 'I get stressed out easily',
  'EST2': 'I am relaxed most of the time',
  'EST3': 'I worry about things',
  'EST4': 'I seldom feel blue',
  'EST5': 'I am easily disturbed',
  'EST6': 'I get upset easily',
  'EST7': 'I change my mood a lot',
  'EST8': 'I have frequent mood swings',
  'EST9': 'I get irritated easily',
  'EST10': 'I often feel blue'
};

const agr_questions = {
  'AGR1': 'I feel little concern for others',
  'AGR2': 'I am interested in people',
  'AGR3': 'I insult people',
  'AGR4': 'I sympathize with others feelings',
  'AGR5': 'I am not interested in other peoples problems',
  'AGR6': 'I have a soft heart',
  'AGR7': 'I am not really interested in others',
  'AGR8': 'I take time out for others',
  'AGR9': 'I feel others emotions',
  'AGR10': 'I make people feel at ease'
};

const csn_questions = {
  'CSN1': 'I am always prepared',
  'CSN2': 'I leave my belongings around',
  'CSN3': 'I pay attention to details',
  'CSN4': 'I make a mess of things',
  'CSN5': 'I get chores done right away',
  'CSN6': 'I often forget to put things back in their proper place',
  'CSN7': 'I like order',
  'CSN8': 'I shirk my duties',
  'CSN9': 'I follow a schedule',
  'CSN10': 'I am exacting in my work'
};

const opn_questions = {
  'OPN1': 'I have a rich vocabulary',
  'OPN2': 'I have difficulty understanding abstract ideas',
  'OPN3': 'I have a vivid imagination',
  'OPN4': 'I am not interested in abstract ideas',
  'OPN5': 'I have excellent ideas',
  'OPN6': 'I do not have a good imagination',
  'OPN7': 'I am quick to understand things',
  'OPN8': 'I use difficult words',
  'OPN9': 'I spend time reflecting on things',
  'OPN10': 'I am full of ideas'
};

// Получение всех вопросов в правильном порядке
const getAllQuestions = () => {
  const allQuestions = [];

  // Добавляем вопросы в правильном порядке
  Object.entries(ext_questions).forEach(([id, text]) => {
    allQuestions.push({ id, text, category: 'Extraversion' });
  });

  Object.entries(est_questions).forEach(([id, text]) => {
    allQuestions.push({ id, text, category: 'Emotional Stability' });
  });

  Object.entries(agr_questions).forEach(([id, text]) => {
    allQuestions.push({ id, text, category: 'Agreeableness' });
  });

  Object.entries(csn_questions).forEach(([id, text]) => {
    allQuestions.push({ id, text, category: 'Conscientiousness' });
  });

  Object.entries(opn_questions).forEach(([id, text]) => {
    allQuestions.push({ id, text, category: 'Openness' });
  });

  return allQuestions;
};

const PersonalityTestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const allQuestions = getAllQuestions();

  // Инициализация ответов
  useEffect(() => {
    const initialAnswers = {};
    allQuestions.forEach(q => {
      initialAnswers[q.id] = null;
    });
    setAnswers(initialAnswers);
  }, []);

  // Обработчик изменения ответа
  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Проверка заполнения всех ответов
  const areAllQuestionsAnswered = () => {
    return Object.values(answers).every(a => a !== null && a !== undefined);
  };

  // Отправка ответов на сервер
  const submitAnswers = async () => {
    if (!areAllQuestionsAnswered()) {
      setError('Please answer all questions before submitting.');
      return;
    }

    // Преобразование ответов в массив в нужном порядке
    const orderedAnswers = allQuestions.map(q => answers[q.id]);

    setSubmitting(true);
    setError(null);

    console.log("\n\nDEBUG --- answers: ", orderedAnswers, "\n\n")

    try {
      const response = await fetch('http://localhost:8080/give-classtered-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          answers: orderedAnswers
        })
      });

      console.log("\n\nDEBUG --> response", response, "\n\n")
      console.log("\n\nDEBUG --> user.userId:", user.userId, "\n\n")
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      setSuccess(true);

      // Перенаправление пользователя после успешной отправки
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (err) {
      console.error('Error submitting answers:', err);
      setError('Failed to submit your answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Отрисовка всех вопросов
  const renderQuestions = () => {
    let currentCategory = null;

    return (
      <div className="questions-container">
        {allQuestions.map((question, index) => {
          // Добавляем заголовок категории, если она изменилась
          const categoryHeader = question.category !== currentCategory ? (
            <h2 className="category-header">{question.category}</h2>
          ) : null;

          currentCategory = question.category;

          return (
            <React.Fragment key={question.id}>
              {categoryHeader}
              <div className="question-item">
                <p className="question-text">
                  <span className="question-number">{index + 1}.</span> {question.text}
                </p>
                <div className="rating-options">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} className={`rating-option ${answers[question.id] === value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name={question.id}
                        value={value}
                        checked={answers[question.id] === value}
                        onChange={() => handleAnswer(question.id, value)}
                      />
                      <span>{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="personality-test-page">
      <div className="test-container">
        <h1>Personality Assessment</h1>
        <p className="test-instructions">
          Rate how much you agree with each statement on a scale from 1 (strongly disagree) to 5 (strongly agree).
        </p>

        {renderQuestions()}

        <div className="submit-container">
          <button
            className="submit-button"
            onClick={submitAnswers}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit All Answers'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Your answers have been submitted successfully!</div>}
      </div>
    </div>
  );
};

export default PersonalityTestPage;
