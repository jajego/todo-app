// import loadHome from './pages/home';

// TODO
// revisit js_playground!
// Make date a date input
// front end
// Remove task, complete task (2 separate inputs ? delete hidden in a ... --> edit menu?)
// In progress & complete project columns
// Complete styles
// Remove description
// Default project not saving to _projects/local storage
// Uncheck completed tasks
// New tasks should come after one another, but always before completed tasks 
//      - 2 separate attributes/ this.tasks, this.completeTask
            // however this is needlessly more complicated?

class Item {
    constructor(title, dueDate, priority, project) {
        this.title = title;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.isComplete = false;
    }
}

class Project {
    constructor(title) {
        this.title = title;
        this.items = [];
        this.isComplete = false;
    }

    addToItems(item) {
        this.items.push(item);
    }

    removeItem(item) {
        this.items.filter((listItem) => listItem.title !== item.title)
    }

    getItem(item) {
        return this.items.find((listItem) => listItem.title === item.title)
    }
}

let _projects = [new Project('Default')];

function createItem(title, dueDate, priority, project) {
    return new Item(title, dueDate, priority, project)
}

function createItemCard(item) {
    let itemCard = document.createElement('div');
    let itemCompleteBtn = document.createElement('div');
    itemCompleteBtn.innerHTML = 'O'
    itemCompleteBtn.classList.add('item-complete-btn');
    itemCompleteBtn.addEventListener('click', (e) => {
        console.log(e.target);
        completeItem(item)
        completeItemCard(e.target.parentNode)
    })
    itemCard.classList.add('item-card') 
    // itemCard.classList.add(item.priority); 
    itemCard.innerHTML =    `
                            <h4 class='item-title'>${item.title}</h3>
                            <p class='item-due-date'>Due: ${item.dueDate}</p>
                            <p class='item-priority'>Priority: ${item.priority}</p>
                            `

    if(item.isComplete){
        itemCard.classList.add('item-card-complete')
    }
    itemCard.appendChild(itemCompleteBtn);
    return itemCard;
}

function createProject(title) {
    let project = new Project(title);
    // let defaultItem = createItem('Default', 'This is a default task', 'Tomorrow', 'Soon', title)
    // project.items.push(defaultItem)
    saveLocal();
    
    return project;
}

function createProjectCard(project) {
    const projectCard = document.createElement('div');
    project.id = project.title;
    projectCard.classList.add('project-card')

    const projectCardTitle = document.createElement('h1');
    projectCardTitle.classList.add('project-card-title');
    projectCardTitle.textContent = `${project.title}`;

    const delBtn = document.createElement('div');
    delBtn.classList.add('delete-project-btn');
    delBtn.innerText = 'x';
    delBtn.addEventListener('click', (e) => {
        // could be its own removeProject function
        const indexToRemove = (_projects.findIndex((proj) => proj.title == getProject(project.title).title));
        _projects.splice(indexToRemove, 1);
        updatePage();
    })

    projectCard.appendChild(delBtn);
    projectCard.appendChild(projectCardTitle);

    for(let item of project.items){
        projectCard.appendChild(createItemCard(item));
    }
    
    return projectCard;
}

function completeProject(project) {
    return project.isComplete = true;
}

function completeProjectOnCard(e) {

}

function completeItem(itemToComplete) {
    itemToComplete.isComplete = true;
    const project = getProject(itemToComplete.project);
    const indexOfItem = project.items.findIndex(item => item.title === itemToComplete.title);
    project.items.push(project.items.splice(indexOfItem, 1)[0])

}
function completeItemCard(itemCard) {
    console.log('-------------')
    console.log(itemCard);
    itemCard.classList.add('item-card-complete')
    updatePage();
}

