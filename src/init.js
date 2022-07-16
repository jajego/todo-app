// import loadHome from './pages/home';

// TODO
// front end
// In progress & complete project columns
// Undo completed tasks (Complete button currently just copies itself)
// Preference to send completed tasks to beginning or end or list
// Form validation
// View all tasks (sort by urgency) (no project)
// drag n drop
// buttons dont work on completed projects
// close all modals when one is clicked to open
// sidebar (App, Stats)
// Footer can have switches (mode, sorting, etc)
// Close buttons on project modal
// Add 'number of days until due'
// Disable 'add task' button when there's no projects

import {isAfter, format, getDay, parseISO} from 'date-fns';

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
        this.completedItems = [];
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

let _projects = [];
// let _completedProjects = [];

function createItem(title, dueDate, priority, project) {
    return new Item(title, dueDate, priority, project)
}

function createItemCard(item) {
    const itemCard = document.createElement('div');
    const itemContentContainer = document.createElement('div');
    const left = document.createElement('div');
    const itemCompleteBtn = document.createElement('div');
    const itemTitle = document.createElement('h4');
    const itemDueDate = document.createElement('p')
    const itemPriority = document.createElement('p')
    const right = document.createElement('div');
    const removeItemBtn = document.createElement('div');

    itemCard.classList.add('item-card')
    if(item.priority === 'Critical'){
        itemCard.classList.add('item-critical')
    }
    left.classList.add('item-card-left') 
    itemContentContainer.classList.add('item-card-content');
    itemTitle.classList.add('item-title');
    itemDueDate.classList.add('item-due-date');
    itemPriority.classList.add('item-priority');
    right.classList.add('item-card-btn-container')
    itemCompleteBtn.classList.add('item-card-btn');
    itemCompleteBtn.classList.add('item-complete-btn');
    removeItemBtn.classList.add('item-remove-btn');
    removeItemBtn.classList.add('item-card-btn');

    itemCompleteBtn.addEventListener('click', () => {
        completeItem(item)
        itemCard.classList.add('item-card-complete')
    })

    removeItemBtn.addEventListener('click', () => {
        removeItem(item);
    });

    itemTitle.textContent = item.title;
    itemDueDate.textContent = `Due: ${item.dueDate}`;
    itemPriority.textContent = `Priority: ${item.priority}`;
    

    if(item.isComplete){
        itemCard.classList.add('item-card-complete')
    }
    
    left.appendChild(itemCompleteBtn);
    left.appendChild(itemContentContainer);
    right.appendChild(removeItemBtn);
    itemContentContainer.appendChild(itemTitle);
    itemContentContainer.appendChild(itemDueDate);
    itemContentContainer.appendChild(itemPriority);
    itemCard.appendChild(left);
    itemCard.appendChild(right);

    return itemCard;
}

function createProject(title) {
    let project = new Project(title);
    // let defaultItem = createItem('Default', 'This is a default task', 'Tomorrow', 'Soon', title)
    // project.items.push(defaultItem)
    updatePage();
    
    return project;
}

function createProjectCard(project) {
    const projectCard = document.createElement('div');
    const projectCardHeader = document.createElement('div');
    const btnContainer = document.createElement('div');
    const itemCardContainer = document.createElement('div');

    projectCard.id = `project-${project.title}`;
    projectCard.classList.add('project-card');
    if(project.isComplete){
        projectCard.classList.add('project-card-complete')
    }
    projectCardHeader.classList.add('project-card-header')
    btnContainer.classList.add('project-card-btn-container');
    itemCardContainer.classList.add('project-item-card-container');

    const addItemBtn = document.createElement('button');
    addItemBtn.classList.add('project-card-add-item-btn');
    addItemBtn.textContent = '+';
    addItemBtn.addEventListener('click', () => {
        openAddItemModal();
    })
    const projectCardTitle = document.createElement('h1');
    projectCardTitle.classList.add('project-card-title');
    projectCardTitle.textContent = `${project.title}`;

    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-project-button');
    completeBtn.innerText = 'O';
    completeBtn.addEventListener('click', () => {
        completeProject(project);
    })

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete-project-btn');
    delBtn.innerText = 'X';
    delBtn.addEventListener('click', (e) => {
        // could be its own removeProject function
        removeProject(project);
        updatePage();
    })
   

    btnContainer.appendChild(completeBtn);
    btnContainer.appendChild(delBtn);
    projectCardHeader.appendChild(projectCardTitle);
    // projectCardHeader.appendChild(addItemBtn)
    projectCardHeader.appendChild(btnContainer);
    projectCard.appendChild(projectCardHeader);

    for(let item of project.items){
        itemCardContainer.appendChild(createItemCard(item));
    }
    for(let item of project.completedItems){
        itemCardContainer.appendChild(createItemCard(item));
    }
    projectCard.appendChild(itemCardContainer);
    
    return projectCard;
}

