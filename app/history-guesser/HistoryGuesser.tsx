'use client';
import React, { useState, useCallback, useEffect } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import questionsData from "../../lib/data/history-guesser.json"; // Adjust the path as necessary


interface Question {
  id: number;
  question: string;
  answer: { lat: number; lng: number };
  hint: string;
  tolerance: number;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
}

interface LatLng {
  lat: number;
  lng: number;
}

const CustomMap = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userGuess, setUserGuess] = useState<{ lat: number; lng: number } | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<{ lat: number; lng: number } | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isDropMarkerMode, setIsDropMarkerMode] = useState(true);
  
  useEffect(() => {
    try {
      setQuestions(questionsData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions');
      setLoading(false);
    }
  }, []);

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;
  
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  interface MapClickEvent {
    detail: {
      latLng: LatLng | null;
    };
  }

  const handleMapClick = useCallback((event: MapClickEvent) => {
    if (gameState !== 'playing') return;
    const latLng = event.detail.latLng;
    if (!latLng) return;
    setUserGuess({ lat: latLng.lat, lng: latLng.lng });
  }, [gameState]);

  const makeGuess = () => {
    if (!userGuess || gameState !== 'playing' || !currentQuestion) return;
    setCorrectAnswer(currentQuestion.answer);
    const distance = calculateDistance(
      userGuess.lat, userGuess.lng,
      currentQuestion.answer.lat, currentQuestion.answer.lng
    );
    const isCorrect: boolean = distance <= 50;
    if (isCorrect) {
      setScore(score + 1);
      setFeedback('🎉 Amazing! You nailed it!');
    } else {
      setFeedback(`💭 Close one! You were ${Math.round(distance)}km away from the target.`);
    }
    setGameState('answered');
  };

  const clearMarker = () => {
    setUserGuess(null);
    setIsDropMarkerMode(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserGuess(null);
      setCorrectAnswer(null);
      setGameState('playing');
      setShowHint(false);
      setFeedback('');
      setIsDropMarkerMode(true);
    } else {
      setGameState('finished');
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserGuess(null);
    setCorrectAnswer(null);
    setScore(0);
    setGameState('playing');
    setShowHint(false);
    setFeedback('');
    setIsDropMarkerMode(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl max-w-md border border-white/20">
          <div className="text-center">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            <p className="text-white/90 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-all transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🌍</div>
          <p className="text-xl">No questions available for this adventure.</p>
        </div>
      </div>
    );
  }

  interface ToleranceCircleProps {
    center: LatLng;
    radius: number;
  }

  const ToleranceCircle: React.FC<ToleranceCircleProps> = ({ center, radius }) => {
    const map = useMap();
    
    useEffect(() => {
      if (!map) return;
      const circle = new google.maps.Circle({
        strokeColor: "#10b981",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#34d399",
        fillOpacity: 0.25,
        map,
        center,
        radius: radius * 1000,
      });
      return () => circle.setMap(null);
    }, [map, center, radius]);
    return null;
  };

  return (
    <div className="min-h-[90vh] ">
      <div className="relative flex flex-col h-[90vh]">
        {/* header */}
        <div className="absolute top-4 left-4 right-4 z-10 bg-black/100 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-2xl">
          <div className="flex justify-between items-center text-white">
            <div>
              <h1 className="text-2xl font-bold bg-white bg-clip-text text-transparent">
                {currentQuestion.question}
              </h1>
            </div>
            <div className="text-right">
              <div className="bg-black px-4 py-2 rounded-full">
                <span className="font-bold text-lg">{score}/{questions.length}</span>
              </div>
              <p className="text-white/70 text-sm mt-1">Question {currentQuestionIndex + 1}/{questions.length}</p>
            </div>
          </div>
        </div>

        {/* Map container */}
        <div className="flex-1 relative mt-20 mx-4 mb-4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
          <APIProvider apiKey={process.env.GOOGLE_API_KEY || ""}>
            <Map
              style={{ height: "100%", width: "100%" }}
              defaultZoom={currentQuestion.mapZoom}
              defaultCenter={currentQuestion.mapCenter}
              gestureHandling={"greedy"}
              disableDefaultUI
              onClick={handleMapClick}
              mapId="77c887a07c2c59f8651bae4f"
            >
              {userGuess && (
                <Marker position={userGuess} title="Your guess" />
              )}
              {correctAnswer && gameState === 'answered' && (
                <>
                  <Marker position={correctAnswer} title="Correct location" />
                  <ToleranceCircle center={correctAnswer} radius={50} />
                </>
              )}
            </Map>
          </APIProvider>
          
          {/* Hint overlay */}
          {showHint && gameState === 'playing' && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="bg-orange-400/50 backdrop-blur-sm rounded-2xl p-4 border border-yellow-200/50 shadow-lg">
                <p className="text-center font-semibold text-yellow-800 flex items-center justify-center">
                  <span className="text-2xl mr-2">💡</span>
                  {currentQuestion.hint}
                </p>
              </div>
            </div>
          )}
          
          {/* Game finished overlay */}
           {gameState === 'finished' && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md mx-4 text-center">
                <div className="text-6xl mb-4">
                  {score === questions.length ? '🏆' : score >= questions.length * 0.7 ? '🎉' : '📚'}
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Quest Complete!</h2>
                <div className={`rounded-2xl p-4 mb-6 ${
                  score === questions.length 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : score >= questions.length * 0.7 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}>
                  <p className="text-2xl font-bold text-white">
                    {score}/{questions.length}
                  </p>
                  <p className="text-white/90">Final Score</p>
                </div>
                <div className="mb-6 text-white/90">
                  {score === questions.length && (
                    <p className="font-semibold">Perfect! You're a geography legend! 🌟</p>
                  )}
                  {score >= questions.length * 0.7 && score < questions.length && (
                    <p className="font-semibold">Excellent work! You know your locations! ⭐</p>
                  )}
                  {score < questions.length * 0.7 && (
                    <p className="font-semibold">Keep exploring! Every journey teaches us something! 🗺️</p>
                  )}
                </div>
                <button
                  onClick={resetQuiz}
                  className={`text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg bg-blue-500`}
                >
                  🔄 New Adventure
                </button>
              </div>
            </div>
          )}
        </div>

        {/* button panel */}
        <div className="mx-4 mb-4">
          {gameState === 'playing' && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center justify-center gap-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <span className="text-lg">💡</span>
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  
                  <button
                    onClick={clearMarker}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <span className="text-lg">🗑️</span>
                    Clear
                  </button>
                </div>
                
                <div className="w-px h-12 bg-white/30"></div>
                
                <button
                  onClick={makeGuess}
                  className={`px-12 py-4 rounded-2xl font-bold text-xl transition-all transform shadow-lg flex items-center gap-3 ${
                    userGuess 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105' 
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                  disabled={!userGuess}
                >
                  <span className="text-2xl">🎯</span>
                  Make Guess
                </button>
              </div>
            </div>
          )}
          
          {/* Feedback after answering */}
          {gameState === 'answered' && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="text-center">
                <div className={`rounded-2xl p-4 mb-4 ${
                  feedback.includes('Amazing') 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30' 
                    : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30'
                }`}>
                  <p className="font-bold text-lg text-black">{feedback}</p>
                </div>
                <button
                  onClick={nextQuestion}
                  className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      <span className="text-lg">➡️</span>
                      Next Challenge
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🏁</span>
                      Finish Quest
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomMap;