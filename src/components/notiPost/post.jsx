import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "../post/Post";
import { StateContext } from "../../context/state";

const NPost = () => {
  const state = useContext(StateContext);
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Find the post with the specified postId and set it to the state
    const foundPost = state.posts.find((p) => p.id === parseInt(postId));
    if (foundPost) {
      setPost(foundPost);
    }
  }, [postId, state.posts]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="posts">
      <Post post={post} key={post.id} />
    </div>
  );
};

export default NPost;
