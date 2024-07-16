"use client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useQuery({
    queryKey: ['todo'],
    queryFn: async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos'
      );
      return response.json();
    },
  });

  if (!data) return null;

  return (
    <div>
      {data.map((todo) => (
        <div>
          <p>User ID: {todo.userId}</p>
          <p>Title: {todo.title}</p>
          <p>{todo.completed ? 'Completed' : 'Not Completed'}</p>
        </div>
      ))}
    </div>
  );
}