function createAppNav() {
    const addItemModal = document.getElementById('add-item-modal');
    const addProjectModal = document.getElementById('add-project-modal');

    const projectCardNav = document.createElement('nav');

    const addProjectBtn = document.createElement('button');
    const addItemBtn = document.createElement('button');

    addProjectBtn.classList.add('add-project-btn');
    addProjectBtn.innerHTML = 'Add project';
    addProjectBtn.addEventListener('click', () => {
        if(addProjectModal.classList.contains('opened')) {
            return false;
        } else {        
            openAddProjectModal();
        }
    })

    addItemBtn.classList.add('add-item-btn');
    addItemBtn.innerHTML = 'Add todo';
    addItemBtn.addEventListener('click', () => {
        if(addItemModal.classList.contains('opened')) {
            return false;
        } else {        
            openAddItemModal();
        }
    })

    const editProjectTitleBtn = document.createElement('button');
    editProjectTitleBtn.classList.add('edit-project-title-btn');
    editProjectTitleBtn.innerHTML = 'Change project title'
    editProjectTitleBtn.addEventListener('click', () => {
    // load project title change modal
    // include double click option
    })

    const clearLocalStorageBtn = document.createElement('button');
    clearLocalStorageBtn.classList.add('clear-local-storage-btn');
    clearLocalStorageBtn.innerHTML = 'Clear localStorage'
    clearLocalStorageBtn.addEventListener('click', () => {
        localStorage.clear();
        console.log('localStorage cleared')
    })
    
    projectCardNav.appendChild(addProjectBtn);
    projectCardNav.appendChild(addItemBtn);
    // projectCardNav.appendChild(editProjectTitleBtn);
    projectCardNav.appendChild(clearLocalStorageBtn)

    return projectCardNav;
}

function resetPage() {
    const main = document.getElementById('main');
    main.innerHTML = '';
}

function updateDropdown() {
    const dropdown = document.getElementById('selectProject');
    dropdown.innerHTML = '';
    _projects.map((project) => {
        const option = document.createElement('option');
        option.value = project.title;
        option.innerText = project.title;
        dropdown.appendChild(option);
    })
}

function createAddProjectModal() {
    const addProjectModal = document.createElement('div');
    addProjectModal.classList.add('closed');
    addProjectModal.id = 'add-project-modal';

    const addProjectForm = document.createElement('form');
    addProjectForm.id = 'add-project-form';

    const projectTitleLabel = document.createElement('label');
    projectTitleLabel.id = 'new-project-title'
    projectTitleLabel.innerText = 'Project title: '

    const projectTitleInput = document.createElement('input');
    projectTitleInput.type = 'text';
    projectTitleInput.id = 'project-title-input';
    projectTitleInput.name = 'new-project-title';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.innerText = 'Submit';

    addProjectForm.appendChild(projectTitleLabel)
    addProjectForm.appendChild(projectTitleInput)
    addProjectForm.appendChild(submitBtn);
    addProjectForm.onsubmit = addProject;

    addProjectModal.appendChild(addProjectForm);

    return addProjectModal;
}

function createAddItemModal() {
    const addItemModal    = document.createElement('div');
    addItemModal.classList.add('closed');
    addItemModal.id       = 'add-item-modal';

    const addItemForm = document.createElement('form');
    addItemForm.id    = 'add-item-form';

    const dropdownProjects = document.createElement('select');
    dropdownProjects.id = 'selectProject';
    for(let i=0; i<_projects.length; i++) {
        let project = _projects[i];
        const option = document.createElement('option');
        option.value = project.title;
        option.innerText = project.title;
        dropdownProjects.appendChild(option);
    }    

    const itemTitleLabel     = document.createElement('label');
    itemTitleLabel.id = 'itemTitle'
    itemTitleLabel.innerText = 'Title:'
    const itemTitleInput     = document.createElement('input');
    itemTitleInput.type      = 'text';
    itemTitleInput.id        = 'new-item-title';
    itemTitleInput.name      = 'itemTitle';
    
    const itemDueDateLabel     = document.createElement('label');
    itemDueDateLabel.id = 'itemDueDate'
    itemDueDateLabel.innerText = 'Due date:'
    const itemDueDateInput     = document.createElement('input');
    itemDueDateInput.type      = 'text';
    itemDueDateInput.id        = 'new-item-duedate';
    itemDueDateInput.name      = 'itemDueDate';
    
    const dropdownPriority = document.createElement('select');
    const dropdownPriorityLabel = document.createElement('label');
    dropdownPriority.id = 'selectPriority';
    dropdownPriorityLabel.id = 'selectPriorityLabel';
    dropdownPriorityLabel.innerText = 'Priority: '
    const lowPriority = document.createElement('option');
    lowPriority.value = 'Low';
    lowPriority.innerText = 'Low';
    const mediumPriority = document.createElement('option');
    mediumPriority.value = 'Medium';
    mediumPriority.innerText = 'Medium';
    const highPriority = document.createElement('option');
    highPriority.value = 'High';
    highPriority.innerText = 'High';

    dropdownPriority.appendChild(lowPriority)
    dropdownPriority.appendChild(mediumPriority)
    dropdownPriority.appendChild(highPriority)

    // const itemPriorityLabel     = document.createElement('label');
    // itemPriorityLabel.id = 'itemPriority'
    // itemPriorityLabel.innerText = 'Priority:'
    // const itemPriorityInput     = document.createElement('input');
    // itemPriorityInput.type      = 'text';
    // itemPriorityInput.id        = 'new-item-priority';
    // itemPriorityInput.name      = 'itemPriority';
    
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.id = 'item-modal-submit-btn'
    submitBtn.innerText = 'Submit'


    addItemForm.appendChild(dropdownProjects);
    addItemForm.appendChild(itemTitleLabel);
    addItemForm.appendChild(itemTitleInput);
    addItemForm.appendChild(itemDueDateLabel);
    addItemForm.appendChild(itemDueDateInput);
    addItemForm.appendChild(dropdownPriorityLabel)
    addItemForm.appendChild(dropdownPriority);
    // addItemForm.appendChild(itemPriorityLabel);
    // addItemForm.appendChild(itemPriorityInput);
    addItemForm.appendChild(submitBtn);


    addItemForm.onsubmit = addItem;
    addItemModal.appendChild(addItemForm);
    
    return addItemModal;
}

