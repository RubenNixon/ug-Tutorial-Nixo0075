function CourseModule({ title, description, topics = [] }) {
    return (
        <div className="module-card">
            <h2>{title}</h2>
            <p>{description}</p>
            {topics && (
                <ul className="topic-list">
                    {topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CourseModule;