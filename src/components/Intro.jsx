import React from "react"

export default function Intro(props) {
    
    const dropdownElements = props.categoriesData.map(category => {
        return <option
                    key={category.id}
                    value={category.name}
                >{category.name}</option>
    })
   
    
    return (
        <div className="intro-container">
            <h1 className="intro-title">Quizzical</h1>
            <p className="intro-paragraph">Answer 5 questions generated randomly from the Open Trivia Database.  Select a specific category to narrow the scope of your questions, or try your luck with questions from all categories for a real challenge! </p>
            
            <label htmlFor="categories-dropdown" id="cat-drop-label">Select Quiz Category</label>
            <select 
                id="categories-dropdown" 
                name="categories-dropdown" 
                onChange={() => props.selectCategory(event)}
            >
                <option value="All Categories" >All Categories</option>
                {dropdownElements}
            </select>
            
            <button className="btn start-btn" onClick={props.startNewQuiz}>Start Quiz</button>
        </div>
    )
}