function completeProject(projectToComplete) {
    if(projectToComplete.isComplete){
        return console.log('Project is already complete')
    } else {
        projectToComplete.isComplete = true;
        for(let item of projectToComplete.items){
            completeItem(item);
        }
        updatePage();
    }
}

function completeItem(itemToComplete) {
    itemToComplete.isComplete = true;    
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
    addItemBtn.innerHTML = 'Add task';
    addItemBtn.addEventListener('click', () => {
        if(_projects.every(proj => (proj.isComplete)) || _projects == null){
            console.log('_projects is empty or null')
            return false;
        }
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
        if(!project.isComplete){
            const option = document.createElement('option');
            option.value = project.title;
            option.innerText = project.title;
            dropdown.appendChild(option);
        }
    })
}

function createAddProjectModal() {
    const addProjectModal = document.createElement('div');
    addProjectModal.classList.add('closed');
    addProjectModal.classList.add('modal');
    addProjectModal.id = 'add-project-modal';

    const addProjectForm = document.createElement('form');
    addProjectForm.id = 'add-project-form';

    const projectTitleLabel = document.createElement('label');
    projectTitleLabel.id = 'new-project-title'
    projectTitleLabel.innerText = 'Title:'

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
    addItemModal.classList.add('modal');
    addItemModal.id       = 'add-item-modal';

    const modalLabel = document.createElement('h3');
    modalLabel.classList.add('modal-label');
    modalLabel.id = 'item-modal-label';
    modalLabel.textContent = 'New task';

    const closeModalBtn = document.createElement('div');
    closeModalBtn.classList.add('modal-close-btn');
    closeModalBtn.addEventListener('click', closeAddItemModal);

    const addItemForm = document.createElement('form');
    addItemForm.id    = 'add-item-form';

    const dropdownProjects = document.createElement('select');
    const dropdownProjectsLabel = document.createElement('label');
    dropdownProjectsLabel.innerText = 'Project: '
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
    itemDueDateInput.type      = 'date';
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
    const critPriority = document.createElement('option');
    critPriority.value = 'Critical';
    critPriority.innerText = 'Critical';

    dropdownPriority.appendChild(lowPriority)
    dropdownPriority.appendChild(mediumPriority)
    dropdownPriority.appendChild(highPriority)
    dropdownPriority.appendChild(critPriority)
    
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.id = 'item-modal-submit-btn'
    submitBtn.innerText = 'Submit'

    addItemForm.appendChild(dropdownProjectsLabel)
    addItemForm.appendChild(dropdownProjects);
    addItemForm.appendChild(itemTitleLabel);
    addItemForm.appendChild(itemTitleInput);
    addItemForm.appendChild(itemDueDateLabel);
    addItemForm.appendChild(itemDueDateInput);
    addItemForm.appendChild(dropdownPriorityLabel)
    addItemForm.appendChild(dropdownPriority);
    addItemForm.appendChild(submitBtn);


    addItemForm.onsubmit = addItem;
    addItemModal.appendChild(modalLabel)
    addItemModal.appendChild(closeModalBtn)
    addItemModal.appendChild(addItemForm);
    
    return addItemModal;
}

