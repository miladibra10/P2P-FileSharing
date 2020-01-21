import React, {useEffect} from 'react'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PostLink from '../../components/PostLink';
import NewPost from './NewPost'
//actions
import { getAllPosts, createNewPost, createUser } from '../../../core/actions/posts'

const AdminPage = ({dispatch, posts, postsLoadStatus}) => {
    useEffect(() => {
        dispatch(createUser())
        dispatch(getAllPosts())
    }, [])

    return (
        <div>
            <div className="feed">                
                <div className="posts-list">
                    <NewPost createNewPost={createNewPost} dispatch={dispatch}/>
                    {posts.map((post, index) => (
                        <PostLink 
                            key={index} 
                            post={{
                                id: index,
                                title: post.Title,
                                description: post.Text,
                                author:{ 
                                    name: 'James'
                                },
                                date: "yesterday"
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    posts: state.posts.posts,
    postsLoadStatus: state.posts.postsLoadStatus
})

export default connect(mapStateToProps)(AdminPage)