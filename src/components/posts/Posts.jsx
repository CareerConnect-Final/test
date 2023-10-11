import Post from "../post/Post";
import "./posts.scss";
import { useContext } from "react";
import  {StateContext}  from "../../context/state";
// import { useContext, useEffect ,useState} from "react";


const Posts = () => {




  const state=useContext(StateContext)

  return     <div className="posts">
  {/* Ensure that state.posts is an array before using .map */}
  {Array.isArray(state.posts) &&
    state.posts.map((post) => (
      <Post post={post} key={post.id} />
    ))}
</div>
};

export default Posts;



// import Post from "../post/Post";
// import "./posts.scss";
// import { useContext } from "react";
// import { StateContext } from "../../context/state";
// import cookie from "react-cookies";

// const Posts = () => {
//   const user = cookie.load("user");
//   const state = useContext(StateContext);

//   return (
//     <div className="posts">
//       {user.role === "user" ? (
//         state.posts.map((post) => (
//           <Post post={post} key={post.id} />
//         ))
//       ) : (
//         state.companyPosts.map((post) => (
//           <Post post={post} key={post.id} />
//         ))
//       )}
//     </div>
//   );
// };

// export default Posts;