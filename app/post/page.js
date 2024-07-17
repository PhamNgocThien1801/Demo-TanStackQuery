"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Post() {
    const queryClient = useQueryClient();

    const [userId, setUserId] = useState("");
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const { data } = useQuery({
        queryKey: ['todo'],
        queryFn: async () => {
            const response = await fetch(
                'https://jsonplaceholder.typicode.com/posts'
            );
            return response.json();
        },
    });

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
        onSuccess: (newpost) => {
            queryClient.setQueryData(['todo'], (oldpost) => [...oldpost,newpost])
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate({ userId, id, title, body });
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
                    </div>
                ))}
            </div>
        </>
    );
}
