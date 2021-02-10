import React, { useRef } from "react";
import { useMutation, useQueryCache } from "react-query";

const createTodo = (fields) => {
  const url = "http://localhost:3001/todo";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
};

const AddTodo = () => {
  const inputRef = useRef();
  const queryCache = useQueryCache();

  const [mutateAdd] = useMutation(createTodo, {
    onSuccess: () => queryCache.invalidateQueries("todos"),
  });

  const onAdd = () => {
    mutateAdd({ text: inputRef.current.value });
    inputRef.current.value = "";
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={onAdd}>Add ToDo</button>
      <hr />
    </>
  );
};

export default AddTodo;
