import React, {useState} from 'react'

const NewPost = ({createNewPost, dispatch}) => {
    const [post, setPost] = useState({title: '', text: ''})
    
    const handleChange = e => {
        const { name, value} = e.target
        setPost((pervState) => ({
            title: name === 'title' ? value : pervState.title,
            text: name === 'text' ? value : pervState.text
        }))
    }

    const handleSubmit = () => {
        dispatch(createNewPost({
            ID: 1,
            Title: post.title,
            Text: post.text,
            Likes: 0,
            AuthorID: 1,
        }, 1))
    }

    return (
        <div className="new-post-form">
            <input 
                value={post.title}
                onChange={handleChange}
                name="title"
                placeholder="new post title"
                className="new-post-title"
            />
            <textarea
                value={post.text}
                onChange={handleChange}
                name="text"
                placeholder="new post text ....."
                className="new-post-text"
            />
            <button onClick={handleSubmit} className="new-post-submit">post it</button>
        </div>
    )
}

export default NewPost;