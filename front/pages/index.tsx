'use client'

import { useEffect, useState } from "react";
import url from "../url"
import { Grid, Paper, Typography, Card, CardContent, TextField, Button } from "@mui/material";

export default function Home() {
  const [list, setList] = useState<List>({ todo: [], inprogress: [], done: [] })
  const [newTask, setNewTask] = useState<{ [key: string]: string }>({ todo: "", inprogress: "", done: "" });

  useEffect(() => {
    fetch(url + 'todo')
      .then(e => e.json())
      .then(e => {
        let r: List = { todo: [], inprogress: [], done: [] }
        e.forEach((elem: content) => {
          if (elem.state === 'todo') r[elem.state].push(elem)
          if (elem.state === 'inprogress') r[elem.state].push(elem)
          if (elem.state === 'done') r[elem.state].push(elem)
        });
        setList(r)
      })
  }, [])


  function handleInputChange(col: string, input: string) { setNewTask({ ...newTask, [col]: input }) }
  function handleAddTask(col: string) {
    fetch(url + 'todo', { method: 'POST', body: JSON.stringify({ state: col, name: newTask[col] }) })
      .then(() => {
        let co: Array<content> = [];
        if (col === 'todo') co = list['todo']
        if (col === 'inprogress') co = list['inprogress']
        if (col === 'done') co = list['done']
        co.push({ state: col, name: newTask[col], date: Date.now() })
        setList({ ...list, [col]: co })
        setNewTask({ ...newTask, [col]: '' })
      })
  }





  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {/* Todo Column */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h5" align="center">To Do</Typography>
            {list.todo.map((item, index) => (
              <TaskCard key={index} content={item} />
            ))}
            <TextField
              label="New Task"
              fullWidth
              value={newTask.todo}
              onChange={(e) => handleInputChange("todo", e.target.value)}
              style={{ marginTop: "16px" }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleAddTask("todo")}
              style={{ marginTop: "8px" }}
            >
              Add Task
            </Button>
          </Paper>
        </Grid>

        {/* In Progress Column */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h5" align="center">In Progress</Typography>
            {list.inprogress.map((item, index) => (
              <TaskCard key={index} content={item} />
            ))}
            <TextField
              label="New Task"
              fullWidth
              value={newTask.inprogress}
              onChange={(e) => handleInputChange("inprogress", e.target.value)}
              style={{ marginTop: "16px" }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleAddTask("inprogress")}
              style={{ marginTop: "8px" }}
            >
              Add Task
            </Button>
          </Paper>
        </Grid>

        {/* Done Column */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h5" align="center">Done</Typography>
            {list.done.map((item, index) => (
              <TaskCard key={index} content={item} />
            ))}
            <TextField
              label="New Task"
              fullWidth
              value={newTask.done}
              onChange={(e) => handleInputChange("done", e.target.value)}
              style={{ marginTop: "16px" }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleAddTask("done")}
              style={{ marginTop: "8px" }}
            >
              Add Task
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

function TaskCard({ content }: { content: content }) {
  return (
    <Card style={{ margin: "8px 0" }}>
      <CardContent>
        <Typography variant="h6">{content.name}</Typography>
        <Typography color="textSecondary">Date: {new Date(content.date).toLocaleString()}</Typography>
      </CardContent>
    </Card>
  );
}

interface List {
  todo: Array<content>
  inprogress: Array<content>
  done: Array<content>
}
interface content {
  "name": string
  "date": number
  "state": string
}