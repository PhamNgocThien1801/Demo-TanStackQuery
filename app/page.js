"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function HOME() {
    const queryClient = useQueryClient();

    const [userId, setUserId] = useState("");
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    //get
    const { data } = useQuery({
        queryKey: ['todo'],
        queryFn: async () => {
            const response = await fetch(
                'https://jsonplaceholder.typicode.com/posts'
            );
            return response.json();
        },
    });
    //Post 
    const mutation = useMutation({
        mutationFn: async (newPost) => {
            const response = await fetch(
                'https://jsonplaceholder.typicode.com/posts', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            });
            return response.json();
        },
        //work after success
        onSuccess: (newpost) => {
            // update data in cache with querry key is todo and have a call back with data is oldpost and newpost
            queryClient.setQueryData(['todo'], (oldpost) => [...oldpost,newpost])
        }
    });
    //delete
    const deleteMutation = useMutation({
        mutationFn: async (postId) => {
            await fetch(
                `https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: "DELETE",
            });
        },
        //work after success
        onSuccess: (_, postId) => {
          // update data in cache with querykey is todo and have a call back with oldPost is old data and filter for new data which is has deleted
            queryClient.setQueryData(['todo'], (oldPosts) => oldPosts.filter(post => post.id !== postId));
        }
    });
    const updateMutation = useMutation({
        mutationFn: async (updatedPost) => {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPost)
            });
            return response.json();
        },
        //work after success
        onSuccess: (updatedPost) => {
            queryClient.setQueryData(['todo'], (oldPosts) => {
                return oldPosts.map(post => post.id === updatedPost.id ? updatedPost : post);
            });
        }
    });
    //Post 
    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate({ userId, id, title, body });
    };
    //delete
    const handleDelete = (postId) => {
        deleteMutation.mutate(postId);
    };
    //update
    const handleUpdateSubmit = (event, postId, title, body) => {
        event.preventDefault();
        updateMutation.mutate({ id: postId, title, body });
    };

    if (!data) return null;
    
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input placeholder="input userid"
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input placeholder="input id"
                    onChange={(e) => setId(e.target.value)}
                />
                <input placeholder="input title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input placeholder="input body"
                    onChange={(e) => setBody(e.target.value)}
                />
                <button type="submit">submit</button>
            </form>
            <div>
                {data.map((post) => (
                    <div key={post.id}>
                        <p>ID: {post.id}</p>
                        <p>User ID: {post.userId}</p>
                        <p>Title: {post.title}</p>
                        <p>Body: {post.body}</p>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                        <form onSubmit={(e) => handleUpdateSubmit(e, post.id, title, body)}>
                            <input 
                                placeholder="Update title"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input 
                                placeholder="Update body"
                                onChange={(e) => setBody(e.target.value)}
                            />
                            <button type="submit">Update</button>
                        </form>
                    </div>
                ))}
            </div>
        </>
    );
}