function openAddProjectModal() {
    closeAllModals();
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
    closeAllModals();
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

function closeAllModals() {
    const addItemModal = document.getElementById('add-item-modal');
    const addProjectModal = document.getElementById('add-project-modal');
    addItemModal.classList.remove('opened')
    addProjectModal.classList.remove('opened')
    addItemModal.classList.add('closed')
    addProjectModal.classList.add('closed')
}

function resetForms() {
    const addItemForm = document.getElementById('add-item-form');
    const addProjectForm = document.getElementById('add-project-form');

    addItemForm.reset();
    addProjectForm.reset();
}

function processProjectFormData() {
    const title = document.getElementById('project-title-input').value;
    return createProject(title)
}

function processItemFormData() {
    const title    = document.getElementById('new-item-title').value
    let dueDate  = document.getElementById('new-item-duedate').value
    if(dueDate){
        dueDate = format(parseISO(dueDate), ('eee, ' + 'MMM ' + 'dd, ' + 'yyyy'));
    }
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
    resetForms();
    updatePage();

    // closeAddItemModal();
}

function removeProject(projectToRemove) {
    _projects = _projects.filter(proj => proj.title !== projectToRemove.title)   
}

function removeItem(itemToRemove) {
    const project = getProject(itemToRemove.project);
    console.log('project is: ' + project)
    if(itemToRemove.isComplete){
        console.log('Removing completed task')
        project.completedItems = project.completedItems.filter((item) => item.title !== itemToRemove.title);
    } else {
        project.items = project.items.filter((item) => item.title !== itemToRemove.title);
    }
    
    updatePage();
}

function getProject(title) {
    return _projects.find((project) => project.title === title);
}

function sortItems() {
    for(let project of _projects){
        for(let item of project.items){
            if(item.priority == 'Critical'){
                const indexOfItem = project.items.findIndex((task) => task.title === item.title);
                project.items.unshift(project.items.splice(indexOfItem, 1)[0]);
            }
            if(item.isComplete){
                const indexOfItem = project.items.findIndex((task) => task.title === item.title);
                project.items.push(project.items.splice(indexOfItem, 1)[0])
            }
        }
    }
}

function sortProjects() {
    for(let i = 0; i < _projects.length; i++){
        if(_projects[i].isComplete){
            _projects.push(_projects.splice(i, 1)[0])
        }
    }
}

function renderProjectCards() {
    const main = document.getElementById('main');
    main.innerHTML = '';
    // let projects = _projects;
    // let completedProjects = _completedProjects;
    if(_projects === null){
        _projects = [];
    }

    if(_projects.length == 0){
        const placeholder = document.createElement('div');
        placeholder.classList.add('projects-placeholder')
        const placeholderText = document.createElement('p');
        placeholderText.classList.add('projects-placeholder-text')
        placeholderText.innerHTML = `<p>Your projects will go here!</p>
                                     <p>Click <b>"Add project"</b> to get started.</p>'`
        placeholder.appendChild(placeholderText);
        main.appendChild(placeholder);
    }

    for(let project of _projects){
        let projectCard = createProjectCard(project);        
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
    main.addEventListener('click', closeAllModals);

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
    console.log('date date')
    console.log(isAfter(new Date(1995, 11, 17), new Date(1997, 10, 5)))
    restoreLocal();
}

const updatePage = () => {
    saveLocal();
    sortProjects();
    sortItems();

    resetPage();
    renderProjectCards();
}

const saveLocal = () => {
    localStorage.setItem('savedProjects', JSON.stringify(_projects))
    console.log('saved local')
}

const restoreLocal = () => {
    const projects = JSON.parse(localStorage.getItem('savedProjects'))
    const completedProjects = JSON.parse(localStorage.getItem('savedCompletedProjects'))
    if(projects){
        _projects = projects;
    } else {
        _projects = [];
    }
    updatePage();
    
}

export default initTodoApp;