function openAddProjectModal() {
    const addProjectModal = document.getElementById('add-project-modal');
    const addProjectForm = document.getElementById('add-project-form');
    addProjectForm.reset();
    addProjectModal.classList.remove('closed');
    addProjectModal.classList.add('opened');
}

function closeAddProjectModal() {
    const addProjectModal = document.getElementById('add-project-modal');
    const addProjectForm = document.getElementById('add-project-form');
    addProjectForm.reset();
    addProjectModal.classList.remove('opened');
    addProjectModal.classList.add('closed');
}

function openAddItemModal() {
    const addItemModal = document.getElementById('add-item-modal');
    const addItemForm = document.getElementById('add-item-form');
    addItemForm.reset();
    addItemModal.classList.remove('closed');
    addItemModal.classList.add('opened');
}

function closeAddItemModal() {
    const addItemModal = document.getElementById('add-item-modal');
    const addItemForm = document.getElementById('add-item-form');
    addItemForm.reset();
    addItemModal.classList.remove('opened');
    addItemModal.classList.add('closed');
}

function processProjectFormData() {
    const title = document.getElementById('project-title-input').value;
    return createProject(title)
}

function processItemFormData() {
    const title    = document.getElementById('new-item-title').value
    const dueDate  = document.getElementById('new-item-duedate').value
    const priority = document.getElementById('selectPriority').value
    const project  = document.getElementById('selectProject').value

    return createItem(title, dueDate, priority, project)
}

function addProject(e) {
    console.log('Adding project')
    e.preventDefault();
    const newProject = processProjectFormData();
    console.log('Successfully processed project form data')
    _projects.push(newProject);

    saveLocal();
    updatePage();

    closeAddProjectModal();
}

function addItem(e) {
    e.preventDefault();
    const newItem = processItemFormData();
    console.log('Succsesfully processed item form data')
    const project = getProject(newItem.project);
    let indexOfProject = _projects.findIndex((project) => project.title == newItem.project);
    _projects[indexOfProject].items.push(newItem);

    saveLocal();
    updatePage();

    closeAddItemModal();
}

function getProject(title) {
    return _projects.find((project) => project.title === title)
}

function renderProjectCards() {
    const main = document.getElementById('main');
    main.innerHTML = '';
    let projects = _projects;

    for(let i = 0; i < projects.length; i++) {
        let projectCard = createProjectCard(projects[i]);
        main.appendChild(projectCard);
    }
    updateDropdown();
    console.log('Project cards rendered')
}

// base

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
    content.appendChild(createAddItemModal());
    content.appendChild(createAddProjectModal());

    content.appendChild(createMain());
    content.appendChild(createFooter());
    
    const header = document.getElementById('header')
    header.appendChild(createAppNav());

    restoreLocal();
}

const updatePage = () => {
    saveLocal();
    resetPage();
    renderProjectCards();
}

const saveLocal = () => {
    localStorage.setItem('savedProjects', JSON.stringify(_projects))
    console.log('saved local')
}

const restoreLocal = () => {
    const projects = JSON.parse(localStorage.getItem('savedProjects'))

    if(projects === null) {
        console.log('null boy')
        // _projects = [createProject('Default')]
        updatePage();
        return
    }
    if (projects.length > 0) {
        console.log('local restored!')
        _projects = projects;
        console.log('_projects: ' + _projects)
        updatePage(); 
    } else {
        console.log('_projects is empty. initializing....')
        // _projects = [createProject('Default')];
        updatePage();
    }
}

export default initTodoApp;