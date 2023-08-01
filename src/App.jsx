import React from "react"
import { decode } from "html-entities"
import { nanoid } from "nanoid"
import Intro from "./components/Intro.jsx"
import Quiz from "./components/Quiz.jsx"

export default function App() {
    const [quizStarted, setQuizStarted] = React.useState(false)
    const [quizQuestions, setQuizQuestions] = React.useState([])
    const [answersChecked, setAnswersChecked] = React.useState(false)
    const [score, setScore] = React.useState(0)
    const [categoriesData, setCategoriesData] = React.useState([])
    const [selectedCategory, setSelectedCategory] = React.useState("All Categories")
    
    
    // Richard Durstenfeld's modern version of the Fisher Yates shuffle method
    function randomizeAnswers(answers) {
        let currentIndex = answers.length
        while (currentIndex !== 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1
            let temp = answers[currentIndex]
            answers[currentIndex] = answers[randomIndex]
            answers[randomIndex] = temp
        }
        return answers
    }
    
    React.useEffect(() => {
        const fetchCategoriesData = async () => {
            const response = await fetch("https://opentdb.com/api_category.php")
            const data = await response.json()
            setCategoriesData(data.trivia_categories)
            // data.trivia_categories returns an array of objects with an id and a name.
        }
        fetchCategoriesData()
    }, [])
    
    
    function selectCategory(event) {
        setSelectedCategory(event.target.value)
    }
    
    async function startNewQuiz() {
        setQuizStarted(true)
        setAnswersChecked(false)
        
        let url = `https://opentdb.com/api.php?amount=5`
        
        if (selectedCategory !== "All Categories") {
            const selectedCategoryObject = categoriesData.filter(category => {
                return category.name === selectedCategory
            })[0]
            url = `https://opentdb.com/api.php?amount=5&category=${selectedCategoryObject.id}`
        }
        
        const response = await fetch(url)
        const data = await response.json()
             
        await setQuizQuestions(data.results.map(result => {
            const correctAnswerDecoded = decode(result.correct_answer)
            const incorrectAnswersDecoded = result.incorrect_answers.map(answer => {
                return decode(answer)
            })
            
            const tempAnswers = [...incorrectAnswersDecoded]
            tempAnswers.push(correctAnswerDecoded)
            const allAnswers = tempAnswers.map(answer => {
                return {
                    value: answer,
                    id: nanoid(),
                    selected: false
                }
            })
            return {...result, 
                question: decode(result.question), 
                correct_answer: correctAnswerDecoded,
                incorrect_answers: incorrectAnswersDecoded,
                all_answers: randomizeAnswers(allAnswers),
                id: nanoid(),
                selected_answer: ""
            }  
        })) 
    }
    
    function selectAnswer(questionId, answerId) {
       setQuizQuestions(prevQuestions => {
           return prevQuestions.map(question => {
               if (question.id === questionId) {
                   let selectedAnswer = ""
                   const answersUpdated = question.all_answers.map(answer => {
                       if (answer.id === answerId) {
                           selectedAnswer = answer.value
                           return { ...answer, selected: true }
                       } else {
                           return { ...answer, selected: false }
                       }
                   })
                    return { 
                        ...question,
                        all_answers: answersUpdated,
                        selected_answer: selectedAnswer                     
                    }
               } else {
                   return { ...question }
               }
           })
       }) 
    }
    
    function checkAnswers() {
        setAnswersChecked(true)
        setScore(() => {
            return quizQuestions.filter(question => {
                return question.selected_answer === question.correct_answer
            }).length
        })
    }
    
    function resetQuiz() {
        setQuizStarted(false)
        setQuizQuestions([])
        setAnswersChecked(false)
        setScore(0)
    }
    
    return (
        <main>
            {quizStarted ? 
                <Quiz 
                    quizQuestions={quizQuestions}
                    answersChecked={answersChecked}
                    checkAnswers={checkAnswers}
                    startNewQuiz={startNewQuiz}
                    selectAnswer={selectAnswer}
                    score={score}
                    resetQuiz={resetQuiz}
                /> : 
                <Intro 
                    startNewQuiz={startNewQuiz}
                    categoriesData={categoriesData}
                    selectCategory={selectCategory}
                />
            }
            <div className="attribution">
                <p><a href="https://www.freepik.com/free-vector/white-question-mark-background-minimal-style_8162788.htm#query=background%20question&position=3&from_view=search&track=ais">Background Image by starline</a> on Freepik</p>
            </div>
        </main>
    )
}