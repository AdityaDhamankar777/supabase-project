import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native'
import { supabase } from './supabaseClient'

export default function App() {
  const [session, setSession] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchTasks()
    })
  }, [])

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setTasks(data)
  }

  async function addTask() {
    if (!newTask.trim()) return
    const { error } = await supabase
      .from('tasks')
      .insert({ task_title: newTask, user_id: session.user.id })
    if (error) console.error(error)
    else {
      setNewTask("")
      fetchTasks()
    }
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Login Required</Text>
        <Button
          title="Sign In with test@example.com"
          onPress={async () => {
            const { error } = await supabase.auth.signInWithPassword({
              email: "test@example.com",
              password: "password123"
            })
            if (error) console.error(error)
          }}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new task"
        value={newTask}
        onChangeText={setNewTask}
      />
      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.task}>{item.task_title}</Text>
        )}
      />

      <Button title="Refresh" onPress={fetchTasks} />
      <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  task: { fontSize: 18, marginVertical: 5 }
})
