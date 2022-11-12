import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Options from '../models/Options'
import Timer from '../models/Timer';

const QuizApp = () => {

    // 1st Ques
    const [quiz, setQuiz] = useState(null)
    // All data
    const [nextq, setNextq] = useState(null)
    // For Length
    const [len, setLen] = useState(0)
    // Index incrementer
    let [ind, setInd] = useState(0)
    // Get selected answer id
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    // Get quiz id
    const [quizId, setQuizId] = useState(null)

    const [timing, setTiming] = useState(0)

    let url = "http://localhost:8000/quiz/api/quiz-attempt/questions/?quiz_uid=13268d98-3b1c-46ec-ba43-362f9b88a33f";
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const showNext = () => {
        const token = getCookie("csrftoken");
        console.log(token);      
        if (selectedAnswer != null) {
            let payload = {
                'question_id': document.getElementById("question_id").value,
                'answer_id': selectedAnswer,
                'quiz_id': quizId,
            }

            const config = {     
                headers: { 
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Origin': '*',
                    'X-CSRFToken': token
                },
                withCredentials: true,
                crossDomain: true
            }

            var edit_url = "http://localhost:8000/quiz/api/attempt-quiz-answer/?quiz_id=" + quizId;
            var res = axios.get(edit_url, payload, config);
            console.log(res);
        }

        if (ind < len.length - 1) {
            setInd(++ind);
        }
        setQuiz(nextq[ind]);
    }

    const showPrev = () => {
        if (ind > 0) {
            setInd(--ind);
        }
        setQuiz(nextq[ind]);
    }

    async function get_quiz_questions_from_api_call() {
        const result = (await axios.get(url));
        return result;
    }

    async function app() {
        const res = await get_quiz_questions_from_api_call();
        setQuiz(res.data.data[ind]);
        setNextq(res.data.data);
        setLen(res.data.data);
        setQuizId(res.data.quiz_id);
        const time = new Date();
        time.setSeconds(time.getSeconds() + 600); // 10 minutes timer
        setTiming(time);
    }

    useEffect(() => {
        app()
        // eslint-disable-next-line
    }, [])

    if (!quiz) return null;


    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='md:p-10 flex flex-col border-2 border-gray-100 shadow-md text-center w-fit'>
                <div className='md:flex justify-around p-3 text-xl'>
                    <p>Subject - <span className='font-semibold'>Computer</span></p>
                    <p>Question : <span className='font-semibold'>{ind + 1} / {len.length}</span></p>
                    <Timer expiryTimestamp={timing}/>
                </div>
                <div>
                    <div className='p-2'>
                        <h2 className='font-bold p-3 text-3xl'>{quiz.question}</h2>
                        <input type="hidden" id="question_id" value={quiz.question_id} />
                    </div>

                    <div className='md:flex flex-wrap md:w-[40rem] p-2 justify-between'>
                        {quiz.answers.map(function (atask, i) {
                            return (
                                <div key={i} className='font-mono'>
                                    {/* <option value={atask.answer_id}>{atask.answer}</option> */}
                                    <Options setSelectedAnswer={setSelectedAnswer} name="answer_id" value_id={atask.answer_id} value={atask.answer} />
                                </div>
                            )
                        })}
                    </div>

                </div>

                <div className='flex justify-around p-3'>
                    <button onClick={showPrev} className='px-4 mx-3 py-1 bg-gray-300 rounded-sm hover:bg-gray-500 font-mono font-semibold text-sm tracking-wider hover:text-white'>Previous</button>
                    <button onClick={showNext} className='px-4 mx-3 py-1 bg-gray-300 rounded-sm hover:bg-gray-500 font-mono font-semibold text-sm tracking-wider hover:text-white'>Next</button>
                    <button className={`px-4 mx-3 py-1 rounded-sm font-mono font-semibold text-sm tracking-wider ${ind === len.length - 1 ? 'cursor-pointer bg-gray-300 hover:bg-gray-500' : 'cursor-not-allowed bg-gray-300 text-gray-400'}`}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default QuizApp