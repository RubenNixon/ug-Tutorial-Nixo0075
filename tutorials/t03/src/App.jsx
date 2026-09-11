import Header from './components/Header.jsx'
import CourseModule from './components/CourseModule.jsx'

function App() {

  const moduleData = [
    { 
      id: 1, 
      title: "Introduction to React & Vite", 
      description: "Scaffolding modern environments replacing older legacy bundlers.",
      topics: ["Vite Initialization", "NPM Dependencies", "Hot Module Replacement"]
    },
    { 
      id: 2, 
      title: "JSX Syntax & Rules", 
      description: "Writing HTML-like markup directly inside our JavaScript files.",
      topics: ["JSX Syntax", "Functional Components", "React Fragments"]
    },
    { 
      id: 3, 
      title: "Components & Props", 
      description: "Passing data downwards to build reusable UI elements.",
      topics: ["The Props Object", "Object Destructuring", "Array Mapping", "Virtual DOM Keys"]
    }
  ];

  return (
    <div className="app-container">
      <Header />
      <div>
        {moduleData.map((module) => (
          <CourseModule 
            key={module.id}
            title={module.title} 
            description={module.description} 
            topics={module.topics}
          />
        ))}
      </div>
    </div>
  )
}

export default App