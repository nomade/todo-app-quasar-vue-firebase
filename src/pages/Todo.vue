<template>
  <q-page class="bg-grey-3 column">
    
    <div class="row q-pa-sm bg-primary">
      <q-input
        class="col"
        bg-color="white"
        filled
        square
        @keyup.enter="addTask"
        v-model="newTask"
        placeholder="Add task"
        dense
      >
        <template v-slot:append>
          <q-btn round dense flat icon="add" @click="addTask" />
        </template>
      </q-input>
    </div>
    <q-list separator class="bg-white" bordered>
      <q-item
        v-for="task in tasks"
        :key="task.id"
        @click="updateTask(task)"
        tag="label"
        :class="{'done bg-blue-1':task.done}"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox v-model="task.done" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{task.title}}</q-item-label>
        </q-item-section>
        <q-item-section v-if="task.done" side>
          <q-btn @click.stop="deleteTask(task)" round dense color="primary" icon="delete"></q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-if="!tasks.length" class="no-tasks absolute-center">
      <q-icon
        name="check"
        size="100px"
        color="primary"
      />
      <div class="text-h5 text-primary text-center">
        No Tasks
      </div>
    </div>
  </q-page>
</template>

<script>
import firebase from "../firebaseInit";
const db = firebase.firestore();

export default {
  data() {
    return {
      user: null,
      newTask: "",
      tasks: []
    };
  },
  mounted() {
    this.readTasks();
  },
  methods: {
    readTasks() {
      db.collection("tasks")
        .get()
        .then((querySnapshot) => {
          this.tasks = [];
          querySnapshot.forEach((doc) => {
            this.tasks.push({
              id: doc.id,
              title: doc.data().title,
              done: doc.data().done,
            });
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    addTask() {
      if (this.newTask != "") {
        db.collection("tasks")
          .add({ title: this.newTask, done: false })
          .then(() => {
            console.log("Document successfully written!");
            this.readTasks();
            this.$q.notify("Added " + this.newTask);
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
          this.newTask = "";
      }
    },
    updateTask(task){
        task.done = !task.done
        db.collection("tasks")
          .doc(task.id)
          .update({
            title: task.title,
            done: task.done,
          })
          .then(() => {
            console.log("Document successfully updated!");
            this.readTasks();
          })
          .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
    },
    deleteTask(task) {
      this.$q
        .dialog({
          title: "Confirm",
          message: 'Remove "'+task.title+'"?',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
           db.collection("tasks")
          .doc(task.id)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
            this.readTasks();
            this.$q.notify("Deleted");
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
        });
    }
  }
};
</script>

<style lang="scss">
.done {
  .q-item__label {
    text-decoration: line-through;
    color: #bbb;
  }
}
.no-tasks{
  opacity: 0.5;
}
</style>>
