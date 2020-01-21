import React from 'react'
import {connect} from 'react-redux'

const Post = ({post, match}) => {
    console.log(match)
    return (
        <div className="post-wrapper">
            <div className="post-header">
                <img className="post-header-image" src={post.image} alt=""/>
                <div className="post-header-info">
                    <div className="post-title">{post.title}</div>
                    <div className="post-author">
                        <div className="post-author-name">
                            John
                        </div>
                        <div className="post-author-email">
                            john@gmail.com
                        </div>
                    </div>   
                </div>
            </div>
            <div className="post-text">{post.text}</div>
            <div className="post-details">
                <div className="post-likes">{post.likes_count}</div>
                <div className="post-comments">{post.comments_count}</div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return{
        post: state.posts.posts.find(post => post.id === 1)
    }
}

export default connect(mapStateToProps)(Post);