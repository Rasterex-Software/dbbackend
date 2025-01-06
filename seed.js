const axios = require("axios");
const { annotation } = require("./app/models");
const { username } = require("./app/config/db.config");

const BaseUrl = "http://localhost";
const Port = 8080;
const APIRoot = `${BaseUrl}:${Port}/api/`;

const printErr = (prefix, error) => {
  let str = `${prefix} code: ${error.code}`;
  if (error.response?.data) {
    str += `, response.data: ${JSON.stringify(error.response.data)}`;
  }
  console.error(str);
};

// Create user
const createUser = async (username, password, email, displayName) => {
  try {
    // check if there is a project with given name already
    let response = await axios.get(`${APIRoot}users?username=${username}`);
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log(`User with username '${username}' already exists`);
      return;
    }

    response = await axios.post(`${APIRoot}user`, {
      username,
      password,
      email,
      displayName,
    });

    console.log(`User created: ${username}`);
    // console.log(response.data);
  } catch (error) {
    printErr("Error creating user:", error);
  }
};

// Create project
const createProject = async (name) => {
  try {
    // check if there is a project with given name already
    let response = await axios.get(`${APIRoot}projects?name=${name}`);
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log(`Project with name '${name}' already exists`);
      return;
    }

    response = await axios.post(`${APIRoot}project`, { name });
    const project = response.data;
    console.log(`Project created: id: ${project.id}, name: ${project.name}`);
  } catch (error) {
    printErr("Error creating project:", error);
  }
};

// Create Permission
const createPermission = async (key) => {
  try {
    // check if there is a permission with given key already
    let response = await axios.get(`${APIRoot}permissions?key=${key}`);
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log(`Permission item with key '${key}' already exists`);
      return;
    }

    response = await axios.post(`${APIRoot}permission`, { key });
    const permission = response.data;
    console.log(`Permission item created: id: ${permission.id}, key: ${permission.key}`);
  } catch (error) {
    printErr("Error creating permission:", error);
  }
};

// Create annotation
const createAnnotation = async (projId, data) => {
  try {
    const response = await axios.post(`${APIRoot}annotation`, {
      projId,
      data,
    });

    console.log(`Annotation created: ${data}`);
    // console.log(response.data);
  } catch (error) {
    printErr("Error creating annotation:", error);
  }
};

// Create project_user_permissions
const createProjectUserPermission = async (projId, userId, permId) => {
  try {
    const response = await axios.post(`${APIRoot}projects/${projId}/permission`, {
      userId,
      permId
    });

    console.log(`ProjectUserPermission created: ${projId}, ${userId}, ${permId}`);
    // console.log(response.data);
  } catch (error) {
    printErr("Error creating ProjectUserPermission:", error);
  }
};

const initialUsers = [
  { username: "admin", password: "123456", email: "admin@example.com", displayName: "admin" },
  { username: "user1", password: "123456", email: "user1@example.com", displayName: "user 1" },
  { username: "user2", password: "123456", email: "user2@example.com", displayName: "user 2" },
  { username: "user3", password: "123456", email: "user3@example.com", displayName: "user 3" }
];

const initialProjects = [
  { name: "Demo project" }
];

const initialPermissions = [
  { key: "Annotation.View" },
  { key: "Annotation.Add" },
  { key: "Annotation.Update" },
  { key: "Annotation.Delete" }
];

const initialAnnotations = [
  { projId: 1, data: JSON.stringify({ "message": "Test annotation 1" }) },
  { projId: 1, data: JSON.stringify({ "message": "Test annotation 2" }) },
  { projId: 1, data: JSON.stringify({ "message": "Test annotation 3" }) },
  { projId: 1, data: JSON.stringify({ "message": "Test annotation 4" }) }
];

// TODO: The userId needs to already exist in the userId table.
const initialProjectUserPermissions = [
  { projId: 1, userId: 1, permId: 1 },
  { projId: 1, userId: 2, permId: 1 },
  { projId: 1, userId: 3, permId: 1 },
  { projId: 1, userId: 3, permId: 2 }
];

const seedDatabase = async () => {
  for (const user of initialUsers) {
    await createUser(user.username, user.password, user.email, user.displayName);
  }
  for (const project of initialProjects) {
    await createProject(project.name);
  }
  for (const perm of initialPermissions) {
    await createPermission(perm.key);
  }
  for (const anno of initialAnnotations) {
    await createAnnotation(anno.projId, anno.data);
  }
  for (const perm of initialProjectUserPermissions) {
    await createProjectUserPermission(perm.projId, perm.userId, perm.permId);
  }
};
seedDatabase();
