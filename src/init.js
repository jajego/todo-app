// import loadHome from './pages/home';

class Item {
    constructor(project, title, description, dueDate, priority, notes) {
        this.project = project;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
    }
}

class Project {
    constructor(title) {
        this.title = title;
        this.items = [];
    }

    addItem(item) {
        return this.items.push(item);
    }

    removeItem(item) {
        return this.items.filter(listItem, () => listItem.title !== item.title)
    }

    getItem(item) {
        return this.items.find(listItem, () => listItem.title === item.title)
    }
}

const projects = [new Project('Default')];

function createItem(project, title, description, dueDate, priority, notes) {
    return new Item(project, title, description, dueDate, priority, notes)
}

function createItemCard(item) {
    let itemCard = document.createElement('div');
    itemCard.classList.add('item') 
    itemCard.classList.add(item.project.title); 
    itemCard.classList.add(item.priority); 
    itemCard.innerHTML =    `
                            <h3 class='project'>PROJECT: ${item.project}</h5>
                            <h4 class='title'>${item.title}</h3>
                            <p class='description'>Desc: ${item.description}</p>
                            <p class='dueDate'>Due: ${item.dueDate}</p>
                            <p class='priority'>Priority: ${item.priority}</p>
                            <p class='notes'>Notes: ${item.notes}</p>
                            `
    return itemCard;
}

function createProject(title) {
    let project = new Project(title);
    projects.push(project);
    
    return project;
}

function createProjectCard(project) {
    const projectCard = document.createElement('div');
    projectCard.innerHTML = `<h1 class='project-card-title'>${project.title}</h1>`;
    project.id = project.title;
    projectCard.classList.add('project-card')
    projectCard.classList.add(project.title)

    for(let i = 0; i < project.items.length; i++) {
        let itemCard = createItemCard(project.items[i]);
        projectCard.appendChild(itemCard);
    }

    return projectCard;
}

function renderProjectCards() {
    const main = document.getElementById('main');
    for(let i = 0; i < projects.length; i++) {
        let projectCard = createProjectCard(projects[i]);
        main.appendChild(projectCard);
    }
    console.log('Project cards rendered')
}

function createAppContainer() {
    const content = document.createElement('div');
    content.classList.add('content');
    content.id = 'content';

    return content;
}

function createHeader() {
    const header = document.createElement('header');
    header.classList.add('header');
    header.id = 'header';

    return header;
}

function createMain() {
    const main = document.createElement('main');
    main.classList.add('main');
    main.id = 'main';

    return main;
}

function createFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('footer');
    footer.id = 'footer';

    return footer;
}

function initTodoApp() {
    const content = document.body.appendChild(createAppContainer());

    content.appendChild(createHeader());
    content.appendChild(createMain());
    content.appendChild(createFooter());

    let newProject = createProject('dBird');
    newProject.addItem(createItem(newProject.title, 'Connect to API', 'fasdfjkhl', 'kjsdhlfa', 'asdhjkfhlfasd', 'sdjklfhafsd'));
    newProject.addItem(createItem(newProject.title, 'Implement graph.js', 'fasdfl', 'french montana', 'asdhjkfhlfasd', 'sdjklfhafsd'));
    console.log(newProject);
    renderProjectCards();
}

export default initTodoApp;